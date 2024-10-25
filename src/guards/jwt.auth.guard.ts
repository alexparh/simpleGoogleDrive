import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../modules/users/user.graphql.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, headers } = ctx.getContext();
    return req ?? { headers };
  }

  handleRequest<T = User>(error: string, user: T): T | null {
    if (error) throw new BadRequestException(`Jwt auth error: ${error}`);

    return user;
  }

  constructor(private reflector: Reflector) {
    super();
  }
}
