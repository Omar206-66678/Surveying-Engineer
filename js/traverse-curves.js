/* ===== المرحلة 3: الترافيرس (Bowditch) + المنحنيات ===== */
let tv={m:0,p:'',a:'',t:'',r:'5000',pf:'T',q:''},cm=0,cv={R:'',D:'',pi:'',int:'10',pp:'',az:'',dr:'1',vp:'',ve:'',g1:'',g2:'',L:'',vi:'10'};
const F=(n,o,k,l,ph)=>`<label>${l}</label><input value="${esc(o[k])}" oninput="${n}.${k}=this.value" placeholder="${ph||''}">`;
function tvRun(){try{const P0=gp(tv.p),a1=parseAng(tv.a),cl=!tv.m;
const L=tv.t.trim().split(/\r?\n/).filter(l=>l.trim()).map(l=>l.trim().split(/[,;\s]+/)),n=L.length;
if(n<(cl?3:1))throw'أدخل سطوراً كافية (المغلق 3 على الأقل)';
const th=L.map(x=>parseAng(x[0]||'0')),d=L.map(x=>+x[1]);if(d.some(x=>!(x>0)))throw'كل سطر: زاوية، مسافة';
const t=[];let ang=th;
if(cl){const e=th.reduce((s,x)=>s+x,0)-(n-2)*Math.PI,es=e/R*3600,al=30*Math.sqrt(n);
t.push('الخطأ الزاوي = '+es.toFixed(1)+'″ (المسموح 30″√n = '+al.toFixed(1)+'″) '+(Math.abs(es)<=al?'✔':'✘'));ang=th.map(x=>x-e/n)}
const az=[norm(a1)];for(let i=1;i<n;i++)az.push(norm(az[i-1]+Math.PI-ang[i]));
let dN=az.map((z,i)=>d[i]*Math.cos(z)),dE=az.map((z,i)=>d[i]*Math.sin(z));const D=d.reduce((s,x)=>s+x,0);
if(cl){const sN=dN.reduce((s,x)=>s+x,0),sE=dE.reduce((s,x)=>s+x,0),lin=Math.hypot(sN,sE),r=+tv.r||5000,ok=lin===0||D/lin>=r;
t.push('ΣΔN = '+(sN*1000).toFixed(1)+' مم   ΣΔE = '+(sE*1000).toFixed(1)+' مم','الخطأ الخطي = '+(lin*1000).toFixed(1)+' مم  ·  المحيط = '+f3(D)+' م','الدقة النسبية = 1 : '+(lin?Math.round(D/lin):'∞')+' (المطلوب 1:'+r+') → '+(ok?'صالح ✔':'مرفوض ✘'));
dN=dN.map((x,i)=>x-sN*d[i]/D);dE=dE.map((x,i)=>x-sE*d[i]/D)}
const Q=[[P0.n,P0.e]];dN.forEach((x,i)=>Q.push([Q[i][0]+x,Q[i][1]+dE[i]]));if(cl)Q.pop();
if(!cl&&tv.q.trim()){const K=gp(tv.q),mN=Q[n][0]-K.n,mE=Q[n][1]-K.e,lin=Math.hypot(mN,mE),rq=+tv.r||5000;let cu=0;t.push('الخطأ عند '+K.p+': ΔN='+(mN*1000).toFixed(1)+' مم  ΔE='+(mE*1000).toFixed(1)+' مم','الخطأ الخطي = '+(lin*1000).toFixed(1)+' مم · الدقة 1 : '+(lin?Math.round(D/lin):'∞')+' (المطلوب 1:'+rq+') → '+(lin===0||D/lin>=rq?'صالح ✔':'مرفوض ✘'));for(let i=1;i<=n;i++){cu+=d[i-1];Q[i][0]-=mN*cu/D;Q[i][1]-=mE*cu/D}}
t.push('','الإحداثيات'+(cl||tv.q.trim()?' المصححة (Bowditch)':' (ترافيرس مفتوح بدون تصحيح)'));
Q.forEach((q,i)=>t.push((i?tv.pf+(i+1):tv.p)+(i<n?'  ←'+toDMS(az[i])+'  '+f3(d[i])+' م':'')+'\n   N='+f3(q[0])+'  E='+f3(q[1])));
res={t,Q,tv:1}}catch(e){res={e:1,t:[String(e)]}}draw()}
function tvSave(){res.Q.forEach((q,i)=>{if(i)add(tv.pf+(i+1),q[0],q[1],null,'TRAV')});alert('تم حفظ المحطات كنقاط')}
function tvH(){let h=`<select onchange="tv.m=+this.value;res=null;draw()"><option value="0"${tv.m?'':' selected'}>ترافيرس مغلق (زوايا داخلية مع عقارب الساعة)</option><option value="1"${tv.m?' selected':''}>ترافيرس مفتوح</option></select><div class="card np">`+F('tv',tv,'p','نقطة البداية (من النقاط)')+F('tv',tv,'a','اتجاه الضلع الأول د.ددثث')+`<label>كل سطر: زاوية المحطة (يمين)، المسافة للمحطة التالية${tv.m?' (السطر 1: زاوية 0)':''}</label><textarea oninput="tv.t=this.value" placeholder="90.0000, 100&#10;90.0000, 100&#10;90.0000, 100&#10;90.0000, 100">${esc(tv.t)}</textarea>`+F('tv',tv,'pf','بادئة أسماء المحطات')+(tv.m?F('tv',tv,'q','نقطة النهاية المعلومة (اختياري)'):'')+F('tv',tv,'r','الدقة المطلوبة 1 :')+`<div style="height:10px"></div><button onclick="tvRun()">احسب</button></div>`;
if(!res)return h;if(res.e)return h+resH();return h+`<div class="card"><div class="res">${esc(res.t.join('\n'))}</div></div><div class="card np"><button onclick="tvSave()">حفظ المحطات كنقاط</button></div>`}
function crRun(){try{const t=[];
if(!cm){const Rr=+cv.R,De=parseAng(cv.D||'x'),pi=sta(cv.pi),iv=+cv.int;if(!(Rr>0)||!(De>0)||isNaN(pi)||!(iv>0))throw'أدخل R و Δ ومحطة PI والفاصل';
const T=Rr*Math.tan(De/2),Lc=Rr*De,pc=pi-T;t.push('Δ = '+toDMS(De),'T = '+f3(T),'L = '+f3(Lc),'LC = '+f3(2*Rr*Math.sin(De/2)),'E = '+f3(Rr*(1/Math.cos(De/2)-1)),'M = '+f3(Rr*(1-Math.cos(De/2))),'PC = '+fSta(pc),'PT = '+fSta(pc+Lc));
let c0=null,az=0;const sg=cv.dr==='-1'?-1:1;if(cv.pp.trim()){const P=gp(cv.pp);az=parseAng(cv.az);c0=[P.n-T*Math.cos(az),P.e-T*Math.sin(az)]}
const S=[0];for(let s=Math.ceil((pc+1e-9)/iv)*iv-pc;s<Lc-1e-6;s+=iv)S.push(s);S.push(Lc);t.push('','المحطة · القوس · الانحراف من PC · الوتر'+(c0?' · N · E':''));
S.forEach(s=>{const th=s/Rr,c=2*Rr*Math.sin(th/2);let l=fSta(pc+s)+'  '+s.toFixed(3)+'  '+toDMS(th/2)+'  '+f3(c);if(c0){const z=az+sg*th/2;l+='\n   N='+f3(c0[0]+c*Math.cos(z))+'  E='+f3(c0[1]+c*Math.sin(z))}t.push(l)})}
else{const pv=sta(cv.vp),ze=+cv.ve,g1=+cv.g1,g2=+cv.g2,L=+cv.L,iv=+cv.vi;if([pv,ze,g1,g2,L,iv].some(isNaN)||!(L>0)||!(iv>0)||cv.ve===''||cv.g1===''||cv.g2==='')throw'أكمل كل مدخلات المنحنى الرأسي';
const A=g2-g1,b=pv-L/2,y0=ze-g1/100*L/2,y=x=>y0+g1/100*x+A/(200*L)*x*x;
t.push('A = '+A.toFixed(3)+'%','K = '+(A?(L/Math.abs(A)).toFixed(2):'∞'),'BVC = '+fSta(b)+'  منسوب '+f3(y0),'EVC = '+fSta(b+L)+'  منسوب '+f3(y(L)));
const xt=A?-g1*L/A:-1;if(xt>0&&xt<L)t.push((A>0?'أدنى':'أعلى')+' نقطة: '+fSta(b+xt)+'  منسوب '+f3(y(xt)));
t.push('','المحطة · منسوب المنحنى');const X=[];for(let x=0;x<L-1e-6;x+=iv)X.push(x);X.push(L);X.forEach(x=>t.push(fSta(b+x)+'   '+f3(y(x))))}
res={t}}catch(e){res={e:1,t:[String(e)]}}draw()}
function crH(){let h=`<select onchange="cm=+this.value;res=null;draw()"><option value="0"${cm?'':' selected'}>منحنى أفقي دائري</option><option value="1"${cm?' selected':''}>منحنى رأسي (قطع مكافئ)</option></select><div class="card np">`;
h+=cm?F('cv',cv,'vp','محطة PVI','1+200')+F('cv',cv,'ve','منسوب PVI (م)')+F('cv',cv,'g1','الميل الداخل g1 (%)')+F('cv',cv,'g2','الميل الخارج g2 (%)')+F('cv',cv,'L','طول المنحنى L (م)')+F('cv',cv,'vi','الفاصل (م)'):
F('cv',cv,'R','نصف القطر R (م)')+F('cv',cv,'D','زاوية الانحراف Δ د.ددثث')+F('cv',cv,'pi','محطة PI','0+250')+F('cv',cv,'int','فاصل التوقيع (م)')+`<label>اتجاه الانحناء</label><select onchange="cv.dr=this.value"><option value="1"${cv.dr==='1'?' selected':''}>يمين</option><option value="-1"${cv.dr==='-1'?' selected':''}>يسار</option></select>`+F('cv',cv,'pp','(اختياري) نقطة PI لحساب الإحداثيات')+F('cv',cv,'az','اتجاه المماس الداخل د.ددثث');
h+=`<div style="height:10px"></div><button onclick="crRun()">احسب</button></div>`;return h+(res?(res.e?resH():`<div class="card"><div class="res">${esc(res.t.join('\n'))}</div></div>`):'')}
