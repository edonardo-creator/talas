"use strict";
/* Talaş ürün aileleri: her aile bir yapı motoru (builder) + varyant eksenleridir.
   Varyantların kartezyen çarpımı katalogdaki ürünleri üretir; her ürünün ölçüleri sonradan ayarlanabilir. */

/* ---------- ağaç türleri ve kereste profilleri ---------- */
const SP={cam:{n:'Çam',tone:'pine'},emp:{n:'Emprenye çam',tone:'emp'},mese:{n:'Meşe',tone:'oak'},kayin:{n:'Kayın',tone:'beech'},ceviz:{n:'Ceviz',tone:'walnut'},akc:{n:'Akçaağaç',tone:'maple'}};
function LM(sp,t,w){const k=sp+t+'x'+w;
  if(!MAT[k]) MAT[k]={n:`${SP[sp].n} ${t}×${w}`,type:'lumber',w,t,tone:SP[sp].tone,L:(sp==='mese'||sp==='ceviz'||sp==='akc')?2000:undefined};
  return k;}
const MATL={ply18:'huş kontrplak',mlam18:'beyaz suntalam',mdf18:'boyalı MDF',ply12:'kontrplak',ply6:'ince kontrplak'};
const SPL=Object.fromEntries(Object.entries(SP).map(([k,v])=>[k,trl(v.n)]));
const RLS=[250,300,350,400,450,500,550];

