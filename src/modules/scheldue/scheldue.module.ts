import { Module } from '@nestjs/common';
import { ScheduleService } from './scheldue.service';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [ScheduleService],
})
export class ScheduleModule {}
