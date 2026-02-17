import{at as M,r as o,ab as q,j as e,L as c,I as y,p as k,q as N,t as V,v as W,w as z,c as O}from"./index-DSK3H15k.js";import{S as Y}from"./send-DLky-XsQ.js";function U(){const{us_id:h}=M(),[d,f]=o.useState(h||""),[u,x]=o.useState(""),[p,b]=o.useState(""),[a,g]=o.useState(""),[i,S]=o.useState(""),[D,w]=o.useState(!1),[l,C]=o.useState(!1),[m,r]=o.useState(""),F=L(),R=["P1","P2","P3","P4"],E=["Vendor A","Vendor B","Vendor C","Vendor D"];function L(){const s=new URLSearchParams(q().search),n={};for(const[A,H]of s.entries())n[A]=H;return n}const T=()=>d.trim()?u?p?a.trim()?i.trim()?isNaN(a)||parseInt(a)<0?(r("Please enter a valid number for sheets sent."),!1):isNaN(i)||parseInt(i)<0?(r("Please enter a valid number for sheets wasted."),!1):!0:(r("Please enter number of sheets wasted."),!1):(r("Please enter number of sheets sent."),!1):(r("Please select a vendor."),!1):(r("Please select a process."),!1):(r("Job ID is required."),!1),B=async s=>{if(s.preventDefault(),!!T())try{C(!0),r("");const n={...F,job_id:d.trim(),process:u,vendor:p,sheets_sent:parseInt(a),sheets_wasted:parseInt(i)};await O.post("https://click.wa.expert/api/data/updateSheetTransfer",n),w(!0),f(h||""),x(""),b(""),g(""),S("")}catch{r("Failed to submit data. Please try again.")}finally{C(!1)}},j=s=>n=>{s(n.target.value),m&&r("")},I=s=>n=>{s(n),m&&r("")};if(D)return e.jsxs("div",{style:t.container,children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:t.logo}),e.jsxs("div",{style:t.successContainer,children:[e.jsx("div",{style:t.successIcon,children:"✓"}),e.jsx("h2",{style:t.successHeading,children:"Thank You!"}),e.jsx("p",{style:t.successMessage,children:"Your sheet transfer data has been submitted successfully."}),e.jsx("button",{onClick:()=>{w(!1),f(h||""),x(""),b(""),g(""),S("")},style:t.newCommentButton,children:"Submit Another Entry"})]})]});const P=d.trim()&&u&&p&&a.trim()&&i.trim();return e.jsxs("div",{style:t.container,children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:t.logo}),e.jsxs("form",{onSubmit:B,style:t.form,children:[e.jsxs("div",{className:"w-full mb-4",children:[e.jsx(c,{htmlFor:"jobId",style:t.inputLabel,children:"Job ID"}),e.jsx(y,{id:"jobId",value:d,onChange:j(f),placeholder:"Enter job ID",disabled:l})]}),e.jsxs("div",{className:"w-full mb-4",children:[e.jsx(c,{children:"Choose the Process"}),e.jsxs(k,{value:u,onValueChange:I(x),className:"w-full",children:[e.jsx(N,{children:e.jsx(V,{placeholder:"Select process"})}),e.jsx(W,{children:R.map((s,n)=>e.jsx(z,{value:s,children:s},n))})]})]}),e.jsxs("div",{className:"w-full mb-4",children:[e.jsx(c,{children:"Choose the Vendor"}),e.jsxs(k,{value:p,onValueChange:I(b),className:"w-full",children:[e.jsx(N,{children:e.jsx(V,{placeholder:"Select vendor"})}),e.jsx(W,{children:E.map((s,n)=>e.jsx(z,{value:s,children:s},n))})]})]}),e.jsxs("div",{className:"w-full mb-4",children:[e.jsx(c,{htmlFor:"sheetsSent",style:t.inputLabel,children:"Number of Sheets Sent"}),e.jsx(y,{id:"sheetsSent",type:"number",min:"0",value:a,onChange:j(g),placeholder:"Enter number of sheets sent",disabled:l})]}),e.jsxs("div",{className:"w-full mb-4",children:[e.jsx(c,{htmlFor:"sheetsWasted",style:t.inputLabel,children:"Number of Sheets Wasted"}),e.jsx(y,{id:"sheetsWasted",type:"number",min:"0",value:i,onChange:j(S),placeholder:"Enter number of sheets wasted",disabled:l})]}),m&&e.jsx("div",{style:t.errorMessage,children:m}),e.jsx("button",{type:"submit",style:{...t.button,...l?t.buttonDisabled:{},...P?t.buttonActive:{}},disabled:l||!P,children:e.jsx("div",{style:t.buttonContent,children:l?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:t.spinner}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{size:16}),"Submit Sheet Transfer"]})})})]})]})}const t={container:{maxWidth:"500px",margin:"50px auto",padding:"32px",border:"1px solid #e1e5e9",borderRadius:"16px",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.1)",display:"flex",flexDirection:"column",alignItems:"center",backgroundColor:"#ffffff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',minHeight:"400px"},logo:{width:"20rem",height:"auto",marginBottom:"1.5rem"},form:{display:"flex",flexDirection:"column",width:"100%",gap:"24px"},inputLabel:{fontSize:"14px",fontWeight:"600",color:"#2d3748",marginBottom:"4px"},errorMessage:{fontSize:"14px",color:"#e53e3e",backgroundColor:"#fed7d7",padding:"8px 12px",borderRadius:"6px",border:"1px solid #feb2b2"},button:{padding:"16px 24px",fontSize:"16px",fontWeight:"600",border:"none",borderRadius:"12px",backgroundColor:"#a0aec0",color:"#ffffff",cursor:"not-allowed",transition:"all 0.3s ease",outline:"none",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"56px",transform:"translateY(0)"},buttonActive:{backgroundColor:"#4388c1",cursor:"pointer",boxShadow:"0 4px 12px rgba(67, 136, 193, 0.3)"},buttonDisabled:{backgroundColor:"#a0aec0",cursor:"not-allowed",transform:"none",boxShadow:"none"},buttonContent:{display:"flex",alignItems:"center",gap:"8px"},spinner:{width:"16px",height:"16px",border:"2px solid transparent",borderTop:"2px solid #ffffff",borderRadius:"50%",animation:"spin 1s linear infinite"},successContainer:{textAlign:"center",padding:"40px 20px",width:"100%"},successIcon:{width:"64px",height:"64px",backgroundColor:"#48bb78",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",fontWeight:"bold",margin:"0 auto 24px",animation:"bounceIn 0.6s ease-out"},successHeading:{fontSize:"24px",fontWeight:"700",color:"#2d3748",margin:"0 0 12px 0"},successMessage:{fontSize:"16px",color:"#718096",margin:"0 0 32px 0",lineHeight:"1.5"},newCommentButton:{padding:"12px 24px",fontSize:"14px",fontWeight:"600",border:"2px solid #4388c1",borderRadius:"8px",backgroundColor:"transparent",color:"#4388c1",cursor:"pointer",transition:"all 0.3s ease"}},v=document.createElement("style");v.type="text/css";v.innerText=`
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
  
  textarea:focus {
    border-color: #4388c1 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
  }
  
  button:not(:disabled):hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
  }
  
  .new-comment-button:hover {
    background-color: #4388c1 !important;
    color: white !important;
  }
`;document.head.appendChild(v);export{U as default};
