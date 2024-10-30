import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessList } from 'src/entities/accessList.entity';
import {
  ClearAccess,
  CreateAccess,
  AddParentFolderAccess,
} from 'src/types/access.type';
import { Ok } from 'src/system/system.graphql.entity';
import { Access } from './access.graphql.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessList)
    private accessRepository: Repository<AccessList>,
  ) {}

  async createAccess(args: CreateAccess): Promise<Access> {
    return this.accessRepository.save(args);
  }

  async addAccessFromParentFolder(args: AddParentFolderAccess): Promise<void> {
    const { parentFolderId, ...accessArgs } = args;
    const parentFolderAccess = await this.accessRepository.find({
      where: { folderId: parentFolderId },
    });

    await this.accessRepository.save(
      parentFolderAccess.map(({ userId, accessType }) => ({
        userId,
        accessType,
        ...accessArgs,
      })),
    );
  }

  async clearAccess(args: ClearAccess): Promise<Ok> {
    const [{ affected }] = (await Promise.all([
      this.accessRepository.delete({ ...args, parentAccessFolderId: null }),
      args.folderId
        ? this.accessRepository.delete({
            parentAccessFolderId: args.folderId,
          })
        : Promise.resolve(),
    ])) || [{}];
    return { ok: !!affected };
  }
}
