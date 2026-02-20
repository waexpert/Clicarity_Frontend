import{e as Z,r as d,a3 as ee,a4 as je,a5 as we,j as e,V as te,a6 as Se,a7 as P,U as B,a8 as Ne,W as H,a9 as Ce,aa as Re,ab as ke,Z as ne,a as _e,L as C,c as X,a2 as ze,ac as U,ad as W,ae as O,af as q,ag as $,ah as V}from"./index-CxXEh7ic.js";import{S as E}from"./send-DPrtQO-k.js";/**
 * @license lucide-react v0.574.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],Y=Z("chevrons-up-down",Me);/**
 * @license lucide-react v0.574.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Pe=Z("circle",Ie);var K="Radio",[De,re]=te(K),[Te,Ae]=De(K),ie=d.forwardRef((t,a)=>{const{__scopeRadio:i,name:o,checked:r=!1,required:l,disabled:u,value:b="on",onCheck:p,form:v,...x}=t,[s,h]=d.useState(null),m=B(a,g=>h(g)),j=d.useRef(!1),R=s?v||!!s.closest("form"):!0;return e.jsxs(Te,{scope:i,checked:r,disabled:u,children:[e.jsx(P.button,{type:"button",role:"radio","aria-checked":r,"data-state":de(r),"data-disabled":u?"":void 0,disabled:u,value:b,...x,ref:m,onClick:H(t.onClick,g=>{r||p==null||p(),R&&(j.current=g.isPropagationStopped(),j.current||g.stopPropagation())})}),R&&e.jsx(se,{control:s,bubbles:!j.current,name:o,value:b,checked:r,required:l,disabled:u,form:v,style:{transform:"translateX(-100%)"}})]})});ie.displayName=K;var oe="RadioIndicator",ae=d.forwardRef((t,a)=>{const{__scopeRadio:i,forceMount:o,...r}=t,l=Ae(oe,i);return e.jsx(Ce,{present:o||l.checked,children:e.jsx(P.span,{"data-state":de(l.checked),"data-disabled":l.disabled?"":void 0,...r,ref:a})})});ae.displayName=oe;var Ee="RadioBubbleInput",se=d.forwardRef(({__scopeRadio:t,control:a,checked:i,bubbles:o=!0,...r},l)=>{const u=d.useRef(null),b=B(u,l),p=Re(i),v=ke(a);return d.useEffect(()=>{const x=u.current;if(!x)return;const s=window.HTMLInputElement.prototype,m=Object.getOwnPropertyDescriptor(s,"checked").set;if(p!==i&&m){const j=new Event("click",{bubbles:o});m.call(x,i),x.dispatchEvent(j)}},[p,i,o]),e.jsx(P.input,{type:"radio","aria-hidden":!0,defaultChecked:i,...r,tabIndex:-1,ref:b,style:{...r.style,...v,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});se.displayName=Ee;function de(t){return t?"checked":"unchecked"}var Ge=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],D="RadioGroup",[Le,tt]=te(D,[ee,re]),me=ee(),pe=re(),[Fe,He]=Le(D),le=d.forwardRef((t,a)=>{const{__scopeRadioGroup:i,name:o,defaultValue:r,value:l,required:u=!1,disabled:b=!1,orientation:p,dir:v,loop:x=!0,onValueChange:s,...h}=t,m=me(i),j=je(v),[R,g]=we({prop:l,defaultProp:r??null,onChange:s,caller:D});return e.jsx(Fe,{scope:i,name:o,required:u,disabled:b,value:R,onValueChange:g,children:e.jsx(Se,{asChild:!0,...m,orientation:p,dir:j,loop:x,children:e.jsx(P.div,{role:"radiogroup","aria-required":u,"aria-orientation":p,"data-disabled":b?"":void 0,dir:j,...h,ref:a})})})});le.displayName=D;var ce="RadioGroupItem",ue=d.forwardRef((t,a)=>{const{__scopeRadioGroup:i,disabled:o,...r}=t,l=He(ce,i),u=l.disabled||o,b=me(i),p=pe(i),v=d.useRef(null),x=B(a,v),s=l.value===r.value,h=d.useRef(!1);return d.useEffect(()=>{const m=R=>{Ge.includes(R.key)&&(h.current=!0)},j=()=>h.current=!1;return document.addEventListener("keydown",m),document.addEventListener("keyup",j),()=>{document.removeEventListener("keydown",m),document.removeEventListener("keyup",j)}},[]),e.jsx(Ne,{asChild:!0,...b,focusable:!u,active:s,children:e.jsx(ie,{disabled:u,required:l.required,checked:s,...p,...r,name:l.name,ref:x,onCheck:()=>l.onValueChange(r.value),onKeyDown:H(m=>{m.key==="Enter"&&m.preventDefault()}),onFocus:H(r.onFocus,()=>{var m;h.current&&((m=v.current)==null||m.click())})})})});ue.displayName=ce;var Be="RadioGroupIndicator",xe=d.forwardRef((t,a)=>{const{__scopeRadioGroup:i,...o}=t,r=pe(i);return e.jsx(ae,{...r,...o,ref:a})});xe.displayName=Be;var Ue=le,We=ue,Oe=xe;function qe({className:t,...a}){return e.jsx(Ue,{"data-slot":"radio-group",className:ne("grid gap-3",t),...a})}function G({className:t,...a}){return e.jsx(We,{"data-slot":"radio-group-item",className:ne("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",t),...a,children:e.jsx(Oe,{"data-slot":"radio-group-indicator",className:"relative flex items-center justify-center",children:e.jsx(Pe,{className:"fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"})})})}const $e=[{id:1,name:"Follow-Up"},{id:2,name:"Offer/Quotation Reminder"},{id:3,name:"Demo/Product Discussion"},{id:4,name:"Service Interest Check"},{id:5,name:"Inactive Lead/Nudge"},{id:6,name:"Payment Reminder (Soft Tone)"},{id:7,name:"Document/Details Pending"}],Ve={"Follow-Up":[{id:1,text:"Just checking if you'd like to move forward."},{id:2,text:"Any update from your side?"},{id:3,text:"Following up on our last discussion."},{id:4,text:"Shall we take the next step?"}],"Offer/Quotation Reminder":[{id:1,text:"Hope you had a look at the quote. Any thoughts?"},{id:2,text:"Quote is still valid. Let us know your decision."},{id:3,text:"Waiting for your response on the offer shared."},{id:4,text:"Ready to go ahead with the quote?"}],"Demo/Product Discussion":[{id:1,text:"Any feedback on the demo?"},{id:2,text:"Hope the demo was helpful. Want to explore more?"},{id:3,text:"Shall we plan the next discussion?"},{id:4,text:"Do you need more details on the product?"}],"Service Interest Check":[{id:1,text:"Still interested in the service?"},{id:2,text:"We're available if you'd like to continue."},{id:3,text:"Checking if you'd like to explore this further"},{id:4,text:"Let us know if you wish to go ahead."}],"Inactive Lead/Nudge":[{id:1,text:"Been a while. Still looking for this?"},{id:2,text:"Just checking – should we keep this open?"},{id:3,text:"Let us know if you've paused this."},{id:4,text:"Shall we reconnect on this?"}],"Payment Reminder (Soft Tone)":[{id:1,text:"Gentle reminder on pending payment."},{id:2,text:"Just a nudge – payment is due."},{id:3,text:"Checking on payment status."},{id:4,text:"Please update on the payment."}],"Document/Details Pending":[{id:1,text:"Waiting for the required documents."},{id:2,text:"Reminder to share the pending details."},{id:3,text:"Need your documents to proceed."},{id:4,text:"Please send the missing info."}]},L=({onTimeChange:t,initialHour:a="12",initialMinute:i="00",initialAmpm:o="AM"})=>{const[r,l]=d.useState(a),[u,b]=d.useState(i),[p,v]=d.useState(o),x=(s,h)=>{let m=parseInt(s,10);return h==="AM"?m===12&&(m=0):m!==12&&(m+=12),m.toString().padStart(2,"0")};return d.useEffect(()=>{if(r&&u){const h=`${x(r,p)}:${u.padStart(2,"0")}`;t==null||t(h)}},[r,u,p,t]),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsxs("select",{value:r,onChange:s=>l(s.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"",children:"HH"}),Array.from({length:12},(s,h)=>{const m=(h+1).toString();return e.jsx("option",{value:m,children:m.padStart(2,"0")},m)})]}),e.jsxs("select",{value:u,onChange:s=>b(s.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"",children:"MM"}),Array.from({length:12},(s,h)=>{const m=(h*5).toString();return e.jsx("option",{value:m,children:m.padStart(2,"0")},m)})]}),e.jsxs("select",{value:p,onChange:s=>v(s.target.value),className:"border p-2 rounded-md",children:[e.jsx("option",{value:"AM",children:"AM"}),e.jsx("option",{value:"PM",children:"PM"})]})]})};function Ye(){const t=ze(),a=new URLSearchParams(t.search),i={};for(const[o,r]of a.entries())i[o]=r;return i}function F({selectedMember:t,setSelectedMember:a,teamMembers:i}){return e.jsxs(U,{children:[e.jsxs(W,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",children:[e.jsx("div",{children:e.jsx("p",{children:t?t.name:"Select Team Member"})}),e.jsx(Y,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(O,{className:"w-52",align:"start",children:[e.jsx(q,{children:"Team Members"}),i.map(o=>e.jsxs($,{onClick:()=>a(o),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{children:o.name}),e.jsx("span",{className:"text-xs text-muted-foreground",children:o.email}),(o.phone||o.phone_number||o.mobile)&&e.jsx("span",{className:"text-xs text-muted-foreground",children:o.phone||o.phone_number||o.mobile})]})}),(t==null?void 0:t.id)===o.id&&e.jsx(V,{className:"ml-auto"})]},o.id))]})]})}function Ke({selectedCategory:t,setSelectedCategory:a,setSelectedMessage:i}){const o=r=>{a(r),i(null)};return e.jsxs(U,{children:[e.jsxs(W,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",children:[e.jsx("div",{children:e.jsx("p",{children:t?t.name:"Select Category"})}),e.jsx(Y,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(O,{className:"w-52",align:"start",children:[e.jsx(q,{children:"Categories"}),$e.map(r=>e.jsxs($,{onClick:()=>o(r),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("span",{children:r.name})})}),(t==null?void 0:t.id)===r.id&&e.jsx(V,{className:"ml-auto"})]},r.id))]})]})}function Qe({selectedCategory:t,selectedMessage:a,setSelectedMessage:i}){const o=t?Ve[t.name]||[]:[];return e.jsxs(U,{children:[e.jsxs(W,{className:"flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between",disabled:!t,children:[e.jsx("div",{children:e.jsx("p",{children:a?a.text:t?"Select Message":"Select Category First"})}),e.jsx(Y,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs(O,{className:"w-80",align:"start",children:[e.jsx(q,{children:"Messages"}),o.map(r=>e.jsxs($,{onClick:()=>i(r),children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("span",{className:"text-sm",children:r.text})})}),(a==null?void 0:a.id)===r.id&&e.jsx(V,{className:"ml-auto"})]},r.id))]})]})}function nt(){const[t,a]=d.useState(null),[i,o]=d.useState(null),[r,l]=d.useState(null),[u,b]=d.useState(!1),[p,v]=d.useState(!1),[x,s]=d.useState(""),[h,m]=d.useState([]),[j,R]=d.useState(!1),[g,he]=d.useState("custom"),[S,T]=d.useState(""),[Je,fe]=d.useState(void 0),[Xe,ge]=d.useState("10:30:00"),Q=new Date().toISOString().split("T")[0],[k,M]=d.useState(Q),w=Ye(),y=_e(f=>f.user),[z,I]=d.useState("12:00 AM"),J=f=>{T(f.target.value)},be=async()=>{var f;try{if(R(!0),s(""),!y||!y.schema_name)throw new Error("User schema not found. Please log in again.");const N=y.schema_name,ye=(await X.post("https://click.wa.expert/api/data/getAllData",{schemaName:N,tableName:"team_member"})).data;m(ye)}catch(N){let c="Failed to load team members. ";N.response?c+=`Server error (${N.response.status}): ${((f=N.response.data)==null?void 0:f.error)||N.response.statusText}`:N.request?c+="Please check if the server is running.":c+=N.message,s(c)}finally{R(!1)}},ve=()=>{if(document.getElementById("reminder-responsive-styles"))return;const f=document.createElement("style");f.id="reminder-responsive-styles",f.textContent=`
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
    `,document.head.appendChild(f)};d.useEffect(()=>{be(),ve()},[y]);const A=async f=>{var N;if(f.preventDefault(),!t){s("Please select a team member.");return}if(!k){s("Please select a date.");return}if(!z){s("Please select a time.");return}if(g==="custom"||g==="task"){if(!S.trim()){s("Please enter a comment before submitting.");return}}else if(g==="template"&&(!i||!r)){s("Please select category and message before submitting.");return}try{v(!0),s("");let c;g==="custom"?c={title:"Custom Message",message:S.trim(),reminder_time:z,reminder_date:k,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:w.sender_name||t.name,reminder_type:w.reminder_type||"Custom Message",schemaName:w.schemaName||(y==null?void 0:y.schema_name)||"",...w}:g==="template"?c={title:"Template Reminder",message:r.text,reminder_time:z,reminder_date:k,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:w.sender_name||t.name,reminder_type:w.reminder_type||"Template Message",schemaName:w.schemaName||(y==null?void 0:y.schema_name)||"",category:i.name,...w}:c={title:"Task Reminder",message:S.trim(),reminder_time:z,reminder_date:k,recipient_name:t.name,recipient_phone:t.phone||t.number||t.phone_number||t.mobile||"",sender_name:w.sender_name||"WaExpert",reminder_type:w.reminder_type||"Task Message",schemaName:w.schemaName||(y==null?void 0:y.schema_name)||"",...w},c.reminder_time=z,c.reminder_date=k,c.recipient_name=t.name,c.recipient_phone=t.phone||t.number||t.phone_number||t.mobile||"";const _=await X.post("${import.meta.env.VITE_APP_BASE_URL}/reminder/add",c,{headers:{"Content-Type":"application/json"}});b(!0),a(null),o(null),l(null),M(Q),I("12:00"),T("")}catch(c){let _="Failed to submit reminder. ";c.response?_+=`Server error (${c.response.status}): ${((N=c.response.data)==null?void 0:N.message)||c.response.statusText}`:c.request?_+="Please check your internet connection.":_+=c.message,s(_)}finally{v(!1)}};return u?e.jsxs("div",{style:n.container,className:"reminder-container",children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:n.logo,className:"reminder-logo"}),e.jsxs("div",{style:n.successContainer,className:"reminder-success-container",children:[e.jsx("div",{style:n.successIcon,className:"reminder-success-icon",children:"✓"}),e.jsx("h2",{style:n.successHeading,className:"reminder-success-heading",children:"Thank You!"}),e.jsxs("p",{style:n.successMessage,className:"reminder-success-message",children:["Your ",g==="custom"?"comment":"reminder"," has been sent successfully."]}),e.jsxs("button",{onClick:()=>{b(!1),a(null),o(null),l(null),T(""),s(""),fe(void 0),ge("10:30:00")},style:{...n.newCommentButton,...n.newCommentButtonHover},className:"reminder-new-comment-button",children:["Send Another ",g==="custom"?"Comment":"Reminder"]})]})]}):e.jsxs("div",{style:n.container,className:"reminder-container",children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:n.logo,className:"reminder-logo"}),e.jsx("div",{style:n.headerSection,className:"reminder-header-section",children:e.jsx("p",{style:n.subheading,className:"reminder-subheading",children:"Select your preferred option and fill the details"})}),e.jsxs("div",{style:n.mainContent,className:"reminder-main-content",children:[e.jsxs(qe,{defaultValue:"custom",onValueChange:f=>{he(f),s("")},className:"flex flex-col space-x-6 mb-6",style:n.reminderTypeWrapper,children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(G,{value:"custom",id:"custom"}),e.jsx(C,{htmlFor:"custom",children:"Custom Reminder Message"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(G,{value:"template",id:"template"}),e.jsx(C,{htmlFor:"template",children:"Template Reminder Message"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(G,{value:"task",id:"task"}),e.jsx(C,{htmlFor:"task",children:"Custom Task Message"})]})]}),g==="custom"?e.jsxs("form",{onSubmit:A,style:n.form,className:"reminder-form",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:k,onChange:f=>M(f.target.value)}),e.jsx(L,{onTimeChange:I})]}),e.jsxs("div",{style:n.inputGroup,className:"reminder-input-group",children:[e.jsx(C,{style:n.inputLabel,className:"reminder-input-label",children:"Team Member"}),e.jsx(F,{selectedMember:t,setSelectedMember:a,teamMembers:h})]}),e.jsxs("div",{style:n.inputGroup,className:"reminder-input-group",children:[e.jsx(C,{htmlFor:"comment",style:n.inputLabel,className:"reminder-input-label",children:"Your Comment"}),e.jsxs("div",{style:n.textareaContainer,children:[e.jsx("textarea",{id:"comment",value:S,onChange:J,placeholder:"Type your comment or notes here...",className:"reminder-textarea",style:{...n.textarea,...x?n.textareaError:{}},rows:4,disabled:p}),e.jsxs("div",{style:n.characterCount,className:"reminder-character-count",children:[S.length," characters"]})]}),x&&e.jsx("div",{style:n.errorMessage,className:"reminder-error-message",children:x})]}),e.jsx("button",{type:"submit",style:{...n.button,...p?n.buttonDisabled:{},...t&&S.trim()?n.buttonActive:{}},className:"reminder-button",disabled:p||!t||!S.trim(),children:e.jsx("div",{style:n.buttonContent,className:"reminder-button-content",children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:n.spinner,className:"reminder-spinner"}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(E,{size:16}),"Submit Comment"]})})})]}):g==="template"?e.jsxs("form",{onSubmit:A,style:n.form,children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:k,onChange:f=>M(f.target.value)}),e.jsx(L,{onTimeChange:I})]}),e.jsxs("div",{style:n.inputGroup,children:[e.jsx(C,{style:n.inputLabel,children:"Team Member"}),e.jsx(F,{selectedMember:t,setSelectedMember:a,teamMembers:h})]}),e.jsxs("div",{style:n.inputGroup,children:[e.jsx(C,{style:n.inputLabel,children:"Category"}),e.jsx(Ke,{selectedCategory:i,setSelectedCategory:o,setSelectedMessage:l})]}),e.jsxs("div",{style:n.inputGroup,children:[e.jsx(C,{style:n.inputLabel,children:"Message"}),e.jsx(Qe,{selectedCategory:i,selectedMessage:r,setSelectedMessage:l})]}),x&&e.jsx("div",{style:n.errorMessage,children:x}),e.jsx("button",{type:"submit",style:{...n.button,...p?n.buttonDisabled:{},...t&&i&&r?n.buttonActive:{}},disabled:p||!t||!i||!r,children:e.jsx("div",{style:n.buttonContent,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:n.spinner}),"Sending..."]}):e.jsxs(e.Fragment,{children:[e.jsx(E,{size:16}),"Send Reminder"]})})})]}):e.jsxs("form",{onSubmit:A,style:n.form,children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("input",{type:"date",name:"date",id:"date",value:k,onChange:f=>M(f.target.value)}),e.jsx(L,{onTimeChange:I})]}),e.jsxs("div",{style:n.inputGroup,children:[e.jsx(C,{style:n.inputLabel,children:"Team Member"}),e.jsx(F,{selectedMember:t,setSelectedMember:a,teamMembers:h})]}),e.jsxs("div",{style:n.inputGroup,children:[e.jsx(C,{htmlFor:"comment",style:n.inputLabel,children:"Add Task In Detail"}),e.jsxs("div",{style:n.textareaContainer,children:[e.jsx("textarea",{id:"comment",value:S,onChange:J,placeholder:"Type your comment or notes here...",style:{...n.textarea,...x?n.textareaError:{}},rows:4,disabled:p}),e.jsxs("div",{style:n.characterCount,children:[S.length," characters"]})]}),x&&e.jsx("div",{style:n.errorMessage,children:x})]}),e.jsx("button",{type:"submit",style:{...n.button,...p?n.buttonDisabled:{},...t&&S.trim()?n.buttonActive:{}},disabled:p||!t||!S.trim(),children:e.jsx("div",{style:n.buttonContent,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:n.spinner}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(E,{size:16}),"Submit Comment"]})})})]})]})]})}const n={container:{maxWidth:"500px",margin:"50px auto",padding:"32px",border:"1px solid #e1e5e9",borderRadius:"16px",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.1)",display:"flex",flexDirection:"column",alignItems:"center",backgroundColor:"#ffffff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',minHeight:"400px"},reminderTypeWrapper:{display:"flex",flexDirection:"columns"},logo:{width:"20rem",height:"auto",marginBottom:"1.5rem"},headerSection:{textAlign:"center",marginBottom:"32px",width:"100%"},subheading:{fontSize:"16px",color:"#718096",margin:0,lineHeight:"1.5"},form:{display:"flex",flexDirection:"column",width:"100%",gap:"24px"},inputGroup:{display:"flex",flexDirection:"column",gap:"8px",width:"100%"},inputLabel:{fontSize:"14px",fontWeight:"600",color:"#2d3748"},textareaContainer:{position:"relative"},textarea:{width:"100%",padding:"12px",fontSize:"16px",border:"2px solid #e2e8f0",borderRadius:"8px",backgroundColor:"#ffffff",color:"#2d3748",outline:"none",transition:"border-color 0.3s ease",fontFamily:"inherit",resize:"vertical",minHeight:"100px"},textareaError:{borderColor:"#e53e3e"},characterCount:{position:"absolute",bottom:"8px",right:"12px",fontSize:"12px",color:"#a0aec0",backgroundColor:"#ffffff",padding:"2px 4px"},errorMessage:{fontSize:"14px",color:"#e53e3e",backgroundColor:"#fed7d7",padding:"8px 12px",borderRadius:"6px",border:"1px solid #feb2b2"},button:{padding:"16px 24px",fontSize:"16px",fontWeight:"600",border:"none",borderRadius:"12px",backgroundColor:"#a0aec0",color:"#ffffff",cursor:"not-allowed",transition:"all 0.3s ease",outline:"none",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"56px",transform:"translateY(0)"},buttonActive:{backgroundColor:"#4388c1",cursor:"pointer",boxShadow:"0 4px 12px rgba(67, 136, 193, 0.3)"},buttonDisabled:{backgroundColor:"#a0aec0",cursor:"not-allowed",transform:"none",boxShadow:"none"},buttonContent:{display:"flex",alignItems:"center",gap:"8px"},spinner:{width:"16px",height:"16px",border:"2px solid transparent",borderTop:"2px solid #ffffff",borderRadius:"50%",animation:"spin 1s linear infinite"},successContainer:{textAlign:"center",padding:"40px 20px",width:"100%"},successIcon:{width:"64px",height:"64px",backgroundColor:"#48bb78",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",fontWeight:"bold",margin:"0 auto 24px",animation:"bounceIn 0.6s ease-out"},successHeading:{fontSize:"24px",fontWeight:"700",color:"#2d3748",margin:"0 0 12px 0"},successMessage:{fontSize:"16px",color:"#718096",margin:"0 0 32px 0",lineHeight:"1.5"},newCommentButton:{padding:"12px 24px",fontSize:"14px",fontWeight:"600",border:"2px solid #4388c1",borderRadius:"8px",backgroundColor:"transparent",color:"#4388c1",cursor:"pointer",transition:"all 0.3s ease"},newCommentButtonHover:{":hover":{backgroundColor:"#4388c1",color:"white"}}};if(typeof document<"u"){const t=document.createElement("style");t.type="text/css",t.innerText=`
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
    `,document.head.appendChild(t)}export{nt as default};
