"use strict";
/* Talaş: eğik ve yuvarlak parçalı ürünler.
   Parçalar iki kesit halkası arasında örülür (bkz. solid()); sınır kutusu derinlik sıralaması ve ölçüler için hesaplanır. */

/* ---------- vektör ve şekil yardımcıları ---------- */
const v3={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],
  dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
  norm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];},len:a=>Math.hypot(a[0],a[1],a[2]),
  lerp:(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]};
function PART(parts,g,name,mat,rings,o={}){
  const all=rings.flat(), mn=[0,1,2].map(k=>Math.min(...all.map(v=>v[k]))), mx=[0,1,2].map(k=>Math.max(...all.map(v=>v[k])));
  const p=Object.assign({g,name,mat,rings,x:mn[0],y:mn[1],z:mn[2],sx:mx[0]-mn[0],sy:mx[1]-mn[1],sz:mx[2]-mn[2]},o);
  parts.push(p);return p;}
function BOX(parts,g,name,mat,x,y,z,sx,sy,sz,o={}){const p=Object.assign({g,name,mat,x,y,z,sx,sy,sz},o);parts.push(p);return p;}
/* Dikdörtgen kesitli kereste p0→p1; t kalınlığı "hint" yönüne bakar. */
function barRings(p0,p1,w,t,hint){const d=v3.norm(v3.sub(p1,p0));const v=v3.norm(v3.sub(hint,v3.mul(d,v3.dot(hint,d))));const u=v3.cross(d,v);
  const ring=P=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>v3.add(v3.add(P,v3.mul(u,a*w/2)),v3.mul(v,b*t/2)));return[ring(p0),ring(p1)];}
/* Yuvarlak (gerekirse konik) kesitli parça p0→p1. */
function cylRings(p0,p1,r0,r1,n=18){const d=v3.norm(v3.sub(p1,p0));const h=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];const u=v3.norm(v3.cross(d,h)),v=v3.cross(d,u);
  const ring=(P,r)=>Array.from({length:n},(_,i)=>{const a=i/n*2*Math.PI;return v3.add(v3.add(P,v3.mul(u,Math.cos(a)*r)),v3.mul(v,Math.sin(a)*r));});return[ring(p0,r0),ring(p1,r1)];}
/* Eksen boyunca uzatılmış çokgen: y → (x,z) · z → (x,y) · x → (z,y) */
function prism(ax,poly,a0,len){const m={y:(p,h)=>[p[0],h,p[1]],z:(p,h)=>[p[0],p[1],h],x:(p,h)=>[h,p[1],p[0]]}[ax];return[poly.map(p=>m(p,a0)),poly.map(p=>m(p,a0+len))];}
function circlePoly(cx,cy,r,n=48){return Array.from({length:n},(_,i)=>{const a=i/n*2*Math.PI;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});}
function clipBand(poly,k,lo,hi){
  const at=(a,b,v)=>{const t=(v-a[k])/(b[k]-a[k]);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];};
  const cl=(P,keep,lim)=>{const out=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],ia=keep(a),ib=keep(b);if(ia)out.push(a);if(ia!==ib)out.push(at(a,b,lim));}return out;};
  return cl(cl(poly,p=>p[k]>=lo,lo),p=>p[k]<=hi,hi);}
const deg=a=>a*Math.PI/180;

/* Daire tabla: kontrplaktan tek parça ya da tutkallı şeritlerden (her şerit daire ile kırpılır). */
function roundTop(parts,{cx,cz,R:r,y,t,mode,sp,pat,strip,ax='y',g='top',name}){
  if(mode==='ply'){PART(parts,g,name||'Yuvarlak tabla',t===12?'ply12':'ply18',prism(ax,circlePoly(cx,cz,r,56),y,t),{smooth:true,cut:[R(2*r),R(2*r),t],cutNote:`Ø${R(2*r)} daire kesilir`});return 1;}
  strip=strip||95; const n=Math.ceil(2*r/strip), w=2*r/n, circ=circlePoly(cx,cz,r,72), k=ax==='y'?1:0;
  for(let i=0;i<n;i++){const lo=(k?cz:cx)-r+i*w, poly=clipBand(circ,k,lo,lo+w);
    const ext=Math.max(...poly.map(q=>q[1-k]))-Math.min(...poly.map(q=>q[1-k])), s=pat?pat[i%pat.length]:sp;
    PART(parts,pat?'st_'+s:g,pat?SP[s].n+' şerit':(name||'Tabla tahtası'),LM(s,pat?30:t,pat?40:95),prism(ax,poly,y,t),{smooth:true,cut:[Math.ceil(ext/10)*10+20,R(w),pat?30:t],cutNote:'daire hattı tutkaldan sonra kesilir'});}
  return n;
}

/* ======================================================================
   A) YUVARLAK MASA / SEHPA / TABURE
   ====================================================================== */
