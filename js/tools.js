/* أدوات متقدمة: تقسيم الأراضي، مساحة المقطع، تصحيح الميزانية، CSF، جدول التوقيع */
let am=0,adCsv='',ad={sp:'',sd:'',sn:'3',xg:'',xd:'',sta:'0+000',E:'',E0:'500000',k0:'0.9996',h:'0',dist:'',ss:'',sb:'',spt:'all'};
const ADN=['تقسيم أرض بخطوط موازية','مساحة مقطع عرضي من نقاطه','تصحيح الخطأ الإغلاقي للميزانية','معامل المقياس المركب (CSF)','جدول نقاط التوقيع'];
const clip=(P,t)=>{const o=[];P.forEach((a,i)=>{const b=P[(i+1)%P.length],ia=a.v<=t,ib=b.v<=t;if(ia)o.push(a);if(ia!==ib){const k=(t-a.v)/(b.v-a.v);o.push({u:a.u+k*(b.u-a.u),v:t})}});return o};
const parea=P=>{let s=0;P.forEach((a,i)=>{const b=P[(i+1)%P.length];s+=a.u*b.v-b.u*a.v});return Math.abs(s)/2};
const lerp=(P,x)=>{for(let i=0;i<P.length-1;i++)if(x>=P[i][0]&&x<=P[i+1][0]){const d=P[i+1][0]-P[i][0],k=d?(x-P[i][0])/d:0;return P[i][1]+k*(P[i+1][1]-P[i][1])}return null};
function adRun(){try{const t=[];adCsv='';
if(am===0){const L=ad.sp.split(/[,\s]+/).filter(Boolean).map(gp);if(L.length<3)throw'أدخل 3 نقاط على الأقل';const az=parseAng(ad.sd),s=Math.sin(az),c=Math.cos(az);
const P=L.map(p=>({u:p.e*s+p.n*c,v:p.e*c-p.n*s})),w=/[,\s]/.test(ad.sn.trim())?ad.sn.trim().split(/[,\s]+/).map(Number):Array(Math.round(+ad.sn)).fill(1);
if(w.length<2||w.some(x=>!(x>0)))throw'أدخل عدد الأجزاء (2 أو أكثر) أو نسباً مثل 1,2,1';
const tot=parea(P),sw=w.reduce((a,b)=>a+b,0),vs=P.map(p=>p.v),v0=Math.min(...vs),v1=Math.max(...vs);t.push('المساحة الكلية = '+f3(tot)+' م²','عدد الأجزاء = '+w.length,'(نهايات الخطوط دقيقة للأراضي المحدبة)','');let cum=0,prev=0;
w.slice(0,-1).forEach((x,i)=>{cum+=x;const tg=tot*cum/sw;let lo=v0,hi=v1;for(let k=0;k<80;k++){const m=(lo+hi)/2;parea(clip(P,m))<tg?lo=m:hi=m}const q=(lo+hi)/2,us=[];
P.forEach((a,j)=>{const b=P[(j+1)%P.length];if((a.v-q)*(b.v-q)<0)us.push(a.u+(q-a.v)/(b.v-a.v)*(b.u-a.u))});
const pt=u=>'N='+f3(u*c-q*s)+' E='+f3(u*s+q*c);const a1=parea(clip(P,q));
t.push('الجزء '+(i+1)+' = '+f3(a1-prev)+' م²','  خط '+(i+1)+': '+(us.length>1?pt(Math.min(...us))+'  ←→  '+pt(Math.max(...us)):'—'));prev=a1});t.push('الجزء '+w.length+' = '+f3(tot-prev)+' م²')}
else if(am===1){const G=grid(ad.xg).sort((a,b)=>a[0]-b[0]),D=grid(ad.xd).sort((a,b)=>a[0]-b[0]);if(G.length<2||D.length<2||[...G,...D].some(r=>r.length<2||r.some(isNaN)))throw'أدخل نقطتين على الأقل للأرض وللتصميم (إزاحة، منسوب)';
const lo=Math.max(G[0][0],D[0][0]),hi=Math.min(G[G.length-1][0],D[D.length-1][0]);if(!(hi>lo))throw'نطاق الإزاحات لا يتقاطع';
const X=[...new Set([...G,...D].map(r=>r[0]).filter(x=>x>=lo&&x<=hi))].sort((a,b)=>a-b);let cut=0,fill=0;
for(let i=0;i<X.length-1;i++){const a=X[i],b=X[i+1],w=b-a,d1=lerp(G,a)-lerp(D,a),d2=lerp(G,b)-lerp(D,b);
if(d1*d2>=0){const A=(d1+d2)/2*w;A>0?cut+=A:fill-=A}else{const k=d1/(d1-d2),A1=d1*k*w/2,A2=d2*(1-k)*w/2;if(d1>0){cut+=A1;fill-=A2}else{fill-=A1;cut+=A2}}}
t.push('نطاق الإزاحة: '+f3(lo)+' إلى '+f3(hi),'مساحة الحفر = '+f3(cut)+' م²','مساحة الردم = '+f3(fill)+' م²','','للصق في تبويب الكميات (مقاطع):',ad.sta+', '+cut.toFixed(3)+', '+fill.toFixed(3))}
else if(am===2){if(lv.length<2)throw'أدخل ميزانية في تبويب الميزانية أولاً';if(lvE===''||isNaN(lvE))throw'أدخل منسوب BM النهائي في تبويب الميزانية';
const L=lvCalc().rows;if(L[L.length-1].fs==null)throw'آخر قراءة لازم تكون FS على BM النهائي';const e=L[L.length-1].rl-lvE,nf=L.filter(r=>r.fs!=null).length;
t.push('الخطأ الإغلاقي = '+(e*1000).toFixed(1)+' مم','التصحيح موزع بالتساوي على '+nf+' ميزانية (محطة)','');let k=0;
L.forEach((r,i)=>{if(i&&r.fs!=null)k++;const cr=-e*k/nf;t.push(r.p+'  RL='+f3(r.rl)+'  تصحيح '+(cr*1000).toFixed(1)+' مم → '+f3(r.rl+cr))})}
else if(am===3){const E=+ad.E,E0=+ad.E0,k0=+ad.k0,h=+ad.h;if(ad.E===''||[E,E0,k0,h].some(isNaN))throw'أدخل E و E0 و k0 و h';
const Rm=6371000,k=k0*(1+(E-E0)**2/(2*Rm*Rm*k0*k0)),ef=Rm/(Rm+h),cs=k*ef;t.push('معامل مقياس الشبكة k = '+k.toFixed(7),'معامل الارتفاع = '+ef.toFixed(7),'المعامل المركب CSF = '+cs.toFixed(7));
const d=+ad.dist;if(ad.dist!==''&&!isNaN(d))t.push('أرضية '+f3(d)+' ← شبكة '+f3(d*cs),'شبكة '+f3(d)+' ← أرضية '+f3(d/cs))}
else{const S=gp(ad.ss),B=gp(ad.sb),azb=Math.atan2(B.e-S.e,B.n-S.n),all=ad.spt.trim().toLowerCase()==='all',
names=all?cur().map(p=>p.p).filter(n=>n!==S.p&&n!==B.p):ad.spt.split(/[,\s]+/).filter(Boolean);if(!names.length)throw'لا توجد نقاط للتوقيع';
const out=['P,Angle,Dist,Z'];t.push('الجهاز على '+S.p+' · المرجع '+B.p+' ('+toDMS(azb)+')','','النقطة · الزاوية من المرجع · المسافة');
names.forEach(n=>{const p=gp(n),az=Math.atan2(p.e-S.e,p.n-S.n),d=Math.hypot(p.e-S.e,p.n-S.n),an=toDMS(az-azb);t.push(p.p+'  '+an+'  '+f3(d)+(p.z==null?'':'  Z='+f3(p.z)));out.push([p.p,an,d.toFixed(3),p.z==null?'':p.z.toFixed(3)].join(','))});adCsv=out.join('\n')}
res={t}}catch(e){res={e:1,t:[String(e)]}}draw()}
function adH(){const ta=(k,l)=>`<label>${l}</label><textarea oninput="ad.${k}=this.value">${esc(ad[k])}</textarea>`,
T=[F('ad',ad,'sp','أسماء نقاط حدود الأرض بالترتيب')+F('ad',ad,'sd','اتجاه الخطوط القاطعة د.ددثث')+F('ad',ad,'sn','عدد الأجزاء أو نسب (مثل 1,2,1)'),
ta('xg','نقاط الأرض: إزاحة، منسوب (سطر لكل نقطة، سالب = يسار المحور)')+ta('xd','نقاط التصميم: إزاحة، منسوب')+F('ad',ad,'sta','المحطة'),
'<p style="color:var(--m)">يستخدم بيانات تبويب الميزانية ومنسوب BM النهائي المدخل هناك.</p>',
F('ad',ad,'E','الإحداثي الشرقي E (م)')+F('ad',ad,'E0','E0 للمحور المركزي (UTM: 500000)')+F('ad',ad,'k0','k0 (UTM: 0.9996)')+F('ad',ad,'h','الارتفاع h (م)')+F('ad',ad,'dist','مسافة للتحويل (اختياري)'),
F('ad',ad,'ss','نقطة الجهاز')+F('ad',ad,'sb','نقطة الاتجاه المرجعي')+F('ad',ad,'spt','النقاط (all أو أسماء)')][am];
return `<select onchange="am=+this.value;res=null;adCsv='';draw()">${ADN.map((n,i)=>`<option value="${i}"${i===am?' selected':''}>${n}</option>`).join('')}</select><div class="card np">${T}<div style="height:10px"></div><button onclick="adRun()">احسب</button></div>`+
(res?(res.e?resH():`<div class="card"><div class="res">${esc(res.t.join('\n'))}</div></div>`+(am===4&&adCsv?`<div class="card np"><button onclick="dl('stakeout.csv',adCsv)">تنزيل CSV</button></div>`:'')):'')}
