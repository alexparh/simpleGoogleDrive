import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, ID } from '@nestjs/graphql';
import {
  File,
  FileDownload,
  FileCreate,
  FileCopy,
  FileDelete,
  FileUpdate,
  FileLink,
} from './file.graphql.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { Ok } from '../../system/system.graphql.entity';
import { FileService } from './file.service';
import { FolderService } from '../folders/folder.service';
import { User } from '../users/user.graphql.entity';
import { CurrentUser } from 'src/app.decorator';
import { AuthenticatedAuthGuard } from 'src/guards/authenticated.auth.guard';
import { accessGuard } from 'src/guards/access.guard';

@Resolver(() => File)
export class FileResolver {
  constructor(
    private fileService: FileService,
    private folderService: FolderService,
  ) {}

  @Query(() => File, { name: 'folder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async findOneById(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID, nullable: true }) id: number,
  ) {
    accessGuard(['owner', 'view'], {
      user,
      checkObj: await this.fileService.findOneById(id),
    });

    return this.fileService.findOneById(id);
  }

  @Query(() => FileLink, { name: 'downloadFile' })
  @UseGuards(AuthenticatedAuthGuard)
  async download(@Args() args: FileDownload, @CurrentUser() user: User) {
    accessGuard(['owner', 'view'], {
      user,
      checkObj: await this.fileService.findOneById(args.id),
    });

    return this.fileService.load(args);
  }

  @Mutation(() => File, { name: 'uploadFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async upload(
    @Args() args: FileCreate,
    @Args({ name: 'file', type: () => GraphQLUpload }) argsUpload: FileUpload,
    @CurrentUser() user: User,
  ) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.folderService.findOneById(args.folderId),
    });

    return this.fileService.upload(argsUpload, args, user.id);
  }

  @Mutation(() => File, { name: 'copyFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async copy(@Args() args: FileCopy, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.fileService.findOneById(args.id),
    });

    return this.fileService.copy(args, user.id);
  }

  @Mutation(() => File, { name: 'updateFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async update(@Args() args: FileUpdate, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.fileService.findOneById(args.id),
    });

    return this.fileService.update(args);
  }

  @Mutation(() => Ok, { name: 'deleteFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async delete(@Args() args: FileDelete, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.fileService.findOneById(args.id),
    });

    return this.fileService.delete(args);
  }
}
