/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
