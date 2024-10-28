import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, ID } from '@nestjs/graphql';
import {
  Folder,
  FolderCreate,
  FolderCopy,
  FolderDelete,
  FolderUpdate,
} from './folder.graphql.entity';
import { Ok } from '../../system/system.graphql.entity';
import { FolderService } from './folder.service';
import { User } from '../users/user.graphql.entity';
import { CurrentUser } from 'src/app.decorator';
import { AuthenticatedAuthGuard } from 'src/guards/authenticated.auth.guard';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(private folderService: FolderService) {}

  @Query(() => Folder, { name: 'folder', nullable: true })
  findOneById(@Args('id', { type: () => ID, nullable: true }) id?: number) {
    return this.folderService.findOneBy({
      ...(id && { id }),
    });
  }

  @Mutation(() => Folder, { name: 'createFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async create(@Args() args: FolderCreate, @CurrentUser() user: User) {
    return this.folderService.create(args, user.id);
  }

  @Mutation(() => Folder, { name: 'copyFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async copy(@Args() args: FolderCopy, @CurrentUser() user: User) {
    return this.folderService.copy(args, user.id);
  }

  @Mutation(() => Folder, { name: 'updateFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async update(@Args() args: FolderUpdate) {
    return this.folderService.update(args);
  }

  @Mutation(() => Ok, { name: 'deleteFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async delete(@Args() args: FolderDelete) {
    return this.folderService.delete(args);
  }
}
