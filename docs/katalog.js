"use strict";
/* Talaş: web taramasında öne çıkıp katalogda eksik olan ürün türleri + alt kategori sınıflandırması. */

MAT.sisal70={n:'Çam 70×70 (sisal ip sarılı)',type:'lumber',w:70,t:70,tone:'sisal'};
MAT.wax={n:'Mum',type:'hw',tone:'wax'};
MAT.bottle={n:'Şişe',type:'hw',tone:'bottle'};
Object.assign(TONE,{sisal:[38,38,64],wax:[45,40,90],bottle:[150,35,24]});
Object.assign(TOOLS,{
  pirograf:{n:'Ahşap yakma kalemi (pirograf)',c:'Yüzey işlemleri',i:'pencil',d:'Yazı ve desenleri ahşaba yakarak işler.'},
  kayis:{n:'Kayış işkence',c:'Sıkma',i:'clamp',d:'Çokgen çerçeveleri tek seferde, her köşeden eşit sıkar.'},
  dubelSet:{n:'Dübel ucu ve merkezleme pimi seti',c:'Delme ve vidalama',i:'bit',d:'8 mm dübel deliklerini karşı parçaya birebir aktarır.'},
  panc:{n:'Panç (delik testeresi) seti',c:'Delme ve vidalama',i:'bit',d:'40-152 mm arası büyük, temiz yuvarlak delikler.'}
});

