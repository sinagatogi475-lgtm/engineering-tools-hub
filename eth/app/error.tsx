"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return (<div className="py-16 text-center"><h1 className="text-3xl font-bold">Something went wrong</h1><button className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white" onClick={reset}>Try again</button></div>); }
