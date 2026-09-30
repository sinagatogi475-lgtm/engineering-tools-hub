import Link from "next/link";
export default function NotFound() { return (<div className="py-16 text-center"><h1 className="text-3xl font-bold">Page not found</h1><p className="mt-2">That page does not exist.</p><Link href="/tools" className="mt-4 inline-block underline">Browse all tools</Link></div>); }
