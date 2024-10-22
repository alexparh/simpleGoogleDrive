import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, RedirectUrlType, OAuth2Callback } from './auth.graphql.entity';
import { Authenticate, RedirectUrl } from './auth.decorators';
import { ExternalDataType } from '../../types/auth.type';
import { UserWithToken } from '../users/user.graphql.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => RedirectUrlType, { name: 'google', nullable: true })
  googleRedirectUrl(@RedirectUrl('google') data: RedirectUrlType) {
    return data;
  }

  @Mutation(() => UserWithToken, { name: 'google', nullable: true })
  googleProfile(
    @Args() params: OAuth2Callback,
    @Authenticate('google') externalData: ExternalDataType,
  ) {
    return this.authService.loginExternal(externalData);
  }
}
