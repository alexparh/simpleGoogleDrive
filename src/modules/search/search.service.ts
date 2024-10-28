import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchData } from '../../entities/search.entity';
import { SearchResult } from './search.graphql.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchData)
    private readonly searchDataRepository: Repository<SearchData>,
  ) {}

  async search(name: string, userId: number): Promise<SearchResult[] | null> {
    return this.searchDataRepository
      .createQueryBuilder('search_data')
      .where('search_data.name ILIKE :name', { name: `%${name}%` })
      .andWhere('search_data.userId = :userId', { userId })
      .getMany();
  }
}
