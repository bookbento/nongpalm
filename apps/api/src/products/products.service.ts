import {
  BadRequestException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Best-effort on-demand revalidation of the storefront after a write. Fires
   * the web app's /api/revalidate hook so edits go live immediately instead of
   * waiting out ISR. Never throws — a revalidation failure must not fail the
   * write. No-op unless both WEB_URL and REVALIDATE_SECRET are configured.
   */
  private async revalidateStorefront(payload: {
    slug?: string;
    categorySlug?: string;
  }): Promise<void> {
    const webUrl = process.env.WEB_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (!webUrl || !secret) return;

    try {
      await fetch(`${webUrl.replace(/\/$/, '')}/api/revalidate`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-revalidate-secret': secret,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      this.logger.warn(`Storefront revalidation failed: ${String(error)}`);
    }
  }

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
      channels: row.channels,
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
          channels: input.channels,
          inStock: input.inStock,
          featured: input.featured,
        },
      });
      const product = this.toProduct(row);
      await this.revalidateStorefront({
        slug: product.slug,
        categorySlug: product.categorySlug,
      });
      return product;
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
          channels: patch.channels,
          inStock: patch.inStock,
          featured: patch.featured,
        },
      });
      const product = this.toProduct(row);
      await this.revalidateStorefront({
        slug: product.slug,
        categorySlug: product.categorySlug,
      });
      return product;
    } catch (error) {
      throw this.mapWriteError(error, id);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Capture identifiers before removal so the storefront can revalidate
      // the exact product and collection pages that just changed.
      const existing = await this.prisma.product.findUnique({
        where: { id },
        select: { slug: true, categorySlug: true },
      });
      await this.prisma.product.delete({ where: { id } });
      await this.revalidateStorefront({
        slug: existing?.slug,
        categorySlug: existing?.categorySlug,
      });
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
