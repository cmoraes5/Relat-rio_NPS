/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NpsModule } from './nps/nps.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [PrismaModule, FeedbackModule, NpsModule, CompanyModule],
})
export class AppModule {}
