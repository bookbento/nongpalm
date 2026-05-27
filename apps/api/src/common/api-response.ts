export interface ResponseMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ResponseMeta;
}

/**
 * Wrap a list payload so the response interceptor emits `meta` alongside `data`.
 * Controllers return this instead of a bare array when pagination info matters.
 */
export class PaginatedResult<T> {
  constructor(
    public readonly data: T,
    public readonly meta: ResponseMeta,
  ) {}
}
