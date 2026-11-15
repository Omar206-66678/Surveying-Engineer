/* الخريطة (Leaflet) – أقمار صناعية/خريطة + نقاط المشروع بعد تحويلها من النظام المحدد */
let LM=null,mp={url:ls('tileurl')||'',z0:'15',z1:'17'};
function mapH(){return `<div id="map" style="height:calc(100vh - 330px);min-height:300px;border-radius:12px;border:1px solid var(--b)"></div><div class="card np"><label>نظام إحداثيات نقاطك</label><select onchange="gs.crs=this.value;draw()">${Object.keys(CRS).map(k=>`<option${k===gs.crs?' selected':''}>${k}</option>`).join('')}</select><div style="height:8px"></div><button onclick="mapFit()">عرض كل النقاط</button></div><div class="card np"><b>تحميل الخريطة للعمل بدون إنترنت</b><p style="color:var(--m);font-size:13px">استخدم مصدر مربعات تملك حق تحميله بالجملة (خادمك أو اشتراكك). خرائط OpenStreetMap وEsri المجانية لا تسمح بالتحميل الجماعي، فهي تُخزَّن فقط أثناء التصفح. يظهر المصدر المخصص بعد إعادة فتح الخريطة.</p>${F('mp',mp,'url','قالب رابط المربعات','https://…/{z}/{x}/{y}.png')}<div class="g"><div>${F('mp',mp,'z0','أقل زوم')}</div><div>${F('mp',mp,'z1','أعلى زوم')}</div></div><div style="height:8px"></div><div class="g"><button class="o" onclick="tileEst()">قدّر العدد</button><button onclick="tileGo()">حمّل المنطقة الظاهرة</button></div><div class="res" id="tp"></div></div>`}
function mapInit(){if(LM){try{LM.remove()}catch(e){}LM=null}const el=$('#map');if(!el)return;
if(typeof L==='undefined'){el.innerHTML='<p class="err" style="padding:12px">مكتبة الخريطة تحتاج اتصالاً بالإنترنت</p>';return}
LM=L.map(el).setView([30.05,31.24],6);
const osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}),
sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Esri'});
const cu=mp.url?L.tileLayer(mp.url,{maxZoom:19,subdomains:'a',attribution:'مصدر مخصص'}):null;(cu||sat).addTo(LM);L.control.layers(Object.assign({'أقمار صناعية':sat,'خريطة':osm},cu?{'مصدر مخصص':cu}:{})).addTo(LM);LM.pl=L.layerGroup().addTo(LM);mapPts();setTimeout(()=>LM&&LM.invalidateSize(),60)}
function mapPts(){const g=LM.pl,ll=[];g.clearLayers();if(typeof proj4==='undefined')return;
try{cur().forEach(p=>{const r=proj4(pd(),'EPSG:4326',[p.e,p.n]),y=[r[1],r[0]];ll.push(y);L.circleMarker(y,{radius:6,color:'#ffb000',fillOpacity:.9}).bindTooltip(p.p,{permanent:true,direction:'right'}).addTo(g)});
if(gs.pos){const y=[gs.pos.lat,gs.pos.lon];ll.push(y);L.circleMarker(y,{radius:8,color:'#37d67a',fillOpacity:.9}).addTo(g)}}catch(e){}
LM.ll=ll;mapFit()}
function mapFit(){if(LM&&LM.ll&&LM.ll.length)LM.fitBounds(LM.ll,{maxZoom:19,padding:[30,30]})}
const t2x=(lon,z)=>Math.floor((lon+180)/360*2**z),t2y=(lat,z)=>{const r=lat*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z)};
function tileList(){const b=LM.getBounds(),L=[];for(let z=+mp.z0;z<=+mp.z1;z++){const x0=t2x(b.getWest(),z),x1=t2x(b.getEast(),z),y0=t2y(b.getNorth(),z),y1=t2y(b.getSouth(),z);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)L.push([z,x,y])}return L}
const tileUrl=(z,x,y)=>mp.url.replace('{z}',z).replace('{x}',x).replace('{y}',y).replace('{s}','a');
function tileEst(){if(!LM||!mp.url.includes('{z}'))return alert('أدخل قالب رابط صحيح أولاً');const n=tileList().length;$('#tp').textContent='العدد التقديري: '+n+' مربع'+(n>3000?' (أكبر من الحد 3000: قلّل المساحة أو الزوم)':'')}
async function tileGo(){if(!LM||!mp.url.includes('{z}'))return alert('أدخل قالب رابط صحيح أولاً');ls('tileurl',mp.url);const L=tileList();if(L.length>3000)return alert('العدد '+L.length+' أكبر من الحد 3000');if(!confirm('تحميل '+L.length+' مربع؟'))return;
const c=await caches.open('tiles');let ok=0,bad=0;for(let i=0;i<L.length;i+=6){await Promise.all(L.slice(i,i+6).map(async([z,x,y])=>{const u=tileUrl(z,x,y);try{if(await c.match(u)){ok++;return}await c.put(u,await fetch(u,{mode:'no-cors'}));ok++}catch(e){bad++}}));const el=$('#tp');if(el)el.textContent='تم '+ok+' / '+L.length+(bad?' · فشل '+bad:'')}
alert('انتهى: '+ok+' مربع'+(bad?' · فشل '+bad:'')+'\nملاحظة: المتصفح لا يكشف أخطاء الروابط مع الطلبات المعتمة، فتأكد بمعاينة الخريطة بدون إنترنت.')}
