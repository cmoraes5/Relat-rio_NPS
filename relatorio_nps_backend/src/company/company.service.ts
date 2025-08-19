/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.company.findMany({ orderBy: { name: 'asc' } });
  }
}
