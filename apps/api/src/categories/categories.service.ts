import { Injectable } from '@nestjs/common';
import type { Category as PrismaCategory } from '@prisma/client';
import { Category, categorySchema } from '@harlowe/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private toCategory(row: PrismaCategory): Category {
    return categorySchema.parse({
      slug: row.slug,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      hero: row.hero,
      order: row.order,
    });
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({ orderBy: { order: 'asc' } });
    return rows.map((r) => this.toCategory(r));
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { slug } });
    return row ? this.toCategory(row) : null;
  }
}
