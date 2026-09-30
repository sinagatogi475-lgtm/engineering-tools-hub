export type AnalyticsEvent="calculator_used"|"calculator_completed"|"copy_result"|"search_used"|"affiliate_click";
export function trackEvent(event:AnalyticsEvent,properties:Record<string,string|number|boolean>={}){
 if(typeof window==="undefined") return;
 const hook=(window as Window & {engineeringToolsAnalytics?: (event:AnalyticsEvent,properties:Record<string,string|number|boolean>)=>void}).engineeringToolsAnalytics;
 if(hook) hook(event,properties);
}
