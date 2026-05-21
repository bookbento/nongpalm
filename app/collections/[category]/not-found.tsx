import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="eyebrow text-ink/60 mb-6">— 404</div>
        <h1 className="display text-[12vw] md:text-[6vw] leading-[0.95]">
          This <em className="display-italic">chapter</em>
          <br /> does not exist.
        </h1>
        <p className="mt-8 ui-label text-ink/65 max-w-md mx-auto">
          The page you sought has been retired or has not yet been written.
        </p>
        <Link href="/collections" className="ui-label btn-line inline-block mt-12">
          ← Return to Collections
        </Link>
      </div>
    </main>
  );
}
