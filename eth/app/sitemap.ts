import type {MetadataRoute} from "next";
import {tools} from "@/data/tools";
export default function sitemap():MetadataRoute.Sitemap{
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 return [{url:base,changeFrequency:"weekly",priority:1},{url:`${base}/tools`,changeFrequency:"weekly",priority:.9},...tools.map(t=>({url:`${base}/tools/${t.slug}`,changeFrequency:"monthly" as const,priority:.8})),...["about","contact","privacy-policy","terms"].map(x=>({url:`${base}/${x}`,changeFrequency:"yearly" as const,priority:.3}))];
}
