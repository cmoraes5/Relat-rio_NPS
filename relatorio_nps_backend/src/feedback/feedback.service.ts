/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto) {
    const company = await this.prisma.company.upsert({
      where: { name: dto.companyName.trim() },
      update: {},
      create: { name: dto.companyName.trim() },
    });

    return this.prisma.feedback.create({
      data: {
        companyId: company.id,
        rating: dto.rating,
        userName: dto.userName,
        comment: dto.comment,
      },
    });
  }

  async list(params?: { companyId?: string; companyName?: string }) {
    const where: any = {};
    if (params?.companyId) where.companyId = params.companyId;
    if (params?.companyName)
      where.company = {
        name: { equals: params.companyName.trim(), mode: 'insensitive' },
      };

    return this.prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });
  }
}
