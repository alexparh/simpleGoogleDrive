import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-minimal';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { File } from '../../entities/file.entity';
import {
  loadFileType,
  uploadFileType,
  cloneFileType,
  updateFileType,
  deleteFileType,
  TempFileIformation,
} from '../../types/file.type';
import { join, dirname, extname, basename } from 'path';
import { access, rename, unlink, copyFile } from 'fs/promises';
import { Ok } from 'src/system/system.graphql.entity';
import { isValidFolderOrFileName } from '../../utils/nameValidation';
import { FolderService } from '../folders/folder.service';
import { createWriteStream } from 'fs';
import { AccessService } from '../access/access.service';
import { UsersService } from '../users/users.service';
import config from '../../config';

const {
  file: { tempFileExpiresIn },
  storage: { storageFolder, tempFolder },
  system: { host },
} = config();

const storagePath = join(__dirname, '..', '..', '..', storageFolder);
const tempPath = join(__dirname, '..', '..', '..', tempFolder);

const relations = ['accessList'];

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(forwardRef(() => FolderService))
    private folderService: FolderService,
    @Inject(AccessService)
    private accessService: AccessService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  getRepository(): Repository<File> {
    return this.fileRepository;
  }

  async getAbsolutePathById(id: number) {
    const { path } = await this.findOneById(id);
    return join(storagePath, path);
  }

  async findOneBy(where: any): Promise<File | null> {
    return this.fileRepository.findOne({
      where,
      relations,
    });
  }

  async findOneById(id: number): Promise<File | null> {
    return this.findOneBy({ id });
  }

  async addToPublicStorage(path: string): Promise<TempFileIformation> {
    const absoluteFilePath = join(storagePath, path);
    const hash = randomBytes(16).toString('hex');
    const fileExtension = extname(absoluteFilePath);
    const tempFileName = `${hash}${fileExtension}`;
    const tempFilePath = join(tempPath, tempFileName);

    try {
      await access(absoluteFilePath);
      await copyFile(absoluteFilePath, tempFilePath);
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to load file: ${Err}`);
    }

    return { tempFilePath, tempFileName };
  }

  async load(args: loadFileType): Promise<string> {
    const { id } = args;

    const { path, publicUrl } = await this.findOneById(id);
    if (publicUrl) return publicUrl;

    const { tempFilePath, tempFileName } = await this.addToPublicStorage(path);
    setTimeout(async () => {
      try {
        await unlink(tempFilePath);
      } catch (err) {
        this.logger.log(`Failed to delete temp file: ${tempFilePath}`, err);
      }
    }, tempFileExpiresIn);

    return `${host}/${tempFolder}/${tempFileName}`;
  }

  async upload(
    {
      createReadStream: readStreamFunction,
      filename: name,
      mimetype,
    }: FileUpload,
    args: uploadFileType,
    userId: number,
  ): Promise<File> {
    const { folderId } = args;
    if (!isValidFolderOrFileName(name)) {
      throw new BadRequestException('Invalid folder name');
    }

    const { path: folderPath } = await this.folderService.findOneById(folderId);
    const path = join(folderPath, name);
    const fileStream = createWriteStream(join(storagePath, path));

    try {
      await new Promise((resolve, reject) => {
        readStreamFunction()
          .pipe(fileStream)
          .on('finish', resolve)
          .on('error', reject);
      });
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to upload file: ${Err}`);
    }

    const newFile = await this.fileRepository.save({
      ...args,
      path,
      userId,
    });

    await this.accessService.addAccessFromParentFolder({
      parentFolderId: folderId,
      fileId: newFile.id,
    });

    return newFile;
  }

  async copy(args: cloneFileType, userId: number): Promise<File> {
    const { id, folderId } = args;
    const { path, name } = await this.findOneById(id);
    const fileAbsolutePath = join(storagePath, path);

    const { path: folderPath } = await this.folderService.findOneById(folderId);
    const copyFilePath = join(folderPath, `${name}_copy`);

    try {
      await access(fileAbsolutePath);
      await copyFile(join(storagePath, path), join(storagePath, copyFilePath));
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to copy file: ${Err}`);
    }

    const newFileCopy = await this.fileRepository.save({
      name,
      folderId,
      userId,
      path: copyFilePath,
    });

    await this.accessService.addAccessFromParentFolder({
      parentFolderId: folderId,
      fileId: newFileCopy.id,
    });

    return newFileCopy;
  }

  async update(args: updateFileType): Promise<File | null> {
    const file = await this.findOneById(args.id);
    if (!file) return null;
    const { accessList, isPublic, ...fileArgs } = args;
    const { id, name } = fileArgs;

    if (name) {
      const absolutePath = await this.getAbsolutePathById(id);
      try {
        await access(absolutePath);
        await rename(absolutePath, join(dirname(absolutePath), name));
      } catch (Err) {
        throw new InternalServerErrorException(`Unable to rename file: ${Err}`);
      }
    }

    if (isPublic !== null) {
      // set public
      if (isPublic && !file.publicUrl) {
        const { tempFileName } = await this.addToPublicStorage(file.path);

        fileArgs['publicHash'] = tempFileName;
      }

      // set private
      if (!isPublic && file.publicUrl) {
        const pulicFilePath = join(tempPath, basename(file.publicUrl));
        try {
          await unlink(pulicFilePath);
        } catch (Err) {
          throw new InternalServerErrorException(
            `Unable to set file view to private: ${Err}`,
          );
        }

        fileArgs['publicHash'] = null;
      }
    }

    await this.fileRepository.update({ id }, fileArgs);

    if (accessList) {
      await this.accessService.clearAccess({ fielId: id });

      const mappedAccessList =
        await this.userService.createNewUsersFromAccessList(accessList);

      await Promise.all(
        mappedAccessList.map((el) =>
          this.accessService.createAccess({
            fileId: id,
            ...el,
          }),
        ),
      );
    }

    return this.findOneById(id);
  }

  async delete(args: deleteFileType): Promise<Ok> {
    const { id } = args;
    const absolutePath = await this.getAbsolutePathById(id);
    try {
      await access(absolutePath);
      await unlink(absolutePath);
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to delete file: ${Err}`);
    }

    const { affected } = (await this.fileRepository.delete(id)) || {};
    return { ok: !!affected };
  }
}
