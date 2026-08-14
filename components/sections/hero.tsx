import { DigitalField } from "@/components/webgl/digital-field";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-16 pt-32 lg:px-10 lg:pb-20">
      <DigitalField/>
      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/> Business · Operations · Systems
        </div>
        <h1 className="display max-w-[1120px]">
          I FIND WHAT&apos;S<br/>SLOWING THE<br/>BUSINESS DOWN.
        </h1>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-7 text-white/50">Then I build a better way to work.</p>
          <div className="flex gap-6 text-sm">
            <a href="#work" className="border-b border-white/25 pb-1 hover:border-[var(--accent)]">Explore the work →</a>
            <a href="/contact" className="border-b border-white/25 pb-1 text-white/55 hover:text-white">Start a conversation</a>
          </div>
        </div>
      </div>
    </section>
  );
}