/* 1) İsim tabelası */
function signBoard(p,o){
  const parts=[], W=p.W, H=p.H, sp=o.sp||'cam', n=Math.max(1,Math.ceil(H/95)), h=H/n, bk=LM(sp,20,95), burn=o.style==='yakma';
  for(let i=0;i<n;i++) BOX(parts,'board','Tabela tahtası',bk,0,i*h,20,W,h,20);
  for(const x of [R(W*.15),R(W*.85)-45]) BOX(parts,'cleat','Arka kuşak',LM(sp,20,45),x,10,0,45,H-20,20);
  const hw=[['Ahşap tutkalı','1 şişe',''],['Sunta vidası 3,5×30',n*4+' adet','kuşaklar'],['Testere dişli askı','2 adet',''],
    burn?['Pirograf ucu seti','1 takım','']:['Akrilik boya ve şablon','1 takım','yazı için'],['Mat su bazlı vernik','100 ml','']];
  const c={parts,hw,join:'Tutkal + arka kuşak',notes:[{t:'tip',x:`Yazıyı bilgisayarda ${W}×${H} mm ölçüsünde hazırla, yazdır ve karbon kâğıdıyla tahtaya aktar.`}]};
  c.tools=stdTools(['gonyeT','metre','kalem',n>1?['isk','3 adet']:null,'matkap','zimMak','zimKag',burn?'pirograf':'boya','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    n>1?{t:'Tahtaları birleştir',add:['board'],tools:['isk','firca'],x:`<p>${n} ${K('board')} tahtayı kenarlarından tutkallayıp işkencele, 12 saat beklet.</p>`}:{t:'Tahtayı hazırla',add:['board'],tools:['zimMak'],x:'<p>Tahtanın yüzünü 120 ve 180 kumla düzgünleştir.</p>'},
    {t:'Arka kuşakları tak',add:['cleat'],tools:['matkap'],x:`<p>${K('cleat')} kuşakları arkaya, yanlardan ${R(W*.15)} mm içeride dik olarak vidala; tahtaları bir arada tutar ve askıları taşır.</p>`},
    {t:'Yazıyı aktar',tools:['kalem'],x:'<p>Yazdırdığın şablonu ortala, bantla tuttur, altına karbon kâğıdı koyup harflerin çevresini kalemle çiz.</p>'},
    {t:burn?'Yazıyı yak':'Yazıyı boya',tools:burn?['pirograf']:['boya'],x:burn?'<p>Pirografı orta ısıda, önce dış hatları sonra dolguyu işle. Kalemi sabit hızda çek; durursan koyu leke kalır.</p>':'<p>İnce fırçayla önce kenar hatlarını, sonra içleri boya. Boya akmasın diye fırçada az boya tut.</p>'},
    finishStep({},'<p>Yazının üstünden mat vernik geçerken fırçayı harflerin üzerinde gezdirme; boya dağılabilir, sprey vernik daha güvenlidir.</p>'),
    {t:'As',tools:['metre','matkap'],x:'<p>Askıları kuşakların üst ucuna tak ve duvara as.</p>'}];
  return c;
}

/* 2) Şamdan */
function candle(p,o){
  const parts=[], L=p.L, H=o.H||45, sp=o.sp||'mese', n=Math.max(1,Math.floor((L-20)/90)), xs=spread(n,20,L-20,40).map(x=>x+20);
  BOX(parts,'block','Şamdan gövdesi',LM(sp,H,95),0,0,0,L,H,95);
  xs.forEach(x=>PART(parts,'candle','Tealight mum (metal kaplı)','wax',cylRings([x,H-14,47.5],[x,H+6,47.5],19,19,24),{smooth:true}));
  const hw=[['Tealight mum',n+' adet',''],['Metal tealight kabı',n+' adet','mum ahşaba değmesin'],['Keçe ayak','4 adet',''],['Ahşap yağı','100 ml','']];
  const c={parts,hw,join:'Tek parça',notes:[{t:'warn',x:'Mumu doğrudan ahşaba koyma; metal kap kullan ve yanan mumu yalnız bırakma.'}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','forstnerSet','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Gövdeyi kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Mum yuvalarını aç',tools:['forstnerSet','matkap','kalem'],x:`<p>Üst yüzün ortasından bir çizgi geçir, ${n} yuva merkezini işaretle (${xs.map(x=>R(x)).join(', ')} mm). 40 mm Forstner uçla 16 mm derinlikte yuva aç; matkabı sabit tutmak için önce kılavuz delik aç.</p>`},
    {t:'Kenarları kır',tools:['zimMak','zimKag'],x:'<p>Tüm kenarlara 3 mm pah kır, 120 → 240 kumla zımparala.</p>'},
    finishStep({},'<p>Yağ kuruduktan sonra metal kapları ve mumları yerleştir.</p>')].map((s,i)=>i===3?Object.assign(s,{add:['block','candle']}):s);
  return c;
}

/* 3) Şarap rafı */
function wineRack(p,o){
  const parts=[], W=p.W, H=p.H, D=190, sp=o.sp||'cam', rk=LM(sp,20,45), sk=LM(sp,20,190), rh=115, N=Math.max(1,Math.floor((H-40)/rh)), nb=Math.max(1,Math.floor((W-40)/100));
  BOX(parts,'side','Yan tahta',sk,0,0,0,20,H,D);BOX(parts,'side','Yan tahta',sk,W-20,0,0,20,H,D);
  const ys=[];
  for(let r=0;r<N;r++){const y0=30+r*rh;ys.push(y0);
    BOX(parts,'railF','Ön yuva rayı',rk,20,y0,150,W-40,30,20,{cut:[W-40,45,20],cutNote:'yarım daire yuvalar açılır'});
    BOX(parts,'railB','Arka yuva rayı',rk,20,y0+12,20,W-40,30,20,{cut:[W-40,45,20],cutNote:'yarım daire yuvalar açılır'});
    spread(nb,20,W-20,76).forEach(x=>{const cx=x+38, cy=y0+30+38;
      PART(parts,'bottle','Şişe (örnek)','bottle',cylRings([cx,cy,-20],[cx,cy,230],38,38,20),{smooth:true,deco:true});
      PART(parts,'bottle','Şişe (örnek)','bottle',cylRings([cx,cy,230],[cx,cy,310],14,14,14),{smooth:true,deco:true});});}
  const hw=[['Sunta vidası 4×40',N*8+' adet',''],['Ahşap tutkalı','1 şişe',''],['Dübel + vida 6×60','4 adet','duvara'],['Su bazlı vernik veya yağ','0,5 L','']];
  const c={parts,hw,join:'Vida + tutkal',notes:[{t:'tip',x:`${N} sıra × ${nb} şişe = ${N*nb} şişe kapasitesi. Şişeler hafif eğik durur; mantar ıslak kalır.`},{t:'warn',x:'Dolu şarap rafı ağırdır (şişe başı ~1,3 kg). Duvara mutlaka dübelle bağla.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','panc',['isk','2 adet'],'havsa','terazi','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Şişe yuvalarını aç',tools:['panc','matkap','isk'],x:`<p>Yuva raylarını ikişer ikişer uzun kenarlarından yan yana işkencele. Birleşim çizgisi üzerinde, şişe aralıklarına (${nb} yuva, 100 mm arayla) 76 mm panç ile delik aç. İşkenceyi açınca her delik iki rayda yarım daire yuva bırakır.</p>`,tip:'Altına hurda tahta koy; panç çıkışta lifleri yırtmaz.'},
    {t:'Yan tahtaları işaretle',tools:['metre','kalem'],x:`<p>Yan tahtaları yan yana tutup ray yüksekliklerini işaretle: ${ys.map(y=>R(y)+' mm').join(', ')} (ön ray). Arka ray her sırada 12 mm daha yukarıda; şişe hafif aşağı bakar.</p>`},
    {t:'Rafı birleştir',add:['side','railF','railB'],tools:['matkap','havsa'],x:`<p>${K('railF')} ön ve ${K('railB')} arka rayları ${K('side')} yan tahtaların arasına, yanlardan 2'şer vidayla bağla.</p>`},
    finishStep({}),
    {t:'Duvara as',add:['bottle'],tools:['terazi','matkap'],x:'<p>Yan tahtaların arkasından, üst ve alt sıra hizasında duvara dübelle vidala; su terazisiyle kontrol et.</p>'}];
  return c;
}

/* 4) Basamaklı raf (tezgâh / saksı basamağı) */
function tiered(p,o){
  const parts=[], W=p.W, N=p.N, h=o.h||60, d=o.d||80, m=o.mat||'ply12', t=MAT[m].t;
  for(let i=0;i<N;i++){const zf=(N-1-i)*d, top=(i+1)*h;
    BOX(parts,'side','Yan parça',m,0,0,zf,t,top,d);BOX(parts,'side','Yan parça',m,W-t,0,zf,t,top,d);
    BOX(parts,'step','Basamak',m,t,top-t,zf,W-2*t,t,d);
    BOX(parts,'riser','Alın',m,t,i*h,zf+d-t,W-2*t,h-t,t);}
  const hw=[['Ahşap tutkalı'+(o.outdoor?' (D3)':''),'1 şişe',''],[o.outdoor?'Paslanmaz vida 3,5×30':'Çivi 1,2×25','1 paket',''],['Keçe ayak','4 adet',''],o.outdoor?['Dış mekân yağı','0,5 L','']:['Su bazlı vernik','250 ml','']];
  const c={parts,hw,join:'Tutkal + çivi',notes:[{t:'tip',x:`${N} basamak, her biri ${h} mm yüksek ve ${d} mm derin.`}]};
  c.tools=stdTools(['daire','metre','gonye','kalem',o.outdoor?'matkap':'cekic',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','metre'],x:cutUL(c,K)},
    {t:'Basamakları kur',add:['side','step','riser'],tools:['isk',o.outdoor?'matkap':'cekic'],x:`<p>En alttan başla: her basamak bir ${K('step')} üst parça, iki ${K('side')} yan parça ve bir ${K('riser')} alından oluşur. Parçaları tutkal ve ${o.outdoor?'vidayla':'çiviyle'} birleştir, sonra basamakları birbirine yanlardan bağla.</p>`},
    finishStep(o)];
  return c;
}

/* 5) Kedi tırmalama kulesi */
function catTree(p,o){
  const parts=[], H=p.H, B=p.W, m='ply18', k=H<900?2:H<1250?3:4, ps=R(B*.62), ys=spread(k,R(H*.38),H-18,18);
  BOX(parts,'base','Taban',m,0,0,0,B,18,B);
  const ctr=i=>i%2?[B*.62,B*.38]:[B*.38,B*.62]; let prevTop=18, prevC=[B/2,B/2];
  ys.forEach((y,i)=>{const [cx,cz]=ctr(i), pc=i===0?[cx,cz]:[cx,cz];
    PART(parts,'post','Tırmalama direği','sisal70',cylRings([pc[0],prevTop,pc[1]],[pc[0],y,pc[1]],35,35,20),{smooth:true,cut:[R(y-prevTop),70,70],cutNote:'sisal ip sarılır'});
    BOX(parts,i===k-1?'topP':'plat',i===k-1?'Üst yatak tablası':'Ara tabla',m,cx-ps/2,y,cz-ps/2,ps,18,ps);prevTop=y+18;});
  const postLen=ys.reduce((a,y,i)=>a+(y-(i?ys[i-1]+18:18)),0), rope=Math.ceil(postLen/6*0.23);
  const hw=[['Sisal ip 6 mm',rope+' m','direklere sarılır'],['Vida 6×100',k*2+' adet','direk bağlantıları'],['Halı veya keçe kumaş',(Math.ceil((B*B+k*ps*ps)/1e6*1.2*10)/10)+' m²','tabla kaplaması'],['Zımba teli + sıcak silikon','1 takım',''],H>1000?['Duvar bağlantı kayışı','1 adet','devrilmeye karşı']:null].filter(Boolean);
  const c={parts,hw,join:'Uzun vida + tutkal',notes:[{t:'tip',x:`${k} tabla; direkler 70×70 kereste üzerine sarılı sisal ip. Toplam ${rope} m ip gerekir.`},H>1000?{t:'warn',x:'1 m üstü kule zıplayan kediyle sallanır; üst tablayı duvara kayışla bağla.'}:null]};
  c.tools=stdTools(['daire','dekupaj','gonyeT','metre','kalem','matkap','havsa','cekic','bicak']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','metre'],x:cutUL(c,K)},
    {t:'Direklere sisal sar',tools:['cekic'],x:`<p>${K('post')} direklerin alt ucuna ipi zımbala, sıcak silikonla 10 cm'de bir sabitleyerek sıkı ve boşluksuz sar. Uçlardan 20 mm boş bırak; tablalara bu kısım girer.</p>`,tip:'İpi sararken direği bir işkenceyle masaya tuttur, iki elin serbest kalsın.'},
    {t:'Tabla kaplamaları',tools:['bicak','cekic'],x:'<p>Taban ve tablaları halı ya da keçeyle kapla; kumaşı alt yüze dolayıp zımbala. Direk gelecek noktaları kumaşta çapraz kesip açık bırak.</p>'},
    {t:'Kuleyi kur',add:['base','post','plat','topP'],tools:['matkap','havsa'],x:`<p>İlk direği tabana alttan 2 adet 6×100 vidayla bağla, tablayı üstüne oturtup yukarıdan vidala. Tablalar sırayla sağa sola kayar (tabla yükseklikleri: ${ys.map(y=>R(y)+' mm').join(', ')}). Her direği bir önceki tablanın üstüne aynı şekilde bağla.</p>`},
    {t:'Dengeyi kontrol et',tools:['metre'],x:`<p>Kuleyi düz zemine koy, üst tablayı itip sallanıyor mu dene.${H>1000?' Üst tablayı duvar kayışıyla bağla.':''}</p>`}];
  return c;
}

/* 6) Yükseltilmiş mama standı */
function petFeeder(p,o){
  const parts=[], Db=p.D, H=p.H, m=o.mat||'ply18', W=2*Db+150, D=Db+90;
  BOX(parts,'top','Üst tabla',m,0,H-18,0,W,18,D,{cutNote:`2 adet Ø${Db-12} delik`});
  BOX(parts,'side','Yan panel',m,0,0,0,18,H-18,D);BOX(parts,'side','Yan panel',m,W-18,0,0,18,H-18,D);
  BOX(parts,'back','Arka panel',m,18,0,0,W-36,H-18,18);
  BOX(parts,'apron','Ön alın',m,18,H-18-Math.min(80,H-40),D-18,W-36,Math.min(80,H-40),18);
  for(const cx of [W/2-Db/2-25,W/2+Db/2+25]) PART(parts,'bowl','Paslanmaz mama kabı','steel',cylRings([cx,H,D/2],[cx,H+45,D/2],Db/2-22,Db/2,32),{smooth:true});
  const hw=[[`Paslanmaz mama kabı Ø${Db} mm (kenarlı)`,'2 adet','önce kabı al, deliği ona göre kes'],['Sunta vidası 4×40','16 adet',''],['Ahşap tutkalı','1 şişe',''],['Kaydırmaz keçe','4 adet',''],m==='mdf18'?['Astar + su geçirmez boya','250 ml + 250 ml','']:['Su bazlı vernik','250 ml','su sıçramasına karşı']];
  const c={parts,hw,join:'Vida + tutkal',notes:[{t:'tip',x:`Kap ağzı ${H} mm yükseklikte; köpeğin omuz yüksekliğinin yaklaşık 15 cm altı uygundur.`}]};
  c.tools=stdTools(['daire','dekupaj','pergel','metre','kalem','matkap','havsa',['koseIsk','2 adet'],'zimKag',m==='mdf18'?'boya':'firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','metre'],x:cutUL(c,K)},
    {t:'Kap deliklerini aç',tools:['pergel','dekupaj','matkap'],x:`<p>Kabı ters çevirip ${K('top')} üst tablaya koy, ağız kenarını çiz; sonra çizginin 6 mm içinden ikinci bir daire çiz (yaklaşık Ø${Db-12}). İç daireye matkapla başlangıç deliği açıp dekupajla kes; kap kenarından asılı kalır.</p>`,warn:'Deliği kabın ağız çapından büyük kesme; kap düşer.'},
    {t:'Gövdeyi kur',add:['side','back','apron'],tools:['matkap','koseIsk'],x:`<p>${K('side')} yan panelleri ${K('back')} arka panele ve ${K('apron')} ön alına tutkal ve vidayla bağla.</p>`},
    {t:'Üst tablayı tak',add:['top'],tools:['matkap','havsa'],x:`<p>${K('top')} tablayı üstten vidala, vida başlarını havşala ve macunla kapat.</p>`},
    Object.assign(finishStep(m==='mdf18'?{paint:1}:{}),{add:['bowl']})];
  return c;
}

/* 7) Palet sehpa */
function pallet(p,o){
  const parts=[], L=p.L, W=p.W, nL=o.layers||1, bk=LM('cam',20,95), blk=LM('cam',70,95), wh=75;
  let y=wh;
  for(let l=0;l<nL;l++){
    const xs=[0,L/2-47.5,L-95], zs=[0,W/2-47.5,W-95];
    xs.forEach(x=>BOX(parts,'bottomB','Alt tahta',bk,x,y,0,95,20,W));y+=20;
    xs.forEach(x=>zs.forEach(z=>BOX(parts,'block','Takoz',blk,x,y,z,95,70,95)));y+=70;
    xs.forEach(x=>BOX(parts,'stringer','Kuşak tahtası',bk,x,y,0,95,20,W));y+=20;
    const n=Math.max(4,Math.floor((W+15)/(95+15)));spread(n,0,W,95).forEach(z=>BOX(parts,'deck','Üst tahta',bk,0,y,z,L,20,95));y+=20;}
  if(o.glass) BOX(parts,'glass','Temperli cam tabla','glass',20,y,20,L-40,8,W-40);
  for(const x of [20,L-90]) for(const z of [20,W-90]) BOX(parts,'wheel','Tekerlek','steel',x,0,z,70,wh,70);
  const c={parts,hw:[...(o.glass?[[`Temperli cam 8 mm, ${L-40}×${W-40} mm, rodajlı`,'1 adet','camcıya kestir'],['Şeffaf silikon cam tamponu','8 adet','']]:[]),['Sunta vidası 4×50','1 kutu',''],['Frenli döner tekerlek 75 mm','4 adet','vidasıyla'],['Ahşap tutkalı','1 şişe',''],['Zımpara 60/80/120','her kumdan 3','eski palet kaba olur'],['Su bazlı vernik veya ahşap yağı','0,75 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:'Hazır palet kullanacaksan üzerinde "HT" (ısıl işlem) damgası olsun; "MB" damgalı paletler ilaçlıdır, ev içinde kullanma.'}]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','matkap','havsa',['isk','2 adet'],'zimMak','zimKag','firca','maske']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K),tip:'Eski palet sökeceksen çivileri levyeyle değil, testere bıçağıyla tahtaların arasından keserek ayır; tahta kırılmaz.'},
    {t:'Tahtaları zımparala',tools:['zimMak','zimKag','maske'],x:'<p>Bütün tahtaları 60 kumdan başlayıp 120 kuma kadar zımparala. Kıymık bırakan kenarları yuvarlat.</p>'},
    {t:'Palet katını kur',add:['bottomB','block','stringer','deck'],tools:['matkap','isk','gonye'],x:`<p>${K('bottomB')} alt tahtaları yere diz, üstlerine ${K('block')} takozları tutkal ve vidayla bağla. ${K('stringer')} kuşakları takozların üstüne, ${K('deck')} üst tahtaları aralarında yaklaşık 15 mm boşlukla en üste vidala.${nL>1?' İkinci katı aynı şekilde kurup birinci katın üstüne vidala.':''}</p>`},
    {t:'Tekerlekleri tak',add:['wheel'],tools:['matkap'],x:'<p>Sehpayı ters çevir, tekerlekleri köşe takozlarının altına vidala.</p>'},
    finishStep({}),
    ...(o.glass?[{t:'Cam tablayı yerleştir',add:['glass'],tools:['metre'],x:`<p>Üst tahtaların köşelerine ve ortasına şeffaf silikon tampon yapıştır, ${L-40}×${W-40} mm temperli camı her yandan 20 mm içeride kalacak şekilde ortala.</p>`,warn:'Yalnızca temperli (sertleştirilmiş) cam kullan; düz cam kırılınca keskin parçalara ayrılır.'}]:[])];
  return c;
}

/* 8) Gizli konsollu duvar rafı */
function floatShelf(p,o){
  const parts=[], L=p.L, D=p.D, sp=o.sp||'mese', T=40;
  BOX(parts,'shelf','Raf',LM(sp,T,D),0,0,0,L,T,D,{cutNote:'arka kenara çubuk delikleri'});
  BOX(parts,'plate','Gizli konsol plakası','steel',L*.1,8,-6,L*.8,24,6);
  const nr=L>800?3:2, cap=Math.min(25,nr*8);
  const c={parts,hw:[[`Gizli raf konsolu (${nr} çubuklu, Ø12)`,'1 takım',`yaklaşık ${cap} kg taşır`],['Dübel + vida 8×80',nr*2+' adet','duvar tipine göre'],['Ahşap yağı veya sert vernik','250 ml','']],join:'Gizli çubuk konsol',
    notes:[{t:'warn',x:'Gizli konsolun taşıma kapasitesi duvara bağlıdır. Alçıpanda kapasite yarıya iner; yükü dikmeye bağla.'},{t:'tip',x:`Raf ${T} mm kalın; çubuklar arka kenardan ${R(D*.75)} mm içeri girer.`}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','terazi','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Rafı kes ve zımparala',add:['shelf'],tools:['gonyeT','zimMak'],x:`${cutUL(c,K)}<p>Kenarları hafifçe kır, yüzeyleri 180 kuma kadar zımparala.</p>`},
    {t:'Konsolu duvara tak',add:['plate'],tools:['terazi','matkap'],x:'<p>Konsol plakasını su terazisiyle hizalayıp duvara işaretle, dübelle ve vidala. Çubuklar dışarı bakar.</p>'},
    {t:'Çubuk deliklerini aç',tools:['matkap','metre','kalem'],x:`<p>Konsoldaki çubuk aralıklarını rafın arka kenarına aktar; kenarın tam ortasında olsunlar (${T/2} mm). 12 mm uçla ${R(D*.75)} mm derinlikte, raf yüzüne tam paralel del.</p>`,tip:'Tek başına düz delmek zordur; matkap kılavuzu ya da iki yanına gönye tutan bir yardımcı kullan.'},
    Object.assign(finishStep({}),{t:'Bitir ve rafı geçir',x:'<p>Yağ ya da verniği uygula, kurusun. Rafı çubuklara geçirip duvara kadar it.</p>'})];
  return c;
}

/* 9) Monitör yükseltici */
function riser(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, sp=o.sp||'mese', k=LM(sp,20,D);
  BOX(parts,'top','Üst tabla',k,0,H-20,0,W,20,D);
  BOX(parts,'leg','Yan ayak',k,30,0,0,20,H-20,D);BOX(parts,'leg','Yan ayak',k,W-50,0,0,20,H-20,D);
  const c={parts,hw:[['Ahşap dübel 8×35','8 adet',''],['Ahşap tutkalı','1 şişe',''],['Keçe ayak','4 adet',''],['Sert yağ veya su bazlı vernik','100 ml','']],join:'Dübel + tutkal',
    notes:[{t:'tip',x:`Altında ${W-100} × ${H-20} mm boşluk kalır; klavye sığar.`}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','dubelSet',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Dübel deliklerini aç',tools:['dubelSet','matkap'],x:`<p>${K('leg')} ayakların üst kenarına, kenarlardan 40 mm içeride ve ortada 4'er adet 8 mm dübel deliği aç (18 mm derinlik). Merkezleme pimlerini deliklere tak, tablayı ayaklarla hizalayıp bastır; pimler tabladaki delik yerlerini işaretler.</p>`},
    {t:'Birleştir',add:['top','leg'],tools:['isk','gonye'],x:`<p>Dübellere ve yüzlere tutkal sür, ${K('top')} tablayı ayaklara oturt. İşkenceyle sık, gönyeyle 90° kontrol et, 2 saat beklet.</p>`},
    finishStep({})];
  return c;
}

/* 10) Piknik masası */
function picnic(p,o){
  const parts=[], L=p.L, sp=o.sp||'emp', bk=LM(sp,28,140), lk=LM(sp,45,95), Ht=740, Hs=440, nT=5, TW=nT*140+(nT-1)*6, zc=900;
  spread(nT,zc-TW/2,zc+TW/2,140).forEach(z=>BOX(parts,'top','Tabla tahtası',bk,0,Ht-28,z,L,28,140));
  const sIn=TW/2+150;
  for(const sg of [-1,1]) spread(2,0,286,140).forEach(o2=>BOX(parts,'seat','Oturak tahtası',bk,0,Hs-28,sg<0?zc-sIn-286+o2:zc+sIn+o2,L,28,140));
  const ext=sIn+286+30;
  for(const xe of [250,L-295]){
    BOX(parts,'cleatT','Tabla kuşağı',lk,xe+45,Ht-28-95,zc-TW/2+20,45,95,TW-40);
    BOX(parts,'cleatS','Oturak kuşağı',lk,xe+45,Hs-28-95,zc-ext,45,95,2*ext);
    for(const sg of [-1,1]){const T=[xe+22.5,Ht-40,zc+sg*(TW/2-140)],B=[xe+22.5,0,zc+sg*(sIn+160)];
      PART(parts,'leg','Çapraz ayak',lk,barRings(B,T,95,45,[1,0,0]),{cut:[R(v3.len(v3.sub(T,B))+40),95,45],cutNote:`uçlar ${(Math.atan(Math.abs(T[2]-B[2])/(T[1]-B[1]))*180/Math.PI).toFixed(0)}° açılı`});}}
  if(o.umb) PART(parts,'umb','Şemsiye deliği','hole',cylRings([L/2,Ht,zc],[L/2,Ht+1,zc],25,25,24),{deco:true,smooth:true});
  const c={parts,hw:[...(o.umb?[['Şemsiye ayağı (en az 25 kg)','1 adet','masanın altına'],['Delik kapağı (Ø50)','1 adet','şemsiye yokken']]:[]),['Galvaniz cıvata M10×120 + somun + pul','16 takım','ayak-kuşak'],['Paslanmaz vida 5×60',(nT+4)*4+' adet','tahtalar'],['Dış mekân ahşap yağı','2 L','2-3 kat']],join:'Cıvata + paslanmaz vida',
    notes:[{t:'tip',x:`6-8 kişilik; tabla ${TW} mm genişlikte, oturaklar yerden ${Hs} mm.`},L>1800?{t:'warn',x:'1800 mm üstü boyda tabla ve oturak ortada esneyebilir; ortaya üçüncü bir kuşak çifti ekle.'}:null]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Uç çerçevelerini kur',add:['leg','cleatT','cleatS'],tools:['matkap','isk','aciOlcer'],x:`<p>İki ${K('leg')} ayağı yere X değil A biçiminde yatır; üstte aralarında ${TW-280} mm, altta ${2*(sIn+160)} mm olsun. ${K('cleatT')} tabla kuşağını üst uçlara, ${K('cleatS')} oturak kuşağını yerden ${Hs-28} mm yükseklikte (üst kenarı) yatay tut; her kesişime 10 mm delik açıp M10 cıvatayla bağla. İkinci çerçeveyi aynı yap.</p>`},
    {t:'Tablayı kur',add:['top'],tools:['matkap','havsa'],x:`<p>İki çerçeveyi uçlardan 250 mm içeride dik tut, ${nT} ${K('top')} tabla tahtasını 6 mm aralıkla kuşaklara 2'şer paslanmaz vidayla bağla.</p>`},
    {t:'Oturakları tak',add:['seat'],tools:['matkap','havsa'],x:`<p>${K('seat')} oturak tahtalarını her iki yana ikişer, oturak kuşaklarına vidala.</p>`},
    ...(o.umb?[{t:'Şemsiye deliğini aç',add:['umb'],tools:['panc','matkap'],x:`<p>Tablanın tam ortasına (uçlardan ${R(L/2)} mm) Ø50 mm panç ile delik aç. Delik orta tahtaya denk gelir; çevresini 120 kumla yuvarlat.</p>`}]:[]),
    finishStep({outdoor:1})];
  return c;
}

/* 11) Torba atma oyunu (cornhole) */
function cornhole(p,o){
  const parts=[], W=p.W, L=p.L, sp=o.sp||'cam', back=R(L*.25), front=R(L*.055), a=Math.asin((back-front)/L), Lz=L*Math.cos(a), t=12, fk=LM(sp,20,95);
  const deck=(y0,y1,th)=>[[0,y0],[Lz,y1],[Lz,y1-th],[0,y0-th]];
  PART(parts,'deck','Atış yüzeyi','ply12',prism('x',deck(back,front,t),0,W),{cut:[L,W,12],cutNote:'Ø152 delik açılır'});
  for(const x of [0,W-20]) PART(parts,'rail','Yan kasa',fk,prism('x',deck(back-t,front-t,95),x,20),{cut:[R(L),95,20],cutNote:'uçlar açılı'});
  BOX(parts,'endF','Ön kasa',fk,20,front-t-95,Lz-20,W-40,95,20,{cut:[W-40,95,20]});BOX(parts,'endB','Arka kasa',fk,20,back-t-95,0,W-40,95,20,{cut:[W-40,95,20]});
  for(const x of [20,W-40]) BOX(parts,'leg','Arka ayak',fk,x,0,20,20,back-t-95,95);
  const s=R(L*.19), C=[W/2,back-s*Math.sin(a)+.5,s*Math.cos(a)], nrm=[0,Math.cos(a),Math.sin(a)];
  PART(parts,'hole','Atış deliği','hole',cylRings(C,v3.add(C,v3.mul(nrm,1)),76,76,32),{deco:true,smooth:true});
  const c={parts,hw:[['Sunta vidası 3,5×30','1 kutu',''],['Ahşap tutkalı','1 şişe',''],['Torba seti (8 adet, 2 renk)','1 takım','hazır alınır'],o.paint?['Astar + akrilik boya + su bazlı vernik','1 takım','']:['Su bazlı vernik','0,5 L','torba kayabilsin, yüzey pürüzsüz olsun']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Delik merkezi arka kenardan ${s} mm, delik Ø152. Oyun iki tahtayla oynanır; iki adet yap.`}]};
  c.tools=stdTools(['daire','ray','pergel','dekupaj','gonyeT','aciOlcer','metre','kalem','matkap',['isk','2 adet'],'zimMak','zimKag',o.paint?'boya':'firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT'],x:cutUL(c,K)},
    {t:'Atış deliğini aç',tools:['pergel','dekupaj','matkap'],x:`<p>${K('deck')} yüzeyde delik merkezini işaretle: ortada, üst kenardan ${s} mm. 76 mm yarıçaplı daireyi çiz, içine matkapla başlangıç deliği aç ve dekupajla kes. Kenarları iyice zımparala.</p>`},
    {t:'Kasayı kur',add:['rail','endF','endB'],tools:['matkap','isk'],x:`<p>${K('rail')} yan kasaları ${K('endF')} ön ve ${K('endB')} arka kasayla birleştir; yan kasaların uçları yüzey eğimine uyacak şekilde açılı kesilir.</p>`},
    {t:'Yüzeyi tak',add:['deck'],tools:['matkap','havsa'],x:`<p>${K('deck')} yüzeyi kasanın üstüne tutkal ve 150 mm arayla vidayla bağla; vida başlarını havşalayıp macunla kapat.</p>`},
    {t:'Arka ayakları tak',add:['leg'],tools:['matkap'],x:`<p>${K('leg')} ayakları arka köşelere, arka kenar yerden ${back} mm olacak şekilde vidala. Katlanır olsun istersen tek cıvatayla bağla.</p>`},
    finishStep(o.paint?{paint:1}:{})];
  return c;
}

/* 12) Bahçe kafesi */
function trellis(p,o){
  const parts=[], W=p.W, H=p.H, s=o.s||150, sp=o.sp||'emp', fk=LM(sp,20,45), lk=LM(sp,10,30);
  BOX(parts,'stile','Dikey kenar',fk,0,0,0,45,H,20);BOX(parts,'stile','Dikey kenar',fk,W-45,0,0,45,H,20);
  BOX(parts,'railH','Yatay kenar',fk,45,0,0,W-90,45,20);BOX(parts,'railH','Yatay kenar',fk,45,H-45,0,W-90,45,20);
  const nv=Math.max(1,Math.round((W-90)/s)-1), nh=Math.max(1,Math.round((H-90)/s)-1);
  spread(nv,45+s-15,W-45-s+15,30).forEach(x=>BOX(parts,'latV','Dikey çıta',lk,x,45,20,30,H-90,10));
  spread(nh,45+s-15,H-45-s+15,30).forEach(y=>BOX(parts,'latH','Yatay çıta',lk,45,y,30,W-90,30,10));
  const c={parts,hw:[['Paslanmaz zımba teli veya çivi 1,6×30','1 paket',''],['Duvar mesafe takozu','4 adet','arkada hava payı bırakır'],['Paslanmaz vida 4×40','8 adet',''],['Dış mekân ahşap yağı','0,5 L','']],join:'Çivi + vida',
    notes:[{t:'tip',x:`Çıtalar arası yaklaşık ${s} mm. Duvardan 30-40 mm uzak dursun; sarmaşık arkadan da sarılır, duvar nem toplamaz.`}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','cekic','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Çerçeveyi kur',add:['stile','railH'],tools:['matkap','gonye'],x:`<p>${K('railH')} yatay kenarları ${K('stile')} dikey kenarların arasına vidayla bağla, çaprazları eşitle.</p>`},
    {t:'Kafes çıtalarını çak',add:['latV','latH'],tools:['cekic','metre'],x:`<p>Önce ${K('latV')} dikey çıtaları çerçevenin önüne eşit aralıkla, sonra ${K('latH')} yatay çıtaları onların üstüne çak. Her kesişime bir çivi at.</p>`,tip:`${s} mm'lik bir ara takozu kes; çıtaları ona dayayarak yerleştirirsen aralar eşit olur.`},
    finishStep({outdoor:1}),
    {t:'Yerine tak',tools:['matkap'],x:'<p>Duvara mesafe takozlarıyla vidala ya da toprağa çakılan iki direğe bağla.</p>'}];
  return c;
}

/* 13) Altıgen duvar rafı */
function hexShelf(p,o){
  const parts=[], s=p.W, D=p.D, sp=o.sp||'cam', t=20, k=LM(sp,20,D>140?190:140), set=o.set||1, h=Math.sqrt(3)*s/2;
  const centers=set===1?[[s,h]]:[[s,h],[s+1.5*s+12,h+h+6],[s+3*s+24,h]];
  centers.forEach(([cx,cy])=>{for(let i=0;i<6;i++){
    const a0=i*Math.PI/3,a1=(i+1)*Math.PI/3, v0=[cx+s*Math.cos(a0),cy+s*Math.sin(a0)], v1=[cx+s*Math.cos(a1),cy+s*Math.sin(a1)];
    const mx=(v0[0]+v1[0])/2,my=(v0[1]+v1[1])/2, nin=v3.norm([cx-mx,cy-my,0]);
    const P0=[v0[0]+nin[0]*t/2,v0[1]+nin[1]*t/2,D/2],P1=[v1[0]+nin[0]*t/2,v1[1]+nin[1]*t/2,D/2];
    PART(parts,'side','Kenar tahtası',k,barRings(P0,P1,D,t,nin),{cut:[s,D,t],cutNote:'iki uç 30° gönyeli'});}});
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Çivi 1,2×30','1 paket','gönyeli köşeler'],['Gizli raf askısı (anahtar deliği)',set*2+' adet',''],['Su bazlı vernik veya yağ','250 ml','']],join:'Gönyeli tutkal + çivi',
    notes:[{t:'tip',x:`${set===1?'Tek altıgen':'Üçlü bal peteği dizilimi'}; her altıgen ${R(2*s)} mm genişlik, ${R(2*h)} mm yükseklik.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','kayis','cekic','matkap','terazi','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Kenarları gönyeli kes',tools:['gonyeT','aciOlcer'],x:`${cutUL(c,K)}<p>Gönye makinesini 30°'ye ayarla; her parçanın iki ucunu birbirine bakan (yamuk) biçimde kes. Uzun kenar ölçüsü <b class="mono">${s} mm</b>.</p>`,tip:'İlk parçayı kestikten sonra durdurma takozu bağla; altı parçanın eşit olması altıgenin kapanması için şart.'},
    {t:'Altıgeni yapıştır',add:['side'],tools:['kayis','cekic'],x:`<p>Altı ${K('side')} parçayı dış yüzleri aşağı bakacak şekilde bant üstüne yan yana diz, gönyeli yüzlere tutkal sür ve bandı katlayarak altıgeni kapat. Kayış işkenceyle sık, kuruyunca köşelere ince çivi çak.${set>1?' Üç altıgeni aynı şekilde yap.':''}</p>`},
    finishStep({}),
    {t:'Duvara as',tools:['terazi','matkap'],x:`<p>Her altıgenin üst kenarının arkasına iki gizli askı tak, su terazisiyle hizalayıp duvara as.${set>1?' Altıgenler arasında 12 mm boşluk bırakırsan dizilim daha düzgün görünür.':''}</p>`}];
  return c;
}

/* 14) Kuş yemliği */
function birdFeeder(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, m='ply12', t=12, sp=o.sp||'cam', th=deg(35), rh=(W/2)*Math.tan(th), lk=LM(sp,10,30), pk=LM(sp,20,20), yt=t+H;
  BOX(parts,'tray','Yem tablası',m,0,0,0,W,t,D);
  BOX(parts,'lip','Kenar çıtası',lk,0,t,0,W,30,10);BOX(parts,'lip','Kenar çıtası',lk,0,t,D-10,W,30,10);
  BOX(parts,'lipS','Yan kenar çıtası',lk,0,t,10,10,30,D-20);BOX(parts,'lipS','Yan kenar çıtası',lk,W-10,t,10,10,30,D-20);
  for(const x of [14,W-34]) for(const z of [14,D-34]) BOX(parts,'post','Direk',pk,x,t,z,20,H,20);
  for(const z of [14,D-26]) PART(parts,'gable','Çatı üçgeni',m,prism('z',[[14,yt],[W-14,yt],[W/2,yt+(W/2-14)*Math.tan(th)]],z,t),{cut:[W-28,R((W/2-14)*Math.tan(th)),t],cutNote:'35° kesilir'});
  const ridge=[W/2,yt+(W/2-14)*Math.tan(th)], len=(W/2)/Math.cos(th)+25;
  for(const dx of [-1,1]){const d=[dx*Math.cos(th),-Math.sin(th)], nv=[dx*Math.sin(th),Math.cos(th)], P1=[ridge[0]+d[0]*len,ridge[1]+d[1]*len];
    PART(parts,'roof','Çatı paneli',m,prism('z',[ridge,P1,[P1[0]+nv[0]*t,P1[1]+nv[1]*t],[ridge[0]+nv[0]*t,ridge[1]+nv[1]*t]],-25,D+50),{cut:[D+50,R(len),t],cutNote:'mahya kenarı 35° kesilir'});}
  const c={parts,hw:[['Paslanmaz vida 3,5×25','1 paket',''],['Ahşap tutkalı (D3)','1 şişe',''],['4 kollu asma zinciri + halka','1 takım',''],['Zehirsiz dış mekân yağı','250 ml','tabla iç yüzüne sürme']],join:'Vida + tutkal',
    notes:[{t:'tip',x:'Tablaya köşelerden 6 mm drenaj deliği aç; yağmur suyu birikmez, yem küflenmez.'},{t:'warn',x:'Yemlik tablasının iç yüzünü boyama ya da cilalama; kuşlar gagalar.'}]};
  c.tools=stdTools(['daire','gonyeT','aciOlcer','metre','kalem','matkap','havsa','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Tablayı hazırla',add:['tray','lip','lipS'],tools:['matkap'],x:`<p>${K('tray')} tablanın köşelerine 6 mm drenaj deliği aç. ${K('lip')} ve ${K('lipS')} kenar çıtalarını tutkal ve vidayla çevresine tak; yem dökülmez.</p>`},
    {t:'Direkleri tak',add:['post'],tools:['matkap'],x:`<p>Dört ${K('post')} direği köşelerden 14 mm içeride, tablanın altından birer vidayla bağla.</p>`},
    {t:'Çatıyı kur',add:['gable','roof'],tools:['matkap','aciOlcer'],x:`<p>${K('gable')} çatı üçgenlerini direklerin üstüne vidala. ${K('roof')} çatı panellerini üçgenlere tutkal ve vidayla bağla; tepede birleşsinler.</p>`},
    {t:'As ve doldur',tools:['matkap'],x:'<p>Çatının dört köşesine halka vida tak, zinciri bağla. Kedilerin ulaşamayacağı, 1,5-2 m yükseklikte bir dala as.</p>'}];
  return c;
}

/* ---------- 2026-11 eklemeleri: atölye, çocuk, mutfak, ev ---------- */
/* 15) Testere sehpası */
function sawHorse(p,o){
  const parts=[], L=p.L, H=p.H, sp=o.sp||'cam', bk=LM(sp,45,95), lk=LM(sp,45,70), a=deg(15), ta=Math.tan(a), zc=70+H*ta, lh=H-95, gh=Math.min(220,R(lh*.35));
  const off=(y)=>46+(H-y)*ta, sets=o.pair?[0,2*zc+150]:[0];
  sets.forEach(z0=>{
    BOX(parts,'beam','Üst kiriş',bk,0,lh,z0+zc-22.5,L,95,45);
    for(const x of [95,L-95]) for(const s of [-1,1])
      PART(parts,'leg','Ayak',lk,barRings([x,0,z0+zc+s*(off(0))],[x,H,z0+zc+s*off(H)],70,45,[0,0,1]),{cut:[R(H/Math.cos(a)+40),70,45],cutNote:'iki ucu 15° açılı'});
    const yb=lh-gh, wb=off(yb)+23, wt=off(lh)+23;
    for(const x of [130,L-148]) PART(parts,'gusset','Bağlantı plakası','ply18',prism('x',[[z0+zc-wb,yb],[z0+zc+wb,yb],[z0+zc+wt,lh],[z0+zc-wt,lh]],x,18),{cut:[R(2*wb),gh,18],cutNote:'yamuk kesilir'});
  });
  const k=sets.length;
  const c={parts,hw:[['Vida 5×80',k*16+' adet','ayaklar kirişe'],['Vida 4×40',k*16+' adet','plakalar'],['Ahşap tutkalı','1 şişe','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Çalışma yüksekliği ${H} mm. Kendi boyuna göre ayarla: kol aşağıda, avuç içi yere paralelken bileğinin yüksekliği iyi bir başlangıçtır.`},{t:'warn',x:'Kirişin üstü kurban yüzeydir; testere bıçağı kirişe değebilir. Vidaları kiriş üst yüzüne 30 mm\'den yakın koyma.'}]};
  c.tools=stdTools(['gonyeT','aciOlcer','daire','metre','kalem','matkap','havsa','gonye','zimKag']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer','daire'],x:`${cutUL(c,K)}<p>${K('leg')} ayakların iki ucunu birbirine paralel 15° kes; böylece ayak yere ve kirişin üstüne düz oturur.</p>`},
    {t:'Ayakları kirişe bağla',add:['beam','leg'],tools:['matkap','havsa','gonye'],x:`<p>${K('beam')} kirişi iki takoz üstüne yatır. Her ${K('leg')} ayağı kirişin yan yüzüne, uçtan 60 mm içeride, üst ucu kirişle aynı hizada olacak şekilde dayayıp tutkal ve 4 vidayla bağla. Karşılıklı ayakların dışa açısı eşit olsun.</p>`,tip:'Önce bir uçtaki iki ayağı tak, sehpayı ters çevirip çaprazları ölç; sonra diğer ucu aynı ölçüyle tak.'},
    {t:'Bağlantı plakalarını tak',add:['gusset'],tools:['matkap'],x:`<p>${K('gusset')} plakaları ayakların iç yüzüne, kirişin hemen altına tutkal ve vidayla bağla. Plaka iki ayağı birbirine kilitler; sehpa yana yatmaz.</p>`},
    {t:'Dengele',tools:['metre','zimKag'],x:`<p>Sehpayı düz zemine koy. Sallanıyorsa uzun ayağın ucundan zımparayla al.${o.pair?' İki sehpanın yüksekliğini eşitle.':''}</p>`}];
  return c;
}

/* 16) Fransız askılı alet panosu */
function toolWall(p,o){
  const parts=[], W=p.W, H=p.H, m='ply18', step=150, n=Math.max(2,Math.floor((H-60)/step)), ys=[];
  BOX(parts,'panel','Arka pano',m,0,0,0,W,H,18);
  for(let i=0;i<n;i++){const y=50+i*step;ys.push(y);
    PART(parts,'cleat','Askı çıtası',m,prism('x',[[18,y],[36,y],[36,y+95],[18,y+77]],0,W),{cut:[W,95,18],cutNote:'üst kenarı 45° kesilir'});}
  if(o.hold){const yT=ys[n-1], yM=ys[Math.max(0,n-2)];
    BOX(parts,'hback','Raf sırtı','ply12',60,yT-40,36,300,120,12);BOX(parts,'hshelf','Raf tablası','ply12',60,yT-52,48,300,12,140);
    BOX(parts,'hrack','Tornavidalık','ply18',Math.min(W-360,420),yM+40,36,300,18,90,{cutNote:'Ø12-20 delikler açılır'});}
  const c={parts,hw:[['Vida 4×30',n*8+' adet','çıtalar panoya'],['Dübel + vida 8×80','6 adet','pano duvara'],['Ahşap tutkalı','1 şişe','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`${n} sıra askı çıtası, ${step} mm arayla. Her tutucunun arkasına aynı açıyla kesilmiş kısa bir çıta vidala; tutucu panoya istediğin yerde asılır.`},{t:'warn',x:'Panoyu en az 3 dikmeye ya da beton duvara dübelle bağla; dolu bir pano 40 kg\'ı geçebilir.'}]};
  c.tools=stdTools(['daire','ray','metre','kalem','matkap','havsa','terazi',o.hold?'forstnerSet':null,'zimKag']);
  c.mkSteps=K=>{const S=[
    {t:'Parçaları kes',tools:['daire','ray'],x:`${cutUL(c,K)}<p>Daire testerenin bıçağını 45° eğ ve ${K('cleat')} çıtaları bu açıyla şeritler halinde kes. Her şeridin bir kenarı düz, diğeri eğik kalır.</p>`},
    {t:'Çıtaları panoya tak',add:['panel','cleat'],tools:['matkap','havsa','metre'],x:`<p>${K('panel')} panoyu yere yatır. ${K('cleat')} çıtaları eğik kenar yukarı ve duvara bakacak şekilde, ${step} mm arayla tutkal ve vidayla tak.</p>`,tip:`${step-95} mm'lik bir ara takozu kes; çıtaları ona dayayarak dizersen aralar eşit olur.`}];
    if(o.hold) S.push({t:'Tutucuları yap',add:['hback','hshelf','hrack'],tools:['matkap','forstnerSet'],x:`<p>${K('hshelf')} tablayı ${K('hback')} sırta tutkal ve vidayla bağla. ${K('hrack')} parçaya tornavida ve pense sapları için Ø12-20 delikler aç. Her tutucunun arkasına kısa bir 45° çıta tak.</p>`});
    S.push({t:'Duvara as',tools:['terazi','matkap'],x:'<p>Panoyu su terazisiyle hizala, dübel ve vidayla duvara bağla. Tutucuları çıtalara as.</p>'});
    return S;};
  return c;
}

/* 17) İşkence rafı */
function clampRack(p,o){
  const parts=[], W=p.W, A=p.D, sp=o.sp||'cam', rk=LM(sp,20,95), ak=LM(sp,45,45), n=Math.max(2,Math.floor((W-60)/(o.space||120))+1);
  BOX(parts,'rail','Duvar kirişi',rk,0,0,0,W,95,20);
  spread(n,30,W-30,45).forEach(x=>BOX(parts,'arm','Taşıyıcı kol',ak,x,25,20,45,45,A,{cutNote:'ön ucu 10 mm yukarı pahlanır'}));
  const c={parts,hw:[['Vida 5×80',n*2+' adet','kollar arkadan'],['Dübel + vida 8×80',W>800?'4 adet':'3 adet','duvara'],['Ahşap tutkalı','1 şişe','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`${n} kol, ${A} mm uzunlukta. Her kola 2-3 işkence asılır; kolların arası işkence gövdesinin geçeceği kadar (en az 60 mm) açık kalmalı.`}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','havsa','terazi','zimKag']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:`${cutUL(c,K)}<p>${K('arm')} kolların ön ucunun üst kenarına küçük bir pah kır; işkence kayıp düşmez.</p>`},
    {t:'Kolları kirişe bağla',add:['rail','arm'],tools:['matkap','havsa'],x:`<p>${K('rail')} kirişe kol yerlerini eşit arayla işaretle. Kolları tutkalla, arkadan ikişer 5×80 vidayla bağla.</p>`},
    {t:'Duvara as',tools:['terazi','matkap'],x:'<p>Kirişi su terazisiyle hizala, dübel ve vidayla duvara bağla. Kolların arasına vida gelecek şekilde del.</p>'}];
  return c;
}

/* 18) Öğrenme kulesi */
function learnTower(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, m='ply18', t=18, ph=o.ph||350, ck=LM('kayin',20,45), sy=R(ph/2);
  BOX(parts,'side','Yan panel',m,0,0,0,t,H,D,{cutNote:'tutma ve pencere boşlukları açılır'});BOX(parts,'side','Yan panel',m,W-t,0,0,t,H,D,{cutNote:'tutma ve pencere boşlukları açılır'});
  BOX(parts,'cleat','Tabla kuşağı',ck,t,ph-t-45,0,20,45,D);BOX(parts,'cleat','Tabla kuşağı',ck,W-t-20,ph-t-45,0,20,45,D);
  BOX(parts,'deck','Basamak tablası',m,t,ph-t,0,W-2*t,t,D);
  BOX(parts,'kick','Arka bağlantı',m,t,0,0,W-2*t,120,t);
  BOX(parts,'step','Alt basamak',m,t,sy-t,D-200,W-2*t,t,200);
  const rails=[[H-60,D-55],[H-60,30],[H-260,30]];
  if(ph+340<H-60) rails.push([ph+300,D-55]);
  rails.forEach(([y,z])=>BOX(parts,'rail','Korkuluk çubuğu','kav25',t,y,z,W-2*t,25,25,{cut:[W-2*t+24,25,25],cutNote:'iki ucu 12 mm yanlara gömülür'}));
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 4×40','1 paket',''],['Kaydırmaz keçe ayak','4 adet',''],['Su bazlı, çocuğa uygun vernik','0,5 L','EN 71-3 işaretli']],join:'Vida + tutkal',
    notes:[{t:'warn',x:'Çocuk kulede her zaman bir yetişkinin gözü önünde olmalı. Kuleyi tezgâha yaslı kullan; boş alanda ittirince devrilebilir.'},
      {t:'tip',x:`Platform yerden ${ph} mm. Çocuk büyüdükçe tablayı alçalt: göğsü tezgâh hizasında olmalı.`}]};
  c.tools=stdTools(['daire','ray','dekupaj','metre','kalem','matkap','havsa','forstnerSet',['isk','2 adet'],'gonye','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:cutUL(c,K)},
    {t:'Yan panelleri işle',add:['side'],tools:['dekupaj','forstnerSet','matkap','zimMak'],x:`<p>İki ${K('side')} paneli üst üste bantla. Üst kısma çocuğun tutacağı büyük bir pencere çiz; köşelerine 35 mm delik açıp aradaki çizgiyi dekupajla kes. Korkuluk delikleri için iki paneli birlikte del (25 mm, 12 mm derinlik). Tüm kenarları 3 mm yuvarlat.</p>`,tip:'İki paneli birlikte kesip delersen delikler birebir karşılıklı gelir; çubuklar düz durur.'},
    {t:'Kuşakları ve tablayı tak',add:['cleat','deck','kick'],tools:['matkap','havsa','gonye'],x:`<p>${K('cleat')} kuşakları yan panellerin iç yüzüne, tabla altına gelecek şekilde (yerden ${ph-t-45} mm) vidala. ${K('kick')} arka bağlantıyı en alta, ${K('deck')} tablayı kuşakların üstüne tutkal ve vidayla bağla.</p>`},
    {t:'Alt basamağı tak',add:['step'],tools:['matkap','havsa'],x:`<p>${K('step')} basamağı öne, yerden ${sy-t} mm yüksekliğe yan panellerden vidala.</p>`},
    {t:'Korkulukları tak',add:['rail'],tools:['isk'],x:`<p>${K('rail')} çubuklarının uçlarına tutkal sür, deliklere oturt ve gövdeyi işkenceyle sık. Gönyeyle kontrol et, 12 saat beklet.</p>`},
    finishStep({},'<p>Vernik tamamen kuruduktan sonra (en az 3 gün) kullan.</p>')];
  return c;
}

/* 19) Çocuk kitaplığı (kapağı önde) */
function bookDisplay(p,o){
  const parts=[], W=p.W, H=p.H, N=p.N, Db=280, Dt=120, t=18, sp=o.sp||'kayin', lk=LM(sp,20,70), zf=y=>Db-(Db-Dt)*y/H;
  for(const x of [0,W-t]) PART(parts,'side','Yan panel','ply18',prism('x',[[0,0],[Db,0],[Dt,H],[0,H]],x,t),{cut:[H,Db,t],cutNote:`önü eğik kesilir (üstte ${Dt} mm)`});
  BOX(parts,'back','Arkalık','ply6',t,0,-6,W-2*t,H,6);
  const gap=(H-80)/N;
  for(let i=0;i<N;i++){const y=40+i*gap, lb=zf(y+60)-20;
    BOX(parts,'shelf','Raf','ply12',t,y,lb-100,W-2*t,12,100);
    BOX(parts,'lip','Ön çıta',lk,t,y,lb,W-2*t,60,20);}
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 3,5×30','1 paket',''],['Çivi 1,2×20','1 paket','arkalık'],['Duvar sabitleme aparatı','1 takım','devrilmeye karşı'],['Su bazlı, çocuğa uygun vernik','0,5 L','']],join:'Vida + tutkal',
    notes:[{t:'warn',x:'Kitaplığı mutlaka duvara sabitle; çocuk çıtalara tırmanabilir.'},{t:'tip',x:`${N} sıra, kitaplar kapağı önde durur. Her sıra ${R(gap)} mm yüksek; resimli kitapların çoğu sığar.`}]};
  c.tools=stdTools(['daire','ray','gonyeT','metre','kalem','matkap','havsa',['isk','2 adet'],'cekic','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','gonyeT'],x:`${cutUL(c,K)}<p>İki ${K('side')} paneli üst üste koyup ön kenarı birlikte kes: altta ${Db} mm, üstte ${Dt} mm derinlik.</p>`},
    {t:'Rafları ve çıtaları tak',add:['side','shelf','lip'],tools:['matkap','havsa','isk'],x:`<p>Raf yerlerini iki panele birlikte işaretle. Her ${K('shelf')} rafı ve önündeki ${K('lip')} çıtayı tutkal ve yanlardan vidayla bağla. Çıta, kitapların düşmesini önler.</p>`},
    {t:'Arkalığı çak',add:['back'],tools:['cekic','gonye'],x:`<p>Gövdenin çaprazlarını eşitle, ${K('back')} arkalığı çivi ve tutkalla çak.</p>`},
    finishStep({}),
    {t:'Duvara sabitle',tools:['matkap'],x:'<p>Sabitleme aparatını üst arkaya ve duvara vidala.</p>'}];
  return c;
}

/* 20) Çekme arabalı oyuncak kutusu */
function toyCart(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, m='ply12', t=12, wr=55, sp='kayin', bk=LM(sp,40,45), yb=wr+20, zs=[60,D-60];
  zs.forEach(z=>BOX(parts,'block','Aks takozu',bk,0,wr-20,z-22.5,W,40,45,{cutNote:'ortasından Ø21 aks deliği'}));
  BOX(parts,'bottom','Taban',m,0,yb,0,W,t,D);
  BOX(parts,'front','Ön ve arka duvar',m,0,yb+t,0,W,H,t,{cutNote:'ön duvara ip deliği'});BOX(parts,'front','Ön ve arka duvar',m,0,yb+t,D-t,W,H,t);
  BOX(parts,'wall','Yan duvar',m,0,yb+t,t,t,H,D-2*t,{cutNote:'tutma deliği açılır'});BOX(parts,'wall','Yan duvar',m,W-t,yb+t,t,t,H,D-2*t,{cutNote:'tutma deliği açılır'});
  zs.forEach(z=>{PART(parts,'axle','Aks','kav20',cylRings([-34,wr,z],[W+34,wr,z],10,10,16),{smooth:true});
    for(const x of [-26,W+4]) PART(parts,'wheel','Tekerlek','ply18',cylRings([x,wr,z],[x+18,wr,z],wr,wr,28),{cut:[2*wr,2*wr,18],cutNote:'daire kesilir, ortası Ø21'});});
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 3,5×30','1 paket',''],['Pamuk ip Ø10','1,2 m','çekme ipi'],['Pul Ø20','8 adet','tekerlek ile takoz arası'],['Su bazlı, çocuğa uygun vernik','0,5 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:'Tekerlekler aksla birlikte döner; aks takoza yağlanmadan, hafif boşluklu oturmalı.'},{t:'warn',x:'Çekme ipini 40 cm\'den uzun tutma, ucuna düğüm at; küçük çocukların boynuna dolanmasın.'}]};
  c.tools=stdTools(['daire','ray','dekupaj','pergel','metre','kalem','matkap','havsa','forstnerSet','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','dekupaj','pergel'],x:`${cutUL(c,K)}<p>${K('wheel')} tekerlekleri pergelle çiz, dekupajla dışından kes, zımparayla yuvarla.</p>`},
    {t:'Kutuyu kur',add:['bottom','front','wall'],tools:['matkap','havsa','forstnerSet'],x:`<p>${K('wall')} yan duvarlara 30×90 mm tutma deliği aç, ön duvarın ortasına ip için 12 mm delik del. Duvarları ${K('bottom')} tabanın üstüne tutkal ve vidayla kur.</p>`},
    {t:'Aksları ve tekerlekleri tak',add:['block','axle','wheel'],tools:['matkap','forstnerSet'],x:`<p>${K('block')} takozların ortasından 21 mm boydan boya delik aç, takozları tabanın altına vidala. ${K('axle')} aksları geçir, aralarına pul koyup ${K('wheel')} tekerlekleri aksların uçlarına tutkalla sabitle.</p>`},
    finishStep({},'<p>İpi ön delikten geçirip içeriden düğümle.</p>')];
  return c;
}

