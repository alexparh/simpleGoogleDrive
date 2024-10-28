import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, ID } from '@nestjs/graphql';
import {
  File,
  FileDownload,
  FileCreate,
  FileCopy,
  FileDelete,
  FileUpdate,
} from './file.graphql.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { Ok } from '../../system/system.graphql.entity';
import { FileService } from './file.service';
import { User } from '../users/user.graphql.entity';
import { CurrentUser } from 'src/app.decorator';
import { Stream } from 'stream';
import { AuthenticatedAuthGuard } from 'src/guards/authenticated.auth.guard';

@Resolver(() => File)
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => File, { name: 'folder', nullable: true })
  findOneById(@Args('id', { type: () => ID, nullable: true }) id?: number) {
    return this.fileService.findOneBy({
      ...(id && { id }),
    });
  }

  @Query('downloadFile')
  async download(@Args() args: FileDownload): Promise<Stream> {
    return this.fileService.load(args);
  }

  @Mutation(() => File, { name: 'uploadFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async upload(
    @Args() args: FileCreate,
    @Args({ name: 'file', type: () => GraphQLUpload }) argsUpload: FileUpload,
    @CurrentUser() user: User,
  ) {
    return this.fileService.upload(argsUpload, args, user.id);
  }

  @Mutation(() => File, { name: 'copyFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async copy(@Args() args: FileCopy, @CurrentUser() user: User) {
    return this.fileService.copy(args, user.id);
  }

  @Mutation(() => File, { name: 'updateFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async update(@Args() args: FileUpdate) {
    return this.fileService.update(args);
  }

  @Mutation(() => Ok, { name: 'deleteFile', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async delete(@Args() args: FileDelete) {
    return this.fileService.delete(args);
  }
}
