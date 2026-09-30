import type {Metadata} from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
export const metadata:Metadata={
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"),
 title:{default:"Engineering Tools Hub – Free Engineering Calculators",template:"%s | Engineering Tools Hub"},
 description:"Free engineering calculators for electrical, electronics, power, energy and technical calculations.",
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en" suppressHydrationWarning><body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"><header className="border-b border-slate-200 dark:border-slate-700"><nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><div className="flex items-center gap-6"><Link href="/" className="text-lg font-bold">Engineering Tools Hub</Link><div className="hidden items-center gap-5 md:flex"><Link href="/">Home</Link><Link href="/tools">All Tools</Link><Link href="/category/electrical">Electrical</Link><Link href="/category/power">Power</Link><Link href="/category/energy">Energy</Link></div></div><div className="flex items-center gap-3"><ThemeToggle/><MobileNav/></div></nav></header><main className="mx-auto max-w-6xl px-4 py-8">{children}</main><footer className="mt-10 border-t border-slate-200 py-8 dark:border-slate-700"><div className="mx-auto grid max-w-6xl gap-6 px-4 text-sm md:grid-cols-3"><div><strong>Engineering Tools Hub</strong><p className="mt-2 text-slate-500">Free engineering calculators and tools for students, engineers and technicians.</p></div><div><strong>Explore</strong><div className="mt-2 flex flex-col gap-1"><Link href="/tools">All Tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div></div><div><strong>Legal</strong><div className="mt-2 flex flex-col gap-1"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link></div></div></div><p className="mt-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} Engineering Tools Hub.</p></footer></body></html>
}
