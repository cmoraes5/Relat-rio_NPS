/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { NpsService } from './nps.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('NPS')
@Controller('nps')
export class NpsController {
  constructor(private readonly service: NpsService) {}

  @Get()
  compute(
    @Query('companyId') companyId?: string,
    @Query('companyName') companyName?: string,
  ) {
    return this.service.compute({ companyId, companyName });
  }
}
