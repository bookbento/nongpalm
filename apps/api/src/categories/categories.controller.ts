import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Category } from '@harlowe/shared';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(): Promise<Category[]> {
    return this.categories.findAll();
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string): Promise<Category> {
    const category = await this.categories.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Category "${slug}" not found`);
    }
    return category;
  }
}
