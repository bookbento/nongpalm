import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type Product as PrismaProduct } from '@prisma/client';
import {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  productSchema,
} from '@harlowe/shared';
import { PrismaService } from '../prisma/prisma.service';

export interface FindAllOptions {
  limit?: number;
  offset?: number;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Prisma types Json columns as JsonValue and createdAt as Date. Re-validate
   * through the shared schema so the API output provably matches the contract.
   */
  private toProduct(row: PrismaProduct): Product {
    return productSchema.parse({
      id: row.id,
      slug: row.slug,
      name: row.name,
      categorySlug: row.categorySlug,
      price: row.price,
      images: row.images,
      description: row.description,
      details: row.details,
      inStock: row.inStock,
      featured: row.featured,
      createdAt: row.createdAt.toISOString(),
    });
  }

  async findAll(opts: FindAllOptions = {}): Promise<{ products: Product[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip: opts.offset ?? 0,
        take: opts.limit,
      }),
      this.prisma.product.count(),
    ]);
    return { products: rows.map((r) => this.toProduct(r)), total };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { slug } });
    return row ? this.toProduct(row) : null;
  }

  async findByCategory(categorySlug: string): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { categorySlug },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toProduct(r));
  }

  async findFeatured(limit?: number): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((r) => this.toProduct(r));
  }

  async create(input: ProductCreateInput): Promise<Product> {
    try {
      const row = await this.prisma.product.create({
        data: {
          slug: input.slug,
          name: input.name,
          categorySlug: input.categorySlug,
          price: input.price,
          images: input.images,
          description: input.description,
          details: input.details,
          inStock: input.inStock,
          featured: input.featured,
        },
      });
      return this.toProduct(row);
    } catch (error) {
      throw this.mapWriteError(error, input.slug);
    }
  }

  async update(id: string, patch: ProductUpdateInput): Promise<Product> {
    try {
      const row = await this.prisma.product.update({
        where: { id },
        data: {
          slug: patch.slug,
          name: patch.name,
          categorySlug: patch.categorySlug,
          price: patch.price,
          images: patch.images,
          description: patch.description,
          details: patch.details,
          inStock: patch.inStock,
          featured: patch.featured,
        },
      });
      return this.toProduct(row);
    } catch (error) {
      throw this.mapWriteError(error, id);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw this.mapWriteError(error, id);
    }
  }

  private mapWriteError(error: unknown, ref: string): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Record not found (update/delete on missing id).
      if (error.code === 'P2025') {
        return new NotFoundException(`Product "${ref}" not found`);
      }
      // Unique constraint (duplicate slug).
      if (error.code === 'P2002') {
        return new BadRequestException(`A product with slug "${ref}" already exists`);
      }
      // Foreign key violation (unknown categorySlug).
      if (error.code === 'P2003') {
        return new BadRequestException('categorySlug does not reference an existing category');
      }
    }
    return error instanceof Error ? error : new Error('Unknown write error');
  }
}