/* ---------- ortak yardımcılar ---------- */
const has=(c,g)=>c.gnum&&c.gnum[g]!=null;
const only=(c,gs)=>gs.filter(g=>has(c,g));
const Ks=(c,K,...gs)=>only(c,gs).map(K).join(' ');
function cutUL(c,K){return '<ul>'+cutRows(c).map(r=>`<li>${K(r.g)} ${esc(r.name)} ×${r.n} <b class="mono">${r.d.join(' × ')}</b>${MAT[r.mat].type==='lumber'&&r.d[1]<MAT[r.mat].w?` <span class="muted">(${MAT[r.mat].w} mm'den boyuna kes)</span>`:''}${r.note?` <span class="muted">· ${esc(r.note)}</span>`:''}</li>`).join('')+'</ul>';}
function finishStep(o,extra){
  const x=o.outdoor?'<p>Tüm yüzeyleri 120 kumla zımparala, tozunu al. Dış mekân ahşap yağını bolca sür, 15 dakika sonra fazlasını sil. 24 saat arayla en az 2 kat uygula; uç kesitlere (kesim yüzeyleri) ekstra kat sür, su en çok oradan girer.</p>'
    :o.paint?'<p>Vida başlarını ahşap macunuyla kapat, kuruyunca 180 kumla düzle. Tozunu nemli bezle al, iki kat su bazlı boya sür; katlar arasında 240 kumla hafifçe zımparala.</p>'
    :o.food?'<p>Gıdaya uygun mineral yağ ya da arı mumu karışımı sür. Vernik kullanma; bıçak izleri verniği kırar.</p>'
    :'<p>Keskin kenarları 120 kumla kır, yüzeyleri 180 kumla bitir. Tozunu al; su bazlı vernik ya da sert yağ ile 2-3 kat uygula, katlar arasında 240 kumla hafifçe zımparala.</p>';
  return {t:'Zımpara ve bitiş',tools:o.paint?['zimKag','boya']:['zimMak','zimKag','firca'],x:x+(extra||''),warn:o.outdoor?null:undefined};
}
function stdTools(list){return list.filter(Boolean).map(x=>Array.isArray(x)?x:[x]);}

/* ======================================================================
   1) GÖVDE (dolap, kitaplık, şifonyer…)  — plaka malzeme, konfirmat
   ====================================================================== */
function carcass(p,o){
  const {parts,A}=mk(); const m=o.mat||'ply18', t=18, W=p.W, H=p.H, D=p.D;
  const base=o.base||'plinth', hl=base==='legs'?(o.legH||150):0, ys=hl, yb=base==='plinth'?60:hl;
  A('side','Yan dikme',m,0,ys,0,t,H-t-ys,D);A('side','Yan dikme',m,W-t,ys,0,t,H-t-ys,D);
  A('top','Üst tabla',m,0,H-t,0,W,t,D);
  A('bottom','Alt tabla',m,t,yb,0,W-2*t,t,D);
  const y0=yb+t,y1=H-t,IW=W-2*t,marks=[['Alt tabla',yb]];
  const fill=o.drawers==='fill'; let kd=0,dhh=o.drawerH||160;
  if(fill){kd=Math.max(1,Math.round((y1-y0)/dhh));dhh=(y1-y0)/kd;}
  else if(o.drawers){kd=o.drawers;if(kd*dhh+t+150>y1-y0)kd=Math.max(0,Math.floor((y1-y0-t-150)/dhh));}
  let lowTop=y1,dz0=y0;
  if(kd&&!fill){lowTop=y1-kd*dhh-t;A('div','Ara bölme',m,t,lowTop,0,IW,t,D);marks.push(['Ara bölme',lowTop]);dz0=lowTop+t;}
  const doors=fill?0:(o.doors||0), sd=doors?D-t-3:D, mid=!fill&&IW>900&&!o.rod;
  if(mid) A('mid','Orta dikme',m,W/2-t/2,y0,0,t,lowTop-y0,sd);
  const N=fill?0:(p.N!=null?p.N:(o.shelves||0)); const gap=N?(lowTop-y0-N*t)/(N+1):0;
  for(let i=0;i<N;i++){const y=y0+gap*(i+1)+t*i;
    if(mid){A('shelf','Raf',m,t,y,0,IW/2-t/2,t,sd);A('shelf','Raf',m,W/2+t/2,y,0,IW/2-t/2,t,sd);} else A('shelf','Raf',m,t,y,0,IW,t,sd);
    if(!o.adjustable) marks.push(['Raf '+(i+1),y]);}
  const rodY=lowTop-80;
  if(o.rod) A('rod','Askı borusu','steel',t,rodY,D/2-12,IW,25,25);
  if(base==='plinth') A('kick','Baza',m,t,0,D-38,IW,yb,t);
  if(base==='legs'&&o.splay){const lk=LM(o.legSp||'kayin',45,45),ta=Math.tan(o.splay*Math.PI/180),dd=hl*ta/Math.SQRT2,L=Math.hypot(hl,hl*ta);
    for(const [x,sx] of [[45,-1],[W-45,1]])for(const [z,sz] of [[45,-1],[D-45,1]])
      PART(parts,'leg','Konik ayak',lk,cylRings([x+sx*dd,0,z+sz*dd],[x,hl,z],12,19,16),{smooth:true,cut:[R(L+15),45,45],cutNote:`konik, uçlar ${o.splay}° açılı`});}
  else if(base==='legs'){const lk=LM(o.legSp||'kayin',45,45);for(const x of [20,W-65])for(const z of [20,D-65])A('leg','Ayak',lk,x,0,z,45,hl,45);}
  if(o.back!==false) A('back','Arkalık','hdf4',0,ys,-4,W,H-ys,4);
  const RL=RLS.filter(l=>l<=D-t-20).pop()||250, bw=IW-26, bx=t+13, bz=D-t-RL, bh=Math.max(60,Math.min(dhh-40,240)), slideY=[];
  for(let j=0;j<kd;j++){const yz=dz0+j*dhh, yb2=yz+12;
    A('dfront','Çekmece kapağı',m,t+2,yz+2,D-t,IW-4,dhh-4,t);
    A('dbot','Çekmece tabanı','ply12',bx,yb2,bz,bw,12,RL);
    A('dside','Çekmece yanı','ply12',bx,yb2+12,bz,12,bh-12,RL);A('dside','Çekmece yanı','ply12',bx+bw-12,yb2+12,bz,12,bh-12,RL);
    A('dfb','Çekmece önü/arkası','ply12',bx+12,yb2+12,bz,bw-24,bh-12,12);A('dfb','Çekmece önü/arkası','ply12',bx+12,yb2+12,bz+RL-12,bw-24,bh-12,12);
    const sy=yb2+bh/2-22; slideY.push(sy);
    A('slide','Teleskopik ray','steel',t,sy,bz,13,45,RL);A('slide','Teleskopik ray','steel',W-t-13,sy,bz,13,45,RL);
    A('knob','Kulp','steel',W/2-16,yz+dhh/2-8,D,32,16,22);}
  const doorH=lowTop-y0-4, dw=doors?(IW-4-(doors-1)*3)/doors:0, hc=doorH<900?2:doorH<1600?3:4;
  for(let i=0;i<doors;i++){const x=t+2+i*(dw+3);A('door','Kapak',m,x,y0+2,D-t,dw,doorH,t);
    const kx=(doors===1||i===0)?x+dw-40:x+24, ky=base==='wall'?y0+50:(H<1000?y0+doorH-90:y0+Math.min(doorH/2,1000-y0));
    A('knob','Kulp','steel',kx,ky,D,16,64,22);}
  const per=D>350?3:2, nSh=o.adjustable?0:N*(mid?2:1);
  const conf=(2+(kd&&!fill?1:0)+nSh)*2*per+(mid?2*per:0)+(base==='plinth'?4:0);
  const band=(2*H+(2+N+(kd&&!fill?1:0))*IW+doors*2*(dw+doorH)+kd*2*(IW+dhh))/1000*1.1;
  const hw=[['Konfirmat vidası 7×50','1 kutu',conf+' tane gerekiyor']];
  if(o.adjustable&&N) hw.push(['Raf pimi 5 mm',N*4*(mid?2:1)+' adet','']);
  if(kd) hw.push(['Bilyalı teleskopik ray '+RL+' mm',kd+' çift','45 mm, tam açılım'],['Sunta vidası 4×16',kd*12+' adet','raylar için'],['Sunta vidası 3,5×30',kd*12+' adet','çekmece kutuları için'],['Sunta vidası 4×25',kd*4+' adet','çekmece kapakları için']);
  if(doors) hw.push(['Frenli kapak menteşesi 35 mm (içe oturan)',doors*hc+' adet','montaj tabanlarıyla']);
  if(kd+doors) hw.push(['Kulp',(kd+doors)+' adet','vidasıyla']);
  if(o.rod) hw.push(['Elbise askı borusu Ø25 + 2 rozet','1 takım',(IW)+' mm boy']);
  if(base==='legs') hw.push([o.splay?`Açılı ayak montaj plakası (${o.splay}°)`:'Ayak montaj plakası','4 adet','vidasıyla']);
  if(o.back!==false) hw.push(['Arkalık çivisi 1,2×25','1 paket','']);
  hw.push(m==='mdf18'?['Astar + su bazlı boya','1 L + 1 L','2 kat']:['Ütüyle yapışan kenar bandı 22 mm',Math.ceil(band)+' m','görünen kenarlar']);
  if(base==='wall') hw.push(['Ayarlı dolap askı aparatı','2 adet','duvara uygun dübel ve vidayla']);
  else if(H>900) hw.push(['Devrilme önleyici duvar bağlantısı','1 set','']);
  hw.push(['Ahşap tutkalı','1 şişe','']);
  const c={parts,hw,join:'Konfirmat'+(kd?' + teleskopik ray':'')+(doors?' + menteşe':''),
    notes:[IW/(mid?2:1)>750&&N?{t:'warn',x:`Raf açıklığı ${R(IW/(mid?2:1))} mm. 18 mm plaka 750 mm üstünde yük altında sarkar; orta dikme ekle ya da genişliği azalt.`}:null,
      N&&gap<170?{t:'warn',x:`Raf arası ${R(gap)} mm; raf sayısını azaltmayı düşün.`}:null,
      kd?{t:'warn',x:`Çekmece kutusu dış genişliği ${bw} mm olmalı (açıklık eksi 26 mm). Ray toleransı ±0,5 mm.`}:null,
      N?{t:'tip',x:`Raf arası net ${R(gap)} mm.`}:null]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','matkap','konfUc',['koseIsk','2 adet'],['isk','2 adet'],m==='mdf18'?'boya':'utu',m==='mdf18'?null:'bicak','cekic','zimKag',doors?'forstner':null,o.adjustable?'rafSab':null,(H>900||base==='wall')?'terazi':null,m==='mdf18'?'maske':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Plakaları kestir',tools:['daire','ray','metre'],x:`<p>Kesim listesini yapı markete götür; ebatlama servisi plakayı milimetrik keser${m!=='mdf18'?', istersen kenar bandını da çeker':''}.</p>${cutUL(c,K)}`});
    if(m==='mdf18') S.push({t:'Kenarları hazırla ve astarla',tools:['zimKag','boya','maske'],x:'<p>MDF kenarlarını 180 kumla hafifçe yuvarlat. Kenarlar yüzeyden çok daha fazla boya emer; önce kenarlara seyreltik bir kat astar sür, kuruyunca 240 kumla al. Sonra tüm parçaları astarla. Boyayı montajdan sonra yapacağız.</p>',warn:'MDF tozu çok incedir; zımparada FFP2 maske tak.'});
    else S.push({t:'Kenar bandını çek',tools:['utu','bicak','zimKag'],x:`<p>Görünen ön kenarlara${doors||kd?' ve kapakların dört kenarına':''} ütüyle kenar bandı yapıştır (yaklaşık <b class="mono">${band.toFixed(1)} m</b>). Bastırarak soğut, taşanı maket bıçağıyla kes, 180 kumla yumuşat.</p>`});
    S.push({t:'Yatay panel yerlerini işaretle',tools:['metre','gonye','kalem','isk'],x:`<p>İki yan dikmeyi iç yüzleri yukarı bakacak şekilde yan yana koy ve birbirine işkencele; çizgileri aynı anda çiz. Panelin alt yüzünün yerden yüksekliği:</p><ul>${marks.map(([n,y])=>`<li>${n}: <b class="mono">${R(y)} mm</b></li>`).join('')}<li>Üst tabla: yan dikmelerin üstüne oturur (<b class="mono">${H-t} mm</b>)</li></ul>`,tip:'Konfirmat delik merkezi panel çizgisinden 9 mm içeride, ön ve arka kenardan 50 mm.'});
    S.push({t:'Gövdeyi kur',add:only(c,['side','bottom','div','top','mid']),tools:['matkap','konfUc','koseIsk'],x:`<p>Bir yan dikmeyi yatır. ${K('bottom')} alt tablayı${has(c,'div')?` ve ${K('div')} ara bölmeyi`:''} çizgilerine dik oturt, köşe işkencesiyle tut. Kademeli konfirmat ucuyla yan dikmeden panelin içine tek seferde del, <b>7×50</b> konfirmatı sık. Diğer yan dikmeyi tak; ${K('top')} üst tablayı yukarıdan konfirmatla bağla.${mid?` ${K('mid')} orta dikmeyi tam ortaya (soldan <b class="mono">${R(W/2-t/2)} mm</b>) yerleştir, alttan ve üstten vidala.`:''}</p>`,warn:'Konfirmatı fazla sıkma; vida oturunca dur, yoksa plaka kenarı patlar.'});
    if(N) S.push(o.adjustable?{t:'Raf pimi deliklerini aç, rafları koy',add:['shelf'],tools:['rafSab','matkap'],x:`<p>Delme şablonunu yan dikmelerin${mid?' ve orta dikmenin':''} iç yüzüne, önden ve arkadan 37 mm içeride daya; 32 mm aralıkla 5 mm çapında, 10 mm derinlikte delikler aç. ${K('shelf')} rafları istediğin yüksekliğe pimlerle yerleştir.</p>`,tip:'Matkap ucuna bant sararak derinlik işareti yap; delik dışarı çıkmasın.'}
      :{t:'Rafları tak',add:['shelf'],tools:['matkap','konfUc'],x:`<p>${K('shelf')} rafları çizgilerine yerleştir, her ucundan ${per} konfirmatla bağla. Raf arası net <b class="mono">${R(gap)} mm</b>.</p>`});
    if(o.rod) S.push({t:'Askı borusunu tak',add:['rod'],tools:['matkap','metre','terazi'],x:`<p>Rozetleri yan dikmelere, üst iç yüzeyden <b class="mono">${R(y1-rodY-12)} mm</b> aşağıda ve derinliğin tam ortasında vidala. Boruyu <b class="mono">${IW-2} mm</b> boyda kesip rozetlere oturt.</p>`});
    if(base==='plinth') S.push({t:'Bazayı tak',add:['kick'],tools:['konfUc'],x:`<p>${K('kick')} bazayı alt tablanın altına, ön kenardan 20 mm içeride yerleştir; yan dikmelerden 2'şer konfirmatla bağla. Geri çekik baza ayak çarpmasını önler.</p>`});
    if(base==='legs') S.push(o.splay?{t:'Açılı ayakları tak',add:['leg'],tools:['matkap','aciOlcer'],x:`<p>Gövdeyi ters çevir. ${o.splay}° açılı montaj plakalarını köşelerden 45 mm içeride, eğimi köşegen boyunca dışa bakacak şekilde vidala. ${K('leg')} konik ayakları plakalara çevirerek tak. Ayaklar tornalanmış konik kayın olabilir ya da hazır alınabilir.</p>`,tip:'Dört ayağın aynı açıda durduğunu sürgülü gönyeyle kontrol et; plakayı ters takmak ayağı içe yatırır.'}
      :{t:'Ayakları tak',add:['leg'],tools:['matkap'],x:`<p>Gövdeyi ters çevir. ${K('leg')} ayakları köşelerden 20 mm içeride montaj plakalarıyla alt tablaya vidala. Ayak boyu <b class="mono">${hl} mm</b>.</p>`});
    if(o.back!==false) S.push({t:'Arkalığı çak',add:['back'],tools:['cekic','metre'],x:`<p>Gövdeyi yüzüstü yatır. Çaprazları ölç ve eşitle; arkalık gövdeyi bu haliyle kilitler. ${K('back')} arkalığı kenarlardan 150 mm arayla çivile${N&&!o.adjustable?', raf hizalarına da 200 mm arayla':''}.</p>`});
    if(kd){
      S.push({t:'Rayları gövdeye tak',add:['slide'],tools:['matkap','metre','kalem'],x:`<p>Rayların gövde parçasını ayır. Ön ucu gövde ön kenarından <b class="mono">18 mm</b> içeride olacak şekilde 4×16 vidalarla tak. Ray alt kenarının yerden yüksekliği:</p><ul>${slideY.map((y,j)=>`<li>Çekmece ${j+1}: <b class="mono">${R(y)} mm</b></li>`).join('')}</ul>`,tip:'Her yükseklik için bir takoz kesip rayı üzerine yaslayarak vidala; iki taraf birebir aynı olur.'});
      S.push({t:'Çekmece kutularını yap',add:['dbot','dside','dfb'],tools:['matkap','koseIsk'],x:`<p>${K('dfb')} ön/arka parçaları ${K('dside')} yanların arasına tutkal ve 3,5×30 vidayla bağla, kutuyu ${K('dbot')} tabanın üstüne oturtup alttan vidala. ${kd} kutu yap. Dış genişlik <b class="mono">${bw} mm</b> olmalı.</p><p>Rayın çekmece parçasını kutu yanına, alttan <b class="mono">${R(bh/2-22+12)} mm</b> yükseklikte ve ön kenarla aynı hizada vidala; çekmeceyi takıp dene.</p>`,warn:'Kutu 1 mm geniş çıkarsa ray sıkışır, dar çıkarsa çekmece düşer. Ölçmeden ray vidalama.'});
      S.push({t:'Çekmece kapaklarını tak',add:['dfront'],tools:['matkap'],x:'<p>Kapakları açıklığa yerleştir; çevresinde 2 mm boşluk kalması için aralara 2 mm takoz koy. Kapağı çift taraflı bantla kutuya geçici tuttur, çekmeceyi dikkatle aç ve içeriden 4 adet 4×25 vidayla sabitle.</p>'});}
    if(doors) S.push({t:'Kapakları tak',add:['door'],tools:['forstner','matkap','metre'],x:`<p>Kapakların iç yüzüne, kenardan 22 mm içeride ve uçlardan 100 mm mesafede 35 mm çapında, 12 mm derinliğinde menteşe çanağı aç (kapak başına ${hc}). Menteşeyi kapağa, montaj tabanını yan dikmeye vidala. Kapağı tak; menteşe ayar vidalarıyla 2 mm boşlukları eşitle.</p>`,tip:'Forstner ucunu matkap sehpasında kullanırsan çanak dik ve eşit derinlikte olur.'});
    if(has(c,'knob')) S.push({t:'Kulpları tak',add:['knob'],tools:['matkap','metre'],x:'<p>Kulp delik aralığını bir karton parçasına çizip şablon yap; tüm kulplar aynı hizada olur. Ø4 delik aç, kulpları içeriden vidala.</p>'});
    if(m==='mdf18') S.push(finishStep({paint:1}));
    S.push(base==='wall'?{t:'Duvara as',tools:['terazi','matkap'],x:'<p>Askı aparatlarını gövdenin arka üst köşelerine tak. Duvara ray ya da dübel noktalarını su terazisiyle işaretle; dolabı as ve aparatın ayar vidalarıyla terazisine getir.</p>',warn:'Alçıpan duvarda mutlaka alçıpan dübeli ya da profil kullan. Dolu dolabın ağırlığı tahmin ettiğinden fazladır.'}
      :H>900?{t:'Yerleştir ve duvara sabitle',tools:['terazi','matkap'],x:'<p>Dolabı yerine koy, su terazisiyle kontrol et. Devrilme önleyici aparatı üst tablanın arka kenarına ve duvara dübelle sabitle.</p>',warn:'Uzun dolap duvara bağlanmazsa çocuk tırmandığında devrilebilir. Bu adımı atlama.'}
      :{t:'Son kontrol',tools:['terazi'],x:'<p>Dolabı düz zemine koy; kapak ve çekmece boşluklarını son kez ayarla. Ayaklara keçe yapıştır.</p>'});
    return S;};
  return c;
}

/* ======================================================================
   2) ÇERÇEVE (masa, sehpa, tabure, bank, tezgâh) — kereste, cep vidası
   ====================================================================== */
function frame(p,o){
  const {parts,A}=mk(); const L=p.L, W=p.W!=null?p.W:p.L, H=p.H, sp=o.sp||'cam';
  const lw=o.leg||45, lk=LM(sp,lw,lw), ah=o.apron||70, ak=LM(sp,20,ah);
  const tp=o.topPly?null:(o.topProf||[20,95]), tT=o.topPly?18:tp[0];
  const ov=o.ov!=null?o.ov:Math.max(15,Math.min(40,R(Math.min(L,W)*.06)));
  const lt=H-tT, x0=ov,x1=L-ov,z0=ov,z1=W-ov, sx=x1-x0-2*lw, sz=z1-z0-2*lw, ay=lt-ah;
  for(const x of [x0,x1-lw]) for(const z of [z0,z1-lw]) A('leg','Ayak',lk,x,0,z,lw,lt,lw);
  A('apS','Kısa kayıt',ak,x0+5,ay,z0+lw,20,ah,sz);A('apS','Kısa kayıt',ak,x1-25,ay,z0+lw,20,ah,sz);
  A('apL','Uzun kayıt',ak,x0+lw,ay,z0+5,sx,ah,20);A('apL','Uzun kayıt',ak,x0+lw,ay,z1-25,sx,ah,20);
  const midA=L>1500; if(midA) A('apM','Orta kayıt',ak,L/2-10,ay,z0+25,20,ah,W-2*ov-50);
  const lowY=o.lowY||Math.max(80,R(H*.18)); let k=0;
  const lower=o.lower||'none', rk=LM(sp,20,45);
  if(lower==='slats'||lower==='panel'){
    A('rail','Alt raf rayı',rk,x0+lw,lowY,z0+5,sx,45,20);A('rail','Alt raf rayı',rk,x0+lw,lowY,z1-25,sx,45,20);
    if(lower==='slats'){const sk=LM(sp,20,70);k=Math.max(2,Math.floor((sx+20)/90));spread(k,x0+lw,x1-lw,70).forEach(x=>A('slat','Alt raf çıtası',sk,x,lowY+45,z0+5,70,20,W-2*ov-10));}
    else A('panel','Alt raf','ply18',x0+lw,lowY+45,z0+5,sx,18,W-2*ov-10);}
  if(lower==='stretch'){
    A('stS','Yan alt kayıt',rk,x0+5,lowY,z0+lw,20,45,sz);A('stS','Yan alt kayıt',rk,x1-25,lowY,z0+lw,20,45,sz);
    A('stL','Ön/arka alt kayıt',rk,x0+lw,lowY,z0+5,sx,45,20);A('stL','Ön/arka alt kayıt',rk,x0+lw,lowY,z1-25,sx,45,20);}
  let n=1,w=W; const g=o.gap||0;
  if(o.topPly) A('top','Tabla','ply18',0,lt,0,L,18,W);
  else{const tk=LM(sp,tp[0],tp[1]); n=Math.max(1,Math.ceil((W+g)/(tp[1]+g))); w=(W-(n-1)*g)/n;
    for(let i=0;i<n;i++) A('top','Tabla tahtası',tk,0,lt,i*(w+g),L,tp[0],w);}
  const nAp=4+(midA?1:0)+(lower==='slats'||lower==='panel'?2:0)+(lower==='stretch'?4:0);
  const hw=[['Cep vidası 32 mm'+(o.outdoor?' (paslanmaz)':''),'1 kutu',nAp*4+' tane gerekiyor']];
  if(k) hw.push(['Sunta vidası 4×40',k*4+' adet','alt raf çıtaları']);
  if(lower==='panel') hw.push(['Sunta vidası 4×30','8 adet','alt raf']);
  if(g) hw.push(['Paslanmaz vida 4×50',n*(midA?6:4)+' adet','tabla tahtaları']);
  else hw.push(['8 şekilli tabla bağlantısı',(midA?10:8)+' adet','3,5×16 vidasıyla']);
  if(o.topPly) hw.push(['Ütüyle yapışan kenar bandı',Math.ceil((L+W)*2/1000*1.1)+' m','tabla kenarları']);
  hw.push(['Ahşap tutkalı'+(o.outdoor?' (D3, su geçirmez)':''),'1 şişe',''],
    o.outdoor?['Dış mekân ahşap yağı',(L*W>1e6?'1 L':'0,5 L'),'2-3 kat']:['Su bazlı vernik veya sert yağ',(L*W>1e6?'1 L':'0,5 L'),'']);
  if(!o.outdoor) hw.push(['Keçe ayak','4 adet','']);
  const ripped=!o.topPly&&w<tp[1]-1;
  const c={parts,hw,n,w,k,lowY,join:'Cep vidası'+(g?' + paslanmaz vida':''),
    notes:[sx>1200&&ah<95?{t:'warn',x:`Kayıt açıklığı ${R(sx)} mm. 20×${ah} kayıt bu boyda hafif esneyebilir; 20×95 kayıt seç.`}:null,
      H>650&&Math.min(L,W)<380?{t:'warn',x:'Yüksek ve dar gövde devrilmeye yatkın. Ayak açıklığını 380 mm üstüne çıkar.'}:null,
      o.outdoor?{t:'tip',x:'Dış mekânda vidalar paslanmaz olsun; ayak uçlarına plastik pabuç takarsan zeminden su çekmez.'}:null]};
  c.tools=stdTools(['gonyeT',ripped||o.topPly?['daire',o.topPly?'tabla için':'tabla tahtalarını boyuna kesmek için']:null,o.topPly?'ray':null,'metre','gonye','kalem','kreg','matkap',(k||g)?'havsa':null,
    !g&&!o.topPly&&n>1?['isk',Math.max(3,Math.ceil(L/400))+' adet, en az '+(W+100)+' mm']:['isk','2 adet'],'zimMak','zimKag','firca',o.topPly?'utu':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre','kalem'],x:cutUL(c,K),tip:'Aynı boydaki parçaları gönye makinesine bağladığın bir durdurma takozuyla arka arkaya kes; hepsi birebir eşit çıkar.'});
    S.push({t:'Cep deliklerini aç',tools:['kreg','matkap'],x:`<p>${Ks(c,K,'apS','apL','apM','rail','stS','stL')} parçaların her iki ucuna, iç yüzden 2'şer cep deliği aç. Aparatı ve ucun stop bileziğini 20 mm kalınlığa ayarla.</p>`});
    S.push({t:'Kısa yan çerçeveleri kur',add:only(c,['leg','apS','stS']),tools:['isk','matkap','gonye'],x:`<p>İki ayağı düz bir yüzeye yatır. ${K('apS')} kısa kaydı ayakların üst ucuyla aynı hizada ve ayak dış yüzünden 5 mm içeride yerleştir (altına 5 mm takoz koy).${has(c,'stS')?` ${K('stS')} alt kaydı yerden <b class="mono">${lowY} mm</b> yükseklikte bağla.`:''} Tutkal sür, işkenceyle tut, cep vidalarını tak. İkinci çerçeveyi aynı şekilde yap.</p>`});
    S.push({t:'Çerçeveleri birleştir',add:only(c,['apL','apM','rail','stL']),tools:['isk','gonye','metre'],x:`<p>İki yan çerçeveyi ${K('apL')} uzun kayıtlarla birleştir${has(c,'apM')?`; ${K('apM')} orta kaydı tam ortaya ekle, uzun tablaların sarkmasını önler`:''}.${has(c,'rail')?` ${K('rail')} alt rafı taşıyacak rayları yerden <b class="mono">${lowY} mm</b> yükseklikte bağla.`:''}${has(c,'stL')?` ${K('stL')} alt kayıtları yerden <b class="mono">${lowY} mm</b> yükseklikte bağla.`:''}</p><p>Çaprazları ölç; fark 2 mm'den az olmalı. Gövdeyi düz zeminde sallanıyor mu dene.</p>`,tip:`${lowY} mm'lik bir takoz kes ve alt parçaların altına koy; dört köşe aynı yükseklikte olur.`});
    if(has(c,'slat')) S.push({t:'Alt rafı kur',add:['slat'],tools:['matkap','havsa'],x:`<p>${k} ${K('slat')} çıtayı rayların üstüne eşit aralıkla diz; ilk ve son çıta ayaklara dayanır. Her çıtayı uçlarından 2'şer vidayla raylara vidala.</p>`});
    if(has(c,'panel')) S.push({t:'Alt rafı yerleştir',add:['panel'],tools:['matkap'],x:`<p>${K('panel')} alt raf panelini rayların üstüne oturt; alttan rayların içinden 4'er vidayla tuttur.</p>`});
    S.push(o.topPly?{t:'Tablayı tak',add:['top'],tools:['utu','bicak','matkap'],x:`<p>${K('top')} tablanın dört kenarına kenar bandı çek. Tablayı ters çevir, gövdeyi üstüne ortala (her yönden <b class="mono">${ov} mm</b> taşar) ve 8 şekilli bağlantılarla sabitle.</p>`}
      :g?{t:'Tabla çıtalarını vidala',add:['top'],tools:['matkap','havsa'],x:`<p>${n} ${K('top')} tahtayı aralarında <b class="mono">${g} mm</b> boşlukla diz; yağmur suyu bu aralıktan akar. İlk tahtayı gönyesinde yerleştir, diğerlerini ${g} mm takozla it. Her tahtayı kayıtlara yukarıdan 2'şer paslanmaz vidayla tuttur, vida başlarını havşala.</p>`}
      :{t:'Tablayı hazırla ve tak',add:['top'],tools:['isk','zimMak'],x:`<p>${n>1?`${n} ${K('top')} tahtayı kenarlarından tutkallayıp işkencele (alttan ve üstten sırayla), 12 saat beklet. Rende ya da zımparayla düzle. `:''}Tablayı ters çevir, gövdeyi ortala (her yönden <b class="mono">${ov} mm</b> taşar) ve 8 şekilli bağlantılarla sabitle.</p>`,tip:'8 şekilli bağlantı ahşabın mevsimlik genleşmesine izin verir; masif tablayı gövdeye tutkallama.'});
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   3) ÇITALI KASA (kasa, saksı, sandık, odunluk, bahçe yatağı)
   ====================================================================== */
function slatBox(p,o){
  const {parts,A}=mk(); const W=p.W,D=p.D,H=p.H, sp=o.sp||'cam', pr=o.prof||[20,70], s=pr[0], sw=pr[1], ps=o.post||30, g=o.gap!=null?o.gap:15, lh=o.legH||0;
  const sk=LM(sp,s,sw), pk=LM(sp,ps,ps);
  for(const x of [0,W-ps]) for(const z of [0,D-ps]) A('post',lh?'Ayak dikmesi':'Köşe dikmesi',pk,x,0,z,ps,H+lh,ps);
  const r=Math.max(1,Math.floor((H+g)/(sw+g))); const ys=g===0?Array.from({length:r},(_,i)=>i*sw):spread(r,0,H,sw);
  ys.forEach(y0=>{const y=y0+lh;
    A('sideS','Uzun yan '+(sw>95?'tahta':'çıta'),sk,0,y,-s,W,sw,s);A('sideS','Uzun yan '+(sw>95?'tahta':'çıta'),sk,0,y,D,W,sw,s);
    A('endS','Kısa yan '+(sw>95?'tahta':'çıta'),sk,-s,y,-s,s,sw,D+2*s);A('endS','Kısa yan '+(sw>95?'tahta':'çıta'),sk,W,y,-s,s,sw,D+2*s);});
  let kb=0;
  if(o.bottom==='slats'){const bk=LM(sp,20,70);kb=Math.max(2,Math.floor((W-2*ps+10)/80));spread(kb,ps,W-ps,70).forEach(x=>A('bslat','Taban çıtası',bk,x,lh,0,70,20,D));}
  if(o.bottom==='ply') A('bot','Taban','ply12',ps,lh,0,W-2*ps,12,D);
  if(o.lid) A('lid','Kapak','ply18',-s,H+lh,-s,W+2*s,18,D+2*s);
  const st=Math.min(320,R(Math.min(W,D)*.28));
  if(o.seats) for(const [cx,sx] of [[-s,1],[W+s,-1]]) for(const [cz,sz] of [[-s,1],[D+s,-1]])
    PART(parts,'seat','Köşe oturağı',sk,prism('y',[[cx,cz],[cx+sx*st,cz],[cx,cz+sz*st]],H+lh,s),{cut:[st,st,s],cutNote:'köşegen 45° kesilir'});
  const screws=r*4*4+kb*4;
  const hw=[[o.outdoor?'Galvaniz veya paslanmaz vida 4×40':'Sunta vidası 3,5×30','1 kutu',screws+' tane gerekiyor'],['Ahşap tutkalı'+(o.outdoor?' (D3)':''),'1 şişe','']];
  if(o.lid) hw.push(['Piyano menteşe veya 2 menteşe','1 takım',''],['Kapak amortisörü (yavaş kapanan)','1-2 adet','parmak sıkışmasını önler']);
  if(o.wheels) hw.push(['Frenli tekerlek 50 mm','4 adet','vidasıyla']);
  if(o.liner) hw.push(['Kalın naylon veya jeotekstil örtü','1 m²','zımbayla'],['Zımba teli 10 mm','1 kutu','']);
  if(o.handles) hw.push(['Kasa kulpu','2 adet','vidasıyla']);
  if(o.seats) hw.push(['Paslanmaz vida 4×50','12 adet','köşe oturakları']);
  hw.push(o.outdoor?['Dış mekân ahşap yağı','0,5-1 L','2 kat']:['Ahşap yağı veya su bazlı cila','0,5 L','']);
  const c={parts,hw,r,kb,join:'Vida + tutkal',notes:[g===0?{t:'tip',x:`Her yüzde ${r} sıra ${sw} mm tahta, boşluksuz.`}:{t:'tip',x:`Her yüzde ${r} sıra çıta, aralar yaklaşık ${R((H-r*sw)/Math.max(1,r-1))} mm.`},
    o.liner?{t:'tip',x:'İçini naylonla kaplarsan toprak nemi ahşaba geçmez; altta drenaj için naylonu birkaç yerden del.'}:null,
    o.lid?{t:'warn',x:'Çocuk sandığında yavaş kapanan amortisör şart; ağır kapak parmağa düşebilir.'}:null]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','havsa',['koseIsk','2 adet'],'zimMak','zimKag','firca',o.liner?'cekic':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre','kalem'],x:cutUL(c,K),tip:'Aynı boydaki parçaları durdurma takozuyla kes.'});
    S.push({t:'Uzun yüzleri hazırla',add:['post','sideS'],tools:['matkap','havsa','gonye'],x:`<p>İki dikmeyi masaya dıştan dışa <b class="mono">${W} mm</b> olacak şekilde paralel yatır. ${K('sideS')} parçaları ${lh?`dikmelerin alt ucundan <b class="mono">${lh} mm</b> yukarıdan başlayarak `:''}${g?`aralarında yaklaşık ${R((H-r*sw)/Math.max(1,r-1))} mm boşlukla`:'boşluksuz'} diz. Her ucuna tutkal ve 2 vida at; önce 3 mm kılavuz delik aç. İkinci uzun yüzü aynı şekilde yap.</p>`,tip:'İlk parçayı gönyeyle 90° getir; diğerleri onu izler.'});
    S.push({t:'Kısa yüzlerle kutuyu kapat',add:['endS'],tools:['matkap','koseIsk'],x:`<p>İki uzun yüzü dik tut, köşe işkencesiyle sabitle. ${K('endS')} kısa parçalar uzun parçaların uçlarını da kapatır; her ucuna 2 vida at. Çaprazları ölçüp eşitle.</p>`});
    if(has(c,'bslat')) S.push({t:'Tabanı tak',add:['bslat'],tools:['matkap'],x:`<p>Kasayı ters çevir. ${kb} ${K('bslat')} taban çıtasını dikmeler arasına eşit dağıt; uzun yan parçaların dışından uçlarına vidala.${o.outdoor?' Çıtalar arasındaki boşluk su tahliyesi içindir, kapatma.':''}</p>`});
    if(has(c,'bot')) S.push({t:'Tabanı tak',add:['bot'],tools:['matkap'],x:`<p>${K('bot')} taban panelini dikmeler arasına alttan yerleştir; dış çıtalardan 150 mm arayla vidala.</p>`});
    if(o.liner) S.push({t:'İç kaplamayı yap',tools:['cekic'],x:'<p>İç yüzeyleri naylon ya da jeotekstil örtüyle kapla; üst kenarın 2 cm altından zımbala. Tabanda drenaj için örtüyü birkaç yerden del.</p>'});
    if(o.seats) S.push({t:'Köşe oturaklarını tak',add:['seat'],tools:['gonyeT','matkap'],x:`<p>${K('seat')} oturakları ${st} mm kenarlı üçgen olarak kes (köşegen 45°). Dört köşeye, kenar tahtalarının üstüne oturt ve her birini 3 vidayla bağla; çocuklar oturur, kenarlar da sağlamlaşır.</p>`});
    if(o.lid) S.push({t:'Kapağı tak',add:['lid'],tools:['matkap'],x:'<p>Kapağı arka kenardan menteşeyle bağla. Amortisörü iç yan yüze takıp kapağın kendi kendine düşmediğini dene.</p>',warn:'Amortisörsüz bırakma; ağır kapak çocuğun parmağına düşebilir.'});
    if(o.wheels) S.push({t:'Tekerlekleri tak',tools:['matkap'],x:'<p>Kasayı ters çevir; tekerlekleri köşe dikmelerinin altına gelecek şekilde vidala. Frenli olanlar öne gelsin.</p>'});
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   4) PANEL KUTU (kutular, kuş evi, tepsi, düzenleyici)
   ====================================================================== */
function panelBox(p,o){
  const {parts,A}=mk(); const m=o.mat||'ply12', t=MAT[m].t, W=p.W,D=p.D,H=p.H;
  A('fb','Ön/arka panel',m,0,0,0,W,H,t);A('fb','Ön/arka panel',m,0,0,D-t,W,H,t);
  const eh=o.handle==='dowel'?H+90:H;
  A('end',o.handle==='dowel'?'Uç panel (tutamaklı)':'Yan panel',m,0,0,t,t,eh,D-2*t);A('end',o.handle==='dowel'?'Uç panel (tutamaklı)':'Yan panel',m,W-t,0,t,t,eh,D-2*t);
  A('bot','Taban',m,t,0,t,W-2*t,t,D-2*t);
  const nd=p.N!=null?p.N:(o.div||0), divH=H-t-(o.lid==='flat'?t+2:5), divX=nd?spread(nd,t,W-t,t).map((x,i,a)=>x):[];
  if(nd){const gx=(W-2*t-nd*t)/(nd+1);for(let i=0;i<nd;i++)A('div','Ara bölme',m,t+gx*(i+1)+t*i,t,t,t,divH,D-2*t);}
  if(o.handle==='dowel') A('handle','Tutamak çubuğu','kav25',t,H+45,D/2-12.5,W-2*t,25,25,{cut:[W-2*t+20,25,25]});
  if(o.lid==='flat'){A('lid','Kapak',m,0,H,0,W,t,D);A('cleat','Kapak çıtası',m,t+1,H-t,t+1,W-2*t-2,t,20);A('cleat','Kapak çıtası',m,t+1,H-t,D-t-21,W-2*t-2,t,20);}
  if(o.lid==='hinged') A('lid','Kapak',m,0,H,0,W,t,D);
  if(o.roof) A('roof','Çatı',m,-25,H,-30,W+50,t,D+50);
  if(o.hole) PART(parts,'hole','Giriş deliği','hole',prism('z',circlePoly(W/2,H*.68,o.hole/2,28),D,1),{deco:true,smooth:true});
  const small=W<300&&H<200;
  const hw=[small?['Ahşap tutkalı + 1,2×20 çivi','1 paket','']:[(o.outdoor?'Paslanmaz':'Sunta')+' vidası 3,5×30','1 kutu','']];
  if(o.lid==='hinged') hw.push(['Küçük menteşe 30 mm',(W>350?3:2)+' adet','vidasıyla'],W>250?['Kapak zinciri / stay','1 adet','']:null);
  if(o.clasp) hw.push(['Kapak klipsi / mandalı','1 adet','']);
  if(o.hang) hw.push(['Asma halkası veya paslanmaz tel','1 takım','']);
  if(o.acrylic) hw.push([`Şeffaf akrilik ${W-2*t+10}×${H-t+5} mm`,'1 adet','ön camı']);
  if(o.feet) hw.push(['Keçe ayak','4 adet','']);
  if(o.cork) hw.push(['Kadife veya keçe kumaş','0,25 m²','iç kaplama']);
  hw.push(o.outdoor?['Dış mekân yağı veya boyası (zehirsiz)','250 ml','']:o.food?['Gıdaya uygun mineral yağ','1 şişe','']:['Ahşap cilası veya yağı','250 ml','']);
  const c={parts,hw:hw.filter(Boolean),join:small?'Tutkal + çivi':'Vida + tutkal',
    notes:[o.hole?{t:'tip',x:`Giriş deliği Ø${o.hole} mm. 28 mm baştankara, 32 mm serçe ve sığırcık için uygundur. Önüne tünek koyma; yırtıcı kuşlar kullanır.`}:null,
      o.outdoor?{t:'tip',x:'Dış mekânda su geçirmez (WBP) kontrplak kullan ve kesim kenarlarını iyice yağla.'}:null]};
  c.tools=stdTools(['daire','metre','gonye','kalem','matkap',small?'cekic':'havsa',['koseIsk','2 adet'],['isk','2 adet'],'zimKag','firca',o.hole||o.handle==='dowel'?'forstnerSet':null,o.handle==='cut'?'dekupaj':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['daire','metre'],x:cutUL(c,K),tip:small?'Küçük parçaları ince dişli testereyle kes; plakayı önce şeritlere ayır, şeritlerden parçaları çıkar.':'Plakayı önce şeritlere ayır; şeritlerden parçaları çıkarmak daha düz sonuç verir.'});
    if(o.hole) S.push({t:'Giriş deliğini aç',tools:['forstnerSet','matkap'],x:`<p>Ön paneli yerden <b class="mono">${R(H*0.68)} mm</b> yükseklikte ortala; Ø${o.hole} mm Forstner uçla delik aç. Panelin arkasına hurda tahta koy ki delik çıkışı yırtılmasın. Panelin iç yüzünü kuş tırmanabilsin diye 80 kumla pürüzlendir ya da yatay çentikler aç.</p>`});
    if(o.handle==='cut') S.push({t:'Tutma deliklerini aç',tools:['dekupaj','matkap'],x:'<p>Yan panellerin üst kenarından 25 mm aşağıda, 90×25 mm bir oval çiz. İki ucuna 25 mm delik aç, arasını dekupajla kes ve zımparala.</p>'});
    S.push({t:'Kasayı kur',add:['fb','end'],tools:small?['cekic','koseIsk']:['matkap','havsa','koseIsk'],x:`<p>${K('end')} yan panelleri ${K('fb')} ön ve arka panellerin arasına yerleştir. Tutkal sür, köşe işkencesiyle 90° tut; ${small?'1,2 mm çivilerle':'3 mm kılavuz delik açıp 3,5×30 vidalarla'} bağla. Çaprazları ölçüp eşitle.</p>`});
    S.push({t:'Tabanı yerleştir',add:['bot'],tools:small?['cekic']:['matkap'],x:`<p>${K('bot')} tabanı panellerin arasına alttan oturt; tutkal ve çivi/vidayla dört kenardan sabitle.${o.hole?' Köşelerine drenaj için 6 mm delik aç.':''}</p>`});
    if(nd) S.push({t:'Bölmeleri yerleştir',add:['div'],tools:['metre','isk'],x:`<p>${nd} ${K('div')} bölmeyi eşit aralıkla yerleştir: aralar net <b class="mono">${R((W-2*t-nd*t)/(nd+1))} mm</b>. Bölmeleri tutkalla ve dıştan ince çiviyle tuttur.</p>`});
    if(o.handle==='dowel') S.push({t:'Tutamak çubuğunu tak',add:['handle'],tools:['forstnerSet','matkap'],x:`<p>Uç panellerin üst kısmına, üstten 30 mm aşağıda ve ortada 25 mm Forstner uçla 10 mm derinlikte yuva aç. ${K('handle')} çubuğu tutkalla yuvalara oturt; dıştan birer vidayla sabitle.</p>`});
    if(o.lid==='flat') S.push({t:'Kapağı hazırla',add:['lid','cleat'],tools:['matkap'],x:`<p>${K('cleat')} çıtaları ${K('lid')} kapağın alt yüzüne, kenarlardan ${t+1} mm içeride tutkalla. Kapak böylece kutuya oturur ve kaymaz.</p>`});
    if(o.lid==='hinged') S.push({t:'Kapağı menteşele',add:['lid'],tools:['matkap','metre'],x:'<p>Menteşeleri arka kenara, uçlardan 40 mm içeride yerleştir; 2 mm kılavuz delik açıp vidala. Kapağı açıp kapatarak ön kenarın tam oturduğunu kontrol et.</p>'});
    if(o.roof) S.push({t:'Çatıyı tak',add:['roof'],tools:['matkap'],x:'<p>Çatıyı önden ve yanlardan taşacak şekilde ortala. Temizlik için bir kenarını menteşeyle ya da tek vidayla tuttur ki açılabilsin.</p>',tip:'Yılda bir sonbaharda içini boşalt; eski yuva parazit barındırır.'});
    if(o.acrylic) S.push({t:'Ön camı yerleştir',tools:['matkap'],x:'<p>Akrilik levhayı ön açıklığa yerleştir ve köşelerinden küçük vidalarla ya da çıtalarla tuttur. Koruyucu filmini en son sök.</p>'});
    if(o.hang) S.push({t:'Asma düzeneği',tools:['matkap'],x:'<p>Arka panelin üst kısmına paslanmaz halka tak ya da arka panele 2 vida deliği açıp ağaca/duvara vidala. Kuş evi için 2-3 m yükseklik ve kuzeydoğu yönü idealdir.</p>'});
    if(o.cork) S.push({t:'İçini kapla',tools:['firca'],x:'<p>Bölme ölçülerine göre kesilen kadife ya da keçeyi spreyli yapıştırıcıyla iç tabana yapıştır.</p>'});
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   5) DUVAR RAFI (raf, baharatlık, ayakkabılık)
   ====================================================================== */
function wallShelf(p,o){
  const {parts,A}=mk(); const W=p.W,H=p.H,D=p.D||o.D||140, sp=o.sp||'cam', N=Math.max(2,p.N!=null?p.N:(o.N||3));
  const sm=o.ply?(o.mat||'ply18'):LM(sp,20,D), t=o.ply?18:20;
  A('side','Yan tahta',sm,0,0,0,t,H,D);A('side','Yan tahta',sm,W-t,0,0,t,H,D);
  const y0=o.floor?50:0, ys=spread(N,y0,H,t), gap=(H-y0-N*t)/(N-1);
  ys.forEach(y=>A('shelf','Raf',sm,t,y,0,W-2*t,t,D));
  const lip=o.lip&&gap>=75;
  if(lip) ys.slice(0,-1).forEach(y=>A('lip','Ön çıta',LM(sp,10,30),t,y+t+30,D-10,W-2*t,30,10));
  if(o.back) A('back','Arkalık','ply6',0,0,-6,W,H,6);
  const hw=[[o.ply?'Konfirmat 7×50':'Sunta vidası 4×40','1 kutu',N*2*2+' tane gerekiyor']];
  if(lip) hw.push(['Çivi 1,2×25','1 paket','ön çıtalar']);
  if(o.back) hw.push(['Çivi 1,2×20','1 paket','arkalık']);
  if(!o.floor) hw.push(['Gizli raf askısı (anahtar deliği)','2 adet',''],['Dübel + vida 6×60','4 adet','duvar tipine göre']);
  else if(H>900) hw.push(['Devrilme önleyici bağlantı','1 set','']);
  hw.push(['Ahşap tutkalı','1 şişe',''],o.outdoor?['Dış mekân yağı','0,5 L','']:['Su bazlı vernik veya yağ','0,5 L','']);
  const c={parts,hw,join:o.ply?'Konfirmat':'Vida + tutkal',notes:[{t:'tip',x:`${N} raf, aralar net ${R(gap)} mm.`},
    !o.floor?{t:'warn',x:'Duvara asılan rafta yük, duvarın taşıma gücü kadar güvenlidir. Alçıpanda alçıpan dübeli, tuğlada 6-8 mm dübel kullan.'}:null]};
  c.tools=stdTools([o.ply?'daire':'gonyeT','metre','gonye','kalem','matkap',o.ply?'konfUc':'havsa',['isk','2 adet'],'terazi','zimKag','firca',lip||o.back?'cekic':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:[o.ply?'daire':'gonyeT','metre'],x:cutUL(c,K)});
    S.push({t:'Raf yerlerini işaretle',tools:['metre','gonye','kalem','isk'],x:`<p>İki yan tahtayı yan yana işkencele ve çizgileri aynı anda çiz. Rafların alt yüzü, alttan:</p><ul>${ys.map((y,i)=>`<li>Raf ${i+1}: <b class="mono">${R(y)} mm</b></li>`).join('')}</ul>`});
    S.push({t:'Rafları bağla',add:['side','shelf'],tools:['matkap',o.ply?'konfUc':'havsa'],x:`<p>Bir yan tahtayı yatır, ${K('shelf')} rafları çizgilerine dik oturt. Yan tahtanın dışından her raf ucuna 2 ${o.ply?'konfirmat':'vida'} at (önce kılavuz delik). Diğer yan tahtayı aynı şekilde bağla, çaprazları eşitle.</p>`});
    if(lip) S.push({t:'Ön çıtaları tak',add:['lip'],tools:['cekic'],x:`<p>${K('lip')} çıtaları her rafın üstünde, raf yüzeyinden 30 mm yukarıda ve ön kenarla aynı hizada tutkal ve çiviyle tak. Kavanozların düşmesini önler.</p>`});
    if(o.back) S.push({t:'Arkalığı çak',add:['back'],tools:['cekic'],x:`<p>${K('back')} arkalığı tutkal ve 150 mm arayla çiviyle tak. Arkalık rafı gönyesinde kilitler.</p>`});
    S.push(finishStep(o));
    S.push(o.floor?{t:'Yerine koy',tools:['terazi'],x:`<p>Rafı yerine koy, su terazisiyle kontrol et.${H>900?' Duvara devrilme önleyiciyle bağla.':''}</p>`}
      :{t:'Duvara as',tools:['terazi','matkap'],x:'<p>Gizli askıları yan tahtaların arka kenarına, üstten 30 mm aşağıya tak. Duvarda askı noktalarını su terazisiyle işaretle, dübelle ve vidaları 3-4 mm dışarıda bırak. Rafı vidalara geçir.</p>',warn:'Elektrik ve su hattı geçebilecek yerleri (prizlerin üstü ve altı) delmeden önce kontrol et.'});
    return S;};
  return c;
}