function roundTable(p,o){
  const parts=[], D=p.D, H=p.H, r=D/2, sp=o.sp||'mese', cx=r, cz=r, tT=o.topPly?18:20, lt=H-tT, a=o.splay||0;
  const nTop=roundTop(parts,{cx,cz,R:r,y:lt,t:tT,mode:o.topPly?'ply':'boards',sp});
  const n=o.legs||4, lk=LM(o.legSp||sp,45,45), legs=[]; let s=0,lw=0;
  if(!a){lw=o.leg||45; const lkk=LM(sp,lw,lw); s=R(Math.min(D*.62,D-120)); const x0=cx-s/2,x1=cx+s/2, ah=o.apron||70, ak=LM(sp,20,ah), ay=lt-ah, sx=s-2*lw;
    for(const x of [x0,x1-lw]) for(const z of [x0,x1-lw]) BOX(parts,'leg','Ayak',lkk,x,0,z,lw,lt,lw);
    BOX(parts,'apS','Kayıt',ak,x0+5,ay,x0+lw,20,ah,sx);BOX(parts,'apS','Kayıt',ak,x1-25,ay,x0+lw,20,ah,sx);
    BOX(parts,'apL','Kayıt (ön/arka)',ak,x0+lw,ay,x0+5,sx,ah,20);BOX(parts,'apL','Kayıt (ön/arka)',ak,x0+lw,ay,x1-25,sx,ah,20);}
  else{const rt=r*(n===3?.52:.58), th0=n===3?Math.PI/2:Math.PI/4, ta=Math.tan(deg(a)), L=Math.hypot(lt,lt*ta);
    for(let i=0;i<n;i++){const th=th0+i*2*Math.PI/n, c=Math.cos(th), sn=Math.sin(th), rb=rt+lt*ta;
      const T=[cx+rt*c,lt,cz+rt*sn], B=[cx+rb*c,0,cz+rb*sn]; legs.push({T,B});
      PART(parts,'leg','Konik ayak',lk,cylRings(B,T,o.r0||12,o.r1||19,16),{smooth:true,cut:[R(L+15),45,45],cutNote:`konik, uçlar ${a}° açılı`});}
    if(!o.topPly) for(const z of [cz-r*.16-22,cz+r*.16-22]) BOX(parts,'cleat','Tabla altı çıtası',LM(sp,20,45),cx-r*.72,lt-20,z,r*1.44,20,45);
    if(o.rung){const hr=lt*(o.rungH||.32), pts=legs.map(({T,B})=>v3.lerp(B,T,hr/lt));
      for(let i=0;i<n;i++){const A=pts[i],B2=pts[(i+1)%n],d=v3.norm(v3.sub(B2,A)),A2=v3.add(A,v3.mul(d,14)),B3=v3.sub(B2,v3.mul(d,14));
        PART(parts,'rung','Ayak dayama çubuğu','kav20',cylRings(A2,B3,10,10,12),{smooth:true,cut:[R(v3.len(v3.sub(B3,A2))+24),20,20],cutNote:'uçlar 12 mm yuvaya girer'});}}}
  const hw=[];
  if(a) hw.push([`Açılı ayak montaj plakası (${a}°)`,n+' adet','vidasıyla'],['Sunta vidası 4×16',n*4+' adet','plakalar']);
  else hw.push(['Cep vidası 32 mm','1 kutu','16 tane gerekiyor'],['8 şekilli tabla bağlantısı','8 adet','3,5×16 vidasıyla']);
  if(!o.topPly&&a) hw.push(['Sunta vidası 4×30',nTop*2+' adet','tabla altı çıtaları']);
  if(o.topPly) hw.push(['Ütüyle yapışan kenar bandı (esnek)',Math.ceil(Math.PI*D/1000*1.15)+' m','daire kenarı']);
  if(o.rung) hw.push(['Ahşap tutkalı','1 şişe','çubuk yuvaları']);
  hw.push(['Ahşap tutkalı (D3)','1 şişe',''],o.outdoor?['Dış mekân ahşap yağı','0,5 L','']:['Su bazlı vernik veya sert yağ','0,5 L',''],['Keçe ayak',n+' adet','']);
  const c={parts,hw,join:a?'Açılı ayak plakası':'Cep vidası',
    notes:[a?{t:'tip',x:`Ayaklar ${a}° dışa açılır; tabanda ayak uçları merkeze ${R(r*(n===3?.52:.58)+lt*Math.tan(deg(a)))} mm uzaklıkta. Konik ayakları torna yoksa hazır alabilirsin.`}:null,
      n===3?{t:'tip',x:'Üç ayak her zeminde sallanmadan durur; ama kenara yüklenince dört ayaktan kolay devrilir, ağır kullanımda dört ayak seç.'}:null]};
  c.tools=stdTools(['gonyeT','dekupaj','pergel','metre','gonye','kalem','matkap',a?'aciOlcer':'kreg',!o.topPly?['isk',Math.max(3,Math.ceil(D/300))+' adet, en az '+(D+100)+' mm']:null,o.rung?'forstnerSet':null,o.topPly?'utu':null,'zimMak','zimKag','firca',['freze','kenar yuvarlatma, isteğe bağlı']]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K),tip:o.topPly?'Kontrplağı önce kare parça olarak kes; daireyi bir sonraki adımda çizeceğiz.':'Tabla tahtalarının boyları dairenin o şeritteki genişliğine göre değişir; her şeridi listedeki boyda kes.'});
    S.push(o.topPly?{t:'Daireyi çiz ve kes',tools:['pergel','dekupaj','zimMak'],x:`<p>Kare parçanın merkezini köşegenlerle bul. Bir çivi, ip ve kalemle <b class="mono">${R(r)} mm</b> yarıçaplı daireyi çiz. Dekupajla çizginin 2 mm dışından kes, sonra çizgiye kadar zımparala.</p>`,tip:'Frezen varsa merkeze çivilenen bir kol (daire şablonu) ile kesim kusursuz yuvarlak olur.'}
      :{t:'Tablayı tutkalla, daireyi kes',add:['top'],tools:['isk','pergel','dekupaj','zimMak'],x:`<p>${nTop} ${K('top')} tahtayı ortası en uzun olacak şekilde sırayla diz, kenarlarından tutkallayıp işkencele ve 24 saat beklet. Düzle. Merkezi işaretle, <b class="mono">${R(r)} mm</b> yarıçaplı daireyi çiz, dekupajla 2 mm dışından kes ve zımparayla çizgiye getir.</p>`});
    if(a){
      if(has(c,'cleat')) S.push({t:'Tabla altı çıtalarını tak',add:['cleat'],tools:['matkap'],x:`<p>Tablayı ters çevir. ${K('cleat')} çıtaları damara dik, merkezden ${R(r*.16)} mm uzaklıkta vidala. Vida deliklerini oval aç ki tabla mevsimle çalışabilsin.</p>`});
      S.push({t:'Açılı ayakları tak',add:['leg'],tools:['matkap','aciOlcer','metre'],x:`<p>Tablanın alt yüzünde merkezden <b class="mono">${R(r*(n===3?.52:.58))} mm</b> yarıçaplı bir daire çiz ve ${n} ayak yerini eşit açıyla işaretle (${n===3?'120°':'90°'} arayla). ${a}° montaj plakalarını eğim yönü merkezden dışa bakacak şekilde vidala, ${K('leg')} ayakları çevirerek tak.</p>`,tip:'Plakaları vidalamadan önce bir ayağı takıp yönünü dene; ters takılan plaka ayağı içe yatırır.'});
      if(o.rung) S.push({t:'Ayak dayama çubuklarını tak',add:['rung'],tools:['forstnerSet','matkap','aciOlcer'],x:`<p>Ayakları takılıyken yerden <b class="mono">${R(lt*(o.rungH||.32))} mm</b> yükseklikte, komşu ayaklara bakan yüzlere işaret koy. Ayakları sökerek 20 mm Forstner uçla 12 mm derinlikte yuva aç; matkabı komşu ayağa doğru tut. ${K('rung')} çubukları tutkalla yuvalara yerleştirip ayakları geri tak.</p>`,warn:'Çubukların hepsini aynı anda tak; tek tek takarsan son çubuk yerine girmez.'});}
    else{
      S.push({t:'Ayak çerçevesini kur',add:['leg','apS','apL'],tools:['kreg','isk','gonye'],x:`<p>${Ks(c,K,'apS','apL')} kayıtların uçlarına iç yüzden 2'şer cep deliği aç. Ayakları kare bir çerçeve olacak şekilde (dıştan dışa <b class="mono">${s} mm</b>) kayıtlarla birleştir; kayıtlar ayak dış yüzünden 5 mm içeride dursun. Çaprazları eşitle.</p>`});
      S.push({t:'Tablayı bağla',tools:['matkap','metre'],x:`<p>Tablayı ters çevir, çerçeveyi tam ortaya koy (her köşeden dairenin kenarına eşit mesafe). 8 şekilli bağlantılarla sabitle.</p>`});}
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   B) AÇILI AYAKLI DİKDÖRTGEN SEHPA / BANK
   ====================================================================== */
