import { Controller, Post, Body, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics.service';
import { LogEventDto } from './dto/log-event.dto';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @SkipThrottle()
  @Post('log')
  log(@Body() dto: LogEventDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket?.remoteAddress
      ?? '';
    return this.analyticsService.log(dto, ip);
  }
}
