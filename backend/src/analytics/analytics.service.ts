import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLog } from '../entities/event-log.entity';
import { LogEventDto } from './dto/log-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(EventLog)
    private readonly repo: Repository<EventLog>,
  ) {}

  async log(dto: LogEventDto, ip: string): Promise<void> {
    const entry = this.repo.create({ ...dto, ip });
    await this.repo.save(entry);
  }
}
