import { MigrationInterface, QueryRunner } from 'typeorm';

export class Indexes1730296726013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX users_email_idx ON users (email);

            CREATE INDEX file_folder_id_idx ON file ("folderId");

            CREATE INDEX folder_parent_folder_id_idx ON folder ("parentFolderId");

            CREATE INDEX access_list_folder_id_idx 
            ON access_list ("folderId") 
            WHERE "folderId" IS NOT NULL;

            CREATE INDEX access_list_folder_id_idx 
            ON access_list ("parentFolderId") 
            WHERE "parentFolderId" IS NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX users_email_idx;
            DROP INDEX file_folder_id_idx;
            DROP INDEX folder_parent_folder_id_idx;
            DROP INDEX access_list_folder_id_idx;
            DROP INDEX access_list_folder_id_idx ;
        `);
  }
}
