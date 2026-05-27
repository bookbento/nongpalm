import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  productCreateSchema,
  productUpdateSchema,
} from '@harlowe/shared';
import { PaginatedResult } from '../common/api-response';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

const parsePositiveInt = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
};

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  async list(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Product[] | PaginatedResult<Product[]>> {
    const limitNum = parsePositiveInt(limit);

    if (category) {
      return this.products.findByCategory(category);
    }

    if (featured === 'true') {
      return this.products.findFeatured(limitNum);
    }

    const offsetNum = parsePositiveInt(offset) ?? 0;
    const { products, total } = await this.products.findAll({
      limit: limitNum,
      offset: offsetNum,
    });
    return new PaginatedResult(products, {
      total,
      limit: limitNum ?? total,
      offset: offsetNum,
    });
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string): Promise<Product> {
    const product = await this.products.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(new ZodValidationPipe(productCreateSchema)) input: ProductCreateInput,
  ): Promise<Product> {
    return this.products.create(input);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(productUpdateSchema)) patch: ProductUpdateInput,
  ): Promise<Product> {
    return this.products.update(id, patch);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<{ id: string }> {
    await this.products.delete(id);
    return { id };
  }
}
