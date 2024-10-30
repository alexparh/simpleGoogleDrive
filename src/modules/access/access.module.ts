import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessService } from './access.service';
import { AccessList } from 'src/entities/accessList.entity';

@Module({
  providers: [AccessService],
  imports: [TypeOrmModule.forFeature([AccessList])],
  exports: [AccessService],
})
export class AccessModule {}
