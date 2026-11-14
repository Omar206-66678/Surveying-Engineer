/* ===== الواجهة ===== */

function draw(){const ps=[...new Set([proj,...pts.map(p=>p.j)])];
$('#pj').innerHTML=ps.map(x=>'<option'+(x===proj?' selected':'')+'>'+esc(x)+'</option>').join('');
nav();
let h='';
if(tab==='pts'){h='<div class="card"><div class="g"><div><label>الاسم</label><input id="a1"></div><div><label>الوصف</label><input id="a5"></div>'+
'<div><label>N شمال</label><input id="a2" inputmode="decimal"></div><div><label>E شرق</label><input id="a3" inputmode="decimal"></div></div>'+
'<label>Z المنسوب (اختياري)</label><input id="a4" inputmode="decimal"><div style="height:10px"></div><button onclick="addP()">إضافة نقطة</button></div>'+
'<div class="card tw"><table><tr><th>P</th><th>N</th><th>E</th><th>Z</th><th></th></tr>'+cur().map(p=>'<tr><td>'+esc(p.p)+'</td><td>'+f3(p.n)+'</td><td>'+f3(p.e)+'</td><td>'+(p.z==null?'-':f3(p.z))+'</td><td><button class="d" onclick="delP(\''+esc(p.p).replace(/'/g,'')+'\')">×</button></td></tr>').join('')+'</table>'+(cur().length?'':'<p style="color:var(--m)">لا توجد نقاط بعد</p>')+'</div>'}
if(tab==='cogo'){const T=tools[tool];h='<select onchange="tool=+this.value;res=null;draw()">'+tools.map((t,i)=>'<option value="'+i+'"'+(i===tool?' selected':'')+'>'+t.n+'</option>').join('')+'</select><div class="card">'+
T.f.map((f,i)=>'<label>'+f[1]+'</label><input id="f'+i+'"'+(f[0]==='p'?' list="pl"':' inputmode="decimal"')+'>').join('')+'<datalist id="pl">'+cur().map(p=>'<option>'+esc(p.p)+'</option>').join('')+'</datalist><div style="height:10px"></div><button onclick="go()">احسب</button></div>'+resH()}
if(tab==='area')h='<div class="card"><label>أسماء النقاط بالترتيب (مفصولة بمسافة أو فاصلة)</label><input id="ar"><div style="height:10px"></div><button onclick="ga()">احسب المساحة</button></div>'+resH();
if(tab==='io')h='<div class="card"><label>ترتيب الأعمدة</label><input id="ord" value="P,N,E,Z,Desc" dir="ltr"><label>الصق النقاط هنا أو اختر ملف CSV/TXT</label><textarea id="im"></textarea>'+
'<div class="g" style="margin-top:8px"><button onclick="imp($(\'#im\').value)">استيراد</button><button class="o" onclick="$(\'#fl\').click()">ملف…</button></div><input type="file" id="fl" accept=".csv,.txt" hidden></div>'+
'<div class="card"><div class="g"><button onclick="out(csv(),\'points.csv\')">تصدير CSV</button><button onclick="out(dxf(),\'drawing.dxf\')">تصدير DXF</button></div><textarea id="ot" readonly></textarea><button class="o" onclick="cp()">نسخ</button><p style="color:var(--m);font-size:14px">الملف بينزل مباشرة، ويمكنك أيضاً نسخ النص. طبقات DXF: POINTS · POINT_NAMES · ELEVATIONS</p></div>';
if(tab==='gps')h=gH();if(tab==='map')h=mapH();if(tab==='adv')h=adH();if(tab==='tin')h=tnH();if(tab==='rep')h=repH();if(tab==='site')h=siteH();if(tab==='set')h=setH();if(tab==='trv')h=tvH();if(tab==='crv')h=crH();if(tab==='lev')h=levH();if(tab==='vol')h=volH();$('#v').innerHTML=h;if(tab==='map')mapInit();repBtn();const fl=$('#fl');if(fl)fl.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>imp(r.result);r.readAsText(f)}}
const resH=()=>res?'<div class="card"><div class="'+(res.e?'err':'res')+'">'+esc(res.t.join('\n'))+'</div>'+(res.P?res.P.map((p,i)=>'<div class="g" style="margin-top:8px"><input id="sn'+i+'" placeholder="اسم النقطة" dir="ltr"><button onclick="sv('+i+')">حفظ حل '+(i+1)+'</button></div>').join(''):'')+'</div>':'';
function addP(){const g=i=>$('#a'+i).value;if(!add(g(1),g(2),g(3),g(4),g(5)))return alert('أدخل الاسم و N و E بأرقام صحيحة');draw()}
function delP(n){const p=find(n);if(p){pts=pts.filter(x=>x!==p);persist(p,1);draw()}}
function go(){const T=tools[tool];try{const v=T.f.map((f,i)=>{const x=$('#f'+i).value;return f[0]==='p'?gp(x):f[0]==='a'?parseAng(x):isNaN(x)||x.trim()===''?(()=>{throw'قيمة غير صالحة'})():+x});res=T.run(v)}catch(e){res={e:1,t:[String(e)]}}draw()}
function ga(){const v=$('#ar').value;try{res={t:area(v)}}catch(e){res={e:1,t:[String(e)]}}draw();$('#ar').value=v}
function sv(i){const n=$('#sn'+i).value;if(!n.trim())return alert('اكتب اسم النقطة');add(n,res.P[i][0],res.P[i][1],null,'COGO');alert('تم الحفظ');}
function out(s,f){$('#ot').value=s;if(f)dl(f,s)}
function cp(){const t=$('#ot');t.select();try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand('copy')}}
