import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshSearchMaterializeView() {
    try {
      this.logger.log('Refreshing materialized view...');
      await this.dataSource.query('REFRESH MATERIALIZED VIEW search_data');
      this.logger.log('Materialized view refreshed successfully.');
    } catch (error) {
      this.logger.error('Failed to refresh materialized view', error);
    }
  }
}