/* 21) Bıçak bloğu */
function knifeBlock(p,o){
  const parts=[], H=p.H, D=p.D, N=p.N, sp=o.sp||'ceviz', k=LM(sp,20,D<=140?140:190), W=20*(N+1);
  BOX(parts,'base','Taban',LM(sp,20,D<=140?140:190),-20,0,-10,W+40,20,D+20);
  for(let i=0;i<=N;i++) BOX(parts,'slab','Katman',k,i*20,20,0,20,H,D,i<N?{cutNote:'bir yüzüne 3 mm derin, 2,5 mm testere yuvası'}:{});
  const c={parts,hw:[['Ahşap tutkalı (D3)','1 şişe',''],['Vida 4×40','4 adet','alttan'],['Kaydırmaz keçe ayak','4 adet',''],['Gıdaya uygun mineral yağ','100 ml','']],join:'Tutkal',
    notes:[{t:'tip',x:`${N} bıçak yuvası. Yuvalar ${D} mm derinliğe kadar uzar; ${H} mm yükseklik, ${R(H*.9)} mm'ye kadar bıçak ağzını alır.`}]};
  c.tools=stdTools(['daire','gonyeT','metre','kalem',['isk','4 adet'],'matkap','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Katmanları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Yuvaları aç',tools:['daire'],x:`<p>${N} ${K('slab')} katmanın birer yüzüne, boyuna yönde, daire testereyle 3 mm derinlikte yuva aç. Yuvayı bir uca yakın değil, yüzün ortasından geçir.</p>`,tip:'Yuva tutkal sürerken dolmasın diye tutkalı yuvanın iki yanına ince sür.'},
    {t:'Bloğu yapıştır',add:['slab'],tools:['isk'],x:`<p>Katmanları yuvalar aynı yöne bakacak şekilde üst üste tutkalla, 4 işkenceyle sık ve bir gece beklet.</p>`},
    {t:'Tabanı tak',add:['base'],tools:['matkap','zimMak'],x:`<p>Bloğun alt yüzünü düzle, ${K('base')} tabana alttan vidala. Kenarları yuvarlat.</p>`},
    finishStep({food:1})];
  return c;
}

