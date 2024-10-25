import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWithTokenType } from '../../types/user.type';
import { AuthService } from '../auth/auth.service';
import { RefreshToken } from './user.graphql.entity';
import { User } from '../../entities/user.entity';
import { FolderService } from '../folders/folder.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => FolderService))
    private folderService: FolderService,
  ) {}

  getRepository(): Repository<User> {
    return this.userRepository;
  }

  async findOneBy(where: object): Promise<User | null> {
    return this.userRepository.findOne({ where });
  }

  findOneById(id: number): Promise<User | null> {
    return this.findOneBy({ id });
  }

  findOneByEmail(email: string | undefined): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async create(email: string): Promise<User> {
    const { id } = await this.userRepository.save({ email });
    const { id: rootFolderId } =
      await this.folderService.createRootUserFolder(id);
    return this.userRepository.save({ id, rootFolderId });
  }

  private async _loginByUser(user: User | null) {
    if (!user) throw new UnauthorizedException('User unauthorized');

    const tokens = await this.authService.login(user);
    return { ...user, ...tokens };
  }

  async updateRefresh(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }

  async refresh(args: RefreshToken): Promise<UserWithTokenType> {
    const user = await this.findOneBy({ refreshToken: args.refreshToken });
    return this._loginByUser(user);
  }
}