/* ======================================================================
   6) ASKILIK (duvar askısı, anahtarlık)
   ====================================================================== */
function pegRail(p,o){
  const {parts,A}=mk(); const W=p.W, sp=o.sp||'cam', hb=o.hb||95, bk=LM(sp,20,hb);
  A('board','Askı tahtası',bk,0,0,0,W,hb,20);
  const n=p.N!=null?p.N:Math.max(2,Math.floor((W-80)/(o.space||150))+1), xs=spread(n,o.shelf?60:40,W-(o.shelf?60:40),20);
  xs.forEach(x=>A('peg','Askı çubuğu','kav20',x,hb/2-10,20,20,20,o.pegL||80));
  if(o.shelf){const sk=LM(sp,20,140);A('shelf','Üst raf',sk,0,hb,0,W,20,140);A('brk','Konsol',sk,0,0,20,20,hb,120);A('brk','Konsol',sk,W-20,0,20,20,hb,120);}
  const hw=[['Ahşap tutkalı','1 şişe','çubuklar için'],['Dübel + vida 6×60',(W>600?3:2)+' adet','duvar tipine göre'],['Vida 4×40',o.shelf?'8 adet':'—',o.shelf?'raf ve konsollar':'']];
  hw.push(['Su bazlı vernik veya yağ','250 ml','']);
  const c={parts,hw,n,join:'Kavela + tutkal',notes:[{t:'tip',x:`${n} askı çubuğu, ${R((W-80)/Math.max(1,n-1))} mm arayla.`}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','forstnerSet','terazi','zimKag','firca',o.shelf?'havsa':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','elT','metre'],x:cutUL(c,K),tip:'Kavela çubukları el testeresiyle keserken bir gönye kutusu kullan; uçlar dik çıkar.'});
    S.push({t:'Çubuk deliklerini aç',tools:['forstnerSet','matkap','metre'],x:`<p>${K('board')} tahtanın ortasından geçen yatay bir çizgi çiz ve çubuk yerlerini işaretle. 20 mm Forstner uçla 12 mm derinlikte delikler aç; matkabı yukarıya doğru yaklaşık 10° eğik tutarsan asılan eşya kaymaz.</p>`});
    S.push({t:'Çubukları tutkalla',add:['board','peg'],tools:['firca'],x:`<p>${K('peg')} çubukların ucuna tutkal sür, deliklere çevirerek it. Taşan tutkalı nemli bezle hemen sil.</p>`});
    if(o.shelf) S.push({t:'Rafı ve konsolları tak',add:['shelf','brk'],tools:['matkap','havsa'],x:`<p>${K('brk')} konsolları tahtanın iki ucuna, ${K('shelf')} rafı tahtanın ve konsolların üstüne yukarıdan vidala.</p>`});
    S.push(finishStep(o));
    S.push({t:'Duvara as',tools:['terazi','matkap'],x:'<p>Tahtayı duvara tut, su terazisiyle hizala. Tahtanın içinden duvara delik aç, dübelle ve vidala; vida başlarını tahta tapayla kapatabilirsin.</p>'});
    return S;};
  return c;
}

