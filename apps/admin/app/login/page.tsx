'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/lib/useSession';

export default function LoginPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in (or just signed in) → leave the login screen.
  useEffect(() => {
    if (!loading && session) router.replace('/products');
  }, [loading, session, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/products');
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-[18px] font-semibold">Nongpalm Admin</h1>
          <p className="mt-1 text-[13px] text-muted">Sign in to manage the catalog.</p>
        </div>

        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-[13px] text-accent">{error}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
