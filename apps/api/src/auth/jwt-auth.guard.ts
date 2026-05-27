import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
  type JWTVerifyGetKey,
} from 'jose';

/**
 * Verifies a Supabase-issued JWT on protected routes.
 *
 * Preferred: asymmetric verification against the project's JWKS endpoint
 * (SUPABASE_JWKS_URL). Fallback: legacy HS256 shared secret (SUPABASE_JWT_SECRET).
 * The verified claims are attached to req.user for downstream handlers.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private jwks?: JWTVerifyGetKey;
  private hsSecret?: Uint8Array;
  private initialized = false;

  /**
   * Build the verification key lazily on first request rather than in the
   * constructor, so a missing/malformed auth config rejects protected routes
   * with 401 instead of crashing the whole app (including read endpoints).
   */
  private ensureInitialized(): void {
    if (this.initialized) return;
    this.initialized = true;

    const jwksUrl = process.env.SUPABASE_JWKS_URL;
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (jwksUrl && !jwksUrl.includes('<')) {
      try {
        this.jwks = createRemoteJWKSet(new URL(jwksUrl));
        return;
      } catch (error) {
        this.logger.error(`Invalid SUPABASE_JWKS_URL: ${String(error)}`);
      }
    }

    if (secret && !secret.includes('<')) {
      this.hsSecret = new TextEncoder().encode(secret);
      return;
    }

    this.logger.warn(
      'No valid SUPABASE_JWKS_URL or SUPABASE_JWT_SECRET — protected routes will reject all requests.',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.ensureInitialized();
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = await this.verify(token);
    (request as Request & { user?: JWTPayload }).user = payload;
    return true;
  }

  private extractToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    return header.slice('Bearer '.length).trim() || null;
  }

  private async verify(token: string): Promise<JWTPayload> {
    try {
      if (this.jwks) {
        const { payload } = await jwtVerify(token, this.jwks);
        return payload;
      }
      if (this.hsSecret) {
        const { payload } = await jwtVerify(token, this.hsSecret);
        return payload;
      }
      throw new Error('No verification key configured');
    } catch (error) {
      this.logger.debug(`Token verification failed: ${String(error)}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
