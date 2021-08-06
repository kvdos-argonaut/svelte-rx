import{BehaviorSubject,of,Subject,isObservable}from"rxjs";import{switchMap,scan,distinctUntilChanged,multicast,refCount}from"rxjs/operators";import{getContext,setContext}from"svelte";const MODELKEY="undefined"!=typeof Symbol?Symbol("@@svelte-rxflux/store"):"@@svelte-rxflux/store";export const createStore=(t,e)=>{const o=new BehaviorSubject(e),r=new Subject;return[r.pipe(switchMap((t=>isObservable(t)?t:of(t))),scan(t,e),distinctUntilChanged(),multicast(o),refCount()),t=>{r.next(t)}]};export const withMiddleware=(t,e)=>(...o)=>{const[r,n]=createStore(t,e);if(!Array.isArray(o)||0===o.length)return[r,n];let s=t=>{throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")};const c={getState:(t=>{let e;return t.subscribe((t=>{e=t})),()=>e})(r),dispatch:t=>s(t)};return s=o.map((t=>t(c))).reduce(((t,e)=>e(t)),n),[r,s]};export const provideStore=t=>{setContext(MODELKEY,t)};export const useStore=()=>{const t=getContext(MODELKEY);if(null==t)throw new Error("Context not found. Please ensure you provide the store using the `provideStore` function or the `ProvideStore` component.");return t};const prinf=(t,e,o)=>{console.group(e,"@"+(new Date).toISOString()),console.log("%cprev state","color:#9E9E9E",t),console.log("%caction","color:#2196F3",e),console.log("%cnext state","color:#4CAF50",o),console.groupEnd()};export const logger=({getState:t})=>e=>o=>{const r=t(),n=e(o);return prinf(r,o.type,t()),n};