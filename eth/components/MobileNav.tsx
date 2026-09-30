"use client";
import Link from "next/link";
import { useState } from "react";
export default function MobileNav(){
 const [open,setOpen]=useState(false);
 return <div className="md:hidden"><button aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)} className="rounded-lg border px-3 py-2">☰ <span className="sr-only">Menu</span></button>{open&&<nav id="mobile-menu" className="absolute left-0 right-0 z-20 border-b bg-white p-4 shadow dark:bg-slate-900"><div className="flex flex-col gap-3"><Link onClick={()=>setOpen(false)} href="/">Home</Link><Link onClick={()=>setOpen(false)} href="/tools">All Tools</Link><Link onClick={()=>setOpen(false)} href="/about">About</Link><Link onClick={()=>setOpen(false)} href="/contact">Contact</Link></div></nav>}</div>;
}
