"use client";
import { useState } from "react";

const steps=[
 {n:"01",name:"SEE",title:"Understand what is actually happening.",body:"Before changing anything, look at how information, people and processes actually move through the business.",items:["Map the current workflow","Identify bottlenecks","Find information gaps","Understand dependencies"]},
 {n:"02",name:"FIX",title:"Remove unnecessary friction.",body:"Not every problem needs software. Sometimes the best solution is simply a better process.",items:["Remove unnecessary steps","Clarify responsibilities","Standardize repetitive work","Simplify decision paths"]},
 {n:"03",name:"BUILD",title:"Create what the business is missing.",body:"Once the process makes sense, design the systems, tools and workflows that make it easier to operate.",items:["Digital workspaces","Dashboards","Internal tools","Automated workflows"]},
 {n:"04",name:"IMPROVE",title:"Make the system better over time.",body:"A solution is not finished simply because it works. It should become clearer, faster and more useful as the business evolves.",items:["Measure what matters","Review performance","Refine workflows","Keep improving"]}
];

export function ApproachSection(){
 const [active,setActive]=useState(0); const s=steps[active];
 return <section className="border-t border-white/10 px-6 py-32 lg:px-10 lg:py-48"><div className="mx-auto max-w-[1600px]">
  <Label n="02" text="The approach"/>
  <div className="grid gap-20 lg:grid-cols-[.8fr_1.2fr]">
   <div><p className="mb-8 max-w-xs text-sm leading-6 text-white/40">Good systems don&apos;t start with software. They start with understanding.</p><h2 className="display-sm">UNDERSTAND<br/>THE SYSTEM.<br/><span className="text-white/25">FIX THE<br/>FRICTION.</span></h2></div>
   <div className="lg:pt-32"><div className="border-t border-white/10">{steps.map((x,i)=><button key={x.name} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} className="block w-full border-b border-white/10 text-left">
    <div className="flex items-center justify-between py-6"><div className="flex items-center gap-6"><span className={i===active?"text-[var(--accent)]":"text-white/25"}>{x.n}</span><span className={`text-2xl tracking-[-.03em] md:text-3xl ${i===active?"text-white":"text-white/45"}`}>{x.name}</span></div><span className={i===active?"text-[var(--accent)]":"text-white/15"}>↗</span></div>
    {i===active && <div className="grid gap-8 pb-8 md:grid-cols-[1fr_auto]"><div><h3 className="max-w-lg text-xl text-white/90">{s.title}</h3><p className="mt-4 max-w-lg text-sm leading-6 text-white/40">{s.body}</p></div><ul className="space-y-2 text-xs text-white/35">{s.items.map(a=><li key={a}><span className="text-[var(--accent)]">+</span> {a}</li>)}</ul></div>}
   </button>)}</div></div>
  </div>
 </div></section>;
}
function Label({n,text}:{n:string;text:string}){return <div className="mb-20 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/40"><span className="text-[var(--accent)]">{n}</span><span>/</span><span>{text}</span></div>}
