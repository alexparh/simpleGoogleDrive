import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { useContainer } from 'class-validator';
import config from './config';

const {
  file: { maxFileSize },
} = config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(graphqlUploadExpress({ maxFileSize }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
