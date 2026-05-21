export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-paper text-ink animate-pulse">
      <div className="h-[80vh] md:h-[92vh] bg-ink/10" />
      <div className="px-6 md:px-10 pt-16 max-w-4xl space-y-6">
        <div className="h-3 w-32 bg-ink/10" />
        <div className="h-12 w-2/3 bg-ink/10" />
        <div className="h-12 w-1/2 bg-ink/10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-24 px-6 md:px-10 pt-24 pb-48">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`${i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5 md:mt-24'} aspect-[4/5] bg-ink/10`}
          />
        ))}
      </div>
    </main>
  );
}
