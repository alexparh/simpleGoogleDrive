import { SearchEntityEnum } from 'src/enums/searchEntity.enum';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'search_data',
})
export class SearchData {
  @ViewColumn()
  id: number;

  @ViewColumn()
  entity: SearchEntityEnum;

  @ViewColumn()
  name: string;

  @ViewColumn()
  timeCreated: Date;

  @ViewColumn()
  userId: number;
}
