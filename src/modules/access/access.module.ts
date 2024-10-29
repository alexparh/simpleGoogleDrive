import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AccessService } from './access.service';
import { AccessList } from 'src/entities/accessList.entity';

@Module({
  providers: [AccessService],
  imports: [
    TypeOrmModule.forFeature([AccessList]),
    forwardRef(() => UsersModule),
  ],
  exports: [AccessService],
})
export class AccessModule {}
