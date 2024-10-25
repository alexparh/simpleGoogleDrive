import 'reflect-metadata';
import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'User object that is publicly accessible.',
})
export class User {
  @Field(() => ID, { description: 'A unique identifier for the user' })
  id: number;

  @Field({ description: "User's email" })
  email: string;

  @Field({ description: 'The date this user was created' })
  createdAt: Date;
}

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
