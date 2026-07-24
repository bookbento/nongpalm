/**
 * Fail fast at module load if the browser-facing config is missing, so a
 * misconfigured deploy surfaces immediately instead of as a confusing runtime
 * error deep inside an auth or fetch call.
 */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const SUPABASE_URL = required(
  'NEXT_PUBLIC_SUPABASE_URL',
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const SUPABASE_ANON_KEY = required(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const API_URL = required(
  'NEXT_PUBLIC_API_URL',
  process.env.NEXT_PUBLIC_API_URL,
);
