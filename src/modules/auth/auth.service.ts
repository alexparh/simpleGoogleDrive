import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import {
  AccessRefreshTokenType,
  ExternalDataType,
} from '../../types/auth.type';
import { UserWithTokenType } from '../../types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createTokenForUser(user: User): Promise<AccessRefreshTokenType> {
    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = user.refreshToken || crypto.randomUUID();
    if (!user.refreshToken)
      await this.usersService.updateRefresh(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async login(user: User): Promise<AccessRefreshTokenType> {
    return this.createTokenForUser(user);
  }

  async loginExternal(params: ExternalDataType): Promise<UserWithTokenType> {
    const { email } = params;

    const existsUser = await this.usersService.findOneByEmail(email);

    const user = existsUser || (await this.usersService.create(email));
    if (!user) throw new NotFoundException('User not found');

    const loginData = await this.login(user as User);
    return { ...user, ...loginData };
  }
}