/* ======================================================================
   7) MERDİVEN RAF (battaniye, havlu merdiveni)
   ====================================================================== */
function ladder(p,o){
  const {parts,A}=mk(); const H=p.H,W=p.W, sp=o.sp||'cam', rp=o.rail||[20,70], rk=LM(sp,rp[0],rp[1]);
  A('rail','Dikme',rk,0,0,0,rp[0],H,rp[1]);A('rail','Dikme',rk,W-rp[0],0,0,rp[0],H,rp[1]);
  const n=p.N!=null?p.N:(o.N||5), dowel=o.rung!=='board', rh=dowel?25:45, ys=spread(n,o.firstY||250,H-150,rh), iw=W-2*rp[0];
  ys.forEach(y=>dowel?A('rung','Basamak çubuğu','kav25',rp[0],y,rp[1]/2-12.5,iw,25,25,{cut:[iw+24,25,25]}):A('rung','Basamak çıtası',LM(sp,20,45),rp[0],y,rp[1]/2-10,iw,45,20));
  const hw=[['Ahşap tutkalı','1 şişe',''],['Vida 4×50',n*2+' adet','her basamak ucuna 1'],['Kaydırmaz keçe veya tampon','4 adet','zemin ve duvar teması']];
  hw.push(['Su bazlı vernik veya yağ','250 ml','']);
  const c={parts,hw,join:dowel?'Kavela yuvası + vida':'Vida + tutkal',notes:[{t:'tip',x:`${n} basamak, aralar ${R((H-150-(o.firstY||250)-n*rh)/Math.max(1,n-1)+rh)} mm.`},{t:'warn',x:'Bu bir dekor merdivenidir; üzerine çıkılmaz. Duvara yaslarken alt uca kaydırmaz keçe yapıştır.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap',dowel?'forstnerSet':'havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)});
    S.push({t:'Basamak yerlerini işaretle',tools:['metre','kalem','isk'],x:`<p>İki dikmeyi yan yana işkencele, işaretleri aynı anda çiz. Basamak merkezleri, alttan:</p><ul>${ys.map((y,i)=>`<li>Basamak ${i+1}: <b class="mono">${R(y+rh/2)} mm</b></li>`).join('')}</ul>`});
    S.push(dowel?{t:'Yuvaları aç',tools:['forstnerSet','matkap'],x:'<p>Dikmelerin iç yüzüne, genişliğin tam ortasına 25 mm Forstner uçla 12 mm derinlikte yuva aç. Ucuna bant sararak derinliği işaretle; delik dışarı çıkmasın.</p>'}
      :{t:'Kılavuz delikleri aç',tools:['matkap','havsa'],x:'<p>Dikmelerin dış yüzünden, her basamak hizasına 2 adet 3 mm delik aç ve havşala.</p>'});
    S.push({t:'Merdiveni birleştir',add:['rail','rung'],tools:['isk','matkap','gonye'],x:`<p>${K('rung')} basamakları tutkalla bir dikmeye tak, sonra ikinci dikmeyi üstüne kapat. İşkenceyle sık, çaprazları eşitle. Kuruyunca dikmenin dışından her basamağa 1 vida at.</p>`});
    S.push(finishStep(o));
    return S;};
  return c;
}

/* ======================================================================
   8) YATAK (tek, çift, çocuk, evcil hayvan)
   ====================================================================== */
function bed(p,o){
  const {parts,A}=mk(); const sp=o.sp||'cam', lp=o.leg||70, lk=LM(sp,lp,lp), rk=LM(sp,28,o.railW||140), rh=o.railW||140;
  const IL=p.L+10, IW=p.W+10, top=p.H, yr=top-rh;
  const legTopFoot=top, legTopHead=o.head?(o.headH||900):top;
  for(const z of [0,lp+IW]){A('legH','Baş ayağı',lk,0,0,z,lp,legTopHead,lp);A('legF','Ayak ucu ayağı',lk,lp+IL,0,z,lp,legTopFoot,lp);}
  A('sideR','Yan kasa',rk,lp,yr,lp-28,IL,rh,28);A('sideR','Yan kasa',rk,lp,yr,lp+IW,IL,rh,28);
  A('endR','Baş/ayak kasası',rk,lp-28,yr,lp,28,rh,IW);A('endR','Baş/ayak kasası',rk,lp+IL,yr,lp,28,rh,IW);
  const ck=LM(sp,30,45), slatTop=top-25, cy=slatTop-20-45;
  A('cleat','Taşıyıcı çıta',ck,lp,cy,lp,IL,45,30);A('cleat','Taşıyıcı çıta',ck,lp,cy,lp+IW-30,IL,45,30);
  const ns=Math.max(6,Math.floor((IL+60)/(70+60))), sk=LM(sp,20,70);
  spread(ns,lp,lp+IL,70).forEach(x=>A('slat','Baza çıtası',sk,x,slatTop-20,lp,70,20,IW));
  const beam=p.W>=1200;
  if(beam){const bk=LM(sp,45,70), mz=lp+IW/2;A('beam','Orta kiriş',bk,lp,slatTop-20-70,mz-22,IL,70,45);
    const cl=slatTop-90; [lp+IL/3-35,lp+2*IL/3-35].forEach(x=>A('cleg','Orta ayak',lk,x,0,mz-35,lp,cl,lp));}
  if(o.head) A('headP','Başlık paneli','ply18',lp-18,top,lp,18,legTopHead-top,IW);
  const hw=[['Kancalı yatak bağlantı aparatı','4 takım','kasa-ayak birleşimi'],['Vida 5×60',Math.ceil(IL/200)*2+' adet','taşıyıcı çıtalar'],['Vida 4×40',ns*4+' adet','baza çıtaları']];
  if(beam) hw.push(['Kiriş askı aparatı','2 adet','orta kiriş'],['Vida 5×80','8 adet','orta ayaklar']);
  if(o.head) hw.push(['Sunta vidası 4×40','8 adet','başlık paneli'],['Kenar bandı 22 mm',Math.ceil((IW*2+(legTopHead-top)*2)/1000*1.1)+' m','']);
  hw.push(['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik veya yağ','1 L',''],['Keçe ayak',(beam?6:4)+' adet','']);
  const c={parts,hw,ns,join:'Yatak bağlantı aparatı + vida',notes:[{t:'tip',x:`Şilte ölçüsü ${p.W}×${p.L} mm; iç açıklık her yönden 5 mm boşluklu ${IW}×${IL} mm.`},
    o.low?{t:'tip',x:'Yer yatağı çocuğun kendi başına inip çıkmasına izin verir. Çıta aralığını 60 mm altında tut.'}:null]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','firca',o.head?'utu':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)});
    S.push({t:'Baş ve ayak çerçevelerini kur',add:['legH','legF','endR'],tools:['matkap','isk','gonye'],x:`<p>${K('legH')} baş ayaklarını ve ${K('legF')} ayak ucu ayaklarını ${K('endR')} kasalarla birleştir. Kasanın üst kenarı yerden <b class="mono">${top} mm</b>, ayağın iç yüzüyle aynı hizada. Tutkal ve 2'şer 5×60 vidayla bağla.</p>`});
    if(o.head) S.push({t:'Başlığı tak',add:['headP'],tools:['matkap','utu'],x:`<p>${K('headP')} başlık panelinin kenarlarına bant çek. Paneli baş ayaklarının arasına, kasanın üstüne oturt ve ayaklardan 4'er vidayla bağla.</p>`});
    S.push({t:'Yan kasaları bağla',add:['sideR'],tools:['matkap','metre'],x:`<p>Kancalı bağlantı aparatlarının erkek parçasını ${K('sideR')} yan kasaların uçlarına, dişi parçasını ayaklara vidala. Kasaları kancalara geçir. Çaprazları ölç; fark 3 mm'den az olmalı.</p>`,tip:'Kancalı aparat yatağı tek kişi söküp taşımaya izin verir; tutkal kullanma.'});
    S.push({t:'Taşıyıcı çıtaları tak',add:['cleat'],tools:['matkap'],x:`<p>${K('cleat')} çıtaları yan kasaların iç yüzüne, üst kenarı kasa üstünden <b class="mono">${R(top-(cy+45))} mm</b> aşağıda olacak şekilde 200 mm arayla 5×60 vidayla tak.</p>`});
    if(beam) S.push({t:'Orta kirişi kur',add:['beam','cleg'],tools:['matkap','metre'],x:`<p>${K('beam')} kirişi baş ve ayak kasalarının ortasına askı aparatlarıyla as; üst yüzü çıtaların üst yüzüyle aynı seviyede olsun. ${K('cleg')} orta ayakları kirişin altına vidala; yere tam bassın.</p>`});
    S.push({t:'Baza çıtalarını diz',add:['slat'],tools:['matkap','metre'],x:`<p>${ns} ${K('slat')} çıtayı eşit aralıkla diz (yaklaşık <b class="mono">${R((IL-ns*70)/(ns-1))} mm</b>). 60 mm'lik bir takozla aralığı sabit tut. Her çıtayı taşıyıcılara 2'şer vidayla tuttur.</p>`});
    S.push(finishStep(o,'<p>Şilteyi koymadan önce vernik ya da yağın en az 48 saat kurumasını bekle.</p>'));
    return S;};
  return c;
}

/* ======================================================================
   9) OTURMA (bahçe bankı, koltuk, şezlong)
   ====================================================================== */
function seat(p,o){
  const {parts,A}=mk(); const L=p.L,D=p.D,H=p.H,BH=p.BH||0, sp=o.sp||'emp', lk=LM(sp,45,70), fk=LM(sp,28,95), sk=LM(sp,20,95);
  const arms=!!o.arms, aH=220, back=BH>0;
  A('legB','Arka ayak',lk,0,0,0,45,H-20+(back?BH:0),70);A('legB','Arka ayak',lk,L-45,0,0,45,H-20+(back?BH:0),70);
  A('legF','Ön ayak',lk,0,0,D-70,45,H-20+(arms?aH:0),70);A('legF','Ön ayak',lk,L-45,0,D-70,45,H-20+(arms?aH:0),70);
  const fy=H-20-95;
  A('sideR','Yan kasa',fk,45,fy,0,28,95,D);A('sideR','Yan kasa',fk,L-73,fy,0,28,95,D);
  A('fbR','Ön/arka kasa',fk,73,fy,0,L-146,95,28);A('fbR','Ön/arka kasa',fk,73,fy,D-28,L-146,95,28);
  if(L>1300) A('midR','Orta kasa',fk,L/2-14,fy,28,28,95,D-56);
  const sx0=arms?45:0, sx1=arms?L-45:L, sz0=back?70:0, gap=8, ns=Math.max(2,Math.floor((D-sz0+gap)/(95+gap)));
  spread(ns,sz0,D,95).forEach(z=>A('seatS','Oturma çıtası',sk,sx0,H-20,z,sx1-sx0,20,95));
  let nb=0;
  if(back){nb=Math.max(2,Math.floor((BH-40+gap*4)/(95+gap*4)));spread(nb,H+40,H-20+BH,95).forEach(y=>A('backS','Sırt çıtası',sk,arms?45:0,y,70,arms?L-90:L,95,20));}
  if(arms){A('arm','Kolçak',fk,-25,H-20+aH,90,95,28,D-90+20);A('arm','Kolçak',fk,L-70,H-20+aH,90,95,28,D-90+20);}
  const hw=[['Paslanmaz vida 4×50','1 kutu',(ns+nb)*4+(arms?8:0)+' tane gerekiyor'],['Galvaniz cıvata M8×110 + somun + pul','8 takım','ayak-kasa birleşimi'],['Ahşap tutkalı (D3)','1 şişe',''],['Dış mekân ahşap yağı','1 L','2-3 kat'],['Plastik ayak pabucu','4 adet','']];
  const c={parts,hw,join:'Cıvata + paslanmaz vida',notes:[{t:'tip',x:`${ns} oturma çıtası${back?`, ${nb} sırt çıtası`:''}; aralar ${gap} mm.`},
    L>1600?{t:'warn',x:'1600 mm üstü bankta oturma çıtaları ortada esneyebilir; orta kasa eklendi, yine de 28 mm çıta kullanmak daha sağlam olur.'}:null]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K),tip:'Emprenye kerestenin kesim yüzeylerine emprenye tamir sıvısı ya da dış mekân yağı sür.'});
    S.push({t:'Yan çerçeveleri kur',add:['legB','legF','sideR'],tools:['matkap','isk','gonye'],x:`<p>Bir ${K('legB')} arka ve bir ${K('legF')} ön ayağı yere yatır. ${K('sideR')} yan kasayı ayakların iç yüzüne, üst kenarı yerden <b class="mono">${H-20} mm</b> olacak şekilde işkencele. 10 mm delik açıp her ayağa 2 adet M8 cıvatayla bağla. İkinci yan çerçeveyi ayna simetrisiyle yap.</p>`,warn:'Sol ve sağ çerçeve birbirinin aynası olmalı; kasa her zaman ayakların iç tarafında.'});
    S.push({t:'Çerçeveleri birleştir',add:only(c,['fbR','midR']),tools:['matkap','isk','metre'],x:`<p>${K('fbR')} ön ve arka kasaları yan kasaların arasına tutkal ve 4×50 vidayla bağla.${has(c,'midR')?` ${K('midR')} orta kasayı tam ortaya ekle.`:''} Çaprazları eşitle.</p>`});
    S.push({t:'Oturma çıtalarını vidala',add:['seatS'],tools:['matkap','havsa'],x:`<p>${ns} ${K('seatS')} çıtayı öndeki ilk çıta kasanın ön yüzüyle aynı hizada olacak şekilde diz. Aralara ${gap} mm takoz koy. Her çıtayı her kasaya 2 paslanmaz vidayla bağla, vida başlarını havşala.</p>`});
    if(back) S.push({t:'Sırt çıtalarını tak',add:['backS'],tools:['matkap','metre'],x:`<p>${nb} ${K('backS')} çıtayı arka ayakların ön yüzüne, en alttaki oturma yüzeyinden 40 mm yukarıda başlayacak şekilde eşit aralıkla vidala.</p>`,tip:'Sırtı biraz geriye yatık istersen arka ayakları kesmeden önce üst kısmını 10° açıyla kesebilirsin; bu planda dik yapılmıştır.'});
    if(arms) S.push({t:'Kolçakları tak',add:['arm'],tools:['matkap'],x:`<p>${K('arm')} kolçakları ön ayakların üstüne ve arka ayağın yan yüzüne vidala. Kenarlarını 120 kumla yuvarlat.</p>`});
    S.push(finishStep({outdoor:1}));
    return S;};
  return c;
}

