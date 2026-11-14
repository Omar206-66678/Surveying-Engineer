applyTheme(ls('theme')||'dark');
window.onerror=m=>{document.body.insertAdjacentHTML('afterbegin','<p class="err" style="padding:12px">خطأ: '+esc(m)+'</p>')};
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
openDB().then(draw);draw();
