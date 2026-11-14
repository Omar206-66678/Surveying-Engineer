/* ===== المرحلة 2: الميزانية (Rise/Fall + Collimation) ===== */
let lv=[],lv0='100',lvE='',lvK='',vm=0,vv={a:'',g:'',d:'',s:''};
const nn=x=>x===''||x==null||isNaN(x)?null:+x;
function lvAdd(){const g=i=>$('#l'+i).value,bs=nn(g(2)),is=nn(g(3)),fs=nn(g(4));
if(!lv.length){if(bs==null)return alert('أول سطر لازم فيه قراءة خلفية BS')}
else{if(is==null&&fs==null)return alert('أدخل قراءة وسطية IS أو أمامية FS');if(is!=null&&fs!=null)return alert('IS و FS لا يجتمعان في سطر واحد');if(bs!=null&&fs==null)return alert('BS في سطر لاحق يلزمه FS (نقطة تحويل)')}
lv.push(lv.length?{p:g(1)||String(lv.length+1),bs,is,fs}:{p:g(1)||'BM',bs,is:null,fs:null});draw()}
function lvCalc(){const r0=lv0===''||isNaN(lv0)?0:+lv0;let last=0,prev=0,HI=0,c={rows:[],sB:0,sF:0,sR:0,sFl:0};
lv.forEach((r,i)=>{const o={...r};if(i===0){o.rl=r0;o.rlc=r0;o.hi=r0+r.bs;last=r.bs;HI=o.hi;c.sB+=r.bs}
else{const rd=r.fs!=null?r.fs:r.is,df=last-rd;if(df>0){o.rise=df;c.sR+=df}else if(df<0){o.fall=-df;c.sFl-=df}
o.rl=prev+df;o.rlc=HI-rd;if(r.fs!=null)c.sF+=r.fs;last=rd;if(r.bs!=null){c.sB+=r.bs;last=r.bs;HI=o.rl+r.bs;o.hi=HI}}
prev=o.rl;c.rows.push(o)});return c}
function levH(){const c=lvCalc(),L=c.rows,n=x=>x==null?'':x.toFixed(3);
let h=`<div class="card np"><label>منسوب البداية RL (م)</label><input value="${esc(lv0)}" oninput="lv0=this.value" inputmode="decimal"><div class="g"><div><label>الاسم</label><input id="l1"></div><div><label>BS خلفية</label><input id="l2" inputmode="decimal"></div><div><label>IS وسطية</label><input id="l3" inputmode="decimal"></div><div><label>FS أمامية</label><input id="l4" inputmode="decimal"></div></div><div style="height:10px"></div><div class="g"><button onclick="lvAdd()">إضافة قراءة</button><button class="o" onclick="lv.pop();draw()">حذف آخر سطر</button></div></div>`;
if(!L.length)return h;
h+=`<div class="card tw"><table><tr><th>Pt</th><th>BS</th><th>IS</th><th>FS</th><th>Rise</th><th>Fall</th><th>RL</th><th>HI</th><th>RL(HI)</th></tr>`+L.map(r=>`<tr><td>${esc(r.p)}</td><td>${n(r.bs)}</td><td>${n(r.is)}</td><td>${n(r.fs)}</td><td>${n(r.rise)}</td><td>${n(r.fall)}</td><td>${n(r.rl)}</td><td>${n(r.hi)}</td><td>${n(r.rlc)}</td></tr>`).join('')+`</table></div>`;
const F=L[0].rl,E=L[L.length-1].rl,d=E-F,t=[];
if(L[L.length-1].fs!=null&&L.length>1){const a=c.sB-c.sF,b=c.sR-c.sFl,ok=Math.abs(a-d)<5e-4&&Math.abs(b-d)<5e-4;t.push('ΣBS − ΣFS = '+f3(a),'ΣRise − ΣFall = '+f3(b),'آخر RL − أول RL = '+f3(d),'فحص الحسابات: '+(ok?'سليم ✔':'خطأ ✘ راجع القراءات'))}else t.push('أنهِ الميزانية بقراءة FS لإجراء فحص الحسابات');
if(lvE!==''&&!isNaN(lvE)&&L.length>1){const e=(E-lvE)*1000;t.push('الخطأ الإغلاقي = '+e.toFixed(1)+' مم');if(lvK!==''&&+lvK>0){const al=12*Math.sqrt(+lvK);t.push('المسموح 12√K = '+al.toFixed(1)+' مم → '+(Math.abs(e)<=al?'مقبول ✔':'مرفوض ✘'))}}
lvTxt=['Pt  BS  IS  FS  RL',...L.map(r=>[r.p,n(r.bs)||'-',n(r.is)||'-',n(r.fs)||'-',n(r.rl)].join('  ')),'',...t].join('\n');return h+`<div class="card"><div class="res">${esc(t.join('\n'))}</div></div><div class="card np"><label>منسوب BM النهائي المعروف (للإغلاق)</label><input value="${esc(lvE)}" oninput="lvE=this.value;draw()" inputmode="decimal"><label>طول الخط K (كم)</label><input value="${esc(lvK)}" oninput="lvK=this.value;draw()" inputmode="decimal"></div>`}
