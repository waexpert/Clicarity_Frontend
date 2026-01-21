import{d as me,r as a,j as e,a3 as ee,H as q,R as G,G as U,M as Pe,Q as A,a4 as pe,K as ue,a5 as De,N as ze,a6 as Ge,a7 as Le,Z as xe,a as Oe,L as E,b as le,a2 as Ue,a8 as ne,a9 as re,aa as oe,ab as ie,ac as se,ad as ae}from"./index-DppSODb2.js";import{S as Y}from"./send-BSz07UNc.js";/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],de=me("chevrons-up-down",Be);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Ke=me("circle",He);var $e=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],B=$e.reduce((t,n)=>{const i=ee(`Primitive.${n}`),r=a.forwardRef((s,u)=>{const{asChild:x,...h}=s,p=x?i:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),e.jsx(p,{...h,ref:u})});return r.displayName=`Primitive.${n}`,{...t,[n]:r}},{});function qe(t){const n=t+"CollectionProvider",[i,r]=q(n),[s,u]=i(n,{collectionRef:{current:null},itemMap:new Map}),x=y=>{const{scope:d,children:C}=y,b=G.useRef(null),v=G.useRef(new Map).current;return e.jsx(s,{scope:d,itemMap:v,collectionRef:b,children:C})};x.displayName=n;const h=t+"CollectionSlot",p=ee(h),g=G.forwardRef((y,d)=>{const{scope:C,children:b}=y,v=u(h,C),R=U(d,v.collectionRef);return e.jsx(p,{ref:R,children:b})});g.displayName=h;const m=t+"CollectionItemSlot",c="data-radix-collection-item",f=ee(m),l=G.forwardRef((y,d)=>{const{scope:C,children:b,...v}=y,R=G.useRef(null),F=U(d,R),P=u(m,C);return G.useEffect(()=>(P.itemMap.set(R,{ref:R,...v}),()=>void P.itemMap.delete(R))),e.jsx(f,{[c]:"",ref:F,children:b})});l.displayName=m;function S(y){const d=u(t+"CollectionConsumer",y);return G.useCallback(()=>{const b=d.collectionRef.current;if(!b)return[];const v=Array.from(b.querySelectorAll(`[${c}]`));return Array.from(d.itemMap.values()).sort((P,L)=>v.indexOf(P.ref.current)-v.indexOf(L.ref.current))},[d.collectionRef,d.itemMap])}return[{Provider:x,Slot:g,ItemSlot:l},S,r]}var Q="rovingFocusGroup.onEntryFocus",We={bubbles:!1,cancelable:!0},K="RovingFocusGroup",[te,fe,Ve]=qe(K),[Ye,he]=q(K,[Ve]),[Qe,Je]=Ye(K),ge=a.forwardRef((t,n)=>e.jsx(te.Provider,{scope:t.__scopeRovingFocusGroup,children:e.jsx(te.Slot,{scope:t.__scopeRovingFocusGroup,children:e.jsx(Xe,{...t,ref:n})})}));ge.displayName=K;var Xe=a.forwardRef((t,n)=>{const{__scopeRovingFocusGroup:i,orientation:r,loop:s=!1,dir:u,currentTabStopId:x,defaultCurrentTabStopId:h,onCurrentTabStopIdChange:p,onEntryFocus:g,preventScrollOnEntryFocus:m=!1,...c}=t,f=a.useRef(null),l=U(n,f),S=pe(u),[y,d]=ue({prop:x,defaultProp:h??null,onChange:p,caller:K}),[C,b]=a.useState(!1),v=De(g),R=fe(i),F=a.useRef(!1),[P,L]=a.useState(0);return a.useEffect(()=>{const N=f.current;if(N)return N.addEventListener(Q,v),()=>N.removeEventListener(Q,v)},[v]),e.jsx(Qe,{scope:i,orientation:r,dir:S,loop:s,currentTabStopId:y,onItemFocus:a.useCallback(N=>d(N),[d]),onItemShiftTab:a.useCallback(()=>b(!0),[]),onFocusableItemAdd:a.useCallback(()=>L(N=>N+1),[]),onFocusableItemRemove:a.useCallback(()=>L(N=>N-1),[]),children:e.jsx(B.div,{tabIndex:C||P===0?-1:0,"data-orientation":r,...c,ref:l,style:{outline:"none",...t.style},onMouseDown:A(t.onMouseDown,()=>{F.current=!0}),onFocus:A(t.onFocus,N=>{const T=!F.current;if(N.target===N.currentTarget&&T&&!C){const D=new CustomEvent(Q,We);if(N.currentTarget.dispatchEvent(D),!D.defaultPrevented){const I=R().filter(M=>M.focusable),_=I.find(M=>M.active),z=I.find(M=>M.id===y),$=[_,z,...I].filter(Boolean).map(M=>M.ref.current);ye($,m)}}F.current=!1}),onBlur:A(t.onBlur,()=>b(!1))})})}),be="RovingFocusGroupItem",ve=a.forwardRef((t,n)=>{const{__scopeRovingFocusGroup:i,focusable:r=!0,active:s=!1,tabStopId:u,children:x,...h}=t,p=Pe(),g=u||p,m=Je(be,i),c=m.currentTabStopId===g,f=fe(i),{onFocusableItemAdd:l,onFocusableItemRemove:S,currentTabStopId:y}=m;return a.useEffect(()=>{if(r)return l(),()=>S()},[r,l,S]),e.jsx(te.ItemSlot,{scope:i,id:g,focusable:r,active:s,children:e.jsx(B.span,{tabIndex:c?0:-1,"data-orientation":m.orientation,...h,ref:n,onMouseDown:A(t.onMouseDown,d=>{r?m.onItemFocus(g):d.preventDefault()}),onFocus:A(t.onFocus,()=>m.onItemFocus(g)),onKeyDown:A(t.onKeyDown,d=>{if(d.key==="Tab"&&d.shiftKey){m.onItemShiftTab();return}if(d.target!==d.currentTarget)return;const C=tt(d,m.orientation,m.dir);if(C!==void 0){if(d.metaKey||d.ctrlKey||d.altKey||d.shiftKey)return;d.preventDefault();let v=f().filter(R=>R.focusable).map(R=>R.ref.current);if(C==="last")v.reverse();else if(C==="prev"||C==="next"){C==="prev"&&v.reverse();const R=v.indexOf(d.currentTarget);v=m.loop?nt(v,R+1):v.slice(R+1)}setTimeout(()=>ye(v))}}),children:typeof x=="function"?x({isCurrentTabStop:c,hasTabStop:y!=null}):x})})});ve.displayName=be;var Ze={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function et(t,n){return n!=="rtl"?t:t==="ArrowLeft"?"ArrowRight":t==="ArrowRight"?"ArrowLeft":t}function tt(t,n,i){const r=et(t.key,i);if(!(n==="vertical"&&["ArrowLeft","ArrowRight"].includes(r))&&!(n==="horizontal"&&["ArrowUp","ArrowDown"].includes(r)))return Ze[r]}function ye(t,n=!1){const i=document.activeElement;for(const r of t)if(r===i||(r.focus({preventScroll:n}),document.activeElement!==i))return}function nt(t,n){return t.map((i,r)=>t[(n+r)%t.length])}var rt=ge,ot=ve,ce="Radio",[it,we]=q(ce),[st,at]=it(ce),je=a.forwardRef((t,n)=>{const{__scopeRadio:i,name:r,checked:s=!1,required:u,disabled:x,value:h="on",onCheck:p,form:g,...m}=t,[c,f]=a.useState(null),l=U(n,d=>f(d)),S=a.useRef(!1),y=c?g||!!c.closest("form"):!0;return e.jsxs(st,{scope:i,checked:s,disabled:x,children:[e.jsx(B.button,{type:"button",role:"radio","aria-checked":s,"data-state":Ne(s),"data-disabled":x?"":void 0,disabled:x,value:h,...m,ref:l,onClick:A(t.onClick,d=>{s||p==null||p(),y&&(S.current=d.isPropagationStopped(),S.current||d.stopPropagation())})}),y&&e.jsx(Re,{control:c,bubbles:!S.current,name:r,value:h,checked:s,required:u,disabled:x,form:g,style:{transform:"translateX(-100%)"}})]})});je.displayName=ce;var Se="RadioIndicator",Ce=a.forwardRef((t,n)=>{const{__scopeRadio:i,forceMount:r,...s}=t,u=at(Se,i);return e.jsx(ze,{present:r||u.checked,children:e.jsx(B.span,{"data-state":Ne(u.checked),"data-disabled":u.disabled?"":void 0,...s,ref:n})})});Ce.displayName=Se;var dt="RadioBubbleInput",Re=a.forwardRef(({__scopeRadio:t,control:n,checked:i,bubbles:r=!0,...s},u)=>{const x=a.useRef(null),h=U(x,u),p=Ge(i),g=Le(n);return a.useEffect(()=>{const m=x.current;if(!m)return;const c=window.HTMLInputElement.prototype,l=Object.getOwnPropertyDescriptor(c,"checked").set;if(p!==i&&l){const S=new Event("click",{bubbles:r});l.call(m,i),m.dispatchEvent(S)}},[p,i,r]),e.jsx(B.input,{type:"radio","aria-hidden":!0,defaultChecked:i,...s,tabIndex:-1,ref:h,style:{...s.style,...g,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});Re.displayName=dt;function Ne(t){return t?"checked":"unchecked"}var ct=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],W="RadioGroup",[lt,Rt]=q(W,[he,we]),Ie=he(),_e=we(),[mt,pt]=lt(W),ke=a.forwardRef((t,n)=>{const{__scopeRadioGroup:i,name:r,defaultValue:s,value:u,required:x=!1,disabled:h=!1,orientation:p,dir:g,loop:m=!0,onValueChange:c,...f}=t,l=Ie(i),S=pe(g),[y,d]=ue({prop:u,defaultProp:s??null,onChange:c,caller:W});return e.jsx(mt,{scope:i,name:r,required:x,disabled:h,value:y,onValueChange:d,children:e.jsx(rt,{asChild:!0,...l,orientation:p,dir:S,loop:m,children:e.jsx(B.div,{role:"radiogroup","aria-required":x,"aria-orientation":p,"data-disabled":h?"":void 0,dir:S,...f,ref:n})})})});ke.displayName=W;var Te="RadioGroupItem",Ee=a.forwardRef((t,n)=>{const{__scopeRadioGroup:i,disabled:r,...s}=t,u=pt(Te,i),x=u.disabled||r,h=Ie(i),p=_e(i),g=a.useRef(null),m=U(n,g),c=u.value===s.value,f=a.useRef(!1);return a.useEffect(()=>{const l=y=>{ct.includes(y.key)&&(f.current=!0)},S=()=>f.current=!1;return document.addEventListener("keydown",l),document.addEventListener("keyup",S),()=>{document.removeEventListener("keydown",l),document.removeEventListener("keyup",S)}},[]),e.jsx(ot,{asChild:!0,...h,focusable:!x,active:c,children:e.jsx(je,{disabled:x,required:u.required,checked:c,...p,...s,name:u.name,ref:m,onCheck:()=>u.onValueChange(s.value),onKeyDown:A(l=>{l.key==="Enter"&&l.preventDefault()}),onFocus:A(s.onFocus,()=>{var l;f.current&&((l=g.current)==null||l.click())})})})});Ee.displayName=Te;var ut="RadioGroupIndicator",Me=a.forwardRef((t,n)=>{const{__scopeRadioGroup:i,...r}=t,s=_e(i);return e.jsx(Ce,{...s,...r,ref:n})});Me.displayName=ut;var xt=ke,ft=Ee,ht=Me;function gt({className:t,...n}){return e.jsx(xt,{"data-slot":"radio-group",className:xe("grid gap-3",t),...n})}function J({className:t,...n}){return e.jsx(ft,{"data-slot":"radio-group-item",className:xe("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",t),...n,children:e.jsx(ht,{"data-slot":"radio-group-indicator",className:"relative flex items-center justify-center",children:e.jsx(Ke,{className:"fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"})})})}const bt=[{id:1,name:"Follow-Up"},{id:2,name:"Offer/Quotation Reminder"},{id:3,name:"Demo/Product Discussion"},{id:4,name:"Service Interest Check"},{id:5,name:"Inactive Lead/Nudge"},{id:6,name:"Payment Reminder (Soft Tone)"},{id:7,name:"Document/Details Pending"}],vt={"Follow-Up":[{id:1,text:"Just checking if you'd like to move forward."},{id:2,text:"Any update from your side?"},{id:3,text:"Following up on our last discussion."},{id:4,text:"Shall we take the next step?"}],"Offer/Quotation Reminder":[{id:1,text:"Hope you had a look at the quote. Any thoughts?"},{id:2,text:"Quote is still valid. Let us know your decision."},{id:3,text:"Waiting for your response on the offer shared."},{id:4,text:"Ready to go ahead with the quote?"}],"Demo/Product Discussion":[{id:1,text:"Any feedback on the demo?"},{id:2,text:"Hope the demo was helpful. Want to explore more?"},{id:3,text:"Shall we plan the next discussion?"},{id:4,text:"Do you need more details on the product?"}],"Service Interest Check":[{id:1,text:"Still interested in the service?"},{id:2,text:"We're available if you'd like to continue."},{id:3,text:"Checking if you'd like to explore this further"},{id:4,text:"Let us know if you wish to go ahead."}],"Inactive Lead/Nudge":[{id:1,text:"Been a while. Still looking for this?"},{id:2,text:"Just checking – should we keep this open?"},{id:3,text:"Let us know if you've paused this."},{id:4,text:"Shall we reconnect on this?"}],"Payment Reminder (Soft Tone)":[{id:1,text:"Gentle reminder on pending payment."},{id:2,text:"Just a nudge – payment is due."},{id:3,text:"Checking on payment status."},{id:4,text:"Please update on the payment."}],"Document/Details Pending":[{id:1,text:"Waiting for the required documents."},{id:2,text:"Reminder to share the pending details."},{id:3,text:"Need your documents to proceed."},{id:4,text:"Please send the missing info."}]},X=({onTimeChange:t,initialHour:n="12",initialMinute:i="00",initialAmpm:r="AM"})=>{const[s,u]=a.useState(n),[x,h]=a.useState(i),[p,g]=a.useState(r),m=(c,f)=>{let l=parseInt(c,10);return f==="AM"?l===12&&(l=0):l!==12&&(l+=12),l.toString().padStart(2,"0")};return a.useEffect(()=>{if(s&&x){const f=`${m(s,p)}:${x.padStart(2,"0")}`;t==null||t(f)}},[s,x,p,t]),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsxs("select",{value:s,onChange:c=>u(c.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"",children:"HH"}),Array.from({length:12},(c,f)=>{const l=(f+1).toString();return e.jsx("option",{value:l,children:l.padStart(2,"0")},l)})]}),e.jsxs("select",{value:x,onChange:c=>h(c.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"",children:"MM"}),Array.from({length:12},(c,f)=>{const l=(f*5).toString();return e.jsx("option",{value:l,children:l.padStart(2,"0")},l)})]}),e.jsxs("select",{value:p,onChange:c=>g(c.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"AM",children:"AM"}),e.jsx("option",{value:"PM",children:"PM"})]})]})};function yt(){const t=Ue(),n=new URLSearchParams(t.search),i={};for(const[r,s]of n.entries())i[r]=s;return i}function Z({selectedMember:t,setSelectedMember:n,teamMembers:i}){return e.jsxs(ne,{children:[e.jsxs(re,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",children:[e.jsx("div",{children:e.jsx("p",{children:t?t.name:"Select Team Member"})}),e.jsx(de,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(oe,{className:"w-52",align:"start",children:[e.jsx(ie,{children:"Team Members"}),i.map(r=>e.jsxs(se,{onClick:()=>n(r),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{children:r.name}),e.jsx("span",{className:"text-xs text-muted-foreground",children:r.email}),(r.phone||r.phone_number||r.mobile)&&e.jsx("span",{className:"text-xs text-muted-foreground",children:r.phone||r.phone_number||r.mobile})]})}),(t==null?void 0:t.id)===r.id&&e.jsx(ae,{className:"ml-auto"})]},r.id))]})]})}function wt({selectedCategory:t,setSelectedCategory:n,setSelectedMessage:i}){const r=s=>{n(s),i(null)};return e.jsxs(ne,{children:[e.jsxs(re,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",children:[e.jsx("div",{children:e.jsx("p",{children:t?t.name:"Select Category"})}),e.jsx(de,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(oe,{className:"w-52",align:"start",children:[e.jsx(ie,{children:"Categories"}),bt.map(s=>e.jsxs(se,{onClick:()=>r(s),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("span",{children:s.name})})}),(t==null?void 0:t.id)===s.id&&e.jsx(ae,{className:"ml-auto"})]},s.id))]})]})}function jt({selectedCategory:t,selectedMessage:n,setSelectedMessage:i}){const r=t?vt[t.name]||[]:[];return e.jsxs(ne,{children:[e.jsxs(re,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",disabled:!t,children:[e.jsx("div",{children:e.jsx("p",{children:n?n.text:t?"Select Message":"Select Category First"})}),e.jsx(de,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(oe,{className:"w-80",align:"start",children:[e.jsx(ie,{children:"Messages"}),r.map(s=>e.jsxs(se,{onClick:()=>i(s),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("span",{className:"text-sm",children:s.text})})}),(n==null?void 0:n.id)===s.id&&e.jsx(ae,{className:"ml-auto"})]},s.id))]})]})}function Nt(){const[t,n]=a.useState(null),[i,r]=a.useState(null),[s,u]=a.useState(null),[x,h]=a.useState(!1),[p,g]=a.useState(!1),[m,c]=a.useState(""),[f,l]=a.useState([]),[S,y]=a.useState(!1),[d,C]=a.useState("custom"),[b,v]=a.useState(""),[R,F]=a.useState(void 0),[P,L]=a.useState("10:30:00"),N=new Date().toISOString().split("T")[0],[T,D]=a.useState(N),I=yt(),_=Oe(j=>j.user),[z,H]=a.useState("12:00 AM"),$=j=>{v(j.target.value)},M=async()=>{var j;try{if(y(!0),c(""),!_||!_.schema_name)throw new Error("User schema not found. Please log in again.");const k=_.schema_name,Fe=(await le.post("https://click.wa.expert/api/data/getAllData",{schemaName:k,tableName:"team_member"})).data;l(Fe)}catch(k){let w="Failed to load team members. ";k.response?w+=`Server error (${k.response.status}): ${((j=k.response.data)==null?void 0:j.error)||k.response.statusText}`:k.request?w+="Please check if the server is running.":w+=k.message,c(w)}finally{y(!1)}},Ae=()=>{if(document.getElementById("reminder-responsive-styles"))return;const j=document.createElement("style");j.id="reminder-responsive-styles",j.textContent=`
        /* Tablet Responsive Styles */
        @media (max-width: 768px) {
            .reminder-container {
                margin: 20px auto !important;
                padding: 24px !important;
                border-radius: 12px !important;
                max-width: 350px !important;
            }
            
            .reminder-main-content {
                padding: 24px !important;
                border-radius: 12px !important;
                max-width: 95vw !important;
            }
            
            .reminder-logo {
                width: 16rem !important;
                margin-bottom: 1.25rem !important;
            }
            
            .reminder-form {
                gap: 20px !important;
            }
            
            .reminder-input-group {
                gap: 6px !important;
            }
            
            .reminder-input-label {
                font-size: 13px !important;
                margin-bottom: 2px !important;
            }
            
            .reminder-textarea {
                padding: 10px !important;
                font-size: 16px !important;
                min-height: 90px !important;
            }
            
            .reminder-character-count {
                right: 10px !important;
                bottom: 6px !important;
                font-size: 11px !important;
            }
            
            .reminder-error-message {
                font-size: 13px !important;
                padding: 6px 10px !important;
            }
            
            .reminder-button {
                padding: 14px 20px !important;
                font-size: 15px !important;
                min-height: 50px !important;
                border-radius: 10px !important;
            }
            
            .reminder-button-content {
                gap: 6px !important;
            }
            
            .reminder-spinner {
                width: 14px !important;
                height: 14px !important;
            }
            
            .reminder-success-container {
                padding: 32px 16px !important;
            }
            
            .reminder-success-icon {
                width: 56px !important;
                height: 56px !important;
                font-size: 28px !important;
                margin-bottom: 20px !important;
            }
            
            .reminder-success-heading {
                font-size: 22px !important;
                margin-bottom: 10px !important;
            }
            
            .reminder-success-message {
                font-size: 15px !important;
                margin-bottom: 24px !important;
            }
            
            .reminder-new-comment-button {
                padding: 10px 20px !important;
                font-size: 13px !important;
            }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 480px) {
           .reminder-container {
                width: 99vw !important;
                max-width: 99vw !important;
                min-width: 300px !important;
                display:flex;
                justify-content:center;
                margin: 15vh auto !important;
                padding:10px 0px !important;
                position:absolute; !important;
                left:0px; !important;
                right:0px; !important;
         
            }
            
             .reminder-main-content {
                padding: 16px !important;
                border-radius: 8px !important;
                width:95vw;
                max-width: 98vw !important;
                min-width: 90vw !important;

            }
            
            .reminder-logo {
                width: 12rem !important;
                margin-bottom: 1rem !important;
            }
            
            .reminder-header-section {
                margin-bottom: 20px !important;
            }
            
            .reminder-heading {
                font-size: 20px !important;
                line-height: 1.2 !important;
            }
            
            .reminder-subheading {
                font-size: 14px !important;
            }
            
            .reminder-form {
                gap: 16px !important;
            }
            
            .reminder-input-group {
                gap: 6px !important;
            }
            
            .reminder-input-label {
                font-size: 13px !important;
                margin-bottom: 2px !important;
            }
            
            .reminder-textarea {
                padding: 8px !important;
                font-size: 16px !important;
                min-height: 80px !important;
                border-radius: 6px !important;
            }
            
            .reminder-character-count {
                right: 8px !important;
                bottom: 4px !important;
                font-size: 10px !important;
            }
            
            .reminder-error-message {
                font-size: 12px !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
            }
            
            .reminder-button {
                padding: 12px 16px !important;
                font-size: 14px !important;
                min-height: 44px !important;
                border-radius: 8px !important;
            }
            
            .reminder-button-content {
                gap: 6px !important;
            }
            
            .reminder-spinner {
                width: 14px !important;
                height: 14px !important;
            }
            
            .reminder-success-container {
                padding: 24px 12px !important;
            }
            
            .reminder-success-icon {
                width: 48px !important;
                height: 48px !important;
                font-size: 24px !important;
                margin-bottom: 16px !important;
            }
            
            .reminder-success-heading {
                font-size: 20px !important;
                margin-bottom: 8px !important;
            }
            
            .reminder-success-message {
                font-size: 14px !important;
                margin-bottom: 20px !important;
            }
            
            .reminder-new-comment-button {
                padding: 8px 16px !important;
                font-size: 12px !important;
                border-radius: 6px !important;
            }
        }

        /* Very small screens - prevent horizontal scrolling */
        @media (max-width: 420px) {
            .reminder-container {
                width: 99vw !important;
                max-width: 99vw !important;
                min-width: 300px !important;
                display:flex;
                justify-content:center;
                margin: 10vh auto !important;
                padding:10px 0px !important;
                position:absolute; !important;
                left:0px; !important;
                right:0px; !important;
         
            }
            
             .reminder-main-content {
                padding: 16px !important;
                border-radius: 8px !important;
                width:95vw;
                max-width: 98vw !important;
                min-width: 90vw !important;

            }
            
            .reminder-logo {
                width: 12rem !important;
                margin-bottom: 1rem !important;
            }
            
            .reminder-header-section {
                margin-bottom: 20px !important;
            }
            
            .reminder-heading {
                font-size: 20px !important;
                line-height: 1.2 !important;
            }
            
            .reminder-subheading {
                font-size: 14px !important;
            }
            
            .reminder-form {
                gap: 16px !important;
            }
            
            .reminder-input-group {
                gap: 6px !important;
            }
            
            .reminder-input-label {
                font-size: 13px !important;
                margin-bottom: 2px !important;
            }
            
            .reminder-textarea {
                padding: 8px !important;
                font-size: 16px !important;
                min-height: 80px !important;
                border-radius: 6px !important;
            }
            
            .reminder-character-count {
                right: 8px !important;
                bottom: 4px !important;
                font-size: 10px !important;
            }
            
            .reminder-error-message {
                font-size: 12px !important;
                padding: 6px 8px !important;
                border-radius: 4px !important;
            }
            
            .reminder-button {
                padding: 12px 16px !important;
                font-size: 14px !important;
                min-height: 44px !important;
                border-radius: 8px !important;
            }
            
            .reminder-button-content {
                gap: 6px !important;
            }
            
            .reminder-spinner {
                width: 14px !important;
                height: 14px !important;
            }
            
            .reminder-success-container {
                padding: 24px 12px !important;
            }
            
            .reminder-success-icon {
                width: 48px !important;
                height: 48px !important;
                font-size: 24px !important;
                margin-bottom: 16px !important;
            }
            
            .reminder-success-heading {
                font-size: 20px !important;
                margin-bottom: 8px !important;
            }
            
            .reminder-success-message {
                font-size: 14px !important;
                margin-bottom: 20px !important;
            }
            
            .reminder-new-comment-button {
                padding: 8px 16px !important;
                font-size: 12px !important;
                border-radius: 6px !important;
            }
        }
    `,document.head.appendChild(j)};a.useEffect(()=>{M(),Ae()},[_]);const V=async j=>{var k;if(j.preventDefault(),!t){c("Please select a team member.");return}if(!T){c("Please select a date.");return}if(!z){c("Please select a time.");return}if(d==="custom"||d==="task"){if(!b.trim()){c("Please enter a comment before submitting.");return}}else if(d==="template"&&(!i||!s)){c("Please select category and message before submitting.");return}try{g(!0),c("");let w;d==="custom"?w={title:"Custom Message",message:b.trim(),reminder_time:z,reminder_date:T,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:I.sender_name||t.name,reminder_type:I.reminder_type||"Custom Message",schemaName:I.schemaName||(_==null?void 0:_.schema_name)||"",...I}:d==="template"?w={title:"Template Reminder",message:s.text,reminder_time:z,reminder_date:T,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:I.sender_name||t.name,reminder_type:I.reminder_type||"Template Message",schemaName:I.schemaName||(_==null?void 0:_.schema_name)||"",category:i.name,...I}:w={title:"Task Reminder",message:b.trim(),reminder_time:z,reminder_date:T,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:I.sender_name||"WaExpert",reminder_type:I.reminder_type||"Task Message",schemaName:I.schemaName||(_==null?void 0:_.schema_name)||"",...I},w.reminder_time=z,w.reminder_date=T,w.recipient_name=t.name,w.recipient_phone=t.phone||t.number||t.phone_number||t.mobile||"";const O=await le.post("${import.meta.env.VITE_APP_BASE_URL}/reminder/add",w,{headers:{"Content-Type":"application/json"}});h(!0),n(null),r(null),u(null),D(N),H("12:00"),v("")}catch(w){let O="Failed to submit reminder. ";w.response?O+=`Server error (${w.response.status}): ${((k=w.response.data)==null?void 0:k.message)||w.response.statusText}`:w.request?O+="Please check your internet connection.":O+=w.message,c(O)}finally{g(!1)}};return x?e.jsxs("div",{style:o.container,className:"reminder-container",children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:o.logo,className:"reminder-logo"}),e.jsxs("div",{style:o.successContainer,className:"reminder-success-container",children:[e.jsx("div",{style:o.successIcon,className:"reminder-success-icon",children:"✓"}),e.jsx("h2",{style:o.successHeading,className:"reminder-success-heading",children:"Thank You!"}),e.jsxs("p",{style:o.successMessage,className:"reminder-success-message",children:["Your ",d==="custom"?"comment":"reminder"," has been sent successfully."]}),e.jsxs("button",{onClick:()=>{h(!1),n(null),r(null),u(null),v(""),c(""),F(void 0),L("10:30:00")},style:{...o.newCommentButton,...o.newCommentButtonHover},className:"reminder-new-comment-button",children:["Send Another ",d==="custom"?"Comment":"Reminder"]})]})]}):e.jsxs("div",{style:o.container,className:"reminder-container",children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:o.logo,className:"reminder-logo"}),e.jsx("div",{style:o.headerSection,className:"reminder-header-section",children:e.jsx("p",{style:o.subheading,className:"reminder-subheading",children:"Select your preferred option and fill the details"})}),e.jsxs("div",{style:o.mainContent,className:"reminder-main-content",children:[e.jsxs(gt,{defaultValue:"custom",onValueChange:j=>{C(j),c("")},className:"flex flex-col space-x-6 mb-6",style:o.reminderTypeWrapper,children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(J,{value:"custom",id:"custom"}),e.jsx(E,{htmlFor:"custom",children:"Custom Reminder Message"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(J,{value:"template",id:"template"}),e.jsx(E,{htmlFor:"template",children:"Template Reminder Message"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(J,{value:"task",id:"task"}),e.jsx(E,{htmlFor:"task",children:"Custom Task Message"})]})]}),d==="custom"?e.jsxs("form",{onSubmit:V,style:o.form,className:"reminder-form",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:T,onChange:j=>D(j.target.value)}),e.jsx(X,{onTimeChange:H})]}),e.jsxs("div",{style:o.inputGroup,className:"reminder-input-group",children:[e.jsx(E,{style:o.inputLabel,className:"reminder-input-label",children:"Team Member"}),e.jsx(Z,{selectedMember:t,setSelectedMember:n,teamMembers:f})]}),e.jsxs("div",{style:o.inputGroup,className:"reminder-input-group",children:[e.jsx(E,{htmlFor:"comment",style:o.inputLabel,className:"reminder-input-label",children:"Your Comment"}),e.jsxs("div",{style:o.textareaContainer,children:[e.jsx("textarea",{id:"comment",value:b,onChange:$,placeholder:"Type your comment or notes here...",className:"reminder-textarea",style:{...o.textarea,...m?o.textareaError:{}},rows:4,disabled:p}),e.jsxs("div",{style:o.characterCount,className:"reminder-character-count",children:[b.length," characters"]})]}),m&&e.jsx("div",{style:o.errorMessage,className:"reminder-error-message",children:m})]}),e.jsx("button",{type:"submit",style:{...o.button,...p?o.buttonDisabled:{},...t&&b.trim()?o.buttonActive:{}},className:"reminder-button",disabled:p||!t||!b.trim(),children:e.jsx("div",{style:o.buttonContent,className:"reminder-button-content",children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:o.spinner,className:"reminder-spinner"}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{size:16}),"Submit Comment"]})})})]}):d==="template"?e.jsxs("form",{onSubmit:V,style:o.form,children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:T,onChange:j=>D(j.target.value)}),e.jsx(X,{onTimeChange:H})]}),e.jsxs("div",{style:o.inputGroup,children:[e.jsx(E,{style:o.inputLabel,children:"Team Member"}),e.jsx(Z,{selectedMember:t,setSelectedMember:n,teamMembers:f})]}),e.jsxs("div",{style:o.inputGroup,children:[e.jsx(E,{style:o.inputLabel,children:"Category"}),e.jsx(wt,{selectedCategory:i,setSelectedCategory:r,setSelectedMessage:u})]}),e.jsxs("div",{style:o.inputGroup,children:[e.jsx(E,{style:o.inputLabel,children:"Message"}),e.jsx(jt,{selectedCategory:i,selectedMessage:s,setSelectedMessage:u})]}),m&&e.jsx("div",{style:o.errorMessage,children:m}),e.jsx("button",{type:"submit",style:{...o.button,...p?o.buttonDisabled:{},...t&&i&&s?o.buttonActive:{}},disabled:p||!t||!i||!s,children:e.jsx("div",{style:o.buttonContent,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:o.spinner}),"Sending..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{size:16}),"Send Reminder"]})})})]}):e.jsxs("form",{onSubmit:V,style:o.form,children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:T,onChange:j=>D(j.target.value)}),e.jsx(X,{onTimeChange:H})]}),e.jsxs("div",{style:o.inputGroup,children:[e.jsx(E,{style:o.inputLabel,children:"Team Member"}),e.jsx(Z,{selectedMember:t,setSelectedMember:n,teamMembers:f})]}),e.jsxs("div",{style:o.inputGroup,children:[e.jsx(E,{htmlFor:"comment",style:o.inputLabel,children:"Add Task In Detail"}),e.jsxs("div",{style:o.textareaContainer,children:[e.jsx("textarea",{id:"comment",value:b,onChange:$,placeholder:"Type your comment or notes here...",style:{...o.textarea,...m?o.textareaError:{}},rows:4,disabled:p}),e.jsxs("div",{style:o.characterCount,children:[b.length," characters"]})]}),m&&e.jsx("div",{style:o.errorMessage,children:m})]}),e.jsx("button",{type:"submit",style:{...o.button,...p?o.buttonDisabled:{},...t&&b.trim()?o.buttonActive:{}},disabled:p||!t||!b.trim(),children:e.jsx("div",{style:o.buttonContent,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:o.spinner}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{size:16}),"Submit Comment"]})})})]})]})]})}const o={container:{maxWidth:"500px",margin:"50px auto",padding:"32px",border:"1px solid #e1e5e9",borderRadius:"16px",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.1)",display:"flex",flexDirection:"column",alignItems:"center",backgroundColor:"#ffffff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',minHeight:"400px"},reminderTypeWrapper:{display:"flex",flexDirection:"columns"},logo:{width:"20rem",height:"auto",marginBottom:"1.5rem"},headerSection:{textAlign:"center",marginBottom:"32px",width:"100%"},subheading:{fontSize:"16px",color:"#718096",margin:0,lineHeight:"1.5"},form:{display:"flex",flexDirection:"column",width:"100%",gap:"24px"},inputGroup:{display:"flex",flexDirection:"column",gap:"8px",width:"100%"},inputLabel:{fontSize:"14px",fontWeight:"600",color:"#2d3748"},textareaContainer:{position:"relative"},textarea:{width:"100%",padding:"12px",fontSize:"16px",border:"2px solid #e2e8f0",borderRadius:"8px",backgroundColor:"#ffffff",color:"#2d3748",outline:"none",transition:"border-color 0.3s ease",fontFamily:"inherit",resize:"vertical",minHeight:"100px"},textareaError:{borderColor:"#e53e3e"},characterCount:{position:"absolute",bottom:"8px",right:"12px",fontSize:"12px",color:"#a0aec0",backgroundColor:"#ffffff",padding:"2px 4px"},errorMessage:{fontSize:"14px",color:"#e53e3e",backgroundColor:"#fed7d7",padding:"8px 12px",borderRadius:"6px",border:"1px solid #feb2b2"},button:{padding:"16px 24px",fontSize:"16px",fontWeight:"600",border:"none",borderRadius:"12px",backgroundColor:"#a0aec0",color:"#ffffff",cursor:"not-allowed",transition:"all 0.3s ease",outline:"none",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"56px",transform:"translateY(0)"},buttonActive:{backgroundColor:"#4388c1",cursor:"pointer",boxShadow:"0 4px 12px rgba(67, 136, 193, 0.3)"},buttonDisabled:{backgroundColor:"#a0aec0",cursor:"not-allowed",transform:"none",boxShadow:"none"},buttonContent:{display:"flex",alignItems:"center",gap:"8px"},spinner:{width:"16px",height:"16px",border:"2px solid transparent",borderTop:"2px solid #ffffff",borderRadius:"50%",animation:"spin 1s linear infinite"},successContainer:{textAlign:"center",padding:"40px 20px",width:"100%"},successIcon:{width:"64px",height:"64px",backgroundColor:"#48bb78",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",fontWeight:"bold",margin:"0 auto 24px",animation:"bounceIn 0.6s ease-out"},successHeading:{fontSize:"24px",fontWeight:"700",color:"#2d3748",margin:"0 0 12px 0"},successMessage:{fontSize:"16px",color:"#718096",margin:"0 0 32px 0",lineHeight:"1.5"},newCommentButton:{padding:"12px 24px",fontSize:"14px",fontWeight:"600",border:"2px solid #4388c1",borderRadius:"8px",backgroundColor:"transparent",color:"#4388c1",cursor:"pointer",transition:"all 0.3s ease"},newCommentButtonHover:{":hover":{backgroundColor:"#4388c1",color:"white"}}};if(typeof document<"u"){const t=document.createElement("style");t.type="text/css",t.innerText=`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes bounceIn {
        0% { 
          transform: scale(0.3);
          opacity: 0;
        }
        50% { 
          transform: scale(1.05);
        }
        70% { 
          transform: scale(0.9);
        }
        100% { 
          transform: scale(1);
          opacity: 1;
        }
      }
      
      button:not(:disabled):hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
      }
      
      .new-comment-button:hover {
        background-color: #4388c1 !important;
        color: white !important;
      }
      
      textarea:focus {
        border-color: #4388c1 !important;
      }
    `,document.head.appendChild(t)}export{Nt as default};
