import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { SearchData } from 'src/entities/search.entity';

@Module({
  providers: [SearchResolver, SearchService],
  imports: [TypeOrmModule.forFeature([SearchData])],
  exports: [SearchService],
})
export class SearchModule {}
