import {useSyncExternalStore} from 'react';
export const STAGES=['New','Contacted','Qualified','Consultation Scheduled','Quotation Sent','Negotiation','Won','Lost'] as const;
export const TYPES=['Complete Home Interiors','Modular Kitchen','Bedroom Interiors','Living Room','Office Interiors','Commercial Interiors','Renovation','Other'];
export const PROPS=['2 BHK','3 BHK','4 BHK','Villa','Independent House','Office','Commercial Space'];
export const LOCS=['Kokapet','Narsingi','Gachibowli','Kondapur','Manikonda','Tellapur','Financial District','Miyapur','Jubilee Hills','Banjara Hills'];
export const SOURCES=['Google Search','Website','Referral','Instagram','Direct Calls'];
export const FU_TYPES=['Phone Call','Email','Site Visit','Consultation','Quotation Follow-up','General Follow-up'];
export const MODES=['Office Meeting','Video Consultation','Site Visit','Phone Consultation'];
export const Q_STATUS=['Draft','Sent','Viewed','Accepted','Rejected','Expired'];
export const P_STATUS=['Not Started','Planning','In Progress','On Hold','Completed'];
export interface Lead{id:string;name:string;phone:string;email:string;type:string;property:string;location:string;budget:number;timeline:number;source:string;owner:string;stage:string;score:number;created:string;lastContact:string;nextFollowup:string;requirements:string;notes:string[]}
export interface DB{leads:Lead[];followups:any[];consults:any[];quotes:any[];projects:any[];team:any[];activity:any[];gst:number;company:string}
const day=(n:number)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
export function scoreLead(l:Partial<Lead>){const r:[string,number,number][]=[];const b=l.budget||0;
r.push(['Budget fit',b>=1500000?30:b>=800000?22:b>=400000?15:8,30]);const t=l.timeline??120;r.push(['Purchase timeline',t<=30?25:t<=60?18:t<=90?10:4,25]);
r.push(['Project clarity',(l.requirements?.length||0)>10?20:13,20]);
const age=l.lastContact?(Date.now()-new Date(l.lastContact).getTime())/864e5:99;r.push(['Engagement',age<=7?15:age<=14?9:3,15]);
const si=STAGES.indexOf(l.stage as any);r.push(['Decision readiness',si>=3&&si<7?10:si>=1?6:2,10]);
const total=r.reduce((a,x)=>a+x[1],0);return{total,reasons:r,label:total>=80?'Hot':total>=60?'Warm':'Cold'}}
const N=['Ananya Rao','Rahul Sharma','Priya Varma','Sandeep Reddy','Meera Nair','Arjun Kumar','Divya Menon','Karthik Reddy','Sneha Iyer','Rohit Kapoor','Vikram Naidu','Lakshmi Prasad','Harsha Vardhan','Pooja Bhat','Naveen Goud','Aditi Joshi','Suresh Babu','Kavya Shetty','Manoj Tiwari','Swathi Chowdary','Imran Khan','Deepika Rao','Anil Kumar','Rekha Pillai','Gaurav Jain','Nikhil Reddy','Shruti Menon','Ramesh Naik','Tanvi Desai','Varun Sethi'];
const SP=['New','Contacted','Qualified','Won','Consultation Scheduled','Quotation Sent','Negotiation','Won','Lost','Won'];
const BUD=[1800000,450000,2200000,900000,600000,3500000,1200000,2800000,700000,1500000];
function seed():DB{
const team=[['Arjun Mehta','Sales Manager'],['Priya Reddy','Interior Designer'],['Karthik Rao','Sales Executive'],['Sneha Sharma','Senior Designer'],['Rahul Varma','Sales Executive'],['Neha Kapoor','Project Coordinator']].map(([name,role],i)=>({id:'e'+i,name,role,email:name.toLowerCase().replace(' ','.')+'@vertexinteriors.example'}));
const sales=['Karthik Rao','Rahul Varma','Arjun Mehta'];
const leads:Lead[]=N.map((name,i)=>{const l:any={id:'L'+(1001+i),name,phone:'+91 90000 '+String(10000+i*137).slice(0,5),email:name.toLowerCase().replace(' ','.')+'@mail.example',type:TYPES[i%8],property:PROPS[i%7],location:LOCS[i%10],budget:BUD[i%10],timeline:[30,60,90,120][i%4],source:SOURCES[[0,0,1,2,3,0,1,2,4,1][i%10]],owner:sales[i%3],stage:SP[i%10],created:day(-i),lastContact:day(-(i%12)),nextFollowup:day((i%9)-3),requirements:'Requirement notes for '+name+'.',notes:[]};
if(i==0)Object.assign(l,{type:TYPES[0],property:'3 BHK',location:'Kokapet',budget:1800000,timeline:30,source:'Google Search',owner:'Karthik Rao',stage:'Qualified',lastContact:day(-1)});
if(i==1)Object.assign(l,{type:'Modular Kitchen',property:'3 BHK',location:'Narsingi',budget:450000,timeline:60,source:'Referral',owner:'Arjun Mehta',stage:'Quotation Sent'});
if(['Won','Lost'].includes(l.stage))l.nextFollowup='';l.score=scoreLead(l).total;return l});
const act:any[]=[];const mk=(l:Lead,text:string,off:number)=>act.push({id:'a'+act.length,leadId:l.id,text,at:day(off)});
leads.forEach((l,i)=>{mk(l,'Enquiry created via '+l.source,-i);if(i<18)mk(l,'Moved to '+l.stage,-Math.max(0,i-1))});
const fl=leads.slice(0,20).map((l,i)=>({id:'f'+i,leadId:l.id,date:l.nextFollowup||day(2),time:'11:00',kind:FU_TYPES[i%6],priority:['High','Medium','Low'][i%3],note:'Check in with '+l.name,done:i%5==0}));
const cl=leads.filter(l=>!['New','Lost'].includes(l.stage)).slice(0,12);
const consults=cl.map((l,i)=>({id:'c'+i,leadId:l.id,date:day(i-5),time:(10+i%6)+':00',designer:['Priya Reddy','Sneha Sharma'][i%2],mode:MODES[i%4],status:i<5?'Completed':'Scheduled',note:''}));
const quotes=leads.filter(l=>['Quotation Sent','Negotiation','Won'].includes(l.stage)).slice(0,12).map((l,i)=>({id:'q'+i,no:'VI-Q-'+(2001+i),leadId:l.id,items:[{d:'Design fees',q:1,u:'lot',p:Math.round(l.budget*.1)},{d:l.type,q:1,u:'lot',p:Math.round(l.budget*.7)},{d:'Installation',q:1,u:'lot',p:Math.round(l.budget*.2)}],status:l.stage==='Won'?'Accepted':['Sent','Viewed','Sent'][i%3],issued:day(-i-2),owner:l.owner}));
const projects=leads.filter(l=>l.stage==='Won').slice(0,8).map((l,i)=>({id:'P-'+(301+i),leadId:l.id,name:l.type+' — '+l.location,value:l.budget,start:day(-20+i*3),end:day(60+i*5),manager:'Neha Kapoor',status:P_STATUS[1+i%3],progress:10+i*9,paid:Math.round(l.budget*(.2+(i%3)*.2))}));
return{leads,followups:fl,consults,quotes,projects,team,activity:act,gst:18,company:'Vertex Interiors'}}
const KEY='interiorflow.v1';let db:DB=(()=>{try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch{}return seed()})();
const subs=new Set<()=>void>();const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}subs.forEach(s=>s())};
export function update(fn:(d:DB)=>void){db=structuredClone(db);fn(db);save()}
export const resetDemo=()=>{db=seed();save()};
export const useDB=()=>useSyncExternalStore(cb=>{subs.add(cb);return()=>{subs.delete(cb)}},()=>db);
export const uid=(p:string)=>p+Math.random().toString(36).slice(2,8);
export const log=(d:DB,leadId:string,text:string)=>d.activity.unshift({id:uid('a'),leadId,text,at:day(0)});
export const rescore=(l:Lead)=>{l.score=scoreLead(l).total};
export function setStage(d:DB,id:string,stage:string){const l=d.leads.find(x=>x.id===id)!;if(l.stage===stage)return;l.stage=stage;l.lastContact=day(0);rescore(l);log(d,id,'Moved to '+stage)}
export const qTotals=(items:any[],gst:number)=>{const sub=items.reduce((a,i)=>a+i.q*i.p,0);const tax=sub*gst/100;return{sub,tax,total:sub+tax}};
