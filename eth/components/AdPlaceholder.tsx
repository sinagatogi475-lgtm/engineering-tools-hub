export default function AdPlaceholder({label="Advertisement"}:{label?:string}){
 return <div aria-label={label} className="my-6 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">{label} — AdSense placement</div>;
}
