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
import { accessGuard } from '../../guards/access.guard';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(private folderService: FolderService) {}

  @Query(() => Folder, { name: 'folder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async findOneById(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID, nullable: true }) id: number,
  ) {
    accessGuard(['owner', 'view'], {
      user,
      checkObj: await this.folderService.findOneById(id),
    });

    return this.folderService.findOneById(id);
  }

  @Mutation(() => Folder, { name: 'createFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async create(@Args() args: FolderCreate, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.folderService.findOneById(args.parentFolderId),
    });

    return this.folderService.create(args, user.id);
  }

  @Mutation(() => Folder, { name: 'copyFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async copy(@Args() args: FolderCopy, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.folderService.findOneById(args.id),
    });

    return this.folderService.copy(args, user.id);
  }

  @Mutation(() => Folder, { name: 'updateFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async update(@Args() args: FolderUpdate, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.folderService.findOneById(args.id),
    });

    return this.folderService.update(args);
  }

  @Mutation(() => Ok, { name: 'deleteFolder', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  async delete(@Args() args: FolderDelete, @CurrentUser() user: User) {
    accessGuard(['owner', 'edit'], {
      user,
      checkObj: await this.folderService.findOneById(args.id),
    });

    return this.folderService.delete(args);
  }
}
