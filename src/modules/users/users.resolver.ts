import { Resolver, Query, Args, Mutation, Context, ID } from '@nestjs/graphql';
import { UserWithToken, RefreshToken } from './user.graphql.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => UserWithToken, { name: 'refresh', nullable: true })
  refresh(@Args() args: RefreshToken) {
    return this.usersService.refresh(args);
  }
}
