import { IsString, IsOptional, IsObject } from 'class-validator';

export class LogEventDto {
  @IsString()
  event: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
