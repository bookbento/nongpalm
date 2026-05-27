import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginatedResult } from './api-response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<unknown>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((value) => {
        if (value instanceof PaginatedResult) {
          return { success: true, data: value.data, meta: value.meta };
        }
        return { success: true, data: value };
      }),
    );
  }
}
