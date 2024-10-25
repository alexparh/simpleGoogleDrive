import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Ok result' })
export class Ok {
  @Field({ description: 'Ok flag' })
  ok: boolean;
}
