import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'A sanitized auth object that is publicly accessible.',
})
export class Auth {
  @Field({ description: 'Token' })
  token: string;
}

@ArgsType()
@ObjectType({ description: 'Redirect Url' })
export class RedirectUrlType {
  @Field({ description: 'Url' })
  url: string;
}

@ArgsType()
@ObjectType({ description: 'Oauth2User' })
export class Oauth2User {
  @Field({ description: 'email' })
  email: string;
}

@ArgsType()
@ObjectType({ description: 'Oauth2Answer' })
export class Oauth2Answer {
  @Field({ description: 'Access token' })
  accessToken: string;

  @Field({ description: 'Refresh Token' })
  refreshToken: string;
}

@ArgsType()
@ObjectType({ description: 'OAuth2 callback' })
export class OAuth2Callback {
  @Field({ description: 'Code' })
  code: string;

  @Field({ description: 'Google scope' })
  scope: string;

  @Field({ description: 'Auth user flag' })
  authuser: string;

  @Field({ description: 'Domain' })
  hd: string;

  @Field({ description: 'Prompt (none by default)' })
  prompt: string;
}
