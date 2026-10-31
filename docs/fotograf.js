"use strict";
/* Talaş: fotoğraftan ürün bulma. Claude içinde (sample + images) fotoğraf Claude'a katalogla birlikte gönderilir;
   dönen eşleşmeler katalog listesine göre denetlenir. Claude yoksa (GitHub Pages) "kendin tarif et" ile eşleştirilir. */

const PH={file:null,url:'',ai:null,busy:null,result:null,manual:{type:'',feat:[],W:'',H:'',D:''}};
let AIREADY=null; // null: bilinmiyor, false: yok, {sample}
async function aiInit(){
  if(AIREADY!==null) return AIREADY;
  try{const sample=window.claude?await window.claude.use('sample'):null;const lim=sample?await sample.limits().catch(()=>null):null;
    AIREADY=sample&&lim&&lim.images?{sample,lim}:false;}catch(e){AIREADY=false;}
  return AIREADY;
}

/* ---------- katalog özeti (Claude'a gönderilen) ---------- */
function catalogBrief(){
  return PRODUCTS.map(p=>({id:p.id,ad:p.name,kategori:p.cat+' › '+p.sub,modeller:p.models.map((m,i)=>{
    const o={i,ad:m.label};
    if(m.optAx.length) o.secenekler=Object.fromEntries(m.optAx.map(([k,vals,L])=>[k,vals.map(v=>String(v)+'='+axLabel(L,v))]));
    if(m.kind==='fam') o.olculer=Object.fromEntries(Object.entries(m.f.P).map(([k,[a,b]])=>[k,(m.f.lbl&&m.f.lbl[k]||PL[k])+' '+a+'-'+b]));
    else o.olculer=Object.fromEntries(m.pr.params.map(q=>[q.k,q.l+' '+q.min+'-'+q.max]));
    return o;})}));
}
function prompt(){
  return `Sen bir marangoz ustasısın. Fotoğraftaki ahşap ürünü aşağıdaki katalogla eşleştir.

Görev:
1. Fotoğrafta ne gördüğünü bir-iki cümleyle Türkçe anlat (ürün türü, malzeme, ayak/çekmece/kapak/raf gibi yapısal özellikler).
2. Katalogdan en çok benzeyen 1-3 ürünü seç. Her biri için model numarasını (i), seçenek değerlerini ve ölçüleri mm cinsinden tahmin et.
   - Seçenek değeri olarak YALNIZCA listede "=" işaretinin solundaki değeri yaz (ör. "mese", "2", "true").
   - Ölçüleri verilen aralıkların içinde tut. Tahmin için standart ölçüleri referans al: oturma yüksekliği ~450 mm, masa ~750 mm, sehpa ~420 mm, kapı ~2000 mm, tezgâh ~900 mm, kitap sırtı ~230 mm.
   - "uyum" 0-100 arası: katalogdaki ürünün fotoğraftakine ne kadar benzediği.
   - "farklar": katalog modelinin fotoğraftan farklı olduğu noktalar (en çok 3 kısa madde), örneğin oyma, kumaş, metal ayak, eğri hatlar.
3. Fotoğraf ahşap bir eşya değilse ya da hiçbir ürün benzemiyorsa "eslesmeler" boş liste olsun ve "gorulen" alanında nedenini yaz.

Yalnızca şu biçimde JSON döndür:
{"gorulen":"...","olcu_notu":"ölçüleri neye göre tahmin ettin, kısa","eslesmeler":[{"urun":"id","model":0,"secenekler":{"anahtar":"değer"},"olculer":{"W":800,"H":1800},"uyum":80,"neden":"kısa gerekçe","farklar":["..."]}]}

Katalog (JSON):
${JSON.stringify(catalogBrief())}`;
}

