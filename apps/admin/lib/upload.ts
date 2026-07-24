'use client';

import type { ProductImage } from '@harlowe/shared';
import { api } from './api';
import { supabase } from './supabase';

const BUCKET = 'product-images';
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB — reject oversized originals early.
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/** Read a browser image's intrinsic pixel size so we can store width/height
 * and prevent layout shift on the storefront. */
function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image dimensions'));
    };
    img.src = url;
  });
}

/**
 * Full upload flow for one file:
 *  1. validate type/size in the browser
 *  2. ask the API for a signed upload URL (server holds the service key)
 *  3. PUT the bytes straight to Supabase Storage (bypasses our API payload)
 *  4. return a ProductImage with the public URL + real dimensions
 * `alt` defaults to the product name; the editor lets the user refine it.
 */
export async function uploadProductImage(
  file: File,
  altFallback: string,
): Promise<ProductImage> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || 'unknown'}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image is larger than 8 MB — please compress it first.');
  }

  const [{ width, height }, signed] = await Promise.all([
    readDimensions(file),
    api.signImageUpload(file.name),
  ]);

  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(signed.path, signed.token, file, {
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return {
    src: signed.publicUrl,
    alt: altFallback.trim() || 'Product image',
    width,
    height,
  };
}
