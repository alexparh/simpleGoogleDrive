import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessList } from 'src/entities/accessList.entity';
import { ClearAccess, CreateAccess } from 'src/types/access.type';
import { Ok } from 'src/system/system.graphql.entity';
import { Access } from './access.graphql.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessList)
    private accessRepository: Repository<AccessList>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async createAccess(args: CreateAccess): Promise<Access> {
    const { email } = args;
    let user = await this.userService.findOneByEmail(email);
    if (!user) {
      user = await this.userService.create(email);
    }

    return this.accessRepository.save({ userId: user.id, ...args });
  }

  async clearAccess(args: ClearAccess): Promise<Ok> {
    const { affected } = (await this.accessRepository.delete(args)) || {};
    return { ok: !!affected };
  }
}