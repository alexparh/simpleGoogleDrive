import { SearchEntityEnum } from 'src/enums/searchEntity.enum';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'search_data',
  expression: `
SELECT id, 'file' as entity, name, "userId"
  FROM file
  UNION
  SELECT file.id as id, 'file' as entity, name, al."userId" as "userId"
  FROM file
  INNER JOIN access_list al ON al."fileId" = file."id"
  UNION
  SELECT id, 'folder' as entity, name, "userId"
  FROM folder
  UNION
  SELECT folder.id as id, 'folder' as entity, name, al."userId" as "userId"
  FROM folder
  INNER JOIN access_list al ON al."folderId" = folder."id"
`,
})
export class SearchData {
  @ViewColumn()
  id: number;

  @ViewColumn()
  entity: SearchEntityEnum;

  @ViewColumn()
  name: string;

  @ViewColumn()
  userId: number;
}
