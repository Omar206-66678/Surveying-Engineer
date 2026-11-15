/* السطح والكونتور: Web Worker + رسم + تصدير DXF */
let TN=null,tnBusy=false,tn={iv:'1',ix:'5',me:'',ref:''};
function tnRun(){const P=cur().filter(p=>p.z!=null).map(p=>({e:p.e,n:p.n,z:p.z,p:p.p}));if(P.length<3)return alert('محتاج 3 نقاط بمناسيب (Z) على الأقل');
const o={pts:P,iv:+tn.iv,maxE:+tn.me||0,ref:tn.ref===''?null:+tn.ref};tnBusy=true;draw();const fin=r=>{TN=r;tnBusy=false;draw()};
try{const w=new Worker('js/worker.js');w.onmessage=e=>{w.terminate();fin(e.data)};w.onerror=()=>{w.terminate();fin(tnSolve(o))};w.postMessage(o)}catch(e){setTimeout(()=>fin(tnSolve(o)),30)}}
function tnDxf(){const ix=+tn.ix||5,cn={};let o='0\nSECTION\n2\nENTITIES\n';TN.segs.forEach(s=>{const L=s[0]*TN.iv,ly=s[0]%ix===0?'CONTOURS_INDEX':'CONTOURS';
o+='0\nLINE\n8\n'+ly+'\n10\n'+s[1]+'\n20\n'+s[2]+'\n30\n'+L+'\n11\n'+s[3]+'\n21\n'+s[4]+'\n31\n'+L+'\n';
if(s[0]%ix===0&&(cn[s[0]]=(cn[s[0]]||0)+1)%25===1)o+='0\nTEXT\n8\nCONTOUR_LABELS\n10\n'+(s[1]+s[3])/2+'\n20\n'+(s[2]+s[4])/2+'\n30\n'+L+'\n40\n1.5\n1\n'+L.toFixed(1)+'\n'});dl('contours.dxf',o+'0\nENDSEC\n0\nEOF\n')}
function tnDraw(){const cn=$('#tc');if(!cn||!TN)return;const x=cn.getContext('2d'),W=cn.width=cn.clientWidth||320,H=cn.height=320,cs=getComputedStyle(document.documentElement),P=TN.pts;
x.fillStyle=cs.getPropertyValue('--bg')||'#000';x.fillRect(0,0,W,H);const es=P.map(p=>p.e),ns=P.map(p=>p.n),e0=Math.min(...es),e1=Math.max(...es),n0=Math.min(...ns),n1=Math.max(...ns),
sp=Math.max(e1-e0,n1-n0,1)*1.1,s=Math.min(W,H)/sp,X=e=>W/2+(e-(e0+e1)/2)*s,Y=n=>H/2-(n-(n0+n1)/2)*s;
x.strokeStyle=cs.getPropertyValue('--b')||'#444';x.lineWidth=.5;x.beginPath();TN.tris.forEach(t=>{x.moveTo(X(P[t[0]].e),Y(P[t[0]].n));x.lineTo(X(P[t[1]].e),Y(P[t[1]].n));x.lineTo(X(P[t[2]].e),Y(P[t[2]].n));x.closePath()});x.stroke();
const ix=+tn.ix||5;[false,true].forEach(m=>{x.strokeStyle=m?'#ffb000':'#4aa3ff';x.lineWidth=m?2:1;x.beginPath();TN.segs.forEach(g=>{if((g[0]%ix===0)===m){x.moveTo(X(g[1]),Y(g[2]));x.lineTo(X(g[3]),Y(g[4]))}});x.stroke()});
x.fillStyle='#ffb000';x.font='11px sans-serif';const sn={};TN.segs.forEach(g=>{if(g[0]%ix===0&&(sn[g[0]]=(sn[g[0]]||0)+1)%25===1)x.fillText((g[0]*TN.iv).toFixed(1),X((g[1]+g[3])/2),Y((g[2]+g[4])/2))});
x.fillStyle=cs.getPropertyValue('--t')||'#fff';P.forEach(p=>{x.fillRect(X(p.e)-1.5,Y(p.n)-1.5,3,3)})}
function tnH(){let h=`<div class="card np">${F('tn',tn,'iv','فاصل الكونتور (م)')+F('tn',tn,'ix','كونتور رئيسي كل (عدد)')+F('tn',tn,'me','أقصى طول ضلع للمثلث (اختياري، م)')+F('tn',tn,'ref','منسوب مرجعي لحساب الحجوم (اختياري)')}<div style="height:10px"></div><button onclick="tnRun()">${tnBusy?'جارٍ المعالجة…':'ابنِ السطح والكونتور'}</button><p style="color:var(--m);font-size:13px">يستخدم نقاط المشروع الحالي التي لها منسوب Z. استورد الملفات الكبيرة من تبويب تبادل.</p></div>`;
if(TN){const r=TN,t=['النقاط = '+r.pts.length+'   المثلثات = '+r.tris.length,'المنسوب: '+f3(r.zmin)+' إلى '+f3(r.zmax),'المساحة الأفقية = '+f3(r.area)+' م²','عدد مقاطع الكونتور = '+r.segs.length];
if(r.hasRef)t.push('حفر (فوق المرجع) = '+f3(r.cut)+' م³','ردم (تحت المرجع) = '+f3(r.fill)+' م³','الصافي = '+f3(r.cut-r.fill)+' م³');
r.txt=t.join('\n');h+=`<canvas id="tc" style="width:100%;height:320px;border:1px solid var(--b);border-radius:10px"></canvas><div class="card"><div class="res">${esc(t.join('\n'))}</div></div><div class="card np"><button onclick="tnDxf()">تنزيل الكونتور DXF</button></div>`;setTimeout(tnDraw,0)}
return h}