/* 22) Kâğıt havluluk */
function paperHolder(p,o){
  const parts=[], L=p.L, sp=o.sp||'kayin', wall=o.mount==='duvar';
  if(wall){const W=L+50, bk=LM(sp,20,95);
    BOX(parts,'plate','Duvar plakası',bk,0,0,0,W,95,20);
    for(const x of [0,W-20]) BOX(parts,'arm','Yan kulak',LM(sp,20,140),x,0,20,20,95,140,{cutNote:'ucu yuvarlatılır, Ø26 delik'});
    PART(parts,'rod','Rulo çubuğu','kav25',cylRings([10,47,110],[W-10,47,110],12.5,12.5,18),{smooth:true});}
  else{const r=80;
    PART(parts,'base','Taban',LM(sp,20,190),cylRings([r,0,r],[r,20,r],r,r,36),{cut:[2*r,2*r,20],cutNote:'daire kesilir'});
    PART(parts,'rod','Direk','kav25',cylRings([r,8,r],[r,20+L+20,r],12.5,12.5,18),{smooth:true});
    PART(parts,'cap','Topuz',LM(sp,30,40),cylRings([r,40+L,r],[r,68+L,r],20,16,20),{smooth:true,cut:[40,40,30]});}
  const c={parts,hw:wall?[['Ahşap tutkalı','1 şişe',''],['Vida 3,5×40','4 adet',''],['Dübel + vida 6×40','2 adet','duvara'],['Gıdaya uygun yağ','100 ml','']]:[['Ahşap tutkalı','1 şişe',''],['Kaydırmaz keçe ayak','3 adet',''],['Gıdaya uygun yağ','100 ml','']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`Rulo boyu ${L} mm'ye kadar. ${wall?'Çubuk bir yandan çıkarılır; rulo değiştirmek için deliklerden biri U biçiminde açık kesilir.':'Topuz yalnız sıkı geçer, yapıştırılmaz; rulo üstten değişir.'}`}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','forstnerSet',wall?'dekupaj':'pergel',wall?'terazi':'dekupaj','zimKag','firca']);
  c.mkSteps=K=>wall?[
    {t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:`${cutUL(c,K)}<p>${K('arm')} kulakların ucunu yuvarlat. Birine 26 mm delik aç, diğerinde deliği yukarıdan U biçiminde aç.</p>`},
    {t:'Kulakları tak',add:['plate','arm'],tools:['matkap','forstnerSet'],x:`<p>${K('arm')} kulakları ${K('plate')} plakanın iki ucuna arkadan vida ve tutkalla bağla. ${K('rod')} çubuğu geçir.</p>`},
    Object.assign(finishStep({food:1}),{add:['rod']}),
    {t:'Duvara as',tools:['terazi','matkap'],x:'<p>Su terazisiyle hizalayıp iki vidayla duvara bağla.</p>'}]:[
    {t:'Parçaları kes',tools:['gonyeT','pergel','dekupaj'],x:`${cutUL(c,K)}<p>${K('base')} tabanı pergelle çizip dekupajla kes.</p>`},
    {t:'Direği tak',add:['base','rod'],tools:['forstnerSet','matkap'],x:`<p>Tabanın ortasına 25 mm, 12 mm derin yuva aç. ${K('rod')} direği tutkalla yuvaya oturt, gönyede tut.</p>`},
    {t:'Topuzu yap',add:['cap'],tools:['forstnerSet','zimKag'],x:`<p>${K('cap')} topuza 25 mm, 15 mm derin delik aç, dış hatlarını zımparayla yuvarla. Direğe yapıştırmadan geçir.</p>`},
    finishStep({food:1})];
  return c;
}

/* 23) Tezgâh üstü katlı raf */
function counterShelf(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, N=p.N, sp=o.sp||'cam', k=LM(sp,20,D<=140?140:190), lk=LM(sp,10,30), ys=[];
  for(const x of [0,W-20]) BOX(parts,'side','Yan ayak',k,x,0,0,20,H,D,{cutNote:'alt ortası kavisli oyulur'});
  for(let i=0;i<N;i++){const y=i===N-1?H-20:30+i*(H-50)/(N-1);ys.push(y);
    BOX(parts,'shelf','Raf',k,20,y,0,W-40,20,D);
    BOX(parts,'lip','Arka çıta',lk,20,y+20,0,W-40,30,10);}
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 4×40',N*4+' adet',''],['Ahşap tıpa Ø8',N*4+' adet','vida başlarını örter'],['Keçe ayak','4 adet',''],['Su bazlı vernik','250 ml','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`${N} kat, katlar arası ${R((H-50)/(N-1)-20)} mm. Alt rafın altında ${R(ys[0])} mm boşluk kalır; düz tabak ya da kesme tahtası sığar.`}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','kalem','matkap','havsa','forstnerSet',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:`${cutUL(c,K)}<p>${K('side')} ayakların alt kenarının ortasından kavisli bir parça oy; raf dört noktaya basar, sallanmaz.</p>`},
    {t:'Rafları bağla',add:['side','shelf'],tools:['matkap','forstnerSet','isk'],x:`<p>Raf yerlerini iki ayağa birlikte işaretle. Vida başları için 8 mm, 5 mm derin havşa aç; ${K('shelf')} rafları tutkal ve vidayla bağla, deliklere tıpa yapıştır.</p>`},
    {t:'Arka çıtaları tak',add:['lip'],tools:['matkap'],x:`<p>${K('lip')} çıtaları her rafın arka kenarına tutkalla yapıştır; kavanozlar duvara doğru kaymaz.</p>`},
    finishStep({})];
  return c;
}

