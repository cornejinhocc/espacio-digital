import Link from "next/link";
import { projects } from "@/lib/content";

export function SelectedWorkSection(){
 return <section id="work" className="border-t border-white/10 px-6 py-32 lg:px-10 lg:py-48"><div className="mx-auto max-w-[1600px]">
  <Label n="04" text="Selected work"/>
  <div className="mb-24 flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><h2 className="display-sm">PROBLEMS<br/>I&apos;VE HELPED<br/><span className="text-white/25">SOLVE.</span></h2><p className="max-w-sm text-sm leading-7 text-white/40">A selection of operational, reporting and digital-system work. Each project starts with understanding the problem before choosing the technology.</p></div>
  <div className="border-t border-white/10">{projects.map(p=><Link key={p.slug} href={`/work/${p.slug}`} className="group block border-b border-white/10 py-10 hover:bg-white/[.025] md:py-14">
   <div className="grid gap-8 md:grid-cols-[80px_1fr_1fr_auto]"><div className="text-xs text-white/25">{p.number}</div><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">{p.category}</p><h3 className="mt-5 max-w-xl text-2xl font-medium leading-tight tracking-[-.04em] group-hover:text-[var(--accent)] md:text-3xl">{p.title}</h3></div><p className="max-w-md text-sm leading-7 text-white/40">{p.shortDescription}</p><span className="text-lg text-white/25 group-hover:text-[var(--accent)]">↗</span></div>
   <div className="mt-8 flex flex-wrap gap-2 md:pl-[80px]">{p.tags.map(t=><span key={t} className="border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[.12em] text-white/30">{t}</span>)}</div>
  </Link>)}</div>
  <div className="mt-10"><Link href="/work" className="text-sm text-white/50 hover:text-white">View all work <span className="text-[var(--accent)]">→</span></Link></div>
 </div></section>;
}
function Label({n,text}:{n:string;text:string}){return <div className="mb-20 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/40"><span className="text-[var(--accent)]">{n}</span><span>/</span><span>{text}</span></div>}
