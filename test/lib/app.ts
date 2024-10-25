import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { dataSource } from '../../src/database/datasource.provider';
import { User } from '../../src/modules/users/user.graphql.entity';
import { join } from 'path';
import { mkdir } from 'fs/promises';

let nestApp: INestApplication;

const storagePath = join(__dirname, '..', '..', 'testStorage');

const userEmails = ['test1@gmail.com', 'test2@gmail.com'];

export async function getApp(): Promise<INestApplication> {
  if (nestApp) return nestApp;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  nestApp = app;
  return nestApp;
}

export async function clearTables() {
  const dndTables = ['File', 'Folder', 'AccessList'];

  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    if (dndTables.includes(entity.name)) continue;

    const repository = dataSource.getRepository(entity.name);
    await repository.manager.transaction(async () => {
      await repository.query('SET FOREIGN_KEY_CHECKS = 0');
      await repository.clear();
      await repository.query('SET FOREIGN_KEY_CHECKS = 1');
    });
  }
}

export async function graphql(query: string, token?: string): Promise<any> {
  const app = await getApp();
  return new Promise((resolve, reject) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set({
        ...(token && { Authorization: `Bearer ${token}` }),
      })
      .send({ query })
      .end((err, res) => (err ? reject(err) : resolve(res))),
  );
}

export function getToken(payload: { id: number }): string {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string);
}

async function getUserIdByEmail(email: string): Promise<User> {
  const { body } = await graphql(`
        {
            user(username: "${email}") {
                id
            }
        }
    `);

  return body?.data?.user?.id;
}

async function createUser(email: string) {
  const repository = dataSource.getRepository('user');
  const userResult = await repository.query(
    `INSERT INTO user (email) VALUES (?)`,
    [email],
  );

  const userId = userResult.insertedId;
  await mkdir(join(storagePath, `${userId}`));

  const rootFolderResult = await repository.query(
    `INSERT INTO folder (name, userId, path) VALUES (?, ?, ?)`,
    [`${userId}`, userId, `/${userId}`],
  );

  const rootFolderId = rootFolderResult.insertedId;
  await repository.query(`UPDATE user SET rootFolderId = ? WHERE id = ?`, [
    rootFolderId,
    userId,
  ]);

  return userId;
}

export async function getUser1Token(): Promise<string> {
  let id = await getUserIdByEmail(userEmails[0]);
  if (!id) {
    id = await createUser(userEmails[0]);
  }

  return getToken({ id: +id });
}

export async function getUser2Token(): Promise<string> {
  let id = await getUserIdByEmail(userEmails[1]);
  if (!id) {
    id = await createUser(userEmails[1]);
  }

  return getToken({ id: +id });
}
