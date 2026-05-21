export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-paper text-ink pt-[68px] md:pt-[78px] animate-pulse">
      <div className="px-6 md:px-10 pt-12 md:pt-16">
        <div className="h-3 w-48 bg-ink/10" />
      </div>
      <div className="px-6 md:px-10 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="aspect-[3/4] md:aspect-[4/5] bg-ink/10" />
          <div className="mt-6 flex gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[3/4] w-20 md:w-24 bg-ink/10" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-3 w-24 bg-ink/10" />
          <div className="h-14 w-full bg-ink/10" />
          <div className="h-8 w-32 bg-ink/10" />
          <div className="h-3 w-full bg-ink/10" />
          <div className="h-3 w-5/6 bg-ink/10" />
          <div className="h-3 w-2/3 bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
