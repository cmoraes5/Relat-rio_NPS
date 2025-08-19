/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NpsService } from './nps.service';
import { NpsController } from './nps.controller';

@Module({
  providers: [NpsService],
  controllers: [NpsController],
})
export class NpsModule {}
