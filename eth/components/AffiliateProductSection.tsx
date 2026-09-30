const products = {
 electrical:["Digital Multimeter","Clamp Meter","Electrical Tester","Oscilloscope"],
 solar:["Solar Panel","Solar Charge Controller","Inverter","Battery"],
 engineering:["Scientific Calculator","Soldering Station","Measuring Tools"]
};
export default function AffiliateProductSection({kind="engineering"}:{kind?:keyof typeof products}){
 return <section className="my-8 rounded-2xl border p-5 dark:border-slate-700"><h2 className="text-xl font-semibold">Recommended Engineering Products</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Product links can be connected to your preferred affiliate program later.</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{products[kind].map(x=><li key={x} className="rounded-xl border p-4 dark:border-slate-700"><span className="font-medium">{x}</span><span className="mt-1 block text-xs text-slate-500">Affiliate link placeholder</span></li>)}</ul><p className="mt-4 text-xs text-slate-500">Some links may be affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.</p></section>;
}
