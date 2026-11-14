/* الخريطة (Leaflet) – أقمار صناعية/خريطة + نقاط المشروع بعد تحويلها من النظام المحدد */
let LM=null;
function mapH(){return `<div id="map" style="height:calc(100vh - 330px);min-height:300px;border-radius:12px;border:1px solid var(--b)"></div><div class="card np"><label>نظام إحداثيات نقاطك</label><select onchange="gs.crs=this.value;draw()">${Object.keys(CRS).map(k=>`<option${k===gs.crs?' selected':''}>${k}</option>`).join('')}</select><div style="height:8px"></div><button onclick="mapFit()">عرض كل النقاط</button></div>`}
function mapInit(){if(LM){try{LM.remove()}catch(e){}LM=null}const el=$('#map');if(!el)return;
if(typeof L==='undefined'){el.innerHTML='<p class="err" style="padding:12px">مكتبة الخريطة تحتاج اتصالاً بالإنترنت</p>';return}
LM=L.map(el).setView([30.05,31.24],6);
const osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}),
sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Esri'});
sat.addTo(LM);L.control.layers({'أقمار صناعية':sat,'خريطة':osm}).addTo(LM);LM.pl=L.layerGroup().addTo(LM);mapPts();setTimeout(()=>LM&&LM.invalidateSize(),60)}
function mapPts(){const g=LM.pl,ll=[];g.clearLayers();if(typeof proj4==='undefined')return;
try{cur().forEach(p=>{const r=proj4(pd(),'EPSG:4326',[p.e,p.n]),y=[r[1],r[0]];ll.push(y);L.circleMarker(y,{radius:6,color:'#ffb000',fillOpacity:.9}).bindTooltip(p.p,{permanent:true,direction:'right'}).addTo(g)});
if(gs.pos){const y=[gs.pos.lat,gs.pos.lon];ll.push(y);L.circleMarker(y,{radius:8,color:'#37d67a',fillOpacity:.9}).addTo(g)}}catch(e){}
LM.ll=ll;mapFit()}
function mapFit(){if(LM&&LM.ll&&LM.ll.length)LM.fitBounds(LM.ll,{maxZoom:19,padding:[30,30]})}
