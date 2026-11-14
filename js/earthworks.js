/* ===== الكميات: شبكة مربعات + مقاطع عرضية ===== */
const grid=t=>t.trim().split(/\r?\n/).filter(l=>l.trim()).map(l=>l.trim().split(/[\s,;]+/).map(Number));
const sta=s=>{s=String(s).trim();if(s.includes('+')){const[k,m]=s.split('+');return +k*1000+ +m}return +s};
const fSta=m=>Math.floor(m/1000)+'+'+(m%1000).toFixed(3).padStart(7,'0');
function gv(){try{const a=+vv.a;if(!(a>0))throw'أدخل طول ضلع المربع';const G=grid(vv.g),w=G[0]?.length;
if(G.length<2||w<2||G.some(r=>r.length!==w||r.some(isNaN)))throw'شبكة الأرض غير صالحة (صفان وعمودان على الأقل وبنفس العدد)';
const DG=grid(vv.d);if(!DG.length)throw'أدخل منسوب التصميم';let D;
if(DG.length==1&&DG[0].length==1&&!isNaN(DG[0][0]))D=G.map(r=>r.map(()=>DG[0][0]));else{if(DG.length!==G.length||DG.some(r=>r.length!==w||r.some(isNaN)))throw'شبكة التصميم لا تطابق أبعاد شبكة الأرض';D=DG}
let cut=0,fill=0;const A=a*a;for(let i=0;i<G.length-1;i++)for(let j=0;j<w-1;j++){const h=[G[i][j]-D[i][j],G[i][j+1]-D[i][j+1],G[i+1][j]-D[i+1][j],G[i+1][j+1]-D[i+1][j+1]];
const S=h.reduce((s,x)=>s+Math.abs(x),0);if(!S)continue;const P=h.filter(x=>x>0).reduce((s,x)=>s+x,0),N=S-P;cut+=A*P*P/(4*S);fill+=A*N*N/(4*S)}
const cells=(G.length-1)*(w-1);res={rep:1,t:['طريقة: شبكة مربعات (ضلع '+a+' م)','عدد المربعات = '+cells,'المساحة = '+f3(cells*A)+' م²','حفر = '+f3(cut)+' م³','ردم = '+f3(fill)+' م³','الصافي (حفر − ردم) = '+f3(cut-fill)+' م³']}}catch(e){res={e:1,t:[String(e)]}}draw()}
function sv2(){try{const R=vv.s.trim().split(/\r?\n/).filter(l=>l.trim()).map(l=>l.trim().split(/[,;\s]+/)).map(x=>[sta(x[0]),+x[1],+(x[2]||0)]);
if(R.length<2||R.some(r=>r.some(isNaN)))throw'أدخل مقطعين على الأقل بصيغة: محطة، مساحة حفر، مساحة ردم';
let cut=0,fill=0;const t=['طريقة: المتوسط للمقاطع (Average End Area)'];
for(let i=0;i<R.length-1;i++){const L=R[i+1][0]-R[i][0];if(L<=0)throw'المحطات لازم تكون تصاعدية';const c=(R[i][1]+R[i+1][1])/2*L,f=(R[i][2]+R[i+1][2])/2*L;cut+=c;fill+=f;t.push(fSta(R[i][0])+' → '+fSta(R[i+1][0])+'  حفر '+c.toFixed(2)+'  ردم '+f.toFixed(2))}
t.push('إجمالي الحفر = '+f3(cut)+' م³','إجمالي الردم = '+f3(fill)+' م³','الصافي = '+f3(cut-fill)+' م³');res={rep:1,t}}catch(e){res={e:1,t:[String(e)]}}draw()}
const rtxt=()=>['تقرير كميات الحفر والردم','المشروع: '+proj,'المهندس: '+(ls('eng')||'—'),'التاريخ: '+new Date().toLocaleDateString('ar-EG'),'',...res.t].join('\n');
function volH(){const ta=(k,ph,st)=>`<textarea oninput="vv.${k}=this.value" placeholder="${ph}" style="${st||''}">${esc(vv[k])}</textarea>`;
let h=`<select onchange="vm=+this.value;res=null;draw()"><option value="0"${vm?'':' selected'}>شبكة مربعات (Grid)</option><option value="1"${vm?' selected':''}>مقاطع عرضية (Average End Area)</option></select>`;
h+=vm?`<div class="card np"><label>كل سطر: المحطة، مساحة الحفر م²، مساحة الردم م² (مثال 0+020)</label>${ta('s','0+000, 12.5, 0\n0+020, 8, 3.2')}<div style="height:10px"></div><button onclick="sv2()">احسب الكميات</button></div>`:
`<div class="card np"><label>طول ضلع المربع (م)</label><input value="${esc(vv.a)}" oninput="vv.a=this.value" inputmode="decimal"><label>مناسيب الأرض: كل سطر صف، القيم بمسافات</label>${ta('g','10.2 10.4 10.1\n10.5 10.3 10.0')}<label>منسوب التصميم: رقم واحد أو شبكة بنفس الأبعاد</label>${ta('d','10.0','min-height:70px')}<div style="height:10px"></div><button onclick="gv()">احسب الكميات</button></div>`;
if(!res)return h;if(res.e)return h+resH();
return h+`<div class="card"><div class="res" id="rp">${esc(rtxt())}</div></div><div class="card np"><label>اسم المهندس (يظهر في التقرير)</label><input value="${esc(ls('eng')||'')}" oninput="ls('eng',this.value);$('#rp').textContent=rtxt()"><div style="height:10px"></div><button onclick="window.print()">طباعة / حفظ PDF</button></div>`}
