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
import { Users } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  getRepository(): Repository<Users> {
    return this.usersRepository;
  }

  async findOneBy(where: object): Promise<Users | null> {
    return this.usersRepository.findOne({ where });
  }

  findOneById(id: number): Promise<Users | null> {
    return this.findOneBy({ id });
  }

  findOneByEmail(email: string | undefined): Promise<Users | null> {
    return this.findOneBy({ email });
  }

  async createExternal(email: string): Promise<Users> {
    return this.usersRepository.save({ email });
  }

  private async _loginByUser(user: Users | null) {
    if (!user) throw new UnauthorizedException('User unauthorized');

    const tokens = await this.authService.login(user);
    return { ...user, ...tokens };
  }

  async updateRefresh(userId: number, refreshToken: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { refreshToken });
  }

  async refresh(args: RefreshToken): Promise<UserWithTokenType> {
    const user = await this.findOneBy({ refreshToken: args.refreshToken });
    return this._loginByUser(user);
  }
}
