import 'reflect-metadata';
import {
  ArgsType,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AccessEnum } from 'src/enums/access.enum';

registerEnumType(AccessEnum, {
  name: 'AccessType',
});

@ObjectType({ description: 'Access to file/folder' })
export class Access {
  @Field(() => ID, {
    description: 'A unique identifier for access to file/folder',
  })
  id: number;

  @Field(() => ID, { description: 'User id' })
  userId: number;

  @Field(() => ID, { description: 'Folder id', nullable: true })
  folderId?: number;

  @Field(() => ID, { description: 'File id', nullable: true })
  fileId?: number;

  @Field({ description: 'The date the access was created' })
  createdAt: Date;

  @Field({ description: 'Folder or file path', nullable: true })
  path?: string;

  @Field({ description: 'Access type' })
  accessType: AccessEnum;
}

@ArgsType()
export class AddAccess {
  @Field({ description: 'User email' })
  email: string;

  @Field({ description: 'Access type' })
  accessType: AccessEnum;
}
