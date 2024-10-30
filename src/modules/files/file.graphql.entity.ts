import 'reflect-metadata';
import {
  ArgsType,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Access, AddAccess } from '../access/access.graphql.entity';

@ObjectType()
export class File {
  @Field(() => ID, { description: 'A unique identifier for the folder' })
  id: number;

  @Field(() => ID, { description: 'Folder id' })
  folderId: number;

  @Field(() => ID, { description: 'Folder creator id' })
  userId: number;

  @Field({ description: 'The date the folder was created' })
  createdAt: Date;

  @Field({ description: 'Folder name' })
  name: string;

  @Field({ description: 'Folder path' })
  path: string;

  @Field({ description: 'Public or private view' })
  isPublic: boolean;

  @Field(() => [Access], { description: 'Access list', nullable: true })
  accessList?: Access[];
}

@ObjectType()
export class FileLink {
  @Field({ description: 'File download link' })
  downloadLink: string;
}

@ArgsType()
@ObjectType({ description: 'Upload file' })
export class FileDownload {
  @Field(() => ID, { description: 'File id' })
  id: number;
}

@ArgsType()
@ObjectType({ description: 'Upload file' })
export class FileCreate {
  @Field(() => ID, { description: 'Folder id' })
  folderId: number;
}

@ArgsType()
@ObjectType({ description: 'Copy file' })
export class FileCopy {
  @Field(() => ID, { description: 'A unique identifier for the file' })
  id: number;

  @Field(() => ID, { description: 'Folder id' })
  folderId: number;
}

@ArgsType()
@ObjectType({ description: 'Update file' })
export class FileUpdate {
  @Field(() => ID, { description: 'A unique identifier for the file' })
  id: number;

  @Field({ description: 'Name', nullable: true })
  name?: string;

  @Field({ description: 'Public or private view', nullable: true })
  isPublic?: boolean;

  @Field(() => [AddAccess], { description: 'New access list', nullable: true })
  accessList?: AddAccess[];
}

@ArgsType()
@ObjectType({ description: 'Delete file' })
export class FileDelete {
  @Field(() => ID, { description: 'A unique identifier for the file' })
  id: number;
}
