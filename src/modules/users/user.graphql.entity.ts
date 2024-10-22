import 'reflect-metadata';
import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'New user data' })
export class UserWithToken {
  @Field({ description: "User's email", nullable: true })
  email: string;

  @Field({ description: 'Token' })
  accessToken: string;

  @Field({ description: 'Refresh Token', nullable: true })
  refreshToken?: string;
}

@ArgsType()
@ObjectType({ description: 'Id' })
class Id {
  @Field(() => ID, { description: 'ID' })
  id: number;
}

@ArgsType()
@ObjectType({ description: 'Refresh token' })
export class RefreshToken {
  @Field({ description: 'Refresh token' })
  refreshToken: string;
}
