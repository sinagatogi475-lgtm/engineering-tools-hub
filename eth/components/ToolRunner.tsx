"use client";
import {useMemo,useState} from "react";
import {formatRupiah} from "@/lib/calculators/energyCost";
import type {Result} from "@/lib/calculators/result";
import type {Tool} from "@/data/tools";
import {trackEvent} from "@/lib/analytics";
const fmt=(v:number,u:string)=>u==="Rp"?formatRupiah(v):new Intl.NumberFormat("id-ID",{maximumSignificantDigits:7}).format(v)+(u?" "+u:"");
const input="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base dark:border-slate-600 dark:bg-slate-800";
export default function ToolRunner({tool}:{tool:Tool}){
 const initial=useMemo(()=>Object.fromEntries((tool.fields||[]).map(f=>[f.key,f.defaultValue??""])),[tool]);
 const [vals,setVals]=useState<Record<string,string>>(initial);const [result,setResult]=useState<Result|null>(null);const [copied,setCopied]=useState(false);
 function calculate(){trackEvent("calculator_used",{tool:tool.slug});const r=tool.run?tool.run(vals):null;setResult(r);if(r?.ok)trackEvent("calculator_completed",{tool:tool.slug});setCopied(false)}
 const text=result?.ok?result.lines.map(l=>`${l.label}: ${fmt(l.value,l.unit)}`).join("\n"):"";
 return <form onSubmit={e=>{e.preventDefault();calculate()}} className="rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700">
  <div className="grid gap-4 sm:grid-cols-2">{(tool.fields||[]).map(field=><label key={field.key} className="block text-sm font-medium">{field.label}{field.unit?` (${field.unit})`:""}{field.optional?<span className="ml-1 text-slate-500">(optional)</span>:null}
   {field.options?<select aria-label={field.label} className={input} value={vals[field.key]??""} onChange={e=>setVals({...vals,[field.key]:e.target.value})}>{field.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:
   <input aria-label={field.label} className={input} inputMode="decimal" autoComplete="off" value={vals[field.key]??""} onChange={e=>setVals({...vals,[field.key]:e.target.value})} />}
  </label>)}</div>
  <div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Calculate</button><button type="button" className="rounded-lg border px-5 py-3 dark:border-slate-600" onClick={()=>{setVals(initial);setResult(null)}}>Reset</button></div>
  <div aria-live="polite" className="mt-5">{result&&!result.ok&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">{result.error}</p>}
  {result?.ok&&<section aria-label="Calculation result" className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs font-semibold tracking-wide text-slate-500">RESULT</p><p className="mt-1 text-3xl font-bold">{fmt(result.lines[0].value,result.lines[0].unit)}</p><ul className="mt-3 space-y-1 text-sm">{result.lines.slice(1).map(l=><li key={l.label+l.unit}>{l.label}: <strong>{fmt(l.value,l.unit)}</strong></li>)}</ul><p className="mt-3 text-sm text-slate-500">Formula: {result.formula}</p><button type="button" className="mt-3 rounded-lg border px-4 py-2 text-sm dark:border-slate-600" onClick={()=>{if(navigator.clipboard){void navigator.clipboard.writeText(text).then(()=>{setCopied(true);trackEvent("copy_result",{tool:tool.slug})})}}}>{copied?"Copied":"Copy Result"}</button></section>}</div>
 </form>
}
