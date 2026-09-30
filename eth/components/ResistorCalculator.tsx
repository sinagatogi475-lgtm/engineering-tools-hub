"use client";
import {useState} from "react";
import {COLORS,decodeResistor} from "@/lib/calculators/resistor";
const swatches:Record<string,string>={black:"#111",brown:"#7b3f00",red:"#d22",orange:"#f80",yellow:"#edc400",green:"#228b22",blue:"#2670c9",violet:"#7d3fb2",gray:"#888",white:"#fff",gold:"#d4af37",silver:"#aaa"};
export default function ResistorCalculator(){
 const [bands,setBands]=useState(["brown","black","red","gold","black","brown"]);
 const [count,setCount]=useState(4);
 const [result,setResult]=useState(()=>decodeResistor(bands.slice(0,4)));
 function calc(){setResult(decodeResistor(bands.slice(0,count)))}
 return <div className="rounded-2xl border p-5 shadow-sm dark:border-slate-700">
  <div className="flex gap-2"><button type="button" onClick={()=>setCount(4)} className={`rounded-lg px-3 py-2 ${count===4?"bg-blue-600 text-white":"border"}`}>4-band</button><button type="button" onClick={()=>setCount(5)} className={`rounded-lg px-3 py-2 ${count===5?"bg-blue-600 text-white":"border"}`}>5-band</button><button type="button" onClick={()=>setCount(6)} className={`rounded-lg px-3 py-2 ${count===6?"bg-blue-600 text-white":"border"}`}>6-band</button></div>
  <div className="my-6 flex justify-center"><div className="relative flex h-16 w-72 items-center justify-center rounded-xl border-2 bg-amber-100"><div className="absolute left-0 h-2 w-full bg-slate-500"></div><div className="z-10 flex gap-5">{bands.slice(0,count).map((b,i)=><div key={i} style={{backgroundColor:swatches[b]}} className="h-16 w-4 border border-slate-500" aria-label={`Band ${i+1}: ${b}`}></div>)}</div></div></div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bands.slice(0,count).map((b,i)=><label key={i} className="text-sm font-medium">Band {i+1}<select value={b} onChange={e=>{const x=[...bands];x[i]=e.target.value;setBands(x)}} className="mt-1 w-full rounded-lg border bg-white p-3 dark:border-slate-600 dark:bg-slate-800">{COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select></label>)}</div>
  <button type="button" onClick={calc} className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Calculate</button>
  {result.ok&&<div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><strong className="text-2xl">{result.lines[0].value} Ω</strong>{result.lines.slice(1).map(l=><p key={l.label}>{l.label}: {l.value} {l.unit}</p>)}</div>}{!result.ok&&<p role="alert" className="mt-4 text-red-600">{result.error}</p>}
 </div>;
}
