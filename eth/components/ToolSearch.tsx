"use client";
import Link from "next/link";
import {useState} from "react";
import {searchTools} from "@/data/tools";
import {trackEvent} from "@/lib/analytics";
export default function ToolSearch(){
 const [q,setQ]=useState("");const list=searchTools(q);
 function change(v:string){setQ(v);if(v.trim())trackEvent("search_used",{query:v})}
 return <div><label htmlFor="tool-search" className="sr-only">Search engineering tools</label><input id="tool-search" type="search" value={q} onChange={e=>change(e.target.value)} placeholder="Search engineering tools..." className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-lg dark:border-slate-600 dark:bg-slate-800"/>{list.length===0?<p className="mt-6 text-slate-500">No tools found for “{q}”. Try “ohm”, “power” or “battery”.</p>:<ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(t=><li key={t.slug} className="rounded-2xl border p-5 shadow-sm dark:border-slate-700"><p className="text-xs font-semibold uppercase text-blue-600">{t.category}</p><h3 className="mt-1 text-lg font-semibold">{t.name}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.description}</p><Link href={`/tools/${t.slug}`} className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">Calculate</Link></li>)}</ul>}</div>
}
