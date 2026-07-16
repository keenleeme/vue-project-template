/*!
 * @ued-material/ued-wbc 
 *  Builder: xing.i 
 *  Version: 1.0.0 
 *  Date: 2025/12/30 14:29:51
 */function r(i,t=50,e=!1){let o=null;return function(...n){const s=this;o&&clearTimeout(o),e&&!o&&i.apply(s,n),o=setTimeout(()=>{i.apply(s,n)},t)}}const l=i=>async t=>{let e;return i.api?e=i.api.bind(t):e=()=>Promise.resolve(!0),typeof e=="function"?await e():Promise.resolve(!0)},a=(...i)=>i.reduce((t,e)=>(Array.isArray(e)?t+=e.join(" "):typeof e=="object"?t+=Object.keys(e).filter(o=>e[o]).join(" "):typeof e=="string"&&(t+=`${e} `),t),"");export{l as a,a as c,r as d};
