import 'reflect-metadata';
import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { File } from '../files/file.graphql.entity';
import { Access, AddAccess } from '../access/access.graphql.entity';

@ObjectType()
export class Folder {
  @Field(() => ID, { description: 'A unique identifier for the folder' })
  id: number;

  @Field(() => ID, { description: 'Parent folder id', nullable: true })
  parentFolderId?: number;

  @Field(() => ID, { description: 'Folder creator id' })
  userId: number;

  @Field({ description: 'The date the folder was created' })
  createdAt: Date;

  @Field({ description: 'Folder name' })
  name: string;

  @Field({ description: 'Folder path' })
  path: string;

  @Field(() => [File], { description: 'Images', nullable: true })
  files?: File[];

  @Field(() => [Folder], { description: 'Subfolders', nullable: true })
  subFolders?: Folder[];

  @Field(() => [Access], { description: 'Access list', nullable: true })
  accessList?: Access[];
}

@ArgsType()
@ObjectType({ description: 'Create folder' })
export class FolderCreate {
  @Field(() => ID, { description: 'Parent folder id' })
  parentFolderId: number;

  @Field({ description: 'Name' })
  name: string;
}

@ArgsType()
@ObjectType({ description: 'Copy folder' })
export class FolderCopy {
  @Field(() => ID, { description: 'A unique identifier for the fodler' })
  id: number;

  @Field(() => ID, { description: 'Parent folder id' })
  parentFolderId: number;
}

@ArgsType()
@ObjectType({ description: 'Update folder' })
export class FolderUpdate {
  @Field(() => ID, { description: 'A unique identifier for the fodler' })
  id: number;

  @Field({ description: 'New name', nullable: true })
  name: string;

  @Field(() => [AddAccess], { description: 'New access list', nullable: true })
  accessList?: AddAccess[];
}

@ArgsType()
@ObjectType({ description: 'Delete folder' })
export class FolderDelete {
  @Field(() => ID, { description: 'A unique identifier for the folder' })
  id: number;
}
