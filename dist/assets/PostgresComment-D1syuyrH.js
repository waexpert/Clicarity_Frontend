import{r as l,a3 as S,j as e,L as C,c as j}from"./index-D7vkFnLn.js";import{S as w}from"./send-B9bxkpkA.js";function z(){const[o,c]=l.useState(""),[u,p]=l.useState(!1),[a,m]=l.useState(!1),[s,i]=l.useState(""),x=f();function f(){const n=new URLSearchParams(S().search),r={};for(const[h,y]of n.entries())r[h]=y;return r}const b=async n=>{if(n.preventDefault(),!o.trim()){i("Please enter a comment before submitting.");return}try{m(!0),i("");const r={...x,comment:o.trim()};await j.post("https://click.wa.expert/api/data/updateComment",r),p(!0),c("")}catch{i("Failed to update comment. Please try again.")}finally{m(!1)}},g=n=>{c(n.target.value),s&&i("")};return u?e.jsxs("div",{style:t.container,children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:t.logo}),e.jsxs("div",{style:t.successContainer,children:[e.jsx("div",{style:t.successIcon,children:"✓"}),e.jsx("h2",{style:t.successHeading,children:"Thank You!"}),e.jsx("p",{style:t.successMessage,children:"Your comment has been submitted successfully."}),e.jsx("button",{onClick:()=>{p(!1),c("")},style:t.newCommentButton,children:"Submit Another Comment"})]})]}):e.jsxs("div",{style:t.container,children:[e.jsx("img",{src:"https://clicarity.s3.eu-north-1.amazonaws.com/logo.png",alt:"logo",style:t.logo}),e.jsx("div",{style:t.headerSection,children:e.jsx("p",{style:t.subheading,children:"Please enter your comment or notes below"})}),e.jsxs("form",{onSubmit:b,style:t.form,children:[e.jsxs("div",{style:t.inputGroup,children:[e.jsx(C,{htmlFor:"comment",style:t.inputLabel,children:"Your Comment"}),e.jsxs("div",{style:t.textareaContainer,children:[e.jsx("textarea",{id:"comment",value:o,onChange:g,placeholder:"Type your comment or notes here...",style:{...t.textarea,...s?t.textareaError:{}},rows:4,disabled:a}),e.jsxs("div",{style:t.characterCount,children:[o.length," characters"]})]}),s&&e.jsx("div",{style:t.errorMessage,children:s})]}),e.jsx("button",{type:"submit",style:{...t.button,...a?t.buttonDisabled:{},...o.trim()?t.buttonActive:{}},disabled:a||!o.trim(),children:e.jsx("div",{style:t.buttonContent,children:a?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:t.spinner}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(w,{size:16}),"Submit Comment"]})})})]})]})}const t={container:{maxWidth:"500px",margin:"50px auto",padding:"32px",border:"1px solid #e1e5e9",borderRadius:"16px",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.1)",display:"flex",flexDirection:"column",alignItems:"center",backgroundColor:"#ffffff",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',minHeight:"400px"},logo:{width:"20rem",height:"auto",marginBottom:"1.5rem"},headerSection:{textAlign:"center",marginBottom:"32px",width:"100%"},subheading:{fontSize:"16px",color:"#718096",margin:0,lineHeight:"1.5"},form:{display:"flex",flexDirection:"column",width:"100%",gap:"24px"},inputGroup:{display:"flex",flexDirection:"column",gap:"8px",width:"100%"},inputLabel:{fontSize:"14px",fontWeight:"600",color:"#2d3748",marginBottom:"4px"},textareaContainer:{position:"relative",width:"100%"},textarea:{width:"100%",padding:"16px",fontSize:"16px",borderRadius:"12px",border:"2px solid #e2e8f0",transition:"all 0.3s ease",outline:"none",resize:"vertical",minHeight:"120px",fontFamily:"inherit",lineHeight:"1.5",backgroundColor:"#fafafa",boxSizing:"border-box"},textareaError:{borderColor:"#e53e3e",backgroundColor:"#fed7d7"},characterCount:{position:"absolute",bottom:"8px",right:"12px",fontSize:"12px",color:"#a0aec0",backgroundColor:"rgba(255, 255, 255, 0.9)",padding:"2px 6px",borderRadius:"4px"},errorMessage:{fontSize:"14px",color:"#e53e3e",backgroundColor:"#fed7d7",padding:"8px 12px",borderRadius:"6px",border:"1px solid #feb2b2"},button:{padding:"16px 24px",fontSize:"16px",fontWeight:"600",border:"none",borderRadius:"12px",backgroundColor:"#a0aec0",color:"#ffffff",cursor:"not-allowed",transition:"all 0.3s ease",outline:"none",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"56px",transform:"translateY(0)"},buttonActive:{backgroundColor:"#4388c1",cursor:"pointer",boxShadow:"0 4px 12px rgba(67, 136, 193, 0.3)"},buttonDisabled:{backgroundColor:"#a0aec0",cursor:"not-allowed",transform:"none",boxShadow:"none"},buttonContent:{display:"flex",alignItems:"center",gap:"8px"},spinner:{width:"16px",height:"16px",border:"2px solid transparent",borderTop:"2px solid #ffffff",borderRadius:"50%",animation:"spin 1s linear infinite"},successContainer:{textAlign:"center",padding:"40px 20px",width:"100%"},successIcon:{width:"64px",height:"64px",backgroundColor:"#48bb78",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",fontWeight:"bold",margin:"0 auto 24px",animation:"bounceIn 0.6s ease-out"},successHeading:{fontSize:"24px",fontWeight:"700",color:"#2d3748",margin:"0 0 12px 0"},successMessage:{fontSize:"16px",color:"#718096",margin:"0 0 32px 0",lineHeight:"1.5"},newCommentButton:{padding:"12px 24px",fontSize:"14px",fontWeight:"600",border:"2px solid #4388c1",borderRadius:"8px",backgroundColor:"transparent",color:"#4388c1",cursor:"pointer",transition:"all 0.3s ease"}},d=document.createElement("style");d.type="text/css";d.innerText=`
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
`;document.head.appendChild(d);export{z as default};
