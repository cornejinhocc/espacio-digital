const problems = [
  "Information lives in too many places.",
  "Processes depend on one person.",
  "The same work gets done more than once.",
  "Reports take longer than they should.",
  "Simple tasks still require manual work.",
  "Nobody has a clear view of what is happening.",
];

export function ProblemSection() {
  return (
    <section className="border-t border-white/10 px-6 py-32 lg:px-10 lg:py-48">
      <div className="mx-auto max-w-[1600px]">
        <Label n="01" text="The problem"/>
        <div className="grid gap-16 lg:grid-cols-[1.4fr_.6fr]">
          <div>
            <h2 className="display-sm">MOST BUSINESSES<br/>DON&apos;T HAVE A<br/>TECHNOLOGY<br/>PROBLEM.</h2>
            <h3 className="mt-10 text-[clamp(2.5rem,5vw,5.5rem)] font-medium leading-[.9] tracking-[-.065em] text-white/25">THEY HAVE A<br/>SYSTEM PROBLEM.</h3>
          </div>
          <div className="flex items-end"><p className="max-w-sm text-base leading-7 text-white/45">The tools are rarely the real issue. The friction usually comes from how information, people and processes work together.</p></div>
        </div>
        <div className="mt-32 border-t border-white/10">
          {problems.map((p,i)=><div key={p} className="group grid grid-cols-[50px_1fr_auto] border-b border-white/10 py-7 hover:border-white/25">
            <span className="text-xs text-white/25">{String(i+1).padStart(2,"0")}</span>
            <span className="text-xl tracking-[-.02em] text-white/60 group-hover:text-white md:text-2xl">{p}</span>
            <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100">↗</span>
          </div>)}
        </div>
      </div>
    </section>
  );
}

function Label({n,text}:{n:string;text:string}) {
  return <div className="mb-20 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/40"><span className="text-[var(--accent)]">{n}</span><span>/</span><span>{text}</span></div>;
}