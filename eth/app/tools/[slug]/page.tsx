import type {Metadata} from "next";
import {notFound} from "next/navigation";
import ToolRunner from "@/components/ToolRunner";
import UnitConverter from "@/components/UnitConverter";
import ResistorCalculator from "@/components/ResistorCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";
import ToolContent from "@/components/ToolContent";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateProductSection from "@/components/AffiliateProductSection";
import {getTool,tools} from "@/data/tools";
type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return tools.map(t=>({slug:t.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const t=getTool((await params).slug);if(!t)return{};return{title:t.seoTitle,description:t.seoDescription,alternates:{canonical:`/tools/${t.slug}`},openGraph:{title:t.seoTitle,description:t.seoDescription,url:`/tools/${t.slug}`,type:"website"}}}
export default async function ToolPage({params}:Props){
 const t=getTool((await params).slug);if(!t)notFound();
 const related=tools.filter(x=>x.slug!==t.slug&&(x.category===t.category||x.keywords.some(k=>t.keywords.includes(k)))).slice(0,4);
 const structured={"@context":"https://schema.org","@type":"SoftwareApplication","name":t.name,"applicationCategory":"UtilitiesApplication","operatingSystem":"Web","description":t.description,"url":`/tools/${t.slug}`};
 return <article className="mx-auto max-w-4xl"><Breadcrumbs category={t.category} name={t.name}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/><h1 className="text-3xl font-bold sm:text-4xl">{t.name}</h1><p className="mb-6 mt-2 text-lg text-slate-600 dark:text-slate-300">{t.description}</p><AdPlaceholder/>{t.custom==="converter"?<UnitConverter/>:t.custom==="resistor"?<ResistorCalculator/>:<ToolRunner tool={t}/>}<AdPlaceholder/><ToolContent tool={t} related={related}/><AffiliateProductSection kind={t.category==="energy"?"solar":t.category==="electrical"||t.category==="electronics"?"electrical":"engineering"}/><AdPlaceholder label="Advertisement placement"/></article>
}
