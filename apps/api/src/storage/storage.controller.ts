import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SignedUpload, StorageService } from './storage.service';

const signRequestSchema = z.object({
  filename: z.string().min(1).max(200),
});
type SignRequest = z.infer<typeof signRequestSchema>;

@Controller('products/images')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('sign')
  @UseGuards(JwtAuthGuard)
  sign(
    @Body(new ZodValidationPipe(signRequestSchema)) body: SignRequest,
  ): Promise<SignedUpload> {
    return this.storage.createSignedUpload(body.filename);
  }
}
