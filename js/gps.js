/* ===== المرحلة 4: Proj4 + GPS + التوقيع ===== */
const CRS={'UTM 36N':'+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs','UTM 35N':'+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs','UTM 37N':'+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs',
'ETM Red Belt':'+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs',
'ETM Purple Belt':'+proj=tmerc +lat_0=30 +lon_0=27 +k=1 +x_0=700000 +y_0=200000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs',
'ETM Blue Belt':'+proj=tmerc +lat_0=30 +lon_0=35 +k=1 +x_0=300000 +y_0=1100000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs','مخصص':''};
let gs={crs:'UTM 36N',def:'',lat:'',lon:'',n:'',e:'',tg:'',tol:'0.05',nm:'',pos:null,w:null,hd:null};
const pd=()=>gs.crs==='مخصص'?gs.def:CRS[gs.crs];
function gConv(f){try{if(typeof proj4==='undefined')throw'مكتبة Proj4 غير محمّلة';const v=f?[gs.lon,gs.lat]:[gs.e,gs.n];if(v.some(x=>x===''||isNaN(x)))throw'أدخل قيماً صحيحة';
if(f){const r=proj4('EPSG:4326',pd(),[+gs.lon,+gs.lat]);gs.e=r[0].toFixed(3);gs.n=r[1].toFixed(3)}else{const r=proj4(pd(),'EPSG:4326',[+gs.e,+gs.n]);gs.lon=r[0].toFixed(8);gs.lat=r[1].toFixed(8)}}catch(e){alert(e)}draw()}
function gStart(){if(!navigator.geolocation)return alert('الجهاز لا يدعم تحديد الموقع');if(typeof proj4==='undefined')return alert('مكتبة Proj4 غير محمّلة');
if(gs.w!=null){navigator.geolocation.clearWatch(gs.w);gs.w=null;return draw()}
gs.w=navigator.geolocation.watchPosition(p=>{try{const c=p.coords,r=proj4('EPSG:4326',pd(),[c.longitude,c.latitude]);gs.pos={lat:c.latitude,lon:c.longitude,N:r[1],E:r[0],acc:c.accuracy};if(c.heading!=null&&!isNaN(c.heading))gs.hd=c.heading;upd()}catch(e){const g=$('#gl');if(g)g.textContent='خطأ: '+e}},
e=>{const g=$('#gl');if(g)g.textContent='تعذّر تحديد الموقع: '+e.message},{enableHighAccuracy:true,maximumAge:0,timeout:20000});draw()}
function upd(){const g=$('#gl');if(!g)return;const p=gs.pos;if(!p){g.textContent='في انتظار الإشارة…';return}
let s='Lat '+p.lat.toFixed(7)+'  Lon '+p.lon.toFixed(7)+'\nN = '+f3(p.N)+'  E = '+f3(p.E)+'\nدقة الجهاز ±'+p.acc.toFixed(1)+' م';const T=gs.tg&&find(gs.tg),ar=$('#ar2');
if(T){const dn=T.n-p.N,de=T.e-p.E,d=Math.hypot(dn,de),az=Math.atan2(de,dn),tl=+gs.tol||0.05;
s+='\n\nإلى '+T.p+': '+(d<1?(d*100).toFixed(0)+' سم':f3(d)+' م')+'\nالاتجاه '+toDMS(az)+'\n'+(dn>=0?'شمالاً ':'جنوباً ')+Math.abs(dn*100).toFixed(0)+' سم  |  '+(de>=0?'شرقاً ':'غرباً ')+Math.abs(de*100).toFixed(0)+' سم';
if(p.acc>tl)s+='\n⚠ دقة الجهاز أقل من التفاوت ('+tl+' م): للاقتراب فقط';else if(d<=tl)s+='\n✔ داخل التفاوت';
if(ar)ar.style.transform='rotate('+(az-(gs.hd!=null?gs.hd*R:0))+'rad)'}
g.textContent=s;plan()}
function plan(){const cn=$('#cv2');if(!cn)return;const x=cn.getContext('2d'),W=cn.width=cn.clientWidth||320,H=cn.height=260;x.fillStyle='#0b0d10';x.fillRect(0,0,W,H);
const P=cur().map(p=>({n:p.n,e:p.e,t:p.p,g:p.p===gs.tg}));if(gs.pos)P.push({n:gs.pos.N,e:gs.pos.E,t:'',me:1});if(!P.length)return;
const es=P.map(p=>p.e),ns=P.map(p=>p.n),e0=Math.min(...es),e1=Math.max(...es),n0=Math.min(...ns),n1=Math.max(...ns),sp=Math.max(e1-e0,n1-n0,1)*1.3,s=Math.min(W,H)/sp,ce=(e0+e1)/2,cN=(n0+n1)/2,X=e=>W/2+(e-ce)*s,Y=n=>H/2-(n-cN)*s;
const me=P.find(p=>p.me),tg=P.find(p=>p.g);if(me&&tg){x.strokeStyle='#ffb000';x.setLineDash([5,5]);x.beginPath();x.moveTo(X(me.e),Y(me.n));x.lineTo(X(tg.e),Y(tg.n));x.stroke();x.setLineDash([])}
P.forEach(p=>{x.fillStyle=p.me?'#37d67a':p.g?'#ffb000':'#9aa5b4';x.beginPath();x.arc(X(p.e),Y(p.n),p.me?7:p.g?6:4,0,TAU);x.fill();if(p.t){x.fillStyle='#f4f6f8';x.font='12px sans-serif';x.fillText(p.t,X(p.e)+7,Y(p.n)-5)}});x.fillStyle='#ffb000';x.font='14px sans-serif';x.fillText('N ↑',8,18)}
function gSave(){if(!gs.pos)return alert('لا يوجد موقع حالي');const n=gs.nm.trim();if(!n)return alert('اكتب اسم النقطة');add(n,gs.pos.N,gs.pos.E,null,'GPS');alert('تم الحفظ');draw()}
function gH(){const w=d=>`<div>${d}</div>`;let h=(typeof proj4==='undefined'?'<div class="card err">مكتبة Proj4 لم تُحمَّل (تحتاج اتصالاً في أول تشغيل)</div>':'')+
`<div class="card np"><label>نظام الإحداثيات</label><select onchange="gs.crs=this.value;draw()">${Object.keys(CRS).map(k=>`<option${k===gs.crs?' selected':''}>${k}</option>`).join('')}</select>`+(gs.crs==='مخصص'?F('gs',gs,'def','سلسلة Proj4','+proj=tmerc …'):'')+
`<p style="color:var(--m);font-size:13px">معاملات ETM لازم تتطابق مع الملف الرسمي لمنطقتك قبل أي عمل فعلي.</p><div class="g">${w(F('gs',gs,'lat','Lat'))}${w(F('gs',gs,'lon','Lon'))}${w(F('gs',gs,'n','N'))}${w(F('gs',gs,'e','E'))}</div><div class="g" style="margin-top:8px"><button onclick="gConv(1)">Lat/Lon ← N/E</button><button onclick="gConv(0)">N/E ← Lat/Lon</button></div></div>`+
`<div class="card np"><button onclick="gStart()">${gs.w!=null?'إيقاف التتبع':'بدء التتبع بالـ GPS'}</button><label>نقطة التوقيع</label><input list="pl3" value="${esc(gs.tg)}" oninput="gs.tg=this.value;upd()"><datalist id="pl3">${cur().map(p=>`<option>${esc(p.p)}</option>`).join('')}</datalist>${F('gs',gs,'tol','التفاوت (م)')}</div>`+
`<div id="ar2" style="font-size:64px;text-align:center;color:var(--a);transition:transform .3s">▲</div><div class="card"><div class="res" id="gl">اضغط بدء التتبع</div></div><canvas id="cv2" style="width:100%;height:260px;border:1px solid var(--b);border-radius:10px"></canvas>`+
`<div class="card np">${F('gs',gs,'nm','اسم لحفظ الموقع الحالي كنقطة')}<div style="height:10px"></div><button onclick="gSave()">حفظ الموقع الحالي</button><p style="color:var(--m);font-size:13px">GPS الموبايل دقته عادةً عدة أمتار: استخدمه للوصول التقريبي للنقطة، والتوقيع الدقيق بالتوتال ستيشن أو RTK.</p></div>`;setTimeout(upd,0);return h}