/* 24) Ayaklı portmanto */
function coatStand(p,o){
  const parts=[], H=p.H, sp=o.sp||'kayin', pk=LM(sp,45,45), fk=LM(sp,45,70), Lf=R(H*.19), c0=Lf+22.5, rows=o.rows||1, a=deg(20);
  BOX(parts,'post','Direk',pk,c0-22.5,0,c0-22.5,45,H,45);
  BOX(parts,'foot','Ayak',fk,c0+22.5,0,c0-22.5,Lf,70,45,{cutNote:'ucu 45° pahlanır'});BOX(parts,'foot','Ayak',fk,0,0,c0-22.5,Lf,70,45,{cutNote:'ucu 45° pahlanır'});
  BOX(parts,'foot','Ayak',fk,c0-22.5,0,c0+22.5,45,70,Lf,{cutNote:'ucu 45° pahlanır'});BOX(parts,'foot','Ayak',fk,c0-22.5,0,0,45,70,Lf,{cutNote:'ucu 45° pahlanır'});
  for(let r=0;r<rows;r++){const y=H-120-r*220;
    for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){const yy=y-(dz?40:0), s=[c0+dx*4.5,yy,c0+dz*4.5], e=[c0+dx*(22.5+130*Math.cos(a)),yy+130*Math.sin(a),c0+dz*(22.5+130*Math.cos(a))];
      PART(parts,'peg','Askı çubuğu','kav20',cylRings(s,e,10,10,14),{smooth:true,cut:[150,20,20]});}}
  const n=rows*4;
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 5×80','8 adet','ayaklar direğe'],['Ahşap tıpa Ø10','8 adet',''],['Keçe ayak','4 adet',''],['Sert yağ veya su bazlı vernik','0,5 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`${n} askı. Ayaklar ${2*Lf+45} mm açıklık verir; ağır montları karşılıklı as, portmanto devrilmez.`},{t:'warn',x:'Çocuklu evde direğin üst ucunu ince bir L köşebentle duvara bağla.'}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','matkap','havsa','forstnerSet',['isk','2 adet'],'gonye','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:`${cutUL(c,K)}<p>${K('foot')} ayakların dış ucunu 45° pahla; ${K('peg')} çubukların uçlarını 120 kumla yuvarla.</p>`},
    {t:'Ayakları direğe bağla',add:['post','foot'],tools:['matkap','havsa','forstnerSet','gonye'],x:`<p>${K('post')} direği ters çevir. Her ${K('foot')} ayağı direğin bir yüzüne alttan hizalı dayayıp, ayağın dış yüzünden açtığın 10 mm havşadan iki 5×80 vidayla bağla. Delikleri tıpayla kapat. Direğin dik durduğunu gönyeyle kontrol et.</p>`},
    {t:'Askı çubuklarını tak',add:['peg'],tools:['forstnerSet','matkap','aciOlcer'],x:`<p>Direğin dört yüzüne, ${rows>1?'iki sırada, ':''}üst uçtan 120 mm aşağıda iki karşılıklı, 160 mm aşağıda diğer iki karşılıklı 20 mm deliği 20° yukarı eğik, 18 mm derin aç; delikler direğin ortasında birbirine değmez. ${K('peg')} çubukları tutkalla yuvalara it.</p>`,tip:'Eğik deliği açmadan önce bir hurda parçaya 20° kesilmiş bir kılavuz takoz yap ve matkabı ona dayayarak del.'},
    finishStep({})];
  return c;
}

