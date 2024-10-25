import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-minimal';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import {
  loadFileType,
  uploadFileType,
  cloneFileType,
  updateFileType,
  deleteFileType,
} from '../../types/file.type';
import { join, dirname } from 'path';
import { access, rename, unlink, copyFile } from 'fs/promises';
import { Ok } from 'src/system/system.graphql.entity';
import { isValidFolderOrFileName } from '../../utils/nameValidation';
import { FolderService } from '../folders/folder.service';
import { createWriteStream, createReadStream, ReadStream } from 'fs';

const storagePath = join(__dirname, '..', '..', 'storage');

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(forwardRef(() => FolderService))
    private folderService: FolderService,
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
    });
  }

  findOneById(id: number): Promise<File | null> {
    return this.findOneBy({ id });
  }

  async load(args: loadFileType): Promise<ReadStream> {
    const { id } = args;
    const absolutePath = await this.getAbsolutePathById(id);

    try {
      await access(absolutePath);
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to access file: ${Err}`);
    }

    return createReadStream(absolutePath);
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

    return this.fileRepository.save({
      ...args,
      path,
      userId,
    });
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

    return this.fileRepository.save({
      name,
      folderId,
      userId,
      path: copyFilePath,
    });
  }

  async update(args: updateFileType): Promise<File | null> {
    const { id } = args;
    const file = await this.findOneById(id);
    if (args.name) {
      const absolutePath = await this.getAbsolutePathById(id);
      try {
        await access(absolutePath);
        await rename(absolutePath, join(dirname(absolutePath), args.name));
      } catch (Err) {
        throw new InternalServerErrorException(`Unable to rename file: ${Err}`);
      }
    }

    return this.fileRepository.save({ ...file, ...args });
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