/* ======================================================================
   10) TUTKALLI TAHTA (kesme, servis, peynir tahtası)
   ====================================================================== */
function glued(p,o){
  const {parts,A}=mk(); const L=p.L, strip=o.strip||40, pat=o.pat||['kayin'], n=Math.max(3,Math.round(p.W/strip)), W=n*strip, T=o.T||27, F=o.feet?8:0;
  for(let i=0;i<n;i++){const sp=pat[i%pat.length];A('st_'+sp,SP[sp].n+' şerit',LM(sp,30,strip),0,F,i*strip,L,T,strip,{cut:[L+20,strip,30]});}
  if(o.feet) for(const x of [30,L-50]) for(const z of [30,W-50]) A('foot','Lastik ayak','rubber',x,0,z,20,F,20);
  const clamps=Math.ceil(L/150)+1;
  const hw=[['Su geçirmez ahşap tutkalı (D3)','1 şişe',''],['Gıdaya uygun mineral yağ','1 şişe',''],o.feet?['Kaydırmaz lastik ayak','4 adet','paslanmaz vidasıyla']:null,['Zımpara kâğıdı 80/120/180/240','her kumdan 2','']].filter(Boolean);
  const c={parts,hw,join:'Tutkallı kenar birleştirme',notes:[W!==p.W?{t:'tip',x:`Şerit genişliği ${strip} mm olduğu için genişlik ${W} mm'ye yuvarlandı (${n} şerit).`}:null,
    o.hole?{t:'tip',x:'Tutma deliği: kısa kenarın ortasına, kenardan 30 mm içeride 30 mm delik.'}:null]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem',['isk',clamps+' adet, en az '+(W+100)+' mm'],'firca','rende','zimMak','zimKag',['freze','isteğe bağlı'],o.hole?'forstnerSet':null,o.feet?'matkap':null]);
  c.mkSteps=K=>{const S=[]; const gs=[...new Set(pat)].map(sp=>'st_'+sp);
    S.push({t:'Şeritleri kes',add:gs,tools:['gonyeT','metre','kalem'],x:`<p>${gs.map(K).join(' ')} şeritleri <b class="mono">${L+20} mm</b> boyunda kes. Uçlarda 10'ar mm pay bırakıyoruz.</p>${cutUL(c,K)}`});
    S.push({t:'Diz ve işaretle',tools:['kalem'],x:`<p>${n} şeridi ${pat.length>1?'desen sırasıyla ('+pat.map(s=>SP[s].n).join(' - ')+')':'yan yana'} diz. Uç kesitlerde yıllık halkaların yönünü sırayla çevir. Üzerlerine büyük bir V çiz.</p>`});
    S.push({t:'Tutkalla ve sıkıştır',tools:['isk','firca'],x:`<p>Yüzlere ince tutkal sür. ${clamps} işkenceyi yaklaşık 150 mm arayla, sırayla alttan ve üstten tak. Boncuk boncuk tutkal taşana kadar sık; 30 dakika sonra kazı, 24 saat beklet.</p>`,warn:'Fazla sıkma; tutkalın tamamı dışarı çıkarsa birleşim kuru kalır.'});
    S.push({t:'Düzle ve boya kes',tools:['rende','zimMak','gonyeT'],x:`<p>Yüzleri ${T} mm kalınlığa düzle. Uçlardan 10'ar mm keserek <b class="mono">${L} × ${W} mm</b> son ölçüye getir.</p>`});
    S.push({t:'Kenarlar ve zımpara',tools:['freze','zimMak','zimKag'],x:`<p>Kenarları yuvarlat${o.hole?', tutma deliğini aç':''}. 80 → 120 → 180 → 240 kum zımparala; son kumdan önce nemli bezle sil, kalkan lifleri al.</p>`});
    if(o.feet) S.push({t:'Ayakları tak',add:['foot'],tools:['matkap'],x:`<p>${K('foot')} lastik ayakları köşelerden 30 mm içeri vidala.</p>`});
    S.push(finishStep({food:1},'<p>3 kat, 6 saat arayla. Ayda bir tekrarla.</p>'));
    return S;};
  return c;
}

/* ======================================================================
   11) ÇERÇEVE (ayna, resim, pano)
   ====================================================================== */
function frameRect(p,o){
  const {parts,A}=mk(); const OW=p.W,OH=p.H, pw=o.prof||70, sp=o.sp||'cam', k=LM(sp,20,pw), W=OW+2*pw, H=OH+2*pw;
  A('stile','Dikey kenar',k,0,0,0,pw,H,20);A('stile','Dikey kenar',k,W-pw,0,0,pw,H,20);
  A('railH','Yatay kenar',k,pw,0,0,OW,pw,20);A('railH','Yatay kenar',k,pw,H-pw,0,OW,pw,20);
  const ins=o.insert||'mirror';
  if(ins==='mirror'||ins==='glass') A('pane',ins==='mirror'?'Ayna':'Cam','glass',pw-10,pw-10,-4,OW+20,OH+20,4);
  if(ins==='cork') A('pane','Mantar pano','cork5',pw-10,pw-10,-5,OW+20,OH+20,5);
  if(ins==='chalk') A('pane','Yazı tahtası (HDF)','hdf4',pw-10,pw-10,-4,OW+20,OH+20,4);
  if(ins!=='cork'&&ins!=='chalk') A('back','Arkalık','hdf4',pw-10,pw-10,ins==='mirror'||ins==='glass'?-8:-4,OW+20,OH+20,4);
  const hw=[['Cep vidası 32 mm','8 adet','köşe birleşimleri'],['Ahşap tutkalı','1 şişe','']];
  if(ins==='mirror') hw.push([`Ayna 4 mm, ${OW+20}×${OH+20} mm`,'1 adet','camcıya kestir']);
  if(ins==='glass') hw.push([`Çerçeve camı 2 mm, ${OW+20}×${OH+20} mm`,'1 adet','camcıya kestir']);
  if(ins==='chalk') hw.push(['Kara tahta boyası','250 ml','2 kat']);
  hw.push(['Çerçeve tutturma mandalı',Math.max(6,Math.ceil((OW+OH)*2/250))+' adet',''],[H>700?'Ağır çerçeve askı aparatı (D halkası)':'Testere dişli askı','2 adet',''],['Su bazlı vernik veya yağ','250 ml','']);
  const c={parts,hw,join:'Cep vidası (arkadan)',notes:[{t:'tip',x:`Dış ölçü ${W}×${H} mm, görünen açıklık ${OW}×${OH} mm. ${ins==='mirror'||ins==='glass'?'Cam/ayna açıklıktan her yönden 10 mm büyük.':''}`},
    ins==='mirror'&&OW*OH>400000?{t:'warn',x:'Büyük ayna ağırdır (4 mm ayna yaklaşık 10 kg/m²). Duvara iki noktadan, dübelle as.'}:null]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','kreg','matkap',['isk','2 adet'],'zimKag','firca',ins==='chalk'?'boya':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K),tip:'Yatay kenarları aynı durdurma takozuyla kes; çerçeve ancak karşılıklı kenarlar eşitse gönyesinde olur.'});
    S.push({t:'Cep deliklerini aç',tools:['kreg','matkap'],x:`<p>${K('railH')} yatay kenarların her iki ucuna, arka yüzden 2'şer cep deliği aç.</p>`});
    S.push({t:'Çerçeveyi birleştir',add:['stile','railH'],tools:['isk','gonye','metre'],x:`<p>Parçaları düz bir masaya ön yüzleri aşağı bakacak şekilde diz. Tutkal sür, işkenceyle sık, cep vidalarını tak. Çaprazları ölç; eşit olmalı.</p>`});
    S.push(finishStep({paint:o.paint}));
    if(has(c,'pane')) S.push({t:ins==='mirror'?'Aynayı yerleştir':ins==='glass'?'Camı ve resmi yerleştir':ins==='cork'?'Mantar panoyu yerleştir':'Yazı tahtasını yerleştir',add:only(c,['pane','back']),tools:['matkap'],x:`<p>Çerçeveyi ters çevir. ${K('pane')} parçayı açıklığın üstüne ortala${has(c,'back')?`, arkasına ${K('back')} arkalığı koy`:''}. Kenarlardan 250 mm arayla tutturma mandallarını vidala.</p>`,tip:ins==='chalk'?'HDF\'e iki kat kara tahta boyası sür; ilk kullanımdan önce yüzeyi tebeşirle tamamen boyayıp sil.':undefined});
    S.push({t:'Askıyı tak ve as',tools:['metre','matkap','terazi'],x:`<p>Askıları arka yüze, üstten ${R(H*0.25)} mm aşağıda ve yanlardan eşit mesafede tak. Duvarı işaretle, su terazisiyle kontrol et.</p>`});
    return S;};
  return c;
}

/* ======================================================================
   12) STAND (kulaklık standı, kitap desteği, kupa ağacı)
   ====================================================================== */
function stand(p,o){
  const {parts,A}=mk(); const sp=o.sp||'ceviz', kind=o.kind, W=p.W, H=p.H, D=p.D||W;
  if(kind==='headphone'){const bk=LM(sp,20,140);A('base','Taban',bk,0,0,0,W,20,D);A('post','Dikme',LM(sp,20,45),W/2-22.5,20,D-40,45,H,20);A('arm','Kol',LM(sp,20,45),W/2-22.5,20+H,D-130,45,20,110);}
  if(kind==='bookend'){const bk=LM(sp,20,D>140?190:140);for(const x0 of [0,W+60]){A('base','Taban',bk,x0,0,0,W,20,D);A('up','Dikey plaka',bk,x0,20,0,W,H,20);}}
  if(kind==='mug'){A('base','Taban',LM(sp,20,140),0,0,0,W,20,W);const pk=LM(sp,30,30),pc=W/2-15;A('post','Direk',pk,pc,20,pc,30,H,30);
    const n=Math.max(4,Math.floor((H-80)/55));for(let i=0;i<n;i++){const y=60+i*55,d=i%4;
      if(d===0)A('peg','Askı çubuğu','kav20',pc+30,y,pc+5,60,20,20);if(d===1)A('peg','Askı çubuğu','kav20',pc+5,y,pc+30,20,20,60);
      if(d===2)A('peg','Askı çubuğu','kav20',pc-60,y,pc+5,60,20,20);if(d===3)A('peg','Askı çubuğu','kav20',pc+5,y,pc-60,20,20,60);}}
  const hw=[['Ahşap tutkalı','1 şişe',''],['Vida 4×40',kind==='bookend'?'6 adet':'2 adet','alttan'],['Keçe ayak',kind==='bookend'?'8 adet':'4 adet',''],kind==='bookend'?['İnce kaydırmaz mantar','1 tabaka','taban altı']:null,['Ahşap yağı veya cila','100 ml','']].filter(Boolean);
  const c={parts,hw,join:kind==='mug'?'Kavela + tutkal':'Vida + tutkal',notes:[kind==='bookend'?{t:'tip',x:'Kitap desteği çift yapılır; ağırlık için taban altına ince metal plaka vidalayabilirsin.'}:null]};
  c.tools=stdTools(['gonyeT','elT','metre','gonye','kalem','matkap','havsa',['isk','2 adet'],'zimKag','firca',kind==='mug'?'forstnerSet':null]);
  c.mkSteps=K=>{const S=[];
    S.push({t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)});
    if(kind==='headphone'){
      S.push({t:'Dikmeyi tabana bağla',add:['base','post'],tools:['matkap','havsa','isk'],x:`<p>${K('post')} dikmeyi ${K('base')} tabanın arka kenarına yakın ortala. Alttan 2 vida ve tutkalla bağla; gönyeyle 90° kontrol et.</p>`});
      S.push({t:'Kolu tak',add:['arm'],tools:['matkap','zimKag'],x:`<p>${K('arm')} kolu dikmenin üstüne, öne doğru uzanacak şekilde tutkal ve 1 vidayla bağla. Kulaklık bandının oturduğu üst yüzü 120 kumla iyice yuvarlat.</p>`});}
    if(kind==='bookend') S.push({t:'L parçaları birleştir',add:['base','up'],tools:['matkap','havsa','isk'],x:`<p>${K('up')} dikey plakayı ${K('base')} tabanın arka kenarına alttan 3'er vidayla bağla. İki takım yap.</p>`});
    if(kind==='mug'){
      S.push({t:'Direği tabana bağla',add:['base','post'],tools:['matkap','havsa'],x:`<p>${K('post')} direği ${K('base')} tabanın tam ortasına alttan 2 vida ve tutkalla bağla.</p>`});
      S.push({t:'Askı çubuklarını tak',add:['peg'],tools:['forstnerSet','matkap'],x:`<p>Direğin dört yüzüne sırayla, 55 mm arayla 20 mm delik aç (12 mm derinlik, 15° yukarı eğik). ${K('peg')} çubukları tutkalla yuvalara it.</p>`});}
    S.push(finishStep({}));
    return S;};
  return c;
}

/* ======================================================================
   AİLE TANIMLARI
   ====================================================================== */
const PL={W:'Genişlik',H:'Yükseklik',D:'Derinlik',L:'Uzunluk',N:'Raf sayısı',BH:'Sırt yüksekliği'};
const FAMS=[];
function F(d){FAMS.push(d);}
const ply3=['ply18','mlam18','mdf18'];

/* --- Ev mobilyası: gövdeler --- */
F({id:'kitaplik-p',name:'Kitaplık',cat:'Ev mobilyası',b:carcass,level:2,time:'1 gün',tags:'raf kitap',
  desc:'Sabit raflı, bazalı, arkalıklı kitaplık. Kesimi ebatlama servisine yaptırıp evde birleştirebilirsin.',
  P:{W:[400,1200,10],H:[600,2200,10],D:[200,450,10],N:[1,8,1]},def:v=>({D:300,N:Math.max(1,Math.round(v.H/380)-1)}),o:{base:'plinth'},
  ax:[['W',[400,600,800]],['H',[900,1200,1800,2000]],['mat',ply3,MATL]]});