function splayRect(p,o){
  const parts=[], L=p.L, W=p.W, H=p.H, sp=o.sp||'mese', a=o.splay||8, tp=o.topProf||[20,95], tT=o.topPly?18:tp[0], lt=H-tT, ta=Math.tan(deg(a));
  let n=1,w=W;
  if(o.topPly) BOX(parts,'top','Tabla','ply18',0,lt,0,L,18,W);
  else{const tk=LM(sp,tp[0],tp[1]);n=Math.ceil(W/tp[1]);w=W/n;for(let i=0;i<n;i++)BOX(parts,'top','Tabla tahtası',tk,0,lt,i*w,L,tp[0],w);
    const insX=Math.max(70,R(L*.12));for(const x of [insX+35,L-insX-80]) BOX(parts,'cleat','Tabla altı çıtası',LM(sp,20,45),x,lt-20,W*.08,45,20,W*.84);}
  const ix=Math.max(60,R(L*.12)), iz=Math.max(50,R(W*.18)), d=lt*ta/Math.SQRT2, lk=LM(o.legSp||sp,45,45), Lg=Math.hypot(lt,lt*ta);
  for(const [x,sx] of [[ix,-1],[L-ix,1]]) for(const [z,sz] of [[iz,-1],[W-iz,1]])
    PART(parts,'leg','Konik ayak',lk,cylRings([x+sx*d,0,z+sz*d],[x,lt,z],12,19,16),{smooth:true,cut:[R(Lg+15),45,45],cutNote:`konik, uçlar ${a}° açılı`});
  const hw=[[`Açılı ayak montaj plakası (${a}°)`,'4 adet','vidasıyla'],['Sunta vidası 4×16','16 adet','plakalar']];
  if(!o.topPly) hw.push(['Sunta vidası 4×40',n*4+' adet','tabla altı çıtaları']); else hw.push(['Ütüyle yapışan kenar bandı',Math.ceil((L+W)*2/1000*1.1)+' m','']);
  hw.push(['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik veya sert yağ','0,5 L',''],['Keçe ayak','4 adet','']);
  const c={parts,hw,join:'Açılı ayak plakası',notes:[{t:'tip',x:`Ayaklar köşegen yönünde ${a}° dışa açılır. Konik ayakları hazır alabilir ya da 45×45 kayından tornalatabilirsin.`},
    L>1300&&!o.topPly?{t:'warn',x:'Uzun masif tablada çıtalar arası açıklık büyür; ortaya üçüncü bir çıta eklemeyi düşün.'}:null]};
  c.tools=stdTools(['gonyeT',o.topPly?'daire':['daire','tahtaları boyuna kesmek için'],'metre','gonye','kalem','matkap','aciOlcer',!o.topPly?['isk',Math.max(3,Math.ceil(L/400))+' adet, en az '+(W+100)+' mm']:null,o.topPly?'utu':null,'zimMak','zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)});
    S.push(o.topPly?{t:'Tablayı hazırla',add:['top'],tools:['utu','zimKag'],x:`<p>${K('top')} tablanın kenarlarına bant çek, köşeleri 20 mm yarıçapla yuvarlat.</p>`}
      :{t:'Tablayı tutkalla',add:['top'],tools:['isk','zimMak'],x:`<p>${n} ${K('top')} tahtayı kenarlarından tutkallayıp işkencele, 24 saat beklet ve düzle.</p>`});
    if(has(c,'cleat')) S.push({t:'Tabla altı çıtaları',add:['cleat'],tools:['matkap'],x:`<p>Tablayı ters çevir. ${K('cleat')} çıtaları damara dik olarak, uçlardan ${R(L*.12)+35} mm içeride oval delikli vidalarla tak. Ayak plakaları bu çıtalara gelecek.</p>`});
    S.push({t:'Açılı ayakları tak',add:['leg'],tools:['matkap','aciOlcer','metre'],x:`<p>Ayak merkezlerini uçlardan <b class="mono">${ix} mm</b>, kenarlardan <b class="mono">${iz} mm</b> içeride işaretle. ${a}° plakaları eğim köşeye bakacak şekilde vidala, ${K('leg')} ayakları çevirerek tak. Masayı ters çevirip sallanmıyor mu dene.</p>`,tip:'Bir ayak kısa kalırsa ucuna keçe koymak yerine diğer üç ayağı 1-2 mm zımparayla eşitle.'});
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   C) DUVARA YASLI MERDİVEN RAF
   ====================================================================== */
function leanShelf(p,o){
  const parts=[], H=p.H, W=p.W, N=p.N, Db=p.D, sp=o.sp||'cam', rk=LM(sp,20,45), zt=67, zb=Db-22, ang=Math.atan((zb-zt)/H)*180/Math.PI;
  for(const x of [0,W-20]){BOX(parts,'back','Arka dikme',rk,x,0,0,20,H,45);
    PART(parts,'front','Ön dikme (eğik)',rk,barRings([x+10,0,zb],[x+10,H,zt],45,20,[1,0,0]),{cut:[R(Math.hypot(H,zb-zt)+20),45,20],cutNote:`uçlar ${ang.toFixed(0)}° açılı`});}
  const ys=spread(N,120,H-220,20), zc=y=>zb+(zt-zb)*(y/H), deps=[];
  ys.forEach(y=>{const dp=R(zc(y+20)+20);deps.push(dp);BOX(parts,'shelf','Raf',dp<=190?LM(sp,20,190):(o.outdoor?LM(sp,20,190):'ply18'),20,y,0,W-40,20,Math.min(dp,o.outdoor?190:dp));});
  const hw=[['Sunta vidası 4×40',N*4+8+' adet',''],['Ahşap tutkalı'+(o.outdoor?' (D3)':''),'1 şişe',''],['Devrilme önleyici duvar bağlantısı','1 set','üst uçtan duvara'],
    o.outdoor?['Dış mekân ahşap yağı','0,5 L','']:['Su bazlı vernik veya yağ','0,5 L',''],['Kaydırmaz keçe','4 adet','alt uçlar']];
  const c={parts,hw,join:'Vida + tutkal',notes:[{t:'tip',x:`Ön dikme ${ang.toFixed(1)}° eğik; raflar aşağıdan yukarı ${deps[0]} mm'den ${deps[deps.length-1]} mm'ye daralır.`},{t:'warn',x:'Duvara yaslı raf üst uçtan duvara bağlanmazsa öne kayabilir.'}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','havsa',['isk','2 adet'],'terazi','zimKag','firca',deps.some(d=>d>190)&&!o.outdoor?'daire':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','aciOlcer','metre'],x:`${cutUL(c,K)}<p>${K('front')} ön dikmelerin iki ucunu da gönye makinesi <b class="mono">${ang.toFixed(1)}°</b>'ye ayarlıyken paralel kes; dikme yere ve duvara tam basar.</p>`});
    S.push({t:'Yan çerçeveleri kur',add:['back','front'],tools:['matkap','isk'],x:`<p>${K('back')} arka dikmeyi yere yatır. ${K('front')} ön dikmeyi üst uçta arka dikmenin önüne yasla, altta aralarındaki mesafe <b class="mono">${Db} mm</b> olsun. Üst birleşimi tutkal ve 2 vidayla bağla. İkinci yan çerçeveyi ayna simetrisiyle yap.</p>`,tip:`Alt uçlara ${Db} mm'lik geçici bir çıta vidalarsan raflar takılana kadar ölçü kaçmaz.`});
    S.push({t:'Rafları tak',add:['shelf'],tools:['matkap','metre','terazi'],x:`<p>Raflar alttan yukarı:</p><ul>${ys.map((y,i)=>`<li>Raf ${i+1}: yerden <b class="mono">${R(y)} mm</b>, derinlik <b class="mono">${deps[i]} mm</b></li>`).join('')}</ul><p>${K('shelf')} rafları iki yan çerçevenin arasına koy, arka ve ön dikmeden 1'er vidayla bağla. Su terazisiyle kontrol et.</p>`});
    S.push(finishStep(o));
    S.push({t:'Duvara yasla ve sabitle',tools:['matkap','terazi'],x:'<p>Rafı duvara yasla; alt uçlara kaydırmaz keçe yapıştır. Arka dikmenin üst ucunu devrilme önleyici aparatla duvara bağla.</p>'});
    return S;};
  return c;
}

/* ======================================================================
   D) ŞÖVALE
   ====================================================================== */