/* ---------- eşleşme denetimi ve önizleme ---------- */
function cleanMatch(m){
  const prod=PROD[String(m&&m.urun)]; if(!prod) return null;
  const mi=Math.max(0,Math.min(prod.models.length-1,parseInt(m.model,10)||0)), mod=prod.models[mi], opts={};
  mod.optAx.forEach(([k,vals])=>{const raw=m.secenekler&&m.secenekler[k];const hit=vals.find(v=>String(v)===String(raw));opts[k]=hit!==undefined?hit:vals[0];});
  const plist=mod.kind==='fam'?Object.entries(mod.f.P).map(([k,[min,max]])=>({k,min,max})):mod.pr.params.map(q=>({k:q.k,min:q.min,max:q.max}));
  const params={};plist.forEach(q=>{const v=Number(m.olculer&&m.olculer[q.k]);if(isFinite(v)&&v>0)params[q.k]=Math.round(Math.max(q.min,Math.min(q.max,v)));});
  return {prod,mi,opts,params,uyum:Math.max(0,Math.min(100,Math.round(Number(m.uyum)||0))),neden:String(m.neden||'').slice(0,300),farklar:(Array.isArray(m.farklar)?m.farklar:[]).slice(0,3).map(x=>String(x).slice(0,160))};
}
function preview(mt){
  const s=stOf(mt.prod), keep=JSON.stringify(s.o[mt.mi]||null);
  s.o[mt.mi]=Object.assign({},mt.opts);
  const pr=configure(mt.prod,mt.mi), p=Object.assign(params(pr),mt.params), c=compute(pr,p);
  const svg=iso(c.parts,{studio:true,grain:false,aria:mt.prod.name}), dims=c.dims;
  const k=JSON.parse(keep); if(k) s.o[mt.mi]=k; else delete s.o[mt.mi];
  return {svg,dims,p};
}
function matchCard(mt,i){
  const {svg,dims}=preview(mt), mod=mt.prod.models[mt.mi];
  const optTxt=mod.optAx.map(([k,,L])=>cap(axLabel(L,mt.opts[k]))).filter(x=>x!=='Yok').join(' · ');
  return `<article class="match"><div class="pic stage">${svg}</div><div class="mbody">
    <div class="eyebrow">${esc(mt.prod.cat)} › ${esc(mt.prod.sub)}</div>
    <h3>${esc(mt.prod.name)}${mt.prod.models.length>1?` <span class="muted" style="font-weight:600">· ${esc(mod.label)}</span>`:''}</h3>
    ${mt.uyum?`<div class="fit"><i style="width:${mt.uyum}%"></i></div><p class="muted mono" style="font-size:12.5px">Benzerlik %${mt.uyum}</p>`:''}
    ${optTxt?`<p class="mopts">${esc(optTxt)}</p>`:''}
    <p class="mono muted" style="font-size:12.5px">${dims.join(' × ')} mm</p>
    ${mt.neden?`<p class="cinfo">${esc(mt.neden)}</p>`:''}
    ${mt.farklar.length?`<ul class="diff">${mt.farklar.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}
    <button class="btn ${i?'':'primary'}" data-open="${i}">Bu ölçülerle kılavuzu aç</button></div></article>`;
}
function openMatch(mt){
  const s=stOf(mt.prod);s.m=mt.mi;Object.assign(optsOf(mt.prod,mt.mi),mt.opts);
  const pr=configure(mt.prod,mt.mi);SAVE.params[pr.id]=Object.assign(params(pr),mt.params);persist();
  if(location.hash==='#'+mt.prod.id) route(); else location.hash=mt.prod.id;
}

/* ---------- kendin tarif et (her yerde çalışır) ---------- */
const TYPES=[['oturma','Oturma',p=>/Oturma|Bahçe oturma/.test(p.sub)||/tabure|bank|sandalye|koltuk|şezlong|oturak/i.test(p.name)],
  ['masa','Masa / sehpa',p=>/Masa ve sehpa|Bahçe masaları|Masa ve tabure|Çalışma alanı/.test(p.sub)||/masası|sehpa/i.test(p.name)],
  ['dolap','Dolap / çekmece',p=>/Dolap|Yatak odası|Mutfak dolapları/.test(p.sub)||/dolap|şifonyer|komodin|tv/i.test(p.name)],
  ['raf','Raf / kitaplık',p=>/raf|kitaplık|merdiven|stand/i.test(p.sub+' '+p.name)],
  ['yatak','Yatak',p=>/yatak/i.test(p.name+' '+p.tags)],
  ['kutu','Kutu / kasa',p=>/kutu|kasa|sandık|Kutular/i.test(p.name+' '+p.sub)],
  ['duvar','Duvar (ayna, askı, pano)',p=>/Ayna|Antre|Pano|Sanat/.test(p.sub)||/ayna|askı|pano|tabela|saat|çerçeve/i.test(p.name+' '+p.tags)],
  ['bahce','Bahçe ürünü',p=>p.cat==='Bahçe ve dış mekân'],
  ['mutfak','Mutfak eşyası',p=>p.cat==='Mutfak ve küçük eşya'],
  ['cocuk','Çocuk / oyun',p=>p.cat==='Çocuk'||/oyun/i.test(p.sub)]];
const FEATS=[['kapak','Kapaklı',/kapak|door/],['cekmece','Çekmeceli',/çekmece|drawer/],['yuvarlak','Yuvarlak',/yuvarlak|round|Ø/],['acili','Açılı / konik ayak',/açılı|splay|konik/],
  ['raf','Raflı',/raf|shelf|lower/],['sirt','Sırtlı',/sırt|back/],['dis','Dış mekân',/emprenye|emp|dış/],['masif','Masif ağaç',/çam|meşe|kayın|ceviz/]];
function modelText(prod,i){const m=prod.models[i];
  return trl(prod.name+' '+m.label+' '+(m.kind==='fam'?m.f.name+' '+(m.f.tags||'')+' '+JSON.stringify(m.f.o)+' '+m.optAx.map(([k,v,L])=>k+' '+v.map(x=>axLabel(L,x)).join(' ')).join(' '):m.pr.name+' '+m.pr.desc));}
function manualMatches(){
  const M=PH.manual, T=TYPES.find(t=>t[0]===M.type), cm=v=>{const n=parseFloat(String(v).replace(',','.'));return n>0?n*10:null;};
  const want={w:cm(M.W),h:cm(M.H),d:cm(M.D)}, out=[];
  PRODUCTS.forEach(prod=>{if(T&&!T[2](prod))return;
    prod.models.forEach((m,mi)=>{const txt=modelText(prod,mi);let score=T?2:0;const why=[];
      M.feat.forEach(f=>{const F=FEATS.find(x=>x[0]===f);if(F&&F[2].test(txt)){score+=2;why.push(F[1]);}else score-=1;});
      const P=m.kind==='fam'?m.f.P:Object.fromEntries(m.pr.params.map(q=>[q.k,[q.min,q.max]]));
      const keyW=P.L?'L':P.W?'W':null, keyD=P.L?(P.W?'W':null):(P.D?'D':null), map={w:keyW,h:P.H?'H':null,d:keyD}, params={};
      Object.entries(want).forEach(([k,v])=>{const key=map[k];if(!v||!key)return;const [a,b]=P[key];
        if(v>=a&&v<=b){score+=2;} else score-=Math.min(3,Math.abs(v-(v<a?a:b))/Math.max(1,b-a)*3);
        params[key]=Math.round(Math.max(a,Math.min(b,v)));});
      const opts={};m.optAx.forEach(([k,vals,L])=>{const hit=vals.find(v=>M.feat.some(f=>{const F=FEATS.find(x=>x[0]===f);return F&&F[2].test(trl(String(axLabel(L,v))+' '+v));}));opts[k]=hit!==undefined?hit:vals[0];});
      out.push({prod,mi,opts,params,score,uyum:0,neden:why.length?'Eşleşen özellikler: '+why.join(', ')+'.':'',farklar:[]});});});
  out.sort((a,b)=>b.score-a.score);
  const seen=new Set();return out.filter(x=>{if(seen.has(x.prod.id))return false;seen.add(x.prod.id);return true;}).slice(0,6);
}

/* ---------- görünüm ---------- */
async function viewPhoto(){
  app.innerHTML=`<div class="phead"><div class="eyebrow">Fotoğraftan yap</div><h1>Gördüğün ürünün kılavuzunu çıkar</h1>
    <p class="muted" style="max-width:62ch">Bir mobilyanın ya da ahşap eşyanın fotoğrafını çek veya yükle. Katalogdaki en yakın ürünü, modelini, malzemesini ve tahmini ölçülerini bulup kesim listesi ve yapım kılavuzuyla açalım.</p></div>
  <div class="photolay">
    <div class="panel photo-in">
      <label class="drop" id="drop" for="phFile">${PH.url?`<img src="${PH.url}" alt="Yüklenen fotoğraf">`:`<span class="drop-ic"><svg viewBox="0 0 24 24"><path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/></svg></span><b>Fotoğraf çek ya da seç</b><span class="muted">Ürünün tamamı görünsün; mümkünse önden ve hafif yandan</span>`}</label>
      <input type="file" id="phFile" accept="image/*" capture="environment" hidden>
      ${PH.url?'<button class="btn sm" id="phClear">Başka fotoğraf seç</button>':''}
      <div id="aiBox"></div>
    </div>
    <div class="photo-out" id="phOut"></div>
  </div>`;
  renderOut();
  const ai=await aiInit(); if(location.hash!=='#fotograf') return;
  const box=document.getElementById('aiBox'); if(!box) return;
  box.innerHTML=ai?`<button class="btn primary big" id="phAsk" ${PH.file&&!PH.busy?'':'disabled'}>Fotoğrafı tanı</button><p class="cinfo">Fotoğraf, ürünü tanımak için Claude'a gönderilir ve senin Claude kullanımından düşer. İlk seferde izin istenir. Ölçüler tahmindir; yapmadan önce metreyle doğrula.</p>`
    :`<p class="cinfo">Fotoğraftan otomatik tanıma yalnızca uygulama Claude içinde açıldığında çalışır. Burada fotoğrafa bakarak ürünü aşağıda tarif edebilirsin.</p>`;
}
function renderOut(){
  const out=document.getElementById('phOut'); if(!out) return;
  const R=PH.result, M=PH.manual;
  let html='';
  if(PH.busy) html+=`<div class="panel aistat"><span class="spin"></span><div><b>Fotoğraf inceleniyor…</b><p class="muted">Bu işlem yarım dakika ile bir dakika sürebilir.</p></div><button class="btn sm" id="phStop">Durdur</button></div>`;
  if(R&&R.err) html+=`<div class="note warn"><b>Olmadı</b><span>${esc(R.err)}</span></div>`;
  if(R&&R.gorulen) html+=`<div class="panel seen"><h4>Fotoğrafta görülen</h4><p>${esc(R.gorulen)}</p>${R.olcu_notu?`<p class="cinfo">Ölçü tahmini: ${esc(R.olcu_notu)}</p>`:''}</div>`;
  if(R&&R.matches){html+=R.matches.length?`<h2 class="mh">En yakın ürünler</h2><div class="matches">${R.matches.map(matchCard).join('')}</div>`:`<div class="empty">Katalogda bu fotoğrafa benzeyen bir ürün bulunamadı. Aşağıdan tarif ederek en yakınını arayabilirsin.</div>`;}
  html+=`<details class="panel manual" ${R&&R.matches&&R.matches.length?'':'open'}><summary>Kendin tarif et</summary>
    <div class="cgroup"><h4>Ne tür bir ürün?</h4><div class="seg">${TYPES.map(([k,t])=>`<button data-ptype="${k}" aria-pressed="${M.type===k}">${t}</button>`).join('')}</div></div>
    <div class="cgroup"><h4>Özellikler</h4><div class="seg">${FEATS.map(([k,t])=>`<button data-pfeat="${k}" aria-pressed="${M.feat.includes(k)}">${t}</button>`).join('')}</div></div>
    <div class="cgroup"><h4>Yaklaşık ölçüler (cm, bilmiyorsan boş bırak)</h4><div class="dims3">${[['W','Genişlik'],['H','Yükseklik'],['D','Derinlik']].map(([k,t])=>`<label for="pm${k}">${t}<input id="pm${k}" type="number" min="1" inputmode="decimal" data-pdim="${k}" value="${esc(M[k])}"></label>`).join('')}</div></div>
    <button class="btn primary" id="phManual" ${M.type||M.feat.length?'':'disabled'}>Benzerlerini bul</button>
    <div id="manOut"></div></details>`;
  out.innerHTML=html;
  if(PH.manualRes) document.getElementById('manOut').innerHTML=PH.manualRes.length?`<div class="matches">${PH.manualRes.map((m,i)=>matchCard(m,i+100)).join('')}</div>`:'<p class="cinfo">Bu tarife uyan ürün yok; bir özelliği kaldırmayı dene.</p>';
}
async function askAI(){
  const ai=await aiInit(); if(!ai||!PH.file||PH.busy) return;
  const ctl=new AbortController(); PH.busy=ctl; PH.result=null; renderOut(); const askBtn=document.getElementById('phAsk'); if(askBtn) askBtn.disabled=true;
  try{
    const img=await shrink(PH.file);
    const r=await ai.sample.json(prompt(),{images:[img],signal:ctl.signal,modelTier:'default'});
    const ms=(Array.isArray(r&&r.eslesmeler)?r.eslesmeler:[]).map(cleanMatch).filter(Boolean).slice(0,3);
    PH.result={gorulen:String(r&&r.gorulen||'').slice(0,600),olcu_notu:String(r&&r.olcu_notu||'').slice(0,300),matches:ms};
  }catch(e){
    const msg={cancelled:null,not_granted:'Claude kullanımına izin verilmedi. Aşağıdan tarif ederek arayabilirsin.',sampling_disabled:'Bu hesapta Claude kullanılamıyor.',images_unavailable:'Bu görünümde fotoğraf gönderilemiyor.',
      image_rejected:'Fotoğraf kabul edilmedi; başka bir JPEG ya da PNG dene.',rate_limited:'Kısa sürede çok istek yapıldı; biraz sonra tekrar dene.',invalid_json:'Yanıt okunamadı; tekrar denemek için yeniden bas.',refused:'Bu fotoğraf için yanıt verilmedi; başka bir fotoğraf dene.',session_expired:'Oturumun sona ermiş; Claude\'a yeniden giriş yap.'}[e&&e.code];
    PH.result=msg===null?null:{err:msg||'Bir bağlantı sorunu oldu; tekrar dene.'};
    if(e&&(e.code==='not_granted'||e.code==='sampling_disabled'||e.code==='images_unavailable')) AIREADY=false;
  }finally{PH.busy=null;}
  renderOut(); const b=document.getElementById('phAsk'); if(b) b.disabled=false;
  if(AIREADY===false){const box=document.getElementById('aiBox');if(box)box.innerHTML='<p class="cinfo">Fotoğraftan otomatik tanıma bu görünümde kullanılamıyor. Aşağıdan tarif ederek arayabilirsin.</p>';}
}
async function shrink(file){
  try{const bmp=await createImageBitmap(file);const k=Math.min(1,1600/Math.max(bmp.width,bmp.height));const c=document.createElement('canvas');
    c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    return await new Promise(res=>c.toBlob(b=>res(b||file),'image/jpeg',.86));}catch(e){return file;}
}