F({id:'ayarli-kitaplik',name:'Ayarlı raflı kitaplık',cat:'Ev mobilyası',b:carcass,level:2,time:'1 gün',tags:'raf pimi kitap',
  desc:'Raf yükseklikleri pimlerle istediğin gibi değişen kitaplık. 900 mm üstü genişlikte ortaya dikme eklenir.',
  P:{W:[400,1400,10],H:[900,2200,10],D:[250,400,10],N:[1,8,1]},def:v=>({D:320,N:Math.max(2,Math.round(v.H/350)-1)}),o:{base:'plinth',adjustable:true},
  ax:[['W',[600,800,1000,1200]],['H',[1800,2000]],['mat',ply3,MATL]]});
F({id:'kapakli-dolap',name:'Kapaklı dolap',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'dolap kapak',
  desc:'İçe oturan kapaklı, raflı çok amaçlı dolap. Kapaklar 35 mm frenli menteşeyle takılır.',
  P:{W:[400,1200,10],H:[600,2200,10],D:[300,600,10],N:[0,6,1]},def:v=>({D:400,N:Math.max(1,Math.round(v.H/400)-1)}),o:{base:'plinth',doors:2,adjustable:true},
  ax:[['W',[600,800,1000]],['H',[900,1200,1800]],['mat',ply3,MATL]]});
F({id:'komodin-p',name:'Komodin',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'yatak başı çekmece',
  desc:'Yatak başı için çekmeceli ve raflı küçük dolap. Ray toleranslarına göre çekmece ölçüleri otomatik hesaplanır.',
  P:{W:[350,650,10],H:[450,750,10],D:[300,480,10],N:[0,2,1]},def:()=>({D:380,N:0}),o:{base:'plinth'},
  ax:[['W',[400,450,500]],['H',[500,600]],['drawers',[1,2],{1:'tek çekmeceli',2:'iki çekmeceli'}],['mat',ply3,MATL]]});
F({id:'sifonyer',name:'Şifonyer',cat:'Ev mobilyası',b:carcass,level:3,time:'2 gün',tags:'çekmece şifoniyer',
  desc:'Tamamı çekmeceli şifonyer. Çekmece sayısı yüksekliğe göre otomatik belirlenir.',
  P:{W:[500,1200,10],H:[600,1300,10],D:[380,550,10]},def:()=>({D:450}),o:{base:'legs',drawers:'fill',drawerH:180},
  ax:[['W',[600,800,1000]],['H',[800,1000,1200]],['mat',ply3,MATL]]});
F({id:'tv-unitesi',name:'TV ünitesi',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'televizyon konsol',
  desc:'Ayaklı, alçak, çift kapaklı TV ünitesi. Kablo geçişi için arkalığa delik açılabilir.',
  P:{W:[900,2000,10],H:[350,650,10],D:[350,500,10],N:[0,2,1]},def:()=>({D:400,N:1}),o:{base:'legs',legH:150,doors:2},
  ax:[['W',[1200,1400,1600,1800]],['H',[450,550]],['mat',ply3,MATL]]});
F({id:'ayakkabi-dolabi',name:'Ayakkabı dolabı',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'portmanto antre',
  desc:'Çift kapaklı, ayarlı raflı ayakkabı dolabı. Raflar arası 160-180 mm tutulursa çoğu ayakkabı sığar.',
  P:{W:[500,1200,10],H:[700,1400,10],D:[300,420,10],N:[2,7,1]},def:v=>({D:350,N:Math.max(2,Math.floor(v.H/190)-1)}),o:{base:'plinth',doors:2,adjustable:true},
  ax:[['W',[600,800,1000]],['H',[900,1100]],['mat',ply3,MATL]]});
F({id:'gardirop',name:'Gardırop',cat:'Ev mobilyası',b:carcass,level:3,time:'2 gün',tags:'elbise dolabı',
  desc:'Askı borulu, çift kapaklı gardırop. Üstte bir raf, altında elbise askı alanı.',
  P:{W:[700,1200,10],H:[1800,2200,10],D:[550,620,10],N:[1,1,1]},def:()=>({D:580,N:1}),o:{base:'plinth',doors:2,rod:true,shelves:1},
  ax:[['W',[800,900,1000,1100]],['mat',['ply18','mlam18'],MATL]]});
F({id:'oyuncak-dolabi',name:'Oyuncak dolabı',cat:'Çocuk',b:carcass,level:2,time:'1 gün',tags:'çocuk odası düzen',
  desc:'Alçak, açık raflı oyuncak dolabı. Çocuk boyuna göre tasarlanmıştır; mutlaka duvara sabitle.',
  P:{W:[600,1400,10],H:[500,1000,10],D:[280,420,10],N:[1,3,1]},def:v=>({D:350,N:v.H>700?2:1}),o:{base:'plinth'},
  ax:[['W',[800,1000,1200]],['H',[600,800]],['mat',ply3,MATL]]});
F({id:'mutfak-alt',name:'Mutfak alt dolabı',cat:'Mutfak ve küçük eşya',b:carcass,level:3,time:'1,5 gün',tags:'tezgah altı',
  desc:'Standart 720 mm gövde, 100 mm baza ile tezgâh altı dolap. Tezgâh ayrıca alınır.',
  P:{W:[300,1000,10],H:[700,900,10],D:[500,600,10],N:[0,2,1]},def:()=>({H:820,D:560,N:1}),o:{base:'plinth'},
  ax:[['W',[400,500,600,800]],['tip',['k','ck','c3'],{k:'kapaklı',ck:'çekmeceli ve kapaklı',c3:'üç çekmeceli'}],['mat',['mlam18','mdf18'],MATL]],
  vo:v=>v.tip==='k'?{doors:v.W>500?2:1,adjustable:true}:v.tip==='ck'?{drawers:1,doors:v.W>500?2:1}:{drawers:'fill',drawerH:230}});
F({id:'mutfak-ust',name:'Mutfak üst dolabı',cat:'Mutfak ve küçük eşya',b:carcass,level:3,time:'1 gün',tags:'duvar dolabı asma',
  desc:'Duvara asılan, kapaklı üst dolap. Ayarlı askı aparatıyla terazisine getirilir.',
  P:{W:[300,1000,10],H:[400,900,10],D:[280,350,10],N:[0,3,1]},def:v=>({D:320,N:v.H>650?2:1}),o:{base:'wall',adjustable:true},
  ax:[['W',[400,600,800]],['H',[600,720]],['mat',['mlam18','mdf18'],MATL]],vo:v=>({doors:v.W>500?2:1})});
F({id:'banyo-dolabi',name:'Banyo dolabı',cat:'Ev mobilyası',b:carcass,level:3,time:'1 gün',tags:'lavabo duvar',
  desc:'Duvara asılan sığ banyo dolabı. Nemli ortam için yüzeyleri iyi kapatılmalı.',
  P:{W:[300,800,10],H:[400,900,10],D:[150,300,10],N:[1,3,1]},def:()=>({D:200,N:2}),o:{base:'wall',adjustable:true},
  ax:[['W',[400,500,600]],['H',[600,700]],['mat',['mlam18','mdf18'],MATL]],vo:v=>({doors:v.W>450?2:1})});
F({id:'kiler-dolabi',name:'Kiler dolabı',cat:'Mutfak ve küçük eşya',b:carcass,level:3,time:'2 gün',tags:'erzak boy dolabı',
  desc:'Boy dolabı biçiminde, ayarlı raflı kiler. Kavanoz ve erzak için sık raflı.',
  P:{W:[500,1000,10],H:[1600,2200,10],D:[350,550,10],N:[3,8,1]},def:()=>({D:400,N:5}),o:{base:'plinth',doors:2,adjustable:true},
  ax:[['W',[600,800]],['H',[1800,2000]],['mat',['mlam18','mdf18'],MATL]]});
F({id:'alet-dolabi',name:'Alet dolabı',cat:'Atölye',b:carcass,level:3,time:'1,5 gün',tags:'atölye garaj',
  desc:'Atölye ya da garaj için kapaklı, sağlam raflı dolap.',
  P:{W:[500,1200,10],H:[800,2000,10],D:[350,500,10],N:[1,6,1]},def:v=>({D:400,N:Math.max(1,Math.round(v.H/450)-1)}),o:{base:'plinth',doors:2,adjustable:true},
  ax:[['W',[600,800,1000]],['H',[900,1800]],['mat',['ply18','mlam18'],MATL]]});
F({id:'dosya-dolabi',name:'Dosya dolabı',cat:'Ev mobilyası',b:carcass,level:3,time:'1,5 gün',tags:'ofis çekmece klasör',
  desc:'Derin çekmeceli dosya dolabı; askılı dosya sistemine uygun çekmece yüksekliği.',
  P:{W:[400,600,10],H:[600,1100,10],D:[450,600,10]},def:()=>({D:550}),o:{base:'legs',legH:100,drawers:'fill',drawerH:300},
  ax:[['W',[450,500]],['H',[700,1000]],['mat',ply3,MATL]]});
F({id:'plak-dolabi',name:'Plak dolabı',cat:'Hobi',b:carcass,level:2,time:'1 gün',tags:'vinyl müzik',
  desc:'33 lük plaklar için 330 mm iç yükseklikli, ayaklı açık dolap; üstü pikap için uygun.',
  P:{W:[700,1500,10],H:[450,900,10],D:[330,420,10],N:[0,2,1]},def:v=>({D:360,N:v.H>700?1:0}),o:{base:'legs',legH:180},
  ax:[['W',[800,1000,1200]],['H',[600,800]],['mat',ply3,MATL]]});
F({id:'vitrin-dolap',name:'Çekmeceli kapaklı dolap',cat:'Ev mobilyası',b:carcass,level:3,time:'2 gün',tags:'ofis kapaklı raflı',
  desc:'Üstte çekmece, altta kapaklı bölüm, boy dolabı yüksekliğinde çalışma odası dolabı.',
  P:{W:[600,1000,10],H:[1200,2100,10],D:[350,450,10],N:[1,5,1]},def:v=>({D:400,N:Math.max(1,Math.round(v.H/450)-1)}),o:{base:'plinth',drawers:1,doors:2,adjustable:true},
  ax:[['W',[600,800,1000]],['H',[1400,1800]],['mat',ply3,MATL]]});

/* --- Masalar ve oturmalar (çerçeve) --- */
const sp3=['cam','mese','kayin'];
F({id:'yemek-masasi',name:'Yemek masası',cat:'Ev mobilyası',b:frame,level:2,time:'1,5 gün',tags:'masa salon',
  desc:'Masif tahtalı, kayıtlı klasik yemek masası. 1500 mm üstünde orta kayıt eklenir.',
  P:{L:[1000,2400,10],W:[700,1100,10],H:[720,780,5]},def:()=>({H:750}),o:{leg:70,apron:95,ov:60},
  ax:[['L',[1200,1400,1600,1800,2000]],['W',[800,900]],['sp',sp3,SPL]]});
F({id:'mutfak-masasi',name:'Mutfak masası',cat:'Mutfak ve küçük eşya',b:frame,level:2,time:'1 gün',tags:'masa',
  desc:'Küçük mutfaklar için kompakt masa.',
  P:{L:[700,1300,10],W:[500,900,10],H:[720,780,5]},def:()=>({H:750}),o:{leg:45,apron:70},
  ax:[['L',[800,900,1000,1100,1200]],['W',[600,700,800]],['sp',['cam','kayin'],SPL]]});
F({id:'calisma-masasi',name:'Çalışma masası',cat:'Ev mobilyası',b:frame,level:2,time:'1 gün',tags:'masa ofis bilgisayar',
  desc:'Kontrplak ya da masif tablalı sade çalışma masası.',
  P:{L:[800,1800,10],W:[500,800,10],H:[700,780,5]},def:()=>({H:740}),o:{leg:45,apron:95,ov:25},
  ax:[['L',[1000,1200,1400,1600]],['W',[600,700]],['top',['ply','cam','mese'],{ply:'kontrplak tablalı',cam:'çam tablalı',mese:'meşe tablalı'}]],
  vo:v=>v.top==='ply'?{topPly:true}:{sp:v.top}});
F({id:'orta-sehpa-f',name:'Orta sehpa',cat:'Ev mobilyası',b:frame,level:2,time:'1 gün',tags:'salon sehpa',
  desc:'Altı raflı ya da açık salon sehpası.',
  P:{L:[600,1400,10],W:[400,800,10],H:[350,500,5]},def:()=>({}),o:{leg:45,apron:70,ov:30},
  ax:[['L',[800,1000,1200]],['W',[500,600]],['H',[400,450]],['lower',['slats','panel'],{slats:'çıtalı raflı',panel:'kontrplak raflı'}],['sp',['cam','mese'],SPL]]});
F({id:'yan-sehpa',name:'Yan sehpa',cat:'Ev mobilyası',b:frame,level:2,time:'5 saat',tags:'koltuk yanı sehpa',
  desc:'Koltuk ya da yatak yanı için kare yan sehpa.',
  P:{L:[300,600,10],W:[300,600,10],H:[400,700,5]},def:v=>({W:v.L}),o:{leg:45,apron:70,ov:20},
  ax:[['L',[400,450,500]],['H',[500,550,600]],['lower',['none','panel'],{none:'rafsız',panel:'alt raflı'}],['sp',['cam','mese'],SPL]]});
F({id:'konsol',name:'Konsol masa',cat:'Ev mobilyası',b:frame,level:2,time:'1 gün',tags:'antre dar masa',
  desc:'Antre ya da koltuk arkası için dar ve uzun konsol.',
  P:{L:[600,1600,10],W:[250,450,10],H:[700,850,5]},def:()=>({}),o:{leg:45,apron:95,ov:20},
  ax:[['L',[800,1000,1200]],['W',[300,350]],['H',[750,800]],['lower',['none','slats'],{none:'rafsız',slats:'alt raflı'}]]});
F({id:'gece-sehpasi',name:'Ayaklı gece sehpası',cat:'Ev mobilyası',b:frame,level:2,time:'5 saat',tags:'yatak başı',
  desc:'Alt raflı, ayaklı minimal yatak başı sehpası.',
  P:{L:[350,550,10],W:[300,500,10],H:[450,700,5]},def:v=>({W:v.L-50}),o:{leg:45,apron:70,ov:15,lower:'panel'},
  ax:[['L',[400,450]],['H',[500,550,600]],['sp',['cam','mese','ceviz'],SPL]]});
F({id:'tabure-f',name:'Tabure',cat:'Ev mobilyası',b:frame,level:2,time:'6 saat',tags:'oturak',
  desc:'Ayak dayamalı kare tabure.',
  P:{L:[260,450,10],W:[260,450,10],H:[300,800,10]},def:v=>({W:v.L}),o:{leg:45,apron:70,ov:20,lower:'stretch'},
  ax:[['L',[300,350,400]],['H',[450,600,650,750]],['sp',['cam','kayin'],SPL]]});
F({id:'bar-taburesi',name:'Bar taburesi',cat:'Mutfak ve küçük eşya',b:frame,level:2,time:'6 saat',tags:'yüksek tabure ada',
  desc:'Mutfak adası ve bar tezgâhı için ayak dayamalı yüksek tabure.',
  P:{L:[320,450,10],W:[320,450,10],H:[600,820,10]},def:v=>({W:v.L,lowY:R(v.H*0.38)}),o:{leg:45,apron:70,ov:15,lower:'stretch'},
  ax:[['L',[360,400]],['H',[650,750,800]],['sp',sp3,SPL]],vo:v=>({lowY:R(v.H*0.36)})});
F({id:'giris-banki',name:'Giriş bankı',cat:'Ev mobilyası',b:frame,level:2,time:'1 gün',tags:'antre ayakkabılık bank',
  desc:'Altı ayakkabılık çıtalı, antre için oturma bankı.',
  P:{L:[600,1600,10],W:[280,450,10],H:[400,500,5]},def:()=>({H:450}),o:{leg:45,apron:70,ov:15},
  ax:[['L',[800,1000,1200,1400]],['W',[300,350,400]],['lower',['slats','none'],{slats:'raflı',none:'rafsız'}]]});
F({id:'ayak-taburesi',name:'Ayak taburesi',cat:'Ev mobilyası',b:frame,level:1,time:'4 saat',tags:'puf ayak koyma',
  desc:'Koltuk önü için alçak ayak taburesi; üzerine minder konabilir.',
  P:{L:[300,700,10],W:[250,500,10],H:[200,400,5]},def:()=>({}),o:{leg:45,apron:70,ov:15},
  ax:[['L',[400,500]],['W',[300,350]],['H',[250,300,350]]]});
F({id:'tezgah',name:'Atölye tezgâhı',cat:'Atölye',b:frame,level:2,time:'1,5 gün',tags:'çalışma tezgahı marangoz',
  desc:'70×70 ayaklı, 28 mm kalın tablalı, alt raflı sağlam atölye tezgâhı.',
  P:{L:[900,2400,10],W:[500,900,10],H:[750,1000,10]},def:()=>({}),o:{leg:70,apron:95,ov:30,topProf:[28,140],lower:'panel',lowY:150},
  ax:[['L',[1200,1500,1800,2000]],['W',[600,700,800]],['H',[850,900]]]});
