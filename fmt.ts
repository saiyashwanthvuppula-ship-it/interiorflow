import {format,parseISO} from 'date-fns';
export const inr=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
export const short=(n:number)=>n>=1e7?`₹${(n/1e7).toFixed(2)} Cr`:n>=1e5?`₹${(n/1e5).toFixed(2)} L`:inr(n);
export const dt=(s?:string)=>s?format(parseISO(s),'dd MMM yyyy'):'—';
export const today=()=>new Date().toISOString().slice(0,10);
export const csv=(name:string,rows:any[])=>{if(!rows.length)return;const k=Object.keys(rows[0]);const t=[k.join(','),...rows.map(r=>k.map(c=>JSON.stringify(r[c]??'')).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name+'.csv';a.click();};
