/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Filter = { companyId?: string; companyName?: string };

@Injectable()
export class NpsService {
  constructor(private prisma: PrismaService) {}

  private classify(rating: number): 'promoter' | 'neutral' | 'detractor' {
    if (rating >= 4) return 'promoter';
    if (rating === 3) return 'neutral';
    return 'detractor';
  }

  async compute(filter?: Filter) {
    const where: any = {};
    if (filter?.companyId) where.companyId = filter.companyId;
    if (filter?.companyName)
      where.company = {
        name: { equals: filter.companyName.trim(), mode: 'insensitive' },
      };

    const rows = await this.prisma.feedback.findMany({
      where,
      include: { company: true },
    });
    const total = rows.length;

    let promoters = 0;
    let detractors = 0;
    for (const r of rows) {
      const c = this.classify(r.rating);
      if (c === 'promoter') promoters++;
      else if (c === 'detractor') detractors++;
    }

    const pct = (n: number) => (total ? (n / total) * 100 : 0);
    const nps = pct(promoters) - pct(detractors);

    const byCompany = new Map<
      string,
      { companyId: string; name: string; comments: string[] }
    >();
    rows.forEach((r) => {
      const key = r.company.id;
      if (!byCompany.has(key)) {
        byCompany.set(key, {
          companyId: r.company.id,
          name: r.company.name,
          comments: [],
        });
      }
      if (r.comment?.trim())
        byCompany.get(key)!.comments.push(r.comment.trim());
    });

    return {
      totalResponses: total,
      promoters,
      neutrals: rows.filter((r) => this.classify(r.rating) === 'neutral')
        .length,
      detractors,
      nps: Number(nps.toFixed(2)),
      companies: Array.from(byCompany.values()),
    };
  }
}
