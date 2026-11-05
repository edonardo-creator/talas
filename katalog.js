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

/* ---------- 2026-11-04: salıncak, oturma grubu, epoksi masa ---------- */
MAT.resin={n:'Epoksi reçine (derin döküm)',type:'hw',tone:'resin'};
MAT.foam={n:'Minder (sünger + kılıf)',type:'hw',tone:'foam'};
MAT.rope={n:'Halat',type:'hw',tone:'rope'};
Object.assign(TONE,{resin:[188,58,52],foam:[40,14,86],rope:[38,30,62]});
Object.assign(TOOLS,{
  isiTab:{n:'Isı tabancası',c:'Yüzey işlemleri',i:'iron',d:'Dökülen epoksinin yüzeyindeki hava kabarcıklarını patlatır.'},
  lokma:{n:'Lokma anahtar seti',c:'Delme ve vidalama',i:'bit',d:'Cıvata ve bijon somunlarını sıkmak için (13-17 mm).'}
});
// Canlı kenarlı kütük tabla: kalın ve geniş olduğu için ayrı stok (3 m boy)
function SLAB(sp,t,w){const k='slab'+sp+t+'x'+w;
  if(!MAT[k]) MAT[k]={n:`${SP[sp].n} kütük tabla ${t} mm (canlı kenarlı, ${w} mm)`,type:'lumber',w,t,tone:SP[sp].tone,L:3000};
  return k;}
const dec=v=>String(v).replace('.',',');
const chain=(parts,a,b,mat,r)=>PART(parts,'chain',mat==='rope'?'Halat':'Zincir',mat,cylRings(a,b,r||4,r||4,10),{deco:true,smooth:true});

/* 33) Salıncak: A ayaklı çerçeve + asma bank ya da çocuk oturakları; veranda modelinde yalnız bank */
function swing(p,o){
  const parts=[], sp=o.sp||'emp', H=p.H, kids=o.seat==='kids', N=kids?(p.N||1):0, W=kids?0:p.W, zc=0;
  const Wf=kids?N*700+400:W+190+700, beam=LM(sp,95,145), leg=LM(sp,70,95), br=LM(sp,45,95), top=o.frame?H-145:H;
  if(o.frame){
    const D=p.D, zo=107.5, ang=Math.atan((D/2-zo)/(H-145)), len=Math.hypot(D/2-zo,H-145);
    BOX(parts,'beam','Üst kiriş',beam,0,H-145,zc-47.5,Wf,145,95);
    for(const x of [35,Wf-35]) for(const s of [-1,1])
      PART(parts,'leg','A ayak',leg,barRings([x,0,zc+s*D/2],[x,H,zc+s*zo],95,70,[1,0,0]),{cut:[R(len+150),95,70],cutNote:`alt ucu ${(ang*180/Math.PI).toFixed(0)}° açılı, üstü kirişe cıvatalı`});
    const yb=R(H*0.35), zb=zo+(D/2-zo)*(1-yb/H)+60;
    for(const x of [70,Wf-115]) BOX(parts,'brace','Yatay kuşak',br,x,yb,zc-zb,45,95,2*zb);
  }
  let hw=[], benchH=450;
  if(!kids){
    const x0=(Wf-W)/2, z0=zc-250, sl=LM(sp,20,95), bxs=W>1200?[x0,x0+W/2-22.5,x0+W-45]:[x0,x0+W-45];
    bxs.forEach(x=>BOX(parts,'bearer','Oturak kirişi',br,x,benchH-115,z0,45,95,500));
    spread(5,z0+25,z0+500,95).forEach(z=>BOX(parts,'seat','Oturak çıtası',sl,x0,benchH-20,z,W,20,95));
    const bp=[x0-95,x0+W].concat(W>1200?[x0+W/2-47.5]:[]);
    bp.forEach(x=>BOX(parts,'bpost','Sırt dikmesi',br,x,benchH-115,z0-45,95,500,45));
    spread(3,benchH+60,benchH+385,95).forEach(y=>BOX(parts,'back','Sırt çıtası',sl,x0-95,y,z0,W+190,95,20));
    for(const x of [x0-95,x0+W]) BOX(parts,'apost','Kol dikmesi',br,x,benchH-115,z0+455,95,365,45);
    const arm=LM(sp,28,70);
    for(const x of [x0-95,x0+W+25]) BOX(parts,'arm','Kolçak',arm,x,benchH+250,z0+20,70,28,520);
    for(const x of [x0-60,x0+W+60]){
      chain(parts,[x,benchH+278,z0+500],[x,top,zc],'steel');chain(parts,[x,benchH+385,z0-22.5],[x,top,zc],'steel');}
    hw=[['Salıncak zinciri (galvaniz, en az 200 kg)',`4 × ${dec(R((top-benchH)/1000*1.1*10)/10)} m`,'her köşeye bir'],['Göz cıvatası M10 + somun + pul','4 adet','bank köşeleri'],
      [o.frame?'Salıncak kancası (rulmanlı, kirişe cıvatalı)':'Tavan kancası (rulmanlı, kirişe ya da betona dübelli)','2 adet','her biri en az 250 kg'],['Kilit halkası (zincir maillon)','4 adet',''],
      ['Galvaniz cıvata M8×80 + somun + pul',bxs.length*4+8+' takım','dikme-kiriş'],['Paslanmaz vida 4,5×45',(5+3)*bp.length*2+' adet','çıtalar'],['Bank minderi','1 adet',`${W} × 480 mm, isteğe bağlı`]];
  } else {
    const st=LM(sp,28,200);
    for(let i=0;i<N;i++){const cx=200+350+i*700;
      BOX(parts,'kseat','Salıncak oturağı',st,cx-225,400,zc-100,450,28,200);
      for(const dx of [-190,190]) for(const dz of [-70,70]) chain(parts,[cx+dx,428,zc+dz],[cx+dx*0.85,top,zc],'rope',6);}
    hw=[['Salıncak halatı (PP, Ø16 mm)',`${N*2} × ${dec(R((top-400)/1000*1.2*10)/10)} m`,'her oturağa 2 parça, U biçiminde'],['Salıncak kancası (rulmanlı)',N*2+' adet','kirişe cıvatalı'],
      ['Halat yüksekliği ayar tokası',N*2+' adet','oturak terazisi için'],['Kenar koruyucu lastik','oturak başına 1 m','ön ve arka kenar']];
  }
  if(o.frame) hw=hw.concat([['Galvaniz cıvata M12×200 + somun + pul','4 takım','ayak-kiriş tepe bağlantısı'],['Galvaniz cıvata M10×140 + somun + pul','8 takım','kuşaklar'],['Zemin çapası (toprak kazığı)','4 adet','ayak uçlarına'],['Galvaniz köşe sacı','4 adet','ayak-kiriş içten']]);
  hw.push(['Dış mekân ahşap yağı','1,5 L','2-3 kat']);
  const c={parts,hw,join:'Cıvata + paslanmaz vida',notes:[
    {t:'warn',x:'Salıncak insan taşır. Kiriş, kanca, zincir ve cıvataların taşıma değerini mutlaka kontrol et; her mevsim başında cıvataları sık, zincir ve kancalarda aşınma ara. Dayanım hesabı yapılmamıştır; kurulumu bir ustaya kontrol ettir.'},
    o.frame?{t:'warn',x:`Çerçevenin önünde ve arkasında en az 2 m boş alan bırak; ayakları zemin çapasıyla sabitle. Yumuşak zemin (çim, bahçe kumu) seç.`}:{t:'warn',x:'Kancaları yalnız taşıyıcı kirişe ya da betona tak; asma tavan, alçıpan ya da ince lambri taşımaz.'},
    kids?{t:'tip',x:`Oturak yerden 400 mm. Çocuk salıncağında oturaklar arası ${700-450} mm; yanlarda en az 200 mm boşluk bırak.`}:{t:'tip',x:`Bank ${W} mm genişlikte, oturma yüksekliği yerden ${benchH} mm. Zinciri ayarlayarak sırtı hafif geriye yatır.`}]};
  c.tools=stdTools([o.frame?'daire':null,'gonyeT',o.frame?'aciOlcer':null,'metre','gonye','kalem','matkap','havsa','lokma',o.frame?'terazi':null,['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','aciOlcer','metre'].filter(t=>c.tools.some(x=>x[0]===t)),x:cutUL(c,K)},
    ...(o.frame?[{t:'A ayakları kur',add:['leg','brace'],tools:['matkap','lokma','aciOlcer'],x:`<p>İki ${K('leg')} ayağı yerde A biçiminde yatır: altta aralık ${p.D} mm, üstte kirişin iki yanını saracak kadar. ${K('brace')} kuşağı yerden ${R(H*0.35)} mm yükseklikte ayakların iç yüzüne M10 cıvatayla bağla. İkinci A'yı aynı yap.</p>`,tip:'İlk A ayağı şablon olarak kullan; ikincisi birebir aynı açıda olsun.'},
      {t:'Kirişi kaldır ve bağla',add:['beam'],tools:['matkap','lokma','terazi'],x:`<p>İki kişiyle ${K('beam')} kirişi iki A'nın tepesine yerleştir. Ayakların üst uçlarını kirişin iki yanına M12×200 cıvatayla bağla, içten köşe saclarını vidala. Kirişi terazile; ayak uçlarına zemin çapası çak.</p>`,warn:'Kirişi kaldırırken yalnız çalışma; en az iki kişi gerekir.'}]:[]),
    ...(!kids?[{t:'Bankı kur',add:['bearer','seat','bpost','apost','arm','back'],tools:['matkap','havsa','gonye'],x:`<p>${K('bearer')} kirişlerini ${W} mm arayla diz; ${K('seat')} çıtalarını 5 mm arayla vidala. ${K('bpost')} sırt dikmelerini ve ${K('apost')} kol dikmelerini kirişlerin dışına M8 cıvatayla bağla. ${K('back')} sırt çıtalarını ve ${K('arm')} kolçakları vidala.</p>`},
      {t:'As',tools:['matkap','lokma','terazi'],x:`<p>Bankın dört köşesine göz cıvatası tak. ${o.frame?'Kirişe':'Tavana'} iki rulmanlı kanca bağla. Zincirleri kilit halkasıyla köşelere ve kancalara bağla; ön zincirleri arka zincirlerden bir iki halka kısa tutarak sırtı hafif geriye yatır. Oturmadan önce bankı elinle bastırarak yükle ve bağlantıları kontrol et.</p>`}]
      :[{t:'Oturakları hazırla',add:['kseat'],tools:['matkap','zimMak'],x:`<p>${K('kseat')} oturaklarının köşelerini 30 mm yarıçapla yuvarlat. Her uca halatın geçeceği iki adet 18 mm delik aç; delik kenarlarını zımparala, halatı kesmesin. Ön ve arka kenara lastik koruyucu tak.</p>`},
        {t:'As',tools:['lokma','terazi'],x:`<p>Kirişe ${N*2} rulmanlı kanca bağla. Halatı oturağın deliklerinden U biçiminde geçir, ayar tokasıyla bağla ve kancaya as. Oturağı yerden 400 mm'de terazile.</p>`}]),
    finishStep({outdoor:1})];
  return c;
}

/* 34) Oturma grubu: koltuk, kanepe ya da köşe kanepe (iç ve dış mekân, minderli) */
function loungeRun(p,o,len,arms,corner){
  const parts=[], sp=o.sp||'emp', D=p.D, H=p.H, post=LM(sp,70,70), rail=LM(sp,45,95), sl=LM(sp,20,95), armB=LM(sp,28,95);
  const armH=H+220, backH=H+430, L=len, aL=arms.includes('L'), aR=arms.includes('R');
  // dikmeler
  for(const [x,side] of [[0,'L'],[L-70,'R']]){const arm=side==='L'?aL:aR;
    BOX(parts,'bpost','Arka dikme',post,x,0,0,70,backH,70);
    BOX(parts,'fpost','Ön dikme',post,x,0,D-70,70,arm?armH:(side==='R'&&corner?backH:H-100),70);
    BOX(parts,'srail','Yan kayıt',rail,x+(side==='L'?0:25),H-215,70,45,95,D-140);
    if(arm){BOX(parts,'arm','Kolçak',armB,side==='L'?0:L-95,armH,70,95,28,D-50);
      spread(2,H-60,armH-10,95).forEach(y=>BOX(parts,'sslat','Yan çıta',sl,x+(side==='L'?12.5:37.5),y,90,20,95,D-160));}}
  if(L>1500) for(const z of [0,D-70]) BOX(parts,'mpost','Orta ayak',post,L/2-35,0,z,70,H-215,70);
  for(const z of [12.5,D-57.5]) BOX(parts,'rail','Ön/arka kayıt',rail,70,H-215,z,L-140,95,45);
  if(L>1200) BOX(parts,'mrail','Orta kayıt',rail,L/2-22.5,H-215,57.5,45,95,D-115);
  const n=Math.max(2,Math.floor((L-140+25)/(95+25)));
  spread(n,70,L-70,95).forEach(x=>BOX(parts,'seat','Oturak çıtası',sl,x,H-120,12.5,95,20,D-25));
  const ys=[];for(let y=H-60;y+95<=backH;y+=125)ys.push(y);
  ys.filter(y=>!(y<armH+28&&y+95>armH)||(!aL&&!aR)).forEach(y=>BOX(parts,'back','Sırt çıtası',sl,0,y,70,L,95,20));
  if(corner) ys.forEach(y=>BOX(parts,'cback','Köşe sırt çıtası',sl,L-90,y,90,20,95,D-160));
  const cx0=aL?95:0, cx1=corner?L-90:aR?L-95:L;
  BOX(parts,'cush','Oturak minderi','foam',cx0,H-100,90,cx1-cx0,100,D-90,{deco:true});
  BOX(parts,'cushB','Sırt minderi','foam',cx0,H,90,(corner?L-240:cx1)-cx0,420,150,{deco:true});
  if(corner) BOX(parts,'cushB','Sırt minderi','foam',L-240,H,240,150,420,D-240,{deco:true});
  return parts;
}
function lounge(p,o){
  const W=p.W, D=p.D, H=p.H, sp=o.sp||'emp', type=o.type||'sofa';
  let parts;
  if(type==='corner'){
    parts=loungeRun(p,o,W,'L',true);
    const LB=p.W2-D, b=loungeRun(p,o,LB,'R',false);
    b.forEach(q=>{const r=Object.assign({},q,{x:W-(q.z+q.sz),z:D+q.x,sx:q.sz,sz:q.sx});parts.push(r);});
  } else parts=loungeRun(p,o,W,'LR',false);
  const out=!!o.outdoor||sp==='emp', seats=type==='chair'?1:type==='corner'?Math.floor(W/650)+Math.floor((p.W2-D)/650):Math.max(2,Math.floor((W-190)/600));
  const cush=type==='corner'?`${W-185} × ${D-90} mm + ${p.W2-D-95} × ${D-90} mm`:`${W-190} × ${D-90} mm`;
  const c={parts,hw:[['Galvaniz cıvata M8×100 + somun + pul',(type==='corner'?24:12)+' takım','dikme-kayıt'],['Paslanmaz vida 4,5×45',(parts.filter(q=>/slat|seat|back|cback/.test(q.g)).length*4)+' adet','çıtalar'],
      ['Ahşap tutkalı (D3)','1 şişe',''],['Oturak minderi (10 cm, '+(out?'dış mekân süngeri, su itici kumaş':'yüksek yoğunluklu sünger')+')','1 takım',cush+'; tek parça ya da '+seats+' parça'],
      ['Sırt minderi (15 cm)',seats+' adet',''],['Kaydırmaz ayak altlığı',parts.filter(q=>/post/.test(q.g)).length+' adet',''],[out?'Dış mekân ahşap yağı':'Su bazlı vernik',out?'1,5 L':'1 L','2-3 kat']],
    join:'Cıvata + vida',
    notes:[{t:'tip',x:`Oturma yüksekliği minderle ${H} mm, oturma derinliği ${D-90} mm. Yaklaşık ${seats} kişilik.`},
      out?{t:'tip',x:'Dış mekânda minderleri yağmurda içeri al ya da su geçirmez kılıf kullan; çıtalar arası boşluk suyun akmasını sağlar.'}:null,
      W>2000&&type!=='chair'?{t:'warn',x:'Uzun kanepeyi kapıdan geçirmek zorsa yan kayıtları cıvatalı bırak; yerinde kur.'}:null]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','matkap','havsa','lokma',['isk','4 adet'],'koseIsk','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)},
    {t:'Yan çerçeveleri kur',add:['bpost','fpost','srail','arm','sslat'],tools:['matkap','lokma','gonye','isk'],x:`<p>Her uçta ${K('bpost')} arka ve ${K('fpost')} ön dikmeyi yere yatır, aralarına ${K('srail')} yan kaydı (üst kenarı yerden ${H-120} mm) M8 cıvatayla bağla. Kollu uçlarda ${K('sslat')} yan çıtaları ve ${K('arm')} kolçağı vidala.</p>`},
    {t:'Gövdeyi birleştir',add:['rail','mrail','mpost'],tools:['matkap','lokma','koseIsk','gonye'],x:`<p>İki yan çerçeveyi dik tut, ${K('rail')} ön ve arka kayıtları dikmelerin arasına cıvatala. ${W>1200?`Ortaya ${K('mrail')} orta kaydı${W>1500?` ve ${K('mpost')} orta ayakları`:''} ekle. `:''}Çaprazları ölçerek gönyeye getir.</p>`},
    {t:'Oturak ve sırt çıtalarını tak',add:['seat','back','cback'],tools:['matkap','havsa'],x:`<p>${K('seat')} oturak çıtalarını 25 mm arayla kayıtlara vidala. ${K('back')} sırt çıtalarını arka dikmelerin ön yüzüne, ${R(125-95)} mm arayla bağla.</p>`},
    ...(type==='corner'?[{t:'İki kolu birleştir',tools:['matkap','lokma'],x:`<p>Kısa kolu uzun kolun açık ucuna dik açıyla yanaştır. Bitişen dikmeleri iki M8 cıvatayla birbirine bağla; köşe kendiliğinden kare olur.</p>`}]:[]),
    finishStep(out?{outdoor:1}:{},'<p>Bitişten sonra minderleri yerleştir.</p>')];
  return c;
}

/* 35) Epoksi (nehir) masa */
function riverTable(p,o){
  const parts=[], L=p.L, W=p.W, H=p.H, Rw=p.R, sp=o.sp||'ceviz', T=o.T||50, sw=R((W-Rw)/2), slab=SLAB(sp,T,sw);
  BOX(parts,'slab','Kütük tabla',slab,0,H-T,0,L,T,sw,{cutNote:'canlı kenar nehre bakar'});
  BOX(parts,'slab','Kütük tabla',slab,0,H-T,W-sw,L,T,sw,{cutNote:'canlı kenar nehre bakar'});
  BOX(parts,'resin','Epoksi nehir','resin',0,H-T,sw,L,T,Rw,{deco:true});
  const xi=Math.min(300,R(L*0.15));
  if(o.legs==='wood'){
    const lt=T, lk=SLAB(sp,T,R(W-200));
    for(const x of [xi,L-xi-lt]) BOX(parts,'pleg','Panel ayak',lk,x,0,100,lt,H-T,W-200,{cut:[H-T,R(W-200),T]});
    BOX(parts,'stretch','Alt kayıt',LM(sp,45,95),xi+lt,150,W/2-22.5,L-2*xi-2*lt,95,45);
  } else {
    for(const x of [xi,L-xi-60]){
      for(const z of [60,W-120]) BOX(parts,'mleg','Metal ayak dikmesi','steel',x,40,z,60,H-T-80,60,{deco:true});
      for(const y of [0,H-T-40]) BOX(parts,'mbar','Metal ayak kuşağı','steel',x,y,40,60,40,W-80,{deco:true});}
  }
  const vol=R(L*Rw*T/1e6*1.15*10)/10, seal=R(L*W/1e6*0.4*10)/10;
  const c={parts,hw:[['Derin döküm epoksi reçine + sertleştirici',`${dec(vol)} L`,`${T} mm tek seferde dökülebilen tür; %15 fire dahil`],['Yüzey (kaplama) epoksisi',`${dec(seal)} L`,'gözenek kapatma ve parlak üst kat'],
      ['Epoksi renk pigmenti','1 set','isteğe bağlı'],['Melamin kaplı sunta 18 mm (kalıp)','1 takım',`taban ${L+100} × ${W+100} mm ve ${T+40} mm kenar şeritleri; ebatlama servisinde kestir`],
      ['Ambalaj bandı ve silikon','1 takım','kalıp yüzeyi ve köşe sızdırmazlığı'],['Ölçekli karıştırma kabı ve karıştırıcı uç','2-3 adet',''],['Nitril eldiven ve organik buhar maskesi (A1)','1 takım','zorunlu'],
      ...(o.legs==='wood'?[['Cıvata M8×120 + bijon somun','4 takım','alt kayıt'],['Tabla bağlantı sacı (Z sacı)','8 adet','tabla hareket edebilsin']]:[['Metal U ayak (60×40 kutu profil)','2 adet',`${R(W-80)} mm genişlik, ${H-T} mm yükseklik; hazır alınır ya da kaynakçıya yaptırılır`],['Tabla bağlantı vidası 6×40 + metal dübel','8 adet','']]),
      ['Sert yağ (hardwax oil)','0,5 L','kütük yüzeyler']],
    join:'Epoksi döküm + vida',
    notes:[{t:'warn',x:'Epoksi deriyi ve solunum yolunu tahriş eder: eldiven, gözlük ve organik buhar maskesi tak; odayı havalandır. Kalıbı terazide kur; döküm 3-7 gün sertleşir, bu sürede masayı oynatma.'},
      {t:'tip',x:`Nehir ${Rw} mm genişlikte, ${T} mm derinlikte; ${dec(vol)} L epoksi gerekir. Kütüklerin canlı kenarlarındaki kabuğu tel fırçayla temizle; kabuk kalırsa epoksiden ayrılır.`},
      {t:'tip',x:'Kütük tabla kurutulmuş (nem %8-12) olmalı. Islak ağaç kuruyunca çatlar ve epoksiden ayrılır; satıcıdan nem ölçümü iste.'}]};
  c.tools=stdTools(['daire','ray','metre','kalem','terazi','isiTab','freze','zimMak','zimKag','matkap',['isk','6 adet'],'firca']);
  c.mkSteps=K=>[
    {t:'Kütükleri hazırla',tools:['daire','ray','metre'],x:`${cutUL(c,K)}<p>İki ${K('slab')} kütüğü canlı kenarları ortaya bakacak şekilde yan yana koy, aralarını ${Rw} mm (ortalama) ayarla ve boylarını ${L} mm'ye kes. Canlı kenarın kabuğunu tel fırçayla temizle.</p>`},
    {t:'Kalıbı kur',tools:['terazi','matkap'],x:`<p>Melamin sunta tabandan ${L+100} × ${W+100} mm bir kalıp kur, kenarları vidala ve köşeleri silikonla kapat. Kalıbın içini ambalaj bandıyla kapla; epoksi banda yapışmaz. Kalıbı terazile, kütükleri içine koy ve yüzmesinler diye üstten işkenceyle tut.</p>`,tip:'Kütüklerin alt yüzüne ve kenarlarına önce ince bir kat yüzey epoksisi sür; gözenekleri kapatır, dökümde kabarcık çıkmaz.'},
    {t:'Epoksiyi dök',add:['resin'],tools:['isiTab'],x:`<p>${dec(vol)} L epoksiyi üreticinin oranında karıştır (genellikle ağırlıkça), pigmentini ekle ve 3 dakika yavaşça karıştır. Nehre yavaşça dök; yüzeydeki kabarcıkları ısı tabancasıyla uzaktan gezdirerek patlat. Üstünü tozdan koru, 3-7 gün sertleşmeye bırak.</p>`,warn:'Bir seferde üreticinin izin verdiğinden kalın dökme; epoksi ısınıp çatlar. Gerekirse iki katta dök.'},
    {t:'Kalıptan çıkar ve düzle',add:['slab'],tools:['freze','zimMak','zimKag'],x:'<p>Kalıbı sök. Tablayı freze düzleme kızağıyla iki yüzden düzle, ardından 80, 120, 180, 240, 320 ve 400 kumla sırayla zımparala. Kenarları istersen 3 mm yuvarlat.</p>'},
    {t:'Ayakları bağla',add:o.legs==='wood'?['pleg','stretch']:['mleg','mbar'],tools:['matkap','metre'],x:o.legs==='wood'?`<p>${K('pleg')} panel ayakları uçlardan ${xi} mm içeride dik tut, ${K('stretch')} alt kaydı cıvatayla bağla. Tablayı Z saclarıyla bağla; ahşap mevsimle çalışır.</p>`:`<p>Metal U ayakları uçlardan ${xi} mm içeride tablanın altına yerleştir, metal dübel ve vidalarla bağla.</p>`},
    {t:'Yüzey bitişi',tools:['firca','zimKag'],x:'<p>Tüm yüzeye ince bir kat yüzey epoksisi ya da sert yağ sür. Epoksi kat seçersen kenarlardan akan fazlasını alttan sil; 72 saat sonra kullan.</p>'}];
  return c;
}

/* ---------- 2026-11-04 (3): pergola, paravan, servis arabası, oyun çadırı, bisiklet standı, ranza ---------- */
MAT.kav32={n:'Kavela çubuk Ø32 (kayın)',type:'lumber',w:32,t:32,L:2000,tone:'beech'};
MAT.fabric={n:'Kumaş',type:'hw',tone:'fabric'};
MAT.rattan={n:'Hasır örgü',type:'hw',tone:'rattan'};
Object.assign(TONE,{fabric:[36,30,88],rattan:[38,45,62]});

/* 36) Pergola: dört dikmeli serbest ya da duvar kirişli */
// Uzun kereste: gereken boya yeten en kısa piyasa boyu (3-6 m) ayrı stok olarak
function LLONG(sp,t,w,need){const L=[3000,4000,5000,6000].find(v=>v>=need+20)||6000,k=sp+t+'x'+w+'L'+L;
  if(!MAT[k]) MAT[k]={n:`${SP[sp].n} ${t}×${w} (${L/1000} m boy)`,type:'lumber',w,t,tone:SP[sp].tone,L};return k;}
function pergola(p,o){
  const L=p.L, W=p.W, H=p.H, sp=o.sp||'emp', ov=300, wall=!!o.wall, parts=[];
  const post=LLONG(sp,95,95,H), beam=LLONG(sp,45,145,L+2*ov), raf=LLONG(sp,45,145,W+45+ov+(wall?45:45+ov)), br=LM(sp,45,95);
  const px=[0,L-95], pz=wall?[W-95]:[0,W-95];
  px.forEach(x=>pz.forEach(z=>BOX(parts,'post','Dikme',post,x,0,z,95,H,95)));
  for(const z of [-45,W]){
    if(wall&&z<0) BOX(parts,'ledger','Duvar kirişi',beam,-ov,H-145,-45,L+2*ov,145,45,{cutNote:'duvara dübelli'});
    else BOX(parts,'beam','Ana kiriş',beam,-ov,H-145,z,L+2*ov,145,45);}
  const z0=wall?-45:-45-ov, z1=W+45+ov, n=Math.max(3,Math.floor((L+2*ov)/450)+1);
  spread(n,-ov,L+ov,45).forEach(x=>BOX(parts,'rafter','Çatı kirişi',raf,x,H,z0,45,145,z1-z0,{cutNote:wall?'duvar ucu kiriş askısına':'uçları 30° pahlanır'}));
  if(o.shade){const sl=LLONG(sp,20,45,L+2*ov),ns=Math.floor((z1-z0)/150);
    spread(ns,z0+20,z1-20,45).forEach(z=>BOX(parts,'slat','Gölgelik çıtası',sl,-ov,H+145,z,L+2*ov,20,45));}
  pz.forEach(z=>{const zz=z>W/2?W+22.5:-22.5;
    for(const [x,s] of [[95,1],[L-95,-1]]){
      PART(parts,'brace','Destek payandası',br,barRings([x,H-145-500,zz],[x+s*500,H-145,zz],95,45,[0,0,1]),{cut:[R(500*Math.SQRT2+60),95,45],cutNote:'iki ucu 45° kesilir'});}});
  const npost=px.length*pz.length;
  const c={parts,hw:[['Dikme ayak papucu (galvaniz, 95 mm)',npost+' adet','betona dübelli ya da beton dökümüne gömülü'],['Galvaniz cıvata M12 × 200 + somun + pul',npost*2+' takım','kiriş-dikme'],
      ['Çatı kirişi bağlantı sacı (kasırga sacı)',n*2+' adet',''],...(wall?[['Kiriş askısı 45×145',n+' adet','duvar tarafı'],['Kimyasal dübel + M12 saplama',Math.ceil((L+2*ov)/600)+' takım','duvar kirişi']]:[]),
      ['Galvaniz vida 6×100',(npost*2*4)+' adet','payandalar'],...(o.shade?[['Paslanmaz vida 4,5×45','1 kutu','gölgelik çıtaları']]:[]),['Dış mekân ahşap yağı',Math.ceil(L*W/1e6/3)+' L','2-3 kat']],
    join:'Cıvata + bağlantı sacı',
    notes:[{t:'warn',x:'Pergola büyük bir yapıdır. Kar ve rüzgâr yükü hesabı yapılmamıştır; yapı ruhsatı gerekip gerekmediğini belediyenden öğren ve dikme temellerini bir ustaya kontrol ettir.'},
      {t:'tip',x:`Kaplama alanı ${R((L+2*ov)/10)/100} × ${R((z1-z0)/10)/100} m, kiriş altı yükseklik ${H-145} mm. Dikme araları ${L-95} × ${W-95} mm.`},
      wall?{t:'warn',x:'Duvar kirişini yalnız taşıyıcı duvara (beton, tuğla) kimyasal dübelle bağla; mantolama ya da alçıpana bağlama.'}:null]};
  c.tools=stdTools(['daire','gonyeT','aciOlcer','metre','gonye','kalem','terazi','matkap','lokma',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','aciOlcer','metre'],x:cutUL(c,K)},
    {t:'Dikme yerlerini hazırla',tools:['metre','terazi'],x:`<p>Dikme merkezlerini ${L-95} × ${W-95} mm dikdörtgen olarak işaretle; köşegenleri eşit olmalı. Ayak papuçlarını betona dübelle ya da 40×40×60 cm temel çukurlarına beton dökerek göm; üst kotlarını terazile.</p>`},
    {t:'Dikmeleri dik',add:['post'],tools:['matkap','terazi','lokma'],x:`<p>${K('post')} dikmeleri papuçlara oturt ve iki yönden terazileyip geçici payandayla tut.</p>`,warn:'Dikmeler tek başına devrilebilir; kirişler bağlanana kadar her dikmeyi iki yönden payandala.'},
    {t:'Ana kirişleri bağla',add:['beam','ledger'],tools:['matkap','lokma','terazi'],x:`<p>${wall?`${K('ledger')} duvar kirişini yerden ${H-145} mm yükseklikte kimyasal dübellerle duvara, `:''}${K('beam')} kirişleri dikmelerin dış yüzüne M12 cıvatayla bağla; iki uçta ${ov} mm taşsın.</p>`},
    {t:'Payandaları tak',add:['brace'],tools:['matkap'],x:`<p>${K('brace')} payandaları dikme ile kiriş arasına 45° açıyla 6×100 vidalarla bağla. Yapıyı yanal sallanmaya karşı sabitler.</p>`},
    {t:'Çatı kirişlerini diz',add:['rafter'],tools:['matkap','metre'],x:`<p>${n} ${K('rafter')} kirişi ana kirişlerin üstüne eşit aralıkla diz ve her kesişime bağlantı sacı vidala.</p>`},
    ...(o.shade?[{t:'Gölgelik çıtalarını tak',add:['slat'],tools:['matkap'],x:`<p>${K('slat')} çıtaları çatı kirişlerinin üstüne 150 mm arayla, her kesişime bir paslanmaz vidayla bağla.</p>`}]:[]),
    finishStep({outdoor:1})];
  return c;
}

/* 37) Paravan (oda bölücü) */
function screen(p,o){
  const parts=[], N=p.N, PW=p.W, H=p.H, sp=o.sp||'kayin', st=LM(sp,28,45), lt=LM(sp,12,30), rattan=o.fill==='rattan';
  for(let i=0;i<N;i++){const x0=i*(PW+6);
    for(const x of [x0,x0+PW-45]) BOX(parts,'stile','Dikey kayıt',st,x,0,0,45,H,28);
    for(const y of [100,H-45]) BOX(parts,'rail','Yatay kayıt',st,x0+45,y,0,PW-90,45,28);
    if(rattan) BOX(parts,'rattan','Hasır örgü','rattan',x0+45,145,12,PW-90,H-190,4,{deco:true});
    else {const n=Math.max(2,Math.floor((PW-90+30)/60));spread(n,x0+45,x0+PW-45,30).forEach(x=>BOX(parts,'lath','Dikey çıta',lt,x,145,8,30,H-190,12));}}
  const c={parts,hw:[['Paravan menteşesi (çift yönlü)',(N-1)*3+' adet','paneller arası'],['Ahşap tutkalı','1 şişe',''],['Kavela 8×40',N*8+' adet','kayıt birleşimleri'],
      ...(rattan?[['Hasır örgü (rattan) rulo',`${N} parça, ${PW-60} × ${H-160} mm`,'kenarlardan 15 mm pay'],['Hasır çıtası 6×12',`${R(N*2*(PW+H)/1000*1.1*10)/10} m`.replace('.',','),'örgüyü sıkıştırır'],['Zımba teli 8 mm','1 kutu','']]:[['Çivi 1,2×25 (başsız)','1 paket','çıtalar']]),
      ['Keçe ayak',N*2+' adet',''],['Su bazlı vernik','0,5 L','']],join:'Kavela + tutkal + menteşe',
    notes:[{t:'tip',x:`${N} panel, her biri ${PW} mm genişlikte; açık hâlde toplam ${N*PW+(N-1)*6} mm. Zikzak açıldığında kendi başına durur, tam düz açma.`}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','dubelSet',['isk','4 adet'],'koseIsk',rattan?'cekic':null,'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Çerçeveleri kur',add:['stile','rail'],tools:['dubelSet','matkap','isk','koseIsk'],x:`<p>Her panel için iki ${K('stile')} dikey ve iki ${K('rail')} yatay kaydı ikişer 8 mm kavelayla birleştir; alt kayıt yerden 100 mm yukarıda. Çaprazları eşitleyip işkencede kurut.</p>`},
    rattan?{t:'Hasırı ger',add:['rattan'],tools:['cekic'],x:'<p>Hasırı ılık suda 30 dakika yumuşat. Çerçevenin arka yüzüne gergin şekilde zımbala, üstüne hasır çıtasını yapıştır. Hasır kuruyunca kendiliğinden gerilir.</p>'}
      :{t:'Çıtaları yerleştir',add:['lath'],tools:['matkap','metre'],x:`<p>${K('lath')} çıtaları 30 mm arayla, yatay kayıtlara tutkal ve başsız çiviyle bağla. Aralık için 30 mm bir takoz kullan.</p>`},
    {t:'Panelleri birleştir',tools:['matkap'],x:'<p>Panelleri yan yana yatır, çift yönlü menteşeleri her ek yerine üç adet vidala. Ayaklara keçe yapıştır.</p>'},
    finishStep({})];
  return c;
}

/* 38) Servis arabası */
function barCart(p,o){
  const parts=[], L=p.L, W=p.W, H=p.H, N=p.N||2, sp=o.sp||'mese', lg=LM(sp,45,45), cl=LM(sp,20,45), lip=LM(sp,12,45), wh=75;
  for(const x of [0,L-45]) for(const z of [0,W-45]) BOX(parts,'leg','Ayak',lg,x,wh,z,45,H-wh,45);
  const ys=spread(N,wh+110,H-60,18);
  ys.forEach(y=>{BOX(parts,'shelf','Raf','ply18',45,y,0,L-90,18,W,{cutNote:'kenarları bantlı'});
    for(const x of [45,L-65]) BOX(parts,'cleat','Raf taşıyıcı',cl,x,y-45,45,20,45,W-90);
    for(const z of [0,W-12]) BOX(parts,'lip','Raf kenarlığı',lip,45,y+18,z,L-90,45,12);
    for(const x of [45,L-57]) BOX(parts,'lip','Raf kenarlığı',lip,x,y+18,12,12,45,W-24);});
  BOX(parts,'handle','Tutamak çubuğu','kav25',10,H-70,45,25,25,W-90,{cut:[W-60,25,25],cutNote:'uçları 15 mm ayaklara gömülür'});
  for(const x of [0,L-45]) for(const z of [0,W-45]) BOX(parts,'wheel','Tekerlek','steel',x-5,0,z-5,55,wh,55,{deco:true});
  const c={parts,hw:[['Döner tekerlek 75 mm',(o.brake?'2 frenli + 2 frensiz':'4 adet'),'plaka bağlantılı'],['Sunta vidası 4×40',N*16+' adet','raf taşıyıcı ve kenarlık'],['Kavela 8×40',N*8+' adet','taşıyıcı-ayak'],
      ['Kenar bandı 22 mm (meşe kaplama)',`${dec(R(N*2*(L+W)/1000*1.1*10)/10)} m`,''],['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik (sıvıya dayanıklı)','0,5 L','']],join:'Kavela + vida',
    notes:[{t:'tip',x:`${N} raflı, raflar arası yaklaşık ${R(ys[1]-ys[0]-18)} mm. Raf kenarlıkları şişelerin kaymasını önler.`}]};
  c.tools=stdTools(['gonyeT','daire','ray','metre','gonye','kalem','matkap','dubelSet','forstnerSet','havsa',['isk','4 adet'],'utu','bicak','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','ray'],x:cutUL(c,K)},
    {t:'Rafları bantla',add:['shelf'],tools:['utu','bicak'],x:`<p>${K('shelf')} rafların görünen kenarlarına kenar bandını ütüyle yapıştır, taşan kısmı maket bıçağıyla kes.</p>`},
    {t:'Yan çerçeveleri kur',add:['leg','cleat','handle'],tools:['dubelSet','matkap','forstnerSet','isk'],x:`<p>İki ${K('leg')} ayağı yan yana koy ve ${K('cleat')} raf taşıyıcılarını raf altlarına denk gelecek yüksekliklere kavela ve tutkalla bağla. Tutamak tarafındaki iki ayağa 25 mm, 15 mm derin delik aç ve ${K('handle')} çubuğu yerleştir.</p>`},
    {t:'Rafları ve kenarlıkları tak',add:['lip'],tools:['matkap','havsa','gonye'],x:`<p>Rafları taşıyıcıların üstüne yerleştirip alttan vidala. ${K('lip')} kenarlıkları rafın dört kenarına tutkal ve vidayla bağla.</p>`},
    {t:'Tekerlekleri tak',add:['wheel'],tools:['matkap'],x:'<p>Arabayı ters çevir, tekerlek plakalarını ayak altlarına vidala. Frenli tekerlekleri tutamak tarafına tak.</p>'},
    finishStep({})];
  return c;
}

/* 39) Çocuk oyun çadırı (tipi) */
function teepee(p,o){
  const parts=[], N=p.N||5, S=p.D, H=p.H, r=S/2, cx=r+40, cz=r+40, ext=1.08, poles=[];
  for(let i=0;i<N;i++){const a=Math.PI/2+i*2*Math.PI/N, b=[cx+r*Math.cos(a),0,cz+r*Math.sin(a)], t=[cx,H,cz], e=v3.add(b,v3.mul(v3.sub(t,b),ext));poles.push(b);
    PART(parts,'pole','Direk','kav32',cylRings(b,e,16,16,12),{smooth:true,cut:[R(v3.len(v3.sub(e,b)))+20,32,32],cutNote:'üstten 150 mm\'de Ø8 ip deliği'});}
  if(o.cover!==false) PART(parts,'cover','Çadır örtüsü','fabric',cylRings([cx,0,cz],[cx,H*0.9,cz],r*0.97,r*0.1,N),{deco:true});
  const len=R(Math.hypot(r,H)*ext)+20, side=R(2*r*Math.sin(Math.PI/N));
  const c={parts,hw:[['Pamuklu kanvas kumaş (çadır örtüsü)',`${dec(R(N*side*Math.hypot(r,H)/1e6*1.3*10)/10)} m²`,'kapı açıklıklı; terziye diktirilir ya da hazır alınır'],['Pamuk ip Ø8','3 m','tepede direkleri bağlar'],
      ['Kaydırmaz lastik ayak',N+' adet','direk altlarına'],['Yer minderi',`Ø${R(S*0.9)} mm`,'isteğe bağlı'],['Çocuğa uygun su bazlı vernik','0,25 L','EN 71-3 işaretli']],join:'İp bağlantı',
    notes:[{t:'tip',x:`${N} direkli, taban çapı ${S} mm, yükseklik ${H} mm. Direkler ${len} mm; Ø32 kavela 2 m boyda satılır.`},
      {t:'warn',x:'Direklerin uçlarını ve ip deliklerini iyice yuvarlat. Çocuk içerideyken çadırın devrilmemesi için direklerin tabana tam bastığını kontrol et; kaygan zeminde lastik ayak tak.'}]};
  c.tools=stdTools(['gonyeT','metre','kalem','matkap','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Direkleri kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'İp deliklerini aç',tools:['matkap','metre'],x:'<p>Direkleri yan yana diz ve üst uçtan 150 mm\'yi işaretle. Her direğe 8 mm delik aç; delik ağızlarını zımparayla yuvarlat.</p>'},
    {t:'Zımpara ve vernik',tools:['zimMak','zimKag','firca'],x:'<p>Direkleri 120 ve 180 kumla zımparala, uçları yuvarlat. Çocuğa uygun vernikle iki kat kapat.</p>'},
    {t:'Çadırı kur',add:['pole','cover'],tools:['metre'],x:`<p>Direklerin üst uçlarını delikten geçen iple gevşekçe bağla. Alt uçları Ø${S} mm daire üzerinde eşit aralıkla aç, sonra ipi sıkıca sar. Örtüyü üstten geçir ve alt köşelerindeki bağcıklarla direklere bağla.</p>`}];
  return c;
}

/* 40) Bisiklet standı: zemin ya da duvar */
function bikeStand(p,o){
  const parts=[], N=p.N, sp=o.sp||'cam';
  if(o.wall){const H=p.H||450, pl=LM(sp,28,140), arm=LM(sp,28,70), pitch=p.W||450;
    for(let i=0;i<N;i++){const x=i*pitch;BOX(parts,'plank','Duvar tahtası',pl,x,0,0,140,H,28);
      for(const ax of [x,x+112]) BOX(parts,'arm','Taşıma kolu',arm,ax,H-70,28,28,70,350,{cutNote:'ucu yuvarlatılır, üstü keçe kaplı'});}
    const c={parts,hw:[['Dübel 10 mm + vida 6×80',N*4+' takım','beton ya da tuğla duvar'],['Ahşap tutkalı + kavela 8×40',N*4+' adet','kollar'],['Keçe ya da kauçuk şerit','1 m','bisiklet boyası çizilmesin'],['Su bazlı vernik','0,25 L','']],join:'Kavela + tutkal + dübel',
      notes:[{t:'tip',x:`${N} bisiklet, aralarında ${pitch} mm. Bisiklet üst borusundan iki kola asılır; gidon genişliği için aralığı en az 450 mm tut.`},{t:'warn',x:'Alçıpan duvara asma; yalnız beton ya da tuğla duvara dübelle.'}]};
    c.tools=stdTools(['gonyeT','dekupaj','metre','kalem','terazi','matkap','dubelSet',['isk','2 adet'],'zimMak','zimKag','firca']);
    c.mkSteps=K=>[{t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
      {t:'Kolları bağla',add:['plank','arm'],tools:['dubelSet','matkap','isk'],x:`<p>Her ${K('plank')} tahtanın üst ucuna iki ${K('arm')} kolu 84 mm arayla, ikişer kavela ve tutkalla dik bağla. Kolların ucunu dekupajla yuvarlat, üstüne keçe yapıştır.</p>`},
      finishStep({}),{t:'Duvara as',tools:['terazi','matkap'],x:'<p>Tahtaları terazileyerek duvara 4\'er dübelle bağla; kolların yerden yüksekliği bisikletin tekerleği yere değmeyecek kadar olsun.</p>'}];
    return c;}
  const D=p.D||500, pitch=p.W||350, L=N*pitch+100, rail=LM(sp,45,95), slot=60;
  for(const z of [0,D-95]) BOX(parts,'rail','Taban kirişi',rail,0,0,z,L,45,95);
  for(let i=0;i<N;i++){const xc=50+pitch*(i+.5);
    for(const x of [xc-slot/2-18,xc+slot/2]) BOX(parts,'board','Tekerlek yanağı','ply18',x,45,0,18,320,D,{cutNote:'üst kenarı tekerlek yayıyla kesilir'});}
  const c={parts,hw:[['Sunta vidası 5×60',N*8+' adet','yanaklar'],['Kaydırmaz lastik ayak','4 adet',''],['Dış mekân vernik','0,5 L','']],join:'Vida',
    notes:[{t:'tip',x:`${N} bisiklet, aralık ${pitch} mm, tekerlek yuvası ${slot} mm (dağ bisikleti lastiği için 70 mm yap).`}]};
  c.tools=stdTools(['daire','ray','gonyeT','dekupaj','metre','kalem','matkap','havsa','zimMak','zimKag','firca']);
  c.mkSteps=K=>[{t:'Parçaları kes',tools:['daire','ray','gonyeT'],x:cutUL(c,K)},
    {t:'Yanakları biçimlendir',add:['board'],tools:['dekupaj','zimMak'],x:`<p>${K('board')} yanakların üst kenarına tekerlek çapına uygun bir yay çiz ve dekupajla kes. Kenarları zımparayla yuvarlat.</p>`},
    {t:'Standı kur',add:['rail'],tools:['matkap','havsa','metre'],x:`<p>İki ${K('rail')} kirişi ${D} mm arayla yere koy. Yanakları çiftler hâlinde aralarında ${slot} mm yuva kalacak şekilde kirişlerin üstüne alttan vidala.</p>`},
    finishStep({outdoor:1})];
  return c;
}

/* 41) Ranza */
function bunk(p,o){
  const parts=[], sp=o.sp||'cam', lp=70, lk=LM(sp,lp,lp), rk=LM(sp,28,140), gk=LM(sp,28,95), IL=p.L+10, IW=p.W+10, H=p.H, tl=380, tu=H-430;
  for(const x of [0,lp+IL]) for(const z of [0,lp+IW]) BOX(parts,'post','Dikme',lk,x,0,z,lp,H,lp);
  const ck=LM(sp,30,45), sk=LM(sp,20,70), ns=Math.max(6,Math.floor((IL+60)/130));
  for(const [top,tag] of [[tl,'alt'],[tu,'üst']]){const yr=top-140;
    for(const z of [lp-28,lp+IW]) BOX(parts,'side','Yan kasa',rk,lp,yr,z,IL,140,28);
    for(const x of [lp-28,lp+IL]) BOX(parts,'end','Baş/ayak kasası',rk,x,yr,lp,28,140,IW);
    for(const z of [lp,lp+IW-30]) BOX(parts,'cleat','Taşıyıcı çıta',ck,lp,top-90,z,IL,45,30);
    spread(ns,lp,lp+IL,70).forEach(x=>BOX(parts,'slat','Baza çıtası',sk,x,top-45,lp,70,20,IW));
    BOX(parts,'mat','Şilte','foam',lp+5,top-25,lp+5,IL-10,150,IW-10,{deco:true});}
  const open=520, gy=[tu+160,tu+330];
  gy.forEach(y=>{BOX(parts,'guard','Korkuluk',gk,lp,y,lp-28,IL,95,28);BOX(parts,'guard','Korkuluk',gk,lp,y,lp+IW,IL-open,95,28);
    for(const x of [lp-28,lp+IL]) BOX(parts,'guardE','Baş/ayak korkuluğu',gk,x,y,lp,28,95,IW);});
  const lx=lp+IL-open+40, lr=LM(sp,28,70), lz=lp+IW+28;
  for(const x of [lx,lx+open-80-28]) BOX(parts,'lrail','Merdiven dikmesi',lr,x,0,lz,28,tu+330,28);
  for(let y=250;y<tu;y+=250) BOX(parts,'rung','Merdiven basamağı',lr,lx+28,y,lz,open-80-56,70,28);
  const c={parts,hw:[['Kancalı yatak bağlantı aparatı','8 takım','kasa-dikme'],['Vida 5×60',Math.ceil(IL/200)*4+' adet','taşıyıcı çıtalar'],['Vida 4×40',ns*8+' adet','baza çıtaları'],
      ['Cıvata M8×120 + bijon somun','16 takım','korkuluk ve merdiven'],['Ahşap tutkalı','1 şişe',''],['Su bazlı vernik (EN 71-3)','1,5 L','']],join:'Yatak aparatı + cıvata',
    notes:[{t:'warn',x:'Üst yatak 6 yaşından küçük çocuklar için uygun değildir. Korkuluk üst kenarı şilte üstünden en az 160 mm yukarıda olmalı; şilte kalınlığı 150 mm\'yi geçmesin. Ranzayı duvara sabitle.'},
      {t:'tip',x:`Şilte ${p.W}×${p.L} mm (2 adet). Alt yatak üstü ${tl} mm, üst yatak üstü ${tu} mm; aradaki boşluk ${tu-tl-140} mm.`}]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','matkap','havsa','lokma',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)},
    {t:'Baş ve ayak çerçevelerini kur',add:['post','end','guardE'],tools:['matkap','isk','gonye'],x:`<p>İki ${K('post')} dikmeyi yan yana yatır; ${K('end')} kasaları alt yatak için ${tl} mm, üst yatak için ${tu} mm üst kenar yüksekliğinde tutkal ve vidayla bağla. ${K('guardE')} korkulukları üst kasanın üstüne ekle. İkinci çerçeveyi aynı yap.</p>`},
    {t:'Yan kasaları bağla',add:['side'],tools:['matkap','metre'],x:`<p>Kancalı aparatlarla ${K('side')} kasaları iki çerçeve arasına tak; çaprazları ölçerek gönyeye getir.</p>`},
    {t:'Bazaları kur',add:['cleat','slat'],tools:['matkap'],x:`<p>${K('cleat')} çıtaları yan kasaların iç yüzüne vidala, ${ns}'er ${K('slat')} çıtayı eşit aralıkla diz ve vidala.</p>`},
    {t:'Korkuluk ve merdiveni tak',add:['guard','lrail','rung'],tools:['matkap','lokma'],x:`<p>${K('guard')} korkulukları üst yatağın iki yanına cıvatala; ön tarafta merdiven için ${open} mm açıklık bırak. ${K('lrail')} merdiven dikmelerini ön yan kasalara cıvatala, ${K('rung')} basamakları 250 mm arayla bağla.</p>`,warn:'Merdiven basamakları ve korkuluk cıvataları her ay kontrol edilmeli.'},
    finishStep({},'<p>Ranzayı en az iki noktadan duvara L köşebentle sabitle.</p>')];
  return c;
}

/* ---------- 2026-11-05: mutfak adası, alet kulübesi, hamak standı, okuma köşesi ---------- */
MAT.shingle={n:'Bitümlü shingle',type:'hw',tone:'shingle'};
Object.assign(TONE,{shingle:[15,12,30]});
// Masif tezgâh (parmak birleşimli lamine), 3 m boy
function WORKTOP(sp,t,w){const k='top'+sp+t+'x'+w;
  if(!MAT[k]) MAT[k]={n:`${SP[sp].n} masif tezgâh ${t} mm (${w} mm, lamine)`,type:'lumber',w,t,tone:SP[sp].tone,L:3000};return k;}

/* 42) Mutfak adası */
function kitchenIsland(p,o){
  const parts=[], L=p.L, W=p.W, H=p.H, m=o.mat||'ply18', t=MAT[m].t||18, sp=o.sp||'mese', bar=o.bar!==false, ov=bar?250:20, cz0=ov, cz1=W-38, ch=H-40, pl=80;
  BOX(parts,'top','Tezgâh',WORKTOP(sp,40,W),-20,ch,0,L+40,40,W,{cutNote:bar?`arka tarafta ${ov} mm oturma çıkıntısı`:'kenarları 3 mm yuvarlatılır'});
  for(const x of [0,L-t]) BOX(parts,'side','Yan panel',m,x,0,cz0,t,ch,cz1-cz0);
  BOX(parts,'bottom','Taban',m,t,pl,cz0+t,L-2*t,t,cz1-cz0-t);
  BOX(parts,'back','Arka panel',m,t,pl,cz0,L-2*t,ch-pl,t);
  BOX(parts,'kick','Baza',m,t,0,cz1-70,L-2*t,pl,t,{cutNote:'50 mm içeride'});
  const bays=L>1000?2:1, bw=(L-2*t-(bays-1)*t)/bays;
  if(bays>1) BOX(parts,'div','Ara bölme',m,t+bw,pl+t,cz0+t,t,ch-pl-t,cz1-cz0-t);
  for(let i=0;i<bays;i++){const x=t+i*(bw+t);
    BOX(parts,'shelf','Raf',m,x,R((pl+t+ch)/2),cz0+t,bw,t,cz1-cz0-t-20);
    BOX(parts,'door','Kapak',m,x+2,pl+t+2,cz1,bw-4,ch-pl-t-4,t,{cutNote:'kenarları bantlı'});}
  const c={parts,hw:[['Gömme menteşe 35 mm (yavaş kapanan)',bays*2+' adet',''],['Kulp',bays+' adet',''],['Konfirmat vidası 7×50',(bays>1?24:16)+' adet','gövde'],
      ['Raf pimi 5 mm',bays*4+' adet',''],['Tezgâh bağlantı köşebendi (yarıklı)','6 adet','tezgâh çalışabilsin'],...(bar?[['Gizli tezgâh destek sacı (L, 250 mm)',Math.max(2,Math.ceil(L/600))+' adet','oturma çıkıntısının altına']]:[]),
      ['Ayar ayağı (100 mm)','4 adet','baza arkası'],['Kenar bandı 22 mm',`${dec(R((2*L+4*H)*bays/1000*1.1*10)/10)} m`,''],['Tezgâh yağı (gıdaya uygun)','0,5 L','3 kat']],join:'Konfirmat + menteşe',
    notes:[{t:'tip',x:`Tezgâh ${L+40} × ${W} mm, yerden ${H} mm.${bar?` Arka taraftaki ${ov} mm çıkıntının altına ${Math.max(2,Math.floor(L/550))} bar taburesi sığar (oturma yüksekliği 620-650 mm).`:''}`},
      {t:'tip',x:'Ada sabit değilse ayar ayaklarını yere vidalı köşebentlerle sabitle; tezgâha yaslanınca kaymasın.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','matkap','konfUc','forstner','rafSab','havsa',['isk','4 adet'],'koseIsk','utu','bicak','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','metre'],x:cutUL(c,K),tip:'Plakaları ebatlama servisine kestirirsen kesim listesini mesajla gönderebilirsin.'},
    {t:'Kenarları bantla',add:['door'],tools:['utu','bicak'],x:`<p>${K('door')} kapakların dört kenarını ve gövde parçalarının görünen ön kenarlarını bantla.</p>`},
    {t:'Gövdeyi kur',add:['side','bottom','back','kick','div'],tools:['matkap','konfUc','koseIsk','gonye'],x:`<p>${K('side')} yanları, ${K('bottom')} tabanı ve ${K('back')} arka paneli konfirmatla birleştir${bays>1?`; ${K('div')} ara bölmeyi ortaya yerleştir`:''}. ${K('kick')} bazayı ön alttan 50 mm içeride bağla. Çaprazları ölçerek gönyeye getir.</p>`},
    {t:'Rafları ve kapakları tak',add:['shelf'],tools:['rafSab','forstner','matkap'],x:`<p>Raf pimi şablonuyla delikleri aç, ${K('shelf')} rafları yerleştir. Kapaklara 35 mm forstnerle menteşe çanağı aç ve kapakları as.</p>`},
    {t:'Tezgâhı bağla',add:['top'],tools:['matkap','metre','zimMak'],x:`<p>${K('top')} tezgâhı gövdenin üstüne ortala${bar?`, oturma tarafında ${ov} mm taşsın`:''}. Yarıklı köşebentlerle alttan bağla; masif ahşap mevsimle genişler, vida deliklerini yarıktan geçir.${bar?' Çıkıntının altına gizli destek saçlarını vidala.':''}</p>`},
    {t:'Tezgâh yağı',tools:['firca','zimKag'],x:'<p>Tezgâhı 180 ve 240 kumla zımparala, gıdaya uygun tezgâh yağıyla 24 saat arayla üç kat yağla. Gövdeyi boya ya da vernikle bitir.</p>'}];
  return c;
}

/* 43) Bahçe alet kulübesi (tek eğimli çatı) */
function shed(p,o){
  const parts=[], W=p.W, D=p.D, Hf=p.H, Hb=p.H-250, sp=o.sp||'emp', y0=113;
  const post=LM(sp,70,70), stud=LM(sp,45,70), plate=LLONG(sp,45,70,W), hd=LM(sp,45,95), bear=LLONG(sp,70,95,W), cl=LLONG(sp,20,120,W+40), clS=LLONG(sp,20,120,D);
  const dw=Math.min(o.door==='double'?1400:800,W-300), dx0=(W-dw)/2, dx1=dx0+dw, dh=Math.min(1900,Hf-45-95-y0);
  spread(3,0,D,95).forEach(z=>BOX(parts,'bearer','Taban kirişi',bear,0,0,z,W,95,95));
  const nf=Math.ceil(D/1220);for(let i=0;i<nf;i++){const z=i*D/nf;BOX(parts,'floor','Taban levhası','ply18',0,95,z,W,18,D/nf);}
  for(const [x,z,h] of [[0,0,Hb],[W-70,0,Hb],[0,D-70,Hf],[W-70,D-70,Hf]]) BOX(parts,'post','Köşe dikmesi',post,x,y0,z,70,h-y0,70);
  BOX(parts,'plate','Üst kuşak',plate,70,Hb-45,0,W-140,45,70);BOX(parts,'plate','Üst kuşak',plate,70,Hf-45,D-70,W-140,45,70);
  const nb=Math.max(0,Math.floor((W-140)/600));spread(nb,70,W-70,45).forEach(x=>BOX(parts,'stud','Dikme',stud,x,y0,0,45,Hb-45-y0,70));
  const ns=Math.max(0,Math.floor((D-140)/600));for(const x of [0,W-70]) spread(ns,70,D-70,45).forEach(z=>BOX(parts,'stud','Dikme',stud,x,y0,z,70,Hb-y0,45));
  for(const x of [dx0-45,dx1]) if(x>70&&x<W-115) BOX(parts,'jamb','Kapı dikmesi',stud,x,y0,D-70,45,Hf-45-y0,70);
  BOX(parts,'header','Kapı lentosu',hd,dx0,y0+dh,D-70,dw,95,70);
  const rows=h=>{const a=[];for(let y=y0;y+110<=h+5;y+=110)a.push(y);return a;}; // 120 mm tahta, 10 mm bindirme: görünen 110 mm
  rows(Hb).forEach(y=>{BOX(parts,'clad','Kaplama tahtası',cl,-20,y,-20,W+40,110,20,{cut:[W+40,120,20]});for(const x of [-20,W]) BOX(parts,'cladS','Yan kaplama tahtası',clS,x,y,0,20,110,D,{cut:[D,120,20]});});
  rows(Hf).forEach(y=>{if(y+110<=y0+dh){for(const [a,b] of [[-20,dx0],[dx1,W+20]]) if(b-a>30) BOX(parts,'cladF','Ön kaplama tahtası',LM(sp,20,120),a,y,D,b-a,110,20,{cut:[R(b-a),120,20]});}
    else if(y>=y0+dh) BOX(parts,'cladT','Kapı üstü kaplama tahtası',cl,-20,y,D,W+40,110,20,{cut:[W+40,120,20]});});
  const leaves=o.door==='double'?2:1;for(let i=0;i<leaves;i++){const lw=dw/leaves;BOX(parts,'door','Kapı kanadı','ply18',dx0+i*lw+3,y0+3,D+20,lw-6,dh-6,18,{cutNote:'dış yüzü kaplama tahtasıyla kaplanır'});}
  const rl=Math.hypot(D+300,Hf-Hb), nr=Math.max(3,Math.floor((W+200)/600)+1);
  spread(nr,-100,W+100,45).forEach(x=>PART(parts,'rafter','Çatı kirişi',LLONG(sp,45,95,rl),barRings([x+22.5,Hb+47,-150],[x+22.5,Hf+47,D+150],95,45,[1,0,0]),{cut:[R(rl),95,45],cutNote:'iki ucu çatı eğimiyle kesilir'}));
  const nrs=Math.ceil((W+300)/1220), rsw=(W+300)/nrs;
  for(let i=0;i<nrs;i++){const xc=-150+rsw*(i+.5);PART(parts,'roof','Çatı levhası','ply18',barRings([xc,Hb+103,-150],[xc,Hf+103,D+150],rsw,18,[0,1,0]),{cut:[R(rl),R(rsw),18]});}
    const area=R((W+320)*(rl+20)/1e6*1.1*10)/10;
  const c={parts,hw:[['Bitümlü shingle + çatı keçesi',`${dec(area)} m²`,'kenar profiliyle'],['Galvaniz vida 5×80','2 kutu','iskelet'],['Paslanmaz vida 4×40','2 kutu','kaplama tahtaları'],
      ['Kapı menteşesi (T tipi, galvaniz)',leaves*3+' adet',''],['Kapı sürgüsü + asma kilit halkası','1 takım',''],['Beton blok (40×20×20)','6 adet','taban kirişlerinin altına'],
      ['Kasırga sacı (çatı kirişi)',nr*2+' adet',''],['Dış mekân ahşap boyası ya da yağı',`${Math.ceil(2*(W+D)*Hf/1e6/8*2)} L`,'2 kat']],join:'Vida + bağlantı sacı',
    notes:[{t:'warn',x:'Kulübe sabit bir yapıdır; kurmadan önce belediye ve site yönetimi kurallarını öğren. Çatı kar yükü hesabı yapılmamıştır.'},
      {t:'tip',x:`Taban ${W} × ${D} mm, ön yükseklik ${Hf} mm, arka ${Hb} mm (tek eğimli çatı arkaya akıtır). Kapı açıklığı ${dw} × ${dh} mm.`},
      {t:'tip',x:'Taban kirişlerini toprağa değdirme; beton blokların üstüne koy ve altına çakıl ser. Emprenye kereste kullan.'}]};
  c.tools=stdTools(['daire','ray','gonyeT','aciOlcer','metre','gonye','kalem','terazi','matkap','havsa',['isk','4 adet'],'zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Zemini hazırla',add:['bearer'],tools:['terazi','metre'],x:`<p>${W} × ${D} mm alanı düzle, çakıl ser ve 6 beton bloğu terazide diz. ${K('bearer')} taban kirişlerini blokların üstüne koy; köşegenleri eşitle.</p>`},
    {t:'Tabanı kapat',add:['floor'],tools:['matkap'],x:`<p>${K('floor')} taban levhalarını kirişlere 200 mm arayla vidala.</p>`},
    {t:'Duvar iskeletini kur',add:['post','plate','stud','jamb','header'],tools:['matkap','terazi','gonye'],x:`<p>${K('post')} köşe dikmelerini (önde ${Hf} mm, arkada ${Hb} mm) tabana bağla ve terazile. ${K('plate')} üst kuşakları, ${K('stud')} ara dikmeleri ve kapı için ${K('jamb')} dikmeleri ve ${K('header')} lentoyu tak.</p>`,warn:'İskelet kaplanana kadar yanal sallanır; köşelere geçici çapraz payanda vidala.'},
    {t:'Çatıyı kur',add:['rafter','roof'],tools:['matkap','aciOlcer'],x:`<p>${K('rafter')} çatı kirişlerini öndeki ve arkadaki üst kuşaklara kasırga saclarıyla bağla; önden ve arkadan 150 mm taşsın. ${K('roof')} levhalarını vidala, üstüne keçe ve shingle uygula.</p>`},
    {t:'Kaplamayı çak',add:['clad','cladS','cladF','cladT'],tools:['matkap','metre'],x:`<p>Kaplama tahtalarını alttan başlayarak 10 mm bindirmeyle (yalı baskı) her dikmeye ikişer paslanmaz vidayla bağla. Yan duvarlarda üstte kalan üçgen boşluğu eğime göre kesilmiş tahtalarla kapat.</p>`},
    {t:'Kapıyı as',add:['door'],tools:['matkap'],x:`<p>${K('door')} kapı kanadının dışını kaplama tahtasıyla kapla, arkasına Z biçiminde çapraz tahta vidala. T menteşelerle as, sürgüyü tak.</p>`},
    {t:'Boya',tools:['boya'],x:'<p>Bütün dış yüzeye dış mekân ahşap boyası ya da yağı uygula; uç kesitlere ekstra kat sür.</p>'}];
  return c;
}

/* 44) Hamak standı */
function hammockStand(p,o){
  const parts=[], L=p.L, H=p.H, sp=o.sp||'emp', zc=450, bl=LLONG(sp,70,145,L-800), ft=LM(sp,70,145), am=LLONG(sp,70,145,Math.hypot(470,H)+200);
  for(const x of [400,L-545]) BOX(parts,'foot','Ayak traversi',ft,x,0,0,145,70,900);
  BOX(parts,'base','Taban kirişi',bl,400,70,zc-35,L-800,145,70);
  for(const s of [1,-1]){const bx=s>0?470:L-470, tx=s>0?40:L-40, top=[tx,H+120,zc], bot=[bx,215,zc];
    PART(parts,'arm','Kol',am,barRings(bot,top,145,70,[0,0,1]),{cut:[R(v3.len(v3.sub(top,bot)))+60,145,70],cutNote:'alt ucu açılı, tabana cıvatalı'});
    const mid=v3.add(bot,v3.mul(v3.sub(top,bot),.45)), b2=[bx+s*700,215,zc];
    PART(parts,'brace','Payanda',LM(sp,45,95),barRings(b2,mid,95,45,[0,0,1]),{cut:[R(v3.len(v3.sub(mid,b2)))+60,95,45],cutNote:'iki ucu açılı'});}
  for(const s of [1,-1]){const tx=s>0?60:L-60, ex=s>0?600:L-600;chain(parts,[tx,H+80,zc],[ex,700,zc],'rope',7);}
  BOX(parts,'net','Hamak','fabric',600,560,zc-400,L-1200,40,800,{deco:true});
  const c={parts,hw:[['Göz cıvatası M12 (galvaniz)','2 adet','kol uçları'],['Galvaniz cıvata M12×200 + somun + pul','6 takım','kol-taban, ayak-taban'],['Galvaniz vida 6×100','8 adet','payandalar'],
      ['Hamak askı halatı + karabina','2 takım','en az 200 kg'],['Dış mekân ahşap yağı','1 L','']],join:'Cıvata',
    notes:[{t:'warn',x:'Hamak standı yalnız tek kişi içindir. Ayakları düz zemine koy; eğimli zeminde devrilebilir. Dayanım hesabı yapılmamıştır; ilk kullanımda yavaşça yükle.'},
      {t:'tip',x:`Uçtan uca ${L} mm; ${L-600} mm'ye kadar uzunluktaki hamaklar asılır. Asma noktası yerden ${H+80} mm.`}]};
  c.tools=stdTools(['daire','gonyeT','aciOlcer','metre','kalem','matkap','lokma','havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Tabanı kur',add:['foot','base'],tools:['matkap','lokma','gonye'],x:`<p>${K('foot')} traversleri ${K('base')} kirişin iki ucuna dik açıyla, alttan M12 cıvatayla bağla.</p>`},
    {t:'Kolları bağla',add:['arm','brace'],tools:['matkap','lokma','aciOlcer'],x:`<p>${K('arm')} kolların alt ucunu tabana yaslanacak açıda kes ve iki M12 cıvatayla bağla. ${K('brace')} payandaları kol ile taban arasına vidala.</p>`},
    {t:'Hamağı as',add:['net'],tools:['matkap','lokma'],x:'<p>Kol uçlarına 12 mm delik açıp göz cıvatalarını tak. Hamağı halat ve karabinayla as; ortası yerden 450-500 mm yükseklikte kalsın.</p>'},
    finishStep({outdoor:1})];
  return c;
}

/* 45) Okuma köşesi (çocuk) */
function readingNook(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, Hs=380, m=o.mat||'ply18', t=18, sp=o.sp||'kayin', lip=LM(sp,12,45);
  for(const x of [0,W-t]){BOX(parts,'sideL','Oturak yanı',m,x,0,0,t,Hs,D);BOX(parts,'sideU','Kitaplık yanı',m,x,Hs,0,t,H-Hs,120,{cutNote:'üst köşesi R30 yuvarlatılır'});}
  BOX(parts,'bottom','Taban',m,t,0,12,W-2*t,t,D-12);
  BOX(parts,'seat','Oturak',m,t,Hs-t,12,W-2*t,t,D-12);
  BOX(parts,'backL','Oturak arkalığı','ply12',t,t,0,W-2*t,Hs-2*t,12);
  BOX(parts,'backU','Kitaplık arkalığı','ply12',t,Hs,0,W-2*t,H-Hs,12);
  BOX(parts,'div','Ara bölme',m,W/2-t/2,t,12,t,Hs-2*t,D-12);
  spread(3,Hs+140,H-80,t).forEach(y=>{BOX(parts,'ledge','Kitap rafı',m,t,y,12,W-2*t,t,95);BOX(parts,'lip','Raf kenarlığı',lip,t,y+t,95,W-2*t,45,12);});
  BOX(parts,'cush','Oturak minderi','foam',t,Hs,135,W-2*t,70,D-135,{deco:true});
  const c={parts,hw:[['Sunta vidası 4×40','1 kutu',''],['Ahşap tutkalı','1 şişe',''],['Duvar bağlantı köşebendi','2 adet','devrilmeyi önler'],['Kenar bandı 22 mm',`${dec(R((4*W+2*H+2*D)/1000*1.1*10)/10)} m`,''],
      ['Oturak minderi (7 cm)','1 adet',`${W-2*t} × ${D-135} mm`],['Kumaş saklama kutusu','2 adet','alt bölmelere'],['Çocuğa uygun su bazlı vernik (EN 71-3)','0,5 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Oturma yüksekliği minderle ${Hs+70} mm. Üç sıra raf, kitapların kapağı önde dursun diye ${95} mm derin ve kenarlıklı; altta iki açık bölme saklama kutuları içindir.`},
      {t:'warn',x:'Kitaplık kısmı çocuk tırmanırsa devrilebilir; duvara köşebentle mutlaka sabitle.'}]};
  c.tools=stdTools(['daire','ray','dekupaj','metre','gonye','kalem','matkap','havsa',['isk','4 adet'],'koseIsk','utu','bicak','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','dekupaj'],x:cutUL(c,K)},
    {t:'Kenarları bantla',tools:['utu','bicak','zimMak'],x:`<p>Görünen ön kenarları bantla. ${K('sideU')} yanların üst köşelerini 30 mm yarıçapla yuvarlat.</p>`},
    {t:'Oturak kutusunu kur',add:['sideL','bottom','seat','backL','div'],tools:['matkap','koseIsk','gonye'],x:`<p>${K('sideL')} yanlara ${K('bottom')} tabanı, ${K('div')} ara bölmeyi ve ${K('seat')} oturağı tutkal ve vidayla bağla. ${K('backL')} arkalığı arkadan vidala.</p>`},
    {t:'Kitaplığı kur',add:['sideU','backU','ledge','lip'],tools:['matkap','gonye','metre'],x:`<p>${K('sideU')} yanları oturak yanlarının üstüne, ${K('backU')} arkalığa vidala. ${K('ledge')} rafları ve ${K('lip')} kenarlıkları eşit aralıkla tak.</p>`},
    finishStep({},'<p>Kuruyunca minderi yerleştir ve kitaplığı duvara sabitle.</p>')];
  return c;
}

/* ---------- 2026-11-05 (2): sarkıt raf, duvar konsolu, sebze masası, çocuk mutfağı, merdiven tabure ---------- */

/* 46) Halatlı sarkıt raf */
function hangShelf(p,o){
  const parts=[], L=p.L, D=p.D, N=p.N, S=p.S, A=p.A, sp=o.sp||'mese', bk=WORKTOP(sp,28,D), topY=(N-1)*S+28, ceil=topY+A;
  for(let i=0;i<N;i++) BOX(parts,'shelf','Raf tahtası',bk,0,i*S,0,L,28,D,{cutNote:'köşelerden 30 mm içeride 4 adet Ø14 halat deliği'});
  for(const x of [30,L-30]){const hook=[x,ceil,D/2];for(const z of [30,D-30]) chain(parts,[x,-60,z],hook,'rope',6);}
  const rope=R((2*(topY+A+120)+D)*2/1000*1.15*10)/10;
  const c={parts,hw:[['Pamuk ya da jüt halat Ø12',`${dec(rope)} m`,'iki uzun parça, her yanda U biçiminde'],['Tavan kancası (dübelli, en az 50 kg)','2 adet','beton tavana'],['Halat kilit halkası ya da ahşap boncuk',N*4+' adet','rafların altında düğüm yerine'],['Sert yağ','0,25 L','']],join:'Halat düğümü',
    notes:[{t:'tip',x:`${N} raf, ${S} mm arayla; alt raf tavandan ${topY+A} mm aşağıda. Her rafa en çok 8-10 kg koy.`},{t:'warn',x:'Kancayı yalnız beton tavana dübelle; asma tavana asma.'}]};
  c.tools=stdTools(['gonyeT','metre','kalem','terazi','matkap','forstnerSet','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Rafları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Halat deliklerini aç',tools:['matkap','forstnerSet'],x:`<p>${K('shelf')} rafları üst üste koy, köşelerden 30 mm içeriye 14 mm deliği hepsinden birden aç; delikler aynı hizada olur. Delik ağızlarını zımparala.</p>`},
    finishStep({}),
    {t:'Halatı geçir ve as',add:['shelf'],tools:['terazi','metre','matkap'],x:`<p>Tavana iki kancayı ${L-60} mm arayla tak. Her yan için halatı kancadan U biçiminde sarkıt, iki ucunu rafların deliklerinden geçir. Her rafın altına düğüm at ya da kilit halkası tak; rafları terazileyerek ${S} mm arayla ayarla.</p>`}];
  return c;
}

/* 47) Duvar konsolu (duvara asılı masa) */
function wallConsole(p,o){
  const parts=[], L=p.L, D=p.D, H=p.H, sp=o.sp||'mese', t=28, vk=LM(sp,28,70), ak=LM(sp,45,70), n=L>1200?3:2;
  BOX(parts,'top','Tabla',WORKTOP(sp,t,D),0,H-t,0,L,t,D);
  spread(n,80,L-80,28).forEach(x=>{
    BOX(parts,'post','Duvar dikmesi',vk,x,H-t-350,0,28,350,70);
    BOX(parts,'arm','Taşıyıcı kol',ak,x-8.5,H-t-70,70,45,70,D-120);
    PART(parts,'brace','Çapraz destek',ak,barRings([x+14,H-t-330,70],[x+14,H-t-70,D-200],70,45,[1,0,0]),{cut:[R(Math.hypot(260,D-270))+60,70,45],cutNote:'iki ucu açılı'});});
  const c={parts,hw:[['Dübel 10 mm + vida 6×100',n*3+' takım','duvar dikmeleri'],['Vida 5×70',n*6+' adet','kol ve destek'],['Ahşap tutkalı','1 şişe',''],['Sert yağ','0,25 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Tabla ${L} × ${D} mm, yerden ${H} mm. Ayakları olmadığı için altı tamamen boş kalır; antre ya da dar odalar için uygun.`},{t:'warn',x:'Yalnız beton ya da tuğla duvara bağla. Üstüne oturma; en çok 25 kg yük için tasarlandı.'}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','terazi','matkap','havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Konsolları birleştir',add:['post','arm','brace'],tools:['matkap','isk','gonye'],x:`<p>Her ${K('post')} dikmenin üst ucuna ${K('arm')} kolu dik açıyla tutkal ve vidayla bağla, ${K('brace')} desteği aralarına açılı vidala. ${n} konsolu birebir aynı yap.</p>`},
    {t:'Konsolları duvara as',tools:['terazi','matkap','metre'],x:`<p>Konsolları kolların üst kenarı yerden ${H-t} mm olacak şekilde terazide hizala ve her dikmeyi üç dübelle duvara bağla.</p>`},
    {t:'Tablayı bağla',add:['top'],tools:['matkap'],x:`<p>${K('top')} tablayı konsolların üstüne koy, kolların altından vidala. Arka kenarı duvara yaslansın.</p>`},
    finishStep({})];
  return c;
}

/* 48) Yükseltilmiş sebze masası */
function planterTable(p,o){
  const parts=[], L=p.L, W=p.W, H=p.H, Dp=p.Dp, sp=o.sp||'emp', lg=LM(sp,70,70), bd=LM(sp,20,120), cl=LM(sp,45,45), sl=LM(sp,20,95);
  const nR=Math.ceil((Dp+20)/120), boxB=H-nR*120, fy=boxB+5;
  for(const x of [0,L-70]) for(const z of [0,W-70]) BOX(parts,'leg','Ayak',lg,x,0,z,70,H,70);
  for(let r=0;r<nR;r++){const y=boxB+r*120;
    for(const z of [-20,W]) BOX(parts,'sideB','Uzun yan tahta',bd,-20,y,z,L+40,120,20);
    for(const x of [-20,L]) BOX(parts,'endB','Kısa yan tahta',bd,x,y,0,20,120,W);}
  const layer=(y,g,nm)=>{for(const z of [0,W-45]) BOX(parts,g+'C',nm+' taşıyıcısı',cl,70,y-45,z,L-140,45,45);
    const n=Math.max(3,Math.floor((L-140+5)/100));spread(n,70,L-70,95).forEach(x=>BOX(parts,g,nm,sl,x,y,0,95,20,W));};
  layer(fy,'floor','Taban çıtası');
  if(o.shelf) layer(200,'lower','Alt raf çıtası');
  const vol=R((L*W*Dp)/1e6);
  const c={parts,hw:[['Jeotekstil keçe',`${dec(R((L+2*Dp)*(W+2*Dp)/1e6*1.1*10)/10)} m²`,'toprağı tutar, suyu geçirir'],['Saksı toprağı + kompost',`yaklaşık ${vol} L`,''],['Paslanmaz vida 4,5×45','1 kutu',''],['Galvaniz vida 6×80',(o.shelf?16:8)+' adet','taşıyıcılar'],['Zımba teli 10 mm','1 kutu','keçe'],['Dış mekân ahşap yağı (yalnız dış yüze)','0,75 L','']],join:'Vida',
    notes:[{t:'tip',x:`Toprak yüzeyi yerden ${H} mm, toprak derinliği ${Dp} mm (${vol} L). Salata, ot ve çilek için uygun; eğilmeden bakılır.`},
      {t:'warn',x:'Kutunun içine yağ ya da boya sürme; emprenye kereste kullanıyorsan iç yüzeyi keçeyle tamamen kapla. Islak toprak ağırdır, masayı kurulacağı yerde doldur.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','havsa','cekic',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Kutuyu kur',add:['leg','sideB','endB'],tools:['matkap','gonye','isk'],x:`<p>Dört ${K('leg')} ayağı dik tut; ${K('sideB')} uzun ve ${K('endB')} kısa yan tahtaları ayakların üst ucuna, üst kenarları ayak başıyla aynı hizada ${nR} sıra vidala.</p>`},
    {t:'Tabanı tak',add:['floorC','floor'],tools:['matkap','metre'],x:`<p>${K('floorC')} taşıyıcıları kutunun alt kenarı hizasında ayaklara vidala. ${K('floor')} çıtalarını 5 mm arayla diz; aralıklar suyu boşaltır.</p>`},
    ...(o.shelf?[{t:'Alt rafı tak',add:['lowerC','lower'],tools:['matkap'],x:`<p>${K('lowerC')} taşıyıcıları yerden 155 mm yükseklikte ayaklara, ${K('lower')} çıtaları üstlerine vidala.</p>`}]:[]),
    {t:'Keçeyi serip doldur',tools:['cekic'],x:'<p>Jeotekstil keçeyi kutunun içine serip kenarlara zımbala. Masayı yerine koy ve toprakla doldur.</p>'},
    finishStep({outdoor:1},'<p>Yağı yalnız dış yüzeylere ve ayaklara sür.</p>')];
  return c;
}

/* 49) Çocuk oyun mutfağı */
function playKitchen(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, Hc=520, m=o.mat||'ply18', t=18;
  for(const x of [0,W-t]){BOX(parts,'side','Yan panel',m,x,0,0,t,Hc,D);BOX(parts,'sideU','Üst yan',m,x,Hc+t,0,t,H-Hc-t,170,{cutNote:'üst köşesi R40 yuvarlatılır'});}
  BOX(parts,'bottom','Taban',m,t,60,12,W-2*t,t,D-12);
  BOX(parts,'plinth','Baza',m,t,0,D-60,W-2*t,60,t);
  BOX(parts,'backL','Alt arkalık','ply12',t,60,0,W-2*t,Hc-60,12);
  BOX(parts,'div','Ara bölme',m,W/2-t/2,60+t,12,t,Hc-60-t,D-12);
  BOX(parts,'counter','Tezgâh',m,0,Hc,0,W,t,D,{cutNote:'evye için Ø200 delik dekupajla kesilir'});
  BOX(parts,'backU','Arka pano','ply12',t,Hc+t,0,W-2*t,H-Hc-t,12);
  BOX(parts,'shelfU','Üst raf',m,t,H-190,12,W-2*t,t,150);
  BOX(parts,'shelfR','İç raf',m,W/2+t/2,R((60+Hc)/2),12,W/2-1.5*t,t,D-30);
  BOX(parts,'door','Fırın kapağı',m,t+3,60+t+3,D,W/2-1.5*t-6,Hc-60-t-6,t,{cutNote:'ortasına 150×100 pencere açılır, kenarları yuvarlatılır'});
  const sx=W*0.72, cz=D/2+20, hx=W*0.27;
  PART(parts,'sink','Evye (paslanmaz kase)','steel',cylRings([sx,Hc+t,cz],[sx,Hc+t+2,cz],100,100,32),{deco:true,smooth:true});
  for(const dx of [-55,55]) PART(parts,'hob','Ocak gözü','rubber',cylRings([hx+dx,Hc+t,cz],[hx+dx,Hc+t+3,cz],45,45,24),{deco:true,smooth:true});
  PART(parts,'tap','Musluk','steel',cylRings([sx,Hc+t,40],[sx,Hc+t+160,40],10,10,12),{deco:true,smooth:true});
  const c={parts,hw:[['Paslanmaz kase Ø200','1 adet','evye'],['Oyuncak musluk ya da kavela + boya','1 adet',''],['Ocak gözü için siyah kontrplak daire ya da çıkartma','2 adet',''],['Düğme (çekmece topuzu)','3 adet','ocak düğmeleri'],
      ['Menteşe 35 mm + mıknatıslı kapak tutucu','2 + 1 adet','fırın kapağı'],['Pleksiglas 160×110 mm','1 adet','fırın penceresi'],['Askı kancası','3 adet','tava, kepçe'],['Sunta vidası 4×40','1 kutu',''],['Çocuğa uygun boya (EN 71-3)','0,75 L','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Tezgâh yerden ${Hc+t} mm: 3-6 yaş için. Sol bölme fırın, sağ bölme raflı dolap; üst rafa oyuncak kaplar konur.`},{t:'warn',x:'Bütün köşeleri yuvarlat, küçük parçaları (düğme, musluk) sıkıca bağla; 3 yaşından küçükler için yutma riski taşır. Duvara sabitle.'}]};
  c.tools=stdTools(['daire','ray','dekupaj','metre','gonye','kalem','matkap','forstner','havsa',['isk','4 adet'],'koseIsk','zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','dekupaj'],x:cutUL(c,K)},
    {t:'Delik ve pencereleri aç',tools:['dekupaj','matkap','zimMak'],x:`<p>${K('counter')} tezgâha evye için Ø200, ${K('door')} kapağa 150×100 mm pencere aç. Bütün kenarları 120 kumla yuvarlat.</p>`},
    {t:'Alt gövdeyi kur',add:['side','bottom','plinth','backL','div','shelfR'],tools:['matkap','koseIsk','gonye'],x:`<p>${K('side')} yanlara ${K('bottom')} tabanı, ${K('plinth')} bazayı ve ${K('backL')} arkalığı bağla; ${K('div')} ara bölmeyi ortaya, ${K('shelfR')} rafı sağ bölmeye yerleştir.</p>`},
    {t:'Tezgâh ve üst panoyu tak',add:['counter','sideU','backU','shelfU','sink','hob','tap'],tools:['matkap','gonye'],x:`<p>${K('counter')} tezgâhı gövdenin üstüne vidala. ${K('sideU')} üst yanları ve ${K('backU')} arka panoyu tezgâhın üstüne, ${K('shelfU')} rafı üst yanların arasına bağla. Kaseyi deliğe oturt, musluk ve ocak gözlerini yerleştir.</p>`},
    {t:'Kapağı as ve boya',add:['door'],tools:['forstner','matkap','boya'],x:'<p>Kapağa menteşe çanaklarını aç, pleksiyi arkadan vidala ve kapağı as. Çocuğa uygun boyayla iki kat boya, kuruyunca düğmeleri tak ve mutfağı duvara sabitle.</p>'}];
  return c;
}

/* 50) Merdiven tabure (basamaklı) */
function stepStool(p,o){
  const parts=[], N=p.N, W=p.W, H=p.H, sp=o.sp||'kayin', r=H/N, sd=o.sd||220, Dt=N*sd, t=18, tt=o.plyTread?18:28, tk=o.plyTread?'ply18':LM(sp,28,sd);
  const poly=[[0,0],[Dt,0]];for(let i=1;i<=N;i++){poly.push([Dt-(i-1)*sd,i*r]);if(i<N)poly.push([Dt-i*sd,i*r]);}poly.push([0,H]);
  for(const x of [0,W-t]) PART(parts,'side','Yan panel','ply18',prism('x',poly,x,t),{cut:[Dt,R(H),t],cutNote:'basamak profili ve 120×35 tutma deliği kesilir'});
  for(let i=1;i<=N;i++){const z1=Dt-(i-1)*sd;
    BOX(parts,'tread','Basamak',tk,t,i*r-tt,z1-sd,W-2*t,tt,sd);
    BOX(parts,'riser','Ara panel','ply18',t,0,z1-t,W-2*t,i*r-tt,t);}
  BOX(parts,'back','Arka panel','ply18',t,0,0,W-2*t,H-tt,t);
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Sunta vidası 4×50',N*8+' adet',''],['Kaydırmaz lastik ayak','4 adet',''],['Su bazlı vernik','0,25 L','']],join:'Kanal + tutkal + vida',
    notes:[{t:'tip',x:`${N} basamak, basamak yüksekliği ${R(r)} mm, derinliği ${sd} mm. Mutfak ve kitaplıkta üst raflara uzanmak için.`},{t:'warn',x:'En üst basamağa çıkarken bir yere tutun; çocuklar yetişkin gözetiminde kullansın.'}]};
  c.tools=stdTools(['daire','dekupaj','gonyeT','metre','gonye','kalem','matkap','havsa',['isk','2 adet'],'koseIsk','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj','gonyeT'],x:`${cutUL(c,K)}<p>${K('side')} yanların basamak profilini birini şablon yapıp ikisine aynı çiz, dekupajla kes. Üst kısma 120×35 mm tutma deliği aç.</p>`},
    {t:'Gövdeyi kur',add:['side','riser','back'],tools:['matkap','koseIsk','gonye'],x:`<p>${K('riser')} ara panelleri iki yan arasına tutkal ve vidayla bağla; çaprazları ölçerek gönyeye getir.</p>`},
    {t:'Basamakları tak',add:['tread'],tools:['matkap','havsa'],x:`<p>${K('tread')} basamakları yanların ve ara panellerin üstüne tutkalla oturt, yanlardan havşalı vidala.</p>`},
    finishStep({},'<p>Altına kaydırmaz lastik ayak yapıştır.</p>')];
  return c;
}

/* ---------- 2026-11-05 (3): giyinme odası, bahçe çiti, evcil hayvan merdiveni/rampası, katlanır tezgâh ---------- */

/* 51) Giyinme odası dolap sistemi (açık modüller) */
function closetSystem(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, m=o.mat||'mlam18', t=18, n=Math.max(2,Math.ceil((W-t)/(900+t))), mw=(W-(n+1)*t)/n, rod=[];
  const types=['uzun','cift','raf','ayakkabi'], sh=(x,y,nm)=>BOX(parts,'shelf',nm||'Raf',m,x,y,20,mw,t,D-40);
  for(let i=0;i<=n;i++) BOX(parts,'div','Dikey panel',m,i*(mw+t),0,0,t,H,D);
  for(let i=0;i<n;i++){const x=t+i*(mw+t), ty=types[i%4];
    BOX(parts,'top','Üst panel',m,x,H-t,0,mw,t,D);
    BOX(parts,'bottom','Alt panel',m,x,80,0,mw,t,D);
    BOX(parts,'kick','Baza',m,x,0,D-60,mw,80,t);
    BOX(parts,'cleat','Duvar bağlantı çıtası',m,x,H-t-90,0,mw,90,t,{cutNote:'duvara dübelli'});
    const top=H-t-90-330;
    if(ty!=='raf'&&ty!=='ayakkabi') sh(x,top,'Üst raf');
    if(ty==='uzun') rod.push([x,top-70]);
    if(ty==='cift'){rod.push([x,top-70]);sh(x,R((top-70)/2+60),'Ara raf');rod.push([x,R((top-70)/2-10)]);}
    if(ty==='raf') for(let y=98+320;y<H-t-90-150;y+=330) sh(x,y);
    if(ty==='ayakkabi'){[98+170,98+340,98+510].forEach(y=>sh(x,y,'Ayakkabı rafı'));for(let y=98+510+330;y<H-t-90-150;y+=330) sh(x,y);}}
  rod.forEach(([x,y])=>PART(parts,'rod','Askı borusu','steel',cylRings([x+5,y,D/2],[x+mw-5,y,D/2],12.5,12.5,16),{deco:true,smooth:true}));
  const nSh=parts.filter(q=>q.g==='shelf').length, rodM=dec(R(rod.length*mw/1000*1.05*10)/10);
  const c={parts,hw:[['Oval askı borusu 30×15',`${rodM} m`,`${rod.length} parça`],['Askı borusu tutucusu',rod.length*2+' adet',''],['Konfirmat vidası 7×50',(n*8+(n+1)*4)+' adet','gövde'],['Raf pimi 5 mm',nSh*4+' adet','ayarlı raflar'],
      ['Dübel 8 mm + vida 5×70',n*3+' takım','duvar çıtaları'],['Ayar ayağı',(n+1)*2+' adet','baza arkası'],['Kenar bandı 22 mm',`${dec(R(((n+1)*H+(2*n+nSh)*mw)/1000*1.1*10)/10)} m`,'görünen ön kenarlar']],join:'Konfirmat + raf pimi',
    notes:[{t:'tip',x:`${n} modül, her biri ${R(mw)} mm iç genişlikte. Sırayla: uzun askılık, çift askılık (gömlek, ceket), raflı ve ayakkabılık modülleri tekrarlanır.`},
      {t:'warn',x:'Gövdeyi mutlaka duvar çıtalarından duvara dübelle; açık raflı yüksek modüller tek başına devrilebilir.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','terazi','matkap','konfUc','rafSab','havsa',['isk','4 adet'],'koseIsk','utu','bicak']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','metre'],x:cutUL(c,K),tip:'Uzun panelleri ebatlama servisine kestirmek hem kenar bandını hem gönyeyi garanti eder.'},
    {t:'Kenarları bantla ve raf deliklerini aç',tools:['utu','bicak','rafSab','matkap'],x:`<p>Görünen ön kenarları bantla. ${K('div')} panellerin iç yüzlerine raf pimi şablonuyla 32 mm arayla delik aç.</p>`},
    {t:'Modülleri kur',add:['div','top','bottom','kick','cleat'],tools:['matkap','konfUc','koseIsk','gonye'],x:`<p>Soldan başlayarak her modülde ${K('top')} üst ve ${K('bottom')} alt paneli iki ${K('div')} panel arasına konfirmatla bağla. ${K('kick')} bazayı öne, ${K('cleat')} çıtayı arkaya üstten tak.</p>`},
    {t:'Yerine koy ve sabitle',tools:['terazi','matkap'],x:'<p>Sistemi duvara yasla, ayar ayaklarıyla terazile ve her modülü duvar çıtasından iki ya da üç dübelle duvara bağla.</p>',warn:'Duvara sabitlemeden raflara yük koyma.'},
    {t:'Raf ve askıları tak',add:['shelf','rod'],tools:['matkap','metre'],x:`<p>${K('shelf')} rafları pimlerle yerleştir. Askı borusu tutucularını yan panellere vidala, boruları boyuna kesip tak.</p>`}];
  return c;
}

/* 52) Bahçe çiti (gizlilik paneli) */
function gardenFence(p,o){
  const parts=[], L=p.L, H=p.H, sp=o.sp||'emp', post=LM(sp,90,90), nb=Math.max(1,Math.ceil((L-90)/1890)), bw=(L-90*(nb+1))/nb, vert=o.style==='dikey';
  for(let i=0;i<=nb;i++) BOX(parts,'post','Dikme',post,i*(bw+90),0,0,90,H,90);
  BOX(parts,'cap','Üst kapak',LLONG(sp,20,110,L+20),-10,H,-10,L+20,20,110);
  for(let i=0;i<nb;i++){const x=90+i*(bw+90);
    if(!vert){const sl=LM(sp,20,95);for(let y=40;y+95<=H-30;y+=110) BOX(parts,'slat','Yatay tahta',sl,x,y,35,bw,95,20);}
    else {const rl=LM(sp,45,70), vs=LM(sp,20,70);
      for(const y of [150,H-220]) BOX(parts,'rail','Yatay kuşak',rl,x,y,10,bw,70,45);
      spread(Math.max(2,Math.floor((bw+20)/90)),x,x+bw,70).forEach(xx=>BOX(parts,'vslat','Dikey tahta',vs,xx,60,55,70,H-120,20));}}
  const c={parts,hw:[['Dikme ayak papucu (çakma ya da beton dübelli)',(nb+1)+' adet','90×90'],['Paslanmaz vida 4,5×50','2 kutu',''],...(vert?[['Galvaniz köşebent 40×40',nb*4+' adet','kuşak-dikme']]:[['Tahta tutucu çıta 20×20 (dikme yanlarına)',`${dec(R(nb*2*H/1000*1.1*10)/10)} m`,'tahtalar arasına 15 mm aralık bırakır']]),
      ['Dış mekân ahşap yağı',`${Math.max(1,Math.ceil(L*H/1e6/5))} L`,'2 kat, her iki yüz']],join:'Vida + ayak papucu',
    notes:[{t:'tip',x:`${nb} bölme, bölme genişliği ${R(bw)} mm, yükseklik ${H} mm. ${vert?'Dikey tahtalar arası yaklaşık 20 mm':'Yatay tahtalar arası 15 mm'}; rüzgârı tamamen kesmez, bu da çiti rüzgâr yükünden korur.`},
      {t:'warn',x:'1,8 m üstü çitler için belediye ve site kurallarına bak. Dikmeleri rüzgârlı yerde betona dübelli papuçla bağla.'}]};
  c.tools=stdTools(['gonyeT','daire','metre','kalem','terazi','matkap','havsa','cekic','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)},
    {t:'Dikmeleri dik',add:['post'],tools:['terazi','cekic','matkap'],x:`<p>İp gererek çit hattını belirle. Papuçları ${R(bw+90)} mm arayla çak ya da betona dübelle, ${K('post')} dikmeleri yerleştirip iki yönden terazile.</p>`},
    vert?{t:'Kuşak ve tahtaları tak',add:['rail','vslat'],tools:['matkap','metre'],x:`<p>${K('rail')} kuşakları dikmeler arasına köşebentle bağla, ${K('vslat')} dikey tahtaları 20 mm arayla kuşaklara vidala.</p>`}
      :{t:'Tahtaları diz',add:['slat'],tools:['matkap','metre'],x:`<p>Dikmelerin iç yanlarına tutucu çıtaları vidala. ${K('slat')} tahtaları alttan başlayarak 15 mm arayla, aralara takoz koyarak dikmelere bağla.</p>`},
    {t:'Kapağı tak',add:['cap'],tools:['matkap'],x:`<p>${K('cap')} kapağı dikmelerin üstüne vidala; yağmur suyunun dikme kesitine girmesini önler.</p>`},
    finishStep({outdoor:1})];
  return c;
}

/* 53) Evcil hayvan merdiveni ve rampası */
function petSteps(p,o){
  const c=stepStool(p,Object.assign({},o,{sd:p.Sd,plyTread:true}));
  c.hw=c.hw.filter(h=>!/vernik/i.test(h[0])).concat([['Kaydırmaz halı ya da kauçuk kaplama',`${p.N} parça, ${p.W-36} × ${p.Sd} mm`,'basamak üstlerine yapışır'],['Su bazlı vernik ya da boya','0,25 L','']]);
  c.notes=[{t:'tip',x:`${p.N} basamak, basamak yüksekliği ${R(p.H/p.N)} mm. Küçük ve yaşlı köpekler için basamak yüksekliğini 150 mm altında tut.`},{t:'warn',x:'Basamaklara mutlaka kaydırmaz kaplama yapıştır; çıplak vernikli ahşap pati altında kayar.'}];
  return c;
}
function petRamp(p,o){
  const parts=[], H=p.H, W=p.W, A=p.A*Math.PI/180, R2=H/Math.tan(A), Lr=Math.hypot(R2,H), sp=o.sp||'cam', lg=LM(sp,45,70), cl=LM(sp,12,20);
  const p0=[0,9,W/2], p1=[R2,H+9,W/2], dir=v3.norm(v3.sub(p1,p0)), nrm=[-dir[1],dir[0],0];
  PART(parts,'deck','Rampa tablası','ply18',barRings(p0,p1,W,18,[0,1,0]),{cut:[R(Lr),W,18],cutNote:'üst uç yatağa yaslanacak açıda kesilir'});
  for(let d=100;d<Lr-60;d+=120){const c0=v3.add(v3.add(p0,v3.mul(dir,d)),v3.mul(nrm,15));
    PART(parts,'cleat','Basma çıtası',cl,barRings([c0[0],c0[1],30],[c0[0],c0[1],W-30],12,20,[1,0,0]),{cut:[W-60,20,12]});}
  for(const z of [0,W-45]) BOX(parts,'leg','Destek ayağı',lg,R2-70,0,z,70,H-20,45);
  for(const y of [80,H-110]) BOX(parts,'rail','Destek traversi',lg,R2-70,y,45,70,45,W-90);
  const c={parts,hw:[['Kaydırmaz halı ya da kauçuk kaplama',`${R(Lr)} × ${W} mm`,'çıtaların arasına'],['Vida 4×40','1 kutu',''],['Kauçuk ayak','4 adet','zemini çizmesin'],['Ahşap tutkalı','1 şişe','']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`Rampa ${p.A}° eğimli, ${R(R2)} mm yer kaplar, ${R(Lr)} mm uzunluğunda. Basma çıtaları 120 mm arayla.`},{t:'warn',x:'Rampanın üst ucunu yatak ya da koltuk kenarına sabitle (kayış ya da kanca); yük altında kaymasın. Eklem sorunu olan köpekler için 20° altı eğim seç.'}]};
  c.tools=stdTools(['daire','gonyeT','aciOlcer','metre','kalem','matkap','havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Desteği kur',add:['leg','rail'],tools:['matkap','gonye'],x:`<p>İki ${K('leg')} ayağı ${K('rail')} traverslerle birleştirip dik bir çerçeve yap.</p>`},
    {t:'Tablayı bağla',add:['deck'],tools:['matkap','aciOlcer'],x:`<p>${K('deck')} tablanın üst ucunu çerçevenin üst traversine yaslayıp vidala; alt ucu yere otursun.</p>`},
    {t:'Kaplama ve çıtalar',add:['cleat'],tools:['matkap','metre'],x:`<p>Kaydırmaz kaplamayı tablaya yapıştır, ${K('cleat')} çıtaları 120 mm arayla üstten vidala.</p>`},
    finishStep({})];
  return c;
}

/* 54) Duvara katlanır atölye tezgâhı */
function foldBench(p,o){
  const parts=[], L=p.L, D=p.D, H=p.H, sp=o.sp||'cam', led=LM(sp,45,145), ap=LM(sp,45,95), lg=LM(sp,45,70);
  BOX(parts,'ledger','Duvar kirişi',led,0,H-36-145,0,L,145,45,{cutNote:'duvara dübelli'});
  BOX(parts,'top1','Tabla (alt kat)','ply18',0,H-36,0,L,18,D);
  BOX(parts,'top2','Tabla (üst kat)','ply18',0,H-18,0,L,18,D);
  BOX(parts,'apron','Ön kuşak',ap,0,H-36-95,D-45,L,95,45);
  for(const x of [60,L-105]) BOX(parts,'leg','Katlanır ayak',lg,x,0,D-45-70,45,H-36-95,70);
  if(o.board) BOX(parts,'board','Alet panosu','ply12',0,H+60,0,L,600,12,{cutNote:'20 mm aralıklı Ø6 delik ızgarası ya da çivi çakılı'});
  const c={parts,hw:[['Piyano menteşe (ağır tip)',L+' mm','tabla-duvar kirişi'],['Kapı menteşesi 75 mm','4 adet','ayaklar'],['Katlanır kilitli ayak makası','2 adet','ayakları açık kilitler'],
      ['Dübel 10 mm + vida 8×100',Math.ceil(L/400)+1+' takım','duvar kirişi'],['Sürgü kilit','2 adet','katlanınca tablayı tutar'],['Ahşap tutkalı','1 şişe','tabla katları'],['Sunta vidası 4×30','1 kutu','']],join:'Menteşe + dübel',
    notes:[{t:'tip',x:`Açık tabla ${L} × ${D} mm, ${H} mm yükseklikte; katlanınca duvardan yalnız ${D+60} mm çıkıntı yapar. Garaj ve balkon için.`},
      {t:'warn',x:'Duvar kirişini yalnız beton ya da tuğla duvara bağla. Katlarken ayakların kilidini aç; tablayı tek elle bırakma.'}]};
  c.tools=stdTools(['daire','ray','gonyeT','metre','kalem','terazi','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','gonyeT'],x:cutUL(c,K)},
    {t:'Tablayı lamine et',add:['top1','top2'],tools:['isk','matkap'],x:`<p>${K('top1')} ve ${K('top2')} katlarını tutkallayıp işkenceyle sık, alttan vidala; 36 mm kalın, düz bir tabla olur.</p>`},
    {t:'Ön kuşak ve ayaklar',add:['apron','leg'],tools:['matkap'],x:`<p>${K('apron')} kuşağı tablanın altına ön kenara bağla. ${K('leg')} ayakları kuşağın arkasına menteşeyle as, kilitli ayak makaslarını tak.</p>`},
    {t:'Duvar kirişini as',add:['ledger'],tools:['terazi','matkap'],x:`<p>${K('ledger')} kirişi üst kenarı yerden ${H-36} mm olacak şekilde terazileyip duvara dübelle.</p>`},
    {t:'Tablayı menteşele',tools:['matkap'],x:'<p>Tablanın arka kenarını piyano menteşeyle kirişe bağla. Katlanmış konumda tutacak sürgüleri yanlara tak.</p>'},
    ...(o.board?[{t:'Alet panosunu as',add:['board'],tools:['matkap','terazi'],x:`<p>${K('board')} panoyu tablanın üstüne, katlandığında tablanın kapatacağı yüksekliğe dübelle.</p>`}]:[]),
    finishStep({})];
  return c;
}

/* ---------- 2026-11-05 (4): bebek beşiği, bar dolabı, sauna bankı, kamp sandığı ---------- */
SP.ihlamur=SP.ihlamur||{n:'Ihlamur',tone:'maple'};

/* 55) Bebek beşiği (karyola) */
function crib(p,o){
  const parts=[], sp=o.sp||'kayin', IL=p.L+10, IW=p.W+10, Ht=p.H, hb=o.low?250:450, pk=LM(sp,45,45), rk=LM(sp,28,70), bk=LM(sp,20,40), ck=LM(sp,28,45);
  for(const x of [0,45+IL]) for(const z of [0,45+IW]) BOX(parts,'post','Köşe dikmesi',pk,x,0,z,45,Ht,45,{cutNote:'üst ucu yuvarlatılır'});
  for(const y of [120,Ht-70]) {for(const z of [8.5,45+IW+8.5]) BOX(parts,'srail','Yan kuşak',rk,45,y,z,IL,70,28);
    for(const x of [8.5,45+IL+8.5]) BOX(parts,'erail','Baş/ayak kuşağı',rk,x,y,45,28,70,IW);}
  const bh=Ht-70-190, ns=Math.floor((IL+60)/100), ne=Math.floor((IW+60)/100);
  for(const z of [12.5,45+IW+12.5]) spread(ns,45,45+IL,40).forEach(x=>BOX(parts,'bar','Parmaklık',bk,x,190,z,40,bh,20,{cut:[bh+30,40,20],cutNote:'uçları 15 mm kuşağa gömülür'}));
  for(const x of [12.5,45+IL+12.5]) spread(ne,45,45+IW,40).forEach(z=>BOX(parts,'barE','Baş/ayak parmaklığı',bk,x,190,z,20,bh,40,{cut:[bh+30,40,20],cutNote:'uçları 15 mm kuşağa gömülür'}));
  for(const z of [45,45+IW-28]) BOX(parts,'cleat','Taban taşıyıcısı',ck,45,hb-45,z,IL,45,28,{cutNote:'iki yükseklikte delikli'});
  BOX(parts,'base','Şilte tabanı','ply12',45,hb,45,IL,12,IW,{cutNote:'Ø30 havalandırma delikleri'});
  BOX(parts,'mat','Şilte','foam',50,hb+12,50,IL-10,100,IW-10,{deco:true});
  const gap=R((IL-ns*40)/(ns-1)), side=Ht-(hb+12+100);
  const c={parts,hw:[['Karyola bağlantı cıvatası M6 + gömme somun','8 takım','kuşak-dikme (sökülebilir)'],['Vida 4×40','1 kutu','taban taşıyıcıları'],['Ahşap tutkalı','1 şişe','parmaklıklar'],
      ['Bebek şiltesi','1 adet',`${p.W} × ${p.L} mm, en çok 100 mm kalın; kenarla arasında 30 mm'den az boşluk kalmalı`],['Çocuğa uygun su bazlı boya ya da vernik (EN 71-3)','0,75 L','']],join:'Cıvata + kavela gömme',
    notes:[{t:'warn',x:`Parmaklık aralığı ${gap} mm (güvenli aralık 45-65 mm, EN 716). Şilte üstünden kenara ${side} mm; bebek ayağa kalkmaya başlayınca tabanı alçak konuma indir. Tasarım dayanım ve güvenlik testinden geçmemiştir; kullanmadan önce bütün vidaları ve kenarları kontrol et.`},
      {t:'tip',x:`Şilte ${p.W} × ${p.L} mm. Taban taşıyıcıları iki yükseklikte delinir: yüksek konum yerden ${450} mm, alçak konum ${250} mm.`},
      {t:'warn',x:'Beşiğe yastık, yorgan ya da tampon koyma; perde ipi ve prizden uzak yerleştir. Kesinlikle çıkıntılı süs, kulp ya da yazı oyması ekleme.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','forstnerSet','dubelSet','havsa',['isk','4 adet'],'zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Kuşaklara parmaklık yuvalarını aç',tools:['matkap','forstnerSet','metre'],x:`<p>Alt ve üst kuşakları yan yana sık, parmaklık yerlerini ${gap} mm aralıkla birlikte işaretle. Her yere 15 mm derin yuva aç.</p>`,tip:'Bir takoz şablon kesip aralığı onunla işaretle; aralık hiçbir yerde 65 mm\'yi geçmemeli.'},
    {t:'Yan ve uç panelleri kur',add:['srail','erail','bar','barE'],tools:['isk','gonye'],x:`<p>${K('bar')} parmaklıkları tutkalla alt ve üst kuşağın yuvalarına oturt, işkencede kurut. Baş ve ayak panellerini de aynı yap.</p>`},
    {t:'Dikmelere bağla',add:['post'],tools:['matkap','dubelSet','gonye'],x:`<p>Panelleri ${K('post')} dikmelere karyola cıvatası ve gömme somunla bağla; beşik sökülüp taşınabilir.</p>`},
    {t:'Tabanı yerleştir',add:['cleat','base'],tools:['matkap','metre'],x:`<p>${K('cleat')} taşıyıcıları iki yükseklikte delinmiş yuvalara vidala, ${K('base')} tabanı üstüne koy.</p>`},
    {t:'Zımpara ve boya',tools:['zimMak','zimKag','boya'],x:'<p>Bütün kenarları yuvarlat, kıymık kalmasın. Yalnız EN 71-3 işaretli boya ya da vernik kullan, en az bir hafta havalandır.</p>'}];
  return c;
}

/* 56) Bar dolabı (şarap ve kadeh) */
function barCabinet(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, m=o.mat||'ply18', t=18, pl=80, sp=o.sp||'mese', nB=4, yB=pl+t+nB*110;
  for(const x of [0,W-t]) BOX(parts,'side','Yan panel',m,x,0,0,t,H,D);
  BOX(parts,'top','Üst panel',m,t,H-t,0,W-2*t,t,D);BOX(parts,'bottom','Alt panel',m,t,pl,0,W-2*t,t,D);
  BOX(parts,'kick','Baza',m,t,0,D-50,W-2*t,pl,t);BOX(parts,'back','Arkalık','ply12',t,pl+t,0,W-2*t,H-pl-2*t,12);
  for(let i=1;i<nB;i++) BOX(parts,'bshelf','Şişe rafı','ply12',t,pl+t+i*110-12,12,W-2*t,12,D-30,{cutNote:'ön kenara 80 mm aralıklı şişe yuvası oyulur'});
  BOX(parts,'counter','Bar tablası',WORKTOP(sp,28,D-12),t,yB,12,W-2*t,28,D-12);
  const yU=R(yB+28+(H-t-yB-28)*0.55);
  BOX(parts,'shelf','Üst raf',m,t,yU,12,W-2*t,t,D-30);
  const nr=Math.max(2,Math.floor((W-2*t)/110));spread(nr,t+20,W-t-20,30).forEach(x=>BOX(parts,'stem','Kadeh rayı',LM(sp,20,30),x,yU-30,30,30,30,D-60,{cutNote:'T profil: alt kenarı iki yandan 10 mm oyulur'}));
  if(o.doors) for(const i of [0,1]) BOX(parts,'door','Kapak',m,t+2+i*(W-2*t)/2,yB+30,D,(W-2*t)/2-4,H-t-yB-32,t);
  const bottles=R(nB*Math.floor((W-2*t)/90));
  const c={parts,hw:[['Konfirmat vidası 7×50','16 adet',''],['Sunta vidası 4×30','1 kutu','raflar ve raylar'],['Ayar ayağı','4 adet',''],...(o.doors?[['Gömme menteşe 35 mm','4 adet',''],['Kulp','2 adet','']]:[]),
      ['LED şerit (sıcak beyaz) + adaptör','1 takım','isteğe bağlı, üst raf altı'],['Kenar bandı 22 mm',`${dec(R((2*H+4*W)/1000*1.1*10)/10)} m`,''],['Su bazlı vernik','0,5 L','bar tablası için sıvıya dayanıklı']],join:'Konfirmat + vida',
    notes:[{t:'tip',x:`Alt bölüm yaklaşık ${bottles} şişe alır (şişeler yatık, yuvalı raflarda). Bar tablası yerden ${yB+28} mm; ${nr} kadeh rayı ${nr*3} kadar ayaklı kadeh taşır.`},
      {t:'warn',x:'Dolabı duvara sabitle; dolu şişelerle ağırlık merkezi aşağıda olsa da üst kısım çekilince devrilebilir.'}]};
  c.tools=stdTools(['daire','ray','dekupaj','metre','gonye','kalem','matkap','konfUc','havsa',['isk','4 adet'],'koseIsk','utu','bicak','freze','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','metre'],x:cutUL(c,K)},
    {t:'Şişe yuvalarını ve kadeh raylarını işle',add:['bshelf','stem'],tools:['dekupaj','freze'],x:`<p>${K('bshelf')} rafların ön kenarına 80 mm aralıkla, 70 mm çaplı yarım daire yuvalar oy; şişe boyunları buraya yatar. ${K('stem')} rayların alt kenarını iki yandan 10 mm frezele; kadeh ayağı bu yuvaya kayar.</p>`},
    {t:'Gövdeyi kur',add:['side','top','bottom','kick','back'],tools:['matkap','konfUc','koseIsk'],x:`<p>${K('side')} yanları, ${K('top')} üst ve ${K('bottom')} alt paneli konfirmatla birleştir, ${K('kick')} bazayı ve ${K('back')} arkalığı tak.</p>`},
    {t:'İç düzeni yerleştir',add:['counter','shelf'],tools:['matkap','metre'],x:`<p>Şişe raflarını 110 mm arayla, ${K('counter')} tablasını ve ${K('shelf')} rafı yerine vidala. Kadeh raylarını üst rafın altına vidala.</p>`},
    ...(o.doors?[{t:'Kapakları as',add:['door'],tools:['matkap'],x:`<p>${K('door')} kapaklara menteşe çanağı aç ve as.</p>`}]:[]),
    finishStep({})];
  return c;
}

/* 57) Sauna bankı (iki kademeli) */
function saunaBench(p,o){
  const parts=[], L=p.L, Hu=p.H, Hl=R(p.H/2)+30, Du=600, Dl=450, sp=o.sp||'ihlamur', sl=LLONG(sp,28,90,L), fr=LM(sp,45,70), n=Math.max(2,Math.ceil(L/600)+1);
  BOX(parts,'wall','Duvar kirişi',LLONG(sp,45,70,L),0,Hu-98-70,0,L,70,45);
  spread(n,0,L,45).forEach(x=>{
    BOX(parts,'ubeam','Üst taşıyıcı',fr,x,Hu-98,0,45,70,Du);
    BOX(parts,'uleg','Üst ayak',fr,x,0,Du-70,45,Hu-98,70);
    BOX(parts,'lbeam','Alt taşıyıcı',fr,x,Hl-98,Du,45,70,Dl);
    BOX(parts,'lleg','Alt ayak',fr,x,0,Du+Dl-70,45,Hl-98,70);});
  const sl1=Math.floor((Du+10)/100), sl2=Math.floor((Dl+10)/100);
  spread(sl1,0,Du,90).forEach(z=>BOX(parts,'useat','Üst oturak çıtası',sl,0,Hu-28,z,L,28,90,{cutNote:'kenarları R5 yuvarlatılır'}));
  spread(sl2,Du,Du+Dl,90).forEach(z=>BOX(parts,'lseat','Alt basamak çıtası',sl,0,Hl-28,z,L,28,90,{cutNote:'kenarları R5 yuvarlatılır'}));
  if(o.back) for(const y of [Hu+180,Hu+330]) BOX(parts,'back','Sırt çıtası',sl,0,y,30,L,90,28);
  const c={parts,hw:[['Paslanmaz vida 5×60 (A4)','1 kutu','oturak çıtalarına yalnız alttan'],['Paslanmaz vida 6×100','2 kutu','iskelet'],['Dübel 10 mm + paslanmaz vida','4-6 takım','duvar kirişi'],...(o.back?[['Sırt çıtası taşıyıcı (gizli)','3 adet','duvara']]:[])],join:'Paslanmaz vida',
    notes:[{t:'warn',x:'Sauna ahşabına boya, vernik ya da yağ sürme; ısınınca buhar ve koku yapar. Oturma yüzeyinde vida başı görünmesin: metal çok ısınır ve deriyi yakar.'},
      {t:'tip',x:`Üst kademe ${Hu} mm (${Du} mm derin), alt basamak ${Hl} mm (${Dl} mm derin). Ihlamur ve kavak sauna için tercih edilir: ısıyı az iletir, reçine çıkarmaz.`}]};
  c.tools=stdTools(['gonyeT','daire','metre','kalem','terazi','matkap','havsa','freze',['isk','2 adet'],'zimMak','zimKag']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire','metre'],x:cutUL(c,K)},
    {t:'Kenarları yuvarlat',tools:['freze','zimMak'],x:'<p>Bütün oturak ve basamak çıtalarının üst kenarlarını 5 mm yuvarlatma bıçağıyla frezele, 120 ve 180 kumla zımparala.</p>'},
    {t:'İskeleti kur',add:['wall','ubeam','uleg','lbeam','lleg'],tools:['matkap','terazi','gonye'],x:`<p>${K('wall')} kirişini yerden ${Hu-98-70} mm yükseklikte duvara dübelle. ${K('ubeam')} üst taşıyıcıları kirişe, ${K('uleg')} ayakları önlerine bağla. ${K('lbeam')} alt taşıyıcıları üst ayakların önüne, ${K('lleg')} ayakları uçlarına vidala.</p>`},
    {t:'Çıtaları diz',add:['useat','lseat','back'],tools:['matkap'],x:`<p>${K('useat')} ve ${K('lseat')} çıtaları 10 mm arayla diz; taşıyıcıların altından yukarı doğru paslanmaz vidalarla bağla, vida ucu oturak yüzeyine çıkmasın.</p>`}];
  return c;
}

/* 58) Kamp sandığı (taşınır mutfak kutusu) */
function campBox(p,o){
  const parts=[], W=p.W, Hb=p.H, D=p.D, t=12, m='ply12', sp=o.sp||'cam', y0=o.legs?450:0, hm=y0+R(Hb/2);
  for(const x of [0,W-t]) BOX(parts,'side','Yan panel',m,x,y0,0,t,Hb,D,{cutNote:'ip sap için 2 delik Ø14'});
  BOX(parts,'bottom','Taban',m,t,y0,0,W-2*t,t,D);BOX(parts,'top','Kapak (üst)',m,t,y0+Hb-t,0,W-2*t,t,D);
  BOX(parts,'back','Arkalık',m,t,y0+t,0,W-2*t,Hb-2*t,t);
  BOX(parts,'front','Ön alt panel',m,t,y0+t,D-t,W-2*t,hm-12-y0-t,t);
  BOX(parts,'shelf','Çalışma rafı',m,t,hm-12,t,W-2*t,t,D-t);
  BOX(parts,'div','Ara bölme',m,R(W*0.6),hm,t,t,y0+Hb-t-hm,D-t-2);
  BOX(parts,'shelf2','Küçük raf',m,R(W*0.6)+t,R(hm+(y0+Hb-t-hm)/2),t,W-t-R(W*0.6)-t,t,D-t-2);
  BOX(parts,'flap','Açılır masa kapağı',m,0,hm-12,D,W,t,R(Hb/2),{cutNote:'açıkken masa, kapalıyken ön üst kapak'});
  for(const x of [10,W-10]) PART(parts,'stay','Taşıma halatı/destek','steel',cylRings([x,y0+Hb-30,D-5],[x,hm,D+R(Hb/2)-10],2,2,8),{deco:true,smooth:true});
  if(o.legs) for(const x of [-28,W]) for(const z of [0,D-45]) BOX(parts,'leg','Sökülebilir ayak',LM(sp,28,45),x,0,z,28,y0+150,45,{cutNote:'iki kelebek cıvatayla yana bağlanır'});
  const c={parts,hw:[['Piyano menteşe',`${W} mm`,'masa kapağı'],['Çelik halat ya da zincir + kilit halkası','2 × 450 mm','masa kapağını yatay tutar'],['Kilitli kapak mandalı','2 adet','taşırken kapalı tutar'],
      ['Ahşap tutkalı (D3, su geçirmez)','1 şişe',''],['Vida 3,5×30','1 kutu',''],['İp sap (Ø14 halat)','2 × 400 mm','yanlara'],...(o.legs?[['Kelebek somun + M8 cıvata','8 takım','ayaklar']]:[]),['Dış mekân vernik','0,5 L','2 kat']],join:'Tutkal + vida',
    notes:[{t:'tip',x:`Kutu ${W} × ${D} × ${Hb} mm. Ön kapak açılınca yerden ${hm} mm yükseklikte ${W} × ${R(Hb/2)} mm çalışma masası olur; içi ocak, tencere ve baharat için bölmeli.`},
      {t:'warn',x:'Kamp ocağını kutunun içinde yakma; ahşap ısıyla tutuşabilir. Ocağı açık masa kapağına ısıya dayanıklı altlık koyarak yerleştir.'}]};
  c.tools=stdTools(['daire','ray','gonyeT','metre','gonye','kalem','matkap','forstnerSet','havsa',['isk','4 adet'],'koseIsk','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','gonyeT'],x:cutUL(c,K)},
    {t:'Gövdeyi kur',add:['side','bottom','top','back','front'],tools:['isk','koseIsk','matkap'],x:`<p>${K('side')} yanlara ${K('bottom')} tabanı, ${K('top')} üst kapağı, ${K('back')} arkalığı ve ${K('front')} ön alt paneli tutkal ve vidayla bağla.</p>`},
    {t:'İç bölmeleri tak',add:['shelf','div','shelf2'],tools:['matkap','metre'],x:`<p>${K('shelf')} rafını ön alt panelin üst kenarı hizasına, ${K('div')} ara bölmeyi ve ${K('shelf2')} küçük rafı üst bölüme yerleştir.</p>`},
    {t:'Masa kapağını as',add:['flap','stay'],tools:['matkap'],x:`<p>${K('flap')} kapağı piyano menteşeyle çalışma rafının ön kenarına bağla. Yatay açıkken iki yandan halatla üst köşelere bağla; kapalıyken mandallarla kilitle.</p>`},
    ...(o.legs?[{t:'Ayakları hazırla',add:['leg'],tools:['matkap'],x:`<p>${K('leg')} ayakları yanlara kelebek cıvatalarla bağlanacak şekilde del; taşırken sökülüp kutunun içine konur.</p>`}]:[]),
    finishStep({outdoor:1},'<p>Yan deliklere ip sapları geçirip içten düğüm at.</p>')];
  return c;
}

/* ---------- 2026-11-05 (5): masa lambası, satranç takımı, bahçe oyun evi, kadeh askılı şarap rafı ---------- */

/* 59) Ahşap masa lambası */
function deskLamp(p,o){
  const parts=[], B=p.W, H=p.H, sp=o.sp||'ceviz', round=o.base==='yuvarlak', bt=30, cx=B/2, cz=B/2;
  if(round) PART(parts,'base','Taban',LM(sp,bt,B),prism('y',circlePoly(cx,cz,B/2,48),0,bt),{smooth:true,cut:[B,B,bt],cutNote:`Ø${B} daire kesilir, alttan kablo kanalı açılır`});
  else BOX(parts,'base','Taban',LM(sp,bt,B),0,0,0,B,bt,B,{cutNote:'alttan kablo kanalı açılır, kenarlar R3'});
  BOX(parts,'col','Gövde',LM(sp,45,45),cx-22.5,bt,cz-22.5,45,H-bt-40,45,{cutNote:'boydan boya Ø8 kablo deliği (iki uçtan delinir)'});
  PART(parts,'socket','Duy','steel',cylRings([cx,H-40,cz],[cx,H,cz],16,16,16),{deco:true,smooth:true});
  const sh=o.shade||'kumas', r0=p.S/2;
  PART(parts,'shade','Abajur','fabric',cylRings([cx,H-60,cz],[cx,H+R(p.S*0.7),cz],r0,R(r0*0.7),40),{deco:true,smooth:true});
  const c={parts,hw:[['Lamba montaj seti (E27 duy, anahtarlı kablo, fiş)','1 takım','CE işaretli, en az 1,8 m kablo'],['LED ampul E27 (sıcak beyaz, en çok 9 W)','1 adet','akkor ampul kullanma'],
      [`Abajur Ø${p.S} mm`,'1 adet','E27 halkalı, kumaş ya da kâğıt'],['Kaydırmaz keçe','4 adet','taban altı'],['Ahşap tutkalı','1 şişe',''],['Sert yağ','0,1 L','']],join:'Tutkal + kavela',
    notes:[{t:'warn',x:'Elektrik bağlantısını hazır, CE işaretli lamba setiyle yap; kablonun ahşap içinde ezilmediğinden ve duyun gövdeye sıkı oturduğundan emin ol. Yalnız LED ampul kullan.'},
      {t:'tip',x:`Toplam yükseklik abajurla yaklaşık ${H+R(p.S*0.7)} mm, taban ${round?'Ø':''}${B} mm. Kablo tabanın altındaki kanaldan arkaya çıkar.`}]};
  c.tools=stdTools(['gonyeT',round?'dekupaj':null,'metre','kalem','matkap','forstnerSet','dubelSet',['isk','2 adet'],'freze','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'].concat(round?['dekupaj']:[]),x:cutUL(c,K)},
    {t:'Kablo yolunu del',add:['col'],tools:['matkap','isk'],x:`<p>${K('col')} gövdeyi işkenceyle dik tut, iki ucundan ortaya doğru 8 mm delik aç; delikler ortada buluşsun. ${K('base')} tabanın altına freze ile 10 mm genişliğinde kablo kanalı aç.</p>`,tip:'Uzun matkap ucu yoksa gövdeyi iki yarım olarak kes, ortalarına 4 mm kanal frezeleyip yapıştır.'},
    {t:'Gövdeyi tabana bağla',add:['base'],tools:['dubelSet','matkap','isk'],x:`<p>Gövdeyi tabanın ortasına iki kavela ve tutkalla dik bağla; kablo deliği tabanın deliğiyle hizalı olsun.</p>`},
    finishStep({}),
    {t:'Elektrik setini tak',add:['socket','shade'],tools:['matkap'],x:'<p>Kabloyu tabandan gövdeye geçir, duyu gövdenin üstüne vidala ve set talimatına göre bağla. Abajuru duy halkasıyla sabitle, LED ampulü tak.</p>',warn:'Bağlantıyı yaparken fiş prizden çekili olsun.'}];
  return c;
}

/* 60) Satranç takımı (tahta + kavela taşlar) */
function chessSet(p,o){
  const parts=[], s=p.S, T=20, bw=30, W=8*s+2*bw, lt=o.light||'akc', dk=o.dark||'ceviz', y0=6;
  BOX(parts,'backing','Alt levha','ply6',0,0,0,W,6,W);
  for(let i=0;i<8;i++) for(let j=0;j<8;j++){const dark=(i+j)%2===0;
    BOX(parts,dark?'sqD':'sqL',dark?'Koyu kare':'Açık kare',LM(dark?dk:lt,T,s),bw+i*s,y0,bw+j*s,s,T,s,{cutNote:'şerit yöntemi: 4 şerit yapıştırılıp 8 dilim kesilir'});}
  for(const z of [0,W-bw]) BOX(parts,'frame','Kenar çıtası',LM(dk,T,bw),0,y0,z,W,T,bw,{cutNote:'uçları 45° gönye'});
  for(const x of [0,W-bw]) BOX(parts,'frame','Kenar çıtası',LM(dk,T,bw),x,y0,bw,bw,T,W-2*bw,{cut:[W,bw,T],cutNote:'uçları 45° gönye'});
  if(o.pieces){const top=y0+T, ht={p:30,r:42,n:48,b:54,q:62,k:70}, row=['r','n','b','q','k','b','n','r'];
    const piece=(i,j,t,dark)=>{const cx=bw+(i+.5)*s, cz=bw+(j+.5)*s, d=t==='p'?25:32, h=ht[t];
      PART(parts,dark?'pD':'pL',dark?'Koyu taş':'Açık taş',d===25?'kav25':'kav32',cylRings([cx,top,cz],[cx,top+h,cz],d/2,d/2,20),{smooth:true,cut:[h,d,d],cutNote:t==='n'?'üstü 45° kesilir':t==='k'?'üstüne çentik':t==='b'?'üstü sivriltilir':t==='q'?'üstü pahlanır':'' });};
    for(let i=0;i<8;i++){piece(i,0,row[i],false);piece(i,1,'p',false);piece(i,6,'p',true);piece(i,7,row[i],true);}}
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],...(o.pieces?[['Ceviz renkli su bazlı bitirme (koyu taşlar)','0,1 L',''],['Keçe daire Ø20','32 adet','taş altları']]:[]),['Keçe ayak','4 adet','tahta altı'],['Sert yağ ya da şeffaf vernik','0,1 L','']],join:'Tutkal',
    notes:[{t:'tip',x:`Tahta ${W} × ${W} mm, kare ${s} mm. ${o.pieces?'Taşlar Ø25 ve Ø32 kayın kavelalardan; şah 70 mm, piyon 30 mm. Koyu takım cevize boyanır.':'Taş takımı ayrı alınabilir; şah taban çapı karenin yaklaşık %75\'i olmalı.'}`},
      {t:'tip',x:'Kareler şerit yöntemiyle hızlı ve tam kare çıkar: dört açık, dört koyu şeridi sırayla yapıştır, kuruyunca enine sekiz dilim kes ve her ikinci dilimi ters çevirerek yeniden yapıştır.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem',['isk','4 adet'],'rende','zimMak','zimKag','firca',o.pieces?'aciOlcer':null]);
  c.mkSteps=K=>[
    {t:'Şeritleri kes',tools:['gonyeT','metre'],x:`${cutUL(c,K)}<p>Kareleri tek tek kesmek yerine ${s} mm genişliğinde dört açık ve dört koyu şerit kes.</p>`},
    {t:'Şeritleri yapıştır ve dilimle',add:['sqL','sqD'],tools:['isk','gonyeT'],x:`<p>Şeritleri açık-koyu sırayla tutkallayıp işkenceyle sık. Kuruyunca enine ${s} mm'lik sekiz dilim kes; her ikinci dilimi ters çevirerek satranç deseniyle yeniden yapıştır.</p>`},
    {t:'Kenar çerçevesini tak',add:['frame','backing'],tools:['gonyeT','isk'],x:`<p>${K('frame')} çıtalarını 45° gönyeyle kesip tahtanın çevresine yapıştır. Alttan ${K('backing')} levhayı yapıştır; tahta eğilmez.</p>`},
    {t:'Düzle ve zımparala',tools:['rende','zimMak','zimKag'],x:'<p>Yüzeyi rende ya da zımpara makinesiyle düzle, 240 kuma kadar ince zımparala.</p>'},
    ...(o.pieces?[{t:'Taşları yap',add:['pL','pD'],tools:['gonyeT','aciOlcer','zimKag'],x:'<p>Kavelaları boylarına göre kes: piyon 30, kale 42, at 48, fil 54, vezir 62, şah 70 mm. Atın üstünü 45° kes, filin üstünü sivrilt, şaha çentik aç. Koyu takımı ceviz renkli bitirmeyle boya, altlarına keçe yapıştır.</p>'}]:[]),
    {t:'Yağla',tools:['firca'],x:'<p>Tahtayı ve taşları sert yağla iki kat yağla.</p>'}];
  return c;
}

/* 61) Bahçe oyun evi (beşik çatılı) */
function playhouse(p,o){
  const parts=[], W=p.W, D=p.D, Hw=p.H, sp=o.sp||'emp', y0=113, pitch=35*Math.PI/180, rh=R(W/2*Math.tan(pitch)), ov=60, t=12;
  spread(3,0,D,95).forEach(z=>BOX(parts,'bearer','Taban kirişi',LM(sp,70,95),0,0,z,W,95,95));
  const nf=Math.ceil(W/1220);for(let i=0;i<nf;i++) BOX(parts,'floor','Taban levhası','ply18',i*W/nf,95,0,W/nf,18,D);
  for(const x of [0,W-45]) for(const z of [0,D-45]) BOX(parts,'post','Köşe dikmesi',LM(sp,45,45),x,y0,z,45,Hw-y0,45);
  const split=(len)=>{const n=Math.ceil(len/1220);return Array.from({length:n},(_,i)=>[i*len/n,len/n]);};
  split(W).forEach(([a,l])=>BOX(parts,'wallB','Arka duvar','ply12',a,y0,-t,l,Hw-y0,t));
  split(D).forEach(([a,l],i)=>{for(const x of [-t,W]) BOX(parts,'wallS','Yan duvar','ply12',x,y0,a,t,Hw-y0,l,{cutNote:i===0?'400×400 pencere boşluğu kesilir':''});});
  const dw=Math.min(560,W-500), dh=Math.min(1150,Hw-y0-200), dx=(W-dw)/2;
  BOX(parts,'wallF','Ön duvar','ply12',0,y0,D,dx,Hw-y0,t);BOX(parts,'wallF','Ön duvar','ply12',dx+dw,y0,D,W-dx-dw,Hw-y0,t);
  BOX(parts,'wallT','Kapı üstü','ply12',dx,y0+dh,D,dw,Hw-y0-dh,t);
  const gab=[[-t,Hw],[W+t,Hw],[W/2,Hw+rh]];
  PART(parts,'gableB','Arka alın üçgeni','ply12',prism('z',gab,-t,t),{cut:[W+2*t,rh,t],cutNote:'iki kenarı 35° kesilir'});
  PART(parts,'gableF','Ön alın üçgeni','ply12',prism('z',gab,D,t),{cut:[W+2*t,rh,t],cutNote:'iki kenarı 35° kesilir, ortasına yuvarlak pencere'});
  const ex=-t-ov, ey=Hw-(ov+t)*Math.tan(pitch), slope=Math.hypot(W/2-ex,Hw+rh-ey), tv=t/Math.cos(pitch);
  for(const s of [-1,1]){const X=x=>s<0?x:W-x, poly=[[X(ex),ey+3],[X(W/2),Hw+rh+3],[X(W/2),Hw+rh+3+tv],[X(ex),ey+3+tv]];
    PART(parts,'roof','Çatı levhası','ply12',prism('z',poly,-t-100,D+2*t+200),{cut:[D+2*t+200,R(slope),t],cutNote:'mahya kenarı 35° kesilir'});}
  const c={parts,hw:[['Bitümlü shingle + çatı keçesi',`${dec(R(2*(slope+20)*(D+250)/1e6*1.1*10)/10)} m²`,''],['Mahya kapağı',`${R(D+250)} mm`,''],['Galvaniz vida 4×40','2 kutu',''],['Beton blok','6 adet','taban kirişleri altına'],
      ['Çocuğa uygun dış cephe boyası (EN 71-3)',`${Math.ceil((2*(W+D)*Hw/1e6)/6)} L`,'2 kat'],['Pencere için pleksiglas (isteğe bağlı)','400 × 400 mm','kenarları yuvarlatılmış']],join:'Vida',
    notes:[{t:'warn',x:'Kapı boşluğuna kapak takma ya da yalnız mıknatıslı, kilitsiz kapak tak; çocuk içeride kilitli kalmamalı. Bütün kenarları yuvarlat, vida uçları dışarı taşmasın.'},
      {t:'tip',x:`Taban ${W} × ${D} mm, duvar yüksekliği ${Hw} mm, mahya ${Hw+rh} mm. Kapı boşluğu ${dw} × ${dh} mm. 3-8 yaş için.`}]};
  c.tools=stdTools(['daire','ray','dekupaj','gonyeT','aciOlcer','metre','kalem','terazi','matkap','havsa',['isk','4 adet'],'zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','dekupaj','aciOlcer'],x:`${cutUL(c,K)}<p>Kapı, pencere ve yuvarlak alın penceresini dekupajla kes; köşeleri 30 mm yarıçapla yuvarlat.</p>`},
    {t:'Tabanı kur',add:['bearer','floor'],tools:['terazi','matkap'],x:`<p>Beton blokları terazide diz, ${K('bearer')} kirişleri üstlerine koy ve ${K('floor')} levhaları vidala.</p>`},
    {t:'Duvarları kur',add:['post','wallB','wallS','wallF','wallT'],tools:['matkap','gonye','isk'],x:`<p>${K('post')} dikmeleri köşelere dik bağla. ${K('wallB')}, ${K('wallS')} ve ${K('wallF')} panellerini dikmelere ve tabana vidala; ${K('wallT')} parçasını kapı üstüne tak.</p>`},
    {t:'Alınları ve çatıyı tak',add:['gableB','gableF','roof'],tools:['matkap','aciOlcer'],x:`<p>${K('gableF')} ve ${K('gableB')} üçgenlerini duvarların üstüne vidala. İki ${K('roof')} levhasını alınlara ve mahyada birbirine bağla, keçe ve shingle uygula.</p>`,warn:'Çatıyı iki kişiyle tak.'},
    {t:'Boya',tools:['zimKag','boya'],x:'<p>Bütün yüzeyleri zımparala, çocuğa uygun dış cephe boyasıyla iki kat boya; kenar kesitlerine ekstra kat sür.</p>'}];
  return c;
}

/* 62) Kadeh askılı şarap rafı (duvar) */
function wineGlassRack(p,o){
  const parts=[], W=p.W, sp=o.sp||'mese', bk=LM(sp,20,190), sh=LM(sp,28,140), rl=LM(sp,20,30), nb=Math.max(2,Math.floor((W-60)/100)), ng=Math.max(2,Math.floor((W-40)/110));
  BOX(parts,'back','Arka tahta',bk,0,0,0,W,190,20,{cutNote:'iki adet gizli askı yuvası'});
  BOX(parts,'shelf','Şişe rafı',sh,0,190,0,W,28,140,{cutNote:`ön kenara ${nb} adet Ø80 yarım daire şişe yuvası`});
  spread(ng,20,W-20,30).forEach(x=>BOX(parts,'rail','Kadeh rayı',rl,x,160,20,30,30,120,{cutNote:'T profil: iki yandan 10 mm oyulur'}));
  const c={parts,hw:[['Gizli askı aparatı + dübel','2 takım','beton ya da tuğla duvara'],['Ahşap tutkalı','1 şişe',''],['Vida 4×40','1 kutu',''],['Sert yağ','0,1 L','']],join:'Tutkal + vida',
    notes:[{t:'tip',x:`${nb} şişe rafın üstünde yatar; altındaki ${ng} rayda ${ng*3} kadar kadeh asılır.`}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','kalem','terazi','matkap','freze',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[{t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Yuvaları aç',tools:['dekupaj','freze'],x:`<p>${K('shelf')} rafın ön kenarına ${nb} yarım daire şişe yuvası, ${K('rail')} rayların alt kenarına kadeh ayağı için T oyuk aç.</p>`},
    {t:'Birleştir ve as',add:['back','shelf','rail'],tools:['isk','matkap','terazi'],x:`<p>Rafı ${K('back')} tahtanın üst kenarına, rayları rafın altına tutkal ve vidayla bağla. Kuruyunca yağla ve terazileyerek duvara as.</p>`}];
  return c;
}

/* ---------- 2026-11-05 (6): yürüteç, denge tahtası, kitaplıklı çalışma masası ---------- */

/* 63) Ahşap bebek yürüteci (itmeli araba) */
function pushWalker(p,o){
  const parts=[], W=p.W, L=p.D, H=p.H, sp=o.sp||'kayin', t=12, r=65, yb=40, hb=200;
  for(const x of [0,W-t]) BOX(parts,'side','Yan panel','ply12',x,yb,0,t,hb,L,{cutNote:'üst köşeler R20, aks deliği Ø10'});
  BOX(parts,'bottom','Taban','ply12',t,yb,0,W-2*t,t,L);
  for(const z of [0,L-t]) BOX(parts,'end','Ön/arka panel','ply12',t,yb+t,z,W-2*t,hb-t,t);
  for(const x of [t,W-t-28]) BOX(parts,'post','Tutamak dikmesi',LM(sp,28,45),x,yb+t,t,28,H-yb-t,45,{cutNote:'üst ucu yuvarlatılır, Ø25 delik'});
  BOX(parts,'bar','Tutamak çubuğu','kav25',t+28,H-40,t+10,W-2*t-56,25,25,{cut:[W-2*t-56+30,25,25],cutNote:'uçları 15 mm dikmelere gömülür'});
  for(const x of [-18,W]) for(const z of [r+10,L-r-10]) PART(parts,'wheel','Tekerlek','ply18',prism('x',circlePoly(z,r,r,40),x,18),{smooth:true,cut:[2*r,2*r,18],cutNote:'Ø10 aks deliği, kenara kauçuk bant'});
  const c={parts,hw:[['Aks cıvatası M8×60 + kilitli somun + 2 pul','4 takım','tekerlekler'],['Kauçuk bant ya da O-ring (Ø130)','4 adet','tekerlek kenarına, kaymaz ve sessiz'],['Ahşap tutkalı','1 şişe',''],['Vida 3,5×25','1 kutu',''],
      ['Çocuğa uygun su bazlı boya ya da vernik (EN 71-3)','0,25 L','']],join:'Tutkal + vida',
    notes:[{t:'warn',x:'Yürüteç yalnız tutunarak ayağa kalkabilen bebekler içindir ve yetişkin gözetiminde kullanılmalı. Merdiven ve basamak yakınında kullanma. Hızlanmasın diye tekerlek somunlarını hafif sıkı bırak ya da kutuya ağırlık koy.'},
      {t:'tip',x:`Tutamak yerden ${H} mm; kutu ${W} × ${L} mm, oyuncak ve blok taşımak için.`}]};
  c.tools=stdTools(['daire','dekupaj','pergel','metre','kalem','matkap','forstnerSet','havsa',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj','pergel'],x:`${cutUL(c,K)}<p>${K('wheel')} tekerlekleri pergel ve dekupajla kes, kenarlarını zımparayla tam yuvarlak yap.</p>`},
    {t:'Kutuyu kur',add:['side','bottom','end'],tools:['matkap','isk'],x:`<p>${K('side')} yanlara ${K('bottom')} tabanı ve ${K('end')} panelleri tutkal ve vidayla bağla.</p>`},
    {t:'Tutamağı tak',add:['post','bar'],tools:['forstnerSet','matkap','isk'],x:`<p>${K('post')} dikmelerin üst ucuna 25 mm delik aç, ${K('bar')} çubuğu tutkalla yerleştir. Dikmeleri kutunun arka köşelerine içten vidala.</p>`},
    {t:'Tekerlekleri tak',add:['wheel'],tools:['matkap'],x:'<p>Tekerlek kenarına kauçuk bandı geçir. Aks cıvatasını pul, tekerlek ve pul sırasıyla yan panele geçirip kilitli somunla tuttur; tekerlek dönmeli ama sallanmamalı.</p>'},
    finishStep({},'<p>Bütün kenarları yuvarlat; parmak sıkışacak aralık kalmasın.</p>')];
  return c;
}

/* 64) Denge tahtası (sallanır) */
function balanceBoard(p,o){
  const parts=[], L=p.L, W=p.W, rh=p.R, t=18, Rr=(L*L/4+rh*rh)/(2*rh), arc=[];
  for(let i=0;i<=24;i++){const z=i*L/24;arc.push([z,rh-(Math.sqrt(Math.max(0,Rr*Rr-(z-L/2)**2))-(Rr-rh))]);}
  const poly=[[0,rh],...arc.slice(1,-1),[L,rh]];
  for(const x of [40,W-58]) PART(parts,'rocker','Kavisli ayak','ply18',prism('x',poly,x,t),{cut:[L,rh,t],cutNote:`R${R(Rr)} yay kesilir`});
  BOX(parts,'deck','Basma tablası','ply18',0,rh,0,W,t,L,{cutNote:'köşeler R40'});
  BOX(parts,'stop','Uç takozu',LM(o.sp||'kayin',20,45),58,rh-45,0,W-116,45,20);BOX(parts,'stop','Uç takozu',LM(o.sp||'kayin',20,45),58,rh-45,L-20,W-116,45,20);
  const c={parts,hw:[['Kaydırmaz kaplama (mantar ya da keçe)',`${W} × ${L} mm`,'tablanın üstüne'],['Ahşap tutkalı','1 şişe',''],['Vida 3,5×30','12 adet',''],['Çocuğa uygun vernik (EN 71-3)','0,1 L','']],join:'Tutkal + vida',
    notes:[{t:'tip',x:`Tahta ${L} × ${W} mm, sallanma yüksekliği ${rh} mm. Ters çevrilince köprü ya da kaydırak olarak da kullanılır.`},{t:'warn',x:'Halı ya da oyun matı üstünde kullan; ayakkabıyla basılmamalı.'}]};
  c.tools=stdTools(['daire','dekupaj','pergel','metre','kalem','matkap','havsa',['isk','2 adet'],'freze','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj','pergel'],x:`${cutUL(c,K)}<p>${K('rocker')} ayakların yayını ${R(Rr)} mm yarıçaplı bir şablonla çiz; ikisini birlikte işkenceyle sıkıp aynı anda kes.</p>`},
    {t:'Birleştir',add:['rocker','deck','stop'],tools:['matkap','isk','gonye'],x:`<p>${K('rocker')} ayakları tablanın altına kenarlardan 40 mm içeride tutkal ve vidayla bağla, uçlara ${K('stop')} takozları ekle.</p>`},
    finishStep({},'<p>Kenarları frezeyle yuvarlat, üstüne kaydırmaz kaplama yapıştır.</p>')];
  return c;
}

/* 65) Kitaplıklı çalışma masası */
function deskBookcase(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, Wt=420, Dt=300, m=o.mat||'ply18', t=18, dy=740;
  for(const x of [0,Wt-t]) BOX(parts,'tside','Kitaplık yanı',m,x,0,0,t,H,Dt);
  for(const y of [60,H-t]) BOX(parts,'tcap','Kitaplık alt/üst',m,t,y,0,Wt-2*t,t,Dt);
  BOX(parts,'kick','Baza',m,t,0,Dt-40,Wt-2*t,60,t);
  for(let y=60+t+330;y<H-t-150;y+=330) BOX(parts,'tshelf','Kitaplık rafı',m,t,y,0,Wt-2*t,t,Dt-10);
  BOX(parts,'top','Masa tablası',m,Wt,dy,0,W-Wt-t,t,D,{cutNote:'ön kenar bantlı'});
  BOX(parts,'leg','Masa yan paneli',m,W-t,0,0,t,dy+t,D);
  BOX(parts,'cleat','Arka kuşak',m,Wt,dy-100,0,W-Wt-t,100,t,{cutNote:'duvara dübelli'});
  BOX(parts,'modesty','Ön alt perde',m,Wt,dy-300,D-80,W-Wt-t,200,t);
  for(const y of [dy+460,dy+800].filter(y=>y<H-100)) BOX(parts,'wshelf','Duvar rafı',m,Wt,y,0,W-Wt,t,250);
  const c={parts,hw:[['Konfirmat vidası 7×50','24 adet',''],['Raf pimi 5 mm','16 adet',''],['Gizli raf taşıyıcı (duvar)','4 adet','duvar rafları'],['Dübel 8 mm + vida','6 takım','kitaplık ve arka kuşak'],
      ['Kablo geçiş kapağı Ø60','1 adet','masa tablası'],['Kenar bandı 22 mm',`${dec(R((2*H+W*4)/1000*1.1*10)/10)} m`,'']],join:'Konfirmat',
    notes:[{t:'tip',x:`Kitaplık ${Wt} mm geniş, ${H} mm yüksek; masa ${W-Wt} × ${D} mm, yükseklik ${dy+t} mm. Kitaplık masanın bir ayağı yerine geçer.`},{t:'warn',x:'Kitaplığı ve duvar raflarını mutlaka duvara sabitle.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','terazi','matkap','konfUc','rafSab','forstnerSet','havsa',['isk','2 adet'],'koseIsk','utu','bicak']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','metre'],x:cutUL(c,K)},
    {t:'Kitaplığı kur',add:['tside','tcap','kick','tshelf'],tools:['konfUc','matkap','rafSab','koseIsk'],x:`<p>${K('tside')} yanlara ${K('tcap')} alt ve üst paneli konfirmatla bağla, ${K('kick')} bazayı tak, raf pimi deliklerini açıp ${K('tshelf')} rafları yerleştir.</p>`},
    {t:'Masayı kur',add:['top','leg','cleat','modesty'],tools:['konfUc','matkap','terazi'],x:`<p>${K('cleat')} kuşağı duvara dübelle. ${K('top')} tablayı bir uçtan kitaplığın yan paneline, öbür uçtan ${K('leg')} panele konfirmatla bağla; ${K('modesty')} perdeyi alttan tak.</p>`},
    {t:'Duvar raflarını as',add:['wshelf'],tools:['terazi','matkap'],x:`<p>${K('wshelf')} rafları masanın üstüne gizli taşıyıcılarla terazileyerek as.</p>`},
    {t:'Kablo deliği',tools:['forstnerSet'],x:'<p>Masa tablasının arka köşesine 60 mm kablo deliği aç, kapağı tak.</p>'}];
  return c;
}

/* ---------- 2026-11-05 (7): kaykay rampası, arı kovanı, tablet standı, antre askı paneli ---------- */

/* 66) Kaykay / bisiklet atlama rampası */
function skateRamp(p,o){
  const parts=[], W=p.W, L=p.L, H=p.H, t=18, tri=[[0,0],[L,0],[L,H]], nr=Math.max(1,Math.floor((W-36)/400));
  for(const x of [0,W-t]) PART(parts,'side','Yan üçgen','ply18',prism('x',tri,x,t),{cut:[L,H,t],cutNote:'hipotenüs boyunca kesilir'});
  spread(nr,t,W-t,t).forEach(x=>PART(parts,'rib','Ara kaburga','ply18',prism('x',tri,x,t),{cut:[L,H,t]}));
  BOX(parts,'back','Arka panel','ply18',t,0,L-t,W-2*t,H-20,t);
  const len=Math.hypot(L,H);
  PART(parts,'deck','Rampa yüzeyi','ply18',barRings([W/2,9,0],[W/2,H+9,L],W,t,[0,1,0]),{cut:[R(len),W,t],cutNote:'alt ucu 2 mm\'ye kadar pahlanır'});
  BOX(parts,'cleat','Arka destek kirişi',LM(o.sp||'emp',45,70),t,H-90,L-t-45,W-2*t,70,45);
  const c={parts,hw:[['Çelik geçiş sacı 2 mm',`${W} × 150 mm`,'rampa ağzına, havşa vidalı'],['Sunta vidası 4×40','1 kutu',''],['Kaydırmaz zemin boyası (dış mekân)','1 L','2 kat, kumlu'],['Kauçuk ayak bandı',`${W} mm`,'arka alt kenara']],join:'Vida',
    notes:[{t:'warn',x:'Kask, dizlik ve dirseklik takmadan kullanma. Rampayı düz, kuru ve trafikten uzak bir zemine koy; ıslakken kayar.'},
      {t:'tip',x:`Rampa ${W} mm genişlikte, ${L} mm uzunlukta, ${H} mm yükseklikte; eğim ${R(Math.atan(H/L)*180/Math.PI)}°. Yeni başlayanlar için 20° altı uygundur.`}]};
  c.tools=stdTools(['daire','ray','dekupaj','metre','kalem','matkap','havsa',['isk','2 adet'],'zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:`${cutUL(c,K)}<p>${K('side')} ve ${K('rib')} üçgenleri birini şablon yapıp aynı ölçüde kes.</p>`},
    {t:'İskeleti kur',add:['side','rib','back','cleat'],tools:['matkap','isk','gonye'],x:`<p>Üçgenleri ${R((W-36)/(nr+1))} mm arayla dik tut, ${K('back')} arka paneli ve ${K('cleat')} kirişi arkalarına vidala.</p>`},
    {t:'Yüzeyi kapla',add:['deck'],tools:['matkap','havsa'],x:`<p>${K('deck')} levhayı üçgenlerin eğik kenarına 150 mm arayla havşalı vidala; vida başı yüzeyden çıkmasın.</p>`},
    {t:'Geçiş sacını tak ve boya',tools:['matkap','boya'],x:'<p>Rampa ağzına çelik sacı havşa vidalarla bağla. Yüzeyi kaydırmaz zemin boyasıyla iki kat boya.</p>'}];
  return c;
}

/* 67) Arı kovanı (Langstroth, 10 çerçeve) */
function beeHive(p,o){
  const parts=[], N=p.N, sp=o.sp||'cam', OL=505, OW=405, BH=243, t=20, bk=LM(sp,t,BH), y0=38;
  BOX(parts,'floor','Taban tahtası','ply18',0,0,0,OL,18,OW+60,{cutNote:'önde 60 mm uçuş tahtası çıkıntısı'});
  BOX(parts,'rail','Giriş çıtası',LM(sp,20,20),0,18,0,OL,20,20);for(const x of [0,OL-20]) BOX(parts,'rail','Giriş çıtası',LM(sp,20,20),x,18,20,20,20,OW-40);
  for(let i=0;i<N;i++){const y=y0+i*BH;
    for(const z of [0,OW-t]) BOX(parts,'side','Kovan uzun yanı',bk,0,y,z,OL,BH,t,{cutNote:'iki ucu 10 mm lamba, tutma oyuğu'});
    for(const x of [0,OL-t]) BOX(parts,'end','Kovan kısa yanı',bk,x,y,t,t,BH,OW-2*t,{cutNote:'üst iç kenara 10×16 çerçeve kulağı yuvası'});}
  const top=y0+N*BH;
  BOX(parts,'inner','İç kapak','ply12',0,top,0,OL,12,OW,{cutNote:'ortaya Ø25 havalandırma deliği'});
  BOX(parts,'roof','Çatı tablası','ply18',-25,top+12+50,-25,OL+50,18,OW+50,{cutNote:'üstü sacla kaplanır'});
  for(const z of [-25,OW+5]) BOX(parts,'rim','Çatı kenarı',LM(sp,20,70),-25,top+12-20,z,OL+50,70,20);
  for(const x of [-25,OL+5]) BOX(parts,'rim','Çatı kenarı',LM(sp,20,70),x,top+12-20,-5,20,70,OW+10);
  const c={parts,hw:[['Langstroth çerçeve (telli)',N*10+' adet','hazır alınır'],['Temel petek',N*10+' adet',''],['Galvaniz sac 0,5 mm',`${OL+150} × ${OW+150} mm`,'çatı kaplaması'],['Paslanmaz çivi 2,5×50','1 kutu','kasa köşeleri'],
      ['Dış mekân su bazlı boya (açık renk)','1 L','yalnız dış yüzeylere'],['Kovan sehpası ya da 2 beton blok','1 takım','yerden 30-40 cm']],join:'Lamba + tutkal + çivi',
    notes:[{t:'tip',x:`Standart 10 çerçeveli Langstroth: dış ölçü ${OL} × ${OW} mm, kat yüksekliği ${BH} mm, ${N} kat. Çerçeve ve kat ölçüleri piyasadaki aksesuarlarla uyumlu olsun diye değiştirilemez.`},
      {t:'warn',x:'Kovanın içine boya, vernik ya da emprenye sürme; arılara zarar verir. Arıcılığa başlamadan önce bölgendeki arıcılar birliğine ve kovan kayıt kurallarına danış.'}]};
  c.tools=stdTools(['daire','gonyeT','metre','gonye','kalem','matkap','freze','cekic',['isk','4 adet'],'koseIsk','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','metre'],x:cutUL(c,K)},
    {t:'Lamba ve kulak yuvalarını aç',tools:['freze','daire'],x:`<p>${K('side')} uzun yanların iki ucuna 10 mm lamba aç. ${K('end')} kısa yanların üst iç kenarına çerçeve kulakları için 10 mm genişlik, 16 mm derinlikte yuva frezele. Dış yüzlere tutma oyuğu aç.</p>`},
    {t:'Katları kur',add:['side','end'],tools:['isk','koseIsk','cekic','gonye'],x:`<p>Her kat için yanları tutkallayıp köşe işkencesiyle gönyede tut ve paslanmaz çivilerle çak. ${N} katı aynı ölçüde yap.</p>`},
    {t:'Taban ve kapakları yap',add:['floor','rail','inner','roof','rim'],tools:['matkap','cekic'],x:`<p>${K('floor')} tabanına üç kenardan ${K('rail')} çıtalarını çak; ön taraf giriş olarak açık kalır. ${K('inner')} kapağa havalandırma deliği aç. ${K('roof')} tablasına ${K('rim')} kenarlarını bağla, üstünü galvaniz sacla kapla.</p>`},
    {t:'Boya',tools:['boya'],x:'<p>Yalnız dış yüzeyleri açık renk su bazlı boyayla iki kat boya; içi çıplak kalsın. Boya tamamen kuruyup kokusu gidene kadar arıları yerleştirme.</p>'}];
  return c;
}

/* 68) Tablet ve telefon standı */
function tabletStand(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, sp=o.sp||'ceviz', a=(p.A||70)*Math.PI/180;
  BOX(parts,'base','Taban',LM(sp,20,D),0,0,0,W,20,D);
  const z0=40, top=[W/2,20+H*Math.sin(a),z0+H*Math.cos(a)];
  PART(parts,'back','Sırt',LM(sp,15,W),barRings([W/2,20,z0],top,W,15,[0,Math.cos(a),-Math.sin(a)]),{cut:[R(H),W,15],cutNote:'alt ucu açıyla kesilir, ortasına şarj kablosu oluğu'});
  BOX(parts,'lip','Ön dayama',LM(sp,12,20),0,20,10,W,20,12,{cutNote:'ortası 20 mm kablo için oyulur'});
  const c={parts,hw:[['Keçe ayak','4 adet',''],['Ahşap tutkalı','1 şişe',''],['Kavela 6×30','4 adet','sırt-taban'],['Sert yağ','0,05 L','']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`${W} mm genişlik, ${H} mm sırt, ${R(p.A||70)}° eğim. Telefon dik ya da yatay, ${W>200?'10-11 inç tablet de':'küçük tablet'} durur; kablo ön dayamanın ortasından geçer.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','matkap','dubelSet',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[{t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Birleştir',add:['base','back','lip'],tools:['dubelSet','matkap','isk'],x:`<p>${K('back')} sırtın alt ucunu ${R(p.A||70)}° kes, tabana iki kavela ve tutkalla bağla. ${K('lip')} dayamayı ön kenara yapıştır.</p>`},
    finishStep({})];
  return c;
}

/* 69) Antre askı paneli */
function entryPanel(p,o){
  const parts=[], W=p.W, sp=o.sp||'mese', bk=LM(sp,20,190), sh=LM(sp,20,140), n=Math.max(3,Math.floor((W-60)/150));
  BOX(parts,'back','Arka tahta',bk,0,0,0,W,190,20,{cutNote:'iki gizli askı yuvası'});
  BOX(parts,'shelf','Üst raf',sh,0,190,0,W,20,140);
  for(const x of [30,W-50]) BOX(parts,'bracket','Raf konsolu',LM(sp,20,100),x,90,20,20,100,100,{cutNote:'ön alt köşesi R60 kesilir'});
  spread(n,60,W-60,25).forEach(x=>{const c=[x+12.5,70,20];PART(parts,'peg','Askı kavelası','kav25',cylRings(c,[x+12.5,85,95],12.5,12.5,16),{smooth:true,cut:[95,25,25],cutNote:'15 mm arka tahtaya 10° yukarı açıyla gömülür'});});
  const c={parts,hw:[['Gizli askı aparatı + dübel','2 takım','en az 30 kg'],['Ahşap tutkalı','1 şişe',''],['Vida 4×40','8 adet','raf ve konsollar'],['Sert yağ','0,1 L','']],join:'Tutkal + vida',
    notes:[{t:'tip',x:`${n} kavela askı; üst rafta şapka, eldiven ya da sepet durur. Kask ve sırt çantası için kavelaları 10° yukarı açıyla del.`}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','kalem','terazi','matkap','forstnerSet','aciOlcer',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[{t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Kavela deliklerini aç',tools:['forstnerSet','matkap','aciOlcer'],x:`<p>${K('back')} tahtaya ${n} adet 25 mm deliği 15 mm derinlikte, 10° yukarı açıyla aç; ${K('peg')} kavelaları tutkalla çak.</p>`},
    {t:'Raf ve konsolları tak',add:['shelf','bracket','back','peg'],tools:['matkap','isk'],x:`<p>${K('bracket')} konsolları arka tahtaya, ${K('shelf')} rafı üstlerine tutkal ve vidayla bağla.</p>`},
    finishStep({},'<p>Kuruyunca terazileyerek duvara as.</p>')];
  return c;
}

/* ---------- 2026-11-05 (8): tavla, lamel duvar paneli, makyaj masası, kedi duvar parkuru ---------- */
MAT.inlay={n:'Ahşap kaplama / boya',type:'hw',tone:'inlay'};
MAT.felt={n:'Akustik keçe',type:'hw',tone:'felt'};
Object.assign(TONE,{inlay:[20,45,30],felt:[30,5,18]});

/* 70) Tavla takımı (katlanır) */
function backgammon(p,o){
  const parts=[], A=p.W/2, B=p.D, sp=o.sp||'ceviz', fr=LM(sp,15,40), gap=4;
  for(const h of [0,1]){const x0=h*(A+gap);
    BOX(parts,'bottom','Taban','ply12',x0,0,0,A,12,B,{cutNote:'iç yüzü kaplamalı'});
    for(const z of [0,B-15]) BOX(parts,'flong','Uzun kenar',fr,x0,12,z,A,40,15,{cutNote:'uçları 45° gönye'});
    for(const x of [x0,x0+A-15]) BOX(parts,'fshort','Kısa kenar',fr,x,12,15,15,40,B-30,{cut:[B,40,15],cutNote:'uçları 45° gönye'});
    const w=(A-30)/6, h1=(B-30)*0.4;
    for(let i=0;i<6;i++){const xa=x0+15+i*w;
      PART(parts,'pt','Hane üçgeni','inlay',prism('y',[[xa,15],[xa+w,15],[xa+w/2,15+h1]],12,1),{deco:true});
      PART(parts,'pt','Hane üçgeni','inlay',prism('y',[[xa,B-15],[xa+w,B-15],[xa+w/2,B-15-h1]],12,1),{deco:true});}}
  if(o.pieces) for(let k=0;k<30;k++){const dark=k>=15, col=Math.floor((k%15)/5), lv=k%5, x=dark?2*A+gap-45:45, z=dark?B-60-col*40:60+col*40;
    PART(parts,dark?'pulD':'pulL',dark?'Koyu pul':'Açık pul','kav32',cylRings([x,13+lv*8,z],[x,13+lv*8+8,z],16,16,20),{smooth:true,cut:[8,32,32],cutNote:'Ø32 kavela 8 mm dilimlenir'});}
  const c={parts,hw:[['Küçük menteşe 30 mm (pirinç)','2 adet','iki yarıyı birleştirir'],['Kapama mandalı','1 adet',''],['Taşıma kulpu','1 adet',''],['Zar (16 mm)','2 adet',''],
      ['Hane deseni: ahşap kaplama şeritleri ya da şablonla boya','24 üçgen','iki renk dönüşümlü'],...(o.pieces?[['Ceviz renkli bitirme (koyu pullar)','0,05 L','']]:[]),['Sert yağ','0,1 L','']],join:'Tutkal + gönye',
    notes:[{t:'tip',x:`Açık hâlde ${2*A+gap} × ${B} mm, kapalı ${A} × ${B} × ${2*52} mm. Haneler iki renk dönüşümlü boyanır ya da kaplama şeritlerinden kesilip yapıştırılır.`}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','kalem','matkap',['isk','4 adet'],'kayis','bicak','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Haneleri işle',add:['bottom','pt'],tools:['bicak','metre'],x:`<p>${K('bottom')} tabanların iç yüzüne 24 haneyi işaretle. Kaplama şeritlerinden üçgenleri maket bıçağıyla kesip dönüşümlü renkte yapıştır ya da bantlı şablonla boya.</p>`},
    {t:'Çerçeveyi kur',add:['flong','fshort'],tools:['kayis','isk'],x:`<p>${K('flong')} ve ${K('fshort')} kenarları 45° gönyeyle birleştirip tabanın üstüne yapıştır; kayış işkenceyle sık.</p>`},
    {t:'Menteşe ve mandal',tools:['matkap'],x:'<p>İki yarıyı yan yana koy, ortadaki kenara iki pirinç menteşe, karşı uca mandal ve kulp tak.</p>'},
    ...(o.pieces?[{t:'Pulları yap',add:['pulL','pulD'],tools:['gonyeT','zimKag'],x:'<p>Ø32 kavelayı 8 mm dilimle 30 pul kes, kenarlarını yuvarlat. 15 pulu ceviz renkli bitirmeyle boya.</p>'}]:[]),
    finishStep({})];
  return c;
}

/* 71) Çıtalı (lamel) duvar paneli */
function slatPanel(p,o){
  const parts=[], W=p.W, H=p.H, sp=o.sp||'mese', sw=27, gap=p.G||13, n=Math.floor((W+gap)/(sw+gap)), sl=LLONG(sp,20,sw,H), bat=LLONG('cam',20,45,W);
  const nb=Math.max(2,Math.ceil(H/600)+1);
  spread(nb,0,H,45).forEach(y=>BOX(parts,'batten','Duvar kadrajı',bat,0,y,0,W,45,20,{cutNote:'duvara dübelli'}));
  BOX(parts,'felt','Siyah keçe','felt',0,0,20,W,H,9,{deco:true});
  spread(n,0,W,sw).forEach(x=>BOX(parts,'slat','Lamel çıta',sl,x,0,29,sw,H,20));
  const c={parts,hw:[['Siyah akustik keçe 9 mm',`${dec(R(W*H/1e6*1.05*10)/10)} m²`,'çıtaların arkasına'],['Dübel 6 mm + vida 5×60',nb*Math.ceil(W/500)+' takım','kadrajlar'],['Başsız çivi 1,2×35 ya da vida 3,5×40',n*nb*2+' adet','her çıta her kadraja iki'],
      ['Ahşap tutkalı','1 şişe',''],['Mat su bazlı vernik','1 L',''],...(o.led?[['LED şerit (sıcak beyaz) + adaptör',`${dec(R(W/1000*10)/10)} m`,'üst kadraj arkasına']]:[])],join:'Vida + tutkal',
    notes:[{t:'tip',x:`${n} çıta, ${sw} mm genişlik ve ${gap} mm aralıkla; panel ${W} × ${H} mm. Keçe sesi yutar; TV arkası ve yatak başı için uygun.`},
      {t:'warn',x:'Elektrik ve su tesisatının geçtiği yerleri dedektörle bul, kadrajları oraya vidalama.'}]};
  c.tools=stdTools(['gonyeT','metre','kalem','terazi','matkap','cekic','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Çıtaları hazırla',tools:['zimKag','firca'],x:`<p>${K('slat')} çıtaların ön ve yan yüzlerini 180 kumla zımparala, duvara takmadan önce verniğini sür.</p>`},
    {t:'Kadrajları tak',add:['batten'],tools:['terazi','matkap'],x:`<p>${K('batten')} kadrajlarını ${R(H/(nb-1))} mm arayla terazide duvara dübelle.</p>`},
    {t:'Keçeyi ger',add:['felt'],tools:['cekic'],x:'<p>Siyah keçeyi kadrajların üstüne gergin şekilde zımbala.</p>'},
    {t:'Çıtaları diz',add:['slat'],tools:['matkap','metre'],x:`<p>İlk çıtayı terazide tak; sonrakileri ${gap} mm'lik bir ara takozla dizerek her kadraja iki çiviyle bağla.</p>`,tip:'Ara takozu çıtalardan birinden kes; aralık hiç kaymaz.'}];
  return c;
}

/* 72) Makyaj masası (aynalı) */
function vanity(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, Hm=p.M, sp=o.sp||'mese', lg=LM(sp,45,45), ap=LM(sp,20,95), mf=LM(sp,20,45), dw=Math.min(400,W-300);
  for(const x of [0,W-45]){BOX(parts,'fleg','Ön ayak',lg,x,0,D-45,45,H-20,45);BOX(parts,'bleg','Arka ayak (ayna dikmesi)',LLONG(sp,45,45,H+Hm+40),x,0,0,45,H+Hm+40,45);}
  BOX(parts,'top','Tabla',WORKTOP(sp,20,D-45),0,H-20,45,W,20,D-45,{cutNote:'arka köşeleri ayaklar için'});
  for(const x of [12.5,W-32.5]) BOX(parts,'sap','Yan kuşak',ap,x,H-115,45,20,95,D-90);
  BOX(parts,'bap','Arka kuşak',ap,45,H-115,12.5,W-90,95,20);
  for(const [a,b] of [[45,W/2-dw/2],[W/2+dw/2,W-45]]) BOX(parts,'fap','Ön kuşak',ap,a,H-115,D-32,b-a,95,20);
  BOX(parts,'dfront','Çekmece önü',m18(sp),W/2-dw/2+2,H-113,D-20,dw-4,88,20);
  for(const x of [W/2-dw/2+15,W/2+dw/2-27]) BOX(parts,'dside','Çekmece yanı','ply12',x,H-110,40,12,75,D-62);
  BOX(parts,'dbottom','Çekmece tabanı','ply6',W/2-dw/2+27,H-110,40,dw-54,6,D-62);
  BOX(parts,'dback','Çekmece arkası','ply12',W/2-dw/2+27,H-104,40,dw-54,69,12);
  for(const y of [H+40,H+Hm-5]) BOX(parts,'mrail','Ayna çerçevesi',mf,45,y,0,W-90,45,20);
  BOX(parts,'mirror','Ayna','glass',45,H+85,8,W-90,Hm-90,4,{deco:true});
  const c={parts,hw:[[`Ayna 4 mm (rodajlı)`,`${W-90+20} × ${Hm-90+20} mm`,'çerçeve oluğuna 10 mm girer'],['Çekmece rayı (tam açılır, 350 mm)','1 çift',''],['Kulp','1 adet',''],['Kavela 8×40','16 adet','ayak-kuşak'],
      ['Tabla bağlantı köşebendi','6 adet',''],['Duvar bağlantı köşebendi','2 adet','ayna dikmeleri devrilmesin'],['Su bazlı vernik','0,5 L','']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`Masa ${W} × ${D} mm, yükseklik ${H} mm; ayna ${W-90} × ${Hm-90} mm görünür. Ortada ${dw} mm genişlikte çekmece.`},{t:'warn',x:'Ayna dikmeleri uzun ve üst ağırlıklıdır; masayı mutlaka duvara sabitle.'}]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','matkap','dubelSet','havsa','freze',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire'],x:cutUL(c,K)},
    {t:'Ayna oluğunu aç',tools:['freze'],x:`<p>${K('mrail')} çıtaların ve ${K('bleg')} dikmelerin ayna tarafına 5 mm genişliğinde, 10 mm derinliğinde oluk frezele.</p>`},
    {t:'Gövdeyi kur',add:['fleg','bleg','sap','bap','fap'],tools:['dubelSet','matkap','isk','gonye'],x:`<p>Ayakları ${K('sap')}, ${K('bap')} ve ${K('fap')} kuşaklarla kavela ve tutkalla birleştir; çaprazları eşitle.</p>`},
    {t:'Aynayı tak',add:['mrail','mirror'],tools:['isk','matkap'],x:`<p>Alt ${K('mrail')} çıtayı dikmelere bağla, aynayı oluğa kaydır, üst çıtayı takıp kilitle.</p>`,warn:'Aynayı eldivenle taşı; kenarları rodajlı olsun.'},
    {t:'Çekmece ve tabla',add:['dside','dbottom','dback','dfront','top'],tools:['matkap','havsa'],x:`<p>Çekmece kutusunu kur, rayları kuşaklara tak ve ${K('dfront')} önünü hizala. ${K('top')} tablayı köşebentlerle bağla.</p>`},
    finishStep({})];
  return c;
}
function m18(sp){return LM(sp,20,95);}

/* 73) Kedi duvar parkuru */
function catWall(p,o){
  const parts=[], N=p.N, sw=p.W, sp=o.sp||'cam', sh=LM(sp,28,250), br=LM(sp,20,95);
  for(let i=0;i<N;i++){const x=i*(sw*0.8), y=400+i*320;
    BOX(parts,'step','Basamak rafı',sh,x,y,0,sw,28,250,{cutNote:'köşeler R30'});
    BOX(parts,'bracket','Gizli konsol çıtası',br,x+20,y-95,0,sw-40,95,20,{cutNote:'duvara dübelli'});}
  const c={parts,hw:[['Kaydırmaz halı ya da sisal kaplama',`${N} parça, ${sw} × 250 mm`,'basamak üstlerine'],['L konsol (gizli, 200 mm)',N*2+' adet','her basamağa iki'],['Dübel 8 mm + vida 5×60',N*4+' takım',''],['Ahşap tutkalı','1 şişe','']],join:'Konsol + dübel',
    notes:[{t:'tip',x:`${N} basamak, aralarında yatayda ${R(sw*0.8)} mm, dikeyde 320 mm. İlk basamak yerden 400 mm. Kedinin rahat atlaması için 350 mm'den fazla yükseklik farkı bırakma.`},
      {t:'warn',x:'Basamakları yalnız beton ya da tuğla duvara bağla; her basamak en az 15 kg taşımalı. Pencere ve sıcak yüzeylerden uzak tut.'}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','kalem','terazi','matkap','zimKag','firca']);
  c.mkSteps=K=>[{t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Kaplama',tools:['zimKag'],x:`<p>${K('step')} basamakların köşelerini yuvarlat, üstlerine kaydırmaz halı ya da sisal yapıştır.</p>`},
    {t:'Duvara as',add:['bracket','step'],tools:['terazi','matkap','metre'],x:`<p>Basamak yerlerini duvara işaretle. ${K('bracket')} çıtalarını ve L konsolları dübelle, basamakları konsolların üstüne alttan vidala.</p>`}];
  return c;
}

/* ---------- 2026-11-05 (9): bahçe kapısı, yapboz, dergilik, tabak süzgeci, çamaşır kurutmalığı ---------- */
MAT.kav12={n:'Kavela çubuk Ø12 (kayın)',type:'lumber',w:12,t:12,L:1000,tone:'beech'};

/* 74) Bahçe kapısı (Z kayıtlı) */
function gardenGate(p,o){
  const parts=[], W=p.W, H=p.H, sp=o.sp||'emp', fr=LM(sp,45,70), sl=LM(sp,20,95), vert=o.slat!=='yatay';
  for(const x of [0,W-70]) BOX(parts,'stile','Dikey kayıt',fr,x,0,0,70,H,45);
  for(const y of [0,H-70]) BOX(parts,'rail','Yatay kayıt',fr,70,y,0,W-140,70,45);
  const b0=[105,70,22.5], b1=[W-105,H-70,22.5], bl=R(Math.hypot(b1[0]-b0[0],b1[1]-b0[1])+60);
  PART(parts,'brace','Çapraz destek',fr,barRings(b0,b1,70,45,[0,0,1]),{cut:[bl,70,45],cutNote:'uçları kayıtlara oturacak açıyla'});
  let n;
  if(vert){n=Math.max(2,Math.floor((W+15)/110));spread(n,0,W,95).forEach(x=>BOX(parts,'slat','Dikey tahta',sl,x,0,45,95,H,20));}
  else{n=0;for(let y=0;y+95<=H;y+=110){BOX(parts,'slat','Yatay tahta',sl,0,y,45,W,95,20);n++;}}
  const c={parts,hw:[['Kapı menteşesi (T tipi, galvaniz, 300 mm)','2 adet','çapraz destek menteşe tarafında alttan başlar'],['Bahçe kapısı mandalı (kendinden kilitli)','1 takım',''],['Kapı stoperi (dikmeye)','1 adet',''],
      ['Paslanmaz vida 4,5×50','1 kutu',''],['Dış mekân ahşap yağı',`${Math.max(1,Math.ceil(W*H/1e6))} L`,'2 kat, her iki yüz']],join:'Vida + tutkal (dış mekân)',
    notes:[{t:'tip',x:`Kanat ${W} × ${H} mm; kapı boşluğu ${W+20} mm olmalı (menteşe ve mandal tarafında 10'ar mm). ${n} ${vert?'dikey':'yatay'} tahta, aralar 15 mm.`},
      {t:'warn',x:'Çapraz destek mutlaka menteşe tarafının altından mandal tarafının üstüne doğru gitmeli; ters takılırsa kanat zamanla sarkar.'}]};
  c.tools=stdTools(['gonyeT','daire','aciOlcer','metre','gonye','kalem','terazi','matkap','havsa',['isk','4 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','daire'],x:cutUL(c,K)},
    {t:'Çerçeveyi kur',add:['stile','rail'],tools:['matkap','havsa','gonye','isk'],x:`<p>${K('stile')} ve ${K('rail')} kayıtları düz bir zeminde dikdörtgen olarak dizip tutkal ve iki vidayla birleştir; köşegenleri ölçerek gönyesini al.</p>`},
    {t:'Çapraz desteği yerleştir',add:['brace'],tools:['aciOlcer','gonyeT','matkap'],x:`<p>${K('brace')} desteği çerçevenin üstüne yatır, uç açılarını kayıtlardan işaretle ve kes. Menteşe tarafının altından mandal tarafının üstüne gelecek şekilde vidala.</p>`},
    {t:'Tahtaları çak',add:['slat'],tools:['matkap','metre'],x:`<p>${K('slat')} tahtaları 15 mm ara takozuyla diz, her tahtayı her kayıta ve desteğe ikişer vidayla bağla.</p>`},
    {t:'Kapıyı as',tools:['terazi','matkap'],x:'<p>Kanadı boşluğa 10 mm takozların üstüne koy, menteşeleri dikmeye vidala. Mandalı ve stoperi tak, kapıyı açıp kapatarak ayarla.</p>'},
    finishStep({outdoor:1})];
  return c;
}

/* 75) Ahşap yapboz (çerçeveli) */
function jigsaw(p,o){
  const parts=[], W=p.W, D=p.D, N=p.N, tray=o.tray!==false, f=tray?20:0, iw=W-2*f, id=D-2*f;
  const nx=Math.max(2,Math.round(Math.sqrt(N*iw/id))), nz=Math.max(2,Math.ceil(N/nx)), pw=R(iw/nx), pd=R(id/nz), y0=tray?6:0;
  if(tray){BOX(parts,'base','Taban','ply6',0,0,0,W,6,D);
    for(const z of [0,D-f]) BOX(parts,'frL','Çerçeve (uzun)','ply6',0,6,z,W,6,f);
    for(const x of [0,W-f]) BOX(parts,'frS','Çerçeve (kısa)','ply6',x,6,f,f,6,D-2*f);}
  BOX(parts,'blank','Yapboz levhası','ply6',f,y0,f,iw,6,id,{cutNote:`${nx*nz} parçaya dekupajla bölünür`});
  for(let i=1;i<nx;i++) BOX(parts,'line','Kesim çizgisi','inlay',f+i*iw/nx-0.5,y0+6,f,1,0.4,id,{deco:true});
  for(let j=1;j<nz;j++) BOX(parts,'line','Kesim çizgisi','inlay',f,y0+6,f+j*id/nz-0.5,iw,0.4,1,{deco:true});
  const c={parts,hw:[['Resim baskısı (mat kâğıt) ya da çocuğun çizimi',`${iw} × ${id} mm`,'levhaya yapıştırılır'],['Dekupaj tutkalı / ahşap tutkalı','1 şişe','ince ve eşit sürülür'],
      ['Dekupaj bıçağı (ince, 15-20 diş)','3 adet','yedekli'],['Oyuncağa uygun (EN 71-3) su bazlı vernik','0,1 L','resmin üstüne']],join:'Tutkal',
    notes:[{t:'tip',x:`${nx} × ${nz} = ${nx*nz} parça, her parça yaklaşık ${pw} × ${pd} mm. ${tray?'Çerçeveli tepsi parçaları bir arada tutar; çocuk için kenarlar yol gösterir.':'Çerçevesiz düz yapboz.'}`},
      {t:'warn',x:pw<45||pd<45?'Parçalar 45 mm\'den küçük: 3 yaş altı çocuklar yutabilir, onlara verme.':'3 yaş altı için parçaların 45 mm\'den küçük olmamasına dikkat et; kenarları iyice zımparala.'}]};
  c.tools=stdTools(['dekupaj','metre','gonye','kalem','bicak',['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['dekupaj','metre'],x:cutUL(c,K)},
    {t:'Resmi yapıştır',add:['blank'],tools:['bicak','isk'],x:`<p>${K('blank')} levhaya tutkalı ince sür, resmi kabarcık kalmayacak şekilde ortadan dışa doğru yapıştır. Üstüne kâğıt ve düz bir tahta koyup bir gece işkenceyle bastır; taşan kâğıdı maket bıçağıyla kes.</p>`},
    {t:'Parçaları kes',add:['line'],tools:['dekupaj','kalem'],x:`<p>Levhanın arkasına ${nx} × ${nz} ızgarayı çiz, her çizgiye bir geçme (yuvarlak dil) ekle. Önce tüm uzun çizgileri, sonra kısa çizgileri ince dekupaj bıçağıyla yavaşça kes.</p>`,tip:'Levhanın altına koli bandı yapıştırırsan alt yüzde kıymık kalkmaz.'},
    ...(tray?[{t:'Tepsiyi kur',add:['base','frL','frS'],tools:['isk'],x:`<p>${K('frL')} ve ${K('frS')} çerçeve parçalarını ${K('base')} tabanın kenarlarına tutkalla yapıştır, işkenceyle sık.</p>`}]:[]),
    {t:'Zımpara ve vernik',tools:['zimKag','firca'],x:'<p>Parçaların kesim kenarlarını 240 kumla hafifçe kır. Resmin üstüne oyuncağa uygun su bazlı verniği ince sür; parçalar birbirine yapışmasın diye ayrı ayrı kurut.</p>'}];
  return c;
}

/* 76) Dergilik */
function magRack(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, sp=o.sp||'mese', end=WORKTOP(sp,20,D), iw=W-40;
  for(const x of [0,W-20]) BOX(parts,'end','Yan panel',end,x,0,0,20,H,D,{cutNote:'üst köşeler R40, tutamak deliği Ø25'});
  BOX(parts,'bottom','Taban',WORKTOP(sp,20,D-40),20,40,20,iw,20,D-40);
  BOX(parts,'div','Orta bölme','ply12',20,60,D/2-6,iw,H-140,12);
  for(const z of [5,D-25]) for(const y of [R(H*0.4),R(H*0.7)]) BOX(parts,'rod','Yan çubuk','kav20',20,y,z,iw,20,20,{cut:[iw+20,20,20]});
  BOX(parts,'handle','Tutamak çubuğu','kav25',20,H-55,D/2-12.5,iw,25,25,{cut:[iw+20,25,25]});
  const c={parts,hw:[['Kavela 8×35','8 adet','taban-yan panel'],['Vida 4×30','8 adet','orta bölme'],['Kaydırmaz keçe ayak','4 adet',''],['Sert yağ ya da vernik','0,25 L','']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`${W} × ${D} mm, yükseklik ${H} mm. Orta bölme iki göz oluşturur; yan çubuklar dergilerin kaymasını önler, tutamakla taşınır.`}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','gonye','kalem','pergel','matkap','dubelSet','forstnerSet',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Yan panelleri şekillendir',add:['end'],tools:['pergel','dekupaj','forstnerSet'],x:`<p>${K('end')} panellerin üst köşelerini R40 yuvarlat. Çubuk ve tutamak yerlerini işaretleyip 20 ve 25 mm Forstner uçla 10 mm derinlikte yuva aç; orta bölme için iç yüze 12 mm oluk aç ya da vida yeri işaretle.</p>`},
    {t:'Birleştir',add:['bottom','div','rod','handle'],tools:['dubelSet','matkap','isk'],x:`<p>${K('bottom')} tabanı kavelayla bir panele tak, ${K('div')} bölmeyi, ${K('rod')} çubukları ve ${K('handle')} tutamağı tutkallı yuvalara oturt. İkinci paneli kapat ve işkenceyle sık.</p>`},
    finishStep({})];
  return c;
}

/* 77) Tabak süzgeci */
function dishRack(p,o){
  const parts=[], W=p.W, D=p.D, sp=o.sp||'kayin', ft=LM(sp,20,45), rl=LM(sp,20,45), n=Math.max(4,Math.floor((W-40)/35)), zs=[20,D-65];
  for(const x of [0,W-45]) BOX(parts,'foot','Ayak',ft,x,0,0,45,20,D,{cutNote:'alt kenarı suya karşı 2 mm pahlı'});
  for(const z of zs) BOX(parts,'rail','Kuşak',rl,0,20,z,W,20,45);
  const xs=spread(n,25,W-25,12);
  xs.forEach(x=>{BOX(parts,'pegH','Uzun çubuk','kav12',x,40,zs[0]+16.5,12,130,12,{cut:[145,12,12],cutNote:'15 mm yuvaya girer'});
    BOX(parts,'pegL','Kısa çubuk','kav12',x,40,zs[1]+16.5,12,80,12,{cut:[95,12,12],cutNote:'15 mm yuvaya girer'});});
  const c={parts,hw:[['Damlama tepsisi (silikon ya da paslanmaz)',`${W} × ${D} mm`,'altına'],['Su geçirmez tutkal (D3)','1 şişe',''],['Gıdaya uygun mineral yağ','0,1 L','ayda bir tazele']],join:'Tutkal + yuva',
    notes:[{t:'tip',x:`${n} tabak yuvası, çubuk aralığı ${R((W-62)/(n-1))} mm. Tabaklar uzun çubuklara yaslanır, kısa sıra küçük tabak ve kesme tahtası tutar.`},
      {t:'warn',x:'Sürekli ıslak kalacağı için kayın, meşe ya da akçaağaç kullan; çamda küf yapar. Vernik değil yağ sür.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap',['forstnerSet','12 mm uç'],'isk','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Çubuk yuvalarını del',add:['rail'],tools:['matkap','kalem','metre'],x:`<p>İki ${K('rail')} kuşağı yan yana işkencele, ${R((W-62)/(n-1))} mm arayla ortalarına ${n} yuva işaretle. 12 mm uçla 15 mm derinlikte del; uca derinlik bandı sar.</p>`,tip:'Uzun çubuk sırasındaki yuvaları dışa doğru 10° eğik delersen tabaklar daha rahat yaslanır.'},
    {t:'Kur',add:['foot','pegH','pegL'],tools:['isk','gonye'],x:`<p>Kuşakları ${K('foot')} ayaklara tutkalla bağla. ${K('pegH')} çubukları arka, ${K('pegL')} çubukları ön kuşağa su geçirmez tutkalla çak.</p>`},
    finishStep({food:1})];
  return c;
}

/* 78) Duvara katlanır çamaşır kurutmalığı */
function dryingRack(p,o){
  const parts=[], W=p.W, H=p.H, sp=o.sp||'cam', st=LM(sp,20,45), Lr=H-60, n=Math.max(3,Math.floor(Lr/80));
  for(const x of [0,W-45]) BOX(parts,'stile','Duvar dikmesi',st,x,0,0,45,H,20);
  for(const y of [0,H-45]) BOX(parts,'wrail','Duvar kuşağı',st,45,y,0,W-90,45,20);
  for(const x of [0,W-20]) BOX(parts,'arm','Açılır kol',st,x,0,20,20,45,Lr,{cutNote:'uç köşesi yuvarlatılır'});
  spread(n,40,Lr,20).forEach(z=>BOX(parts,'rod','Askı çubuğu','kav20',20,12,20+z,W-40,20,20,{cut:[W-20,20,20],cutNote:'10 mm yuvaya girer'}));
  for(const x of [10,W-10]) chain(parts,[x,45,20+Lr-10],[x,H-20,20],'steel');
  const c={parts,hw:[['Menteşe 50 mm','2 adet','kolların dibi'],['Hafif zincir (askı)',`2 × ${R(Math.hypot(Lr,H-65)+50)} mm`,'kolu yatayda tutar'],['Zincir kancası + vida halkası','4 adet',''],
      ['Kapama mandalı (mıknatıslı)','1 adet','kapalıyken tutar'],['Dübel 6 mm + vida 5×50','4 takım',''],['Su bazlı vernik','0,25 L','']],join:'Kavela yuvası + menteşe',
    notes:[{t:'tip',x:`${W} × ${H} mm duvar çerçevesi; açılınca ${Lr} mm dışarı çıkar. ${n} çubuk, toplam ${dec(R(n*(W-40)/100)/10)} m asma yeri. Kapanınca çerçevenin içine yatar.`},
      {t:'warn',x:'Islak çamaşır ağırdır (10 kg\'a kadar); çerçeveyi alçıpana değil, duvardaki dolu bölüme ya da dikmeye dübelle.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','terazi','matkap',['forstnerSet','20 mm uç'],['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Çerçeveyi kur',add:['stile','wrail'],tools:['matkap','gonye','isk'],x:`<p>${K('stile')} dikmeleri ve ${K('wrail')} kuşakları tutkal ve vidayla dikdörtgen olarak birleştir.</p>`},
    {t:'Açılır rafı kur',add:['arm','rod'],tools:['forstnerSet','matkap','isk'],x:`<p>İki ${K('arm')} kolu yan yana işkencele, ${n} çubuk yerini işaretle, 20 mm uçla 10 mm derinlikte del. ${K('rod')} çubukları tutkalla yuvalara oturt.</p>`},
    {t:'Menteşe ve zincir',add:['chain'],tools:['matkap','metre'],x:'<p>Kolların dibini alt kuşağa menteşeyle bağla. Kolların ucuna ve üst kuşağa vida halkası tak, zinciri kol yatay olacak boyda kancala. Üste mıknatıslı mandalı yerleştir.</p>'},
    {t:'Duvara as',tools:['terazi','matkap'],x:'<p>Çerçeveyi terazide duvara dört noktadan dübelle; açıp kapatarak dene.</p>'},
    finishStep({})];
  return c;
}

/* ---------- 2026-11-05 (10): mama sandalyesi, sallanan sandalye, ütü masası, şemsiyelik, gitar standı ---------- */

/* 79) Mama sandalyesi (tablalı, açık ayaklı) */
function highChair(p,o){
  const parts=[], W=p.W, H=p.H, D=R(W*0.95), sp=o.sp||'kayin', lg=LM(sp,40,40), rl=LM(sp,20,45), sf=75, tray=o.top!==false;
  const leg=(x,z,dx,dz)=>PART(parts,'leg','Açık ayak',lg,barRings([x+dx*sf,0,z+dz*sf],[x,H-20,z],40,40,[1,0,0]),{cut:[R(Math.hypot(H-20,sf*Math.SQRT2))+30,40,40],cutNote:'iki ucu da bileşik açıyla kesilir'});
  leg(20,20,-1,-1);leg(W-20,20,1,-1);leg(20,D-20,-1,1);leg(W-20,D-20,1,1);
  const at=y=>sf*(1-y/(H-20)), ys=160;
  for(const [a,b] of [[[20-at(ys),ys,20-at(ys)],[20-at(ys),ys,D-20+at(ys)]],[[W-20+at(ys),ys,20-at(ys)],[W-20+at(ys),ys,D-20+at(ys)]],[[20-at(ys),ys,20-at(ys)],[W-20+at(ys),ys,20-at(ys)]]])
    PART(parts,'str','Alt kuşak',rl,barRings(a,b,45,20,[0,1,0]),{cut:[R(v3.len(v3.sub(b,a)))+40,45,20]});
  const fy=H-300, x0=40-at(fy);
  BOX(parts,'foot','Ayak basamağı',rl,x0,fy,D-42.5+at(fy),W-2*x0,18,45,{cut:[R(W-2*x0+40),45,20],cutNote:'uçları ayaklara 20 mm geçer'});
  BOX(parts,'seat','Oturak',WORKTOP(sp,20,D),0,H-20,0,W,20,D,{cutNote:'ön kenarı R10 yuvarlatılır'});
  for(const x of [0,W-30]) BOX(parts,'post','Sırt dikmesi',rl,x,H,0,30,380,30,{cut:[380,45,20],cutNote:'45 mm\'den 30 mm\'ye kes'});
  for(const y of [H+120,H+230,H+340]) BOX(parts,'backS','Sırt çıtası',rl,30,y,5,W-60,40,20,{cut:[W-60,45,20]});
  for(const x of [0,W-30]){BOX(parts,'apost','Kolçak dikmesi',rl,x,H,D-75,30,200,30,{cut:[200,45,20]});
    BOX(parts,'arm','Kolçak',rl,x-5,H+200,30,40,20,D-30,{cut:[D-30,45,20]});}
  if(tray){BOX(parts,'tray','Tabla','ply12',-30,H+220,D-140,W+60,12,300,{cutNote:'köşeler R40'});
    BOX(parts,'lip','Tabla kenarı',rl,-30,H+232,D+140,W+60,20,20,{cut:[W+60,45,20]});}
  const c={parts,hw:[['5 noktalı emniyet kemeri (EN 14988)','1 takım','sırta ve oturağa vidalanır'],['Mobilya cıvatası M6×60 + gömme somun','8 takım','ayak-oturak'],['Kaydırmaz ayak pabucu','4 adet',''],
      ...(tray?[['Tabla kilidi (sürgülü mandal)','2 adet','tabla kolçaklara oturur, çıkarılabilir']]:[]),['Oyuncağa uygun (EN 71-3) su bazlı vernik','0,25 L','']],join:'Cıvata + kavela + tutkal',
    notes:[{t:'tip',x:`Oturak yüksekliği ${H} mm (75 cm masaya uygun). Ayaklar her yöne ${sf} mm açılır; taban ${R(W+2*sf)} × ${R(D+2*sf)} mm, devrilmeye karşı geniş durur.`},
      {t:'warn',x:'Bebeği emniyet kemeri takılmadan oturtma, yanından ayrılma. Tüm kenarları yuvarlat, vida başı ve kıymık bırakma; boya yerine oyuncağa uygun vernik kullan.'}]};
  c.tools=stdTools(['gonyeT','aciOlcer','metre','gonye','kalem','matkap','dubelSet','havsa',['isk','4 adet'],'freze','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Oturağı ve ayakları birleştir',add:['seat','leg'],tools:['matkap','aciOlcer','isk'],x:`<p>${K('seat')} oturağı ters çevir. Köşelerden 20 mm içeride, köşegene doğru açılı ${K('leg')} ayak yuvalarını işaretle. Ayakları cıvata ve gömme somunla bağla; her ayak dışa ${sf} mm açılmalı.</p>`},
    {t:'Kuşak ve basamak',add:['str','foot'],tools:['matkap','metre'],x:`<p>${K('str')} kuşakları yerden ${ys} mm yükseklikte ayakların iç yüzüne tutkal ve vidayla bağla. ${K('foot')} basamağı oturağın ${H-fy} mm altına, ön ayakların arasına yerleştir.</p>`},
    {t:'Sırt ve kolçaklar',add:['post','backS','apost','arm'],tools:['dubelSet','matkap','isk'],x:`<p>${K('post')} sırt dikmelerini ve ${K('apost')} kolçak dikmelerini oturağa kavelayla tak. ${K('backS')} sırt çıtalarını dikmelerin arasına, ${K('arm')} kolçakları dikmelerin üstüne tutkalla oturt.</p>`},
    ...(tray?[{t:'Tablayı yap',add:['tray','lip'],tools:['freze','matkap'],x:`<p>${K('tray')} tablanın köşelerini yuvarlat, ${K('lip')} kenarı öne yapıştır. Alttan iki sürgülü mandal tak; tabla kolçaklara oturup kilitlenmeli.</p>`}]:[]),
    {t:'Emniyet kemeri',tools:['matkap'],x:'<p>Kemerin omuz kayışlarını sırt çıtalarına, bel ve bacak kayışını oturağa üreticinin vidasıyla bağla; çekerek dene.</p>'},
    finishStep({},'<p>Bitişte yalnızca oyuncağa uygun (EN 71-3) vernik ya da gıdaya uygun yağ kullan.</p>')];
  return c;
}

/* 80) Sallanan sandalye (kızaklı) */
function rocker(p,o){
  const parts=[], W=p.W, Lr=p.L, SH=p.H, sp=o.sp||'mese', lg=LM(sp,45,45), fk=LM(sp,28,95), sk=LM(sp,20,95), rk=LM(sp,28,195), Rr=1100, arms=o.arms!==false;
  const zc=Lr/2, yb=z=>Rr-Math.sqrt(Rr*Rr-(z-zc)*(z-zc)), top=z=>yb(z)+70, zb=zc-240, zf=zc+195;
  const poly=[];for(let i=0;i<=16;i++){const z=Lr*i/16;poly.push([z,yb(z)]);}for(let i=16;i>=0;i--){const z=Lr*i/16;poly.push([z,top(z)]);}
  for(const x of [8.5,W-36.5]) PART(parts,'runner','Kızak',rk,prism('x',poly,x,28),{cut:[Lr+20,195,28],cutNote:`R${Rr} yay şablonla kesilir`});
  for(const x of [0,W-45]) BOX(parts,'legF','Ön ayak',lg,x,R(top(zf+22.5)),zf,45,R(SH+(arms?200:-20)-top(zf+22.5)),45,{cutNote:'alt ucu kızağa göre yay kesilir'});
  const A=deg(p.BA||15), tA=Math.tan(A), BL=620, z0=zb+22.5+(SH-67-top(zb+22.5))*tA, yB=R(top(z0)), lz=y=>zb+22.5-(y-SH+67)*tA;
  for(const x of [22.5,W-22.5]) PART(parts,'legB','Arka ayak (eğik)',lg,barRings([x,yB,lz(yB)],[x,SH+BL*Math.cos(A),lz(SH+BL*Math.cos(A))],45,45,[1,0,0]),{cut:[R((SH+BL-yB)/Math.cos(A))+20,45,45],cutNote:`${p.BA||15}° geriye yatık`});
  for(const x of [45,W-73]) BOX(parts,'sideR','Yan kasa',fk,x,SH-115,zb+45,28,95,zf-zb-45);
  BOX(parts,'fbR','Ön/arka kasa',fk,73,SH-115,zf-28,W-146,95,28);BOX(parts,'fbR','Ön/arka kasa',fk,73,SH-115,zb+45,W-146,95,28);
  const ns=Math.max(3,Math.floor((zf-zb-45+8)/103));
  spread(ns,zb+45,zf,95).forEach(z=>BOX(parts,'seatS','Oturma çıtası',sk,45,SH-20,z,W-90,20,95));
  const dir=[0,Math.cos(A),-Math.sin(A)], nf=[0,Math.sin(A),Math.cos(A)], nb=Math.max(3,Math.floor((BL-100)/105)), J=[0,SH+22.5*Math.sin(A),lz(SH)+22.5*Math.cos(A)];
  spread(nb,80,BL-20,95).forEach(s0=>{const C=v3.add(v3.add(J,v3.mul(dir,s0+47.5)),v3.mul(nf,10));
    const pts=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const P=v3.add(v3.add(C,v3.mul(dir,a*47.5)),v3.mul(nf,b*10));return[P[2],P[1]];});
    PART(parts,'backS','Sırt çıtası',sk,prism('x',pts,45,W-90),{cut:[W-90,95,20]});});
  if(arms) for(const x of [-25,W-70]) BOX(parts,'arm','Kolçak',fk,x,SH+200,zb+20,95,28,zf-zb+70,{cut:[zf-zb+70,95,28]});
  const c={parts,hw:[['Mobilya cıvatası M8×100 + gömme somun','8 takım','ayak-kasa ve ayak-kızak'],['Kavela 10×50','8 adet','ayak-kızak'],['Ahşap tutkalı','1 şişe',''],['Sert yağ ya da vernik','0,5 L',''],['Keçe şerit (kızak altına)',`2 × ${Lr} mm`,'parkeyi çizmez']],join:'Cıvata + kavela + tutkal',
    notes:[{t:'tip',x:`Kızaklar ${Lr} mm uzun, R${Rr} yarıçaplı; ${ns} oturma, ${nb} sırt çıtası. Oturak yüksekliği ${SH} mm, sırt ${p.BA||15}° geriye yatık.`},
      {t:'warn',x:'İki kızak aynı şablondan, birbirinin tıpatıp aynısı kesilmeli; yoksa sandalye yan yatarak sallanır. Arkaya devrilmeyi önlemek için kızakların arka ucu sırtın gerisine uzanmalı.'}]};
  c.tools=stdTools(['gonyeT','dekupaj','aciOlcer','metre','gonye','kalem','pergel','matkap','dubelSet','havsa',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'Kızakları şablonla kes',add:['runner'],tools:['pergel','dekupaj','zimMak'],x:`<p>İnce kontrplaktan R${Rr} yarıçaplı, ${Lr} mm boyunda bir kızak şablonu çiz (uzun bir çıtayı pergel gibi kullan). Şablonu iki ${K('runner')} tahtasına çiz, dekupajla kes. İkisini işkenceyle üst üste sıkıp zımparayla eşitle.</p>`,tip:'Şablonun alt kenarını zemine koyup salla; düz ve akıcı sallanıyorsa kızağa geç.'},
    {t:'Yan çerçeveleri kur',add:['legF','legB','sideR'],tools:['matkap','isk','aciOlcer'],x:`<p>Bir ${K('legF')} ön ve bir ${K('legB')} arka ayağı yere yatır. ${K('sideR')} yan kasayı üst kenarı oturak yüksekliğinin 20 mm altında olacak şekilde iki ayağa cıvatayla bağla. İkinci yanı aynısı olarak kur.</p>`},
    {t:'Kasaları ve çıtaları bağla',add:['fbR','seatS','backS'],tools:['matkap','havsa','metre'],x:`<p>${K('fbR')} ön ve arka kasalarla iki yanı birleştir. ${ns} ${K('seatS')} oturma çıtasını kasalara, ${nb} ${K('backS')} sırt çıtasını arka ayakların ön yüzüne ikişer vidayla bağla.</p>`},
    {t:'Kızaklara oturt',tools:['matkap','dubelSet','isk'],x:`<p>Ayakların alt uçlarını kızağın yayına göre işaretleyip kes. Sandalyeyi kızaklara oturt; her ayağı bir kavela ve bir cıvatayla kızağa bağla. Düz zeminde dene: dik otururken öne ya da arkaya kaçmamalı.</p>`},
    ...(arms?[{t:'Kolçaklar',add:['arm'],tools:['matkap'],x:`<p>${K('arm')} kolçakları ön ayakların üstüne ve arka ayağın yan yüzüne vidala, kenarlarını yuvarlat.</p>`}]:[]),
    finishStep({})];
  return c;
}

/* 81) Duvara katlanır ütü masası (dolaplı) */
function ironCabinet(p,o){
  const parts=[], W=p.W, H=p.H, D=140, Y0=820, m=o.mat||'ply18', Lb=H-36-240, B=Math.min(W-40,380);
  for(const x of [0,W-18]) BOX(parts,'side','Yan',m,x,Y0,0,18,H,D);
  for(const y of [Y0,Y0+H-18]) BOX(parts,'tb','Alt / üst',m,18,y,0,W-36,18,D);
  BOX(parts,'back','Arkalık','ply6',18,Y0+18,0,W-36,H-36,6);
  BOX(parts,'shelf','Ütü rafı',m,18,Y0+H-18-220,6,W-36,18,D-6,{cutNote:'ön kenarına 30 mm çıta tutkallanır'});
  BOX(parts,'board','Ütü tahtası',m,(W-B)/2,Y0+18,D+20,B,18,Lb,{cutNote:'uç 250 mm boyunca 220 mm\'ye daralır'});
  BOX(parts,'cover','Ütü kılıfı (keçe + kumaş)','fabric',(W-B)/2,Y0+36,D+20,B,6,Lb,{deco:true});
  const lz=D+20+R(Lb*0.55);
  PART(parts,'leg','Destek ayağı',LM('kayin',28,45),barRings([W/2,Y0+18,lz],[W/2,Y0-420,30],45,28,[1,0,0]),{cut:[R(Math.hypot(438,lz-30))+30,45,28],cutNote:'uçlar açılı'});
  BOX(parts,'stop','Duvar takozu',LM('kayin',28,45),W/2-40,Y0-460,0,80,45,28,{cut:[80,45,28]});
  BOX(parts,'door','Kapak',m,-18,Y0,D,18,H,W,{cutNote:'açık konumda (90°)'});
  const c={parts,hw:[['Ütü masası menteşesi (kilitli, katlanır)','1 çift','tahtanın dibi'],['Kapak menteşesi 35 mm (yarım bindirme)','3 adet',''],['Mıknatıslı kapak tutucu','2 adet',''],['Ütü kılıfı (keçe + pamuklu)',`${B} × ${Lb} mm`,'ısıya dayanıklı'],
      ['Isıya dayanıklı askı kancası','2 adet','ütü kablosu için'],['Dübel 8 mm + vida 6×70','4 takım','duvara'],['Su bazlı vernik ya da boya','0,5 L','']],join:'Konfirmat + tutkal',
    notes:[{t:'tip',x:`Dolap ${W} × ${H} × ${D} mm, alt kenarı yerden ${Y0} mm. Açılınca tahta ${B} × ${Lb} mm, çalışma yüksekliği yaklaşık ${Y0+42} mm. Üstteki rafta ütü durur.`},
      {t:'warn',x:'Ütü sıcakken kapağı kapatma. Dolabı alçıpana değil, dolu duvara ya da dikmeye dübelle; açık tahtaya ağırlık verme.'}]};
  c.tools=stdTools(['daire','dekupaj','metre','gonye','kalem','terazi','matkap','havsa',['forstnerSet','35 mm uç'],['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj'],x:cutUL(c,K)},
    {t:'Gövdeyi kur',add:['side','tb','back','shelf'],tools:['matkap','havsa','gonye','isk'],x:`<p>${K('side')} yanları ${K('tb')} alt ve üst parçalarla konfirmatla birleştir. ${K('back')} arkalığı yuvaya ya da çiviyle tak, köşegenleri eşitle. ${K('shelf')} rafı üstten 220 mm aşağıya yerleştir.</p>`},
    {t:'Ütü tahtası',add:['board','cover'],tools:['dekupaj','zimKag'],x:`<p>${K('board')} tahtanın uç 250 mm'sini daraltarak kes, kenarlarını yuvarlat. Kılıfı keçeyle birlikte ger, alttan zımbala. Tahtayı alt parçaya ütü masası menteşesiyle bağla.</p>`},
    {t:'Destek ayağı',add:['leg','stop'],tools:['matkap','metre'],x:`<p>${K('leg')} ayağı tahtanın altına menteşeyle bağla. Ayağın duvara bastığı yere ${K('stop')} takozu vidala; tahta açıkken terazide olmalı.</p>`},
    {t:'Kapak ve duvar montajı',add:['door'],tools:['forstnerSet','terazi','matkap'],x:`<p>${K('door')} kapağa 35 mm uçla üç menteşe yuvası aç, kapağı tak. Dolabı terazide duvara dört noktadan dübelle; tahtayı açıp kapatarak dene.</p>`},
    finishStep(m==='mdf18'?{paint:1}:{})];
  return c;
}

/* 82) Şemsiyelik */
function umbrellaStand(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, sp=o.sp||'mese', lg=LM(sp,35,35), rl=LM(sp,20,60), sl=LM(sp,15,40);
  for(const x of [0,W-35]) for(const z of [0,D-35]) BOX(parts,'leg','Köşe ayağı',lg,x,0,z,35,H,35);
  for(const y of [60,H-60]){
    for(const z of [0,D-20]) BOX(parts,'railL','Ön/arka kuşak',rl,35,y,z,W-70,60,20);
    for(const x of [0,W-20]) BOX(parts,'railS','Yan kuşak',rl,x,y,35,20,60,D-70);}
  const sh=H-180, nF=Math.max(2,Math.floor((W-70+25)/65)), nS=Math.max(2,Math.floor((D-70+25)/65));
  for(const z of [2.5,D-17.5]) spread(nF,35,W-35,40).forEach(x=>BOX(parts,'slatL','Ön/arka çıta',sl,x,120,z,40,sh,15));
  for(const x of [2.5,W-17.5]) spread(nS,35,D-35,40).forEach(z=>BOX(parts,'slatS','Yan çıta',sl,x,120,z,15,sh,40));
  BOX(parts,'bottom','Taban','ply12',35,48,20,W-70,12,D-40,{cutNote:'yan kuşak köşelerinden kertilir'});
  BOX(parts,'tray','Damlama tepsisi (çinko / plastik)','steel',40,60,25,W-80,20,D-50);
  const nd=Math.max(1,Math.round(W/120)-1);
  Array.from({length:nd},(_,i)=>20+(W-40)*(i+1)/(nd+1)-10).forEach(x=>BOX(parts,'div','Bölme çubuğu','kav20',x,H-40,20,20,20,D-40,{cut:[D-30,20,20],cutNote:'5 mm yuvaya girer'}));
  BOX(parts,'divL','Boyuna çubuk','kav20',20,H-60,D/2-10,W-40,20,20,{cut:[W-30,20,20],cutNote:'5 mm yuvaya girer'});
  const c={parts,hw:[['Damlama tepsisi',`${W-80} × ${D-50} mm`,'çıkarılabilir; çinko ya da sert plastik'],['Kavela 8×35','16 adet','kuşak-ayak'],['Su geçirmez tutkal (D3)','1 şişe',''],['Kaydırmaz keçe ayak','4 adet',''],['Sert yağ ya da su bazlı vernik','0,25 L','2-3 kat']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`${W} × ${D} mm, yükseklik ${H} mm. Üstte ${(nd+1)*2} göz; şemsiyeler çıtalı gövdede havalanarak kurur, su alttaki tepsiye damlar.`},
      {t:'warn',x:'Islakla temas edeceği için tüm yüzeylere, özellikle taban ve ayak uçlarına en az iki kat su geçirmez bitiş uygula.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','dubelSet',['forstnerSet','20 mm uç'],['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','metre'],x:cutUL(c,K)},
    {t:'Ön ve arka yüzü kur',add:['leg','railL','slatL'],tools:['dubelSet','isk','metre'],x:`<p>İki ${K('leg')} ayağı ${K('railL')} kuşaklarla kavelayla birleştir. ${nF} ${K('slatL')} çıtayı kuşakların arasına eşit arayla tutkalla. Diğer yüzü aynısı olarak kur.</p>`},
    {t:'Yanları bağla',add:['railS','slatS','bottom'],tools:['dubelSet','isk','gonye'],x:`<p>İki yüzü ${K('railS')} yan kuşaklarla birleştir, ${K('slatS')} çıtaları yerleştir. ${K('bottom')} tabanı alt kuşakların üstüne, köşelerini ayaklara göre kerterek tutkalla.</p>`},
    {t:'Bölme çubukları',add:['div','divL'],tools:['forstnerSet','matkap'],x:`<p>Üst kuşakların iç yüzüne 20 mm uçla 5 mm derin yuvalar aç. ${K('divL')} boyuna çubuğu ve ${K('div')} bölme çubuklarını yuvalara tutkalla oturt.</p>`},
    {t:'Tepsiyi yerleştir',add:['tray'],tools:[],x:'<p>Bitiş kuruduktan sonra damlama tepsisini tabana koy; tepsi temizlik için çıkarılabilir kalsın.</p>'},
    finishStep({})];
  return c;
}

/* 83) Gitar standı (sökülebilir) */
function guitarStand(p,o){
  const parts=[], W=p.W, Dp=p.D, Hn=p.H, sp=o.sp||'ceviz', sd=WORKTOP(sp,20,Dp), rl=LM(sp,20,45);
  const prof=[[0,0],[Dp,0],[Dp,95],[Dp-30,95],[Dp-50,60],[150,60],[70,Hn],[0,Hn]];
  for(const x of [0,W-20]) PART(parts,'side','Yan profil',sd,prism('x',prof,x,20),{cut:[Hn,Dp,20],cutNote:'şablonla dekupajla kesilir'});
  BOX(parts,'cradle','Alt beşik çubuğu','kav32',20,60,Dp-72,W-40,32,32,{cut:[W-20,32,32],cutNote:'10 mm yuvaya girer'});
  BOX(parts,'pad','Keçe kaplama','felt',20,92,Dp-72,W-40,3,32,{deco:true});
  BOX(parts,'str','Arka bağlantı',rl,20,0,90,W-40,45,20,{cut:[W-40,45,20]});
  const yw=Math.min(240,W-60);
  BOX(parts,'yoke','Sap yatağı',LM(sp,20,95),20,Hn-45,10,W-40,45,20,{cut:[W-40,95,20],cutNote:`ortasına ${yw>200?60:50} mm genişlikte V oyuk açılır`});
  BOX(parts,'ypad','Sap keçesi','felt',W/2-35,Hn-45,30,70,45,3,{deco:true});
  const c={parts,hw:[['Mobilya cıvatası M6×50 + gömme somun','4 takım','sökülebilir bağlantı'],['Keçe ya da nitrilli kauçuk şerit','1 m','gitarın değdiği yerlere'],['Kaydırmaz ayak pedi','4 adet',''],
      ['Sert yağ (nitroselüloz cilaya zarar vermeyen)','0,1 L','']],join:'Cıvata + kavela',
    notes:[{t:'tip',x:`${W} mm genişlik, sap yatağı ${Hn} mm yükseklikte; akustik, klasik ve elektro gitara uyar. Cıvatalar sökülünce yassı paket olur.`},
      {t:'warn',x:'Nitroselüloz cilalı gitarlar bazı kauçuk ve vinil pedlerle kimyasal tepkimeye girip lekelenir; keçe ya da "nitro güvenli" ped kullan. Stand yağı tamamen kurumadan gitarı koyma.'}]};
  c.tools=stdTools(['dekupaj','gonyeT','metre','gonye','kalem','pergel','matkap',['forstnerSet','32 mm uç'],'dubelSet','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Yan profilleri şablonla kes',add:['side'],tools:['dekupaj','pergel','zimMak'],x:`<p>Kartona ${Dp} × ${Hn} mm yan profil şablonunu çiz: önde beşik çukuru, arkada sap yatağına uzanan eğik dikme. İki ${K('side')} parçayı aynı şablondan kes, işkenceyle sıkıp birlikte zımparala.</p>`},
    {t:'Yuvaları aç',tools:['forstnerSet','matkap'],x:`<p>Yan profillerin iç yüzüne ${K('cradle')} çubuğu için 32 mm uçla 10 mm derin yuva aç. Arka bağlantı ve sap yatağı için cıvata ve gömme somun deliklerini del.</p>`},
    {t:'Birleştir',add:['cradle','str','yoke'],tools:['matkap','dubelSet'],x:`<p>${K('cradle')} çubuğunu yuvalara oturt. ${K('str')} arka bağlantıyı ve ${K('yoke')} sap yatağını cıvatayla iki profilin arasına bağla; sap yatağının ortasına V oyuğu aç.</p>`},
    {t:'Keçeleri yapıştır',add:['pad','ypad'],tools:['bicak'],x:'<p>Bitiş kuruduktan sonra beşik çubuğuna ve sap oyuğuna keçe şeridi yapıştır.</p>'},
    finishStep({})];
  return c;
}

/* ---------- 2026-11-05 (11): tavuk kümesi, sallanan at, kukla tiyatrosu, akvaryum sehpası, masa futbolu, kedi evi, verandalı köpek kulübesi ---------- */
MAT.mesh={n:'Galvaniz kaynaklı tel',type:'hw',tone:'mesh'};
MAT.turf={n:'Yeşil saha boyası',type:'hw',tone:'turf'};
MAT.chalk={n:'Kara tahta boyası',type:'hw',tone:'chalk'};
Object.assign(TONE,{mesh:[210,6,72],turf:[120,38,40],chalk:[150,12,22]});
const onlyG=(parts,gs)=>gs.filter(g=>parts.some(q=>q.g===g));

/* 84) Tavuk kümesi (yükseltilmiş, altı tel kafesli gezinme alanı) */
function coop(p,o){
  const parts=[], W=p.W, D=p.D, Hf=p.H, Hb=Hf-200, sp=o.sp||'emp', Y0=600, Yf=Y0+18, lg=LM(sp,70,70), bm=LM(sp,45,95), m='ply12', s=(Hf-Hb)/D, yr=z=>Hb+s*z;
  for(const z of [0,D-70]) for(const x of [0,W-70]) BOX(parts,'leg','Köşe dikmesi',lg,x,0,z,70,R(yr(z)),70,{cutNote:'üst ucu çatı eğimiyle kesilir'});
  for(const z of [0,D-45]){BOX(parts,'base','Alt kuşak',bm,70,0,z,W-140,95,45);BOX(parts,'bearer','Taban kirişi',bm,70,Y0-95,z,W-140,95,45);}
  for(const x of [0,W-45]) BOX(parts,'baseS','Yan alt kuşak',bm,x,0,70,45,95,D-140);
  BOX(parts,'floor','Kümes tabanı','ply18',70,Y0,0,W-140,18,D);
  PART(parts,'hole','Tavuk geçişi (tabanda)','hole',prism('y',[[82,R(D/2-130)],[302,R(D/2-130)],[302,R(D/2+130)],[82,R(D/2+130)]],Yf,1),{deco:true});
  PART(parts,'ramp','Rampa','ply18',barRings([302,Y0-9,D/2],[302+Y0,0,D/2],240,18,[0,1,0]),{cut:[R(Math.hypot(Y0,Y0)),240,18],cutNote:'üstüne 150 mm arayla basamak çıtası'});
  for(const x of [70,W-82]) PART(parts,'side','Yan duvar',m,prism('x',[[0,Yf],[D,Yf],[D,yr(D)],[0,yr(0)]],x,12),{cut:[D,R(yr(D)-Yf),12],cutNote:'üst kenarı çatı eğimiyle kesilir'});
  BOX(parts,'back','Arka duvar (temizlik kapağı)',m,82,Yf,0,W-164,R(yr(0)-Yf),12,{cutNote:'menteşeyle aşağı açılır'});
  BOX(parts,'front','Ön duvar',m,82,Yf,D-12,W-164,R(yr(D-12)-Yf),12);
  PART(parts,'vent','Havalandırma (telli)','hole',prism('z',[[150,yr(D)-90],[W-150,yr(D)-90],[W-150,yr(D)-50],[150,yr(D)-50]],D,1),{deco:true});
  BOX(parts,'perch','Tünek',LM('cam',45,70),82,Yf+350,R(D*0.35),W-164,45,70,{cutNote:'üst kenarları yuvarlatılır'});
  const nn=Math.max(1,Math.floor((D-140)/300)), zw=nn*300, z0=(D-zw)/2, yn=Yf+80, xo=W+300;
  BOX(parts,'nestB','Folluk tabanı',m,W-70,yn,z0,370,12,zw);
  for(const z of [z0,z0+zw-12]) BOX(parts,'nestE','Folluk yanı',m,W-70,yn+12,z,370,330,12);
  BOX(parts,'nestF','Folluk dış duvarı',m,xo-12,yn+12,z0+12,12,300,zw-24);
  for(let i=1;i<nn;i++) BOX(parts,'nestD','Folluk ara bölmesi',m,W-70,yn+12,z0+i*300-6,358,300,12);
  PART(parts,'nestL','Folluk kapağı',m,prism('z',[[W-90,yn+360],[xo+30,yn+342],[xo+30,yn+354],[W-90,yn+372]],z0-15,zw+30),{cut:[zw+30,R(xo-W+120),12],cutNote:'yumurta almak için menteşeyle açılır'});
  const yt=Y0-95;
  BOX(parts,'mesh','Tel kafes (ön, kapılı)','mesh',70,95,D,W-140,yt-95,2,{deco:true});
  BOX(parts,'mesh','Tel kafes (arka)','mesh',70,95,-2,W-140,yt-95,2,{deco:true});
  for(const x of [-2,W]) BOX(parts,'mesh','Tel kafes (yan)','mesh',x,95,70,2,yt-95,D-140,{deco:true});
  const ov=80, rlen=R(Math.hypot(D+2*ov,s*(D+2*ov)));
  PART(parts,'roof','Çatı levhası','ply18',barRings([W/2,yr(-ov)+9,-ov],[W/2,yr(D+ov)+9,D+ov],W+2*ov,18,[0,1,0]),{cut:[rlen,W+2*ov,18]});
  PART(parts,'shingle','Shingle kaplama','shingle',barRings([W/2,yr(-ov)+20,-ov],[W/2,yr(D+ov)+20,D+ov],W+2*ov,4,[0,1,0]),{deco:true});
  const area0=(W-140)*D/1e6, hens=Math.max(2,Math.floor(area0/0.25)), rarea=R((W+2*ov)*rlen/1e6*1.1*10)/10, marea=R((2*(W-140)+2*(D-140))*(yt-95)/1e6*1.15*10)/10;
  const c={parts,hw:[['Galvaniz kaynaklı tel 13×13 mm (en az 1 mm tel)',`${dec(marea)} m²`,'gezinme alanı; ayrıca toprağa gömülecek etek için'],['Bitümlü shingle + çatı keçesi',`${dec(rarea)} m²`,''],
      ['Galvaniz menteşe','6 adet','temizlik kapağı, folluk kapağı, kafes kapısı'],['Yırtıcıya dayanıklı sürgü + karabina','3 takım','her kapıya'],['Sürgülü tavuk kapısı (ray + kapak)','1 takım','tabandaki geçiş'],
      ['Galvaniz vida 5×80','1 kutu','iskelet'],['Paslanmaz vida 4×30','1 kutu','levhalar'],['U çivi (tel zımbası)','1 paket','kafes'],['Zehirsiz dış mekân boyası','1 L','2 kat']],join:'Vida + U çivi',
    notes:[{t:'tip',x:`Kümes içi ${dec(R(area0*100)/100)} m², yaklaşık ${hens} tavuk için (tavuk başına 0,25 m²); ${nn} folluk ve ${dec(R((W-164)/10)/100)} m tünek var. Gündüz serbest dolaşacakları ayrı bir bahçe alanı da gerekir.`},
      {t:'warn',x:'Altıgen "tavuk teli" tilki, sansar ve kediye dayanmaz; kaynaklı tel kullan. Kafesin altına toprağa 30 cm gömülü ya da dışa doğru 50 cm serili tel etek koy, kapıları her akşam kilitle.'},
      {t:'tip',x:'Tavukların gagalayabileceği iç yüzeyleri emprenyesiz ve zehirsiz boyalı bırak. Tabana talaş ser, temizlik kapağından haftada bir değiştir. Tünek folluklardan yüksek olmalı, yoksa tavuklar folluklarda uyur.'}]};
  c.tools=stdTools(['daire','gonyeT','aciOlcer','metre','gonye','kalem','terazi','matkap','havsa','dekupaj',['isk','4 adet'],'cekic','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','gonyeT','aciOlcer'],x:cutUL(c,K)},
    {t:'İskeleti kur',add:['leg','base','baseS','bearer'],tools:['matkap','terazi','isk'],x:`<p>${K('leg')} köşe dikmelerinin üst uçlarını çatı eğimiyle kes: öndekiler ${R(yr(D-70))} mm, arkadakiler ${Hb} mm. ${K('base')} ve ${K('baseS')} alt kuşaklarla dört dikmeyi zeminde birleştir, ${K('bearer')} taban kirişlerini kuşakların üst kenarı yerden ${Y0} mm olacak şekilde vidala. Terazile.</p>`},
    {t:'Tabanı ve rampayı tak',add:['floor','hole','ramp'],tools:['dekupaj','matkap'],x:`<p>${K('floor')} tabanda sol yanda 220 × 260 mm tavuk geçişini dekupajla aç, üstüne sürgülü kapağın rayını tak. Tabanı kirişlere vidala. ${K('ramp')} rampanın üst ucunu geçişin kenarına menteşele; üstüne 150 mm arayla 20 mm basamak çıtaları çak.</p>`},
    {t:'Duvarları kur',add:['side','back','front','vent','perch'],tools:['dekupaj','matkap','havsa'],x:`<p>${K('side')} yan duvarların üst kenarını eğimle kes, dikmelerin iç yüzüne vidala; sağ duvarda folluklara açılan 260 mm yüksekliğinde boşluğu kes. ${K('front')} ön duvarın üstüne havalandırma yarığını aç, içinden tel çak. ${K('back')} arka duvarı alttan menteşeyle tak; temizlik kapağı olur. ${K('perch')} tüneği tabandan 350 mm yükseğe, iki yandaki takozlara oturt.</p>`},
    {t:'Folluk kutusu',add:onlyG(parts,['nestB','nestE','nestF','nestD','nestL']),tools:['matkap','dekupaj'],x:`<p>${K('nestB')} tabanı ve ${K('nestE')} yanları dikmelere vidalayarak kümesin sağ dışına ${nn} gözlü folluk kutusu kur${nn>1?`; ${K('nestD')} ara bölmeyle ayır`:''}. ${K('nestL')} eğik kapağı menteşeyle bağla; yumurtalar dışarıdan alınır.</p>`},
    {t:'Çatıyı kapat',add:['roof','shingle'],tools:['matkap','cekic'],x:`<p>${K('roof')} çatı levhasını dikmelere ve duvarlara vidala; her yandan ${ov} mm taşsın. Çatı keçesi ser, shingle'ı alttan (arka) başlayarak çak.</p>`},
    {t:'Tel kafesi ger',add:['mesh'],tools:['cekic','isk'],x:'<p>Kaynaklı teli dikmelerin dış yüzüne gergin tutarak U çiviyle 100 mm arayla çak; önde menteşeli küçük bir kapı bırak. Kafesin altına toprağa gömülü tel etek ekle.</p>'},
    finishStep({outdoor:1},'<p>Tavukların gagalayabileceği iç yüzeyleri emprenyesiz, zehirsiz boyayla boya ya da çıplak bırak.</p>')];
  return c;
}

/* 85) Sallanan at */
function rockingHorse(p,o){
  const parts=[], L=p.L, Hs=p.H, W=Math.max(300,Math.min(380,R(L*0.42))), sp=o.sp||'kayin', Rr=R(L*1.25), zc=L/2, yt=Hs-28;
  const yb=z=>Rr-Math.sqrt(Rr*Rr-(z-zc)*(z-zc)), z1=R(L*0.28), z2=R(L*0.72), zs=R(L*0.24), zh=R(L*0.6);
  const prof=[];for(let i=0;i<=16;i++){const z=L*i/16;prof.push([z,yb(z)]);}
  prof.push([L,yb(L)+70],[z2,yt],[z1,yt],[0,yb(0)+70]);
  for(const x of [0,W-18]) PART(parts,'side','Yan kızak (profil)','ply18',prism('x',prof,x,18),{cut:[L,R(yt),18],cutNote:`alt kenarı R${Rr} yay, şablonla kesilir`});
  const yc=(yb(zc)+yt)/2, rh=Math.max(40,Math.min((yt-yb(zc))/2-50,(z2-z1)/2-40));
  for(const x of [-1,W]) PART(parts,'hole','Hafifletme deliği','hole',prism('x',circlePoly(zc,yc,rh,28),x,1),{deco:true});
  BOX(parts,'strB','Arka bağlantı',LM(sp,20,70),18,yt-70,z1,W-36,70,20);
  BOX(parts,'neck','Boyun takozu',LM(sp,45,95),18,yt-45,zh,W-36,45,95);
  BOX(parts,'seat','Oturak',WORKTOP(sp,28,zh-zs),-15,yt,zs,W+30,28,zh-zs,{cutNote:'kenarları R10 yuvarlatılır, ortası hafif oyulur'});
  const hb=yt;
  const head=[[zh,hb],[zh+110,hb],[zh+150,Hs+170],[zh+230,Hs+240],[zh+250,Hs+290],[zh+190,Hs+350],[zh+120,Hs+365],[zh+75,Hs+400],[zh+55,Hs+340],[zh+30,Hs+200],[zh,Hs+90]];
  PART(parts,'head','At başı',WORKTOP(sp,28,260),prism('x',head,W/2-14,28),{cut:[R(Hs+400-hb),260,28],cutNote:'şablonla dekupajla kesilir'});
  PART(parts,'handle','Tutamak','kav20',cylRings([W/2-130,Hs+230,zh+120],[W/2+130,Hs+230,zh+120],10,10),{cut:[260,20,20]});
  const fz=R(L*0.8), fy=R(Math.max(yb(fz)+60,Hs*0.42));
  PART(parts,'foot','Ayak dayama','kav25',cylRings([-70,fy,fz],[W+70,fy,fz],12.5,12.5),{cut:[W+140,25,25]});
  PART(parts,'tail','Kuyruk (halat)','rope',cylRings([W/2,yt-10,zs-5],[W/2,yt-230,zs-60],14,8),{deco:true});
  PART(parts,'mane','Yele (halat)','rope',cylRings([W/2,Hs+150,zh+25],[W/2,Hs+330,zh+65],10,10),{deco:true});
  const c={parts,hw:[['Mobilya cıvatası M6×50 + gömme somun','4 takım','oturak ve boyun'],['Kavela 8×40','8 adet','baş'],['Ahşap tutkalı','1 şişe',''],['Pamuk ya da jüt halat Ø20','1 m','yele ve kuyruk'],
      ['Kaydırmaz keçe şerit',`2 × ${L} mm`,'kızak altına'],['Oyuncağa uygun (EN 71-3) vernik ya da boya','0,25 L','']],join:'Cıvata + kavela + tutkal',
    notes:[{t:'tip',x:`Kızak ${L} mm, R${Rr} yaylı; oturak yerden ${Hs} mm, genişlik ${W} mm. ${Hs<=450?'2-4 yaş':'3-6 yaş'} için uygun.`},
      {t:'warn',x:'Kızakların iki ucu da yukarı kıvrık olmalı; aşırı sallanınca at ön ya da arka ucunun üstüne devrilmez, durur. Çocuk tek başınayken kullanmasın; tüm kenarları yuvarlat, halatları sıkı bağla, küçük parça bırakma.'}]};
  c.tools=stdTools(['dekupaj','gonyeT','metre','gonye','kalem','pergel','matkap','dubelSet',['forstnerSet','20 ve 25 mm uç'],['isk','4 adet'],'freze','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT','dekupaj'],x:cutUL(c,K)},
    {t:'Kızak profillerini şablonla kes',add:['side','hole'],tools:['pergel','dekupaj','zimMak'],x:`<p>Kartona ${L} mm boyunda, alt kenarı R${Rr} yaylı yan profili çiz; üst kenar ortada ${yt} mm yükseklikte düzleşir. İki ${K('side')} profili aynı şablondan kes, ortalarına Ø${R(rh*2)} mm hafifletme deliği aç, işkenceyle sıkıp birlikte zımparala.</p>`,tip:'Şablonu zeminde salla: iki uca kadar akıcı sallanmalı, uçlarda yavaşça durmalı.'},
    {t:'Gövdeyi birleştir',add:['strB','neck','seat'],tools:['matkap','dubelSet','isk'],x:`<p>${K('strB')} arka bağlantıyı ve ${K('neck')} boyun takozunu iki profilin arasına tutkal ve vidayla bağla. ${K('seat')} oturağı üstlerine cıvatayla otur; kenarları yuvarlat.</p>`},
    {t:'Başı ve tutamağı tak',add:['head','handle'],tools:['dekupaj','forstnerSet','dubelSet'],x:`<p>${K('head')} at başını şablonla kes, 20 mm tutamak deliğini del. Başı boyun takozuna iki kavela ve bir cıvatayla oturt. ${K('handle')} tutamağı deliğe tutkalla, iki yanda eşit taşsın.</p>`},
    {t:'Ayak dayama, yele ve kuyruk',add:['foot','tail','mane'],tools:['forstnerSet','matkap'],x:`<p>Yan profillere yerden ${fy} mm yükseklikte 25 mm delik aç, ${K('foot')} ayak dayamayı tutkalla geçir. Başın arkasına ve oturağın arkasına 20 mm delik açıp halatı tutkal ve pimle sabitle, uçlarını didikle.</p>`},
    finishStep({},'<p>Yalnızca oyuncağa uygun (EN 71-3) vernik ya da boya kullan.</p>')];
  return c;
}

/* 86) Kukla tiyatrosu (masa üstü ya da yer) */
function puppetTheater(p,o){
  const parts=[], W=p.W, H=p.H, m='ply12', Dw=R(Math.max(220,Math.min(W*0.38,H*0.4))), xa=R(W*0.18), xb=W-xa, ya=R(H*0.4), yb=R(H*0.86);
  BOX(parts,'front','Ön panel',m,0,0,Dw,W,H,12,{cutNote:`ortasına ${xb-xa} × ${yb-ya} mm sahne açıklığı`});
  PART(parts,'hole','Sahne açıklığı','hole',prism('z',[[xa,ya],[xb,ya],[xb,yb],[xa,yb]],Dw+12,1),{deco:true});
  for(const x of [0,W-12]) BOX(parts,'wing','Yan kanat (katlanır)',m,x,0,0,12,yb,Dw,{cutNote:'piyano menteşesiyle ön panele bağlanır'});
  const ph=R(W*0.16);
  PART(parts,'crown','Tepelik',m,prism('z',[[-20,H],[W+20,H],[W+20,H+40],[W/2+60,H+40],[W/2,H+ph],[W/2-60,H+40],[-20,H+40]],Dw,12),{cut:[W+40,ph,12],cutNote:'dekupajla kesilir'});
  BOX(parts,'stage','Sahne rafı',m,12,ya-12,Dw-120,W-24,12,120);
  BOX(parts,'rod','Perde çubuğu','kav12',12,yb+20,Dw-52,W-24,12,12,{cut:[W,12,12],cutNote:'kanatlardaki deliklere girer'});
  for(const [a,b] of [[xa-20,W/2-10],[W/2+10,xb+20]]) BOX(parts,'curtain','Perde','fabric',a,ya+10,Dw-58,b-a,yb+26-ya-10,2,{deco:true});
  BOX(parts,'board','Kara tahta yüzeyi','chalk',R(W*0.12),R(H*0.06),Dw+12,R(W*0.76),R(ya*0.7),2,{deco:true});
  const c={parts,hw:[['Piyano menteşesi',`2 × ${yb} mm`,'kanatlar katlanır'],['Perde kumaşı',`${dec(R((xb-xa+40)*1.6*(yb-ya)/1e5)/10)} m²`,'büzgülü, iki kanat'],['Kara tahta boyası','0,25 L','alt yüze, isteğe bağlı'],
      ['Mıknatıslı kapak tutucu','2 adet','kanatları açık tutar'],['Kaydırmaz keçe ayak','4 adet',''],['Oyuncağa uygun (EN 71-3) su bazlı boya','0,5 L','']],join:'Menteşe + vida',
    notes:[{t:'tip',x:`${W} × ${H} mm ön panel, sahne açıklığı ${xb-xa} × ${yb-ya} mm. ${H<1000?'Masa üstüne konur; çocuk masanın arkasında oturarak oynatır.':'Yere konur; çocuk arkasında ayakta ya da diz çökerek oynatır.'} Kanatlar katlanınca yassı saklanır.`},
      {t:'warn',x:'Kanatları açık konumda mıknatısla sabitle; devrilmesin. Kenarları yuvarlat, kıymık bırakma.'}]};
  c.tools=stdTools(['daire','dekupaj','metre','gonye','kalem','pergel','matkap',['forstnerSet','12 mm uç'],['isk','2 adet'],'zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj'],x:cutUL(c,K)},
    {t:'Sahne açıklığını ve tepeliği kes',add:['front','hole','crown'],tools:['dekupaj','matkap','zimKag'],x:`<p>${K('front')} ön panelin köşelerine matkapla delik açıp sahne açıklığını dekupajla kes. ${K('crown')} tepeliği istediğin süslü şekilde çiz ve kes, ön panelin üstüne arkadan çıta ile tutkalla.</p>`},
    {t:'Kanatları ve rafı tak',add:['wing','stage'],tools:['matkap','isk'],x:`<p>${K('wing')} kanatları ön panelin iki yanına piyano menteşesiyle bağla. ${K('stage')} sahne rafını açıklığın alt kenarının hemen arkasına, takozlarla ön panele vidala.</p>`},
    {t:'Perdeyi as',add:['rod','curtain'],tools:['forstnerSet','matkap'],x:`<p>Kanatların ön ucuna açıklığın üstünde 12 mm delik aç, ${K('rod')} perde çubuğunu geçir. Kumaşın üstünü büzüp tünel dik, çubuğa geçir.</p>`},
    finishStep({paint:1},'<p>Ön paneli oyuncağa uygun boyayla boya; alt kısma kara tahta boyası sürersen oyun programı yazılır.</p>')];
  return c;
}

/* 87) Akvaryum sehpası (iç iskeletli) */
function aquariumStand(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, m='ply18', ps=LM('cam',45,70), rb=LM('cam',45,95), door=o.door!==false, Ht=H-36;
  for(const x of [0,W-18]) BOX(parts,'side','Yan',m,x,0,0,18,Ht,D);
  const px=[18,W-88].concat(W>1000?[R(W/2-35)]:[]).sort((a,b)=>a-b);
  px.forEach(x=>{const mid=x>18&&x<W-88, h=mid?Ht-95:Ht;
    BOX(parts,'post','Taşıyıcı dikme',ps,x,0,D-45,70,h,45);BOX(parts,'post','Taşıyıcı dikme',ps,x,0,6,70,h,45);});
  for(const z of [6,D-45]) BOX(parts,'rail','Üst kiriş',rb,88,Ht-95,z,W-176,95,45);
  for(let i=0;i<px.length-1;i++) BOX(parts,'kick','Baza',m,px[i]+70,0,D-18,px[i+1]-px[i]-70,98,18);
  for(const x of [18,W-38]) BOX(parts,'cleat','Taban takozu',LM('cam',20,45),x,35,51,20,45,D-96);
  BOX(parts,'bottom','Taban',m,18,80,51,W-36,18,D-96);
  BOX(parts,'back','Arkalık','ply6',18,98,0,W-36,Ht-98,6);
  BOX(parts,'shelf','Ara raf',m,38,R(Ht*0.5),51,W-76,18,D-96);
  for(const y of [Ht,Ht+18]) BOX(parts,'top','Üst tabla (çift kat)',m,0,y,0,W,18,D,{cutNote:'iki kat tutkallanıp vidalanır'});
  PART(parts,'hole','Hortum / kablo deliği','hole',prism('z',circlePoly(W-150,Ht-180,30,20),-1,1),{deco:true});
  if(door){const n=2, dw=W/n;for(let i=0;i<n;i++) BOX(parts,'door','Kapak',m,i*dw+2,100,D,dw-4,Ht-102,18,{cutNote:'kenarları bantlanır'});}
  const vol=R(W*D*Math.min(600,W*0.5)/1e6), kg=R(vol*1.3);
  const c={parts,hw:[['Konfirmat 7×50','1 kutu','gövde'],['Galvaniz vida 5×70','1 kutu','iskelet'],['Ahşap tutkalı (D3)','1 şişe',''],...(door?[['Kapak menteşesi 35 mm (frenli)','4 adet',''],['Kulp','2 adet','']]:[]),
      ['Ayarlı ayak (M10, 150 kg)',`${px.length*2} adet`,'dikmelerin altına; zemin eğikse terazilemek için'],['Su geçirmez vernik ya da poliüretan','0,75 L','3 kat, özellikle üst tabla'],['Akvaryum altı köpük ped','1 adet','cam akvaryumlarda üretici isterse']],join:'Konfirmat + iç iskelet',
    notes:[{t:'tip',x:`${W} × ${D} mm, yükseklik ${H} mm. Yük ${px.length*2} dikmeyle doğrudan zemine iner; yan paneller yalnızca kaplamadır. Bu tabla yaklaşık ${vol} L akvaryum içindir (cam, kum ve suyla ${kg} kg).`},
      {t:'warn',x:'Dolu akvaryum çok ağırdır: tablayı terazide kur, akvaryumun tabanı tablaya her yerden değsin, sehpayı duvara sabitle. MDF ya da suntalam kullanma; su sıçrayınca şişer. Akvaryum üreticisinin sehpa şartlarını mutlaka kontrol et.'}]};
  c.tools=stdTools(['daire','ray','gonyeT','metre','gonye','kalem','terazi','matkap','konfUc','havsa',['forstnerSet','35 mm uç'],['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','gonyeT'],x:cutUL(c,K)},
    {t:'İç iskeleti kur',add:['post','rail'],tools:['matkap','isk','gonye'],x:`<p>Ön ve arka için ${K('post')} dikmeleri ${K('rail')} üst kirişlere tutkal ve iki vidayla bağlayarak iki çerçeve kur${px.length>2?'; ortadaki dikmeler kirişin altına gelir':''}. Çaprazları eşitle.</p>`},
    {t:'Yanları ve tabanı bağla',add:['side','cleat','bottom','kick','back'],tools:['matkap','konfUc','terazi'],x:`<p>${K('side')} yanları iki çerçevenin dışına konfirmatla bağla. ${K('cleat')} takozları yanlara vidala, ${K('bottom')} tabanı üstlerine otur. ${K('kick')} bazaları ön dikmelerin arasına, ${K('back')} arkalığı arkaya çak. Hortum ve kablo için arkalığa delik aç.</p>`},
    {t:'Rafı ve üst tablayı tak',add:['shelf','top'],tools:['matkap','isk','terazi'],x:`<p>${K('shelf')} rafı yanlardaki takozlara otur. ${K('top')} iki üst tabla katını tutkalla birleştir, iskelete alttan vidala. Tablayı her iki yönde terazile.</p>`},
    ...(door?[{t:'Kapakları tak',add:['door'],tools:['forstnerSet','matkap'],x:`<p>${K('door')} kapaklara 35 mm uçla menteşe yuvası aç, kapakları tak ve kulpları vidala.</p>`}]:[]),
    finishStep({},'<p>Üst tablaya ve tabana en az üç kat su geçirmez vernik uygula.</p>')];
  return c;
}

/* 88) Masa futbolu (masa üstü) */
function foosball(p,o){
  const parts=[], L=p.L, W=p.W, N=p.N||o.N||4, Hw=110, ry=12+75;
  BOX(parts,'floor','Saha tabanı','ply12',0,0,0,W,12,L);
  BOX(parts,'turf','Saha boyası','turf',12,12,12,W-24,1,L-24,{deco:true});
  for(const x of [0,W-12]) BOX(parts,'wall','Yan duvar','ply12',x,12,0,12,Hw,L);
  const gw=R(W*0.32);
  for(const z of [0,L-12]){BOX(parts,'end','Kale duvarı','ply12',12,12,z,W-24,Hw,12,{cutNote:`ortasına ${gw} × 45 mm kale ağzı`});
    PART(parts,'hole','Kale ağzı','hole',prism('z',[[W/2-gw/2,12],[W/2+gw/2,12],[W/2+gw/2,57],[W/2-gw/2,57]],z<1?-1:L,1),{deco:true});}
  const seq={4:[[0,1],[1,3],[0,3],[1,1]],6:[[0,1],[0,2],[1,3],[0,3],[1,2],[1,1]],8:[[0,1],[0,2],[1,3],[0,5],[1,5],[0,3],[1,2],[1,1]]}[N]||[[0,1],[1,3],[0,3],[1,1]];
  let np=0;
  seq.forEach(([tm,n],k)=>{const z=12+(L-24)*(k+.5)/seq.length, x0=tm?-110:-35, x1=tm?W+35:W+110;
    PART(parts,'rod','Oyuncu çubuğu','kav12',cylRings([x0,ry,z],[x1,ry,z],6,6),{cut:[R(x1-x0),12,12]});
    PART(parts,'grip','Tutamak','kav25',tm?cylRings([-210,ry,z],[-110,ry,z],12.5,12.5):cylRings([W+110,ry,z],[W+210,ry,z],12.5,12.5),{cut:[100,25,25],cutNote:'12 mm kör delik'});
    for(let i=0;i<n;i++){const xc=W*(i+1)/(n+1);np++;
      PART(parts,tm?'plB':'plA',tm?'Oyuncu (B takımı)':'Oyuncu (A takımı)','ply18',prism('z',[[xc-12,18],[xc+12,18],[xc+14,ry+12],[xc+8,ry+20],[xc+10,ry+42],[xc-10,ry+42],[xc-8,ry+20],[xc-14,ry+12]],z-9,18),{cut:[ry+30,30,18],cutNote:'12 mm delikle çubuğa pimlenir'});}});
  const c={parts,hw:[['Mantar ya da ahşap top Ø25','2 adet',''],['Çubuk durdurma halkası (12 mm, vidalı)',`${seq.length*2} adet`,'çubuk kaçmasın'],['Ahşap pim Ø4','1 paket','oyuncu-çubuk'],
      ['Kırmızı ve mavi oyuncak boyası (EN 71-3)','2 × 50 ml','takımlar'],['Yeşil ve beyaz boya','1 takım','saha ve çizgiler'],['Kaydırmaz keçe ayak','4 adet','']],join:'Tutkal + vida + pim',
    notes:[{t:'tip',x:`Saha ${W} × ${L} mm, ${seq.length} çubuk ve ${np} oyuncu. Çubuklar sırayla iki takıma dağıtılmıştır; her oyuncu kendi tarafındaki tutamakları çevirir.`},
      {t:'warn',x:'Çubuk delikleri hizasız olursa çubuklar sıkışır: iki yan duvarı üst üste işkenceleyip delikleri birlikte del. Küçük top 3 yaş altına uygun değildir.'}]};
  c.tools=stdTools(['daire','dekupaj','metre','gonye','kalem','matkap',['forstnerSet','25 mm uç'],['isk','4 adet'],'zimMak','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj'],x:cutUL(c,K)},
    {t:'Kasayı kur',add:['floor','wall','end','hole'],tools:['dekupaj','matkap','isk'],x:`<p>${K('end')} kale duvarlarının alt ortasına ${gw} × 45 mm kale ağzını kes. ${K('wall')} yan duvarları üst üste işkencele, yerden ${ry} mm yükseklikte ${seq.length} çubuk deliğini (13 mm) birlikte del. Duvarları ${K('floor')} tabana tutkal ve vidayla bağla.</p>`},
    {t:'Sahayı boya',add:['turf'],tools:['boya'],x:'<p>Tabanı yeşile boya, orta çizgi ve ceza sahalarını beyaz bantla maskeleyip çiz.</p>'},
    {t:'Oyuncuları kes',add:['plA','plB'],tools:['dekupaj','matkap','zimKag'],x:`<p>Bir oyuncu şablonu çiz, ${np} oyuncuyu dekupajla kes. Tepeden ${30} mm aşağıya 12 mm çubuk deliği del. İki takımı farklı renge boya.</p>`},
    {t:'Çubukları ve tutamakları tak',add:['rod','grip'],tools:['matkap'],x:`<p>${K('rod')} çubukları duvarlardan geçirirken oyuncuları sırayla diz, her oyuncuyu çubuğa Ø4 pimle sabitle. ${K('grip')} tutamakları çubuk uçlarına tutkalla, iki yana durdurma halkası tak.</p>`},
    finishStep({paint:1})];
  return c;
}

/* 89) Sokak kedisi evi (yalıtımlı, iki girişli) */
function catHouse(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, Hb=H-60, m='ply12', ins=o.ins!==false, fl=o.floors||1, y0=45, yf=y0+12, s=(H-Hb)/D, yr=z=>yf+Hb+s*z;
  for(const x of [30,W-75]) BOX(parts,'runner','Taban kızağı',LM('emp',45,45),x,0,0,45,45,D);
  BOX(parts,'floor','Taban',m,0,y0,0,W,12,D);
  BOX(parts,'back','Arka duvar',m,0,yf,0,W,Hb,12);BOX(parts,'front','Ön duvar',m,0,yf,D-12,W,R(yr(D-12)-yf),12);
  for(const x of [0,W-12]) PART(parts,'side','Yan duvar',m,prism('x',[[12,yf],[D-12,yf],[D-12,yr(D-12)],[12,yr(12)]],x,12),{cut:[D-24,R(H),12],cutNote:'üst kenarı eğimle kesilir'});
  if(ins){BOX(parts,'insF','Yalıtım (XPS 20 mm)','foam',12,yf,12,W-24,20,D-24,{deco:true});
    for(const x of [12,W-32]) BOX(parts,'insS','Yalıtım (XPS 20 mm)','foam',x,yf+20,32,20,Hb-40,D-64,{deco:true});
    BOX(parts,'insB','Yalıtım (XPS 20 mm)','foam',32,yf+20,12,W-64,Hb-40,20,{deco:true});}
  const ex=R(W*0.3), ey=yf+(fl>1?60:90)+80;
  PART(parts,'hole','Giriş (Ø160)','hole',prism('z',circlePoly(ex,ey,80,28),D,1),{deco:true});
  PART(parts,'hole2','Kaçış girişi (Ø150)','hole',prism('x',circlePoly(R(D*(fl>1?0.78:0.35)),yf+170,75,28),W,1),{deco:true});
  if(fl>1) BOX(parts,'shelf','Ara kat',m,ins?32:12,yf+R(H*0.5),ins?32:12,W-(ins?64:24),12,R(D*0.5));
  const ov=60, rl=R(Math.hypot(D+2*ov,s*(D+2*ov)));
  PART(parts,'roof','Çatı (menteşeli)','ply18',barRings([W/2,yr(-ov)+9,-ov],[W/2,yr(D+ov)+9,D+ov],W+2*ov,18,[0,1,0]),{cut:[rl,W+2*ov,18]});
  PART(parts,'shingle','Shingle kaplama','shingle',barRings([W/2,yr(-ov)+20,-ov],[W/2,yr(D+ov)+20,D+ov],W+2*ov,4,[0,1,0]),{deco:true});
  const c={parts,hw:[...(ins?[['XPS yalıtım levhası 20 mm',`${dec(R((W*D+2*D*H+W*H)/1e5)/10)} m²`,'taban, yanlar, arka ve çatı altı']]:[]),['Şeffaf PVC şerit perde','300 × 300 mm','girişe, rüzgâr kesici'],
      ['Piyano menteşesi',`${W} mm`,'çatı arkadan açılır'],['Çatı tutucu kanca','2 adet','rüzgârda kapalı kalır'],['Bitümlü shingle',`${dec(R((W+2*ov)*rl/1e6*1.2*10)/10)} m²`,''],['Paslanmaz vida 4×30','1 kutu',''],['Zehirsiz dış mekân boyası','0,5 L','yalnızca dış yüzlere']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`İç ölçü yaklaşık ${W-(ins?64:24)} × ${D-(ins?64:24)} mm: ${W*D<250000?'1-2':'2-3'} kedi için. Küçük ev kedinin kendi vücut ısısıyla daha çabuk ısınır; büyütmek ısınmayı zorlaştırır.`},
      {t:'tip',x:'İçine battaniye ya da havlu koyma; nemi tutar, donar. Kuru saman ser. Girişi hâkim rüzgârın tersine bak, evi yerden kızaklarla yükseltilmiş tut. Kaçış girişi kedinin içeride sıkışmasını önler.'},
      {t:'warn',x:'Çatıyı yalnızca temizlikte aç, tutucu kancayla kapalı tut. İç yüzleri boyama; kokusu kediyi uzaklaştırır.'}]};
  c.tools=stdTools(['daire','dekupaj','aciOlcer','metre','gonye','kalem','pergel','matkap','havsa',['isk','2 adet'],'bicak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','dekupaj'],x:cutUL(c,K)},
    {t:'Girişleri aç',add:['hole','hole2'],tools:['pergel','dekupaj','zimKag'],x:`<p>${K('front')} ön duvara bir yana yakın Ø160 mm giriş, sağ yan duvara Ø150 mm kaçış girişi çiz; matkapla delik açıp dekupajla kes, kenarlarını iyice yuvarlat.</p>`},
    {t:'Gövdeyi kur',add:onlyG(parts,['runner','floor','back','front','side','shelf']),tools:['matkap','havsa','isk'],x:`<p>${K('runner')} kızakları ${K('floor')} tabanın altına vidala. ${K('back')} arka, ${K('front')} ön ve ${K('side')} yan duvarları tabana ve birbirine tutkal ve vidayla bağla.${fl>1?` ${K('shelf')} ara katı yarı derinlikte yanlara takozla otur; kedi üst kata tırmanır.`:''}</p>`},
    ...(ins?[{t:'Yalıtımı yerleştir',add:['insF','insS','insB'],tools:['bicak','metre'],x:'<p>XPS levhaları maket bıçağıyla kes; tabana, yanlara ve arkaya sıkıca oturt. Girişlerin yerini köpükten de kes. Çatının altına da bir kat yapıştır.</p>'}]:[]),
    {t:'Çatıyı tak',add:['roof','shingle'],tools:['matkap'],x:`<p>${K('roof')} çatıyı arka kenarından piyano menteşesiyle bağla; öne iki tutucu kanca tak. Üstünü shingle ile kapla. Girişe şeffaf PVC perdeyi şeritler hâlinde vidala.</p>`},
    finishStep({outdoor:1},'<p>Yalnızca dış yüzleri boya; iç yüzler çıplak kalsın.</p>')];
  return c;
}

/* 90) Verandalı köpek kulübesi (tek eğimli çatı, rüzgâr bölmeli) */
function porchDogHouse(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, Hb=H-120, m='ply18', vr=o.veranda!==false, Dv=vr?R(D*0.5):0, y0=45, yf=y0+18, s=(H-Hb)/D, yr=z=>yf+Hb+s*z;
  const bx=[30,R(W/2-35),W-100];
  bx.forEach(x=>BOX(parts,'runner','Taban kirişi',LM('emp',45,70),x,0,0,70,45,D+Dv,{cut:[D+Dv,70,45]}));
  BOX(parts,'floor','Taban',m,0,y0,0,W,18,D);
  if(vr){const n=Math.max(2,Math.floor((Dv+5)/100));spread(n,D,D+Dv,95).forEach(z=>BOX(parts,'deck','Veranda tahtası',LM('emp',20,95),0,y0,z,W,20,95));
    for(const x of [0,W-45]) BOX(parts,'post','Veranda dikmesi',LM('emp',45,45),x,y0+20,D+Dv-45,45,R(yr(D+Dv-45)-y0-20),45,{cutNote:'üst ucu çatı eğimiyle kesilir'});}
  BOX(parts,'back','Arka duvar',m,0,yf,0,W,Hb,18);
  BOX(parts,'front','Ön duvar',m,0,yf,D-18,W,R(yr(D-18)-yf),18,{cutNote:'kapı açıklığı kesilir'});
  for(const x of [0,W-18]) PART(parts,'side','Yan duvar',m,prism('x',[[18,yf],[D-18,yf],[D-18,yr(D-18)],[18,yr(18)]],x,18),{cut:[D-36,R(yr(D)-yf),18],cutNote:'üst kenarı eğimle kesilir'});
  const dw=R(Math.min(W*0.36,420)), dh=R(H*0.72), dx0=W-18-60-dw;
  PART(parts,'hole','Kapı açıklığı','hole',prism('z',[[dx0,yf],[dx0+dw,yf],[dx0+dw,yf+dh-dw/2],[dx0+dw/2,yf+dh],[dx0,yf+dh-dw/2]],D,1),{deco:true});
  const Lp=R(D*0.55);
  BOX(parts,'baffle','Rüzgâr bölmesi',m,dx0-58,yf,D-18-Lp,18,R(Hb*0.85),Lp,{cutNote:'kışın soğuk havayı yatak bölümünden uzak tutar'});
  const ov=80, z1=-ov, z2=vr?D+Dv+60:D+ov, rl=R(Math.hypot(z2-z1,s*(z2-z1))), nrs=Math.ceil((W+2*ov)/1220), rsw=(W+2*ov)/nrs;
  for(const x of [35,R(W/2),W-35]) PART(parts,'rafter','Çatı kirişi',LM('emp',45,70),barRings([x,yr(z1)+22.5,z1],[x,yr(z2)+22.5,z2],45,70,[1,0,0]),{cut:[rl,70,45],cutNote:'duvarların üstüne yatık oturur'});
  for(let i=0;i<nrs;i++){const xc=-ov+rsw*(i+.5);
    PART(parts,'roof','Çatı levhası (menteşeli)',m,barRings([xc,yr(z1)+54,z1],[xc,yr(z2)+54,z2],rsw,18,[0,1,0]),{cut:[rl,R(rsw),18]});
    PART(parts,'shingle','Shingle kaplama','shingle',barRings([xc,yr(z1)+65,z1],[xc,yr(z2)+65,z2],rsw,4,[0,1,0]),{deco:true});}
  const c={parts,hw:[['Bitümlü shingle + çatı keçesi',`${dec(R((W+2*ov)*rl/1e6*1.2*10)/10)} m²`,''],['Piyano menteşesi',`${W} mm`,'çatı arkadan açılır'],['Galvaniz vida 5×60','1 kutu',''],['Paslanmaz vida 4×40','1 kutu',''],
      ['Ahşap tutkalı (D3)','1 şişe',''],['Kalın PVC şerit kapı perdesi',`${dw} × ${dh} mm`,'kışın'],['Zehirsiz dış mekân boyası ya da yağı','1 L','2 kat']],join:'Vida + tutkal',
    notes:[{t:'tip',x:`İç taban ${W} × ${D} mm, ön yükseklik ${H} mm. Kapı ${dw} × ${dh} mm, girişin arkasındaki rüzgâr bölmesi yatak bölümünü korur.${vr?` Önde ${Dv} mm üstü kapalı veranda var.`:''}`},
      {t:'tip',x:'Ölçü seçimi: iç uzunluk köpeğin burnundan kuyruk köküne boyundan 30 cm fazla, iç yükseklik oturan köpeğin başından 10 cm fazla olsun. Fazla büyük kulübe kışın ısınmaz.'},
      {t:'warn',x:'Kulübeyi doğrudan toprağa koyma; kirişler tabanı yerden kaldırır. Çatıyı yalnızca temizlikte aç. İç yüzleri boyama; köpek kemirebilir.'}]};
  c.tools=stdTools(['daire','ray','dekupaj','aciOlcer','metre','gonye','kalem','terazi','matkap','havsa',['koseIsk','2 adet'],['isk','2 adet'],'zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray','aciOlcer'],x:cutUL(c,K)},
    {t:'Taban ve kirişler',add:onlyG(parts,['runner','floor','deck']),tools:['matkap','terazi'],x:`<p>${K('runner')} kirişleri ${R(D+Dv)} mm boyunda yan yana koy, ${K('floor')} tabanı üstüne vidala${vr?`; önde kalan kısma ${K('deck')} veranda tahtalarını 5 mm arayla çak`:''}. Terazile.</p>`},
    {t:'Kapıyı kes',add:['hole'],tools:['dekupaj','zimKag'],x:`<p>${K('front')} ön duvarın sağ yanına ${dw} mm genişlikte, ${dh} mm yükseklikte kemerli kapı çiz. Köşelere delik açıp dekupajla kes, kenarlarını yuvarlat.</p>`},
    {t:'Duvarları ve bölmeyi kur',add:['back','front','side','baffle'],tools:['matkap','koseIsk','havsa'],x:`<p>${K('side')} yan duvarların üst kenarını eğimle kes. ${K('back')} arka ve ${K('front')} ön duvarı yanlarla tabana tutkal ve vidayla bağla. ${K('baffle')} rüzgâr bölmesini kapının soluna, ön duvardan içeri ${Lp} mm uzanacak şekilde vidala.</p>`},
    {t:'Çatıyı tak',add:onlyG(parts,['post','rafter','roof','shingle']),tools:['matkap','aciOlcer'],x:`<p>${vr?`${K('post')} veranda dikmelerini ön köşelere vidala. `:''}${K('rafter')} çatı kirişlerini duvarların üstüne otur. ${K('roof')} çatı levhalarını kirişlere vidala, arka kenarı piyano menteşesiyle duvara bağla. Keçe ve shingle ile kapla.</p>`},
    finishStep({outdoor:1},'<p>Yalnızca dış yüzleri boya; iç yüzler çıplak kalsın.</p>')];
  return c;
}

/* ---------- 2026-11-05 (12): kombi ve makine dolabı, petek örtüsü, klozet üstü raf, duş ızgarası, rahle, okey ıstakası, sedir ---------- */
const slotHoles=(parts,name,ax,list,a0)=>list.forEach(poly=>PART(parts,'vent',name,'hole',prism(ax,poly,a0,1),{deco:true}));

/* 91) Kombi dolabı / çamaşır makinesi dolabı */
function applianceCab(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, m=o.mat||'ply18', kombi=o.kind==='kombi';
  for(const x of [0,W-18]) BOX(parts,'side','Yan',m,x,0,0,18,H,D);
  BOX(parts,'top','Üst',m,18,H-18,0,W-36,18,D);
  if(kombi){
    BOX(parts,'cleat','Duvar askı çıtası',m,18,H-108,0,W-36,90,18,{cutNote:'45° yarılıp yarısı duvara vidalanır'});
    BOX(parts,'door','Kapak (panjurlu)',m,2,40,D,W-4,H-42,18,{cutNote:'alt ve üstüne havalandırma yarıkları açılır'});
    const n=Math.max(3,Math.floor((W-120)/60)), xs=spread(n,60,W-60,30);
    slotHoles(parts,'Havalandırma yarığı','z',xs.flatMap(x=>[[[x,80],[x+30,80],[x+30,200],[x,200]],[[x,H-200],[x+30,H-200],[x+30,H-80],[x,H-80]]]),D+18);
    PART(parts,'flue','Baca deliği (Ø130)','hole',prism('y',circlePoly(W/2,R(D*0.45),65,24),H,1),{deco:true});
  } else {
    const ys=900;
    BOX(parts,'shelf','Makine üstü tabla',m,18,ys,0,W-36,18,D);
    BOX(parts,'back','Arkalık','ply6',18,ys+18,0,W-36,H-ys-36,6);
    BOX(parts,'shelf2','Ara raf',m,18,R(ys+18+(H-ys-36)/2),6,W-36,18,D-26);
    const dw=(W-4)/2;for(let i=0;i<2;i++) BOX(parts,'door','Kapak',m,2+i*dw,ys+20,D,dw-2,H-ys-22,18);
    BOX(parts,'kick','Alt bağlantı (arka)',m,18,0,0,W-36,90,18,{cutNote:'yanları alttan birbirine bağlar'});
  }
  const hw=kombi?[['Konfirmat 7×50','1 kutu',''],['Kapak menteşesi 35 mm (yarım bindirme)','2 adet',''],['Mıknatıslı kapak tutucu','1 adet',''],['Dübel 8 mm + vida 6×70','4 takım','askı çıtası duvara'],['Isıya dayanıklı su bazlı boya','0,5 L','']]
    :[['Konfirmat 7×50','1 kutu',''],['Kapak menteşesi 35 mm (frenli)','4 adet',''],['Kulp','2 adet',''],['Raf pimi 5 mm','4 adet',''],['Duvar bağlantı köşebendi + dübel','2 takım','devrilmeye karşı'],['Su bazlı vernik ya da boya','0,75 L','']];
  const c={parts,hw,join:'Konfirmat + tutkal',
    notes:kombi?[{t:'tip',x:`İç ölçü ${W-36} × ${H-18} × ${D} mm. Altı boru bağlantıları için açık, üstte baca deliği, kapakta alt ve üst havalandırma yarıkları var.`},
      {t:'warn',x:'Kombinin her yanında üreticinin istediği boşluğu bırak (çoğunlukla yanlarda 50 mm, önde 50 mm). Baca borusunu ve havalandırmayı asla kapatma; dolap kurulmadan önce yetkili servise danış.'}]
    :[{t:'tip',x:`Altta ${W-36} mm genişliğinde, ${900} mm yüksekliğinde makine boşluğu; üstte kapaklı dolap. Önden yüklemeli çamaşır ya da kurutma makinesi için.`},
      {t:'warn',x:'Makine titreşir: tabla makineye değmesin, arada en az 20 mm boşluk kalsın. Dolabı duvara sabitle; ıslak alanda MDF yerine kontrplak tercih et.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','terazi','matkap','konfUc','havsa',['forstnerSet','35 mm uç'],'dekupaj',['isk','2 adet'],'zimKag',m==='mdf18'?'boya':'firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:cutUL(c,K)},
    {t:'Gövdeyi kur',add:onlyG(parts,['side','top','cleat','shelf','back','shelf2','kick']),tools:['matkap','konfUc','gonye'],x:kombi?`<p>${K('side')} yanları ${K('top')} üst parçayla konfirmatla birleştir. ${K('cleat')} askı çıtasını boyuna 45° yar; bir yarısını dolabın arkasına, diğerini terazide duvara vidala. Üstteki Ø130 baca deliğini dekupajla aç.</p>`
      :`<p>${K('side')} yanları ${K('top')} üst, ${K('shelf')} makine üstü tabla ve ${K('kick')} alt bağlantıyla konfirmatla birleştir. ${K('back')} arkalığı üst bölüme çak, ${K('shelf2')} rafı pimlere otur.</p>`},
    {t:'Kapakları tak',add:['door',...onlyG(parts,['vent','flue'])],tools:['forstnerSet','matkap','dekupaj'],x:`<p>${K('door')} kapaklara 35 mm uçla menteşe yuvası aç.${kombi?' Kapağın altına ve üstüne havalandırma yarıklarını çiz; köşelere delik açıp dekupajla kes.':''} Kapakları tak, aralıkları eşitle.</p>`},
    {t:'Yerine as',tools:['terazi','matkap'],x:kombi?'<p>Dolabı kombinin üstünden indirerek duvardaki askı çıtasına oturt; kombinin bağlantılarına ve basınç göstergesine kapak açıkken rahat ulaşılmalı.</p>':'<p>Dolabı makinenin üstünden yerleştir, terazile ve köşebentlerle duvara sabitle.</p>'},
    finishStep(m==='mdf18'?{paint:1}:{})];
  return c;
}

/* 92) Kalorifer peteği örtüsü */
function radiatorCover(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, m=o.mat||'mdf18';
  for(const x of [0,W-18]) BOX(parts,'side','Yan',m,x,0,0,18,H,D);
  BOX(parts,'top','Üst tabla',m,-20,H,0,W+40,18,D+20,{cutNote:'ön ve yan kenarları yuvarlatılır'});
  BOX(parts,'railT','Üst ön kuşak',m,18,H-90,D-18,W-36,90,18);
  BOX(parts,'railB','Alt ön kuşak',m,18,0,D-18,W-36,90,18);
  const n=Math.max(4,Math.floor((W-36+20)/50));
  spread(n,18,W-18,30).forEach(x=>BOX(parts,'slat','Izgara çıtası',m,x,90,D-18,30,H-180,18,{cutNote:'plakadan 30 mm şerit'}));
  BOX(parts,'cleat','Duvar takozu',LM('cam',20,45),18,H-60,0,W-36,45,20);
  const c={parts,hw:[['Ahşap tutkalı','1 şişe',''],['Gizli vida / kavela 8×35',`${n*2+12} adet`,'çıtalar'],['L köşebent + dübel','2 takım','duvara sabitleme'],['Isıya dayanıklı su bazlı boya ve astar','1 L','']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`${W} × ${H} × ${D} mm; ${n} çıtalı ön ızgara. Örtü peteğin her yanından en az 50 mm, üstten 50 mm geniş olmalı.`},
      {t:'warn',x:'Örtü peteğin ısı verimini %10-20 düşürebilir; ön ızgarayı ve alt kısmı açık tut, termostatlı vanaya erişim bırak. MDF kesiminde toz maskesi tak.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','matkap','dubelSet',['isk','4 adet'],'freze','zimKag','boya']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:cutUL(c,K)},
    {t:'Ön ızgarayı kur',add:['railT','railB','slat'],tools:['dubelSet','isk','metre'],x:`<p>${K('railT')} ve ${K('railB')} kuşakların arasına ${n} ${K('slat')} çıtayı 20 mm arayla kavelayla tutkalla; aralıkları bir takozla eşitle.</p>`},
    {t:'Yanları ve tablayı bağla',add:['side','top','cleat'],tools:['matkap','dubelSet','freze'],x:`<p>Izgarayı ${K('side')} yanların ön kenarına bağla. ${K('top')} tablanın kenarlarını yuvarlat, üstten kavelayla otur. ${K('cleat')} takozu arkaya yerleştir; örtü bununla duvara köşebentle sabitlenir.</p>`},
    finishStep({paint:1},'<p>Isıya dayanıklı astar ve boya kullan; boya tam kurumadan peteği yakma.</p>')];
  return c;
}

/* 93) Klozet üstü raf */
function toiletShelf(p,o){
  const parts=[], W=p.W, H=p.H, D=p.D, sp=o.sp||'cam', lg=LM(sp,20,45), y0=1050;
  for(const x of [0,W-20]) for(const z of [0,D-45]) BOX(parts,'leg','Dikme',lg,x,0,z,20,H,45);
  for(const x of [0,W-20]) for(const y of [150,y0-60]) BOX(parts,'rail','Yan kuşak',lg,x,y,45,20,45,D-90);
  const ys=[y0,R(y0+(H-y0-20)/2),H-20];
  ys.forEach(y=>BOX(parts,'shelf','Raf',WORKTOP(sp,20,D),20,y,0,W-40,20,D));
  ys.forEach(y=>BOX(parts,'lip','Raf arka çıtası',LM(sp,15,40),20,y+20,0,W-40,40,15));
  const c={parts,hw:[['Kavela 8×35','24 adet',''],['Su geçirmez tutkal (D3)','1 şişe',''],['Duvar bağlantı köşebendi + dübel','2 takım','devrilmeye karşı'],['Kaydırmaz keçe ayak','4 adet',''],['Su bazlı yat verniği','0,5 L','3 kat']],join:'Kavela + tutkal',
    notes:[{t:'tip',x:`İç açıklık ${W-40} mm, ilk raf yerden ${y0} mm: çoğu klozet ve rezervuarın üstünde kalır. Ölçmeden önce rezervuar kapağının açılabildiğini kontrol et.`},
      {t:'warn',x:'Banyo nemlidir; tüm yüzeylere, özellikle dikmelerin alt uçlarına 3 kat su geçirmez vernik sür. Rafı mutlaka duvara sabitle.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','dubelSet',['isk','4 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT'],x:cutUL(c,K)},
    {t:'Yan merdivenleri kur',add:['leg','rail'],tools:['dubelSet','isk','gonye'],x:`<p>İki ${K('leg')} dikmeyi ${K('rail')} kuşaklarla kavelayla birleştir; biri altta, biri ilk rafın hemen altında. İkinci yanı aynısı olarak yap.</p>`},
    {t:'Rafları tak',add:['shelf','lip'],tools:['dubelSet','matkap','gonye'],x:`<p>${K('shelf')} rafları iki yan arasına ${ys.join(', ')} mm yüksekliklerde kavelayla otur; ${K('lip')} arka çıtalarını rafların arkasına tutkalla, eşyalar arkaya düşmez.</p>`},
    finishStep({},'<p>Islak alanda yat verniği kullan.</p>')];
  return c;
}

/* 94) Duş ızgarası (banyo paspası) */
function showerMat(p,o){
  const parts=[], W=p.W, D=p.D, sp=o.sp||'mese', bt=LM(sp,20,40), sl=LM(sp,20,70);
  [30,R(W/2-20),W-70].forEach(x=>BOX(parts,'batten','Alt kiriş',bt,x,0,0,40,20,D,{cutNote:'uçları pahlanır'}));
  const n=Math.max(3,Math.floor((D+8)/78));
  spread(n,0,D,70).forEach(z=>BOX(parts,'slat','Üst çıta',sl,0,20,z,W,20,70,{cutNote:'üst kenarları R3 yuvarlatılır'}));
  const c={parts,hw:[['Paslanmaz vida 3,5×30',`${n*6} adet`,'alttan'],['Su geçirmez tutkal (D3)','1 şişe',''],['Kaydırmaz silikon ayak','6 adet',''],['Tik yağı ya da dış mekân yağı','0,25 L','ayda bir tazelenir']],join:'Paslanmaz vida (alttan)',
    notes:[{t:'tip',x:`${W} × ${D} mm, ${n} çıta, 8 mm su aralığı. Vidalar alttan gelir; basılan yüzde vida başı olmaz.`},
      {t:'warn',x:'Suya en dayanıklısı tik, iroko ya da meşedir; kayın ve çamı ıslak alanda kullanma. Haftada bir kaldırıp kurut, altında küf oluşmasın.'}]};
  c.tools=stdTools(['gonyeT','metre','gonye','kalem','matkap','havsa','freze','zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT'],x:cutUL(c,K)},
    {t:'Kenarları yuvarlat',tools:['freze','zimMak'],x:`<p>${K('slat')} çıtaların üst kenarlarını ve uçlarını yuvarlat, ${K('batten')} kirişlerin uçlarını pahla. 180 kuma kadar zımparala.</p>`},
    {t:'Birleştir',add:['batten','slat'],tools:['matkap','havsa','metre'],x:`<p>Kirişleri yere diz, çıtaları ters çevirip üstlerine 8 mm arayla yerleştir (8 mm'lik bir takozu ara ölçü olarak kullan). Kirişlerin altından her çıtaya ikişer paslanmaz vida at.</p>`},
    finishStep({},'<p>Vernik yerine tik yağı kullan; vernik ıslakta kabarır.</p>')];
  return c;
}

/* 95) Rahle (çapraz katlanır kitap sehpası) */
function bookRest(p,o){
  const parts=[], W=p.W, L=p.L, sp=o.sp||'ceviz', A=deg(58), Lc=L*Math.cos(A), Lh=L*Math.sin(A), bm=WORKTOP(sp,15,W);
  const brd=(a,b,name)=>{const d=v3.norm(v3.sub(b,a)), n=[0,-d[2],d[1]];PART(parts,'board',name,bm,barRings(a,b,W,15,n),{cut:[L+20,W,15],cutNote:'ortadaki geçme parmaklar şablonla kesilir'});};
  brd([W/2,0,0],[W/2,Lh,Lc],'Ön kanat');
  brd([W/2,0,Lc],[W/2,Lh,0],'Arka kanat');
  PART(parts,'pin','Menteşe pimi','kav12',cylRings([-6,Lh/2,Lc/2],[W+6,Lh/2,Lc/2],6,6),{cut:[W+12,12,12]});
  const c={parts,hw:[['Ahşap pim Ø12 (ya da pirinç çubuk)',`${W+12} mm`,'iki kanadın döndüğü mil'],['Sert yağ ya da şellak','0,1 L',''],['Keçe şerit','4 parça','uçların altına']],join:'Geçme parmak + pim',
    notes:[{t:'tip',x:`Açıkken ${R(Lc)} mm derinlikte, ${R(Lh)} mm yükseklikte; kitap üstteki V oyuğuna yatar. Kapanınca ${L} × ${W} × 30 mm yassı bir tahtaya döner.`},
      {t:'tip',x:'Geleneksel rahle tek tahtadan, ortası geçmeli olarak yarılıp açılır. Burada iki tahta kullanılıyor: ortadaki parmaklar sırayla birine ve diğerine aittir, pim hepsinden geçer.'}]};
  c.tools=stdTools(['gonyeT','dekupaj','metre','gonye','kalem','pergel','matkap',['forstnerSet','12 mm uç'],['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT'],x:cutUL(c,K)},
    {t:'Geçme parmakları çiz ve kes',add:['board'],tools:['kalem','dekupaj','elT'],x:`<p>İki ${K('board')} kanadı üst üste işkencele. Ortada, ${W} mm genişliği 5 eşit parmağa böl; tek sıradakiler birinci, çift sıradakiler ikinci kanatta kalacak. Parmakları 30 mm boyunda kes, uçlarını yuvarlat.</p>`},
    {t:'Pimi tak',add:['pin'],tools:['forstnerSet','matkap'],x:`<p>Kanatları geçirip parmakların ortasından 12 mm delik del (delik yan kenardan yan kenara düz gitmeli). ${K('pin')} pimi geçir, uçlarını kesip zımparala. Kanatları açıp kapatarak dene.</p>`},
    finishStep({})];
  return c;
}

/* 96) Okey ıstakası (4'lü takım) */
function okeyRack(p,o){
  const parts=[], L=p.L, sp=o.sp||'ceviz', bm=LM(sp,45,70), n=4;
  const prof=[[0,0],[70,0],[70,12],[64,12],[60,6],[40,6],[36,28],[18,28],[12,45],[0,45]];
  for(let i=0;i<n;i++){const z0=i*100;
    PART(parts,'rack','Istaka',bm,prism('x',prof.map(([z,y])=>[z0+z,y]),0,L),{cut:[L,70,45],cutNote:'iki basamaklı profil testere ve frezeyle açılır'});
    for(const x of [40,L-60]) BOX(parts,'pad','Keçe ayak','felt',x,-2,z0+20,20,2,30,{deco:true});}
  if(o.box!==false){const bw=R(L*0.5),bd=200;
    for(const z of [n*100,n*100+bd-12]) BOX(parts,'boxF','Taş kutusu önü/arkası','ply12',0,0,z,bw,80,12);
    for(const x of [0,bw-12]) BOX(parts,'boxS','Taş kutusu yanı','ply12',x,0,n*100+12,12,80,bd-24);
    BOX(parts,'boxB','Taş kutusu tabanı','ply6',12,0,n*100+12,bw-24,6,bd-24);}
  const c={parts,hw:[['Keçe şerit','8 parça','ıstaka altına'],['Ahşap tutkalı','1 şişe',''],['Sert yağ ya da şellak','0,1 L','']],join:'Profil kesim + tutkal',
    notes:[{t:'tip',x:`${n} ıstaka, her biri ${L} mm; iki basamağa toplam ${Math.floor(L/40)*2} taş sığar (taş genişliği yaklaşık 40 mm).`},
      {t:'tip',x:'Basamakları ayarlı testere ya da freze tezgâhıyla, aynı ayarda dört ıstakaya birden aç; böylece hepsi tıpatıp aynı olur.'}]};
  c.tools=stdTools(['gonyeT','daire','metre','gonye','kalem','freze',['isk','2 adet'],'zimMak','zimKag','firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['gonyeT'],x:cutUL(c,K)},
    {t:'Basamakları aç',add:['rack'],tools:['daire','freze'],x:`<p>${K('rack')} ıstakaların uç kesitine profili çiz: önde 12 mm dudak, alt basamak 6 mm, üst basamak 28 mm yükseklikte. Testere ve frezeyi bir kez ayarlayıp dört ıstakayı sırayla geçir; basamakların dibini hafif geriye eğimli aç ki taşlar yaslansın.</p>`},
    ...(o.box!==false?[{t:'Taş kutusunu yap',add:['boxF','boxS','boxB'],tools:['matkap','isk'],x:`<p>${K('boxF')} ve ${K('boxS')} parçaları köşelerden tutkalla birleştir, ${K('boxB')} tabanı alta çak.</p>`}]:[]),
    {t:'Keçeleri yapıştır',add:['pad'],tools:['bicak'],x:'<p>Bitiş kuruyunca ıstakaların altına keçe şerit yapıştır; masayı çizmez.</p>'},
    finishStep({})];
  return c;
}

/* 97) Sedir (sandıklı yer divanı) */
function sedir(p,o){
  const parts=[], W=p.W, D=p.D, H=p.H, m=o.mat||'ply18', Hp=H-118;
  for(const x of [0,W-18]) BOX(parts,'side','Yan',m,x,0,0,18,Hp,D);
  BOX(parts,'front','Ön panel',m,18,0,D-18,W-36,Hp,18);BOX(parts,'back','Arka panel',m,18,0,0,W-36,Hp,18);
  BOX(parts,'bottom','Taban',m,18,0,18,W-36,18,D-36);
  const nd=Math.max(0,Math.ceil((W-36)/900)-1), dx=Array.from({length:nd},(_,i)=>R(18+(W-36)*(i+1)/(nd+1)-9));
  dx.forEach(x=>BOX(parts,'div','Ara bölme',m,x,18,18,18,Hp-18,D-36));
  const edges=[0,...dx.map(x=>x+9),W];
  for(let i=0;i<edges.length-1;i++) BOX(parts,'lid','Kapak (menteşeli)',m,edges[i]+1.5,Hp,0,edges[i+1]-edges[i]-3,18,D);
  BOX(parts,'cush','Oturma minderi (100 mm)','foam',0,Hp+18,0,W,100,D,{deco:true});
  BOX(parts,'bcush','Sırt minderi','foam',0,Hp+118,0,W,400,150,{deco:true});
  const c={parts,hw:[['Konfirmat 7×50','1 kutu',''],['Piyano menteşesi',`${W} mm`,'kapakların arka kenarı'],['Kapak amortisörü (yavaş kapanan)',`${(nd+1)*2} adet`,'parmak sıkışmaz'],
      ['Sünger DT 35, 100 mm + kılıf',`${W} × ${D} mm`,'oturma'],['Sırt minderi',`${Math.ceil(W/600)} adet`,'duvara yaslanır'],['Keçe ayak','6 adet',''],['Su bazlı vernik ya da boya','1 L','']],join:'Konfirmat + tutkal',
    notes:[{t:'tip',x:`${W} × ${D} mm, minderle oturma yüksekliği ${H} mm. Altında kapaklı ${nd+1} sandık bölmesi var; yatak takımı, yastık ve kışlıklar için.`},
      {t:'tip',x:'L köşe sedir için iki gövde yap; kısa olanı uzunun ucuna dik koyup birbirine vidala.'}]};
  c.tools=stdTools(['daire','ray','metre','gonye','kalem','matkap','konfUc','havsa',['koseIsk','2 adet'],['isk','2 adet'],'zimKag',m==='mdf18'?'boya':'firca']);
  c.mkSteps=K=>[
    {t:'Parçaları kes',tools:['daire','ray'],x:cutUL(c,K)},
    {t:'Kasayı kur',add:onlyG(parts,['side','front','back','bottom','div']),tools:['matkap','konfUc','koseIsk'],x:`<p>${K('bottom')} tabanın çevresine ${K('front')} ön, ${K('back')} arka ve ${K('side')} yan panelleri konfirmatla bağla.${nd?` ${K('div')} ara bölmeleri eşit aralıkla yerleştir.`:''} Çaprazları eşitle.</p>`},
    {t:'Kapakları tak',add:['lid'],tools:['matkap','metre'],x:`<p>${K('lid')} kapakları arka kenarından piyano menteşesiyle bağla, her kapağa iki amortisör tak.</p>`},
    {t:'Minderleri yerleştir',add:['cush','bcush'],tools:[],x:'<p>Oturma süngerini kılıfıyla kapakların üstüne, sırt minderlerini duvara yasla. Kapakları açarken minderi kaldırman yeterli.</p>'},
    finishStep(m==='mdf18'?{paint:1}:{})];
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
/* 2026-11-04 (2): salıncak, oturma grubu, epoksi masa */
F3({id:'bahce-salincagi',name:'Bahçe salıncağı',cat:'Bahçe ve dış mekân',b:swing,level:3,time:'2 gün',tags:'salıncak bank zincir a çerçeve veranda',desc:'A ayaklı çerçeveye zincirle asılan, sırtlı ve kolçaklı salıncak bankı.',
  P:{W:[1000,1600,10],H:[2000,2500,10],D:[1400,2200,10]},def:()=>({W:1200,H:2200,D:1800}),o:{frame:true},ax:[['W',[1000,1200,1500]],['sp',['emp','mese'],SPL]],lbl:{W:'Bank genişliği',H:'Çerçeve yüksekliği',D:'Taban açıklığı'}});
F3({id:'veranda-salincagi',name:'Veranda salıncağı',cat:'Bahçe ve dış mekân',b:swing,level:2,time:'1 gün',tags:'salıncak bank zincir tavan balkon teras',desc:'Veranda tavanına ya da pergole kirişine zincirle asılan salıncak bankı.',
  P:{W:[1000,1600,10],H:[2200,3500,10]},def:()=>({W:1200,H:2600}),o:{},ax:[['W',[1000,1200,1500]],['sp',['emp','mese'],SPL]],lbl:{W:'Bank genişliği',H:'Kanca yüksekliği'}});
F3({id:'cocuk-salincagi',name:'Çocuk salıncağı',cat:'Bahçe ve dış mekân',b:swing,level:2,time:'1,5 gün',tags:'salıncak çocuk oyun bahçe halat a çerçeve',desc:'A ayaklı çerçeve ve halatlı tahta oturaklarla bahçe çocuk salıncağı.',
  P:{N:[1,2,1],H:[1800,2400,10],D:[1200,2000,10]},def:()=>({H:2100,D:1600}),o:{frame:true,seat:'kids'},ax:[['N',[1,2]],['sp',['emp','cam'],SPL]],nl:'oturaklı',lbl:{H:'Çerçeve yüksekliği',D:'Taban açıklığı'}});
F3({id:'tekli-koltuk',name:'Tekli koltuk',cat:'Bahçe ve dış mekân',b:lounge,level:2,time:'1 gün',tags:'koltuk oturma grubu minder bahçe salon',desc:'Kolçaklı, çıtalı gövdeli, minderli tekli koltuk.',
  P:{W:[700,1000,10],D:[700,950,10],H:[380,460,5]},def:()=>({W:800,D:820,H:420}),o:{type:'chair'},ax:[['W',[750,850]],['sp',['emp','mese','cam'],SPL]]});
F3({id:'kanepe',name:'Kanepe',cat:'Bahçe ve dış mekân',b:lounge,level:3,time:'1,5 gün',tags:'kanepe divan oturma grubu minder bahçe salon',desc:'İki ya da üç kişilik, kolçaklı, minderli çıtalı kanepe.',
  P:{W:[1200,2400,10],D:[700,950,10],H:[380,460,5]},def:()=>({W:1800,D:820,H:420}),o:{},ax:[['W',[1400,1800,2100]],['sp',['emp','mese','cam'],SPL]]});
F3({id:'kose-kanepe',name:'Köşe kanepe',cat:'Bahçe ve dış mekân',b:lounge,level:3,time:'2,5 gün',tags:'köşe takımı l kanepe oturma grubu minder bahçe salon',desc:'İki koldan oluşan, minderli L biçimli köşe kanepe.',
  P:{W:[1600,2800,10],W2:[1400,2400,10],D:[700,950,10],H:[380,460,5]},def:()=>({W:2200,W2:1800,D:820,H:420}),o:{type:'corner'},ax:[['W',[2000,2400]],['W2',[1600,2000]],['sp',['emp','mese'],SPL]],lbl:{W:'Uzun kol',W2:'Kısa kol'}});
F3({id:'epoksi-yemek-masasi',name:'Epoksi yemek masası',cat:'Ev mobilyası',b:riverTable,level:3,time:'1 hafta (döküm kuruması dahil)',tags:'nehir masa river table epoksi reçine kütük canlı kenar',desc:'İki canlı kenarlı kütüğün arasına epoksi nehir dökülen yemek masası.',
  P:{L:[1200,2400,10],W:[700,1100,10],H:[720,780,5],R:[60,300,10]},def:()=>({L:1800,W:900,H:750,R:150}),o:{T:50},ax:[['L',[1600,1800,2000]],['W',[800,900,1000]],['legs',['metal','wood'],{metal:'metal ayaklı',wood:'ahşap ayaklı'}],['sp',['ceviz','mese'],SPL]],lbl:{R:'Nehir genişliği'}});
F3({id:'epoksi-sehpa',name:'Epoksi orta sehpa',cat:'Ev mobilyası',b:riverTable,level:3,time:'5 gün (döküm kuruması dahil)',tags:'nehir sehpa river table epoksi reçine kütük canlı kenar',desc:'Canlı kenarlı kütükler ve epoksi nehirli salon sehpası.',
  P:{L:[800,1400,10],W:[450,800,10],H:[350,480,5],R:[60,250,10]},def:()=>({L:1100,W:600,H:420,R:120}),o:{T:40},ax:[['L',[1000,1200]],['legs',['metal','wood'],{metal:'metal ayaklı',wood:'ahşap ayaklı'}],['sp',['ceviz','mese'],SPL]],lbl:{R:'Nehir genişliği'}});
/* 2026-11-04 (3): pergola, paravan, servis arabası, oyun çadırı, bisiklet standı, ranza */
F3({id:'pergola',name:'Pergola',cat:'Bahçe ve dış mekân',b:pergola,level:3,time:'3 gün',tags:'çardak gölgelik teras veranda bahçe yapısı',desc:'Dört dikmeli, payandalı, istenirse gölgelik çıtalı bahçe pergolesi.',
  P:{L:[2000,4500,10],W:[2000,4000,10],H:[2300,2800,10]},def:()=>({L:3000,W:3000,H:2500}),o:{},ax:[['L',[2500,3000,3600]],['shade',[false,true],{false:'açık',true:'gölgelikli'}],['sp',['emp','cam'],SPL]],lbl:{L:'Genişlik',W:'Derinlik',H:'Yükseklik'}});
F3({id:'duvar-pergolasi',name:'Duvara bitişik pergola',cat:'Bahçe ve dış mekân',b:pergola,level:3,time:'2,5 gün',tags:'çardak gölgelik teras veranda balkon duvar',desc:'Bir tarafı duvar kirişine bağlanan, iki dikmeli teras pergolesi.',
  P:{L:[2000,4500,10],W:[1500,3500,10],H:[2300,2800,10]},def:()=>({L:3000,W:2500,H:2500}),o:{wall:true},ax:[['L',[2500,3000,3600]],['shade',[false,true],{false:'açık',true:'gölgelikli'}],['sp',['emp','cam'],SPL]],lbl:{L:'Genişlik',W:'Derinlik',H:'Yükseklik'}});
F3({id:'paravan',name:'Paravan',cat:'Ev mobilyası',b:screen,level:2,time:'1 gün',tags:'oda bölücü bölme ekran katlanır hasır',desc:'Menteşeli panellerden oluşan, çıtalı ya da hasır dolgulu katlanır oda bölücü.',
  P:{N:[2,5,1],W:[400,600,10],H:[1500,1900,10]},def:()=>({W:450,H:1700}),o:{},ax:[['N',[3,4]],['fill',['slat','rattan'],{slat:'çıtalı',rattan:'hasır'}],['sp',['kayin','mese'],SPL]],nl:'panelli',lbl:{W:'Panel genişliği'}});
F3({id:'servis-arabasi',name:'Servis arabası',cat:'Mutfak ve küçük eşya',b:barCart,level:2,time:'1 gün',tags:'bar arabası tekerlekli çay arabası mutfak sehpa',desc:'Kenarlıklı rafları ve tutamağı olan tekerlekli servis ve bar arabası.',
  P:{L:[500,900,10],W:[350,550,10],H:[750,950,10],N:[2,3,1]},def:()=>({L:700,W:420,H:850}),o:{brake:true},ax:[['N',[2,3]],['sp',['mese','ceviz','kayin'],SPL]],nl:'raflı'});
F3({id:'oyun-cadiri',name:'Çocuk oyun çadırı',cat:'Çocuk',b:teepee,level:1,time:'4 saat',tags:'tipi teepee çadır okuma köşesi çocuk odası oyun',desc:'Kavela direkli, kumaş örtülü, katlanıp kaldırılabilen tipi çadır.',
  P:{N:[4,6,1],D:[1000,1300,10],H:[1300,1600,10]},def:()=>({D:1150,H:1500}),o:{},ax:[['N',[4,5]],['H',[1400,1550]]],nl:'direkli',lbl:{D:'Taban çapı'}});
F3({id:'bisiklet-standi',name:'Bisiklet standı',cat:'Atölye',b:bikeStand,level:1,time:'4 saat',tags:'bisiklet park garaj bahçe zemin',desc:'Tekerlek yuvalı, yere konan bisiklet park standı.',
  P:{N:[1,5,1],W:[300,450,10],D:[400,600,10]},def:()=>({W:350,D:500}),o:{},ax:[['N',[2,3,4]],['sp',['cam','emp'],SPL]],nl:'bisikletlik',lbl:{W:'Bisiklet aralığı',D:'Derinlik'}});
F3({id:'bisiklet-askisi',name:'Bisiklet duvar askısı',cat:'Atölye',b:bikeStand,level:1,time:'3 saat',tags:'bisiklet askı duvar garaj balkon',desc:'Bisikleti üst borusundan taşıyan, iki kollu duvar askısı.',
  P:{N:[1,4,1],W:[400,700,10],H:[350,600,10]},def:()=>({W:500,H:450}),o:{wall:true},ax:[['N',[1,2,3]],['sp',['cam','mese'],SPL]],nl:'bisikletlik',lbl:{W:'Bisiklet aralığı',H:'Tahta boyu'}});
F3({id:'ranza',name:'Ranza',cat:'Ev mobilyası',b:bunk,level:3,time:'2,5 gün',tags:'ranza iki katlı yatak çocuk odası merdivenli',desc:'Korkuluklu, merdivenli, sökülebilir iki katlı ranza.',
  P:{W:[800,1000,10],L:[1800,2000,10],H:[1500,1800,10]},def:()=>({W:900,L:1900,H:1650}),o:{},ax:[['W',[800,900]],['L',[1900,2000]],['sp',['cam','kayin'],SPL]],lbl:{W:'Şilte eni',L:'Şilte boyu',H:'Toplam yükseklik'}});
/* 2026-11-05: mutfak adası, alet kulübesi, hamak standı, okuma köşesi */
F3({id:'mutfak-adasi',name:'Mutfak adası',cat:'Mutfak ve küçük eşya',b:kitchenIsland,level:3,time:'2 gün',tags:'ada tezgah bar oturma mutfak dolabı kahvaltı',desc:'Masif tezgâhlı, kapaklı dolaplı, istenirse arkası bar taburesi çıkıntılı mutfak adası.',
  P:{L:[900,2400,10],W:[750,1100,10],H:[880,950,5]},def:()=>({L:1400,W:900,H:900}),o:{},ax:[['L',[1200,1500,1800]],['bar',[true,false],{true:'oturma çıkıntılı',false:'çıkıntısız'}],['mat',['ply18','mdf18','mlam18'],MATL]],lbl:{L:'Uzunluk',W:'Derinlik'}});
F3({id:'alet-kulubesi',name:'Bahçe alet kulübesi',cat:'Bahçe ve dış mekân',b:shed,level:3,time:'4 gün',tags:'kulübe depo bahçe alet barınak sundurma',desc:'Tek eğimli çatılı, kaplama tahtalı, ahşap iskeletli bahçe alet kulübesi.',
  P:{W:[1200,2400,10],D:[800,2000,10],H:[2000,2400,10]},def:()=>({W:1800,D:1200,H:2200}),o:{},ax:[['W',[1500,1800,2200]],['D',[1000,1400]],['door',['single','double'],{single:'tek kapılı',double:'çift kapılı'}]],lbl:{W:'Genişlik',D:'Derinlik',H:'Ön yükseklik'}});
F3({id:'hamak-standi',name:'Hamak standı',cat:'Bahçe ve dış mekân',b:hammockStand,level:2,time:'1 gün',tags:'hamak stand bahçe dinlenme ağaçsız',desc:'Ağaç gerektirmeyen, ayakları traversli serbest duran hamak standı.',
  P:{L:[3000,4200,10],H:[1100,1500,10]},def:()=>({L:3600,H:1300}),o:{},ax:[['L',[3200,3600,4000]],['sp',['emp','cam'],SPL]],lbl:{L:'Uçtan uca uzunluk',H:'Kol yüksekliği'}});
F3({id:'okuma-kosesi',name:'Okuma köşesi',cat:'Çocuk',b:readingNook,level:2,time:'1 gün',tags:'kitap köşesi montessori oturak kitaplık çocuk odası minder',desc:'Minderli oturağı, altı saklama bölmeli ve arkası kapağı önde kitap raflı çocuk okuma köşesi.',
  P:{W:[800,1400,10],D:[400,600,10],H:[900,1300,10]},def:()=>({W:1000,D:480,H:1100}),o:{},ax:[['W',[900,1200]],['mat',['ply18','mdf18'],MATL]],lbl:{W:'Genişlik',D:'Oturak derinliği',H:'Yükseklik'}});
/* 2026-11-05 (2): sarkıt raf, duvar konsolu, sebze masası, çocuk mutfağı, merdiven tabure */
F3({id:'sarkit-raf',name:'Halatlı sarkıt raf',cat:'Ev mobilyası',b:hangShelf,level:1,time:'3 saat',tags:'asma raf halat tavan bitki kitap bohem',desc:'Tavandan halatla sarkan, masif tahtalı katlı asma raf.',
  P:{L:[500,1200,10],D:[180,300,10],N:[2,4,1],S:[250,400,10],A:[300,1200,10]},def:()=>({L:800,D:220,S:300,A:600}),o:{},ax:[['N',[2,3]],['L',[600,800,1000]],['sp',['mese','ceviz','cam'],SPL]],nl:'raflı',lbl:{L:'Uzunluk',D:'Derinlik',S:'Raf aralığı',A:'Tavandan sarkma'}});
F3({id:'duvar-konsolu',name:'Duvar konsolu',cat:'Ev mobilyası',b:wallConsole,level:2,time:'5 saat',tags:'asma konsol duvara monte masa antre dar alan',desc:'Ayaksız, ahşap konsollarla duvara asılan masif tablalı konsol masa.',
  P:{L:[800,1600,10],D:[300,500,10],H:[720,800,5]},def:()=>({L:1000,D:380,H:760}),o:{},ax:[['L',[900,1200,1500]],['sp',['mese','ceviz'],SPL]],lbl:{L:'Uzunluk',D:'Derinlik'}});
F3({id:'sebze-masasi',name:'Yükseltilmiş sebze masası',cat:'Bahçe ve dış mekân',b:planterTable,level:2,time:'1 gün',tags:'bahçe yatağı balkon sebze ot yeşillik ayaklı saksı eğilmeden',desc:'Bel hizasında, ayaklı, çıtalı tabanlı ve keçe astarlı sebze yetiştirme masası.',
  P:{L:[800,1800,10],W:[400,700,10],H:[750,900,10],Dp:[150,300,10]},def:()=>({L:1200,W:600,H:820,Dp:220}),o:{},ax:[['L',[1000,1200,1500]],['shelf',[true,false],{true:'alt raflı',false:'raflı değil'}],['sp',['emp','cam'],SPL]],lbl:{L:'Uzunluk',W:'Genişlik',H:'Yükseklik',Dp:'Toprak derinliği'}});
F3({id:'cocuk-mutfagi',name:'Çocuk oyun mutfağı',cat:'Çocuk',b:playKitchen,level:2,time:'1,5 gün',tags:'oyuncak mutfak montessori evcilik çocuk odası',desc:'Fırın kapaklı, evyeli, ocaklı ve üst raflı ahşap oyuncak mutfak.',
  P:{W:[600,1000,10],D:[300,400,10],H:[850,1050,10]},def:()=>({W:800,D:340,H:950}),o:{},ax:[['W',[700,900]],['mat',['ply18','mdf18'],MATL]],lbl:{W:'Genişlik',D:'Derinlik'}});
F3({id:'merdiven-tabure',name:'Merdiven tabure',cat:'Ev mobilyası',b:stepStool,level:2,time:'5 saat',tags:'basamak merdiven tabure mutfak kitaplık üst raf',desc:'İki ya da üç basamaklı, tutma delikli kapalı yan panelli merdiven tabure.',
  P:{N:[2,3,1],W:[350,550,10],H:[380,700,10]},def:v=>({W:420,H:v.N>2?630:420}),o:{},ax:[['N',[2,3]],['sp',['kayin','mese'],SPL]],nl:'basamaklı',lbl:{W:'Genişlik',H:'Toplam yükseklik'}});
/* 2026-11-05 (3): giyinme odası, bahçe çiti, evcil hayvan merdiveni/rampası, katlanır tezgâh */
F3({id:'giyinme-odasi',name:'Giyinme odası dolap sistemi',cat:'Ev mobilyası',b:closetSystem,level:3,time:'2 gün',tags:'gardırop vestiyer açık dolap askılık ayakkabılık walk-in giyinme',desc:'Uzun ve çift askılı, raflı ve ayakkabılı açık modüllerden oluşan, duvara sabitlenen giyinme odası sistemi.',
  P:{W:[1200,3600,10],H:[2000,2600,10],D:[450,600,10]},def:()=>({W:2400,H:2400,D:550}),o:{},ax:[['W',[1800,2400,3000]],['mat',['mlam18','mdf18'],MATL]],lbl:{W:'Toplam genişlik',D:'Derinlik'}});
F3({id:'bahce-citi',name:'Bahçe çiti',cat:'Bahçe ve dış mekân',b:gardenFence,level:2,time:'1,5 gün',tags:'çit paravan gizlilik sınır bahçe balkon teras rüzgarlık',desc:'Dikmeli, yatay ya da dikey tahtalı, üst kapaklı bahçe gizlilik çiti.',
  P:{L:[1000,5800,10],H:[1000,2000,10]},def:()=>({L:3600,H:1800}),o:{},ax:[['L',[1800,3600,5400]],['style',['yatay','dikey'],{yatay:'yatay tahtalı',dikey:'dikey tahtalı'}],['sp',['emp','cam'],SPL]],lbl:{L:'Toplam uzunluk',H:'Yükseklik'}});
F3({id:'kopek-merdiveni',name:'Köpek merdiveni',cat:'Ev mobilyası',b:petSteps,level:1,time:'4 saat',tags:'evcil hayvan köpek kedi merdiven yatak koltuk basamak yaşlı',desc:'Küçük ve yaşlı köpeklerin koltuğa ya da yatağa çıkması için kaydırmaz kaplamalı basamak.',
  P:{N:[2,4,1],W:[350,600,10],H:[300,700,10],Sd:[250,400,10]},def:v=>({W:400,H:v.N*140,Sd:300}),o:{},ax:[['N',[2,3,4]],['mat',['ply18'],MATL]],nl:'basamaklı',lbl:{W:'Genişlik',H:'Toplam yükseklik',Sd:'Basamak derinliği'}});
F3({id:'kopek-rampasi',name:'Köpek rampası',cat:'Ev mobilyası',b:petRamp,level:1,time:'4 saat',tags:'evcil hayvan köpek rampa yatak koltuk araba eklem',desc:'Çıtalı, kaydırmaz kaplamalı, arka ucu ayaklı köpek rampası.',
  P:{H:[300,650,10],W:[300,500,10],A:[18,30,1]},def:()=>({H:500,W:400,A:22}),o:{},ax:[['H',[400,550,650]],['A',[18,24]]],lbl:{H:'Çıkış yüksekliği',W:'Genişlik',A:'Eğim (°)'}});
F3({id:'katlanir-tezgah',name:'Duvara katlanır atölye tezgâhı',cat:'Atölye',b:foldBench,level:2,time:'1 gün',tags:'tezgah katlanır duvar garaj balkon dar alan',desc:'Kullanılmadığında duvara kalkan, katlanır ayaklı, 36 mm lamine tablalı atölye tezgâhı.',
  P:{L:[800,2000,10],D:[500,800,10],H:[850,950,10]},def:()=>({L:1400,D:600,H:900}),o:{},ax:[['L',[1200,1600]],['board',[true,false],{true:'alet panolu',false:'panosuz'}]],lbl:{L:'Uzunluk',D:'Derinlik'}});
/* 2026-11-05 (4): bebek beşiği, bar dolabı, sauna bankı, kamp sandığı */
F3({id:'bebek-besigi',name:'Bebek beşiği',cat:'Çocuk',b:crib,level:3,time:'2 gün',tags:'beşik karyola bebek yatağı parmaklıklı bebek odası',desc:'Parmaklıklı, iki taban yüksekliği olan, sökülebilir ahşap bebek karyolası.',
  P:{W:[600,700,10],L:[1200,1400,10],H:[850,950,10]},def:()=>({H:900}),o:{},ax:[['size',['std','buyuk'],{std:'60 × 120 şilte',buyuk:'70 × 140 şilte'}],['low',[false,true],{false:'yüksek taban',true:'alçak taban'}],['sp',['kayin','akc'],SPL]],vd:v=>v.size==='std'?{W:600,L:1200}:{W:700,L:1400},lbl:{W:'Şilte eni',L:'Şilte boyu',H:'Yükseklik'}});
F3({id:'bar-dolabi',name:'Bar dolabı',cat:'Ev mobilyası',b:barCabinet,level:3,time:'2 gün',tags:'şarap dolabı içki kadeh şişe bar köşesi',desc:'Yuvalı şişe rafları, masif bar tablası ve kadeh raylı, istenirse kapaklı bar dolabı.',
  P:{W:[600,1000,10],H:[1200,1800,10],D:[350,450,10]},def:()=>({W:800,H:1500,D:400}),o:{},ax:[['W',[700,900]],['doors',[false,true],{false:'açık',true:'üstü kapaklı'}],['mat',['ply18','mdf18'],MATL]],lbl:{W:'Genişlik',D:'Derinlik'}});
F3({id:'sauna-banki',name:'Sauna bankı',cat:'Ev mobilyası',b:saunaBench,level:2,time:'1,5 gün',tags:'sauna hamam banyo spa iki kademeli bank',desc:'Duvara bağlı, iki kademeli, vidası görünmeyen sauna bankı.',
  P:{L:[1000,2400,10],H:[950,1150,10]},def:()=>({L:1800,H:1050}),o:{},ax:[['L',[1200,1800,2400]],['back',[true,false],{true:'sırt çıtalı',false:'sırtsız'}],['sp',['ihlamur','cam'],{ihlamur:'ıhlamur',cam:'çam'}]],lbl:{L:'Uzunluk',H:'Üst kademe yüksekliği'}});
F3({id:'kamp-sandigi',name:'Kamp sandığı',cat:'Hobi',b:campBox,level:2,time:'1 gün',tags:'kamp mutfak kutusu chuck box piknik karavan taşınır',desc:'Ön kapağı açılınca masaya dönüşen, bölmeli, taşınır kamp mutfağı sandığı.',
  P:{W:[500,900,10],H:[400,650,10],D:[300,450,10]},def:()=>({W:700,H:500,D:380}),o:{},ax:[['W',[600,750]],['legs',[false,true],{false:'ayaksız',true:'sökülür ayaklı'}]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
/* 2026-11-05 (5): masa lambası, satranç takımı, bahçe oyun evi, kadeh askılı şarap rafı */
F3({id:'masa-lambasi',name:'Ahşap masa lambası',cat:'Hobi',b:deskLamp,level:1,time:'4 saat',tags:'lamba abajur aydınlatma gece lambası masa',desc:'Masif tabanlı, kablosu gövdeden geçen, abajurlu ahşap masa lambası.',
  P:{W:[120,220,10],H:[300,600,10],S:[200,400,10]},def:()=>({W:160,H:450,S:280}),o:{},ax:[['base',['kare','yuvarlak'],{kare:'kare taban',yuvarlak:'yuvarlak taban'}],['sp',['ceviz','mese','akc'],SPL]],lbl:{W:'Taban',H:'Gövde yüksekliği',S:'Abajur çapı'}});
F3({id:'satranc-takimi',name:'Satranç takımı',cat:'Hobi',b:chessSet,level:2,time:'1 gün',tags:'satranç dama oyun tahtası taş hediye',desc:'Açık ve koyu ağaç kareli satranç tahtası ve kavela taşlar.',
  P:{S:[35,60,1]},def:()=>({S:50}),o:{},ax:[['S',[40,50,55]],['pieces',[true,false],{true:'taşlarıyla',false:'yalnız tahta'}]],lbl:{S:'Kare boyu'}});
F3({id:'oyun-evi',name:'Bahçe oyun evi',cat:'Çocuk',b:playhouse,level:3,time:'3 gün',tags:'oyun evi çocuk bahçe kulübe ağaç ev',desc:'Beşik çatılı, pencereli, kapı boşluklu bahçe çocuk oyun evi.',
  P:{W:[1200,1800,10],D:[1200,1800,10],H:[1200,1500,10]},def:()=>({W:1500,D:1400,H:1350}),o:{},ax:[['W',[1300,1600]],['sp',['emp','cam'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',H:'Duvar yüksekliği'}});
F3({id:'kadeh-rafi',name:'Kadeh askılı şarap rafı',cat:'Mutfak ve küçük eşya',b:wineGlassRack,level:1,time:'3 saat',tags:'şarap kadeh askı duvar bar',desc:'Üstünde yuvalı şişe rafı, altında kadeh rayları olan duvar rafı.',
  P:{W:[400,1000,10]},def:()=>({W:600}),o:{},ax:[['W',[500,700,900]],['sp',['mese','ceviz'],SPL]],lbl:{W:'Uzunluk'}});
/* 2026-11-05 (6): yürüteç, denge tahtası, kitaplıklı çalışma masası, yemek bankı */
F3({id:'yurutec',name:'Ahşap yürüteç',cat:'Çocuk',b:pushWalker,level:2,time:'6 saat',tags:'yürüteç bebek ilk adım itme arabası oyuncak',desc:'İlk adımlar için tutamaklı, kutulu, kauçuk tekerlekli itmeli ahşap yürüteç.',
  P:{W:[350,450,10],D:[300,400,10],H:[450,550,10]},def:()=>({W:400,D:350,H:500}),o:{},ax:[['W',[380,420]],['sp',['kayin','akc'],SPL]],lbl:{W:'Genişlik',D:'Boy',H:'Tutamak yüksekliği'}});
F3({id:'denge-tahtasi',name:'Denge tahtası',cat:'Çocuk',b:balanceBoard,level:1,time:'3 saat',tags:'montessori denge sallanır tahta köprü kaydırak',desc:'Kavisli ayaklı, sallanan, ters çevrilince köprü olan çocuk denge tahtası.',
  P:{L:[600,900,10],W:[300,450,10],R:[60,120,5]},def:()=>({L:800,W:350,R:90}),o:{},ax:[['L',[700,850]],['W',[320,400]]],lbl:{L:'Uzunluk',W:'Genişlik',R:'Sallanma yüksekliği'}});
F3({id:'kitaplikli-masa',name:'Kitaplıklı çalışma masası',cat:'Ev mobilyası',b:deskBookcase,level:2,time:'1,5 gün',tags:'çalışma masası kitaplık ofis öğrenci raf',desc:'Bir yanı boy kitaplık, üstü duvar raflı çalışma masası.',
  P:{W:[1200,2000,10],H:[1600,2200,10],D:[550,700,10]},def:()=>({W:1600,H:2000,D:600}),o:{},ax:[['W',[1400,1800]],['mat',['ply18','mlam18','mdf18'],MATL]],lbl:{W:'Toplam genişlik',H:'Kitaplık yüksekliği',D:'Masa derinliği'}});
F3({id:'yemek-banki',name:'Yemek bankı',cat:'Ev mobilyası',b:frame,level:2,time:'1 gün',tags:'bank yemek masası oturma uzun',desc:'Yemek masasıyla birlikte kullanılan kalın tablalı, ayak bağlantılı uzun bank.',
  P:{L:[1000,2200,10],W:[300,400,10],H:[440,470,5]},def:()=>({W:340,H:450}),o:{leg:70,apron:95,ov:30,topProf:[40,140],lower:'stretch'},ax:[['L',[1200,1600,2000]],['sp',['cam','kayin'],SPL]]});
/* 2026-11-05 (7): kaykay rampası, arı kovanı, tablet standı, antre askı paneli */
F3({id:'kaykay-rampasi',name:'Kaykay rampası',cat:'Bahçe ve dış mekân',b:skateRamp,level:2,time:'5 saat',tags:'kaykay bisiklet scooter atlama rampası paten',desc:'Kaburgalı iskeleti ve çelik geçiş saçlı, kaykay ve bisiklet atlama rampası.',
  P:{W:[600,1200,10],L:[900,1600,10],H:[250,450,10]},def:()=>({W:800,L:1200,H:350}),o:{},ax:[['H',[300,400]],['W',[700,900]]],lbl:{W:'Genişlik',L:'Uzunluk',H:'Yükseklik'}});
F3({id:'ari-kovani',name:'Arı kovanı',cat:'Bahçe ve dış mekân',b:beeHive,level:2,time:'1,5 gün',tags:'arıcılık bal kovan langstroth arı',desc:'Standart 10 çerçeveli Langstroth ölçüsünde, katlı, sac çatılı ahşap arı kovanı.',
  P:{N:[1,3,1]},def:()=>({N:2}),o:{},ax:[['N',[1,2,3]],['sp',['cam','kayin'],SPL]],nl:'katlı'});
F3({id:'tablet-standi',name:'Tablet ve telefon standı',cat:'Ev mobilyası',b:tabletStand,level:1,time:'2 saat',tags:'telefon tablet stand masa üstü şarj',desc:'Eğik sırtlı, kablo oluklu masif masa üstü telefon ve tablet standı.',
  P:{W:[100,300,10],D:[80,160,5],H:[100,220,5],A:[60,80,1]},def:()=>({W:160,D:120,H:140,A:70}),o:{},ax:[['W',[120,250]],['sp',['ceviz','mese','akc'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',H:'Sırt boyu',A:'Eğim (°)'}});
F3({id:'antre-paneli',name:'Antre askı paneli',cat:'Ev mobilyası',b:entryPanel,level:1,time:'3 saat',tags:'antre askı kask mont şapka çanta raf duvar',desc:'Kavela askılı, üstü raflı duvar askı paneli.',
  P:{W:[500,1200,10]},def:()=>({W:800}),o:{},ax:[['W',[600,900]],['sp',['mese','ceviz','cam'],SPL]],lbl:{W:'Uzunluk'}});
/* 2026-11-05 (8): tavla, lamel duvar paneli, makyaj masası, kedi duvar parkuru */
F3({id:'tavla',name:'Tavla takımı',cat:'Hobi',b:backgammon,level:2,time:'1 gün',tags:'tavla oyun masa oyunu hediye katlanır',desc:'Katlanır, menteşeli, haneleri kaplama ya da boyayla işlenmiş ahşap tavla ve pulları.',
  P:{W:[400,700,10],D:[300,450,10]},def:()=>({W:560,D:380}),o:{},ax:[['pieces',[true,false],{true:'pullarıyla',false:'yalnız tahta'}],['sp',['ceviz','mese'],SPL]],lbl:{W:'Açık genişlik',D:'Derinlik'}});
F3({id:'lamel-panel',name:'Çıtalı duvar paneli',cat:'Ev mobilyası',b:slatPanel,level:1,time:'1 gün',tags:'lamel akustik panel duvar kaplama tv arkası yatak başı',desc:'Siyah akustik keçe üzerine ahşap çıtalı, sesi yumuşatan dekoratif duvar paneli.',
  P:{W:[600,3000,10],H:[2000,2700,10],G:[10,20,1]},def:()=>({W:1800,H:2500,G:13}),o:{},ax:[['W',[1200,1800,2400]],['led',[false,true],{false:'',true:'LED aydınlatmalı'}],['sp',['mese','ceviz'],SPL]],lbl:{W:'Genişlik',H:'Yükseklik',G:'Çıta aralığı'}});
F3({id:'makyaj-masasi',name:'Makyaj masası',cat:'Ev mobilyası',b:vanity,level:3,time:'2 gün',tags:'makyaj masası aynalı tuvalet masası yatak odası çekmeceli',desc:'Arka ayakları ayna çerçevesine uzanan, ortası çekmeceli aynalı makyaj masası.',
  P:{W:[800,1200,10],D:[400,500,10],H:[740,780,5],M:[500,800,10]},def:()=>({W:1000,D:450,H:760,M:650}),o:{},ax:[['W',[900,1100]],['sp',['mese','ceviz','kayin'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',M:'Ayna yüksekliği'}});
F3({id:'kedi-parkuru',name:'Kedi duvar parkuru',cat:'Ev mobilyası',b:catWall,level:1,time:'4 saat',tags:'kedi duvar rafı tırmanma basamak evcil',desc:'Duvara merdiven gibi dizilen, halı kaplı kedi basamakları.',
  P:{N:[3,6,1],W:[250,400,10]},def:()=>({W:300}),o:{},ax:[['N',[3,4,5]],['sp',['cam','mese'],SPL]],nl:'basamaklı',lbl:{W:'Basamak genişliği'}});
/* 2026-11-05 (9): bahçe kapısı, yapboz, dergilik, tabak süzgeci, çamaşır kurutmalığı */
F3({id:'bahce-kapisi',name:'Bahçe kapısı',cat:'Bahçe ve dış mekân',b:gardenGate,level:2,time:'1 gün',tags:'bahçe kapısı çit kapısı giriş kanat menteşe',desc:'Z kayıtlı, sarkmayan, dikey ya da yatay tahtalı tek kanat bahçe kapısı.',
  P:{W:[800,1200,10],H:[900,1800,10]},def:()=>({W:1000,H:1200}),o:{},ax:[['H',[1000,1800]],['slat',['dikey','yatay'],{dikey:'dikey tahtalı',yatay:'yatay tahtalı'}],['sp',['emp','cam'],SPL]],lbl:{W:'Kanat genişliği',H:'Yükseklik'}});
F3({id:'yapboz',name:'Ahşap yapboz',cat:'Çocuk',b:jigsaw,level:1,time:'4 saat',tags:'yapboz puzzle bulmaca oyuncak çocuk resim dekupaj hediye',desc:'Sevdiğin bir resim ya da çocuğun çizimiyle, dekupajla kesilen çerçeveli ahşap yapboz.',
  P:{W:[200,400,10],D:[200,400,10],N:[6,48,1]},def:()=>({W:300,D:300}),o:{},ax:[['N',[12,24,48]],['tray',[true,false],{true:'çerçeveli',false:'çerçevesiz'}]],nl:'parçalı',lbl:{W:'Genişlik',D:'Derinlik',N:'Parça sayısı'}});
F3({id:'dergilik',name:'Dergilik',cat:'Ev mobilyası',b:magRack,level:2,time:'5 saat',tags:'dergilik gazete dergi kitap sepet salon koltuk yanı',desc:'Tutamaklı, orta bölmeli, kavela çubuklu masif dergilik.',
  P:{W:[300,500,10],H:[350,500,10],D:[250,350,10]},def:()=>({W:400,H:420,D:300}),o:{},ax:[['W',[350,450]],['sp',['mese','ceviz','kayin'],SPL]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
F3({id:'tabak-suzgeci',name:'Tabak süzgeci',cat:'Mutfak ve küçük eşya',b:dishRack,level:1,time:'3 saat',tags:'tabak süzgeci bulaşıklık kurutma mutfak tezgah',desc:'Kavela çubuklu, iki sıralı masif tabak süzgeci.',
  P:{W:[300,600,10],D:[200,350,10]},def:()=>({W:450,D:260}),o:{},ax:[['W',[400,550]],['sp',['kayin','mese','akc'],SPL]],lbl:{W:'Uzunluk',D:'Derinlik'}});
F3({id:'camasir-kurutmalik',name:'Duvara katlanır çamaşır kurutmalığı',cat:'Ev mobilyası',b:dryingRack,level:2,time:'5 saat',tags:'çamaşır kurutmalık askı balkon banyo katlanır duvar',desc:'Açılınca zincirle yatay duran, kapanınca duvara yatan çubuklu çamaşır kurutmalığı.',
  P:{W:[500,1000,10],H:[600,1000,10]},def:()=>({W:800,H:800}),o:{},ax:[['W',[600,900]],['sp',['cam','kayin'],SPL]],lbl:{W:'Genişlik',H:'Çerçeve yüksekliği'}});
/* 2026-11-05 (10): mama sandalyesi, sallanan sandalye, ütü masası, şemsiyelik, gitar standı */
F3({id:'mama-sandalyesi',name:'Mama sandalyesi',cat:'Çocuk',b:highChair,level:3,time:'1,5 gün',tags:'mama sandalyesi bebek yemek sandalyesi tablalı yüksek sandalye',desc:'Açık ayaklı, devrilmeye dayanıklı, çıkarılabilir tablalı ve emniyet kemerli bebek mama sandalyesi.',
  P:{W:[360,460,10],H:[520,620,5]},def:()=>({W:400,H:560}),o:{},ax:[['top',[true,false],{true:'tablalı',false:'tablasız'}],['sp',['kayin','akc'],SPL]],lbl:{W:'Oturak genişliği',H:'Oturak yüksekliği'}});
F3({id:'sallanan-sandalye',name:'Sallanan sandalye',cat:'Ev mobilyası',b:rocker,level:3,time:'2 gün',tags:'sallanan sandalye koltuk kızaklı salon emzirme dinlenme',desc:'Yay kızaklı, çıtalı oturaklı ve geriye yatık sırtlı masif sallanan sandalye.',
  P:{W:[500,650,10],L:[800,1000,10],H:[380,450,5]},def:()=>({W:560,L:900,H:410}),o:{},ax:[['arms',[true,false],{true:'kolçaklı',false:'kolçaksız'}],['sp',['mese','ceviz','kayin'],SPL]],lbl:{W:'Genişlik',L:'Kızak uzunluğu',H:'Oturak yüksekliği'}});
F3({id:'utu-masasi',name:'Duvara katlanır ütü masası',cat:'Ev mobilyası',b:ironCabinet,level:2,time:'1 gün',tags:'ütü masası duvar dolabı katlanır çamaşır odası küçük ev',desc:'Kapaklı duvar dolabının içinden açılan, destek ayaklı, üstü ütü raflı katlanır ütü masası.',
  P:{W:[350,450,10],H:[1100,1400,10]},def:()=>({W:400,H:1300}),o:{},ax:[['H',[1200,1400]],['mat',['ply18','mdf18'],{ply18:'huş kontrplak',mdf18:'boyalı MDF'}]],lbl:{W:'Genişlik',H:'Dolap yüksekliği'}});
F3({id:'semsiyelik',name:'Şemsiyelik',cat:'Ev mobilyası',b:umbrellaStand,level:2,time:'5 saat',tags:'şemsiyelik şemsiye antre giriş baston damlama',desc:'Çıtalı gövdeli, bölmeli, çıkarılabilir damlama tepsili antre şemsiyeliği.',
  P:{W:[250,450,10],D:[200,300,10],H:[500,700,10]},def:()=>({W:320,D:240,H:600}),o:{},ax:[['W',[280,400]],['sp',['mese','kayin','ceviz'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',H:'Yükseklik'}});
F3({id:'gitar-standi',name:'Gitar standı',cat:'Hobi',b:guitarStand,level:2,time:'4 saat',tags:'gitar standı enstrüman müzik bas ukulele sehpa',desc:'Keçe kaplı beşikli ve sap yataklı, sökülüp yassı paketlenen masif gitar standı.',
  P:{W:[250,400,10],D:[300,420,10],H:[550,800,10]},def:()=>({W:320,D:360,H:680}),o:{},ax:[['H',[600,750]],['sp',['ceviz','mese','akc'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',H:'Sap yüksekliği'}});
/* 2026-11-05 (11): tavuk kümesi, sallanan at, kukla tiyatrosu, akvaryum sehpası, masa futbolu, kedi evi, verandalı köpek kulübesi */
F3({id:'kumes',name:'Tavuk kümesi',cat:'Bahçe ve dış mekân',b:coop,level:3,time:'3 gün',tags:'kümes tavuk folluk tünek yumurta bahçe tel kafes hayvan',desc:'Yerden yükseltilmiş, folluklu ve tünekli, altı tel kafesli gezinme alanı olan tavuk kümesi.',
  P:{W:[1000,1600,10],D:[700,1000,10],H:[1300,1700,10]},def:()=>({W:1200,D:800,H:1500}),o:{},ax:[['W',[1200,1500]],['sp',['emp','cam'],SPL]],lbl:{W:'Genişlik',D:'Derinlik',H:'Ön yükseklik'}});
F3({id:'sallanan-at',name:'Sallanan at',cat:'Çocuk',b:rockingHorse,level:2,time:'1 gün',tags:'sallanan at tahta at oyuncak çocuk bebek kızak hediye',desc:'Yay kızaklı, tutamaklı, ayak dayamalı, halat yeleli ahşap sallanan at.',
  P:{L:[700,1000,10],H:[400,560,10]},def:()=>({L:850,H:460}),o:{},ax:[['H',[420,500]],['sp',['kayin','akc','cam'],SPL]],lbl:{L:'Kızak uzunluğu',H:'Oturak yüksekliği'}});
F3({id:'kukla-tiyatrosu',name:'Kukla tiyatrosu',cat:'Çocuk',b:puppetTheater,level:1,time:'5 saat',tags:'kukla tiyatrosu sahne perde oyuncak çocuk oyun gölge',desc:'Perdeli sahne açıklığı, katlanır yan kanatları ve kara tahta yüzeyi olan kukla tiyatrosu.',
  P:{W:[600,1000,10],H:[600,1300,10]},def:()=>({W:800,H:750}),o:{},ax:[['H',[750,1200],{750:'masa üstü',1200:'yer tipi'}],['W',[700,900]]],lbl:{W:'Genişlik',H:'Yükseklik'}});
F3({id:'akvaryum-sehpasi',name:'Akvaryum sehpası',cat:'Ev mobilyası',b:aquariumStand,level:2,time:'1,5 gün',tags:'akvaryum sehpası balık dolap ağır yük taşıyıcı',desc:'İç iskeleti yükü doğrudan zemine taşıyan, çift kat tablalı, kapaklı akvaryum sehpası.',
  P:{W:[600,1500,10],D:[300,600,10],H:[600,900,10]},def:()=>({W:1000,D:400,H:750}),o:{},ax:[['W',[800,1000,1200]],['door',[true,false],{true:'kapaklı',false:'açık raflı'}]],lbl:{W:'Genişlik',D:'Derinlik',H:'Yükseklik'}});
F3({id:'masa-futbolu',name:'Mini masa futbolu',cat:'Hobi',b:foosball,level:2,time:'1,5 gün',tags:'masa futbolu langırt oyun çocuk aile futbol',desc:'Masa üstünde oynanan, çubuklu oyunculu, kale ağızlı ahşap mini masa futbolu.',
  P:{L:[600,1000,10],W:[350,600,10],N:[4,8,2]},def:()=>({L:800,W:450}),o:{},ax:[['N',[4,6,8]]],nl:'çubuklu',lbl:{L:'Saha uzunluğu',W:'Saha genişliği',N:'Çubuk sayısı'}});
F3({id:'kedi-evi',name:'Sokak kedisi evi',cat:'Bahçe ve dış mekân',b:catHouse,level:1,time:'5 saat',tags:'kedi evi kedi kulübesi sokak kedisi barınak kış yalıtımlı',desc:'Köpük yalıtımlı, iki girişli, menteşeli çatılı, kış için sokak kedisi evi.',
  P:{W:[450,700,10],D:[400,550,10],H:[380,520,10]},def:()=>({W:550,D:450,H:420}),o:{},ax:[['floors',[1,2],{1:'tek katlı',2:'iki katlı'}],['ins',[true,false],{true:'yalıtımlı',false:'yalıtımsız'}]],lbl:{W:'Genişlik',D:'Derinlik',H:'Ön yükseklik'}});
F3({id:'verandali-kulube',name:'Verandalı köpek kulübesi',cat:'Bahçe ve dış mekân',b:porchDogHouse,level:3,time:'2 gün',tags:'köpek kulübesi verandalı tek eğimli çatı köpek evi kış',desc:'Tek eğimli çatılı, rüzgâr bölmeli, önü üstü kapalı verandalı köpek kulübesi.',
  P:{W:[700,1400,10],D:[600,1100,10],H:[600,1000,10]},def:()=>({W:900,D:800,H:750}),o:{},ax:[['veranda',[true,false],{true:'verandalı',false:'verandasız'}],['W',[800,1100]]],lbl:{W:'Genişlik',D:'İç derinlik',H:'Ön yükseklik'}});
/* 2026-11-05 (12): kombi ve makine dolabı, petek örtüsü, klozet üstü raf, duş ızgarası, rahle, okey ıstakası, sedir */
F3({id:'kombi-dolabi',name:'Kombi dolabı',cat:'Ev mobilyası',b:applianceCab,level:2,time:'1 gün',tags:'kombi dolabı kombi kapatma mutfak balkon havalandırmalı',desc:'Altı açık, üstü baca delikli, kapağı havalandırma yarıklı duvara asılan kombi dolabı.',
  P:{W:[500,700,10],H:[800,1000,10],D:[350,450,10]},def:()=>({W:560,H:900,D:400}),o:{kind:'kombi'},ax:[['mat',['ply18','mdf18'],{ply18:'huş kontrplak',mdf18:'boyalı MDF'}]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
F3({id:'makine-dolabi',name:'Çamaşır makinesi dolabı',cat:'Ev mobilyası',b:applianceCab,level:2,time:'1,5 gün',tags:'çamaşır makinesi dolabı kurutma makinesi üstü dolap banyo balkon',desc:'Altında makine boşluğu, üstünde kapaklı raflı dolap olan çamaşır makinesi dolabı.',
  P:{W:[650,760,10],H:[1800,2200,10],D:[600,660,10]},def:()=>({W:680,H:2000,D:620}),o:{kind:'makine'},ax:[['mat',['ply18','mdf18'],{ply18:'huş kontrplak',mdf18:'boyalı MDF'}]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
F3({id:'petek-ortusu',name:'Kalorifer peteği örtüsü',cat:'Ev mobilyası',b:radiatorCover,level:2,time:'1 gün',tags:'petek örtüsü kalorifer radyatör kapatma ızgara raf',desc:'Önü çıtalı ızgaralı, üstü raf olarak kullanılan kalorifer peteği örtüsü.',
  P:{W:[600,2000,10],H:[600,950,10],D:[180,280,10]},def:()=>({W:1000,H:800,D:220}),o:{},ax:[['W',[800,1200,1600]],['mat',['mdf18','ply18'],{ply18:'huş kontrplak',mdf18:'boyalı MDF'}]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
F3({id:'klozet-rafi',name:'Klozet üstü raf',cat:'Ev mobilyası',b:toiletShelf,level:1,time:'5 saat',tags:'klozet üstü raf banyo rafı tuvalet dar alan havlu',desc:'Klozetin üstünden geçen, üç raflı ayaklı banyo rafı.',
  P:{W:[600,800,10],H:[1600,1900,10],D:[200,280,10]},def:()=>({W:660,H:1750,D:240}),o:{},ax:[['W',[650,750]],['sp',['cam','mese'],SPL]],lbl:{W:'Genişlik',H:'Yükseklik',D:'Derinlik'}});
F3({id:'dus-izgarasi',name:'Duş ızgarası',cat:'Ev mobilyası',b:showerMat,level:1,time:'3 saat',tags:'duş ızgarası banyo paspası tik duş teknesi çıtalı',desc:'Vidaları alttan gizli, su aralıklı çıtalı ahşap duş ve banyo ızgarası.',
  P:{W:[400,900,10],D:[400,900,10]},def:()=>({W:600,D:450}),o:{},ax:[['W',[600,800]],['sp',['mese','akc'],SPL]],lbl:{W:'Genişlik',D:'Derinlik'}});
F3({id:'rahle',name:'Rahle',cat:'Hobi',b:bookRest,level:2,time:'4 saat',tags:'rahle kitap sehpası kuran kitap okuma çapraz katlanır geleneksel',desc:'Ortası geçme parmaklı, çapraz açılıp yassı kapanan geleneksel kitap rahlesi.',
  P:{W:[220,400,10],L:[400,700,10]},def:()=>({W:300,L:520}),o:{},ax:[['L',[450,600]],['sp',['ceviz','mese','kayin'],SPL]],lbl:{W:'Genişlik',L:'Kanat boyu'}});
F3({id:'okey-istakasi',name:'Okey ıstakası',cat:'Hobi',b:okeyRack,level:2,time:'5 saat',tags:'okey ıstaka taş oyun masa oyunu hediye',desc:'İki basamaklı, masif dört ıstaka ve taş kutusundan oluşan okey takımı.',
  P:{L:[480,620,10]},def:()=>({L:540}),o:{},ax:[['box',[true,false],{true:'taş kutulu',false:'yalnız ıstaka'}],['sp',['ceviz','mese','kayin'],SPL]],lbl:{L:'Istaka boyu'}});
F3({id:'sedir',name:'Sedir',cat:'Ev mobilyası',b:sedir,level:2,time:'1,5 gün',tags:'sedir divan minder oturma sandıklı köşe sedir yer',desc:'Duvar boyunca uzanan, altı kapaklı sandık bölmeli, minderli sedir.',
  P:{W:[1200,2400,10],D:[600,800,10],H:[380,460,5]},def:()=>({W:2000,D:700,H:420}),o:{},ax:[['W',[1600,2000,2400]],['mat',['ply18','mdf18'],{ply18:'huş kontrplak',mdf18:'boyalı MDF'}]],lbl:{W:'Uzunluk',D:'Derinlik',H:'Oturma yüksekliği'}});
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
  a('Kitaplık ve raflar','klozet-rafi dergilik sarkit-raf duvar-konsolu kuvet-rafi cocuk-kitapligi kitaplik kitaplik-p ayarli-kitaplik merdiven-kitaplik duvar-rafi banyo-rafi altigen-raf gizli-raf');
  a('Dolap ve depolama','kombi-dolabi makine-dolabi petek-ortusu utu-masasi camasir-kurutmalik bar-dolabi giyinme-odasi sarj-kutusu lavabo-dolabi kapakli-dolap sifonyer acili-sifonyer gardirop banyo-dolabi vitrin-dolap tv-unitesi acili-tv citali-kasa saklama-kasasi camasir-sepeti saklama-kutusu cekmece-duzen');
  a('Masa ve sehpa','epoksi-yemek-masasi epoksi-sehpa yer-sofrasi orta-sehpa yemek-masasi orta-sehpa-f yan-sehpa konsol yuvarlak-yemek yuvarlak-sehpa yuvarlak-yan-sehpa acili-sehpa palet-sehpa');
  a('Oturma','sedir sallanan-sandalye yemek-banki sauna-banki merdiven-tabure banyo-taburesi sandikli-bank tabure tabure-f ayak-taburesi yuvarlak-tabure acili-bank masa-sandalyesi');
  a('Yatak odası','makyaj-masasi ranza komodin komodin-p acili-komodin gece-sehpasi tek-yatak cift-yatak');
  a('Çalışma alanı','kitaplikli-masa laptop-yukseltici duvar-masasi calisma-masasi dosya-dolabi monitor-yukseltici');
  a('Antre ve askılar','semsiyelik antre-paneli portmanto izgara-altlik askilik anahtarlik giris-banki ayakkabi-rafi ayakkabi-dolabi');
  a('Ayna ve dekor','dus-izgarasi lamel-panel paravan ayna-cercevesi yuvarlak-ayna battaniye-merdiveni havlu-merdiveni');
  a('Evcil hayvan','akvaryum-sehpasi kedi-parkuru kopek-merdiveni kopek-rampasi kum-dolabi evcil-yatak kedi-kulesi mama-standi');
  a('Mutfak dolapları','mutfak-adasi mutfak-alt mutfak-ust kiler-dolabi');
  a('Tahtalar ve sunum','yatak-tepsisi kesme-tahtasi kesme-tahtasi-f servis-tahtasi peynir-tahtasi yuvarlak-kesme pizza-tahtasi tepsi');
  a('Mutfak düzenleyiciler','tabak-suzgeci kadeh-rafi bicak-blogu havluluk tezgah-rafi baharatlik havlu-askisi cay-kutusu ekmek-kutusu kupa-agaci meyve-kasasi sarap-kasasi sarap-rafi basamakli-raf kasiklik');
  a('Masa ve tabure','servis-arabasi mutfak-masasi bar-taburesi');
  a('Bahçe oturma','hamak-standi bahce-salincagi veranda-salincagi cocuk-salincagi tekli-koltuk kanepe kose-kanepe bahce-banki bahce-koltugu sezlong piknik-banki balkon-banki egik-sandalye egik-bank ayarli-sezlong');
  a('Bahçe masaları','bahce-masasi bistro-masasi piknik-masasi');
  a('Saksı ve bahçe yatakları','sebze-masasi saksi-standi saksi-kutusu yuksek-saksi bahce-yatagi cicek-rafi saksi-merdiveni saksi-basamagi kompost');
  a('Kuş ve doğa','ari-kovani kus-evi catili-kus-evi bocek-oteli kus-yemligi');
  a('Bahçe yapıları','kumes verandali-kulube kedi-evi bahce-kapisi kaykay-rampasi bahce-citi alet-kulubesi pergola duvar-pergolasi odunluk kopek-kulubesi mektup-kutusu sokak-kitapligi bahce-kafesi');
  a('Çocuk mobilyası','mama-sandalyesi bebek-besigi okuma-kosesi ogrenme-kulesi cocuk-masasi yuvarlak-cocuk-masasi cocuk-taburesi montessori-yatak oyuncak-dolabi cocuk-banki');
  a('Oyun ve oyuncak','sallanan-at kukla-tiyatrosu yapboz yurutec denge-tahtasi oyun-evi cocuk-mutfagi oyun-cadiri tirmanma-ucgeni oyuncak-arabasi oyuncak-sandigi bebek-evi kum-havuzu');
  a('Pano ve duvar','pano yuvarlak-pano');
  a('Tezgâh ve depolama','katlanir-tezgah bisiklet-standi bisiklet-askisi testere-sehpasi alet-panosu iskence-rafi tezgah alet-dolabi alet-kutusu');
  a('Kutular','kamp-sandigi taki-kutusu dikis-kutusu kalemlik');
  a('Sergi ve raflar','gitar-standi koleksiyon-rafi maket-vitrini plak-dolabi');
  a('Sanat','sovale masa-sovalesi resim-cercevesi');
  a('Oyunlar','okey-istakasi masa-futbolu tavla satranc-takimi oyun-kutusu cornhole');
  a('Masa üstü ve dekor','rahle tablet-standi masa-lambasi kulaklik-standi kitap-destegi duvar-saati bardak-altligi isim-tabelasi samdan');
  return m;})();
PROJECTS.forEach(p=>{p.sub=SUBOF[p.fam||p.id]||SUBS[p.cat][0];});
