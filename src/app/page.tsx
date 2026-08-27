export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-neutral-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">RepoDope</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Next.js starter</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Lightweight foundation prepared for Next.js, TypeScript, Tailwind CSS, shadcn/ui and Vercel.
          </p>
        </header>
        <section className="grid gap-3 sm:grid-cols-2">
          {["Next.js + React 19", "TypeScript strict", "Tailwind CSS", "shadcn/ui ready", "Vercel ready", "Public GitHub repository"].map((item) => (
            <div key={item} className="rounded-xl border border-neutral-200 p-5 text-sm font-medium">
              {item}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
