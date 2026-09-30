import Link from "next/link";
export default function Breadcrumbs({category,name}:{category:string;name:string}){
 const label=category.replace(/^./,c=>c.toUpperCase());
 return <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500"><ol className="flex flex-wrap gap-2"><li><Link href="/">Home</Link></li><li aria-hidden="true">›</li><li><Link href="/tools">{label}</Link></li><li aria-hidden="true">›</li><li aria-current="page">{name}</li></ol></nav>;
}