/* 25) Duvara katlanır masa */
function wallDesk(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, sp=o.sp||'cam', bk=LM(sp,20,95), Lb=Math.min(D-60,350), yt=H-18;
  BOX(parts,'batten','Duvar kirişi',bk,0,yt-95,0,W,95,20);BOX(parts,'batten','Duvar kirişi',bk,0,yt-Lb,0,W,95,20);
  BOX(parts,'top','Tabla',o.top==='mese'?LM('mese',20,190):'ply18',0,yt,0,W,18,D,o.top==='mese'?{cutNote:'şeritlerden tutkallanır'}:{});
  for(const x of [80,W-105]) PART(parts,'bracket','Katlanır konsol','steel',prism('x',[[20,yt],[20+Lb,yt],[20,yt-Lb]],x,25),{});
  const c={parts,hw:[['Katlanır raf konsolu (kilitli, '+Lb+' mm)','2 adet','en az 50 kg taşıyan'],['Piyano menteşesi',W+' mm','tabla kirişe'],['Dübel + vida 8×80','6 adet','kirişler duvara'],['Vida 4×25','1 paket','konsol ve menteşe'],['Su bazlı vernik','0,5 L','']],join:'Menteşe + vida',
    notes:[{t:'tip',x:`Tabla yerden ${H} mm. Kapalıyken duvardan yalnız ${Lb>300?60:50} mm çıkar.`},{t:'warn',x:'Kirişleri dikmeye ya da betona bağla; alçıpana tek başına dübel yetmez.'}]};
  c.tools=stdTools(['daire','ray','metre','kalem','matkap','havsa','terazi',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:`${cutUL(c,K)}<p>${K('top')} tablanın köşelerini 20 mm yarıçapla yuvarla; katlanırken çarpmaz.</p>`},
    {t:'Kirişleri duvara tak',add:['batten'],tools:['terazi','matkap','metre'],x:`<p>Üst ${K('batten')} kirişin üst kenarı yerden ${yt} mm olacak şekilde su terazisiyle hizala, dübel ve vidayla bağla. Alt kirişi konsolun boyuna göre ${Lb-95} mm aşağıya tak.</p>`},
    {t:'Konsolları tak',add:['bracket'],tools:['matkap','terazi'],x:`<p>İki ${K('bracket')} konsolu kirişlere, uçlardan 80 mm içeride vidala. Kilitlerinin aynı yükseklikte açılıp kapandığını dene.</p>`},
    {t:'Tablayı tak',add:['top'],tools:['matkap'],x:`<p>${K('top')} tablayı piyano menteşesiyle üst kirişe bağla, konsolların kollarını tablanın altına vidala. Açıp kapatarak dene.</p>`},
    finishStep({})];
  return c;
}

/* 26) Yatak tepsisi */
function bedTray(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, sp=o.sp||'kayin', m='ply12', lk=LM(sp,12,45);
  for(const x of [0,W-18]) BOX(parts,'side','Yan ayak','ply18',x,0,0,18,H,D,{cutNote:'tutma deliği ve alt kavis açılır'});
  BOX(parts,'top','Tabla',m,18,H-30,0,W-36,12,D);
  BOX(parts,'lip','Kenar çıtası',lk,18,H-18,0,W-36,30,12);BOX(parts,'lip','Kenar çıtası',lk,18,H-18,D-12,W-36,30,12);
  BOX(parts,'rail','Alt bağlantı',LM(sp,20,45),18,40,R(D/2)-10,W-36,45,20);
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 3,5×30','12 adet',''],['Gıdaya uygun yağ veya su bazlı vernik','250 ml','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Tabla yataktan ${H-18} mm yüksekte; altında ${H-90} mm boşluk kalır, bacak üstüne rahat oturur.`}]};
  c.tools=stdTools(['daire','ray','dekupaj','forstnerSet','metre','kalem','matkap','havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj','forstnerSet'],x:`${cutUL(c,K)}<p>İki ${K('side')} ayağı üst üste bantla. Üst kısma 30×100 mm tutma deliği, alt kenara geniş bir kavis çizip birlikte kes.</p>`},
    {t:'Tablayı bağla',add:['side','top','rail'],tools:['matkap','havsa','isk'],x:`<p>${K('top')} tablayı ayakların arasına, ${K('rail')} alt bağlantıyı aşağıya tutkal ve vidayla bağla.</p>`},
    {t:'Kenar çıtalarını tak',add:['lip'],tools:['isk'],x:`<p>${K('lip')} çıtaları tablanın ön ve arka kenarına tutkalla yapıştır; bardak ve tabak kaymaz.</p>`},
    finishStep({food:1})];
  return c;
}

/* 27) Lavabo altı dolabı */
function sinkCab(p,o){
  const c=carcass(p,o);
  c.notes=(c.notes||[]).concat([{t:'warn',x:'Lavabo altı nemli kalır. Kesim kenarlarını kenar bandı ya da iki kat vernikle kapat; tabanın üstüne su tutmayan bir altlık koy.'},
    {t:'tip',x:'Arkalık yok; su ve gider boruları arkadan rahat girer. Lavabo ya da tezgâh dolabın üstüne silikonla oturur.'}]);
  c.hw=c.hw.concat([['Şeffaf silikon','1 tüp','lavabo ile üst tabla arası']]);
  return c;
}

/* 28) Küvet tahtası */
function bathCaddy(p,o){
  const parts=[], W=p.W, D=p.D, sp=o.sp||'mese', ck=LM(sp,20,45), sk=LM(sp,20,70), n=Math.max(2,Math.floor((D+8)/78)), ins=p.ins||90;
  for(const x of [ins,W-ins-20]) BOX(parts,'cleat','Durdurma çıtası',ck,x,0,10,20,45,D-20);
  BOX(parts,'cleat','Durdurma çıtası',ck,W/2-10,0,10,20,45,D-20);
  spread(n,0,D,70).forEach(z=>BOX(parts,'slat','Üst çıta',sk,0,45,z,W,20,70,{cutNote:'uçları yuvarlatılır'}));
  if(o.stand) BOX(parts,'lip','Tablet dayama çıtası',ck,R(W/2)-150,65,D-50,300,20,20,{cutNote:'kitap ya da tablet dayanır'});
  const c={parts,hw:[['Paslanmaz vida 3,5×30',(n*3+(o.stand?2:0))+' adet','çıtalar alttan'],['Su geçirmez (D3) ahşap tutkalı','1 şişe',''],['Tik yağı veya sert yağ','250 ml','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`İki uçtaki durdurma çıtalarının iç kenarları arası ${W-2*ins-40} mm; bu ölçü küvetin iç genişliğinden 10-20 mm az olmalı. Küvetini ölç, "İç pay"ı ona göre ayarla.`},
      {t:'warn',x:'Tahtaya oturma ya da basma; yalnız eşya taşır. Kullandıktan sonra küvetten kaldırıp kurumaya bırak.'}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','havsa','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:`${cutUL(c,K)}<p>${K('slat')} çıtaların uçlarını ve köşelerini zımparayla yuvarlat; ıslak elle tutulduğunda kıymık batmasın.</p>`},
    {t:'Çıtaları birleştir',add:['cleat','slat'],tools:['matkap','havsa','metre'],x:`<p>${K('slat')} çıtaları yüzleri aşağı bakacak şekilde, aralarına 8 mm takoz koyarak diz. ${K('cleat')} çıtaları uçlardan ${ins} mm içeride ve ortada, tutkal ve alttan paslanmaz vidayla bağla.</p>`,tip:'Vida boyu çıta kalınlıkları toplamından 5 mm kısa olsun; uç üst yüzden çıkmasın.'},
    ...(o.stand?[{t:'Dayama çıtasını tak',add:['lip'],tools:['matkap'],x:`<p>${K('lip')} çıtayı arka kenara yakın, ortalanmış olarak tutkal ve iki vidayla bağla.</p>`}]:[]),
    {t:'Zımpara ve bitiş',tools:['zimMak','zimKag','firca'],x:'<p>180 kumla bitir, tozunu al. Tik yağını ya da sert yağı bolca sür, 15 dakika sonra fazlasını sil; 24 saat arayla 3 kat uygula. Uç kesitlere ekstra kat sür, su en çok oradan girer.</p>'}];
  return c;
}

/* 29) Şarj istasyonu */
function chargeBox(p,o){
  const c=panelBox(p,Object.assign({},o,{lid:'flat'}));
  const fb=c.parts.filter(q=>q.g==='fb'); if(fb[1]) fb[1].cutNote='alt kenarda Ø35 kablo deliği';
  const lid=c.parts.find(q=>q.g==='lid'); if(lid) lid.cutNote=`${o.slots||3} adet 8×60 mm kablo yarığı`;
  c.hw=c.hw.concat([['Kablo deliği kapağı Ø35','1 adet','arka panel'],['Çoklu priz (anahtarlı)','1 adet','kutunun içine']]);
  c.notes=(c.notes||[]).concat([{t:'tip',x:`Kapakta ${o.slots||3} kablo yarığı var; telefonlar kapağın üstünde şarj olur, adaptör ve kablo fazlası kutuda kalır.`},
    {t:'warn',x:'Adaptörler ısınır. Kutuyu kumaşla örtme, kapağı sıkı kapatma ve yalnız onaylı (CE işaretli) şarj aletleri kullan.'}]);
  if(!c.tools.some(t=>t[0]==='forstnerSet')) c.tools.push(['forstnerSet']);
  if(!c.tools.some(t=>t[0]==='dekupaj')) c.tools.push(['dekupaj']);
  const ms=c.mkSteps; c.mkSteps=K=>{const S=ms(K);
    S.splice(1,0,{t:'Kablo deliklerini aç',tools:['forstnerSet','dekupaj','matkap'],x:`<p>Arka ${K('fb')} panelin alt kenarına, ortada Ø35 delik aç. ${K('lid')} kapağa ${o.slots||3} adet 8×60 mm yarık çiz: uçlarına 8 mm delik aç, arasını dekupajla kes ve kenarlarını zımparala.</p>`});
    return S;};
  return c;
}

/* 30) Sandıklı bank */
function storageBench(p,o){
  const c=panelBox(p,Object.assign({},o,{lid:'hinged',mat:o.mat||'ply18'}));
  c.hw=c.hw.filter(r=>r&&!/menteşe|stay/i.test(r[0])).concat([['Piyano menteşe',(p.W-40)+' mm','kapak boyunca'],['Yavaş kapanan kapak makası','2 adet','kapak düşmez'],['Kaydırmaz keçe ayak','4 adet','']]);
  c.notes=(c.notes||[]).concat([{t:'warn',x:'Kapak ağırdır. Yavaş kapanan kapak makası takmadan çocukların kullandığı yerde kullanma; kapağa çocuk kilidi koyma.'},
    {t:'tip',x:`Oturma yüksekliği ${p.H+MAT[o.mat||'ply18'].t} mm. Üstüne ${p.W} × ${p.D} mm bir minder ya da süngerli kumaş kaplama konabilir.`}]);
  return c;
}

/* 31) Kum kabı dolabı (kedi) */
function litterCab(p,o){
  const c=carcass(p,o);
  const side=c.parts.find(q=>q.g==='side'); if(side) side.cutNote='Ø180 giriş deliği (yerden 60 mm)';
  c.hw=c.hw.concat([['Havalandırma ızgarası 100×100','2 adet','arka ya da yan']]);
  c.notes=(c.notes||[]).concat([{t:'tip',x:`İçine ${p.W-80} × ${p.D-60} mm'ye kadar bir kum kabı sığar. Kedi yan taraftaki Ø180 delikten girer; kapak temizlik içindir.`},
    {t:'warn',x:'Kum kabı nem ve koku yapar. Gövdenin içini iki kat su bazlı vernikle kapat, tabana yıkanabilir bir altlık koy ve havalandırma deliklerini kapatma.'}]);
  if(!c.tools.some(t=>t[0]==='dekupaj')) c.tools.push(['dekupaj']);
  return c;
}

