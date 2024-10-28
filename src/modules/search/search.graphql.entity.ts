import 'reflect-metadata';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SearchEntityEnum } from 'src/enums/searchEntity.enum';

registerEnumType(SearchEntityEnum, {
  name: 'SearchEntity',
});

@ObjectType()
export class SearchResult {
  @Field(() => ID, { description: 'A unique identifier for the folder' })
  id: number;

  @Field({ description: 'Name' })
  name: string;

  @Field({ description: 'Search result entity' })
  entity: SearchEntityEnum;
}
