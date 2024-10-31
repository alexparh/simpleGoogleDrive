import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from 'src/entities/folder.entity';
import {
  createFolderType,
  cloneFolderType,
  updateFolderType,
  deleteFolderType,
  setFolderAccesss,
} from '../../types/folder.type';
import { join, dirname } from 'path';
import { access, mkdir, rename, rm, cp } from 'fs/promises';
import { Ok } from 'src/system/system.graphql.entity';
import { isValidFolderOrFileName } from '../../utils/nameValidation';
import { FileService } from '../files/file.service';
import { AccessService } from '../access/access.service';
import { UsersService } from '../users/users.service';
import config from '../../config';

const {
  storage: { storageFolder },
} = config();

const storagePath = join(process.cwd(), storageFolder);

const relations = ['subfolders', 'files', 'accessList'];

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @Inject(forwardRef(() => FileService))
    private fileService: FileService,
    @Inject(AccessService)
    private accessService: AccessService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  getRepository(): Repository<Folder> {
    return this.folderRepository;
  }

  async getAbsolutePathById(id: number) {
    const { path } = await this.findOneById(id);
    return join(storagePath, path);
  }

  async findOneBy(where: any): Promise<Folder | null> {
    return this.folderRepository.findOne({
      where,
      relations,
    });
  }

  findOneById(id: number): Promise<Folder | null> {
    return this.findOneBy({ id });
  }

  async create(args: createFolderType, userId: number): Promise<Folder> {
    const { name, parentFolderId } = args;
    if (!isValidFolderOrFileName(name)) {
      throw new BadRequestException('Invalid folder name');
    }

    const { path: parentFolderPath } = await this.findOneById(parentFolderId);
    const path = join(parentFolderPath, name);
    const absolutePath = join(storagePath, path);
    try {
      await mkdir(absolutePath);
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to create folder: ${Err}`);
    }

    const newFolder = await this.folderRepository.save({
      ...args,
      path,
      userId,
    });

    await this.accessService.addAccessFromParentFolder({
      parentFolderId,
      folderId: newFolder.id,
    });

    return newFolder;
  }

  async createRootUserFolder(userId: number): Promise<Folder> {
    const userRootFolderPath = join(storagePath, `${userId}`);

    try {
      await mkdir(userRootFolderPath);
    } catch (Err) {
      throw new InternalServerErrorException(
        `Unable to create user root folder: ${Err}`,
      );
    }

    return this.folderRepository.save({
      name: `${userId}`,
      userId,
      path: `/${userId}`,
    });
  }

  async copy(args: cloneFolderType, userId: number, isRoot?: boolean) {
    const { id, parentFolderId } = args;
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations,
    });

    const newFolder = await this.create(
      { name: isRoot ? folder.name + '_copy' : folder.name, parentFolderId },
      userId,
    );

    await Promise.all([
      ...folder.files.map(({ id }) =>
        this.fileService.copy({ id, folderId: newFolder.id }, userId),
      ),
      ...folder.subfolders.map(({ id }) =>
        this.copy({ id, parentFolderId: newFolder.id }, userId),
      ),
    ]);

    return newFolder;
  }

  async setFolderAccesss(args: setFolderAccesss) {
    const { folderId, isRoot, ...folderAccessArgs } = args;
    const folder = await this.findOneById(folderId);

    await this.accessService.createAccess({
      folderId: folder.id,
      ...folderAccessArgs,
      parentAccessFolderId: isRoot ? null : args.parentAccessFolderId,
    });

    await Promise.all([
      ...folder.files.map(({ id }) =>
        this.accessService.createAccess({
          fileId: id,
          ...folderAccessArgs,
        }),
      ),
      ...folder.subfolders.map(({ id }) =>
        this.setFolderAccesss({
          folderId: id,
          ...folderAccessArgs,
        }),
      ),
    ]);
  }

  async update(args: updateFolderType): Promise<Folder | null> {
    const folder = await this.findOneById(args.id);
    if (!folder) return null;

    const { accessList, ...folderArgs } = args;
    const { id, name } = folderArgs;

    if (name) {
      const absolutePath = join(storagePath, folder.path);
      try {
        await access(absolutePath);
        await rename(absolutePath, join(dirname(absolutePath), args.name));
      } catch (Err) {
        throw new InternalServerErrorException(
          `Unable to rename fodler: ${Err}`,
        );
      }

      folderArgs['path'] = join(dirname(folder.path), name);
    }

    await this.folderRepository.update({ id }, folderArgs);

    if (accessList) {
      await this.accessService.clearAccess({ folderId: id });

      const mappedAccessList =
        await this.userService.createNewUsersFromAccessList(accessList);

      await Promise.all(
        mappedAccessList.map((el) =>
          this.setFolderAccesss({
            isRoot: true,
            folderId: id,
            parentAccessFolderId: id,
            ...el,
          }),
        ),
      );
    }

    return this.findOneById(id);
  }

  async delete(args: deleteFolderType): Promise<Ok> {
    const { id } = args;
    const absolutePath = await this.getAbsolutePathById(id);
    try {
      await access(absolutePath);
      await rm(absolutePath, { recursive: true });
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to delete folder: ${Err}`);
    }

    const { affected } = (await this.folderRepository.delete(id)) || {};
    return { ok: !!affected };
  }
}
