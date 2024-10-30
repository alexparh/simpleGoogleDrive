import { MigrationInterface, QueryRunner } from 'typeorm';

export class IdexesAndMv1730296356754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION pg_trgm;

            CREATE MATERIALIZED VIEW search_data AS
            SELECT id, 'file' as entity, name, "userId"
            FROM file
            UNION
            SELECT DISTINCT file.id as id, 'file' as entity, name, al."userId" as "userId"
            FROM file
            INNER JOIN access_list al ON al."fileId" = file."id"
            UNION
            SELECT id, 'folder' as entity, name, "userId"
            FROM folder
            UNION
            SELECT DISTINCT folder.id as id, 'folder' as entity, name, al."userId" as "userId"
            FROM folder
            INNER JOIN access_list al ON al."folderId" = folder."id";

            CREATE INDEX search_data_name_idx ON search_data USING GIN (name gin_trgm_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX search_data_name_idx;
        DROP MATERIALIZED VIEW search_data;
        DROP EXTENSION pg_trgm;
    `);
  }
}
