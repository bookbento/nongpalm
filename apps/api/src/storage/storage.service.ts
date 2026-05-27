import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export interface SignedUpload {
  path: string;
  token: string;
  signedUrl: string;
  publicUrl: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client?: SupabaseClient;
  private readonly bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images';

  /**
   * Lazily build a service-role Supabase client. Service role bypasses RLS,
   * so this key is server-only and never exposed to the browser.
   */
  private getClient(): SupabaseClient {
    if (this.client) return this.client;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || url.includes('<') || !key || key.includes('<')) {
      throw new InternalServerErrorException(
        'Storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false },
    });
    return this.client;
  }

  private safeName(filename: string): string {
    const cleaned = filename.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    return cleaned.replace(/^-+|-+$/g, '') || 'image';
  }

  async createSignedUpload(filename: string): Promise<SignedUpload> {
    const client = this.getClient();
    const path = `${randomUUID()}-${this.safeName(filename)}`;

    const { data, error } = await client.storage
      .from(this.bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      this.logger.error(`Signed upload failed: ${error?.message ?? 'no data'}`);
      throw new InternalServerErrorException('Could not create signed upload URL');
    }

    const { data: pub } = client.storage.from(this.bucket).getPublicUrl(path);

    return {
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: pub.publicUrl,
    };
  }
}
