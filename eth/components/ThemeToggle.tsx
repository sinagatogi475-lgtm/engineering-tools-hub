"use client";
import { useEffect, useState } from "react";
type Theme = "light"|"dark"|"system";
export default function ThemeToggle() {
  const [theme,setTheme]=useState<Theme>("system");
  useEffect(()=>{ const saved=(localStorage.getItem("theme") as Theme|null)||"system"; setTheme(saved); apply(saved); },[]);
  function apply(t:Theme){ const dark=t==="dark" || (t==="system" && window.matchMedia("(prefers-color-scheme: dark)").matches); document.documentElement.classList.toggle("dark",dark); }
  function change(t:Theme){ setTheme(t); localStorage.setItem("theme",t); apply(t); }
  return <label className="flex items-center gap-2 text-sm"><span className="sr-only">Theme</span><select aria-label="Theme" value={theme} onChange={e=>change(e.target.value as Theme)} className="rounded-lg border border-slate-300 bg-white px-2 py-2 dark:border-slate-600 dark:bg-slate-800"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
