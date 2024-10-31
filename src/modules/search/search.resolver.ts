import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from '../users/user.graphql.entity';
import { CurrentUser } from 'src/app.decorator';
import { AuthenticatedAuthGuard } from 'src/guards/authenticated.auth.guard';
import { SearchResult } from './search.graphql.entity';
import { SearchService } from './search.service';

@Resolver(() => SearchResult)
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => [SearchResult], { name: 'search', nullable: true })
  @UseGuards(AuthenticatedAuthGuard)
  search(@Args('name') name: string, @CurrentUser() user: User) {
    return this.searchService.search(name, user.id);
  }
}