/* ---------- olaylar ---------- */
document.addEventListener('change',e=>{if(e.target.id!=='phFile')return;const f=e.target.files&&e.target.files[0];if(!f)return;
  if(PH.url)URL.revokeObjectURL(PH.url);PH.file=f;PH.url=URL.createObjectURL(f);PH.result=null;viewPhoto();});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.pdim){PH.manual[t.dataset.pdim]=t.value;}});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||location.hash!=='#fotograf')return;
  if(t.id==='phClear'){if(PH.url)URL.revokeObjectURL(PH.url);PH.file=null;PH.url='';PH.result=null;viewPhoto();return;}
  if(t.id==='phAsk'){askAI();return;}
  if(t.id==='phStop'){PH.busy&&PH.busy.abort();return;}
  if(t.dataset.ptype){PH.manual.type=PH.manual.type===t.dataset.ptype?'':t.dataset.ptype;PH.manualRes=null;renderOut();return;}
  if(t.dataset.pfeat){const f=PH.manual.feat,k=t.dataset.pfeat;PH.manual.feat=f.includes(k)?f.filter(x=>x!==k):[...f,k];PH.manualRes=null;renderOut();return;}
  if(t.id==='phManual'){PH.manualRes=manualMatches();renderOut();document.getElementById('manOut').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(t.dataset.open!=null){const i=+t.dataset.open, mt=i>=100?PH.manualRes[i-100]:PH.result.matches[i];if(mt)openMatch(mt);}
});
document.addEventListener('dragover',e=>{if(e.target.closest&&e.target.closest('#drop'))e.preventDefault();});
document.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('#drop');if(!d)return;e.preventDefault();const f=[...(e.dataTransfer.files||[])].find(x=>/^image\//.test(x.type));
  if(f){if(PH.url)URL.revokeObjectURL(PH.url);PH.file=f;PH.url=URL.createObjectURL(f);PH.result=null;viewPhoto();}});
