import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/entities/folder.entity';
import { FolderResolver } from './folders.resolver';
import { FolderService } from './folder.service';
import { FileModule } from '../files/file.module';

@Module({
  providers: [FolderResolver, FolderService],
  imports: [TypeOrmModule.forFeature([Folder]), forwardRef(() => FileModule)],
  exports: [FolderService],
})
export class FolderModule {}
