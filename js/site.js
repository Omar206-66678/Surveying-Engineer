/* إدارة الموقع: المناسيب المرجعية + اليومية + معايرة الأجهزة */
let sm=0,sf={};
const today=()=>new Date().toISOString().slice(0,10);
const SK=()=>'site_'+proj;
const sload=()=>{try{return JSON.parse(ls(SK())||'{}')}catch(e){return{}}};
function sAdd(k,o){const s=sload();(s[k]=s[k]||[]).push(o);ls(SK(),JSON.stringify(s));draw()}
function sDel(k,i){if(!confirm('حذف؟'))return;const s=sload();s[k].splice(i,1);ls(SK(),JSON.stringify(s));draw()}
const S=(k,l,t)=>`<label>${l}</label><input type="${t||'text'}" value="${esc(sf[k]??'')}" oninput="sf['${k}']=this.value">`;
function bmAdd(){const f=sf;if(!f.bn||f.bnZ===undefined||isNaN(f.bnZ))return alert('الاسم والمنسوب مطلوبان');const o={n:f.bn,N:f.bnN||'',E:f.bnE||'',Z:+f.bnZ,d:f.bnD||''};sf={};if(o.N!==''&&o.E!==''&&!isNaN(o.N)&&!isNaN(o.E))add(o.n,o.N,o.E,o.Z,'BM');sAdd('bm',o)}
function lgAdd(){const f=sf,o={d:f.ld||today(),w:f.lw||'',c:f.lc||'',i:f.li||'',n:f.ln||''};if(!o.n&&!o.c)return alert('اكتب أعمال اليوم أو فريق العمل');sf={};sAdd('log',o)}
function clAdd(){const f=sf;if(!f.cn||!f.cd)return alert('اسم الجهاز وتاريخ آخر معايرة مطلوبان');const o={n:f.cn,d:f.cd,m:+f.cm||12};sf={};sAdd('cal',o)}
const dueD=o=>{const d=new Date(o.d);d.setMonth(d.getMonth()+o.m);return d};
function siteH(){const s=sload(),op=['مناسيب مرجعية (BM)','يومية الموقع','معايرة الأجهزة'],del=(k,i)=>`<button class="d" onclick="sDel('${k}',${i})">×</button>`;
let h=`<select onchange="sm=+this.value;sf={};draw()">${op.map((o,i)=>`<option value="${i}"${i===sm?' selected':''}>${o}</option>`).join('')}</select><div class="card np">`;
if(sm===0)h+=S('bn','الاسم')+`<div class="g"><div>${S('bnN','N')}</div><div>${S('bnE','E')}</div></div>`+S('bnZ','المنسوب Z')+S('bnD','وصف المكان')+`<div style="height:10px"></div><button onclick="bmAdd()">حفظ BM</button></div>`+(s.bm||[]).map((b,i)=>`<div class="card"><b>${esc(b.n)}</b> ${del('bm',i)}<div class="res">Z = ${f3(b.Z)}${b.N!==''?`\nN = ${esc(b.N)}  E = ${esc(b.E)}`:''}</div><div style="color:var(--m)">${esc(b.d)}</div></div>`).join('');
else if(sm===1)h+=S('ld','التاريخ','date')+S('lw','الطقس')+S('lc','فريق العمل')+S('li','الأجهزة المستخدمة')+`<label>أعمال اليوم</label><textarea oninput="sf.ln=this.value">${esc(sf.ln||'')}</textarea><div style="height:10px"></div><button onclick="lgAdd()">حفظ اليومية</button></div>`+(s.log||[]).slice().reverse().map((o,i,a)=>`<div class="card"><b>${esc(o.d)}</b> ${del('log',a.length-1-i)}<div>${esc(o.w)} · ${esc(o.c)}</div><div style="color:var(--m)">${esc(o.i)}</div><div>${esc(o.n)}</div></div>`).join('');
else h+=S('cn','اسم الجهاز (توتال ستيشن / ميزان / GPS)')+S('cd','تاريخ آخر معايرة','date')+S('cm','دورية المعايرة (شهر)','number')+`<div style="height:10px"></div><button onclick="clAdd()">إضافة جهاز</button></div>`+(s.cal||[]).map((o,i)=>{const d=dueD(o),dd=Math.round((d-new Date())/864e5),c=dd<0?'var(--r)':dd<30?'var(--a)':'var(--g)';return `<div class="card"><b>${esc(o.n)}</b> ${del('cal',i)}<div class="res" style="color:${c}">المعايرة القادمة: ${d.toISOString().slice(0,10)}\n${dd<0?'متأخرة '+(-dd)+' يوم ✘':'متبقي '+dd+' يوم'}</div></div>`}).join('');
return h}
