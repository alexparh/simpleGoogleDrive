import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { FolderModule } from '../folders/folders.module';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';
import { AccessModule } from '../access/access.module';

@Module({
  providers: [FileResolver, FileService],
  imports: [
    TypeOrmModule.forFeature([File]),
    forwardRef(() => FolderModule),
    AccessModule,
  ],
  exports: [FileService],
})
export class FileModule {}
