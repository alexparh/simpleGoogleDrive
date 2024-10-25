import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Folder } from 'src/entities/folder.entity';
import {
  createFolderType,
  cloneFolderType,
  updateFolderType,
  deleteFolderType,
} from '../../types/folder.type';
import { join, dirname } from 'path';
import { access, mkdir, rename, rm, cp } from 'fs/promises';
import { Ok } from 'src/system/system.graphql.entity';
import { isValidFolderOrFileName } from '../../utils/nameValidation';
import { FileService } from '../files/file.service';

const storagePath = join(__dirname, '..', '..', 'storage');
const relations = ['subfolders', 'files'];

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @Inject(forwardRef(() => FileService))
    private fileService: FileService,
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

    return this.folderRepository.save({
      ...args,
      path,
      userId,
    });
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

    for (const { id } of folder.files) {
      this.fileService.copy({ id, folderId: newFolder.id }, userId);
    }

    for (const subfolder of folder.subfolders) {
      await this.copy(
        { id: subfolder.id, parentFolderId: newFolder.id },
        userId,
      );
    }

    return newFolder;
  }

  async rename(args: updateFolderType): Promise<Folder | null> {
    const { id, name } = args;
    const absolutePath = await this.getAbsolutePathById(id);
    try {
      await access(absolutePath);
      await rename(absolutePath, join(dirname(absolutePath), name));
    } catch (Err) {
      throw new InternalServerErrorException(`Unable to rename folder: ${Err}`);
    }

    await this.folderRepository.update({ id }, { name });
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