import Link from "next/link";
import {notFound} from "next/navigation";
import {categories,tools,type CategoryId} from "@/data/tools";
type Props={params:Promise<{category:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return categories.map(c=>({category:c.id}))}
export default async function CategoryPage({params}:Props){
 const id=(await params).category as CategoryId;const c=categories.find(x=>x.id===id);if(!c)return notFound();const list=tools.filter(t=>t.category===id);
 return <article><p className="text-sm font-semibold uppercase text-blue-600">{c.name}</p><h1 className="mt-2 text-3xl font-bold">{c.name} Calculators</h1><p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{c.description} Browse the available tools below.</p><ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(t=><li key={t.slug} className="rounded-2xl border p-5 dark:border-slate-700"><h2 className="font-semibold">{t.name}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.description}</p><Link className="mt-4 inline-block text-blue-600" href={`/tools/${t.slug}`}>Open calculator →</Link></li>)}</ul></article>
}
