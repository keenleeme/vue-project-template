import{d as yt,r as me,g as U,q as wt,G as kt,E as Mt,l as Vt,o as R,c as _,z as ae,j,h as ee,w as te,a as re,H as Pe,n as Be,F as Ot,e as xt,t as se,T as It,u as at,i as _e}from"./vue-C1kZydvV.js";import{_ as Wt}from"./index-DysLjLH0.js";import{B as zt}from"./index-Dy3ZsM_w.js";const st={onStart:()=>{},onPreviousStep:e=>{},onNextStep:e=>{},onStop:(e,t)=>{},onSkip:()=>{},onFinish:()=>{}},$e={highlight:!1,mask:!0,maskPadding:0,labels:{buttonPrevious:"上一步",buttonNext:"下一步",buttonStop:"完成"},enabledButtons:{buttonPrevious:!0,buttonNext:!0,buttonStop:!0},startTimeout:0,stopOnTargetNotFound:!0,useKeyboardNavigation:!1,enabledNavigationKeys:{escape:!0,arrowRight:!0,arrowLeft:!0},debug:!1},q={classes:{active:"v-tour--active",targetHighlighted:"v-tour__target--highlighted",targetRelative:"v-tour__target--relative"},transition:"box-shadow 0s ease-in-out 0s"},lt={enableScrolling:!0,highlight:$e.highlight,enabledButtons:$e.enabledButtons,modifiers:[{name:"arrow",options:{element:".v-step__arrow",padding:10}},{name:"preventOverflow",options:{rootBoundary:"window"}},{name:"offset",options:{offset:[0,10]}}],placement:"bottom"},He={ARROW_RIGHT:39,ARROW_LEFT:37,ESCAPE:27};var Ie=yt({name:"v-tour",props:{steps:{type:Array,default:()=>[]},name:{type:String},options:{type:Object,default:()=>$e},callbacks:{type:Object,default:()=>st}},setup(e,t){const r=Mt(),o=me(null),n=me(-1),a=U(()=>({...$e,...e.options})),i=U(()=>({...st,...e.callbacks})),l=U(()=>e.steps.length),s=U(()=>n.value>-1&&n.value<l.value),u=U(()=>n.value===0),p=U(()=>n.value===l.value-1);U(()=>e.steps[n.value]);const y=async()=>{if(i.value.previousStepHook){const f=i.value.previousStepHook(n.value,e.name,t.root.$tours[e.name]);if(await(f instanceof Promise?f:Promise.resolve(f))===!1)return}const c=n.value-1,g=()=>new Promise((f,k)=>{i.value.onPreviousStep(n.value),n.value=c,f()});if(c>-1){const f=e.steps[c];if(typeof f.before<"u")try{await f.before("previous")}catch(k){return Promise.reject(k)}await g()}return Promise.resolve()},O=async()=>{if(i.value.nextStepHook){const f=i.value.nextStepHook(n.value,e.name,t.root.$tours[e.name]);if(await(f instanceof Promise?f:Promise.resolve(f))===!1)return}const c=n.value+1,g=()=>new Promise((f,k)=>{i.value.onNextStep(n.value),n.value=c,f()});if(c<l.value&&n.value!==-1){const f=e.steps[c];if(typeof f.before<"u")try{await f.before("next")}catch(k){return Promise.reject(k)}await g()}return Promise.resolve()},d=()=>{i.value.onStop(n.value,e.name),document.body.classList.remove("v-tour--active"),n.value=-1},S=()=>{i.value.onSkip(),d()},b=()=>{i.value.onFinish(),d()},m=c=>{const{enabledNavigationKeys:g}=a.value;return g&&g[c]},x=c=>{switch(a.value.debug&&console.log("[Vue Tour] A keyup event occured:",c),c.keyCode){case He.ARROW_RIGHT:m("arrowRight")&&O();break;case He.ARROW_LEFT:m("arrowLeft")&&y();break;case He.ESCAPE:m("escape")&&d();break}},w=async c=>{a.value.useKeyboardNavigation&&window.addEventListener("keyup",x),c=typeof c<"u"?parseInt(c,10):0;const g=e.steps[c],f=()=>new Promise((k,v)=>{setTimeout(()=>{i.value.onStart(),n.value=c,k()},a.value.startTimeout)});if(typeof g.before<"u")try{await g.before("start")}catch(k){return Promise.reject(k)}return await f(),Promise.resolve()},h=()=>{t.root.$children&&t.root.$children[0]&&t.root.$children[0].update()};return wt(()=>{if(r&&r.proxy){const c=r.proxy;c.$tours[e.name]=r.proxy}}),kt(()=>{a.value.useKeyboardNavigation&&window.removeEventListener("keyup",x)}),{VTour:o,currentStep:n,customOptions:a,isFirst:u,isLast:p,isRunning:s,previousStep:y,nextStep:O,stop:d,skip:S,finish:b,isKeyEnabled:m,start:w,update:h}}});const qt={ref:"VTour",class:"v-tour"};function Yt(e,t,r,o,n,a){const i=Vt("v-step");return R(),_("div",qt,[ae(e.$slots,"default",{currentStep:e.currentStep,steps:e.steps,previousStep:e.previousStep,nextStep:e.nextStep,stop:e.stop,skip:e.skip,finish:e.finish,isFirst:e.isFirst,isLast:e.isLast,labels:e.customOptions.labels,enabledButtons:e.customOptions.enabledButtons,highlight:e.customOptions.highlight,mask:e.customOptions.mask,maskPadding:e.customOptions.maskPadding,hideCloseBtn:e.customOptions.hideCloseBtn,debug:e.customOptions.debug},()=>[j("Default slot {{ currentStep }}"),e.steps[e.currentStep]?(R(),ee(i,{key:e.currentStep,step:e.steps[e.currentStep],"previous-step":e.previousStep,"next-step":e.nextStep,stop:e.stop,skip:e.skip,finish:e.finish,"is-first":e.isFirst,"is-last":e.isLast,labels:e.customOptions.labels,"enabled-buttons":e.customOptions.enabledButtons,highlight:e.customOptions.highlight,mask:e.customOptions.mask,"mask-padding":e.customOptions.maskPadding,"stop-on-fail":e.customOptions.stopOnTargetNotFound,debug:e.customOptions.debug,hideCloseBtn:e.customOptions.hideCloseBtn,onTargetNotFound:t[0]||(t[0]=l=>e.$emit("targetNotFound",l))},{default:te(()=>[j(`<div v-if="index === 2" slot="actions">\r
          <a @click="nextStep">Next step</a>\r
        </div>`)]),_:1},8,["step","previous-step","next-step","stop","skip","finish","is-first","is-last","labels","enabled-buttons","highlight","mask","mask-padding","stop-on-fail","debug","hideCloseBtn"])):j("v-if",!0)])],512)}Ie.render=Yt;Ie.__file="src/lib/VTour.vue";var D="top",M="bottom",V="right",F="left",We="auto",we=[D,M,V,F],le="start",be="end",Ut="clippingParents",St="viewport",ve="popper",Kt="reference",ut=we.reduce(function(e,t){return e.concat([t+"-"+le,t+"-"+be])},[]),Ct=[].concat(we,[We]).reduce(function(e,t){return e.concat([t,t+"-"+le,t+"-"+be])},[]),Xt="beforeRead",Gt="read",Qt="afterRead",Jt="beforeMain",Zt="main",er="afterMain",tr="beforeWrite",rr="write",nr="afterWrite",or=[Xt,Gt,Qt,Jt,Zt,er,tr,rr,nr];function z(e){return e?(e.nodeName||"").toLowerCase():null}function N(e){if(e==null)return window;if(e.toString()!=="[object Window]"){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function oe(e){var t=N(e).Element;return e instanceof t||e instanceof Element}function H(e){var t=N(e).HTMLElement;return e instanceof t||e instanceof HTMLElement}function ze(e){if(typeof ShadowRoot>"u")return!1;var t=N(e).ShadowRoot;return e instanceof t||e instanceof ShadowRoot}function ir(e){var t=e.state;Object.keys(t.elements).forEach(function(r){var o=t.styles[r]||{},n=t.attributes[r]||{},a=t.elements[r];!H(a)||!z(a)||(Object.assign(a.style,o),Object.keys(n).forEach(function(i){var l=n[i];l===!1?a.removeAttribute(i):a.setAttribute(i,l===!0?"":l)}))})}function ar(e){var t=e.state,r={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,r.popper),t.styles=r,t.elements.arrow&&Object.assign(t.elements.arrow.style,r.arrow),function(){Object.keys(t.elements).forEach(function(o){var n=t.elements[o],a=t.attributes[o]||{},i=Object.keys(t.styles.hasOwnProperty(o)?t.styles[o]:r[o]),l=i.reduce(function(s,u){return s[u]="",s},{});!H(n)||!z(n)||(Object.assign(n.style,l),Object.keys(a).forEach(function(s){n.removeAttribute(s)}))})}}var sr={name:"applyStyles",enabled:!0,phase:"write",fn:ir,effect:ar,requires:["computeStyles"]};function W(e){return e.split("-")[0]}var ne=Math.max,Le=Math.min,ue=Math.round;function Me(){var e=navigator.userAgentData;return e!=null&&e.brands&&Array.isArray(e.brands)?e.brands.map(function(t){return t.brand+"/"+t.version}).join(" "):navigator.userAgent}function Et(){return!/^((?!chrome|android).)*safari/i.test(Me())}function pe(e,t,r){t===void 0&&(t=!1),r===void 0&&(r=!1);var o=e.getBoundingClientRect(),n=1,a=1;t&&H(e)&&(n=e.offsetWidth>0&&ue(o.width)/e.offsetWidth||1,a=e.offsetHeight>0&&ue(o.height)/e.offsetHeight||1);var i=oe(e)?N(e):window,l=i.visualViewport,s=!Et()&&r,u=(o.left+(s&&l?l.offsetLeft:0))/n,p=(o.top+(s&&l?l.offsetTop:0))/a,y=o.width/n,O=o.height/a;return{width:y,height:O,top:p,right:u+y,bottom:p+O,left:u,x:u,y:p}}function qe(e){var t=pe(e),r=e.offsetWidth,o=e.offsetHeight;return Math.abs(t.width-r)<=1&&(r=t.width),Math.abs(t.height-o)<=1&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:r,height:o}}function Pt(e,t){var r=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(r&&ze(r)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}function K(e){return N(e).getComputedStyle(e)}function lr(e){return["table","td","th"].indexOf(z(e))>=0}function G(e){return((oe(e)?e.ownerDocument:e.document)||window.document).documentElement}function Re(e){return z(e)==="html"?e:e.assignedSlot||e.parentNode||(ze(e)?e.host:null)||G(e)}function pt(e){return!H(e)||K(e).position==="fixed"?null:e.offsetParent}function ur(e){var t=/firefox/i.test(Me()),r=/Trident/i.test(Me());if(r&&H(e)){var o=K(e);if(o.position==="fixed")return null}var n=Re(e);for(ze(n)&&(n=n.host);H(n)&&["html","body"].indexOf(z(n))<0;){var a=K(n);if(a.transform!=="none"||a.perspective!=="none"||a.contain==="paint"||["transform","perspective"].indexOf(a.willChange)!==-1||t&&a.willChange==="filter"||t&&a.filter&&a.filter!=="none")return n;n=n.parentNode}return null}function ke(e){for(var t=N(e),r=pt(e);r&&lr(r)&&K(r).position==="static";)r=pt(r);return r&&(z(r)==="html"||z(r)==="body"&&K(r).position==="static")?t:r||ur(e)||t}function Ye(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function he(e,t,r){return ne(e,Le(t,r))}function pr(e,t,r){var o=he(e,t,r);return o>r?r:o}function Bt(){return{top:0,right:0,bottom:0,left:0}}function Tt(e){return Object.assign({},Bt(),e)}function At(e,t){return t.reduce(function(r,o){return r[o]=e,r},{})}var cr=function(t,r){return t=typeof t=="function"?t(Object.assign({},r.rects,{placement:r.placement})):t,Tt(typeof t!="number"?t:At(t,we))};function fr(e){var t,r=e.state,o=e.name,n=e.options,a=r.elements.arrow,i=r.modifiersData.popperOffsets,l=W(r.placement),s=Ye(l),u=[F,V].indexOf(l)>=0,p=u?"height":"width";if(!(!a||!i)){var y=cr(n.padding,r),O=qe(a),d=s==="y"?D:F,S=s==="y"?M:V,b=r.rects.reference[p]+r.rects.reference[s]-i[s]-r.rects.popper[p],m=i[s]-r.rects.reference[s],x=ke(a),w=x?s==="y"?x.clientHeight||0:x.clientWidth||0:0,h=b/2-m/2,c=y[d],g=w-O[p]-y[S],f=w/2-O[p]/2+h,k=he(c,f,g),v=s;r.modifiersData[o]=(t={},t[v]=k,t.centerOffset=k-f,t)}}function dr(e){var t=e.state,r=e.options,o=r.element,n=o===void 0?"[data-popper-arrow]":o;n!=null&&(typeof n=="string"&&(n=t.elements.popper.querySelector(n),!n)||Pt(t.elements.popper,n)&&(t.elements.arrow=n))}var vr={name:"arrow",enabled:!0,phase:"main",fn:fr,effect:dr,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ce(e){return e.split("-")[1]}var mr={top:"auto",right:"auto",bottom:"auto",left:"auto"};function hr(e,t){var r=e.x,o=e.y,n=t.devicePixelRatio||1;return{x:ue(r*n)/n||0,y:ue(o*n)/n||0}}function ct(e){var t,r=e.popper,o=e.popperRect,n=e.placement,a=e.variation,i=e.offsets,l=e.position,s=e.gpuAcceleration,u=e.adaptive,p=e.roundOffsets,y=e.isFixed,O=i.x,d=O===void 0?0:O,S=i.y,b=S===void 0?0:S,m=typeof p=="function"?p({x:d,y:b}):{x:d,y:b};d=m.x,b=m.y;var x=i.hasOwnProperty("x"),w=i.hasOwnProperty("y"),h=F,c=D,g=window;if(u){var f=ke(r),k="clientHeight",v="clientWidth";if(f===N(r)&&(f=G(r),K(f).position!=="static"&&l==="absolute"&&(k="scrollHeight",v="scrollWidth")),f=f,n===D||(n===F||n===V)&&a===be){c=M;var C=y&&f===g&&g.visualViewport?g.visualViewport.height:f[k];b-=C-o.height,b*=s?1:-1}if(n===F||(n===D||n===M)&&a===be){h=V;var B=y&&f===g&&g.visualViewport?g.visualViewport.width:f[v];d-=B-o.width,d*=s?1:-1}}var T=Object.assign({position:l},u&&mr),A=p===!0?hr({x:d,y:b},N(r)):{x:d,y:b};if(d=A.x,b=A.y,s){var E;return Object.assign({},T,(E={},E[c]=w?"0":"",E[h]=x?"0":"",E.transform=(g.devicePixelRatio||1)<=1?"translate("+d+"px, "+b+"px)":"translate3d("+d+"px, "+b+"px, 0)",E))}return Object.assign({},T,(t={},t[c]=w?b+"px":"",t[h]=x?d+"px":"",t.transform="",t))}function gr(e){var t=e.state,r=e.options,o=r.gpuAcceleration,n=o===void 0?!0:o,a=r.adaptive,i=a===void 0?!0:a,l=r.roundOffsets,s=l===void 0?!0:l,u={placement:W(t.placement),variation:ce(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:n,isFixed:t.options.strategy==="fixed"};t.modifiersData.popperOffsets!=null&&(t.styles.popper=Object.assign({},t.styles.popper,ct(Object.assign({},u,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:i,roundOffsets:s})))),t.modifiersData.arrow!=null&&(t.styles.arrow=Object.assign({},t.styles.arrow,ct(Object.assign({},u,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:s})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})}var br={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:gr,data:{}},Te={passive:!0};function yr(e){var t=e.state,r=e.instance,o=e.options,n=o.scroll,a=n===void 0?!0:n,i=o.resize,l=i===void 0?!0:i,s=N(t.elements.popper),u=[].concat(t.scrollParents.reference,t.scrollParents.popper);return a&&u.forEach(function(p){p.addEventListener("scroll",r.update,Te)}),l&&s.addEventListener("resize",r.update,Te),function(){a&&u.forEach(function(p){p.removeEventListener("scroll",r.update,Te)}),l&&s.removeEventListener("resize",r.update,Te)}}var wr={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:yr,data:{}},kr={left:"right",right:"left",bottom:"top",top:"bottom"};function Ae(e){return e.replace(/left|right|bottom|top/g,function(t){return kr[t]})}var Or={start:"end",end:"start"};function ft(e){return e.replace(/start|end/g,function(t){return Or[t]})}function Ue(e){var t=N(e),r=t.pageXOffset,o=t.pageYOffset;return{scrollLeft:r,scrollTop:o}}function Ke(e){return pe(G(e)).left+Ue(e).scrollLeft}function xr(e,t){var r=N(e),o=G(e),n=r.visualViewport,a=o.clientWidth,i=o.clientHeight,l=0,s=0;if(n){a=n.width,i=n.height;var u=Et();(u||!u&&t==="fixed")&&(l=n.offsetLeft,s=n.offsetTop)}return{width:a,height:i,x:l+Ke(e),y:s}}function Sr(e){var t,r=G(e),o=Ue(e),n=(t=e.ownerDocument)==null?void 0:t.body,a=ne(r.scrollWidth,r.clientWidth,n?n.scrollWidth:0,n?n.clientWidth:0),i=ne(r.scrollHeight,r.clientHeight,n?n.scrollHeight:0,n?n.clientHeight:0),l=-o.scrollLeft+Ke(e),s=-o.scrollTop;return K(n||r).direction==="rtl"&&(l+=ne(r.clientWidth,n?n.clientWidth:0)-a),{width:a,height:i,x:l,y:s}}function Xe(e){var t=K(e),r=t.overflow,o=t.overflowX,n=t.overflowY;return/auto|scroll|overlay|hidden/.test(r+n+o)}function $t(e){return["html","body","#document"].indexOf(z(e))>=0?e.ownerDocument.body:H(e)&&Xe(e)?e:$t(Re(e))}function ge(e,t){var r;t===void 0&&(t=[]);var o=$t(e),n=o===((r=e.ownerDocument)==null?void 0:r.body),a=N(o),i=n?[a].concat(a.visualViewport||[],Xe(o)?o:[]):o,l=t.concat(i);return n?l:l.concat(ge(Re(i)))}function Ve(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function Cr(e,t){var r=pe(e,!1,t==="fixed");return r.top=r.top+e.clientTop,r.left=r.left+e.clientLeft,r.bottom=r.top+e.clientHeight,r.right=r.left+e.clientWidth,r.width=e.clientWidth,r.height=e.clientHeight,r.x=r.left,r.y=r.top,r}function dt(e,t,r){return t===St?Ve(xr(e,r)):oe(t)?Cr(t,r):Ve(Sr(G(e)))}function Er(e){var t=ge(Re(e)),r=["absolute","fixed"].indexOf(K(e).position)>=0,o=r&&H(e)?ke(e):e;return oe(o)?t.filter(function(n){return oe(n)&&Pt(n,o)&&z(n)!=="body"}):[]}function Pr(e,t,r,o){var n=t==="clippingParents"?Er(e):[].concat(t),a=[].concat(n,[r]),i=a[0],l=a.reduce(function(s,u){var p=dt(e,u,o);return s.top=ne(p.top,s.top),s.right=Le(p.right,s.right),s.bottom=Le(p.bottom,s.bottom),s.left=ne(p.left,s.left),s},dt(e,i,o));return l.width=l.right-l.left,l.height=l.bottom-l.top,l.x=l.left,l.y=l.top,l}function Lt(e){var t=e.reference,r=e.element,o=e.placement,n=o?W(o):null,a=o?ce(o):null,i=t.x+t.width/2-r.width/2,l=t.y+t.height/2-r.height/2,s;switch(n){case D:s={x:i,y:t.y-r.height};break;case M:s={x:i,y:t.y+t.height};break;case V:s={x:t.x+t.width,y:l};break;case F:s={x:t.x-r.width,y:l};break;default:s={x:t.x,y:t.y}}var u=n?Ye(n):null;if(u!=null){var p=u==="y"?"height":"width";switch(a){case le:s[u]=s[u]-(t[p]/2-r[p]/2);break;case be:s[u]=s[u]+(t[p]/2-r[p]/2);break}}return s}function ye(e,t){t===void 0&&(t={});var r=t,o=r.placement,n=o===void 0?e.placement:o,a=r.strategy,i=a===void 0?e.strategy:a,l=r.boundary,s=l===void 0?Ut:l,u=r.rootBoundary,p=u===void 0?St:u,y=r.elementContext,O=y===void 0?ve:y,d=r.altBoundary,S=d===void 0?!1:d,b=r.padding,m=b===void 0?0:b,x=Tt(typeof m!="number"?m:At(m,we)),w=O===ve?Kt:ve,h=e.rects.popper,c=e.elements[S?w:O],g=Pr(oe(c)?c:c.contextElement||G(e.elements.popper),s,p,i),f=pe(e.elements.reference),k=Lt({reference:f,element:h,placement:n}),v=Ve(Object.assign({},h,k)),C=O===ve?v:f,B={top:g.top-C.top+x.top,bottom:C.bottom-g.bottom+x.bottom,left:g.left-C.left+x.left,right:C.right-g.right+x.right},T=e.modifiersData.offset;if(O===ve&&T){var A=T[n];Object.keys(B).forEach(function(E){var $=[V,M].indexOf(E)>=0?1:-1,L=[D,M].indexOf(E)>=0?"y":"x";B[E]+=A[L]*$})}return B}function Br(e,t){t===void 0&&(t={});var r=t,o=r.placement,n=r.boundary,a=r.rootBoundary,i=r.padding,l=r.flipVariations,s=r.allowedAutoPlacements,u=s===void 0?Ct:s,p=ce(o),y=p?l?ut:ut.filter(function(S){return ce(S)===p}):we,O=y.filter(function(S){return u.indexOf(S)>=0});O.length===0&&(O=y);var d=O.reduce(function(S,b){return S[b]=ye(e,{placement:b,boundary:n,rootBoundary:a,padding:i})[W(b)],S},{});return Object.keys(d).sort(function(S,b){return d[S]-d[b]})}function Tr(e){if(W(e)===We)return[];var t=Ae(e);return[ft(e),t,ft(t)]}function Ar(e){var t=e.state,r=e.options,o=e.name;if(!t.modifiersData[o]._skip){for(var n=r.mainAxis,a=n===void 0?!0:n,i=r.altAxis,l=i===void 0?!0:i,s=r.fallbackPlacements,u=r.padding,p=r.boundary,y=r.rootBoundary,O=r.altBoundary,d=r.flipVariations,S=d===void 0?!0:d,b=r.allowedAutoPlacements,m=t.options.placement,x=W(m),w=x===m,h=s||(w||!S?[Ae(m)]:Tr(m)),c=[m].concat(h).reduce(function(ie,X){return ie.concat(W(X)===We?Br(t,{placement:X,boundary:p,rootBoundary:y,padding:u,flipVariations:S,allowedAutoPlacements:b}):X)},[]),g=t.rects.reference,f=t.rects.popper,k=new Map,v=!0,C=c[0],B=0;B<c.length;B++){var T=c[B],A=W(T),E=ce(T)===le,$=[D,M].indexOf(A)>=0,L=$?"width":"height",P=ye(t,{placement:T,boundary:p,rootBoundary:y,altBoundary:O,padding:u}),I=$?E?V:F:E?M:D;g[L]>f[L]&&(I=Ae(I));var Oe=Ae(I),Q=[];if(a&&Q.push(P[A]<=0),l&&Q.push(P[I]<=0,P[Oe]<=0),Q.every(function(ie){return ie})){C=T,v=!1;break}k.set(T,Q)}if(v)for(var xe=S?3:1,je=function(X){var de=c.find(function(Ce){var J=k.get(Ce);if(J)return J.slice(0,X).every(function(De){return De})});if(de)return C=de,"break"},fe=xe;fe>0;fe--){var Se=je(fe);if(Se==="break")break}t.placement!==C&&(t.modifiersData[o]._skip=!0,t.placement=C,t.reset=!0)}}var $r={name:"flip",enabled:!0,phase:"main",fn:Ar,requiresIfExists:["offset"],data:{_skip:!1}};function vt(e,t,r){return r===void 0&&(r={x:0,y:0}),{top:e.top-t.height-r.y,right:e.right-t.width+r.x,bottom:e.bottom-t.height+r.y,left:e.left-t.width-r.x}}function mt(e){return[D,V,M,F].some(function(t){return e[t]>=0})}function Lr(e){var t=e.state,r=e.name,o=t.rects.reference,n=t.rects.popper,a=t.modifiersData.preventOverflow,i=ye(t,{elementContext:"reference"}),l=ye(t,{altBoundary:!0}),s=vt(i,o),u=vt(l,n,a),p=mt(s),y=mt(u);t.modifiersData[r]={referenceClippingOffsets:s,popperEscapeOffsets:u,isReferenceHidden:p,hasPopperEscaped:y},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":p,"data-popper-escaped":y})}var Rr={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:Lr};function jr(e,t,r){var o=W(e),n=[F,D].indexOf(o)>=0?-1:1,a=typeof r=="function"?r(Object.assign({},t,{placement:e})):r,i=a[0],l=a[1];return i=i||0,l=(l||0)*n,[F,V].indexOf(o)>=0?{x:l,y:i}:{x:i,y:l}}function Dr(e){var t=e.state,r=e.options,o=e.name,n=r.offset,a=n===void 0?[0,0]:n,i=Ct.reduce(function(p,y){return p[y]=jr(y,t.rects,a),p},{}),l=i[t.placement],s=l.x,u=l.y;t.modifiersData.popperOffsets!=null&&(t.modifiersData.popperOffsets.x+=s,t.modifiersData.popperOffsets.y+=u),t.modifiersData[o]=i}var Fr={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:Dr};function Nr(e){var t=e.state,r=e.name;t.modifiersData[r]=Lt({reference:t.rects.reference,element:t.rects.popper,placement:t.placement})}var _r={name:"popperOffsets",enabled:!0,phase:"read",fn:Nr,data:{}};function Hr(e){return e==="x"?"y":"x"}function Mr(e){var t=e.state,r=e.options,o=e.name,n=r.mainAxis,a=n===void 0?!0:n,i=r.altAxis,l=i===void 0?!1:i,s=r.boundary,u=r.rootBoundary,p=r.altBoundary,y=r.padding,O=r.tether,d=O===void 0?!0:O,S=r.tetherOffset,b=S===void 0?0:S,m=ye(t,{boundary:s,rootBoundary:u,padding:y,altBoundary:p}),x=W(t.placement),w=ce(t.placement),h=!w,c=Ye(x),g=Hr(c),f=t.modifiersData.popperOffsets,k=t.rects.reference,v=t.rects.popper,C=typeof b=="function"?b(Object.assign({},t.rects,{placement:t.placement})):b,B=typeof C=="number"?{mainAxis:C,altAxis:C}:Object.assign({mainAxis:0,altAxis:0},C),T=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,A={x:0,y:0};if(f){if(a){var E,$=c==="y"?D:F,L=c==="y"?M:V,P=c==="y"?"height":"width",I=f[c],Oe=I+m[$],Q=I-m[L],xe=d?-v[P]/2:0,je=w===le?k[P]:v[P],fe=w===le?-v[P]:-k[P],Se=t.elements.arrow,ie=d&&Se?qe(Se):{width:0,height:0},X=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:Bt(),de=X[$],Ce=X[L],J=he(0,k[P],ie[P]),De=h?k[P]/2-xe-J-de-B.mainAxis:je-J-de-B.mainAxis,jt=h?-k[P]/2+xe+J+Ce+B.mainAxis:fe+J+Ce+B.mainAxis,Fe=t.elements.arrow&&ke(t.elements.arrow),Dt=Fe?c==="y"?Fe.clientTop||0:Fe.clientLeft||0:0,Qe=(E=T==null?void 0:T[c])!=null?E:0,Ft=I+De-Qe-Dt,Nt=I+jt-Qe,Je=he(d?Le(Oe,Ft):Oe,I,d?ne(Q,Nt):Q);f[c]=Je,A[c]=Je-I}if(l){var Ze,_t=c==="x"?D:F,Ht=c==="x"?M:V,Z=f[g],Ee=g==="y"?"height":"width",et=Z+m[_t],tt=Z-m[Ht],Ne=[D,F].indexOf(x)!==-1,rt=(Ze=T==null?void 0:T[g])!=null?Ze:0,nt=Ne?et:Z-k[Ee]-v[Ee]-rt+B.altAxis,ot=Ne?Z+k[Ee]+v[Ee]-rt-B.altAxis:tt,it=d&&Ne?pr(nt,Z,ot):he(d?nt:et,Z,d?ot:tt);f[g]=it,A[g]=it-Z}t.modifiersData[o]=A}}var Vr={name:"preventOverflow",enabled:!0,phase:"main",fn:Mr,requiresIfExists:["offset"]};function Ir(e){return{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}}function Wr(e){return e===N(e)||!H(e)?Ue(e):Ir(e)}function zr(e){var t=e.getBoundingClientRect(),r=ue(t.width)/e.offsetWidth||1,o=ue(t.height)/e.offsetHeight||1;return r!==1||o!==1}function qr(e,t,r){r===void 0&&(r=!1);var o=H(t),n=H(t)&&zr(t),a=G(t),i=pe(e,n,r),l={scrollLeft:0,scrollTop:0},s={x:0,y:0};return(o||!o&&!r)&&((z(t)!=="body"||Xe(a))&&(l=Wr(t)),H(t)?(s=pe(t,!0),s.x+=t.clientLeft,s.y+=t.clientTop):a&&(s.x=Ke(a))),{x:i.left+l.scrollLeft-s.x,y:i.top+l.scrollTop-s.y,width:i.width,height:i.height}}function Yr(e){var t=new Map,r=new Set,o=[];e.forEach(function(a){t.set(a.name,a)});function n(a){r.add(a.name);var i=[].concat(a.requires||[],a.requiresIfExists||[]);i.forEach(function(l){if(!r.has(l)){var s=t.get(l);s&&n(s)}}),o.push(a)}return e.forEach(function(a){r.has(a.name)||n(a)}),o}function Ur(e){var t=Yr(e);return or.reduce(function(r,o){return r.concat(t.filter(function(n){return n.phase===o}))},[])}function Kr(e){var t;return function(){return t||(t=new Promise(function(r){Promise.resolve().then(function(){t=void 0,r(e())})})),t}}function Xr(e){var t=e.reduce(function(r,o){var n=r[o.name];return r[o.name]=n?Object.assign({},n,o,{options:Object.assign({},n.options,o.options),data:Object.assign({},n.data,o.data)}):o,r},{});return Object.keys(t).map(function(r){return t[r]})}var ht={placement:"bottom",modifiers:[],strategy:"absolute"};function gt(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return!t.some(function(o){return!(o&&typeof o.getBoundingClientRect=="function")})}function Gr(e){e===void 0&&(e={});var t=e,r=t.defaultModifiers,o=r===void 0?[]:r,n=t.defaultOptions,a=n===void 0?ht:n;return function(l,s,u){u===void 0&&(u=a);var p={placement:"bottom",orderedModifiers:[],options:Object.assign({},ht,a),modifiersData:{},elements:{reference:l,popper:s},attributes:{},styles:{}},y=[],O=!1,d={state:p,setOptions:function(x){var w=typeof x=="function"?x(p.options):x;b(),p.options=Object.assign({},a,p.options,w),p.scrollParents={reference:oe(l)?ge(l):l.contextElement?ge(l.contextElement):[],popper:ge(s)};var h=Ur(Xr([].concat(o,p.options.modifiers)));return p.orderedModifiers=h.filter(function(c){return c.enabled}),S(),d.update()},forceUpdate:function(){if(!O){var x=p.elements,w=x.reference,h=x.popper;if(gt(w,h)){p.rects={reference:qr(w,ke(h),p.options.strategy==="fixed"),popper:qe(h)},p.reset=!1,p.placement=p.options.placement,p.orderedModifiers.forEach(function(B){return p.modifiersData[B.name]=Object.assign({},B.data)});for(var c=0;c<p.orderedModifiers.length;c++){if(p.reset===!0){p.reset=!1,c=-1;continue}var g=p.orderedModifiers[c],f=g.fn,k=g.options,v=k===void 0?{}:k,C=g.name;typeof f=="function"&&(p=f({state:p,options:v,name:C,instance:d})||p)}}}},update:Kr(function(){return new Promise(function(m){d.forceUpdate(),m(p)})}),destroy:function(){b(),O=!0}};if(!gt(l,s))return d;d.setOptions(u).then(function(m){!O&&u.onFirstUpdate&&u.onFirstUpdate(m)});function S(){p.orderedModifiers.forEach(function(m){var x=m.name,w=m.options,h=w===void 0?{}:w,c=m.effect;if(typeof c=="function"){var g=c({state:p,name:x,instance:d,options:h}),f=function(){};y.push(g||f)}})}function b(){y.forEach(function(m){return m()}),y=[]}return d}}var Qr=[wr,_r,br,sr,Fr,$r,Vr,vr,Rr],Jr=Gr({defaultModifiers:Qr}),Zr=function(t,r,o,n){return t/=n/2,t<1?o/2*t*t+r:(t--,-o/2*(t*(t-2)-1)+r)},bt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},en=function(){var t=void 0,r=void 0,o=void 0,n=void 0,a=void 0,i=void 0,l=void 0,s=void 0,u=void 0,p=void 0,y=void 0,O=void 0;function d(){return window.scrollY||window.pageYOffset}function S(w){return w.getBoundingClientRect().top+r}function b(w){u||(u=w),p=w-u,y=a(p,r,l,s),window.scrollTo(0,y),p<s?window.requestAnimationFrame(b):m()}function m(){window.scrollTo(0,r+l),t&&i&&(t.setAttribute("tabindex","-1"),t.focus()),typeof O=="function"&&O(),u=!1}function x(w){var h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};switch(s=h.duration||1e3,n=h.offset||0,O=h.callback,a=h.easing||Zr,i=h.a11y||!1,r=d(),typeof w>"u"?"undefined":bt(w)){case"number":t=void 0,i=!1,o=r+w;break;case"object":t=w,o=S(t);break;case"string":t=document.querySelector(w),o=S(t);break}switch(l=o-r+n,bt(h.duration)){case"number":s=h.duration;break;case"function":s=h.duration(l);break}window.requestAnimationFrame(b)}return x},tn=en();function rn(e,t){for(;e.length<t;)e="0"+e;return e}function Y(e,t){var r,o,n;if(t.length===0)return e;for(r=0,n=t.length;r<n;r++)o=t.charCodeAt(r),e=(e<<5)-e+o,e|=0;return e<0?e*-2:e}function nn(e,t,r){return Object.keys(t).sort().reduce(o,e);function o(n,a){return Rt(n,t[a],a,r)}}function Rt(e,t,r,o){var n=Y(Y(Y(e,r),on(t)),typeof t);if(t===null)return Y(n,"null");if(t===void 0)return Y(n,"undefined");if(typeof t=="object"||typeof t=="function"){if(o.indexOf(t)!==-1)return Y(n,"[Circular]"+r);o.push(t);var a=nn(n,t,o);if(!("valueOf"in t)||typeof t.valueOf!="function")return a;try{return Y(a,String(t.valueOf()))}catch(i){return Y(a,"[valueOf exception]"+(i.stack||i.message))}}return Y(n,t.toString())}function on(e){return Object.prototype.toString.call(e)}function an(e){return rn(Rt(0,e,"",[]).toString(16),8)}var sn=an,Ge=yt({name:"v-step",props:{step:{type:Object},previousStep:{type:Function},nextStep:{type:Function},stop:{type:Function},skip:{type:Function,default:function(){this.stop()}},finish:{type:Function,default:function(){this.stop()}},isFirst:{type:Boolean},isLast:{type:Boolean},labels:{type:Object},enabledButtons:{type:Object},highlight:{type:Boolean},mask:{type:Boolean},maskPadding:{type:Number},stopOnFail:{type:Boolean},debug:{type:Boolean},index:{type:Number},length:{type:Number,default:0},hideCloseBtn:{type:Boolean}},setup(e,{emit:t}){const r=me(sn(e.step.target)),o=me(document.querySelector(e.step.target)),n=me(null);let a=null,i=null,l=0,s=null;const u=U(()=>({...lt,highlight:e.highlight,mask:e.mask,maskPadding:e.maskPadding,hideCloseBtn:e.hideCloseBtn,enabledButtons:Object.assign({},e.enabledButtons),...e.step.params})),p=U(()=>!e.step.target),y=v=>{const C=window.innerHeight,B=window.innerWidth,{top:T,left:A,bottom:E,right:$}=v.getBoundingClientRect();return T>=0&&A>=0&&E<=C&&$<=B},O=()=>{if(u.value.enableScrolling)if(e.step.duration||e.step.offset){const v={duration:e.step.duration||1e3,offset:e.step.offset||0,callback:void 0,a11y:!1};tn(o.value,v)}else y(o.value)||o.value.scrollIntoView({behavior:"smooth",block:"center",duration:1e3})},d=()=>(e.debug&&console.log(`[Vue Tour] Highlight is ${u.value.highlight?"enabled":"disabled"} for .v-step[id="${r.value}"]`),u.value.highlight),S=()=>{if(d()){document.body.classList.add(q.classes.active);const v=window.getComputedStyle(o.value).getPropertyValue("transition");v!=="all 0s ease 0s"&&(o.value.style.transition=`${v}, ${q.transition}`),o.value.classList.add(q.classes.targetHighlighted),o.value.style.position||o.value.classList.add(q.classes.targetRelative)}else document.body.classList.remove(q.classes.active)},b=()=>{if(d()){const v=o.value,C=v.style.transition;v.classList.remove(q.classes.targetHighlighted),v.classList.remove(q.classes.targetRelative),C.includes(q.transition)&&setTimeout(()=>{v.style.transition=C.replace(`, ${q.transition}`,"")},0)}},m=v=>u.value.enabledButtons.hasOwnProperty(v)?u.value.enabledButtons[v]:!0,x=()=>{n.value&&(clearTimeout(n.value),n.value=null);const v=document.getElementById("v-tour-mask");v&&document.body.removeChild(v),document.body.style.overflow=""},w=()=>{if(x(),!u.value.mask)return;document.body.style.overflow="hidden";const{top:v,left:C,bottom:B,right:T}=o.value.getBoundingClientRect(),A=document.createElement("div");A.id="v-tour-mask";const E=document.createElement("div");E.style.position="fixed",E.style.top="0",E.style.left=`${C-u.value.maskPadding}px`,E.style.width=`${T-C+u.value.maskPadding*2}px`,E.style.height=`${v-u.value.maskPadding}px`,E.style.backgroundColor="rgba(0, 0, 0, 0.5)",E.style.zIndex="9999";const $=document.createElement("div");$.style.position="fixed",$.style.top="0",$.style.left="0",$.style.width=`${C-u.value.maskPadding}px`,$.style.height="100%",$.style.backgroundColor="rgba(0, 0, 0, 0.5)",$.style.zIndex="9999";const L=document.createElement("div");L.style.position="fixed",L.style.top="0",L.style.left=`${T+u.value.maskPadding}px`,L.style.right="0",L.style.height="100%",L.style.backgroundColor="rgba(0, 0, 0, 0.5)",L.style.zIndex="9999";const P=document.createElement("div");P.style.position="fixed",P.style.top=`${B+u.value.maskPadding}px`,P.style.left=`${C-u.value.maskPadding}px`,P.style.width=`${T-C+u.value.maskPadding*2}px`,P.style.bottom="0",P.style.backgroundColor="rgba(0, 0, 0, 0.5)",P.style.zIndex="9999",A.appendChild(E),A.appendChild($),A.appendChild(L),A.appendChild(P),document.body.appendChild(A)},h=()=>{n.value=setTimeout(()=>{w(),s&&s.update()},u.value.delay||0)},c=()=>{e.debug&&console.error("[Vue Tour] The target element "+e.step.target+' of .v-step[id="'+r.value+'"] does not exist!'),t("targetNotFound",e.step),e.stopOnFail&&stop()},g=()=>{i&&(clearInterval(i),i=null)},f=()=>{u.value.mask?h():s&&s.update()},k=()=>{e.debug&&console.log("[Vue Tour] The target element "+e.step.target+' of .v-step[id="'+r.value+'"] is:',o.value);const v=document.getElementById("v-step-"+r.value);p.value?document.body.appendChild(v):o.value?(O(),S(),s=Jr(o.value,v,{...lt,...e.step.popover}),h()):c()};return wt(()=>{i=setInterval(()=>{o.value=document.querySelector(e.step.target),l+=1,(o.value||l>100)&&(g(),k(),o.value&&(window.addEventListener("resize",h),window.addEventListener("scroll",h),u.value.scrollContainer&&document.querySelector(u.value.scrollContainer).addEventListener("scroll",h),a=new MutationObserver(v=>{if(v.type==="attributes"&&v.attributeName==="style"){const C=v.oldValue,B=o.value.getAttribute("style");["width","height","position","top","right","bottom","left"].some(E=>{const $=new RegExp(`${E}:\\s*[^;]+;`,"i"),L=C.match($),P=B.match($);return(L||P)&&(L==null?void 0:L[0])!==(P==null?void 0:P[0])})&&f()}}),a.observe(o.value,{attributes:!0,attributeFilter:["style"],childList:!0,subtree:!0,characterData:!1})))},200)}),kt(()=>{b(),x(),o.value&&(window.removeEventListener("resize",h),window.removeEventListener("scroll",h),u.value.scrollContainer&&document.querySelector(u.value.scrollContainer).removeEventListener("scroll",h),a&&a.disconnect())}),{hash:r,isSticky:p,isButtonEnabled:m}}});const ln=["id"],un=["innerHTML"],pn={class:"v-step__content"},cn=["innerHTML"],fn={key:0,class:"v-step_status"},dn={class:"v-step__buttons"},vn=re("div",{class:"v-step__arrow","data-popper-arrow":""},null,-1);function mn(e,t,r,o,n,a){return R(),_("div",{id:"v-step-"+e.hash,class:Be([{"v-step--sticky":e.isSticky},"v-step"])},[re("div",{class:Be(["v-step-container",{"has-close-btn":!e.hideCloseBtn&&!(e.step.params&&e.step.params.hideCloseBtn),"has-title":e.step.title}])},[!e.hideCloseBtn&&!(e.step.params&&e.step.params.hideCloseBtn)?(R(),_("i",{key:0,class:"v-step__close",onClick:t[0]||(t[0]=Pe((...i)=>e.skip&&e.skip(...i),["prevent"]))})):j("v-if",!0),ae(e.$slots,"icon"),re("div",null,[ae(e.$slots,"header",{},()=>[e.step.title?(R(),_("div",{key:0,class:"v-step__header",innerHTML:e.step.title},null,8,un)):j("v-if",!0)]),ae(e.$slots,"content",{},()=>[re("div",pn,[e.step.content?(R(),_("div",{key:0,innerHTML:e.step.content},null,8,cn)):j("v-if",!0)])])])],2),re("div",{class:Be(["v-step_footer",{status:e.length>0}])},[e.length>0?(R(),_("div",fn,[(R(!0),_(Ot,null,xt(e.length,i=>(R(),_("i",{key:i,class:Be({"is-active":i===e.index+1})},null,2))),128))])):j("v-if",!0),ae(e.$slots,"actions",{},()=>[re("div",dn,[!e.isFirst&&e.isButtonEnabled("buttonPrevious")?(R(),_("button",{key:0,class:"v-step__button v-step__button-normal",onClick:t[1]||(t[1]=Pe((...i)=>e.previousStep&&e.previousStep(...i),["prevent"]))},se(e.labels.buttonPrevious),1)):j("v-if",!0),!e.isLast&&e.isButtonEnabled("buttonNext")?(R(),_("button",{key:1,class:"v-step__button v-step__button-primary",onClick:t[2]||(t[2]=Pe((...i)=>e.nextStep&&e.nextStep(...i),["prevent"]))},se(e.labels.buttonNext),1)):j("v-if",!0),e.isLast&&e.isButtonEnabled("buttonStop")?(R(),_("button",{key:2,class:"v-step__button v-step__button-primary",onClick:t[3]||(t[3]=Pe((...i)=>e.finish&&e.finish(...i),["prevent"]))},se(e.labels.buttonStop),1)):j("v-if",!0)])])],2),vn],10,ln)}Ge.render=mn;Ge.__file="src/lib/VStep.vue";function hn(e,t){t===void 0&&(t={});var r=t.insertAt;if(!(typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",r==="top"&&o.firstChild?o.insertBefore(n,o.firstChild):o.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}var gn=`body.v-tour--active {\r
  pointer-events: none;\r
}\r
\r
.v-tour {\r
  pointer-events: auto;\r
  height: 0;\r
  position: absolute;\r
  top: -1000px;\r
}\r
\r
.v-tour__target--highlighted {\r
  box-shadow: 0 0 0 4px rgba(0,0,0,.4);\r
  pointer-events: auto;\r
  z-index: 9999;\r
}\r
\r
.v-tour__target--relative {\r
  position: relative;\r
}\r
\r
.v-step {\r
  position: relative;\r
  background: #fff;\r
  color: #505968;\r
  min-width: 320px;\r
  box-sizing: border-box;\r
  border-radius: 6px;\r
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.06);\r
  padding: 16px;\r
  z-index: 10000;\r
  font-size: 14px;\r
}\r
\r
.v-step--sticky {\r
    position: fixed;\r
    top: 50%;\r
    left: 50%;\r
    transform: translate(-50%, -50%);\r
  }\r
\r
.v-step--sticky .v-step__arrow {\r
      display: none;\r
    }\r
\r
.v-step__arrow,\r
.v-step__arrow::before {\r
  position: absolute;\r
  width: 10px;\r
  height: 10px;\r
  background: inherit;\r
}\r
\r
.v-step__arrow {\r
  visibility: hidden;\r
}\r
\r
.v-step__arrow::before {\r
  visibility: visible;\r
  content: '';\r
  transform: rotate(45deg);\r
  margin-left: -5px;\r
}\r
\r
.v-step[data-popper-placement^="top"] > .v-step__arrow {\r
  bottom: -5px;\r
}\r
\r
.v-step[data-popper-placement^="bottom"] > .v-step__arrow {\r
  top: -5px;\r
}\r
\r
.v-step[data-popper-placement^="right"] > .v-step__arrow {\r
  left: 0px;\r
}\r
\r
.v-step[data-popper-placement^="left"] > .v-step__arrow {\r
  right: -10px;\r
}\r
\r
.v-step-container {\r
  display: flex;\r
  position: relative;\r
  min-height: 24px;\r
}\r
\r
.v-step-container.has-close-btn {\r
    padding-right: 16px;\r
  }\r
\r
.v-step-container>div:last-child {\r
    flex-grow: 1;\r
  }\r
\r
.v-step__close {\r
  position: absolute;\r
  top: 0;\r
  right: 0;\r
  display: inline-block;\r
  width: 12px;\r
  height: 12px;\r
  overflow: hidden;\r
  cursor: pointer;\r
  margin: 8px 2px;\r
}\r
\r
.v-step__close:hover::before,\r
.v-step__close:hover::after {\r
  background: #1e2128;\r
}\r
\r
.v-step__close::before,\r
.v-step__close::after {\r
  content: "";\r
  position: absolute;\r
  height: 2px;\r
  width: 100%;\r
  top: 50%;\r
  left: 0;\r
  margin-top: -1px;\r
  background: #505968;\r
}\r
\r
.v-step__close::before {\r
  -webkit-transform: rotate(45deg);\r
  -moz-transform: rotate(45deg);\r
  -ms-transform: rotate(45deg);\r
  -o-transform: rotate(45deg);\r
  transform: rotate(45deg);\r
}\r
\r
.v-step__close::after {\r
  -webkit-transform: rotate(-45deg);\r
  -moz-transform: rotate(-45deg);\r
  -ms-transform: rotate(-45deg);\r
  -o-transform: rotate(-45deg);\r
  transform: rotate(-45deg);\r
}\r
\r
.v-step__header {\r
  line-height: 28px;\r
  font-size: 16px;\r
  color: #1E2128;\r
  font-weight: 500;\r
}\r
\r
.v-step__content {\r
  line-height: 24px;\r
  margin-top: 4px;\r
}\r
\r
.v-step_footer {\r
  margin-top: 16px;\r
  display: flex;\r
  align-items: center;\r
  justify-content: flex-end;\r
}\r
\r
.v-step_footer.status {\r
    justify-content: space-between;\r
  }\r
\r
.v-step__button {\r
  line-height: 28px;\r
  border-radius: 3px;\r
  background-color: #F2F3F5;\r
  border: none;\r
  text-align: center;\r
  color: #505968;\r
  padding: 0 12px;\r
  margin-left: 12px;\r
  cursor: pointer;\r
}\r
\r
.v-step__button:hover {\r
    background-color: #e4e5eb;\r
    color: #1e2128;\r
  }\r
\r
.v-step__button:active {\r
    background-color: #d1d5de;\r
    color: #1e2128;\r
  }\r
\r
.v-step__button.v-step__button-primary {\r
    background-color: #134BEA;\r
    color: #fff;\r
  }\r
\r
.v-step__button.v-step__button-primary:hover {\r
      background-color: #3b71ee;\r
      color: #fff;\r
    }\r
\r
.v-step__button.v-step__button-primary:active {\r
      background-color: #0639c3;\r
      color: #fff;\r
    }\r
\r
.v-step_status i {\r
    display: inline-block;\r
    width: 6px;\r
    height: 6px;\r
    border-radius: 50%;\r
    margin-right: 6px;\r
    background-color: #E4E5EB;\r
  }\r
\r
.v-step_status i.is-active {\r
      background-color: #134BEA;\r
    }`;hn(gn);const bn={class:"buttons"},yn={__name:"index",props:{name:{required:!0,type:String},steps:{type:Array,default:()=>[]},callbacks:{type:Object,default:()=>{}},options:{type:Object,default:()=>({mask:!0,maskPadding:0,hideCloseBtn:!1})}},setup(e){return(t,r)=>{const o=zt;return R(),ee(at(Ie),{name:e.name,steps:e.steps,callbacks:e.callbacks,options:e.options},{default:te(n=>[(R(!0),_(Ot,null,xt(n.steps,(a,i)=>(R(),ee(It,{key:i,name:"fade"},{default:te(()=>[n.currentStep===i?(R(),ee(at(Ge),{key:i,step:a,"previous-step":n.previousStep,"next-step":n.nextStep,stop:n.stop,skip:n.skip,finish:n.finish,"is-first":n.isFirst,"is-last":n.isLast,labels:a.labels||n.labels,highlight:n.highlight,"enabled-buttons":n.enabledButtons,mask:n.mask,"mask-padding":n.maskPadding,"hide-close-btn":n.hideCloseBtn,index:i,length:n.steps.length},{actions:te(()=>[re("div",bn,[ae(t.$slots,"actions",{},()=>[!n.isFirst&&n.enabledButtons.buttonPrevious?(R(),ee(o,{key:0,onClick:n.previousStep},{default:te(()=>[_e(se(n.steps[i].labels?n.steps[i].labels.buttonPrevious:n.labels.buttonPrevious),1)]),_:2},1032,["onClick"])):j("",!0),!n.isLast&&n.enabledButtons.buttonNext?(R(),ee(o,{key:1,type:"primary",onClick:n.nextStep},{default:te(()=>[_e(se(n.steps[i].labels?n.steps[i].labels.buttonNext:n.labels.buttonNext),1)]),_:2},1032,["onClick"])):j("",!0),n.isLast&&n.enabledButtons.buttonStop?(R(),ee(o,{key:2,type:"primary",onClick:n.finish},{default:te(()=>[_e(se(n.steps[i].labels?n.steps[i].labels.buttonStop:n.labels.buttonStop),1)]),_:2},1032,["onClick"])):j("",!0)],!0)])]),_:2},1032,["step","previous-step","next-step","stop","skip","finish","is-first","is-last","labels","highlight","enabled-buttons","mask","mask-padding","hide-close-btn","index","length"])):j("",!0)]),_:2},1024))),128))]),_:3},8,["name","steps","callbacks","options"])}}},xn=Wt(yn,[["__scopeId","data-v-3cb3ad36"]]);export{xn as V};
