/* التقرير الموحد: تجميع نتائج أي تبويب ثم الطباعة / حفظ PDF من المتصفح (يدعم العربية بالكامل) */
let lvTxt='';
const RK=()=>'rep_'+proj,rload=()=>{try{const o=JSON.parse(ls(RK())||'null');return o&&o.i?o:{m:{},i:[]}}catch(e){return{m:{},i:[]}}},rsave=o=>ls(RK(),JSON.stringify(o));
function repText(){if(tab==='tin')return TN&&TN.txt||'';if(tab==='lev')return lv.length>1?lvTxt:'';return res&&!res.e&&res.t?res.t.join('\n'):''}
function repBtn(){const old=$('#rb');if(old)old.remove();if(tab==='rep'||!repText())return;
$('#v').insertAdjacentHTML('beforeend','<div class="card np" id="rb"><button class="o" onclick="repAdd()">＋ أضف النتيجة للتقرير</button></div>')}
function repAdd(){const x=repText();if(!x)return;const lab=(tabs.find(t=>t[0]===tab)||[0,''])[1],ti=prompt('عنوان البند في التقرير',lab);if(ti===null)return;
const o=rload();o.i.push({t:ti||lab,x,d:new Date().toLocaleString('ar-EG')});rsave(o);alert('تمت الإضافة ('+o.i.length+' بنود في التقرير)')}
function repPts(){const o=rload();o.i.push({t:'جدول النقاط',x:['P  N  E  Z  Desc',...cur().map(p=>[p.p,f3(p.n),f3(p.e),p.z==null?'-':f3(p.z),p.d].join('  '))].join('\n'),d:new Date().toLocaleString('ar-EG')});rsave(o);draw()}
function repMeta(k,v){const o=rload();o.m[k]=v;rsave(o)}
function repDel(i){const o=rload();o.i.splice(i,1);rsave(o);draw()}
function repMv(i,d){const o=rload(),j=i+d;if(j<0||j>=o.i.length)return;[o.i[i],o.i[j]]=[o.i[j],o.i[i]];rsave(o);draw()}
function repH(){const o=rload(),m=o.m,eng=ls('eng')||'';
const I=o.i.map((it,i)=>`<div class="card rep-item"><div style="display:flex;gap:6px;align-items:center"><b style="flex:1">${i+1}. ${esc(it.t)}</b><span class="np" style="display:flex;gap:6px"><button class="o" style="width:44px;min-height:40px;padding:0" onclick="repMv(${i},-1)">↑</button><button class="o" style="width:44px;min-height:40px;padding:0" onclick="repMv(${i},1)">↓</button><button class="d" onclick="repDel(${i})">×</button></span></div><div class="res">${esc(it.x)}</div><div style="color:var(--m);font-size:12px">${esc(it.d)}</div></div>`).join('');
return `<div class="card np"><label>عنوان التقرير</label><input value="${esc(m.t||'')}" oninput="repMeta('t',this.value)" onchange="draw()"><label>ملاحظات / العميل</label><input value="${esc(m.n||'')}" oninput="repMeta('n',this.value)" onchange="draw()"><div style="height:10px"></div><div class="g"><button class="o" onclick="repPts()">＋ جدول النقاط</button><button onclick="window.print()">طباعة / PDF</button></div></div>`+
`<div class="card rep-h" style="text-align:center"><h2 style="margin:0">${esc(m.t||'تقرير مساحي')}</h2><div>المشروع: ${esc(proj)} · المهندس: ${esc(eng||'—')}</div><div>${new Date().toLocaleDateString('ar-EG')}</div>${m.n?`<div>${esc(m.n)}</div>`:''}</div>`+
(I||'<p class="np" style="color:var(--m);padding:12px">لا توجد بنود بعد. افتح أي أداة واحسب، ثم اضغط «أضف النتيجة للتقرير».</p>')+(o.i.length?'<div class="card" style="margin-top:30px">توقيع المهندس: ____________________</div>':'')}