F({id:'bahce-masasi',name:'Bahçe masası',cat:'Bahçe ve dış mekân',b:frame,level:2,time:'1 gün',tags:'dış mekan veranda',
  desc:'Çıtalı tablalı, su tahliyeli bahçe masası. Emprenye çam ya da meşe.',
  P:{L:[900,2200,10],W:[600,1000,10],H:[700,780,5]},def:()=>({H:740}),o:{leg:70,apron:95,ov:50,gap:6,outdoor:true},
  ax:[['L',[1200,1500,1800]],['W',[700,800,900]],['sp',['emp','mese'],SPL]]});
F({id:'cocuk-masasi',name:'Çocuk masası',cat:'Çocuk',b:frame,level:1,time:'5 saat',tags:'aktivite boyama',
  desc:'Kontrplak tablalı, yuvarlatılmış köşeli çocuk aktivite masası.',
  P:{L:[500,1000,10],W:[400,700,10],H:[400,620,10]},def:()=>({}),o:{leg:45,apron:70,ov:20,topPly:true},
  ax:[['L',[600,700,800]],['W',[500,600]],['H',[460,520,580]]]});
F({id:'saksi-standi',name:'Saksı standı',cat:'Bahçe ve dış mekân',b:frame,level:1,time:'4 saat',tags:'çiçek bitki stand',
  desc:'Alt raflı, kare saksı standı. İç ya da balkon için.',
  P:{L:[200,450,10],W:[200,450,10],H:[300,900,10]},def:v=>({W:v.L}),o:{leg:45,apron:70,ov:10,lower:'panel'},
  ax:[['L',[250,300,350]],['H',[400,600,800]],['sp',['cam','emp'],SPL]],vo:v=>v.sp==='emp'?{outdoor:true}:{}});

/* --- Kasalar ve sandıklar --- */
F({id:'saklama-kasasi',name:'Çıtalı saklama kasası',cat:'Ev mobilyası',b:slatBox,level:1,time:'5 saat',tags:'kasa düzen',
  desc:'Battaniye, dergi, oyuncak için açık çıtalı kasa.',P:{W:[300,800,10],D:[200,500,10],H:[150,450,10]},def:()=>({}),o:{bottom:'slats'},
  ax:[['W',[350,450,550]],['D',[250,320,400]],['H',[200,260,320]]]});
F({id:'meyve-kasasi',name:'Meyve ve sebze kasası',cat:'Mutfak ve küçük eşya',b:slatBox,level:1,time:'4 saat',tags:'patates soğan kasa',
  desc:'Havadar, üst üste konabilen kasa; patates, soğan ve meyve için.',P:{W:[300,600,10],D:[250,450,10],H:[120,350,10]},def:()=>({}),o:{bottom:'slats',gap:20,handles:true},
  ax:[['W',[400,500]],['D',[300,350]],['H',[150,250]],['sp',['cam','kayin'],SPL]]});
F({id:'oyuncak-sandigi',name:'Oyuncak sandığı',cat:'Çocuk',b:slatBox,level:2,time:'1 gün',tags:'kapaklı sandık',
  desc:'Yavaş kapanan kapaklı, tekerlekli oyuncak sandığı.',P:{W:[500,1000,10],D:[350,550,10],H:[300,550,10]},def:()=>({}),o:{bottom:'ply',lid:true,gap:10,wheels:true},
  ax:[['W',[600,800,900]],['D',[400,450]],['H',[400,450,500]]]});
F({id:'odunluk',name:'Odunluk',cat:'Bahçe ve dış mekân',b:slatBox,level:1,time:'1 gün',tags:'şömine soba odun',
  desc:'Havalandırmalı, aralıklı çıtalı odun kasası.',P:{W:[500,1200,10],D:[350,600,10],H:[500,1100,10]},def:()=>({}),o:{bottom:'slats',gap:25,post:45,sp:'emp',outdoor:true},
  ax:[['W',[600,800,1000]],['D',[400,500]],['H',[600,800,1000]]]});
F({id:'saksi-kutusu',name:'Ahşap saksı kutusu',cat:'Bahçe ve dış mekân',b:slatBox,level:1,time:'5 saat',tags:'çiçeklik balkon',
  desc:'İçi naylon kaplı, drenajlı ahşap saksı.',P:{W:[300,1200,10],D:[200,500,10],H:[200,500,10]},def:()=>({}),o:{bottom:'slats',gap:0,post:45,sp:'emp',outdoor:true,liner:true,prof:[20,95]},
  ax:[['W',[400,600,800,1000]],['D',[300,400]],['H',[300,400]]]});
F({id:'yuksek-saksi',name:'Ayaklı yükseltilmiş saksı',cat:'Bahçe ve dış mekân',b:slatBox,level:2,time:'1 gün',tags:'balkon bahçe sebze',
  desc:'Eğilmeden bakım yapılan, ayaklı sebze saksısı.',P:{W:[600,1500,10],D:[300,600,10],H:[200,400,10]},def:()=>({}),o:{bottom:'slats',gap:0,post:45,legH:450,sp:'emp',outdoor:true,liner:true,prof:[20,95]},
  ax:[['W',[800,1000,1200]],['D',[400,500]],['H',[250,300]]]});
F({id:'bahce-yatagi',name:'Yükseltilmiş bahçe yatağı',cat:'Bahçe ve dış mekân',b:slatBox,level:1,time:'5 saat',tags:'sebze yatağı tarh',
  desc:'28×140 tahtalı, tabansız yükseltilmiş sebze yatağı.',P:{W:[800,2400,10],D:[500,1200,10],H:[140,560,140]},def:()=>({}),o:{bottom:'none',gap:0,post:45,sp:'emp',outdoor:true,prof:[28,140]},
  ax:[['W',[1000,1200,1500,2000]],['D',[600,800,1000]],['H',[280,420]]]});
F({id:'kompost',name:'Kompost kutusu',cat:'Bahçe ve dış mekân',b:slatBox,level:1,time:'5 saat',tags:'gübre',
  desc:'Havalandırma aralıklı, tabansız kompost kasası.',P:{W:[600,1200,10],D:[600,1200,10],H:[500,1000,10]},def:()=>({}),o:{bottom:'none',gap:25,post:45,sp:'emp',outdoor:true,prof:[20,95]},
  ax:[['W',[800,1000]],['D',[800,1000]],['H',[700,900]]]});
F({id:'camasir-sepeti',name:'Çamaşır sepeti',cat:'Ev mobilyası',b:slatBox,level:1,time:'5 saat',tags:'banyo kirli sepeti',
  desc:'Havadar çıtalı, uzun çamaşır sepeti.',P:{W:[300,550,10],D:[250,450,10],H:[450,750,10]},def:()=>({}),o:{bottom:'slats',gap:15},
  ax:[['W',[400,450]],['D',[300,350]],['H',[550,650]],['sp',['cam','kayin'],SPL]]});
F({id:'sarap-kasasi',name:'Şarap kasası',cat:'Mutfak ve küçük eşya',b:slatBox,level:1,time:'4 saat',tags:'şişe kasa',
  desc:'Şişe taşıma ve saklama kasası.',P:{W:[250,500,10],D:[200,350,10],H:[200,350,10]},def:()=>({}),o:{bottom:'slats',gap:10,handles:true},
  ax:[['W',[350,450]],['D',[250,300]],['H',[250,300]],['sp',['cam','mese'],SPL]]});

/* --- Kutular --- */
F({id:'saklama-kutusu',name:'Kapaklı saklama kutusu',cat:'Ev mobilyası',b:panelBox,level:1,time:'3 saat',tags:'kutu düzen',
  desc:'Kontrplaktan oturmalı kapaklı saklama kutusu.',P:{W:[200,600,10],D:[150,400,10],H:[100,350,10],N:[0,4,1]},def:()=>({N:0}),o:{lid:'flat',mat:'ply12'},
  ax:[['W',[300,400,500]],['D',[250,300]],['H',[150,200,250]]]});
F({id:'taki-kutusu',name:'Takı kutusu',cat:'Hobi',b:panelBox,level:2,time:'4 saat',tags:'mücevher hediye',
  desc:'Menteşeli kapaklı, içi kadife kaplı bölmeli takı kutusu.',P:{W:[150,350,10],D:[100,250,10],H:[60,150,10],N:[0,5,1]},def:()=>({}),o:{lid:'hinged',mat:'ply6',cork:true,clasp:true},
  ax:[['W',[200,250]],['D',[120,150]],['H',[80,100]],['N',[2,3]]]});
F({id:'alet-kutusu',name:'Alet kutusu',cat:'Atölye',b:panelBox,level:1,time:'4 saat',tags:'taşıma tutamaklı',
  desc:'Kavela tutamaklı açık alet taşıma kutusu.',P:{W:[300,700,10],D:[150,300,10],H:[100,250,10],N:[0,2,1]},def:()=>({N:0}),o:{handle:'dowel',mat:'ply12'},
  ax:[['W',[400,500,600]],['D',[180,220]],['H',[150,200]]]});
F({id:'tepsi',name:'Servis tepsisi',cat:'Mutfak ve küçük eşya',b:panelBox,level:1,time:'3 saat',tags:'kahvaltı yatak tepsi',
  desc:'Tutma delikli, alçak kenarlı servis tepsisi.',P:{W:[300,700,10],D:[200,450,10],H:[40,120,5]},def:()=>({}),o:{mat:'ply12',handle:'cut',food:true},
  ax:[['W',[400,500,600]],['D',[300,350]],['H',[50,70]]]});
F({id:'cekmece-duzen',name:'Çekmece düzenleyici',cat:'Ev mobilyası',b:panelBox,level:1,time:'2 saat',tags:'çatal bıçak organizer',
  desc:'Çekmece içine bölmeli düzenleyici; ölçüyü çekmecene göre ayarla.',P:{W:[200,600,10],D:[200,550,10],H:[40,120,5],N:[1,6,1]},def:()=>({}),o:{mat:'ply6'},
  ax:[['W',[300,400]],['D',[300,400,450]],['H',[60,80]],['N',[2,3,4]]]});
F({id:'kalemlik',name:'Kalemlik',cat:'Hobi',b:panelBox,level:1,time:'1 saat',tags:'masa üstü fırça',
  desc:'Masa üstü kalem ve fırça kutusu.',P:{W:[60,150,5],D:[60,150,5],H:[80,160,5]},def:()=>({}),o:{mat:'ply6',feet:true},
  ax:[['W',[80,100]],['D',[80,100]],['H',[100,120]]]});
F({id:'cay-kutusu',name:'Çay kutusu',cat:'Mutfak ve küçük eşya',b:panelBox,level:2,time:'4 saat',tags:'poşet çay bitki çayı',
  desc:'Menteşeli kapaklı, bölmeli poşet çay kutusu.',P:{W:[180,400,10],D:[100,250,10],H:[70,150,5],N:[1,6,1]},def:()=>({}),o:{lid:'hinged',mat:'ply6',clasp:true},
  ax:[['W',[250,300]],['D',[150,180]],['H',[90,110]],['N',[3,4]]]});
F({id:'kus-evi',name:'Kuş evi',cat:'Bahçe ve dış mekân',b:panelBox,level:1,time:'3 saat',tags:'yuva baştankara serçe hobi',
  desc:'Açılabilir çatılı, drenajlı kuş yuvası.',P:{W:[120,220,5],D:[120,220,5],H:[180,300,5]},def:()=>({}),o:{mat:'ply12',roof:true,outdoor:true,hang:true},
  ax:[['W',[140,160,180]],['D',[140,160]],['H',[200,250]],['hole',[28,32],{28:'Ø28 giriş',32:'Ø32 giriş'}]]});
F({id:'bocek-oteli',name:'Böcek oteli',cat:'Bahçe ve dış mekân',b:panelBox,level:1,time:'3 saat',tags:'arı uğur böceği doğa hobi',
  desc:'Yalnız yaşayan arılar ve faydalı böcekler için bölmeli yuva.',P:{W:[200,450,10],D:[100,200,10],H:[250,500,10],N:[1,4,1]},def:()=>({}),o:{mat:'ply12',roof:true,outdoor:true,hang:true,div:2},
  ax:[['W',[250,350]],['D',[120,150]],['H',[300,400]],['N',[1,2]]]});
F({id:'mektup-kutusu',name:'Mektup kutusu',cat:'Bahçe ve dış mekân',b:panelBox,level:1,time:'3 saat',tags:'posta kapı',
  desc:'Menteşeli kapaklı duvar mektup kutusu.',P:{W:[250,400,10],D:[80,150,10],H:[250,450,10]},def:()=>({}),o:{mat:'ply12',lid:'hinged',outdoor:true,hang:true},
  ax:[['W',[300,350]],['D',[100,120]],['H',[350,400]]]});
F({id:'oyun-kutusu',name:'Masa oyunu kutusu',cat:'Hobi',b:panelBox,level:2,time:'4 saat',tags:'kart zar puzzle',
  desc:'Menteşeli kapaklı, bölmeli oyun ve kart kutusu.',P:{W:[200,450,10],D:[150,400,10],H:[60,150,5],N:[1,5,1]},def:()=>({}),o:{lid:'hinged',mat:'ply6',clasp:true},
  ax:[['W',[300,350,400]],['D',[250,300]],['H',[80,100]],['N',[3]]]});
F({id:'dikis-kutusu',name:'Dikiş kutusu',cat:'Hobi',b:panelBox,level:2,time:'4 saat',tags:'iplik makara el işi',
  desc:'Bölmeli, menteşeli kapaklı dikiş ve el işi kutusu.',P:{W:[250,450,10],D:[150,300,10],H:[100,200,10],N:[1,6,1]},def:()=>({}),o:{lid:'hinged',mat:'ply12',clasp:true},
  ax:[['W',[300,350]],['D',[200,250]],['H',[120,150]],['N',[3,4]]]});
F({id:'ekmek-kutusu',name:'Ekmek kutusu',cat:'Mutfak ve küçük eşya',b:panelBox,level:2,time:'4 saat',tags:'ekmeklik',
  desc:'Menteşeli kapaklı ahşap ekmeklik.',P:{W:[300,500,10],D:[200,350,10],H:[150,280,10]},def:()=>({}),o:{lid:'hinged',mat:'ply12',food:true},
  ax:[['W',[350,400,450]],['D',[250,300]],['H',[180,220]]]});
F({id:'maket-vitrini',name:'Maket vitrin kutusu',cat:'Hobi',b:panelBox,level:2,time:'4 saat',tags:'koleksiyon figür model',
  desc:'Önü akrilik camlı, toz geçirmeyen koleksiyon vitrini.',P:{W:[200,700,10],D:[150,350,10],H:[150,450,10]},def:()=>({}),o:{lid:'flat',mat:'ply12',acrylic:true},
  ax:[['W',[300,400,500]],['D',[200,250]],['H',[200,300]]]});

/* --- Raflar ve askılıklar --- */
F({id:'duvar-rafi',name:'Duvar rafı',cat:'Ev mobilyası',b:wallShelf,level:1,time:'4 saat',tags:'asma raf',
  desc:'Yan tahtalı, gizli askılı duvar rafı.',P:{W:[300,1200,10],H:[300,1000,10],D:[95,190,1],N:[2,6,1]},def:v=>({N:Math.max(2,Math.round(v.H/280)+1)}),o:{},
  ax:[['W',[500,700,900]],['D',[140,190]],['H',[400,600,800]],['sp',['cam','mese'],SPL]]});
F({id:'baharatlik',name:'Baharatlık',cat:'Mutfak ve küçük eşya',b:wallShelf,level:1,time:'3 saat',tags:'kavanoz raf',
  desc:'Ön çıtalı, kavanozları düşürmeyen duvar baharatlığı.',P:{W:[250,700,10],H:[300,800,10],D:[95,95,1],N:[2,6,1]},def:v=>({D:95,N:Math.max(2,Math.round(v.H/150))}),o:{lip:true},
  ax:[['W',[300,400,500]],['H',[400,500,600]],['sp',['cam','kayin'],SPL]]});
F({id:'banyo-rafi',name:'Banyo rafı',cat:'Ev mobilyası',b:wallShelf,level:1,time:'3 saat',tags:'havlu raf',
  desc:'Arkalıklı, dar banyo rafı.',P:{W:[250,700,10],H:[400,900,10],D:[140,140,1],N:[2,5,1]},def:v=>({D:140,N:Math.max(2,Math.round(v.H/250))}),o:{back:true},
  ax:[['W',[300,400,500]],['H',[500,700]],['sp',['cam','kayin'],SPL]]});
F({id:'ayakkabi-rafi',name:'Ayakkabı rafı',cat:'Ev mobilyası',b:wallShelf,level:1,time:'5 saat',tags:'ayakkabılık açık',
  desc:'Yere konan, açık ayakkabı rafı.',P:{W:[500,1200,10],H:[400,1200,10],D:[250,400,10],N:[2,7,1]},def:v=>({D:300,N:Math.max(2,Math.round(v.H/180))}),o:{ply:true,floor:true},
  ax:[['W',[600,800,1000]],['H',[500,800,1000]],['D',[300,350]]]});
