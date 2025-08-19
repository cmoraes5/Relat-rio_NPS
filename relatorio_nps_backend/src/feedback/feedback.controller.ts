/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto) {
    return this.service.create(dto);
  }

  @Get()
  list(
    @Query('companyId') companyId?: string,
    @Query('companyName') companyName?: string,
  ) {
    return this.service.list({ companyId, companyName });
  }
}