function easel(p,o){
  const parts=[], H=p.H, W=p.W, sp=o.sp||'cam', k=LM(sp,20,45), Db=R(H*.38), hL=R(H*(o.table?.18:.36)), small=!!o.table;
  const FL=[[22,0,10],[W/2-24,H,10]], FR=[[W-22,0,10],[W/2+24,H,10]];
  for(const [b,t] of [FL,FR]) PART(parts,'leg','Ön ayak',k,barRings(b,t,45,20,[0,0,1]),{cut:[R(v3.len(v3.sub(t,b))+20),45,20],cutNote:`uçlar ${(Math.atan((W/2-46)/H)*180/Math.PI).toFixed(0)}° açılı`});
  BOX(parts,'head','Baş takozu',k,W/2-50,H-50,20,100,45,20,{cut:[100,45,20]});
  const xAt=y=>22+(W/2-46)*(y/H);
  BOX(parts,'ledge','Tuval rafı',LM(sp,20,70),xAt(hL)-30,hL,20,W-2*xAt(hL)+60,20,70);
  BOX(parts,'lip','Raf dudağı',LM(sp,20,45),xAt(hL)-30,hL+20,70,W-2*xAt(hL)+60,25,20,{cut:[R(W-2*xAt(hL)+60),45,20]});
  const yb=R(H*.25); BOX(parts,'brace','Ara kayıt',k,xAt(yb)-10,yb,-20,W-2*xAt(yb)+20,45,20);
  PART(parts,'rear','Arka ayak',k,barRings([W/2,0,-Db],[W/2,H-90,-10],45,20,[1,0,0]),{cut:[R(Math.hypot(H-90,Db)+20),45,20],cutNote:'üst uç menteşelenir'});
  const hw=[['Menteşe 50 mm','1 adet','arka ayak'],['Sunta vidası 4×40','10 adet',''],['Zincir veya kayış','1 adet','arka ayağın açılmasını sınırlar'],['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik','250 ml','']];
  const c={parts,hw,join:'Vida + tutkal + menteşe',notes:[{t:'tip',x:`Tuval rafı yerden ${hL} mm yükseklikte. ${small?'Masa şövalesi':'Ayaklı şövale'} ${R(H/10)} cm yükseklikte.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','havsa',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)});
    S.push({t:'Ön ayakları birleştir',add:['leg','head'],tools:['matkap','isk','metre'],x:`<p>${K('leg')} iki ön ayağı tabanda <b class="mono">${W} mm</b> açıklıkla, üstte birbirine 48 mm kalacak şekilde masaya yatır. ${K('head')} baş takozunu üst uçların önüne tutkal ve 4 vidayla bağla.</p>`});
    S.push({t:'Ara kayıt ve tuval rafı',add:['brace','ledge','lip'],tools:['matkap','metre'],x:`<p>${K('brace')} ara kaydı yerden ${yb} mm yükseklikte arkaya, ${K('ledge')} tuval rafını yerden <b class="mono">${hL} mm</b> yükseklikte öne vidala. ${K('lip')} dudağı rafın ön kenarına tutkal ve vidayla ekle; tuval kaymaz.</p>`,tip:'Rafı tek noktaya vidalamak yerine ayaklara sürgülü yuva açarsan yüksekliği ayarlanabilir olur.'});
    S.push({t:'Arka ayağı menteşele',add:['rear'],tools:['matkap'],x:`<p>${K('rear')} arka ayağı baş takozunun arkasına menteşeyle bağla. Şövaleyi kurup arka ayağın tabanda ön ayaklardan yaklaşık <b class="mono">${Db} mm</b> uzaklaştığı noktada ara kayda zincir bağla.</p>`});
    S.push(finishStep({}));
    return S;};
  return c;
}

/* ======================================================================
   E) ÇATILI EV (kuş evi, köpek kulübesi, sokak kitaplığı, bebek evi)
   ====================================================================== */
function gableHouse(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, kind=o.kind, th=deg(o.pitch||40), m=o.mat||'ply12', t=MAT[m].t, rh=(W/2)*Math.tan(th), ov=o.ov!=null?o.ov:R(W*.12), yb=kind==='dog'?50:0;
  const gable=[[0,yb],[W,yb],[W,yb+H],[W/2,yb+H+rh],[0,yb+H]];
  PART(parts,'gable','Arka alın (beşgen)',m,prism('z',gable,0,t),{cut:[W,R(H+rh),t],cutNote:`üst köşeler ${(90-o.pitch).toFixed(0)}° kesilir`});
  if(kind==='bird'||kind==='dog') PART(parts,'gable','Ön alın (beşgen)',m,prism('z',gable,D-t,t),{cut:[W,R(H+rh),t],cutNote:`üst köşeler ${(90-o.pitch).toFixed(0)}° kesilir`});
  if(kind==='library') PART(parts,'tri','Ön üçgen alın',m,prism('z',[[0,yb+H],[W,yb+H],[W/2,yb+H+rh]],D-t,t),{cut:[W,R(rh),t],cutNote:`iki kenar ${(90-o.pitch).toFixed(0)}° kesilir`});
  BOX(parts,'side','Yan duvar',m,0,yb,t,t,H,D-2*t);BOX(parts,'side','Yan duvar',m,W-t,yb,t,t,H,D-2*t);
  BOX(parts,'floor','Taban',m,t,yb,t,W-2*t,t,D-2*t);
  if(kind==='dog') for(const x of [t+30,W-t-100]) BOX(parts,'runner','Taban kızağı',LM('emp',45,70),x,0,0,70,50,D,{cut:[D,70,45]});
  if(kind==='library'||kind==='doll'){const ns=kind==='doll'?(o.floors||2)-1:1;spread(ns,yb+t+(H-t)/(ns+1)-t/2,yb+t+(H-t)*ns/(ns+1)+t/2,t).forEach(y=>BOX(parts,'shelf',kind==='doll'?'Ara kat':'Raf',m,t,y,t,W-2*t,t,D-2*t-(kind==='library'?6:0)));}
  if(kind==='library') BOX(parts,'door','Akrilik kapak','glass',0,yb,D,W,H,4);
  const len=(W/2)/Math.cos(th)+ov, ridge=[W/2,yb+H+rh];
  const slab=dx=>{const d=[dx*Math.cos(th),-Math.sin(th)], nv=[dx*Math.sin(th),Math.cos(th)], P0=ridge, P1=[P0[0]+d[0]*len,P0[1]+d[1]*len];
    return [P0,P1,[P1[0]+nv[0]*t,P1[1]+nv[1]*t],[P0[0]+nv[0]*t,P0[1]+nv[1]*t]];};
  const rlen=R(len+t*Math.tan(th));
  PART(parts,'roof','Çatı paneli',m,prism('z',slab(-1),-ov,D+2*ov),{cut:[D+2*ov,rlen,t],cutNote:`mahya kenarı ${o.pitch}° kesilir`});
  PART(parts,'roof','Çatı paneli',m,prism('z',slab(1),-ov,D+2*ov),{cut:[D+2*ov,rlen,t],cutNote:`mahya kenarı ${o.pitch}° kesilir`});
  if(kind==='bird') PART(parts,'hole','Giriş deliği','hole',prism('z',circlePoly(W/2,yb+H*.66,(o.hole||32)/2,28),D,1),{deco:true,smooth:true});
  if(kind==='dog'){const dw=R(W*.45),dh=R(H*.75);PART(parts,'hole','Kapı açıklığı','hole',prism('z',[[W/2-dw/2,yb+t],[W/2+dw/2,yb+t],[W/2+dw/2,yb+t+dh-dw/2],[W/2,yb+t+dh],[W/2-dw/2,yb+t+dh-dw/2]],D,1),{deco:true});}
  const big=kind==='dog'||W>350;
  const hw=[[(kind==='doll'?'Sunta':'Paslanmaz')+' vida '+(big?'4×40':'3,5×25'),'1 kutu',''],['Ahşap tutkalı'+(kind==='doll'?'':' (D3)'),'1 şişe','']];
  if(kind==='bird') hw.push(['Paslanmaz askı teli veya kancalı vida','1 takım',''],['Çatı için menteşe (temizlik)','1 adet','']);
  if(kind==='dog') hw.push(['Bitümlü shingle veya çatı membranı',Math.ceil(2*rlen*(D+2*ov)/1e6*1.2*10)/10+' m²','çatı kaplaması'],['Çatı çivisi','1 paket','']);
  if(kind==='library') hw.push([`Akrilik levha 4 mm, ${W}×${H} mm`,'1 adet','kapak'],['Menteşe 50 mm','2 adet',''],['Mıknatıslı kapak tutucu','1 adet',''],['Direk 90×90 veya duvar konsolu','1 takım','montaj']);
  if(kind==='doll') hw.push(['Su bazlı boya (çocuk oyuncağına uygun, EN 71-3)','250 ml','']);
  else hw.push(['Dış mekân yağı veya boyası (zehirsiz)','0,5 L','']);
  const c={parts,hw,join:'Vida + tutkal',notes:[{t:'tip',x:`Çatı eğimi ${o.pitch}°; mahya yüksekliği ${R(yb+H+rh)} mm.`},kind==='bird'?{t:'tip',x:`Giriş deliği Ø${o.hole||32} mm. Tünek ekleme; yırtıcıların işine yarar.`}:null,
    kind==='dog'?{t:'tip',x:'Kızaklar tabanı zeminden 50 mm kaldırır; altından hava geçer, taban çürümez.'}:null]};
  c.tools=stdTools(['daire','dekupaj','aciOlcer','metre','gonye','kalem','matkap','havsa',['koseIsk','2 adet'],'zimKag','firca',kind==='bird'?'forstnerSet':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['daire','metre'],x:cutUL(c,K)});
    S.push({t:'Alın panellerinin çatı açısını kes',tools:['aciOlcer','dekupaj','kalem'],x:`<p>${K('gable')} alın panellerinde yan kenarlardan <b class="mono">${H} mm</b> yukarıyı işaretle; tepe noktası tam ortada, tabandan <b class="mono">${R(H+rh)} mm</b>. İki çizgiyi birleştir (yataydan ${o.pitch}°) ve köşeleri kes. İki paneli üst üste koyup birlikte zımparala ki eşit olsunlar.</p>`});
    if(kind==='bird') S.push({t:'Giriş deliğini aç',tools:['forstnerSet','matkap'],x:`<p>Ön alında yerden <b class="mono">${R(H*.66)} mm</b> yükseklikte ortaya Ø${o.hole||32} mm delik aç. İç yüzü kuş tırmanabilsin diye 80 kumla pürüzlendir.</p>`});
    if(kind==='dog') S.push({t:'Kapı açıklığını kes',tools:['dekupaj','zimKag'],x:`<p>Ön alına ${R(W*.45)} mm genişlikte, ${R(H*.75)} mm yükseklikte kemerli kapı çiz. Köşelere delik açıp dekupajla kes, kenarlarını iyice yuvarlat.</p>`});
    S.push({t:'Duvarları kur',add:only(c,['gable','tri','side','floor','runner']),tools:['matkap','koseIsk'],x:`<p>${K('side')} yan duvarları ${K('floor')} tabana, alın panellerini yan duvarların uçlarına tutkal ve vidayla bağla. Çaprazları eşitle.${has(c,'runner')?` ${K('runner')} kızakları tabanın altına vidala.`:''}</p>`});
    if(has(c,'shelf')) S.push({t:kind==='doll'?'Ara katları yerleştir':'Rafı yerleştir',add:['shelf'],tools:['matkap','metre'],x:`<p>${K('shelf')} parçaları yan duvarlara içeriden tutkal ve dıştan vidayla bağla.</p>`});
    S.push({t:'Çatıyı tak',add:['roof'],tools:['aciOlcer','matkap'],x:`<p>${K('roof')} çatı panellerinin mahya kenarını ${o.pitch}° açıyla kes ki iki panel tepede birleşsin. Alın panellerinin eğik kenarlarına tutkal ve vidayla bağla; çatı önde ve arkada <b class="mono">${ov} mm</b> taşar.${kind==='bird'?' Bir paneli tutkalsız, tek menteşeyle tak; temizlik için açılsın.':''}${kind==='dog'?' Üstünü membran ya da shingle ile kapla.':''}</p>`});
    if(has(c,'door')) S.push({t:'Akrilik kapağı tak',add:['door'],tools:['matkap'],x:'<p>Akrilik levhayı ön yüze menteşelerle tak, mıknatıslı tutucu ekle. Delikleri plastik için matkap ucunu yavaş çevirerek aç.</p>'});
    S.push(finishStep(kind==='doll'?{paint:1}:{outdoor:1}));
    return S;};
  return c;
}

/* ======================================================================
   F) EĞİK SIRTLI SANDALYE / BANK
   ====================================================================== */
function recline(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, A=deg(p.BA||18), BL=o.BL||(o.indoor?420:560), sp=o.sp||'emp', lk=LM(sp,45,70), fk=LM(sp,28,95), sk=LM(sp,20,95), arms=!!o.arms, tA=Math.tan(A);
  for(const x of [22.5,W-22.5]){
    const B=[x,0,35+H*tA], T=[x,H+BL*Math.cos(A),35-BL*Math.sin(A)];
    PART(parts,'legB','Arka ayak (eğik)',lk,barRings(B,T,70,45,[1,0,0]),{cut:[R(v3.len(v3.sub(T,B))+20),70,45],cutNote:`uçlar ${p.BA||18}° açılı`});}
  BOX(parts,'legF','Ön ayak',lk,0,0,D-70,45,H-20+(arms?220:0),70);BOX(parts,'legF','Ön ayak',lk,W-45,0,D-70,45,H-20+(arms?220:0),70);
  const fy=H-115;
  BOX(parts,'sideR','Yan kasa',fk,45,fy,80,28,95,D-80);BOX(parts,'sideR','Yan kasa',fk,W-73,fy,80,28,95,D-80);
  BOX(parts,'fbR','Ön/arka kasa',fk,73,fy,D-28,W-146,95,28);BOX(parts,'fbR','Ön/arka kasa',fk,73,fy,80,W-146,95,28);
  if(W>1300) BOX(parts,'midR','Orta kasa',fk,W/2-14,fy,108,28,95,D-136);
  const sx0=arms?45:0, sx1=arms?W-45:W, ns=Math.max(2,Math.floor((D-90+8)/103));
  spread(ns,90,D,95).forEach(z=>BOX(parts,'seatS','Oturma çıtası',sk,sx0,H-20,z,sx1-sx0,20,95));
  const dir=[0,Math.cos(A),-Math.sin(A)], nf=[0,Math.sin(A),Math.cos(A)], nb=Math.max(2,Math.floor((BL-120+10)/105)), J=[0,H,35];
  spread(nb,90,BL-20,95).forEach(s0=>{const C=v3.add(v3.add(J,v3.mul(dir,s0+47.5)),v3.mul(nf,35+10));
    const pts=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const P=v3.add(v3.add(C,v3.mul(dir,a*47.5)),v3.mul(nf,b*10));return[P[2],P[1]];});
    PART(parts,'backS','Sırt çıtası',sk,prism('x',pts,0,W),{cut:[W,95,20]});});
  if(arms) for(const x of [-25,W-70]) BOX(parts,'arm','Kolçak',fk,x,H-20+220,110,95,28,D-90,{cut:[D-90,95,28]});
  const ind=!!o.indoor;
  const hw=ind?[['Sunta vidası 4×50','1 kutu',(ns+nb)*4+' tane gerekiyor'],['Mobilya cıvatası M8×100 + gömme somun','8 takım','ayak-kasa'],['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik veya sert yağ','0,5 L',''],['Keçe ayak','4 adet','']]
    :[['Paslanmaz vida 4×50','1 kutu',(ns+nb)*4+(arms?8:0)+' tane gerekiyor'],['Galvaniz cıvata M8×110 + somun + pul','8 takım','ayak-kasa'],['Ahşap tutkalı (D3)','1 şişe',''],['Dış mekân ahşap yağı','1 L',''],['Plastik ayak pabucu','4 adet','']];
  const c={parts,hw,join:ind?'Cıvata + vida':'Cıvata + paslanmaz vida',notes:[{t:'tip',x:`Sırt ${p.BA||18}° geriye yatık; ${nb} sırt çıtası, ${ns} oturma çıtası.`},W>1600?{t:'warn',x:'1600 mm üstü bankta oturma çıtaları ortada esneyebilir; 28 mm çıta kullan.'}:null]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:`${cutUL(c,K)}<p>${K('legB')} arka ayakların iki ucunu da <b class="mono">${p.BA||18}°</b> açıyla paralel kes; ayak yere düz basar.</p>`});
    S.push({t:'Yan çerçeveleri kur',add:['legB','legF','sideR'],tools:['matkap','isk','aciOlcer'],x:`<p>Bir ${K('legB')} arka ve bir ${K('legF')} ön ayağı yere yatır; arka ayağın tabanı ön ayaktan <b class="mono">${R(D-70-(35+H*tA))} mm</b> geride olsun. ${K('sideR')} yan kasayı iki ayağın iç yüzüne, üst kenarı yerden <b class="mono">${H-20} mm</b> olacak şekilde işkencele ve her ayağa 2 adet M8 cıvatayla bağla. İkinci çerçeveyi ayna simetrisiyle yap.</p>`});
    S.push({t:'Çerçeveleri birleştir',add:only(c,['fbR','midR']),tools:['matkap','metre'],x:`<p>${K('fbR')} ön ve arka kasaları yan kasaların arasına tutkal ve vidayla bağla${has(c,'midR')?`; ${K('midR')} orta kasayı ortaya ekle`:''}. Çaprazları eşitle.</p>`});
    S.push({t:'Oturma çıtaları',add:['seatS'],tools:['matkap','havsa'],x:`<p>${ns} ${K('seatS')} çıtayı 8 mm aralıkla diz, kasalara 2'şer ${ind?'':'paslanmaz '}vidayla bağla.</p>`});
    S.push({t:'Sırt çıtaları',add:['backS'],tools:['matkap','metre'],x:`<p>${nb} ${K('backS')} çıtayı arka ayakların ön yüzüne, oturma yüzeyinden 90 mm yukarıdan başlayıp 10 mm aralıkla vidala. Çıtalar ayaklarla birlikte geriye yatık durur.</p>`});
    if(arms) S.push({t:'Kolçaklar',add:['arm'],tools:['matkap'],x:`<p>${K('arm')} kolçakları ön ayakların üstüne ve arka ayağın yan yüzüne vidala; kenarlarını yuvarlat.</p>`});
    S.push(finishStep(ind?{}:{outdoor:1}));
    return S;};
  return c;
}

/* ======================================================================
   G) AYARLI SIRTLI ŞEZLONG
   ====================================================================== */
function lounger(p,o){
  const parts=[], W=p.W, L=p.D, sp=o.sp||'emp', A=deg(p.BA||40), fk=LM(sp,28,95), lk=LM(sp,45,70), sk=LM(sp,20,95), H=300, fy=H-20-95;
  BOX(parts,'rail','Yan kasa',fk,0,fy,0,28,95,L);BOX(parts,'rail','Yan kasa',fk,W-28,fy,0,28,95,L);
  for(const z of [40,L-110]) {BOX(parts,'leg','Ayak',lk,28,0,z,45,fy,70);BOX(parts,'leg','Ayak',lk,W-73,0,z,45,fy,70);}
  BOX(parts,'cross','Ara kasa',fk,28,fy,L/2-14,W-56,95,28);
  const hinge=R(L*.38), ns=Math.max(4,Math.floor((L-hinge+8)/103));
  spread(ns,hinge,L,95).forEach(z=>BOX(parts,'seatS','Oturma çıtası',sk,0,H-20,z,W,20,95));
  const BL=hinge-30, dir=[0,Math.sin(A),-Math.cos(A)], J=[0,H,hinge-10];
  for(const x of [38,W-66]){const T=v3.add(J,v3.mul(dir,BL));PART(parts,'bRail','Sırt kolu (eğik)',fk,barRings([x+14,J[1]-10,J[2]],[x+14,T[1]-10,T[2]],95,28,[1,0,0]),{cut:[R(BL+20),95,28],cutNote:'alt ucu cıvatayla menteşelenir'});}
  const nb=Math.max(3,Math.floor((BL+8)/103)), up=[0,Math.cos(A),Math.sin(A)];
  spread(nb,0,BL,95).forEach(s0=>{const C=v3.add(v3.add(J,v3.mul(dir,s0+47.5)),v3.mul(up,10+40));
    const pts=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const P=v3.add(v3.add(C,v3.mul(dir,a*47.5)),v3.mul(up,b*10));return[P[2],P[1]];});
    PART(parts,'backS','Sırt çıtası',sk,prism('x',pts,0,W),{cut:[W,95,20]});});
  const Tp=v3.add(J,v3.mul(dir,BL*.62));
  PART(parts,'prop','Destek ayağı',lk,barRings([W/2,fy+95,Tp[2]-160],[W/2,Tp[1]-30,Tp[2]],70,45,[1,0,0]),{cut:[R(Math.hypot(Tp[1]-30-fy-95,160)+20),70,45],cutNote:'kademeli yuvaya oturur'});
  const hw=[['Paslanmaz vida 4×50','1 kutu',(ns+nb)*4+' tane gerekiyor'],['Galvaniz cıvata M8×110 + somun','10 takım','ayaklar ve sırt menteşesi'],['Tekerlek 150 mm (isteğe bağlı)','2 adet','ayak ucuna'],['Ahşap tutkalı (D3)','1 şişe',''],['Dış mekân ahşap yağı','1 L','']];
  const c={parts,hw,join:'Cıvata + paslanmaz vida',notes:[{t:'tip',x:`Sırt ${p.BA||40}° konumda çizildi; destek ayağını farklı yuvaya koyarak 20-60° arasında ayarlanır.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','havsa','dekupaj',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT'],x:cutUL(c,K)});
    S.push({t:'Gövde çerçevesini kur',add:['rail','leg','cross'],tools:['matkap','isk','gonye'],x:`<p>${K('leg')} ayakları ${K('rail')} yan kasaların iç yüzüne M8 cıvatayla bağla, ${K('cross')} ara kasayı ortaya vidala. Çaprazları eşitle.</p>`});
    S.push({t:'Oturma çıtaları',add:['seatS'],tools:['matkap','havsa'],x:`<p>Ayak ucundan başlayarak ${ns} ${K('seatS')} çıtayı 8 mm aralıkla, ayak ucundan <b class="mono">${L-hinge} mm</b> boyunca vidala. Baş tarafında ${hinge} mm sırt bölümü kalır.</p>`});
    S.push({t:'Sırt bölümünü kur',add:['bRail','backS'],tools:['matkap','metre'],x:`<p>${K('bRail')} sırt kollarına ${nb} ${K('backS')} çıtayı vidala. Kolların alt ucunu yan kasaların içine, sırt bölümünün başlangıcında tek M8 cıvatayla bağla; cıvata menteşe görevi görür.</p>`});
    S.push({t:'Destek ayağı ve yuvalar',add:['prop'],tools:['dekupaj','matkap'],x:`<p>Ara kasanın üstüne 3-4 kademeli bir yuva tahtası vidala (her kademe 40 mm). ${K('prop')} destek ayağının üst ucunu sırt çıtalarının altına menteşele, alt ucunu kademelere oturt.</p>`,warn:'Oturmadan önce destek ayağının yuvaya tam oturduğunu kontrol et.'});
    S.push(finishStep({outdoor:1}));
    return S;};
  return c;
}

/* ======================================================================
   H) YUVARLAK TAHTALAR (kesme tahtası, saat, ayna, pano, bardak altlığı)
   ====================================================================== */
function roundBoard(p,o){
  const parts=[], D=p.D, r=D/2, kind=o.kind||'board';
  if(kind==='board'||kind==='clock'){const T=kind==='clock'?20:o.T||27, F=o.feet?8:0;
    if(kind==='clock') roundTop(parts,{cx:r,cz:r,R:r,y:0,t:T,pat:o.pat,ax:'z'});
    else roundTop(parts,{cx:r,cz:r,R:r,y:F,t:T,pat:o.pat});
    if(o.feet) for(const a of [45,135,225,315]){const x=r+r*.62*Math.cos(deg(a)),z=r+r*.62*Math.sin(deg(a));BOX(parts,'foot','Lastik ayak','rubber',x-10,0,z-10,20,F,20);}
    if(kind==='clock'){BOX(parts,'mech','Saat mekanizması','steel',r-28,r-28,-16,56,56,16);BOX(parts,'hand','Akrep ve yelkovan','steel',r-3,r-4,T,6,r*.7,2);BOX(parts,'hand','Akrep ve yelkovan','steel',r-3,r-r*.45,T+2,r*.5,6,2,{});}}
  if(kind==='mirror'||kind==='pano'){const bm=o.mat||'ply18';PART(parts,'base','Yuvarlak taban',bm,prism('z',circlePoly(r,r,r,56),0,18),{smooth:true,cut:[D,D,18],cutNote:`Ø${D} daire kesilir`});
    const ins=kind==='mirror'?{g:'pane',n:'Yuvarlak ayna',m:'glass',t:4}:{g:'pane',n:'Mantar levha',m:'cork5',t:5};
    PART(parts,ins.g,ins.n,ins.m,prism('z',circlePoly(r,r,r-(o.rim||40),56),18,ins.t),{smooth:true,cut:[D-2*(o.rim||40),D-2*(o.rim||40),ins.t],cutNote:'daire kesilir'});}
  if(kind==='coaster'){const n=6;for(let i=0;i<n;i++){const s=o.pat[i%o.pat.length],cx=r+(i%3)*(D+20),cz=r+Math.floor(i/3)*(D+20);
    PART(parts,'c_'+s,SP[s].n+' altlık',LM(s,12,D<=95?95:140),prism('y',circlePoly(cx,cz,r,40),0,12),{smooth:true,cut:[D+10,D+10,12],cutNote:`Ø${D} daire kesilir`});}}
  const hw=[];
  if(kind==='board') hw.push(['Su geçirmez ahşap tutkalı (D3)','1 şişe',''],['Gıdaya uygun mineral yağ','1 şişe',''],o.feet?['Kaydırmaz lastik ayak','4 adet','']:null);
  if(kind==='clock') hw.push(['Ahşap tutkalı','1 şişe',''],['Sessiz saat mekanizması (şaft 16 mm)','1 adet','akrep-yelkovan dahil'],['Testere dişli askı','1 adet',''],['Su bazlı vernik','100 ml','']);
  if(kind==='mirror') hw.push([`Yuvarlak ayna Ø${D-2*(o.rim||40)} mm, 4 mm`,'1 adet','camcıya kestir'],['Ayna yapıştırıcısı (nötr silikon)','1 tüp',''],['Ağır çerçeve askısı','2 adet',''],o.mat==='mdf18'?['Astar + su bazlı boya','250 ml + 250 ml','']:['Kenar bandı (esnek)',Math.ceil(Math.PI*D/1000*1.15)+' m','']);
  if(kind==='pano') hw.push(['Kontak yapıştırıcı','1 kutu','mantar için'],['Testere dişli askı','2 adet',''],['Kenar bandı (esnek)',Math.ceil(Math.PI*D/1000*1.15)+' m','']);
  if(kind==='coaster') hw.push(['Gıdaya uygun mineral yağ veya arı mumu','1 kutu',''],['Mantar altlık yapışkanı','6 adet','isteğe bağlı']);
  const c={parts,hw:hw.filter(h=>Array.isArray(h)),join:kind==='board'||kind==='clock'?'Tutkallı kenar birleştirme':'Yapıştırma',notes:[kind==='board'?{t:'tip',x:'Şeritler daireye göre farklı boyda kesilir; uçlar tutkallamadan sonra pergelle çizilen daireye göre temizlenir.'}:null]};
  c.tools=stdTools([kind==='coaster'||kind==='board'||kind==='clock'?'gonyeT':'daire','pergel','dekupaj','metre','kalem',kind==='board'||kind==='clock'?['isk','4 adet']:null,kind==='board'?'rende':null,'zimMak','zimKag','firca',['freze','kenar yuvarlatma, isteğe bağlı'],kind==='clock'||o.feet?'matkap':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)});
    if(kind==='board'||kind==='clock'){const gs=only(c,(o.pat||[]).map(s=>'st_'+s));
      S.push({t:'Şeritleri tutkalla',add:gs,tools:['isk','firca'],x:`<p>${gs.map(K).join(' ')} şeritleri ${o.pat.length>1?'desen sırasıyla ('+o.pat.map(s=>SP[s].n).join(' - ')+')':''} ortası en uzun olacak şekilde diz. İnce tutkal sür, işkenceleri alttan ve üstten sırayla tak; 24 saat beklet.</p>`});
      S.push({t:'Daireyi çiz ve kes',tools:['pergel','dekupaj','zimMak'],x:`<p>Yüzleri düzle. Merkezi işaretle ve <b class="mono">${R(r)} mm</b> yarıçaplı daireyi çiz. Dekupajla 2 mm dışından kes, zımparayla çizgiye getir. Kenarları yuvarlat.</p>`});}
    if(has(c,'foot')) S.push({t:'Ayakları tak',add:['foot'],tools:['matkap'],x:`<p>${K('foot')} lastik ayakları merkezden ${R(r*.62)} mm uzaklıkta, 90° arayla vidala.</p>`});
    if(kind==='clock') S.push({t:'Mekanizmayı tak',add:['mech','hand'],tools:['matkap','kalem'],x:'<p>Merkeze 8 mm delik aç. Arkadan mekanizma için 60×60 mm, 10 mm derinlikte cep açarsan saat duvara düz oturur (freze ya da Forstner ile). Mekanizmayı arkadan geçir, somununu sık, akrep ve yelkovanı tak.</p>'});
    if(kind==='mirror'||kind==='pano'){
      S.push({t:'Tabanı daire kes',add:['base'],tools:['pergel','dekupaj','zimMak'],x:`<p>${K('base')} tabanın merkezini bul, <b class="mono">${R(r)} mm</b> yarıçaplı daireyi çiz ve dekupajla kes. Kenarı zımparala${o.mat==='mdf18'?', astarla ve boya':', esnek kenar bandı çek'}.</p>`});
      S.push({t:kind==='mirror'?'Aynayı yapıştır':'Mantarı yapıştır',add:['pane'],tools:['metre','kalem'],x:`<p>${K('pane')} parçayı tabana ortala; her yönden <b class="mono">${o.rim||40} mm</b> kenar kalsın. ${kind==='mirror'?'Nötr silikonu nokta nokta sür (asit içeren silikon aynanın gümüşünü bozar), aynayı bastır ve 24 saat yatay beklet.':'Kontak yapıştırıcıyı iki yüze sür, 10 dakika bekle ve bastırarak yapıştır.'}</p>`});}
    if(kind==='coaster') S.push({t:'Daireleri kes ve şekillendir',tools:['pergel','dekupaj','zimMak'],x:`<p>Her kare parçaya ${R(r)} mm yarıçaplı daire çiz, dekupajla kes. Altı parçayı çift taraflı bantla üst üste yapıştırıp kenarlarını birlikte zımparalarsan hepsi aynı çıkar.</p>`});
    S.push(finishStep(kind==='board'||kind==='coaster'?{food:1}:{}));
    return S;};
  return c;
}

/* ======================================================================
   AİLELER
   ====================================================================== */
const FAMS2=[], F2=d=>FAMS2.push(d);
F2({id:'yuvarlak-yemek',name:'Yuvarlak yemek masası',cat:'Ev mobilyası',b:roundTable,level:3,time:'2 gün',tags:'masa daire yuvarlak',
  desc:'Kayıtlı düz ayaklı, masif tahtalı yuvarlak yemek masası.',P:{D:[800,1400,10],H:[720,780,5]},def:()=>({H:750}),o:{leg:70,apron:95},
  ax:[['D',[900,1000,1100,1200]],['sp',['cam','mese','kayin'],SPL]]});
F2({id:'yuvarlak-sehpa',name:'Yuvarlak orta sehpa',cat:'Ev mobilyası',b:roundTable,level:2,time:'1 gün',tags:'daire konik ayak mid century',
  desc:'Konik açılı ayaklı yuvarlak salon sehpası.',P:{D:[500,1000,10],H:[350,500,5]},def:()=>({}),o:{splay:10,legs:4},
  ax:[['D',[600,700,800,900]],['H',[400,450]],['top',['ply','boards'],{ply:'kontrplak tablalı',boards:'masif tablalı'}],['sp',['mese','ceviz'],SPL]],vo:v=>({topPly:v.top==='ply'})});
F2({id:'yuvarlak-yan-sehpa',name:'Üç ayaklı yuvarlak yan sehpa',cat:'Ev mobilyası',b:roundTable,level:2,time:'6 saat',tags:'daire konik koltuk yanı',
  desc:'Üç konik açılı ayaklı küçük yuvarlak sehpa.',P:{D:[350,600,10],H:[450,650,5]},def:()=>({}),o:{splay:8,legs:3,topPly:true},
  ax:[['D',[400,450,500,550]],['H',[500,550,600]],['sp',['mese','ceviz','kayin'],SPL]]});
F2({id:'yuvarlak-tabure',name:'Yuvarlak tabure',cat:'Ev mobilyası',b:roundTable,level:3,time:'1 gün',tags:'daire konik ayak dayamalı',
  desc:'Açılı ayaklı, ayak dayama çubuklu yuvarlak oturaklı tabure.',P:{D:[280,420,10],H:[400,800,10]},def:()=>({}),o:{splay:7,legs:4,rung:true,r0:13,r1:18},
  ax:[['D',[300,340,380]],['H',[450,600,650,750]],['sp',['kayin','mese'],SPL]]});
F2({id:'cocuk-taburesi',name:'Üç ayaklı çocuk taburesi',cat:'Çocuk',b:roundTable,level:2,time:'4 saat',tags:'mantar tabure yuvarlak',
  desc:'Çocuk boyunda, üç açılı ayaklı yuvarlak tabure.',P:{D:[220,320,10],H:[200,380,10]},def:()=>({}),o:{splay:10,legs:3,topPly:true,r0:11,r1:16},
  ax:[['D',[250,300]],['H',[250,300,350]],['sp',['kayin','akc'],SPL]]});
F2({id:'yuvarlak-cocuk-masasi',name:'Yuvarlak çocuk masası',cat:'Çocuk',b:roundTable,level:2,time:'6 saat',tags:'aktivite oyun daire',
  desc:'Köşesiz, açılı ayaklı yuvarlak çocuk masası.',P:{D:[500,900,10],H:[400,620,10]},def:()=>({}),o:{splay:6,legs:4,topPly:true},
  ax:[['D',[600,700,800]],['H',[460,520,580]],['sp',['kayin','akc'],SPL]]});
F2({id:'bistro-masasi',name:'Yuvarlak bistro masası',cat:'Bahçe ve dış mekân',b:roundTable,level:2,time:'1 gün',tags:'balkon kafe daire',
  desc:'Balkon için açılı ayaklı küçük yuvarlak masa.',P:{D:[500,900,10],H:[700,760,5]},def:()=>({H:740}),o:{splay:6,legs:4,outdoor:true},
  ax:[['D',[600,700,800]],['sp',['emp','mese'],SPL]]});
F2({id:'acili-sehpa',name:'Açılı ayaklı sehpa',cat:'Ev mobilyası',b:splayRect,level:2,time:'1 gün',tags:'mid century konik ayak',
  desc:'Konik açılı ayaklı dikdörtgen salon sehpası.',P:{L:[700,1500,10],W:[400,750,10],H:[350,500,5]},def:()=>({}),o:{splay:8},
  ax:[['L',[900,1100,1300]],['W',[500,600]],['H',[400,450]],['top',['ply','boards'],{ply:'kontrplak tablalı',boards:'masif tablalı'}],['sp',['mese','ceviz'],SPL]],vo:v=>({topPly:v.top==='ply'})});
F2({id:'acili-bank',name:'Açılı ayaklı bank',cat:'Ev mobilyası',b:splayRect,level:2,time:'1 gün',tags:'antre mid century',
  desc:'Kalın masif tablalı, açılı ayaklı bank.',P:{L:[600,1600,10],W:[280,420,10],H:[400,480,5]},def:()=>({H:450}),o:{splay:8,topProf:[28,140]},
  ax:[['L',[800,1000,1200,1400]],['W',[300,350]],['sp',['mese','cam','ceviz'],SPL]]});
F2({id:'acili-tv',name:'Açılı ayaklı TV ünitesi',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'mid century televizyon konik ayak',
  desc:'Konik açılı ayaklar üzerinde çift kapaklı alçak TV ünitesi.',P:{W:[900,2000,10],H:[400,700,10],D:[350,500,10],N:[0,2,1]},def:()=>({D:400,N:1}),o:{base:'legs',legH:180,doors:2,splay:8},
  ax:[['W',[1200,1400,1600,1800]],['H',[500,600]],['mat',ply3,MATL]]});
F2({id:'acili-komodin',name:'Açılı ayaklı komodin',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'mid century yatak başı',
  desc:'Konik açılı ayaklı, çekmeceli yatak başı komodini.',P:{W:[350,600,10],H:[450,700,10],D:[300,450,10],N:[0,1,1]},def:()=>({D:380,N:0}),o:{base:'legs',legH:180,splay:8,drawers:'fill',drawerH:150},
  ax:[['W',[400,450,500]],['H',[500,600]],['mat',ply3,MATL]]});
F2({id:'acili-sifonyer',name:'Açılı ayaklı şifonyer',cat:'Ev mobilyası',b:carcass,level:3,time:'2 gün',tags:'mid century çekmece',
  desc:'Konik açılı ayaklı, tamamı çekmeceli şifonyer.',P:{W:[600,1200,10],H:[700,1200,10],D:[400,500,10]},def:()=>({D:450}),o:{base:'legs',legH:200,splay:8,drawers:'fill',drawerH:180},
  ax:[['W',[800,1000,1200]],['H',[800,1000]],['mat',ply3,MATL]]});
F2({id:'merdiven-kitaplik',name:'Duvara yaslı merdiven kitaplık',cat:'Ev mobilyası',b:leanShelf,level:2,time:'1 gün',tags:'eğik raf merdiven raf',
  desc:'Eğik ön dikmeli, raf derinliği yukarı doğru azalan duvara yaslı kitaplık.',P:{H:[1200,2100,10],W:[400,1000,10],N:[3,6,1],D:[300,500,10]},def:()=>({D:400}),o:{},
  ax:[['H',[1500,1800,2000]],['W',[600,800]],['N',[4,5]],['sp',['cam','mese'],SPL]],nl:'raflı'});
F2({id:'saksi-merdiveni',name:'Saksı merdiveni',cat:'Bahçe ve dış mekân',b:leanShelf,level:2,time:'1 gün',tags:'balkon eğik raf çiçek',
  desc:'Balkon duvarına yaslanan, basamaklı saksı rafı.',P:{H:[800,1600,10],W:[400,1000,10],N:[2,5,1],D:[300,450,10]},def:()=>({D:380}),o:{sp:'emp',outdoor:true},
  ax:[['H',[1000,1200,1500]],['W',[600,800]],['N',[3,4]]],nl:'basamaklı'});
F2({id:'sovale',name:'Ayaklı şövale',cat:'Hobi',b:easel,level:2,time:'5 saat',tags:'resim tuval sanat eğik',
  desc:'Menteşeli arka ayaklı, tuval raflı A çerçeve şövale.',P:{H:[1300,1900,10],W:[450,700,10]},def:()=>({}),o:{},
  ax:[['H',[1500,1700,1800]],['W',[500,600]],['sp',['cam','kayin'],SPL]]});
F2({id:'masa-sovalesi',name:'Masa şövalesi',cat:'Hobi',b:easel,level:1,time:'3 saat',tags:'resim tuval masa üstü',
  desc:'Masa üstünde kullanılan küçük A çerçeve şövale.',P:{H:[350,700,10],W:[250,450,10]},def:()=>({}),o:{table:true},
  ax:[['H',[400,500,600]],['W',[300,350]],['sp',['cam','kayin'],SPL]]});
F2({id:'catili-kus-evi',name:'Çatılı kuş evi',cat:'Bahçe ve dış mekân',b:gableHouse,level:2,time:'4 saat',tags:'kuş yuvası beşik çatı hobi',
  desc:'Beşik çatılı, temizlik için açılan kuş yuvası.',P:{W:[120,220,5],D:[120,220,5],H:[150,280,5]},def:()=>({}),o:{kind:'bird',ov:25},
  ax:[['W',[130,150,170]],['D',[140,160]],['H',[180,220]],['pitch',[35,45],{35:'35° çatı',45:'45° çatı'}],['hole',[28,32],{28:'Ø28 giriş',32:'Ø32 giriş'}]]});
F2({id:'kopek-kulubesi',name:'Köpek kulübesi',cat:'Bahçe ve dış mekân',b:gableHouse,level:3,time:'2 gün',tags:'köpek evi beşik çatı',
  desc:'Kızaklı yükseltilmiş tabanlı, beşik çatılı köpek kulübesi.',P:{W:[500,1300,10],D:[600,1300,10],H:[400,900,10]},def:()=>({}),o:{kind:'dog',mat:'ply18',pitch:30,ov:80},
  ax:[['W',[600,800,1000,1200]],['D',[700,900,1100]],['H',[500,700]]]});
F2({id:'sokak-kitapligi',name:'Sokak kitaplığı',cat:'Bahçe ve dış mekân',b:gableHouse,level:2,time:'1 gün',tags:'kitap paylaşım küçük kütüphane',
  desc:'Akrilik kapaklı, beşik çatılı kitap paylaşım kutusu.',P:{W:[350,700,10],D:[250,400,10],H:[400,800,10]},def:()=>({}),o:{kind:'library',mat:'ply18',pitch:35,ov:40},
  ax:[['W',[400,500,600]],['D',[300,350]],['H',[500,600]]]});
F2({id:'bebek-evi',name:'Bebek evi',cat:'Çocuk',b:gableHouse,level:2,time:'1 gün',tags:'oyuncak ev hobi',
  desc:'Önü açık, katlı, beşik çatılı oyuncak ev.',P:{W:[350,800,10],D:[200,400,10],H:[350,900,10]},def:()=>({}),o:{kind:'doll',pitch:40,ov:15},
  ax:[['W',[400,500,600]],['D',[250,300]],['H',[500,700]],['floors',[2,3],{2:'iki katlı',3:'üç katlı'}]]});
F2({id:'egik-sandalye',name:'Eğik sırtlı bahçe sandalyesi',cat:'Bahçe ve dış mekân',b:recline,level:3,time:'1,5 gün',tags:'sandalye koltuk eğik sırt',
  desc:'Geriye yatık sırtlı, çıtalı bahçe sandalyesi.',P:{W:[450,700,10],D:[420,560,10],H:[380,460,5],BA:[10,25,1]},def:()=>({D:480,H:420}),o:{},
  ax:[['W',[500,550,600]],['BA',[15,20]],['arms',[true,false],{true:'kolçaklı',false:'kolçaksız'}],['sp',['emp','mese'],SPL]],lbl:{BA:'Sırt açısı (°)'}});
F2({id:'egik-bank',name:'Eğik sırtlı bahçe bankı',cat:'Bahçe ve dış mekân',b:recline,level:3,time:'2 gün',tags:'bank eğik sırt',
  desc:'Geriye yatık sırtlı, iki-üç kişilik bahçe bankı.',P:{W:[900,1900,10],D:[420,560,10],H:[380,460,5],BA:[10,25,1]},def:()=>({D:480,H:420}),o:{},
  ax:[['W',[1200,1500,1800]],['BA',[15,20]],['arms',[true,false],{true:'kolçaklı',false:'kolçaksız'}],['sp',['emp','mese'],SPL]],lbl:{BA:'Sırt açısı (°)'}});
F2({id:'ayarli-sezlong',name:'Ayarlı sırtlı şezlong',cat:'Bahçe ve dış mekân',b:lounger,level:3,time:'2 gün',tags:'havuz güneşlenme eğik',
  desc:'Sırt açısı kademeli ayarlanan çıtalı şezlong.',P:{W:[550,800,10],D:[1700,2100,10],BA:[20,60,1]},def:()=>({}),o:{},
  ax:[['W',[600,700]],['D',[1900,2000]],['BA',[30,45]],['sp',['emp','mese'],SPL]],lbl:{D:'Uzunluk',BA:'Sırt açısı (°)'}});
const PATS2={kayin:['kayin'],mese:['mese'],ceviz:['ceviz'],kc:['kayin','ceviz'],ac:['akc','ceviz'],mck:['mese','ceviz','kayin']};
const PATL2={kayin:'kayın',mese:'meşe',ceviz:'ceviz',kc:'kayın-ceviz çizgili',ac:'akçaağaç-ceviz çizgili',mck:'meşe-ceviz-kayın'};
F2({id:'yuvarlak-kesme',name:'Yuvarlak kesme tahtası',cat:'Mutfak ve küçük eşya',b:roundBoard,level:2,time:'4 saat + kuruma',tags:'daire tahta',
  desc:'Şeritlerden tutkallanıp daire kesilen kesme tahtası.',P:{D:[200,500,10]},def:()=>({}),o:{kind:'board',feet:true},
  ax:[['D',[250,300,350,400]],['pat',Object.keys(PATS2),PATL2]],vo:v=>({pat:PATS2[v.pat]})});
F2({id:'pizza-tahtasi',name:'Pizza tahtası',cat:'Mutfak ve küçük eşya',b:roundBoard,level:2,time:'4 saat + kuruma',tags:'sunum daire',
  desc:'İnce, yuvarlak pizza ve sunum tahtası.',P:{D:[250,450,10]},def:()=>({}),o:{kind:'board',T:18},
  ax:[['D',[300,350,400]],['pat',['kayin','kc','mck'],PATL2]],vo:v=>({pat:PATS2[v.pat]})});
F2({id:'duvar-saati',name:'Ahşap duvar saati',cat:'Hobi',b:roundBoard,level:2,time:'4 saat',tags:'saat yuvarlak',
  desc:'Şeritlerden yapılan, sessiz mekanizmalı yuvarlak duvar saati.',P:{D:[220,500,10]},def:()=>({}),o:{kind:'clock'},
  ax:[['D',[300,350,400]],['pat',['kayin','ceviz','kc','ac'],PATL2]],vo:v=>({pat:PATS2[v.pat]})});
F2({id:'yuvarlak-ayna',name:'Yuvarlak ayna',cat:'Ev mobilyası',b:roundBoard,level:1,time:'3 saat',tags:'ayna daire',
  desc:'Yuvarlak tabana yapıştırılmış, kenarı görünen ayna.',P:{D:[400,1000,10]},def:()=>({}),o:{kind:'mirror'},
  ax:[['D',[500,600,700,800]],['mat',['ply18','mdf18'],MATL]]});
F2({id:'yuvarlak-pano',name:'Yuvarlak mantar pano',cat:'Çocuk',b:roundBoard,level:1,time:'2 saat',tags:'not panosu daire',
  desc:'Kontrplak tabanlı yuvarlak mantar pano.',P:{D:[300,800,10]},def:()=>({}),o:{kind:'pano',rim:30},
  ax:[['D',[400,500,600]]]});
F2({id:'bardak-altligi',name:'Bardak altlığı seti (6 adet)',cat:'Hobi',b:roundBoard,level:1,time:'2 saat',tags:'altlık hediye daire',
  desc:'Altı parçalı yuvarlak ahşap bardak altlığı seti.',P:{D:[80,120,5]},def:()=>({}),o:{kind:'coaster'},
  ax:[['D',[90,100]],['pat',['kayin','ceviz','kc'],PATL2]],vo:v=>({pat:PATS2[v.pat]})});
FAMS2.forEach(f=>{if(f.b===roundTable||f.b===roundBoard){f.round=true;f.lbl=Object.assign({D:'Çap'},f.lbl);}});
register(FAMS2);
