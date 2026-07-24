'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from '@/lib/useSession';
import { supabase } from '@/lib/supabase';

/**
 * Client-side auth gate for every page under the shell. Unauthenticated users
 * are bounced to /login. This is a private internal tool, not public content,
 * so a client guard plus the API's JWT verification is the security boundary —
 * the storefront never depends on it.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-3.5">
          <Link href="/products" className="text-[15px] font-semibold tracking-tight">
            Nongpalm <span className="text-muted font-normal">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-[13.5px]">
            <NavLink href="/products" active={pathname.startsWith('/products')}>
              Products
            </NavLink>
          </nav>
          <button onClick={signOut} className="ml-auto btn-ghost">
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 transition ${
        active ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}
