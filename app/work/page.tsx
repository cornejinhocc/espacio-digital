import Link from "next/link";
import { projects } from "@/lib/content";

export const metadata={title:"Work",description:"Selected operational, systems and process improvement work by Jimmy Cornejo."};

export default function Work(){
 return <main className="min-h-screen px-6 pb-32 pt-40 lg:px-10"><div className="mx-auto max-w-[1600px]"><p className="mb-8 text-[11px] uppercase tracking-[.22em] text-white/35">Selected work</p><h1 className="display-sm">PROBLEMS.<br/>SYSTEMS.<br/><span className="text-white/25">SOLUTIONS.</span></h1><p className="mt-12 max-w-xl text-base leading-7 text-white/45">Real work, operational experiments and systems built around practical business problems.</p><div className="mt-24 border-t border-white/10">{projects.map(p=><Link key={p.slug} href={`/work/${p.slug}`} className="grid gap-8 border-b border-white/10 py-12 hover:bg-white/[.025] md:grid-cols-[100px_1fr_1fr_auto]"><span className="text-xs text-white/25">{p.number}</span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">{p.category}</p><h2 className="mt-5 max-w-xl text-2xl font-medium tracking-[-.04em] md:text-4xl">{p.title}</h2></div><p className="max-w-md text-sm leading-7 text-white/40">{p.shortDescription}</p><span className="text-lg text-white/30">↗</span></Link>)}</div></div></main>
}