/* 32) Tırmanma üçgeni */
function climbTriangle(p,o){
  const parts=[], W=p.W, H=p.H, S=p.D, sp=o.sp||'kayin', rw=45, rt=27, rk=LM(sp,rt,rw), zc=S/2, top=25;
  const off=y=>top+(zc-top-rw/2)*(1-y/H), len=Math.hypot(H,zc-top-rw/2), step=o.step||200, ys=[];
  for(let y=170;y<=H-120;y+=step) ys.push(y);
  for(const s of [-1,1]){
    for(const x of [rt/2,W-rt/2]) PART(parts,'rail','Yan dikme',rk,barRings([x,0,zc+s*off(0)],[x,H,zc+s*off(H)],rw,rt,[1,0,0]),{cut:[R(len+30),rw,rt],cutNote:'iki ucu açılı kesilir'});
    ys.forEach(y=>BOX(parts,'rung','Basamak çubuğu','kav25',rt,y-12.5,zc+s*off(y)-12.5,W-2*rt,25,25,{cut:[W-2*rt+30,25,25],cutNote:'uçları 15 mm dikmelere gömülür'}));
  }
  const n=ys.length*2;
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Vida 4×50',n*2+' adet','basamaklara dışarıdan'],['Kapı menteşesi 75 mm (paslanmaz)','2 adet','tepe'],['Açılma sınırlayıcı kayış veya zincir','2 adet','alt basamaklar arası'],['Kaydırmaz keçe ayak','4 adet',''],['Çocuğa uygun su bazlı vernik','0,5 L','EN 71-3 işaretli']],join:'Kavela yuvası + vida',
    notes:[{t:'warn',x:'Çocuk tırmanırken yanında bir yetişkin olsun. Altına yumuşak oyun matı ser. Her kullanımdan önce menteşeleri, kayışları ve basamakları kontrol et.'},
      {t:'tip',x:`Açık hâlde taban ${S} mm, yükseklik ${H} mm. Basamak aralığı ${step} mm; katlanınca duvara yaslanıp saklanır.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','matkap','forstnerSet','havsa',['isk','2 adet'],'gonye','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer','metre'],x:`${cutUL(c,K)}<p>${K('rail')} dikmelerin alt ucunu yere, üst ucunu karşı dikmeye düz oturacak açıyla kes; dört dikmeyi aynı ölçüde kesmek için ilkini şablon yap.</p>`},
    {t:'Basamak deliklerini aç',tools:['forstnerSet','matkap','metre'],x:`<p>Aynı taraftaki iki ${K('rail')} dikmeyi yan yana işkenceyle sık ve basamak yerlerini ${step} mm arayla birlikte işaretle. Her işarete 25 mm, 15 mm derinlikte delik aç.</p>`,tip:'Matkaba derinlik durdurucu (bant) koy; delik dikmenin öbür yüzüne çıkmasın.'},
    {t:'İki merdiveni kur',add:['rail','rung'],tools:['isk','gonye','havsa'],x:`<p>${K('rung')} basamakların uçlarına tutkal sür, deliklere oturt ve merdiveni işkenceyle sık. Çaprazları ölçerek gönyeye getir. Her basamak ucunu dikmenin dışından bir vidayla kilitle. Aynı işlemi ikinci merdiven için yap.</p>`},
    {t:'Tepeyi menteşele',tools:['matkap'],x:'<p>İki merdiveni tepelerinden birbirine yasla. Menteşeleri dikmelerin üst uçlarına, katlanınca kapanacak yönde vidala. Alt basamaklar arasına açılma sınırlayıcı kayışları bağla; üçgen istenen açıdan fazla açılmasın.</p>'},
    finishStep({},'<p>Vernik tamamen kuruduktan sonra (en az 3 gün) kullan. Keçe ayakları yapıştır.</p>')];
  return c;
}

/* ---------- aileler ---------- */
const FAMS3=[], F3=d=>FAMS3.push(d);
F3({id:'isim-tabelasi',name:'İsim tabelası',cat:'Hobi',b:signBoard,level:1,time:'4 saat',tags:'tabela yazı kapı hediye',desc:'Kapı, mutfak ya da bahçe için boyalı veya yakma yazılı ahşap tabela.',
  P:{W:[200,1200,10],H:[100,450,5]},def:()=>({}),o:{},ax:[['W',[300,450,600,800]],['H',[150,200,300]],['style',['boya','yakma'],{boya:'boyalı yazı',yakma:'yakma yazı'}],['sp',['cam','mese'],SPL]]});
F3({id:'samdan',name:'Ahşap şamdan',cat:'Hobi',b:candle,level:1,time:'2 saat',tags:'mum tealight masa dekor',desc:'Tealight mumlar için yuvalı masif şamdan.',
  P:{L:[150,700,10]},def:()=>({}),o:{},ax:[['L',[200,300,400,500]],['H',[45,70],{45:'alçak',70:'yüksek'}],['sp',['mese','ceviz','kayin'],SPL]],lbl:{L:'Uzunluk'}});
F3({id:'kasiklik',name:'Kaşıklık',cat:'Mutfak ve küçük eşya',b:panelBox,level:1,time:'2 saat',tags:'mutfak gereci spatula kutu',desc:'Tezgâh üstü kepçe, spatula ve kaşık kutusu.',
  P:{W:[100,200,5],D:[100,200,5],H:[140,240,5]},def:()=>({}),o:{mat:'ply12',food:true,feet:true},ax:[['W',[120,150]],['D',[120,150]],['H',[160,200]]]});
F3({id:'sarap-rafi',name:'Şarap rafı',cat:'Mutfak ve küçük eşya',b:wineRack,level:2,time:'5 saat',tags:'şişe raf bar',desc:'Yarım daire yuvalı, duvara asılan şarap rafı.',
  P:{W:[300,1000,10],H:[300,1200,10]},def:()=>({}),o:{},ax:[['W',[400,600,800]],['H',[400,600,900]],['sp',['cam','mese'],SPL]]});
F3({id:'basamakli-raf',name:'Basamaklı tezgâh rafı',cat:'Mutfak ve küçük eşya',b:tiered,level:1,time:'3 saat',tags:'baharat kiler dolap içi',desc:'Dolap içi ya da tezgâh üstü için basamaklı baharat ve kavanoz rafı.',
  P:{W:[200,600,10],N:[2,4,1]},def:()=>({}),o:{mat:'ply12'},ax:[['W',[250,300,400]],['N',[2,3]]],nl:'basamaklı'});
F3({id:'saksi-basamagi',name:'Basamaklı saksı standı',cat:'Bahçe ve dış mekân',b:tiered,level:2,time:'5 saat',tags:'balkon çiçek merdiven',desc:'Balkon ve teras için basamaklı saksı standı.',
  P:{W:[400,1200,10],N:[2,5,1]},def:()=>({}),o:{mat:'ply18',h:250,d:250,outdoor:true},ax:[['W',[600,800]],['N',[3,4]]],nl:'basamaklı'});
F3({id:'kedi-kulesi',name:'Kedi tırmalama kulesi',cat:'Ev mobilyası',b:catTree,level:2,time:'1 gün',tags:'kedi evcil hayvan sisal',desc:'Sisal sarılı direkli, katlı kedi tırmalama kulesi.',
  P:{W:[400,700,10],H:[600,1600,10]},def:()=>({}),o:{},ax:[['H',[800,1100,1400]],['W',[450,550]]],lbl:{W:'Taban genişliği'}});
F3({id:'mama-standi',name:'Yükseltilmiş mama standı',cat:'Ev mobilyası',b:petFeeder,level:1,time:'4 saat',tags:'köpek kedi evcil hayvan kap',desc:'İki paslanmaz kaplı, yükseltilmiş mama ve su standı.',
  P:{D:[120,300,10],H:[80,450,10]},def:()=>({}),o:{},ax:[['D',[160,200,240]],['H',[100,200,350]],['mat',['ply18','mdf18'],MATL]],lbl:{D:'Kap çapı'}});
F3({id:'palet-sehpa',name:'Palet sehpa',cat:'Ev mobilyası',b:pallet,level:1,time:'6 saat',tags:'palet geri dönüşüm tekerlekli',desc:'Tekerlekli, palet biçimli salon sehpası.',
  P:{L:[600,1400,10],W:[500,1000,10]},def:()=>({}),o:{},ax:[['L',[800,1000,1200]],['W',[600,800]],['layers',[1,2],{1:'tek katlı',2:'iki katlı'}],['glass',[false,true],{false:'camsız',true:'cam tablalı'}]]});
F3({id:'gizli-raf',name:'Gizli konsollu duvar rafı',cat:'Ev mobilyası',b:floatShelf,level:1,time:'3 saat',tags:'yüzer raf floating',desc:'Konsolu görünmeyen, kalın masif duvar rafı.',
  P:{L:[300,1500,10],D:[120,250,10]},def:()=>({}),o:{},ax:[['L',[400,600,800,1000,1200]],['D',[150,220]],['sp',['mese','ceviz','cam'],SPL]]});
F3({id:'monitor-yukseltici',name:'Monitör yükseltici',cat:'Ev mobilyası',b:riser,level:1,time:'3 saat',tags:'masa üstü ofis ekran',desc:'Dübelli, sade masa üstü monitör yükseltici.',
  P:{W:[400,1000,10],D:[150,250,10],H:[80,160,5]},def:()=>({H:110}),o:{},ax:[['W',[500,600,800]],['D',[190,250]],['sp',['mese','ceviz','kayin'],SPL]]});
F3({id:'masa-sandalyesi',name:'Çıtalı yemek sandalyesi',cat:'Ev mobilyası',b:recline,level:3,time:'1,5 gün',tags:'sandalye mutfak yemek',desc:'Hafif geriye yatık sırtlı, çıtalı iç mekân sandalyesi.',
  P:{W:[400,520,10],D:[380,480,10],H:[430,480,5],BA:[5,15,1]},def:()=>({D:420,H:450}),o:{indoor:true},ax:[['W',[420,460]],['BA',[8,12]],['sp',['kayin','mese','cam'],SPL]],lbl:{BA:'Sırt açısı (°)'}});
F3({id:'piknik-masasi',name:'Piknik masası',cat:'Bahçe ve dış mekân',b:picnic,level:3,time:'1,5 gün',tags:'bank masa bahçe aile',desc:'Oturakları gövdeye bağlı, A ayaklı klasik piknik masası.',
  P:{L:[1000,2400,10]},def:()=>({}),o:{},ax:[['L',[1200,1500,1800,2000]],['sp',['emp','mese'],SPL],['umb',[false,true],{false:'şemsiyesiz',true:'şemsiye delikli'}]]});
F3({id:'cornhole',name:'Torba atma oyunu (cornhole)',cat:'Hobi',b:cornhole,level:2,time:'1 gün',tags:'bahçe oyun parti',desc:'Delikli eğik tahtaya torba atma oyunu; iki tahta yapılır.',
  P:{W:[400,700,10],L:[800,1300,10]},def:()=>({}),o:{},ax:[['size',['std','jr'],{std:'standart',jr:'çocuk boyu'}],['paint',[false,true],{false:'doğal',true:'boyalı'}],['sp',['cam','kayin'],SPL]],vd:v=>v.size==='std'?{W:600,L:1200}:{W:450,L:900}});
F3({id:'bahce-kafesi',name:'Bahçe kafesi',cat:'Bahçe ve dış mekân',b:trellis,level:1,time:'4 saat',tags:'sarmaşık çit kafes trellis',desc:'Sarmaşık ve tırmanıcı bitkiler için çerçeveli kafes.',
  P:{W:[400,1500,10],H:[800,2200,10]},def:()=>({}),o:{},ax:[['W',[600,900,1200]],['H',[1200,1800]],['s',[100,150],{100:'sık kafes',150:'seyrek kafes'}]]});
F3({id:'kum-havuzu',name:'Kum havuzu',cat:'Çocuk',b:slatBox,level:1,time:'5 saat',tags:'bahçe oyun kum',desc:'Tabansız, altı jeotekstil örtülü bahçe kum havuzu.',
  P:{W:[800,2000,10],D:[800,2000,10],H:[140,420,140]},def:()=>({H:280}),o:{bottom:'none',gap:0,post:45,prof:[28,140],sp:'emp',outdoor:true,liner:true},ax:[['W',[1000,1200,1500]],['D',[1000,1200]],['seats',[true,false],{true:'köşe oturaklı',false:'oturaksız'}]]});
F3({id:'altigen-raf',name:'Altıgen duvar rafı',cat:'Ev mobilyası',b:hexShelf,level:2,time:'4 saat',tags:'bal peteği hexagon dekor',desc:'Gönyeli kenarlardan bal peteği biçimli duvar rafı.',
  P:{W:[150,400,10],D:[95,190,5]},def:()=>({}),o:{},ax:[['W',[200,250,300]],['D',[120,150]],['set',[1,3],{1:'tekli',3:'üçlü set'}],['sp',['cam','mese','ceviz'],SPL]],lbl:{W:'Kenar uzunluğu'}});
F3({id:'kus-yemligi',name:'Kuş yemliği',cat:'Bahçe ve dış mekân',b:birdFeeder,level:1,time:'3 saat',tags:'kuş yem asma',desc:'Çatılı, kenarlı, asılan açık kuş yemliği.',
  P:{W:[150,400,10],D:[120,300,10],H:[100,300,10]},def:()=>({}),o:{},ax:[['W',[200,250,300]],['D',[150,200]],['H',[150,200]]]});
F3({id:'testere-sehpasi',name:'Testere sehpası',cat:'Atölye',b:sawHorse,level:1,time:'4 saat',tags:'sawhorse kesim sehpası tezgah ayağı',desc:'Açılı ayaklı, kalın kirişli testere ve kesim sehpası; istersen çift yapılır.',
  P:{L:[600,1500,10],H:[600,900,10]},def:()=>({}),o:{},ax:[['L',[800,1000,1200]],['H',[700,800]],['pair',[true,false],{true:'çift',false:'tek'}]]});
F3({id:'alet-panosu',name:'Alet panosu',cat:'Atölye',b:toolWall,level:1,time:'5 saat',tags:'fransız askı french cleat duvar düzen garaj',desc:'45° askı çıtalı duvar panosu; tutucular istenen yere asılır.',
  P:{W:[600,2400,10],H:[600,1500,10]},def:()=>({}),o:{},ax:[['W',[900,1200,1800]],['H',[800,1200]],['hold',[true,false],{true:'tutuculu',false:'yalnız pano'}]]});
F3({id:'iskence-rafi',name:'İşkence rafı',cat:'Atölye',b:clampRack,level:1,time:'3 saat',tags:'kelepçe işkence askı duvar garaj',desc:'Duvara asılan, kollu işkence ve kelepçe rafı.',
  P:{W:[400,1500,10],D:[150,400,10]},def:()=>({}),o:{},ax:[['W',[600,900,1200]],['D',[250,350]],['space',[120,180],{120:'sık kollu',180:'seyrek kollu'}]],lbl:{D:'Kol uzunluğu'}});
F3({id:'ogrenme-kulesi',name:'Öğrenme kulesi',cat:'Çocuk',b:learnTower,level:2,time:'1 gün',tags:'montessori mutfak yardımcısı basamak çocuk',desc:'Çocuğun mutfak tezgâhına güvenle yetişmesi için korkuluklu, basamaklı kule.',
  P:{W:[380,550,10],D:[380,550,10],H:[800,1000,10]},def:()=>({D:450}),o:{},ax:[['W',[420,480]],['H',[880,940]],['ph',[250,350,450],{250:'alçak platform',350:'orta platform',450:'yüksek platform'}]]});
F3({id:'cocuk-kitapligi',name:'Çocuk kitaplığı',cat:'Çocuk',b:bookDisplay,level:2,time:'6 saat',tags:'montessori kitap kapağı önde çocuk odası',desc:'Kitapların kapağı önde durduğu, eğik yanlı çocuk kitaplığı.',
  P:{W:[500,1000,10],H:[600,1100,10],N:[3,5,1]},def:()=>({}),o:{},ax:[['W',[600,800]],['H',[700,900]],['N',[3,4]]],nl:'sıralı'});
F3({id:'oyuncak-arabasi',name:'Çekme arabalı oyuncak kutusu',cat:'Çocuk',b:toyCart,level:2,time:'6 saat',tags:'tekerlekli araba ipli çocuk oyuncak',desc:'Ahşap tekerlekli, ipli çekme arabası biçiminde oyuncak kutusu.',
  P:{W:[350,700,10],D:[250,450,10],H:[150,300,10]},def:()=>({}),o:{},ax:[['W',[450,550]],['D',[300,350]],['H',[180,220]]]});
F3({id:'bicak-blogu',name:'Bıçak bloğu',cat:'Mutfak ve küçük eşya',b:knifeBlock,level:2,time:'4 saat',tags:'bıçaklık tezgah mutfak',desc:'Katmanları tutkallanmış, yuvalı masif bıçak bloğu.',
  P:{H:[180,300,10],D:[100,190,5],N:[3,8,1]},def:()=>({D:130}),o:{},ax:[['H',[220,260]],['N',[4,6]],['sp',['ceviz','mese','kayin'],SPL]],nl:'yuvalı'});
F3({id:'havluluk',name:'Kâğıt havluluk',cat:'Mutfak ve küçük eşya',b:paperHolder,level:1,time:'2 saat',tags:'rulo peçete havlu kağıt',desc:'Tezgâh üstü direkli ya da duvara asılan kâğıt havlu tutucu.',
  P:{L:[200,320,10]},def:()=>({L:260}),o:{},ax:[['mount',['tezgah','duvar'],{tezgah:'tezgâh üstü',duvar:'duvara'}],['sp',['kayin','mese','ceviz'],SPL]],lbl:{L:'Rulo boyu'}});
F3({id:'tezgah-rafi',name:'Tezgâh üstü katlı raf',cat:'Mutfak ve küçük eşya',b:counterShelf,level:1,time:'3 saat',tags:'kahve köşesi kavanoz baharat raf',desc:'Tezgâh üstü için iki ya da üç katlı, arka çıtalı raf.',
  P:{W:[300,900,10],D:[120,190,5],H:[200,500,10],N:[2,3,1]},def:v=>({D:160,H:v.N>2?420:280}),o:{},ax:[['W',[400,600]],['N',[2,3]],['sp',['cam','mese','kayin'],SPL]],nl:'katlı'});
F3({id:'portmanto',name:'Ayaklı portmanto',cat:'Ev mobilyası',b:coatStand,level:2,time:'5 saat',tags:'askılık vestiyer mont şapka antre',desc:'Dört ayaklı, eğik çubuklu ayaklı portmanto.',
  P:{H:[1500,1900,10]},def:()=>({}),o:{},ax:[['H',[1700,1800]],['rows',[1,2],{1:'4 askılı',2:'8 askılı'}],['sp',['kayin','mese'],SPL]]});
F3({id:'duvar-masasi',name:'Duvara katlanır masa',cat:'Ev mobilyası',b:wallDesk,level:2,time:'5 saat',tags:'katlanır masa dar alan çalışma',desc:'Kilitli katlanır konsollu, kullanılmadığında duvara kapanan masa.',
  P:{W:[600,1400,10],D:[350,600,10],H:[700,780,5]},def:()=>({H:740}),o:{},ax:[['W',[800,1000,1200]],['D',[450,550]],['top',['ply','mese'],{ply:'kontrplak tablalı',mese:'meşe tablalı'}]]});
F3({id:'yatak-tepsisi',name:'Yatak tepsisi',cat:'Mutfak ve küçük eşya',b:bedTray,level:1,time:'4 saat',tags:'kahvaltı laptop sehpası yatak',desc:'Ayaklı, tutma delikli kahvaltı ve laptop tepsisi.',
  P:{W:[450,700,10],D:[280,400,10],H:[200,300,10]},def:()=>({}),o:{},ax:[['W',[500,600]],['D',[320,360]],['H',[230,260]]]});
F3({id:'lavabo-dolabi',name:'Lavabo altı dolabı',cat:'Ev mobilyası',b:sinkCab,level:3,time:'1,5 gün',tags:'banyo lavabo dolap',desc:'Ayaklı, arkası boru için açık lavabo altı dolabı.',
  P:{W:[400,1000,10],H:[600,900,10],D:[350,550,10]},def:()=>({H:800,D:450}),o:{base:'legs',legH:150,back:false},
  ax:[['W',[500,600,800]],['D',[400,460]],['mat',['mlam18','mdf18'],MATL]],vo:v=>({doors:v.W>500?2:1})});
/* 2026-11-04 eklemeleri */
F3({id:'kuvet-rafi',name:'Küvet tahtası',cat:'Ev mobilyası',b:bathCaddy,level:1,time:'3 saat',tags:'banyo küvet köprü spa kitap tablet',desc:'Küvetin iki kenarına oturan, çıtalı ve su süzen banyo tahtası.',
  P:{W:[600,1000,10],D:[150,300,10],ins:[40,200,5]},def:()=>({ins:90}),o:{},ax:[['W',[750,850]],['D',[200,250]],['stand',[false,true],{false:'',true:'tablet dayamalı'}],['sp',['mese','akc'],SPL]],lbl:{ins:'İç pay'}});
F3({id:'banyo-taburesi',name:'Banyo taburesi',cat:'Ev mobilyası',b:frame,level:2,time:'5 saat',tags:'duş taburesi banyo oturak şampuan rafı',desc:'Alt raflı, alçak banyo ve duş taburesi.',
  P:{L:[300,500,10],W:[250,400,10],H:[300,480,10]},def:v=>({W:Math.min(400,v.L-100)}),o:{leg:45,apron:70,ov:15,lower:'slats'},
  ax:[['L',[400,450]],['H',[350,450]],['sp',['mese','akc'],SPL]]});
F3({id:'sandikli-bank',name:'Sandıklı bank',cat:'Ev mobilyası',b:storageBench,level:2,time:'6 saat',tags:'depolamalı bank sandık oturma antre çocuk odası',desc:'Kapağı kalkan, içi depolamalı oturma bankı.',
  P:{W:[600,1400,10],D:[300,480,10],H:[350,460,5]},def:()=>({H:420,D:400}),o:{},ax:[['W',[800,1000,1200]],['D',[380,420]]]});
F3({id:'laptop-yukseltici',name:'Laptop yükseltici',cat:'Ev mobilyası',b:riser,level:1,time:'2 saat',tags:'dizüstü bilgisayar stand masa üstü',desc:'Dizüstü bilgisayarı göz hizasına yaklaştıran, altı boş masa üstü yükseltici.',
  P:{W:[280,450,10],D:[200,300,10],H:[80,180,5]},def:()=>({D:250}),o:{},ax:[['W',[320,380]],['H',[100,140]],['sp',['mese','ceviz','kayin'],SPL]]});
F3({id:'sarj-kutusu',name:'Şarj istasyonu',cat:'Ev mobilyası',b:chargeBox,level:1,time:'3 saat',tags:'telefon şarj kablo düzen priz',desc:'Kablo ve adaptörleri gizleyen, kapağı yarıklı şarj kutusu.',
  P:{W:[250,500,10],D:[150,300,10],H:[80,150,5]},def:()=>({}),o:{mat:'ply12'},ax:[['W',[300,400]],['D',[200,250]],['H',[100,120]],['slots',[3,4],{3:'3 yarıklı',4:'4 yarıklı'}]]});
F3({id:'kum-dolabi',name:'Kum kabı dolabı',cat:'Ev mobilyası',b:litterCab,level:2,time:'1 gün',tags:'kedi tuvaleti kum kabı gizleme dolap',desc:'Kedi kum kabını gizleyen, yandan girişli kapaklı dolap; üstü sehpa olarak kullanılır.',
  P:{W:[600,1000,10],H:[500,750,10],D:[450,600,10]},def:()=>({D:520}),o:{base:'plinth',doors:1,back:true},ax:[['W',[700,800]],['H',[550,650]],['mat',ply3,MATL]],vo:v=>({doors:v.W>750?2:1})});
F3({id:'yer-sofrasi',name:'Yer sofrası',cat:'Ev mobilyası',b:roundTable,level:2,time:'1 gün',tags:'sini sofra alçak masa minder oturma',desc:'Minderle yerde oturulan, kayıtlı alçak yuvarlak sofra.',
  P:{D:[700,1200,10],H:[280,400,5]},def:()=>({H:320}),o:{leg:45,apron:70},ax:[['D',[800,900,1000,1100]],['sp',['cam','mese','kayin'],SPL]]});
F3({id:'tirmanma-ucgeni',name:'Tırmanma üçgeni',cat:'Çocuk',b:climbTriangle,level:2,time:'1 gün',tags:'pikler montessori tırmanma merdiveni katlanır oyun',desc:'Katlanabilir, kavela basamaklı çocuk tırmanma üçgeni.',
  P:{W:[500,900,10],H:[600,1000,10],D:[600,1200,10]},def:v=>({D:R(v.H*0.95)}),o:{},ax:[['W',[600,750]],['H',[700,850]],['sp',['kayin','mese'],SPL]],lbl:{D:'Açık taban'}});
register(FAMS3);

/* ---------- alt kategoriler ---------- */
const SUBS={
  'Ev mobilyası':['Kitaplık ve raflar','Dolap ve depolama','Masa ve sehpa','Oturma','Yatak odası','Çalışma alanı','Antre ve askılar','Ayna ve dekor','Evcil hayvan'],
  'Mutfak ve küçük eşya':['Mutfak dolapları','Tahtalar ve sunum','Mutfak düzenleyiciler','Masa ve tabure'],
  'Bahçe ve dış mekân':['Bahçe oturma','Bahçe masaları','Saksı ve bahçe yatakları','Kuş ve doğa','Bahçe yapıları'],
  'Çocuk':['Çocuk mobilyası','Oyun ve oyuncak','Pano ve duvar'],
  'Atölye':['Tezgâh ve depolama'],
  'Hobi':['Kutular','Sergi ve raflar','Sanat','Oyunlar','Masa üstü ve dekor']
};
const SUBOF=(()=>{const m={},a=(sub,ids)=>ids.split(' ').forEach(i=>m[i]=sub);
  a('Kitaplık ve raflar','kuvet-rafi cocuk-kitapligi kitaplik kitaplik-p ayarli-kitaplik merdiven-kitaplik duvar-rafi banyo-rafi altigen-raf gizli-raf');
  a('Dolap ve depolama','sarj-kutusu lavabo-dolabi kapakli-dolap sifonyer acili-sifonyer gardirop banyo-dolabi vitrin-dolap tv-unitesi acili-tv citali-kasa saklama-kasasi camasir-sepeti saklama-kutusu cekmece-duzen');
  a('Masa ve sehpa','yer-sofrasi orta-sehpa yemek-masasi orta-sehpa-f yan-sehpa konsol yuvarlak-yemek yuvarlak-sehpa yuvarlak-yan-sehpa acili-sehpa palet-sehpa');
  a('Oturma','banyo-taburesi sandikli-bank tabure tabure-f ayak-taburesi yuvarlak-tabure acili-bank masa-sandalyesi');
  a('Yatak odası','komodin komodin-p acili-komodin gece-sehpasi tek-yatak cift-yatak');
  a('Çalışma alanı','laptop-yukseltici duvar-masasi calisma-masasi dosya-dolabi monitor-yukseltici');
  a('Antre ve askılar','portmanto izgara-altlik askilik anahtarlik giris-banki ayakkabi-rafi ayakkabi-dolabi');
  a('Ayna ve dekor','ayna-cercevesi yuvarlak-ayna battaniye-merdiveni havlu-merdiveni');
  a('Evcil hayvan','kum-dolabi evcil-yatak kedi-kulesi mama-standi');
  a('Mutfak dolapları','mutfak-alt mutfak-ust kiler-dolabi');
  a('Tahtalar ve sunum','yatak-tepsisi kesme-tahtasi kesme-tahtasi-f servis-tahtasi peynir-tahtasi yuvarlak-kesme pizza-tahtasi tepsi');
  a('Mutfak düzenleyiciler','bicak-blogu havluluk tezgah-rafi baharatlik havlu-askisi cay-kutusu ekmek-kutusu kupa-agaci meyve-kasasi sarap-kasasi sarap-rafi basamakli-raf kasiklik');
  a('Masa ve tabure','mutfak-masasi bar-taburesi');
  a('Bahçe oturma','bahce-banki bahce-koltugu sezlong piknik-banki balkon-banki egik-sandalye egik-bank ayarli-sezlong');
  a('Bahçe masaları','bahce-masasi bistro-masasi piknik-masasi');
  a('Saksı ve bahçe yatakları','saksi-standi saksi-kutusu yuksek-saksi bahce-yatagi cicek-rafi saksi-merdiveni saksi-basamagi kompost');
  a('Kuş ve doğa','kus-evi catili-kus-evi bocek-oteli kus-yemligi');
  a('Bahçe yapıları','odunluk kopek-kulubesi mektup-kutusu sokak-kitapligi bahce-kafesi');
  a('Çocuk mobilyası','ogrenme-kulesi cocuk-masasi yuvarlak-cocuk-masasi cocuk-taburesi montessori-yatak oyuncak-dolabi cocuk-banki');
  a('Oyun ve oyuncak','tirmanma-ucgeni oyuncak-arabasi oyuncak-sandigi bebek-evi kum-havuzu');
  a('Pano ve duvar','pano yuvarlak-pano');
  a('Tezgâh ve depolama','testere-sehpasi alet-panosu iskence-rafi tezgah alet-dolabi alet-kutusu');
  a('Kutular','taki-kutusu dikis-kutusu kalemlik');
  a('Sergi ve raflar','koleksiyon-rafi maket-vitrini plak-dolabi');
  a('Sanat','sovale masa-sovalesi resim-cercevesi');
  a('Oyunlar','oyun-kutusu cornhole');
  a('Masa üstü ve dekor','kulaklik-standi kitap-destegi duvar-saati bardak-altligi isim-tabelasi samdan');
  return m;})();
PROJECTS.forEach(p=>{p.sub=SUBOF[p.fam||p.id]||SUBS[p.cat][0];});
