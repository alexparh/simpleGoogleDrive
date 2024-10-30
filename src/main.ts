import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { static as expressStatic } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { useContainer } from 'class-validator';
import config from './config';

const {
  file: { maxFileSize },
  storage: { storageFolder, tempFolder },
  system: { port },
} = config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(graphqlUploadExpress({ maxFileSize }));

  const storageFolderPath = join(__dirname, '..', storageFolder);
  if (!fs.existsSync(storageFolderPath)) {
    fs.mkdirSync(storageFolderPath);
  }
  const tempFolderPath = join(__dirname, '..', tempFolder);
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath);
  }

  app.use('/temp', expressStatic(tempFolderPath));
  await app.listen(port);
}
bootstrap();
