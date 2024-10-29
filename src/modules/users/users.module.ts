import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { FolderModule } from '../folders/folders.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => FolderModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
