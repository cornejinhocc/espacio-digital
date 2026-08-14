const items=[
 ["01","OPERATIONS","Make the work make sense.","Process mapping","Workflow design","Documentation","Reporting"],
 ["02","SYSTEMS","Put information where it belongs.","Digital workspaces","Dashboards","Information systems","Internal tools"],
 ["03","AUTOMATION","Stop doing work a system can do.","Workflow automation","Integrations","AI-assisted processes","Notifications"]
] as const;

export function DisciplinesSection(){
 return <section className="border-t border-white/10 px-6 py-32 lg:px-10 lg:py-48"><div className="mx-auto max-w-[1600px]">
  <Label n="03" text="What I work on"/>
  <div className="mb-24 max-w-5xl"><h2 className="display-sm">PROCESS.<br/>SYSTEMS.<br/><span className="text-white/25">TECHNOLOGY.</span></h2><p className="mt-10 max-w-xl text-base leading-7 text-white/45">The right solution is rarely just a piece of software. It is usually a combination of better thinking, better processes and the right technology.</p></div>
  <div className="border-t border-white/10">{items.map(([n,name,statement,...tags])=><article key={name} className="grid gap-8 border-b border-white/10 py-12 md:grid-cols-[100px_.8fr_1fr]">
   <div className="text-xs text-white/25">{n}</div><div><h3 className="text-3xl tracking-[-.04em] hover:text-[var(--accent)]">{name}</h3><p className="mt-3 text-sm text-white/35">{statement}</p></div>
   <div className="grid gap-8 md:grid-cols-[1fr_auto]"><p className="max-w-lg text-sm leading-7 text-white/45">{description(name)}</p><ul className="space-y-2 text-xs text-white/30">{tags.map(t=><li key={t}>+ {t}</li>)}</ul></div>
  </article>)}</div>
 </div></section>;
}
function description(name:string){return name==="OPERATIONS"?"Look at how work actually moves through the business and make the process clearer, simpler and easier to manage.":name==="SYSTEMS"?"Organize the information, tools and workflows people need to run the business without constantly searching, copying or asking.":"Once a process is clear, find repetitive work that can be connected, automated or assisted by technology."}
function Label({n,text}:{n:string;text:string}){return <div className="mb-20 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/40"><span className="text-[var(--accent)]">{n}</span><span>/</span><span>{text}</span></div>}
