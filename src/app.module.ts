import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import config from './config';
import { dataSource } from './database/dataSource.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { FolderModule } from './modules/folders/folders.module';
import { FileModule } from './modules/files/file.module';
import { AccessModule } from './modules/access/access.module';
import { ScheduleModule } from './modules/scheldue/scheldue.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FolderModule,
    FileModule,
    AccessModule,
    ScheduleModule,
    SearchModule,
  ],
})
export class AppModule {}
