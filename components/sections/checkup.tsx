"use client";
import { useMemo, useState } from "react";

const questions=[
 ["Where does most operational friction show up?","Information is hard to find","Too much repetitive work","Processes are unclear","Reporting takes too long"],
 ["How standardized are your core processes?","Mostly ad hoc","Some documentation","Mostly standardized","Very standardized"],
 ["How connected are your tools?","Mostly separate","A few integrations","Well connected","Highly connected"],
 ["How much visibility do you have?","Very little","Some reporting","Good visibility","Real-time visibility"]
] as const;

export function CheckupSection(){
 const [step,setStep]=useState(0); const [answers,setAnswers]=useState<number[]>([]);
 const done=step===questions.length;
 const score=useMemo(()=>answers.reduce((a,b)=>a+b,0),[answers]);
 return <section className="border-t border-white/10 px-6 py-32 lg:px-10 lg:py-48"><div className="mx-auto max-w-[1600px]">
  <div className="grid gap-20 lg:grid-cols-[.8fr_1.2fr]">
   <div><p className="mb-8 text-[11px] uppercase tracking-[.22em] text-white/35">05 / Business checkup</p><h2 className="display-sm">HOW HEALTHY<br/>IS YOUR<br/><span className="text-white/25">OPERATING SYSTEM?</span></h2><p className="mt-10 max-w-md text-base leading-7 text-white/45">A quick self-assessment to identify where operational friction may be hiding.</p></div>
   <div className="lg:pt-24">{done?<div className="border border-white/10 p-8 md:p-12"><p className="text-xs uppercase tracking-[.18em] text-[var(--accent)]">Assessment complete</p><p className="mt-8 text-5xl tracking-[-.05em]">{score} / {questions.length*3}</p><p className="mt-6 max-w-lg text-sm leading-7 text-white/45">{score <= 5 ? "There are several areas worth examining. Start with the process creating the most repeated friction." : score <= 9 ? "The foundation is there, but a few systems may be creating avoidable drag." : "Your operating foundation looks relatively mature. The opportunity may be optimization rather than basic structure."}</p><a href="/contact" className="mt-10 inline-block border-b border-[var(--accent)] pb-1 text-sm">Talk through the result →</a><button onClick={()=>{setStep(0);setAnswers([])}} className="ml-6 text-sm text-white/35 hover:text-white">Reset</button></div>
   :<div className="border-t border-white/10"><div className="flex justify-between py-5 text-xs text-white/30"><span>Question {step+1} / {questions.length}</span><span>{Math.round(step/questions.length*100)}%</span></div><h3 className="py-8 text-2xl tracking-[-.03em]">{questions[step][0]}</h3>{questions[step].slice(1).map((q,i)=><button key={q} onClick={()=>{setAnswers([...answers,i]);setStep(step+1)}} className="group flex w-full items-center justify-between border-b border-white/10 py-5 text-left text-white/55 hover:text-white"><span>{q}</span><span className="text-[var(--accent)] opacity-40 group-hover:opacity-100">→</span></button>)}</div>}</div>
  </div>
 </div></section>;
}