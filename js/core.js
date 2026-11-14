const $=s=>document.querySelector(s),R=Math.PI/180,TAU=2*Math.PI;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}}
/* ===== محرك الزوايا: التخزين الداخلي راديان ===== */
function parseAng(str){str=String(str).trim().replace(',','.');if(!/^-?\d+(\.\d*)?$/.test(str))throw'زاوية غير صالحة: '+str;
const ng=str[0]=='-';if(ng)str=str.slice(1);const[a,b='']=str.split('.');
const mm=+b.slice(0,2).padEnd(2,'0'),ss=+(b.slice(2,4).padEnd(2,'0')+'.'+(b.slice(4)||'0'));
if(mm>=60||ss>=60)throw'دقائق/ثواني خارج النطاق: '+str;return(ng?-1:1)*(+a+mm/60+ss/3600)*R}
const norm=a=>((a%TAU)+TAU)%TAU;
function toDMS(r){const T=Math.round(norm(r)/R*360000);const d=Math.floor(T/360000),x=T-d*360000,m=Math.floor(x/6000),s=(x-m*6000)/100;return d+'°'+String(m).padStart(2,'0')+'′'+s.toFixed(2).padStart(5,'0')+'″'}
const f3=x=>x.toFixed(3);
/* ===== قاعدة البيانات (IndexedDB + نسخة في الذاكرة) ===== */
let db,pts=[],proj=ls('proj')||'مشروع 1',tab='pts',tool=0,res=null;
function openDB(){return new Promise(r=>{try{const q=indexedDB.open('survey',1);q.onupgradeneeded=()=>q.result.createObjectStore('pts',{keyPath:'k'});
q.onsuccess=()=>{db=q.result;try{const g=db.transaction('pts').objectStore('pts').getAll();g.onsuccess=()=>{pts=g.result||[];r()};g.onerror=()=>r()}catch(e){r()}};q.onerror=()=>r()}catch(e){r()}})}
function persist(p,del){try{if(!db)return;const t=db.transaction('pts','readwrite').objectStore('pts');del?t.delete(p.k):t.put(p)}catch(e){}}
const cur=()=>pts.filter(p=>p.j===proj);
const find=n=>cur().find(p=>p.p===String(n).trim());
function add(p,n,e,z,d){p=String(p).trim();if(!p||isNaN(n)||isNaN(e)||n===''||e==='')return 0;
const o={k:proj+'|'+p,j:proj,p,n:+n,e:+e,z:(z==null||z===''||isNaN(z))?null:+z,d:d||''};
const i=pts.findIndex(x=>x.k===o.k);i>=0?pts[i]=o:pts.push(o);persist(o);return 1}
function setP(v){proj=v;ls('proj',v);res=null;draw()}
function newP(){const n=prompt('اسم المشروع الجديد؟');if(n&&n.trim()){proj=n.trim();ls('proj',proj);res=null;draw()}}
/* ===== محرك COGO (N = شمال، E = شرق، الاتجاه من الشمال مع عقارب الساعة) ===== */
const gp=n=>{const p=find(n);if(!p)throw'النقطة غير موجودة: '+n;return p};
const P_=['p','نقطة'],A_=['a','الاتجاه د.ددثث (مثال 125.3045)'],D_=['d','المسافة (م)'];
const tools=[
{n:'إحداثيات مباشرة (Forward)',f:[['p','من نقطة'],A_,D_],run:([p,a,d])=>({t:['N = '+f3(p.n+d*Math.cos(a)),'E = '+f3(p.e+d*Math.sin(a))],P:[[p.n+d*Math.cos(a),p.e+d*Math.sin(a)]]})},
{n:'إحداثيات عكسية (Inverse)',f:[['p','من نقطة'],['p','إلى نقطة']],run:([p,q])=>{const dn=q.n-p.n,de=q.e-p.e,az=Math.atan2(de,dn);
return{t:['المسافة = '+f3(Math.hypot(dn,de))+' م','الاتجاه = '+toDMS(az),'الاتجاه العكسي = '+toDMS(az+Math.PI),'ΔN = '+f3(dn)+'   ΔE = '+f3(de)]}}},
{n:'تقاطع مسافة – مسافة',f:[['p','النقطة 1'],['d','المسافة 1'],['p','النقطة 2'],['d','المسافة 2']],run:([p,d1,q,d2])=>{
const dn=q.n-p.n,de=q.e-p.e,c=Math.hypot(dn,de);if(c<1e-9)throw'النقطتان متطابقتان';
if(d1+d2<c-1e-9||Math.abs(d1-d2)>c+1e-9)throw'لا يوجد تقاطع (الدائرتان لا تتقاطعان)';
const a=(d1*d1-d2*d2+c*c)/(2*c),h=Math.sqrt(Math.max(0,d1*d1-a*a)),un=dn/c,ue=de/c,mn=p.n+a*un,me=p.e+a*ue;
const S=[[mn+h*ue,me-h*un],[mn-h*ue,me+h*un]];return{t:S.map((s,i)=>'حل '+(i+1)+': N='+f3(s[0])+'  E='+f3(s[1])),P:S}}},
{n:'تقاطع اتجاه – اتجاه',f:[['p','النقطة 1'],['a','اتجاه 1'],['p','النقطة 2'],['a','اتجاه 2']],run:([p,a1,q,a2])=>{
const c1=Math.cos(a1),s1=Math.sin(a1),c2=Math.cos(a2),s2=Math.sin(a2),det=-c1*s2+c2*s1;
if(Math.abs(det)<1e-12)throw'الخطان متوازيان';const t=(-(q.n-p.n)*s2+c2*(q.e-p.e))/det,N=p.n+t*c1,E=p.e+t*s1;
return{t:['N = '+f3(N),'E = '+f3(E),'المسافة من نقطة 1 = '+f3(t)+' م'],P:[[N,E]]}}},
{n:'تقاطع مسافة – اتجاه',f:[['p','نقطة الاتجاه'],['a','الاتجاه'],['p','مركز الدائرة'],['d','نصف القطر (م)']],run:([p,a,q,d])=>{
const c=Math.cos(a),s=Math.sin(a),wn=p.n-q.n,we=p.e-q.e,b=wn*c+we*s,k=b*b-(wn*wn+we*we-d*d);
if(k<0)throw'الاتجاه لا يقطع الدائرة';const r=Math.sqrt(k),S=[-b+r,-b-r].map(t=>[p.n+t*c,p.e+t*s]);
return{t:S.map((x,i)=>'حل '+(i+1)+': N='+f3(x[0])+'  E='+f3(x[1])),P:S}}}];
function area(names){const L=names.split(/[,\s]+/).filter(Boolean).map(gp);if(L.length<3)throw'أدخل 3 نقاط على الأقل';
let s=0,per=0;L.forEach((a,i)=>{const b=L[(i+1)%L.length];s+=a.e*b.n-b.e*a.n;per+=Math.hypot(b.n-a.n,b.e-a.e)});
const A=Math.abs(s)/2,fd=A/4200.833,F=Math.floor(fd),q=(fd-F)*24,Q=Math.floor(q),S=(q-Q)*24;
return['المساحة = '+A.toFixed(3)+' م²','= '+(A/10000).toFixed(4)+' هكتار','= '+F+' فدان و '+Q+' قيراط و '+S.toFixed(2)+' سهم','المحيط = '+f3(per)+' م']}
/* ===== التصدير ===== */
function csv(){return cur().map(p=>[p.p,p.n.toFixed(3),p.e.toFixed(3),p.z==null?'':p.z.toFixed(3),p.d].join(',')).join('\n')}
function dxf(){let o='0\nSECTION\n2\nENTITIES\n';cur().forEach(p=>{o+='0\nPOINT\n8\nPOINTS\n10\n'+p.e+'\n20\n'+p.n+'\n30\n'+(p.z||0)+'\n';
o+='0\nTEXT\n8\nPOINT_NAMES\n10\n'+(p.e+.5)+'\n20\n'+(p.n+.5)+'\n30\n0\n40\n1\n1\n'+p.p+'\n';
if(p.z!=null)o+='0\nTEXT\n8\nELEVATIONS\n10\n'+(p.e+.5)+'\n20\n'+(p.n-1)+'\n30\n0\n40\n0.8\n1\n'+p.z.toFixed(3)+'\n'});return o+'0\nENDSEC\n0\nEOF\n'}
function imp(txt){const ord=$('#ord').value.split(',').map(s=>s.trim().toUpperCase());let c=0;
txt.split(/\r?\n/).forEach(l=>{l=l.trim();if(!l)return;const x=l.split(/[,;\t ]+/),g=k=>x[ord.indexOf(k)];c+=add(g('P')??'',g('N')??'',g('E')??'',g('Z'),g('DESC'))});
alert('تم استيراد '+c+' نقطة');draw()}
