/* محرك السطح TIN (Delaunay بطريقة Bowyer-Watson مع مسح بالإحداثي x) + الكونتور + الحجوم */
function tnCC(A,B,C){const ax=A.x,ay=A.y,bx=B.x,by=B.y,cx=C.x,cy=C.y,d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));if(Math.abs(d)<1e-12)return null;
const a=ax*ax+ay*ay,b=bx*bx+by*by,c=cx*cx+cy*cy,ux=(a*(by-cy)+b*(cy-ay)+c*(ay-by))/d,uy=(a*(cx-bx)+b*(ax-cx)+c*(bx-ax))/d,r2=(ax-ux)**2+(ay-uy)**2;return{cx:ux,cy:uy,r2,r:Math.sqrt(r2)}}
function tnTin(P){const n=P.length;if(n<3)return{pts:P,tris:[]};let mx=0,my=0;P.forEach(p=>{mx+=p.e;my+=p.n});mx/=n;my/=n;
const pts=P.map(p=>({...p,x:p.e-mx,y:p.n-my})).sort((a,b)=>a.x-b.x||a.y-b.y);let m=0;pts.forEach(p=>{m=Math.max(m,Math.abs(p.x),Math.abs(p.y))});m=m||1;
const V=pts.concat([{x:-20*m,y:-m},{x:0,y:20*m},{x:20*m,y:-m}]),mk=(a,b,c)=>{const q=tnCC(V[a],V[b],V[c]);return q?{a,b,c,...q}:null};
let open=[mk(n,n+1,n+2)],done=[];const key=(a,b)=>a<b?a*1e7+b:b*1e7+a;
for(let i=0;i<n;i++){const p=V[i],E=[],keep=[];
for(const t of open){const dx=p.x-t.cx,dy=p.y-t.cy;if(dx*dx+dy*dy<t.r2)E.push([t.a,t.b],[t.b,t.c],[t.c,t.a]);else if(t.cx+t.r<p.x)done.push(t);else keep.push(t)}
const cnt=new Map();E.forEach(([a,b])=>cnt.set(key(a,b),(cnt.get(key(a,b))||0)+1));
E.forEach(([a,b])=>{if(cnt.get(key(a,b))===1){const t=mk(a,b,i);if(t)keep.push(t)}});open=keep}
return{pts,tris:done.concat(open).filter(t=>t.a<n&&t.b<n&&t.c<n).map(t=>[t.a,t.b,t.c])}}
function tnVol(A,h){const p=h.filter(x=>x>0).length,s=(h[0]+h[1]+h[2])*A/3;if(p===3)return[s,0];if(p===0)return[0,-s];
const cap=g=>{const a=g.find(x=>x>0),o=g.filter(x=>x<=0);return A*a**3/(3*(a-o[0])*(a-o[1]))};
if(p===1){const vp=cap(h);return[vp,vp-s]}if(!h.some(x=>x<0))return[s,0];const vn=cap(h.map(x=>-x));return[s+vn,vn]}
function tnSolve(o){const seen=new Set(),P=[];o.pts.forEach(p=>{const k=p.e.toFixed(3)+'|'+p.n.toFixed(3);if(!seen.has(k)){seen.add(k);P.push(p)}});
const T=tnTin(P),pts=T.pts,mE=o.maxE>0?o.maxE*o.maxE:Infinity,d2=(i,j)=>(pts[i].e-pts[j].e)**2+(pts[i].n-pts[j].n)**2;
const tris=T.tris.filter(([a,b,c])=>d2(a,b)<=mE&&d2(b,c)<=mE&&d2(c,a)<=mE),zs=pts.map(p=>p.z),iv=o.iv>0?o.iv:1,segs=[];
tris.forEach(([a,b,c])=>{const t=[pts[a],pts[b],pts[c]],lo=Math.min(t[0].z,t[1].z,t[2].z),hi=Math.max(t[0].z,t[1].z,t[2].z);
for(let k=Math.ceil(lo/iv-1e-9);k*iv<=hi+1e-9;k++){const L=k*iv,q=[];for(let i=0;i<3;i++){const A=t[i],B=t[(i+1)%3];if((A.z>=L)!==(B.z>=L)){const f=(L-A.z)/(B.z-A.z);q.push(A.e+f*(B.e-A.e),A.n+f*(B.n-A.n))}}if(q.length===4)segs.push([k,...q])}});
const hasRef=o.ref!=null&&!isNaN(o.ref);let cut=0,fill=0,area=0;
tris.forEach(([a,b,c])=>{const A=Math.abs((pts[b].e-pts[a].e)*(pts[c].n-pts[a].n)-(pts[c].e-pts[a].e)*(pts[b].n-pts[a].n))/2;area+=A;
if(hasRef){const[u,v]=tnVol(A,[a,b,c].map(i=>pts[i].z-o.ref));cut+=u;fill+=v}});
return{pts:pts.map(p=>({e:p.e,n:p.n,z:p.z,p:p.p})),tris,segs,iv,zmin:Math.min(...zs),zmax:Math.max(...zs),cut,fill,area,hasRef}}