F({id:'koleksiyon-rafi',name:'Koleksiyon rafı',cat:'Hobi',b:wallShelf,level:1,time:'4 saat',tags:'figür maket sergi',
  desc:'Sık raflı, arkalıklı küçük koleksiyon sergileme rafı.',P:{W:[300,900,10],H:[400,1200,10],D:[95,140,1],N:[3,10,1]},def:v=>({D:95,N:Math.max(3,Math.round(v.H/130))}),o:{back:true},
  ax:[['W',[400,600]],['H',[600,800]],['sp',['cam','ceviz'],SPL]]});
F({id:'cicek-rafi',name:'Balkon çiçek rafı',cat:'Bahçe ve dış mekân',b:wallShelf,level:1,time:'5 saat',tags:'saksı bitki',
  desc:'Yere konan, emprenye çam balkon saksı rafı.',P:{W:[400,1200,10],H:[600,1400,10],D:[140,190,1],N:[2,5,1]},def:v=>({D:190,N:Math.max(2,Math.round(v.H/330))}),o:{floor:true,sp:'emp',outdoor:true},
  ax:[['W',[600,800]],['H',[800,1000]],['D',[190]]]});
F({id:'askilik',name:'Duvar askılığı',cat:'Ev mobilyası',b:pegRail,level:1,time:'3 saat',tags:'portmanto vestiyer kanca',
  desc:'Kavela çubuklu duvar askılığı; istersen üstünde rafı olur.',P:{W:[300,1500,10],N:[2,12,1]},def:v=>({N:Math.max(2,Math.floor((v.W-80)/v.space)+1)}),o:{},
  ax:[['W',[500,700,900,1200]],['space',[100,150],{100:'sık askılı',150:'seyrek askılı'}],['shelf',[true,false],{true:'raflı',false:''}],['sp',['cam','mese'],SPL]]});
F({id:'anahtarlik',name:'Anahtarlık',cat:'Ev mobilyası',b:pegRail,level:1,time:'2 saat',tags:'antre anahtar mektup',
  desc:'Üstünde mektup rafı olan kısa duvar anahtarlığı.',P:{W:[200,500,10],N:[2,8,1]},def:v=>({N:Math.max(2,Math.floor((v.W-80)/70)+1)}),o:{shelf:true,pegL:50},
  ax:[['W',[200,250,300,350]],['sp',['cam','ceviz'],SPL]]});
F({id:'havlu-askisi',name:'Havlu ve önlük askısı',cat:'Mutfak ve küçük eşya',b:pegRail,level:1,time:'2 saat',tags:'mutfak banyo',
  desc:'Mutfak ya da banyo için kısa çubuklu askı.',P:{W:[300,800,10],N:[2,8,1]},def:v=>({N:Math.max(2,Math.floor((v.W-80)/120)+1)}),o:{pegL:70},
  ax:[['W',[400,500,600]],['sp',['cam','kayin'],SPL]]});

/* --- Merdivenler --- */
F({id:'battaniye-merdiveni',nl:'basamaklı',name:'Battaniye merdiveni',cat:'Ev mobilyası',b:ladder,level:1,time:'3 saat',tags:'dekor merdiven örtü',
  desc:'Duvara yaslanan dekoratif battaniye merdiveni.',P:{W:[350,700,10],H:[1200,2000,10],N:[3,7,1]},def:()=>({}),o:{},
  ax:[['H',[1500,1700,1800]],['W',[450,550]],['N',[4,5]],['sp',sp3,SPL]]});
F({id:'havlu-merdiveni',name:'Havlu merdiveni',cat:'Ev mobilyası',b:ladder,level:1,time:'3 saat',tags:'banyo',
  desc:'Banyo için çıtalı havlu merdiveni.',P:{W:[350,600,10],H:[1000,1700,10],N:[3,6,1]},def:()=>({N:4}),o:{rung:'board'},
  ax:[['H',[1200,1500]],['W',[400,500]],['sp',['cam','kayin'],SPL]]});

/* --- Yataklar --- */
F({id:'tek-yatak',name:'Tek kişilik yatak',cat:'Ev mobilyası',b:bed,level:2,time:'1,5 gün',tags:'karyola baza',
  desc:'Çıtalı bazalı, sökülebilir tek kişilik karyola.',P:{L:[1900,2000,100],W:[800,1200,10],H:[250,450,10]},def:()=>({H:350}),o:{},
  ax:[['W',[900,1000]],['L',[1900,2000]],['head',[true,false],{true:'başlıklı',false:'başlıksız'}],['sp',['cam','mese'],SPL]]});
F({id:'cift-yatak',name:'Çift kişilik yatak',cat:'Ev mobilyası',b:bed,level:3,time:'2 gün',tags:'karyola baza',
  desc:'Orta kirişli, çıtalı bazalı çift kişilik karyola.',P:{L:[1900,2100,100],W:[1200,2000,10],H:[250,450,10]},def:()=>({H:350,L:2000}),o:{},
  ax:[['W',[1400,1600,1800]],['head',[true,false],{true:'başlıklı',false:'başlıksız'}],['sp',sp3,SPL]]});
F({id:'montessori-yatak',name:'Montessori yer yatağı',cat:'Çocuk',b:bed,level:2,time:'1 gün',tags:'çocuk yatağı alçak',
  desc:'Çocuğun kendi başına inip çıkabildiği alçak yer yatağı.',P:{L:[1200,2000,10],W:[600,1000,10],H:[120,250,10]},def:()=>({H:180}),o:{low:true,leg:45,railW:95},
  ax:[['W',[700,900]],['L',[1400,1600,1900]],['sp',['cam','kayin'],SPL]]});
F({id:'evcil-yatak',name:'Evcil hayvan yatağı',cat:'Ev mobilyası',b:bed,level:1,time:'5 saat',tags:'köpek kedi minder',
  desc:'Yerden yüksek, çıtalı köpek ya da kedi yatağı; üzerine minder konur.',P:{L:[500,1300,10],W:[400,900,10],H:[150,300,10]},def:()=>({H:200}),o:{leg:45,railW:95},
  ax:[['L',[700,900,1100]],['W',[500,700,900]]]});

/* --- Bahçe oturma --- */
F({id:'bahce-banki',name:'Sırtlı bahçe bankı',cat:'Bahçe ve dış mekân',b:seat,level:3,time:'1,5 gün',tags:'bank dış mekan',
  desc:'Cıvatalı çerçeveli, çıtalı oturma ve sırtlı bahçe bankı.',P:{L:[900,2000,10],D:[400,550,10],H:[400,470,5],BH:[300,500,10]},def:()=>({D:450,H:430,BH:400}),o:{},
  ax:[['L',[1200,1500,1800]],['arms',[true,false],{true:'kolçaklı',false:'kolçaksız'}],['sp',['emp','mese'],SPL]]});
F({id:'bahce-koltugu',name:'Bahçe koltuğu',cat:'Bahçe ve dış mekân',b:seat,level:3,time:'1 gün',tags:'tekli koltuk',
  desc:'Kolçaklı, sırtlı tek kişilik bahçe koltuğu.',P:{L:[550,800,10],D:[450,600,10],H:[350,450,5],BH:[350,550,10]},def:()=>({D:500,H:400}),o:{arms:true},
  ax:[['L',[600,700]],['BH',[400,500]],['sp',['emp','mese'],SPL]]});
F({id:'sezlong',name:'Düz şezlong',cat:'Bahçe ve dış mekân',b:seat,level:2,time:'1 gün',tags:'güneşlenme havuz',
  desc:'Alçak, düz çıtalı güneşlenme yatağı; üzerine minder konur.',P:{L:[600,800,10],D:[1700,2100,10],H:[250,400,5]},def:()=>({H:300,BH:0}),o:{},
  ax:[['L',[650,700]],['D',[1900,2000]],['sp',['emp','mese'],SPL]]});
F({id:'piknik-banki',name:'Sırtsız bahçe bankı',cat:'Bahçe ve dış mekân',b:seat,level:2,time:'1 gün',tags:'bank piknik',
  desc:'Sırtsız, çıtalı basit bahçe bankı.',P:{L:[800,2000,10],D:[300,450,10],H:[400,470,5]},def:()=>({D:350,H:450,BH:0}),o:{},
  ax:[['L',[1200,1500,1800]],['sp',['emp','mese'],SPL]]});
F({id:'balkon-banki',name:'Balkon bankı',cat:'Bahçe ve dış mekân',b:seat,level:2,time:'1 gün',tags:'küçük bank',
  desc:'Dar balkonlar için kısa, sırtlı bank.',P:{L:[700,1200,10],D:[350,450,10],H:[400,460,5],BH:[300,450,10]},def:()=>({D:400,H:430,BH:350}),o:{},
  ax:[['L',[800,1000]],['sp',['emp','mese'],SPL]]});
F({id:'cocuk-banki',name:'Çocuk bankı',cat:'Çocuk',b:seat,level:2,time:'1 gün',tags:'bahçe çocuk',
  desc:'Çocuk boyunda sırtlı küçük bank.',P:{L:[500,1000,10],D:[250,350,10],H:[220,330,5],BH:[200,300,10]},def:()=>({D:300,H:280,BH:250}),o:{},
  ax:[['L',[600,800]],['sp',['emp','kayin'],SPL]]});

/* --- Tahtalar --- */
const PATS={kayin:['kayin'],mese:['mese'],ceviz:['ceviz'],kc:['kayin','ceviz'],ac:['akc','ceviz'],mck:['mese','ceviz','kayin']};
const PATL={kayin:'kayın',mese:'meşe',ceviz:'ceviz',kc:'kayın-ceviz çizgili',ac:'akçaağaç-ceviz çizgili',mck:'meşe-ceviz-kayın'};
F({id:'kesme-tahtasi-f',name:'Kesme tahtası',cat:'Mutfak ve küçük eşya',b:glued,level:1,time:'4 saat + kuruma',tags:'mutfak doğrama',
  desc:'Kenar birleştirmeli masif kesme tahtası.',P:{L:[250,600,10],W:[150,450,10]},def:()=>({}),o:{feet:true},
  ax:[['L',[300,400,500]],['W',[200,250,300]],['pat',Object.keys(PATS),PATL]],vo:v=>({pat:PATS[v.pat]})});
F({id:'servis-tahtasi',name:'Servis tahtası',cat:'Mutfak ve küçük eşya',b:glued,level:1,time:'4 saat + kuruma',tags:'sunum peynir şarküteri',
  desc:'Uzun, ince, tutma delikli servis ve sunum tahtası.',P:{L:[400,900,10],W:[120,300,10]},def:()=>({}),o:{T:20,strip:30,hole:true},
  ax:[['L',[500,600,700]],['W',[150,200]],['pat',['kayin','ceviz','kc','ac'],PATL]],vo:v=>({pat:PATS[v.pat]})});
F({id:'peynir-tahtasi',name:'Peynir tahtası',cat:'Mutfak ve küçük eşya',b:glued,level:1,time:'3 saat + kuruma',tags:'kahvaltı sunum',
  desc:'Küçük, ince sunum tahtası.',P:{L:[200,400,10],W:[120,250,10]},def:()=>({}),o:{T:20,strip:30},
  ax:[['L',[250,300]],['W',[150,200]],['pat',['ceviz','kc','mck'],PATL]],vo:v=>({pat:PATS[v.pat]})});

/* --- Çerçeveler --- */
F({id:'ayna-cercevesi',name:'Ayna çerçevesi',cat:'Ev mobilyası',b:frameRect,level:1,time:'3 saat',tags:'ayna boy aynası',
  desc:'Masif çerçeveli duvar aynası.',P:{W:[300,900,10],H:[400,1800,10]},def:()=>({}),o:{insert:'mirror'},
  ax:[['W',[400,500,600]],['H',[600,900,1200]],['prof',[70,95],{70:'ince çerçeve',95:'kalın çerçeve'}],['sp',['cam','mese'],SPL]]});
F({id:'resim-cercevesi',name:'Resim çerçevesi',cat:'Hobi',b:frameRect,level:1,time:'2 saat',tags:'poster fotoğraf tablo',
  desc:'Standart kâğıt boyutlarına göre camlı resim çerçevesi.',P:{W:[150,700,1],H:[200,1000,1]},def:()=>({}),o:{insert:'glass',prof:45},
  ax:[['size',['A4','A3','30x40','40x50','50x70'],{A4:'A4',A3:'A3','30x40':'30×40','40x50':'40×50','50x70':'50×70'}],['sp',['cam','kayin','ceviz'],SPL]],
  vd:v=>({A4:{W:210,H:297},A3:{W:297,H:420},'30x40':{W:300,H:400},'40x50':{W:400,H:500},'50x70':{W:500,H:700}})[v.size]});
F({id:'pano',name:'Pano',cat:'Çocuk',b:frameRect,level:1,time:'2 saat',tags:'mantar kara tahta not',
  desc:'Mantar ya da kara tahta yüzeyli çerçeveli duvar panosu.',P:{W:[300,1200,10],H:[300,900,10]},def:()=>({}),o:{prof:45},
  ax:[['W',[600,900]],['H',[400,600]],['insert',['cork','chalk'],{cork:'mantar',chalk:'kara tahta'}],['sp',['cam','kayin'],SPL]]});

/* --- Standlar --- */
F({id:'kulaklik-standi',name:'Kulaklık standı',cat:'Hobi',b:stand,level:1,time:'2 saat',tags:'masa üstü oyun',
  desc:'Masa üstü kulaklık askısı.',P:{W:[100,180,5],D:[100,180,5],H:[220,320,5]},def:v=>({D:v.W}),o:{kind:'headphone'},
  ax:[['W',[120,140]],['H',[260,300]],['sp',['ceviz','mese','kayin'],SPL]]});
F({id:'kitap-destegi',name:'Kitap desteği (çift)',cat:'Hobi',b:stand,level:1,time:'2 saat',tags:'raf kitap tutucu',
  desc:'L biçimli, iki parça kitap desteği.',P:{W:[100,200,5],D:[100,190,5],H:[120,250,5]},def:()=>({D:140}),o:{kind:'bookend'},
  ax:[['W',[120,150]],['H',[150,200]],['sp',['ceviz','mese','kayin'],SPL]]});
F({id:'kupa-agaci',name:'Kupa ağacı',cat:'Mutfak ve küçük eşya',b:stand,level:1,time:'2 saat',tags:'fincan askı',
  desc:'Tezgâh üstü, kavela çubuklu kupa askısı.',P:{W:[120,200,5],H:[250,450,5]},def:()=>({}),o:{kind:'mug'},
  ax:[['W',[150]],['H',[300,350]],['sp',['ceviz','mese','kayin'],SPL]]});

/* ---------- varyantları ürüne çevir ---------- */
function expand(f){
  let combos=[{}];
  f.ax.forEach(([k,vals])=>{const nx=[];combos.forEach(c=>vals.forEach(v=>nx.push(Object.assign({},c,{[k]:v}))));combos=nx;});
  return combos.map((v,i)=>{
    const vd=f.vd?f.vd(v):{}; const vals=Object.assign({},v,vd);
    const base=Object.assign({},f.def?f.def(vals):{},vals);
    const params=Object.entries(f.P).map(([k,[min,max,step]])=>{let d=base[k]!=null?base[k]:min;d=Math.max(min,Math.min(max,d));return {k,l:(f.lbl&&f.lbl[k])||PL[k],min,max,step:step||10,def:d};});
    const opt=Object.assign({},f.o);
    f.ax.forEach(([k])=>{if(!(k in f.P)) opt[k]=v[k];});
    Object.keys(base).forEach(k=>{if(!(k in f.P)&&opt[k]==null)opt[k]=base[k];});
    if(f.vo) Object.assign(opt,f.vo(vals));
    const dims=f.ax.filter(([k])=>k in f.P&&k!=='N'&&k!=='BA').map(([k])=>(f.round&&k==='D'?'Ø':'')+v[k]/10).join('×');
    const lbls=f.ax.map(([k,,L])=>{if(k in f.P&&k!=='N'&&k!=='BA')return null;const val=v[k];
      if(k==='N')return val+' '+(f.nl||'bölmeli');if(k==='BA')return val+'° sırt';if(!L)return null;const s=typeof L==='function'?L(val):L[val];return s||null;}).filter(Boolean);
    const name=f.name+(dims?' '+dims+' cm':'')+(lbls.length?', '+lbls.join(', '):'');
    const prd={id:f.id+'-'+(i+1),fam:f.id,famName:f.name,name,cat:f.cat,level:f.level,time:f.time,desc:f.desc,tags:f.tags||'',params,vals:v};
    prd.build=p=>{const c=f.b(p,opt);prd.join=c.join;return c;};
    prd.tools=(p,c)=>c.tools; prd.notes=(p,c)=>c.notes||[]; prd.steps=(p,c,K)=>c.mkSteps(K);
    prd.join=f.b===carcass?'Konfirmat':f.b===frame?'Cep vidası':'Vida + tutkal';
    return prd;});
}
function register(list){list.forEach(f=>expand(f).forEach(p=>{PROJECTS.push(p);BYID[p.id]=p;}));}
register(FAMS);
