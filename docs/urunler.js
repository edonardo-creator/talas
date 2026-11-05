"use strict";
/* Talaş ürünleri: aynı tarzdaki aileler tek üründe "model" olarak toplanır. Malzeme, seçenekler ve ölçü
   ürün sayfasında seçilir; kesim listesi ve kılavuz o seçime göre oluşturulur. Katalogdaki varyantlar
   (PROJECTS/BYID) eski bağlantılar ve hazır ölçüler için kaynak olarak kalır. */

const ALLFAMS=[...FAMS,...FAMS2,...FAMS3], FAMBY=Object.fromEntries(ALLFAMS.map(f=>[f.id,f])), FEATBY=Object.fromEntries(FEATURED.map(p=>[p.id,p]));
const AXL={legs:'Ayak',lid:'Kapak',shape:'Biçim',rail:'Tırabzan',kind:'Tip',pad:'Taban',box:'Kutu',veranda:'Veranda',ins:'Yalıtım',slat:'Tahta yönü',tray:'Çerçeve',led:'Aydınlatma',base:'Taban',pieces:'Taşlar',low:'Taban',back:'Sırt',board:'Alet panosu',bar:'Oturma çıkıntısı',door:'Kapı',fill:'Dolgu',shade:'Gölgelik',mat:'Malzeme',sp:'Ağaç türü',pat:'Desen',top:'Tabla',doors:'Kapak',drawers:'Çekmece',tip:'Düzen',lower:'Alt raf',arms:'Kolçak',head:'Başlık',
  style:'Yazı tekniği',hole:'Giriş deliği',pitch:'Çatı eğimi',floors:'Kat sayısı',insert:'Yüzey',prof:'Çerçeve genişliği',size:'Boyut',paint:'Yüzey',
  shelf:'Üst raf',space:'Askı aralığı',set:'Set',layers:'Kat',s:'Kafes aralığı',H:'Yükseklik',glass:'Cam tabla',umb:'Şemsiye',seats:'Oturak',stand:'Tablet dayama',slots:'Kablo yarığı'};
const INFO={
  mat:{ply18:'Huş kontrplak: katmanlı yapısı sayesinde sağlam ve vidayı iyi tutar, nemde az çalışır. Kenarı bantlanır ya da katmanlı kenar açık bırakılır. Orta fiyat.',
    mlam18:'Beyaz suntalam: en ekonomik seçenek; yüzeyi hazır, silinebilir. Neme ve vidanın sökülüp takılmasına dayanıksız; kenar bandı şart.',
    mdf18:'MDF: pürüzsüz yüzeyi boyaya en uygun malzeme. Ağırdır, suya dayanıksızdır; vida için mutlaka kılavuz delik aç.',
    ply12:'12 mm kontrplak: hafif ve sağlam, küçük kutular için ideal.',ply6:'6 mm kontrplak: ince bölmeler ve küçük kutular için hafif ve kolay kesilir.'},
  sp:{cam:'Çam: ucuz, hafif, her yerde bulunur ve kolay işlenir. Yumuşak olduğu için çizilir; cila ya da boyayla iyi durur.',
    emp:'Emprenye çam: basınçla koruyucu emdirilmiş, dış mekânda çürümeye dayanıklı. Kesim yüzeylerini yeniden koruyucuyla kapat.',
    mese:'Meşe: sert, dayanıklı ve belirgin damarlı. Pahalı ve ağırdır; demirle temas eden yerde kararır, paslanmaz vida kullan.',
    kayin:'Kayın: sert, sık dokulu ve açık renkli; sandalye ve tabure için çok uygun. Nemde çalışır, yüzeyini iyi koru.',
    ceviz:'Ceviz: koyu, sıcak renkli ve değerli; küçük ve gösterişli parçalar için.',akc:'Akçaağaç: çok açık renkli ve sert; kesme tahtalarında hijyenik ve uzun ömürlü.'},
  pat:{kayin:'Tek tür kayın: sade ve açık renkli.',mese:'Tek tür meşe: belirgin damarlı, dayanıklı.',ceviz:'Tek tür ceviz: koyu ve şık.',
    kc:'Kayın ve ceviz şeritleri sırayla: belirgin açık-koyu çizgiler.',ac:'Akçaağaç ve ceviz: en güçlü renk kontrastı.',mck:'Meşe, ceviz ve kayın: üç tonlu desen.'},
  top:{ply:'Kontrplak tabla: tek parça, düz ve ekonomik; kenarı bantlanır.',boards:'Masif tabla: tahtalar tutkalla birleştirilir; daha ağır ve sıcak görünümlü.',
    cam:'Çam tahta tabla: ekonomik masif görünüm.',mese:'Meşe tahta tabla: dayanıklı ve şık.'}
};
const cap=s=>{s=String(s);return s.charAt(0).toLocaleUpperCase('tr')+s.slice(1);};
function axLabel(L,v){if(!L)return String(v);const s=typeof L==='function'?L(v):L[v];return s===''?'Yok':(s||String(v));}

/* ---------- modeller ve ürün grupları ---------- */
function famModel(f,label){const dimAx=f.ax.filter(([k])=>k in f.P), optAx=f.ax.filter(([k])=>!(k in f.P));
  return {kind:'fam',ref:f.id,f,label:label||f.name,level:f.level,time:f.time,desc:f.desc,dimAx,optAx,nvar:f.ax.reduce((a,x)=>a*x[1].length,1)};}
function featModel(pr,label){return {kind:'feat',ref:pr.id,pr,label,level:pr.level,time:pr.time,desc:pr.desc,dimAx:[],optAx:[],nvar:1};}
const GROUPS=[
  {id:'kitaplik',name:'Kitaplık',desc:'Sabit ya da ayarlı raflı, bazalı kitaplık; istersen duvara yaslanan merdiven modeli.',models:[['kitaplik','Klasik (ayrıntılı kılavuz)'],['kitaplik-p','Sabit raflı'],['ayarli-kitaplik','Ayarlı raflı'],['merdiven-kitaplik','Duvara yaslı merdiven'],['cocuk-kitapligi','Çocuk kitaplığı (kapağı önde)']]},
  {id:'duvar-rafi-u',name:'Duvar rafı',desc:'Yan tahtalı çok katlı raf, konsolu görünmeyen kalın raf ya da altıgen raf.',models:[['duvar-rafi','Yan tahtalı'],['gizli-raf','Gizli konsollu'],['altigen-raf','Altıgen']]},
  {id:'komodin',name:'Komodin',desc:'Yatak başı için çekmeceli dolap ya da ayaklı sehpa.',models:[['komodin','Klasik (ayrıntılı kılavuz)'],['komodin-p','Bazalı'],['acili-komodin','Açılı ayaklı'],['gece-sehpasi','Ayaklı sehpa']]},
  {id:'sifonyer-u',name:'Şifonyer',desc:'Tamamı çekmeceli şifonyer; düz ya da açılı konik ayaklı.',models:[['sifonyer','Düz ayaklı'],['acili-sifonyer','Açılı ayaklı']]},
  {id:'tv-unitesi-u',name:'TV ünitesi',desc:'Çift kapaklı alçak TV ünitesi; düz ya da açılı konik ayaklı.',models:[['tv-unitesi','Düz ayaklı'],['acili-tv','Açılı ayaklı']]},
  {id:'orta-sehpa',name:'Orta sehpa',desc:'Salon sehpası: kayıtlı ve raflı, açılı ayaklı, yuvarlak ya da palet modeli.',models:[['orta-sehpa','Klasik (ayrıntılı kılavuz)'],['orta-sehpa-f','Raflı'],['acili-sehpa','Açılı ayaklı'],['yuvarlak-sehpa','Yuvarlak'],['palet-sehpa','Palet']]},
  {id:'yan-sehpa-u',name:'Yan sehpa',desc:'Koltuk ya da yatak yanı için kare veya üç ayaklı yuvarlak sehpa.',models:[['yan-sehpa','Kare'],['yuvarlak-yan-sehpa','Yuvarlak üç ayaklı']]},
  {id:'yemek-masasi-u',name:'Yemek masası',desc:'Masif tablalı, kayıtlı yemek masası; dikdörtgen, yuvarlak ya da minderle oturulan alçak yer sofrası.',models:[['yemek-masasi','Dikdörtgen'],['yuvarlak-yemek','Yuvarlak'],['yer-sofrasi','Yer sofrası']]},
  {id:'tabure',name:'Tabure',desc:'Kare ya da yuvarlak oturaklı, ayak dayamalı tabure; alt raflı banyo taburesi.',models:[['tabure','Klasik kare (ayrıntılı kılavuz)'],['tabure-f','Ayak dayamalı kare'],['yuvarlak-tabure','Yuvarlak'],['banyo-taburesi','Banyo taburesi']]},
  {id:'ic-bank',name:'Bank',desc:'Antre, salon ve yemek masası için oturma bankı; raflı, açılı ayaklı, içi depolamalı sandıklı ya da kalın tablalı yemek bankı.',models:[['giris-banki','Raflı giriş bankı'],['acili-bank','Açılı ayaklı'],['sandikli-bank','Sandıklı bank'],['yemek-banki','Yemek bankı']]},
  {id:'yatak',name:'Yatak',desc:'Çıtalı bazalı, sökülebilir karyola; tek ya da çift kişilik, ya da merdivenli ranza.',models:[['tek-yatak','Tek kişilik'],['cift-yatak','Çift kişilik'],['ranza','Ranza']]},
  {id:'ayna',name:'Ayna',desc:'Masif çerçeveli dikdörtgen, yuvarlak ya da destek ayaklı boy aynası.',models:[['ayna-cercevesi','Dikdörtgen çerçeveli'],['yuvarlak-ayna','Yuvarlak'],['ayakli-ayna','Ayaklı boy aynası']]},
  {id:'duvar-askiligi',name:'Askılık',desc:'Kavela çubuklu duvar askılığı, raflı kısa anahtarlık ya da dört ayaklı portmanto.',models:[['askilik','Askılık'],['anahtarlik','Anahtarlık'],['portmanto','Ayaklı portmanto'],['antre-paneli','Antre askı paneli']]},
  {id:'dekor-merdiven',name:'Dekor merdiveni',desc:'Duvara yaslanan battaniye ya da havlu merdiveni.',models:[['battaniye-merdiveni','Battaniye merdiveni'],['havlu-merdiveni','Havlu merdiveni']]},
  {id:'ayakkabilik',name:'Ayakkabılık',desc:'Kapı önü için çıtalı altlık, açık ayakkabı rafı ya da kapaklı dolap.',models:[['izgara-altlik','Çıtalı altlık (ayrıntılı kılavuz)'],['ayakkabi-rafi','Açık raf'],['ayakkabi-dolabi','Kapaklı dolap']]},
  {id:'saklama-kasasi-u',name:'Saklama kasası',desc:'Battaniye, oyuncak ve dergi için açık çıtalı kasa.',models:[['citali-kasa','Klasik (ayrıntılı kılavuz)'],['saklama-kasasi','Çıtalı kasa']]},
  {id:'kesme-tahtasi',name:'Kesme tahtası',desc:'Şeritlerden tutkallanan masif kesme tahtası; dikdörtgen ya da yuvarlak.',models:[['kesme-tahtasi','Çizgili (ayrıntılı kılavuz)'],['kesme-tahtasi-f','Dikdörtgen'],['yuvarlak-kesme','Yuvarlak']]},
  {id:'sunum-tahtasi',name:'Sunum tahtası',desc:'Servis, peynir ya da pizza için ince sunum tahtası.',models:[['servis-tahtasi','Servis'],['peynir-tahtasi','Peynir'],['pizza-tahtasi','Pizza']]},
  {id:'mutfak-dolabi',name:'Mutfak dolabı',desc:'Tezgâh altı, duvar üstü ya da boy kiler dolabı.',models:[['mutfak-alt','Alt dolap'],['mutfak-ust','Üst dolap'],['kiler-dolabi','Kiler (boy)']]},
  {id:'bahce-banki-u',name:'Bahçe bankı',desc:'Dış mekân bankı; dik ya da eğik sırtlı, sırtsız veya balkon boyu.',models:[['bahce-banki','Sırtlı'],['egik-bank','Eğik sırtlı'],['piknik-banki','Sırtsız'],['balkon-banki','Balkon']]},
  {id:'bahce-koltugu-u',name:'Bahçe koltuğu',desc:'Tek kişilik kolçaklı koltuk ya da eğik sırtlı sandalye.',models:[['bahce-koltugu','Kolçaklı koltuk'],['egik-sandalye','Eğik sırtlı sandalye']]},
  {id:'sezlong-u',name:'Şezlong',desc:'Düz ya da sırtı ayarlanan güneşlenme yatağı.',models:[['sezlong','Düz'],['ayarli-sezlong','Ayarlı sırtlı']]},
  {id:'bahce-masasi-u',name:'Bahçe masası',desc:'Dikdörtgen bahçe masası, yuvarlak bistro masası ya da oturaklı piknik masası.',models:[['bahce-masasi','Dikdörtgen'],['bistro-masasi','Yuvarlak bistro'],['piknik-masasi','Oturaklı piknik']]},
  {id:'kus-evi-u',name:'Kuş ve böcek evi',desc:'Düz ya da beşik çatılı kuş yuvası, açık yemlik ya da böcek oteli.',models:[['kus-evi','Düz çatılı'],['catili-kus-evi','Beşik çatılı'],['kus-yemligi','Yemlik'],['bocek-oteli','Böcek oteli']]},
  {id:'saksi',name:'Saksı',desc:'Ahşap saksı kutusu, ayaklı yükseltilmiş saksı ya da tabansız bahçe yatağı.',models:[['saksi-kutusu','Saksı kutusu'],['yuksek-saksi','Ayaklı'],['bahce-yatagi','Bahçe yatağı']]},
  {id:'saksi-standi-u',name:'Saksı standı',desc:'Kare stand, duvara yaslı merdiven, basamaklı stand ya da balkon rafı.',models:[['saksi-standi','Kare'],['saksi-merdiveni','Duvara yaslı'],['saksi-basamagi','Basamaklı'],['cicek-rafi','Balkon rafı']]},
  {id:'cocuk-masasi-u',name:'Çocuk masası',desc:'Kontrplak tablalı çocuk aktivite masası; dikdörtgen ya da yuvarlak.',models:[['cocuk-masasi','Dikdörtgen'],['yuvarlak-cocuk-masasi','Yuvarlak']]},
  {id:'pano-u',name:'Pano',desc:'Mantar ya da kara tahta yüzeyli duvar panosu.',models:[['pano','Dikdörtgen'],['yuvarlak-pano','Yuvarlak mantar']]},
  {id:'sovale-u',name:'Şövale',desc:'Ayaklı ya da masa üstü A çerçeve şövale.',models:[['sovale','Ayaklı'],['masa-sovalesi','Masa üstü']]},
  {id:'dolap',name:'Kapaklı dolap',desc:'Raflı ve kapaklı dolaplar: çok amaçlı, gardırop, çekmeceli, dosya ya da duvara asılan banyo dolabı.',models:[['kapakli-dolap','Çok amaçlı'],['gardirop','Gardırop'],['vitrin-dolap','Çekmeceli kapaklı'],['dosya-dolabi','Dosya dolabı'],['banyo-dolabi','Banyo (asma)'],['lavabo-dolabi','Lavabo altı']]},
  {id:'mutfak-kutusu',name:'Mutfak kutusu',desc:'Tezgâh üstü ekmeklik, bölmeli çay kutusu ya da kaşıklık.',models:[['ekmek-kutusu','Ekmeklik'],['cay-kutusu','Çay kutusu'],['kasiklik','Kaşıklık'],['bicak-blogu','Bıçak bloğu']]},
  {id:'mutfak-rafi',name:'Mutfak rafı',desc:'Duvar baharatlığı, dolap içi basamaklı raf, şarap rafı ya da kadeh askılı şarap rafı.',models:[['baharatlik','Baharatlık'],['basamakli-raf','Basamaklı'],['sarap-rafi','Şarap rafı'],['kadeh-rafi','Kadeh askılı şarap rafı'],['tezgah-rafi','Tezgâh üstü katlı raf']]},
  {id:'mutfak-kasasi',name:'Mutfak kasası',desc:'Havadar meyve-sebze kasası ya da şişe kasası.',models:[['meyve-kasasi','Meyve ve sebze'],['sarap-kasasi','Şarap']]},
  {id:'mutfak-askisi',name:'Mutfak askısı',desc:'Duvara havlu ve önlük askısı ya da tezgâh üstü kupa ağacı.',models:[['havlu-askisi','Havlu askısı'],['kupa-agaci','Kupa ağacı'],['havluluk','Kâğıt havluluk']]},
  {id:'saklama-kutusu-u',name:'Saklama kutusu',desc:'Kapaklı saklama kutusu, bölmeli çekmece düzenleyici ya da kabloları gizleyen şarj istasyonu.',models:[['saklama-kutusu','Kapaklı kutu'],['cekmece-duzen','Çekmece düzenleyici'],['sarj-kutusu','Şarj istasyonu']]},
  {id:'hobi-kutusu',name:'Hobi kutusu',desc:'Bölmeli, menteşeli kapaklı takı, dikiş ve oyun kutuları ile kalemlik.',models:[['taki-kutusu','Takı'],['dikis-kutusu','Dikiş'],['oyun-kutusu','Masa oyunu'],['kalemlik','Kalemlik']]},
  {id:'sergi-rafi',name:'Sergi rafı',desc:'Koleksiyon için sık raflı duvar rafı ya da önü camlı vitrin kutusu.',models:[['koleksiyon-rafi','Koleksiyon rafı'],['maket-vitrini','Vitrin kutusu']]},
  {id:'masa-ustu-stand',name:'Masa üstü stand',desc:'Kulaklık standı, L biçimli kitap desteği ya da laptop yükseltici.',models:[['kulaklik-standi','Kulaklık standı'],['kitap-destegi','Kitap desteği'],['laptop-yukseltici','Laptop yükseltici'],['tablet-standi','Tablet ve telefon standı']]},
  {id:'bahce-kasasi',name:'Bahçe kasası',desc:'Havalandırmalı odunluk ya da tabansız kompost kasası.',models:[['odunluk','Odunluk'],['kompost','Kompost']]},
  {id:'cocuk-oturagi',name:'Çocuk oturağı',desc:'Üç ayaklı çocuk taburesi, sırtlı küçük bank ya da tablalı mama sandalyesi.',models:[['cocuk-taburesi','Tabure'],['cocuk-banki','Bank'],['mama-sandalyesi','Mama sandalyesi']]},
  {id:'atolye-duvari',name:'Atölye duvar düzeni',desc:'Fransız askılı alet panosu ya da kollu işkence rafı.',models:[['alet-panosu','Alet panosu'],['iskence-rafi','İşkence rafı']]},
  {id:'oyuncak-sandigi',name:'Oyuncak sandığı',desc:'Kapaklı tekerlekli sandık ya da ipli çekme arabası biçiminde oyuncak kutusu.',models:[['oyuncak-sandigi','Kapaklı sandık'],['oyuncak-arabasi','Çekme arabası']]},
  {id:'calisma-masasi',name:'Çalışma masası',desc:'Ayaklı sade çalışma masası, dar alan için duvara katlanır masa ya da bir yanı boy kitaplık olan masa.',models:[['calisma-masasi','Ayaklı'],['duvar-masasi','Duvara katlanır'],['kitaplikli-masa','Kitaplıklı']]},
  {id:'evcil-merdiven',name:'Evcil hayvan merdiveni',desc:'Koltuğa ya da yatağa çıkmak için kaydırmaz basamaklı merdiven ya da çıtalı rampa.',models:[['kopek-merdiveni','Merdiven'],['kopek-rampasi','Rampa']]},
  {id:'tezgah',name:'Atölye tezgâhı',desc:'Ayaklı, alt raflı sağlam tezgâh ya da kullanılmadığında duvara kalkan katlanır tezgâh.',models:[['tezgah','Ayaklı'],['katlanir-tezgah','Duvara katlanır']]},
  {id:'asma-raf',name:'Asma raf',desc:'Tavandan halatla sarkan katlı raf ya da ayaksız, duvara asılan konsol masa.',models:[['sarkit-raf','Halatlı sarkıt raf'],['duvar-konsolu','Duvar konsolu']]},
  {id:'bahce-citi',name:'Bahçe çiti ve kapısı',desc:'Dikmeli, yatay ya da dikey tahtalı gizlilik çiti ve ona uyan Z kayıtlı bahçe kapısı.',models:[['bahce-citi','Çit'],['bahce-kapisi','Bahçe kapısı']]},
  {id:'kopek-kulubesi',name:'Köpek ve kedi kulübesi',desc:'Beşik çatılı ya da verandalı, rüzgâr bölmeli köpek kulübesi ve yalıtımlı, iki girişli sokak kedisi evi.',models:[['kopek-kulubesi','Beşik çatılı köpek kulübesi'],['verandali-kulube','Verandalı köpek kulübesi'],['kedi-evi','Sokak kedisi evi']]},
  {id:'kombi-dolabi',name:'Kombi ve makine dolabı',desc:'Havalandırmalı, baca delikli kombi dolabı ya da altı makine boşluklu, üstü kapaklı çamaşır makinesi dolabı.',models:[['kombi-dolabi','Kombi dolabı'],['makine-dolabi','Çamaşır makinesi dolabı']]},
  {id:'pergola',name:'Pergola',desc:'Dört dikmeli serbest duran ya da duvar kirişine bağlanan, istenirse gölgelik çıtalı pergola.',models:[['pergola','Serbest duran'],['duvar-pergolasi','Duvara bitişik']]},
  {id:'bisiklet-standi',name:'Bisiklet standı',desc:'Tekerlek yuvalı zemin standı ya da iki kollu duvar askısı.',models:[['bisiklet-standi','Zemin standı'],['bisiklet-askisi','Duvar askısı']]},
  {id:'salincak',name:'Salıncak',desc:'A ayaklı çerçeveli ya da tavana asılan zincirli bank, halatlı çocuk salıncağı.',models:[['bahce-salincagi','Bahçe salıncağı'],['veranda-salincagi','Veranda salıncağı'],['cocuk-salincagi','Çocuk salıncağı']]},
  {id:'oturma-grubu',name:'Oturma grubu',desc:'Çıtalı gövdeli, minderli tekli koltuk, kanepe ve köşe kanepe; bahçe için emprenye, salon için meşe.',models:[['tekli-koltuk','Tekli koltuk'],['kanepe','Kanepe'],['kose-kanepe','Köşe kanepe']]},
  {id:'epoksi-masa',name:'Epoksi masa',desc:'Canlı kenarlı kütüklerin arasına epoksi nehir dökülen yemek masası ya da orta sehpa.',models:[['epoksi-yemek-masasi','Yemek masası'],['epoksi-sehpa','Orta sehpa']]},
  {id:'banyo-rafi',name:'Banyo rafı',desc:'Duvara asılan arkalıklı dar raf ya da küvetin iki kenarına oturan çıtalı tahta.',models:[['banyo-rafi','Duvar rafı'],['kuvet-rafi','Küvet tahtası']]},
  {id:'kedi-kulesi',name:'Kedi mobilyası',desc:'Sisal direkli tırmalama kulesi ya da kum kabını gizleyen, üstü sehpa olan dolap.',models:[['kedi-kulesi','Tırmalama kulesi'],['kum-dolabi','Kum kabı dolabı'],['kedi-parkuru','Duvar parkuru']]},
  {id:'tepsi',name:'Tepsi',desc:'Tutma delikli servis tepsisi ya da ayaklı yatak ve laptop tepsisi.',models:[['tepsi','Servis tepsisi'],['yatak-tepsisi','Ayaklı yatak tepsisi']]},
];
const PRODUCTS=[], PROD={}, MODEL_OWNER={};
function mkModel(ref,label){return FAMBY[ref]?famModel(FAMBY[ref],label):featModel(FEATBY[ref],label);}
function addProduct(id,name,desc,models){
  const m0=models[0], cat=m0.kind==='fam'?m0.f.cat:m0.pr.cat, sub=SUBOF[m0.ref]||SUBS[cat][0];
  const prod={id,name,desc:desc||m0.desc,cat,sub,models,level:Math.min(...models.map(m=>m.level)),time:m0.time,nvar:models.reduce((a,m)=>a+m.nvar,0),
    hasFeat:models.some(m=>m.kind==='feat'),tags:models.map(m=>(m.kind==='fam'?(m.f.tags||'')+' '+m.f.name:m.pr.name)+' '+m.label).join(' ')};
  prod._s=trl([name,cat,sub,prod.tags,...models.flatMap(m=>m.optAx.flatMap(([k,vals,L])=>vals.map(v=>axLabel(L,v))))].join(' '));
  models.forEach((m,i)=>MODEL_OWNER[m.ref]={prod,mi:i});
  PRODUCTS.push(prod);PROD[id]=prod;
}
const grouped=new Set();
GROUPS.forEach(g=>{g.models.forEach(([r])=>grouped.add(r));addProduct(g.id,g.name,g.desc,g.models.map(([r,l])=>mkModel(r,l)));});
ALLFAMS.forEach(f=>{if(!grouped.has(f.id)) addProduct(f.id,f.name,f.desc,[famModel(f,f.name)]);});

/* ---------- seçim durumu ---------- */
SAVE.cfg=SAVE.cfg||{};
function stOf(prod){const s=SAVE.cfg[prod.id]=SAVE.cfg[prod.id]||{m:0,o:{}};if(!(s.m<prod.models.length))s.m=0;return s;}
function optsOf(prod,mi){const m=prod.models[mi],s=stOf(prod),o=s.o[mi]=s.o[mi]||{};
  m.optAx.forEach(([k,vals])=>{const hit=vals.find(v=>String(v)===String(o[k]));o[k]=hit!==undefined?hit:vals[0];});return o;}
function famOpt(f,m,opts,p){const vals=Object.assign({},p,opts);if(f.vd)Object.assign(vals,f.vd(vals));
  const base=Object.assign({},f.def?f.def(vals):{},vals), opt=Object.assign({},f.o);
  m.optAx.forEach(([k])=>opt[k]=opts[k]);Object.keys(base).forEach(k=>{if(!(k in f.P)&&opt[k]==null)opt[k]=base[k];});
  if(f.vo)Object.assign(opt,f.vo(vals));return opt;}
function configure(prod,mi){
  const m=prod.models[mi], key=prod.id+'.'+mi;
  if(m.kind==='feat') return Object.assign({},m.pr,{id:key,name:prod.name,prod,mi,cat:prod.cat,sub:prod.sub});
  const f=m.f, opts=optsOf(prod,mi), vals=Object.assign({},...m.dimAx.map(([k,v])=>({[k]:v[0]})),opts);
  if(f.vd)Object.assign(vals,f.vd(vals));
  const dd=f.def?f.def(vals):{};
  const params=Object.entries(f.P).map(([k,[min,max,step]])=>{let d=vals[k]!=null?vals[k]:dd[k]!=null?dd[k]:min;return{k,l:(f.lbl&&f.lbl[k])||PL[k],min,max,step:step||10,def:Math.max(min,Math.min(max,d))};});
  const pr={id:key,prod,mi,name:prod.name,famName:f.name,cat:prod.cat,sub:prod.sub,level:f.level,time:f.time,desc:f.desc,params,join:'',
    build:p=>{const c=f.b(p,famOpt(f,m,opts,p));pr.join=c.join;return c;},tools:(p,c)=>c.tools,notes:(p,c)=>c.notes||[],steps:(p,c,K)=>c.mkSteps(K)};
  return pr;
}
function presets(m){
  if(!m.dimAx.length) return [];
  let cs=[{}];m.dimAx.forEach(([k,vals])=>{const nx=[];cs.forEach(c=>vals.forEach(v=>nx.push(Object.assign({},c,{[k]:v}))));cs=nx;});
  return cs.slice(0,24).map(v=>{const dims=m.dimAx.filter(([k])=>k!=='N'&&k!=='BA').map(([k])=>(m.f.round&&k==='D'?'Ø':'')+v[k]/10).join('×');
    const ex=m.dimAx.filter(([k])=>k==='N'||k==='BA').map(([k])=>k==='N'?v[k]+' '+(m.f.nl||'raf'):v[k]+'° sırt');
    return {v,label:(dims?dims+' cm':'')+(ex.length?(dims?', ':'')+ex.join(', '):'')};});
}
function applyPreset(prod,mi,v){
  const m=prod.models[mi], f=m.f, pr=configure(prod,mi), cur=params(pr), opts=optsOf(prod,mi);
  const vals=Object.assign({},cur,opts,v);if(f.vd)Object.assign(vals,f.vd(vals));
  const dd=f.def?f.def(Object.assign({},opts,v)):{}, out=Object.assign({},cur);
  pr.params.forEach(q=>{let x=v[q.k]!=null?v[q.k]:dd[q.k]!=null?dd[q.k]:cur[q.k];out[q.k]=Math.max(q.min,Math.min(q.max,x));});
  SAVE.params[pr.id]=out;persist();
}

/* ---------- eski bağlantılar ve kayıtlar ---------- */
function resolveHash(h){
  if(PROD[h]) return {prod:PROD[h]};
  if(MODEL_OWNER[h]) return {prod:MODEL_OWNER[h].prod,mi:MODEL_OWNER[h].mi};
  const v=BYID[h];
  if(v&&v.fam&&MODEL_OWNER[v.fam]){const {prod,mi}=MODEL_OWNER[v.fam], m=prod.models[mi], opts={};
    m.optAx.forEach(([k])=>{if(v.vals&&v.vals[k]!==undefined)opts[k]=v.vals[k];});
    return {prod,mi,apply:{opts,params:Object.fromEntries(v.params.map(q=>[q.k,q.def]))}};}
  return null;
}
Object.keys(SAVE.fav).forEach(k=>{if(SAVE.fav[k]&&!PROD[k]){const r=resolveHash(k);if(r)SAVE.fav[r.prod.id]=true;delete SAVE.fav[k];}});

/* ---------- kart ve ürün sayfası ---------- */
function prodCard(prod){
  const mi=stOf(prod).m, pr=configure(prod,mi), p=params(pr), c=compute(pr,p), d=(SAVE.steps[pr.id]||[]).filter(Boolean).length;
  const mats=new Set(prod.models.flatMap(m=>m.optAx.filter(([k])=>k==='mat'||k==='sp'||k==='pat').flatMap(([,v])=>v))).size;
  const haveAny=Object.values(SAVE.have).some(Boolean), miss=haveAny?missingTools(prod).length:0;
  return `<a class="card" href="#${prod.id}"><div class="pic stage">${thumb(pr,{aria:prod.name,studio:true,grain:false})}<button class="fav" data-fav="${prod.id}" aria-pressed="${!!SAVE.fav[prod.id]}" aria-label="Favorilere ekle">${heart}</button>${prod.hasFeat?'<span class="badge">Ayrıntılı kılavuz</span>':''}</div>
  <div class="body"><div class="eyebrow">${esc(prod.sub)}</div><h3>${esc(prod.name)}</h3>
  <p class="muted cdesc">${esc(prod.desc)}</p>
  <div class="meta">${lvl(prod.level)}${prod.models.length>1?`<span class="tag">${prod.models.length} model</span>`:''}${mats>1?`<span class="tag">${mats} malzeme</span>`:''}${haveAny?`<span class="tag ${miss?'':'ok'}">${miss?miss+' alet eksik':'Aletlerin hazır'}</span>`:'<span class="tag">Ölçü ayarlı</span>'}</div>
  ${d?`<div class="prog" title="${d}/${c.steps.length} adım"><i style="width:${d/c.steps.length*100}%"></i></div>`:''}</div></a>`;
}
function viewProduct(r){
  const prod=r.prod, s=stOf(prod);
  if(r.mi!=null) s.m=r.mi;
  if(r.apply){Object.assign(optsOf(prod,s.m),r.apply.opts);SAVE.params[prod.id+'.'+s.m]=Object.assign({},r.apply.params);}
  persist();
  SAVE.recent=[prod.id,...(SAVE.recent||[]).filter(x=>x!==prod.id)].slice(0,8);persist();
  const same=CUR&&CUR.prod===prod, pr=configure(prod,s.m), p=params(pr);
  CUR={prod,pr,p,c:compute(pr,p),tab:same?CUR.tab:'genel',view:same?CUR.view:'iso',step:same?CUR.step:null};
  app.innerHTML=`<a class="back" href="#projeler">← Katalog</a>
  <div class="phead"><div class="eyebrow">${esc(prod.cat)} › ${esc(prod.sub)}</div><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><h1>${esc(prod.name)}</h1><button class="fav" style="position:static;flex:none" data-fav="${prod.id}" aria-pressed="${!!SAVE.fav[prod.id]}" aria-label="Favorilere ekle">${heart}</button></div>
  <p class="muted" style="max-width:62ch">${esc(prod.desc)}</p><div class="meta" id="pmeta"></div></div>
  <div class="layout"><div class="side">
    <div class="viewer stage" id="viewer"></div>
    <div class="facts" id="facts"></div>
    <div class="panel choices" id="choices"></div>
    <div class="panel params" id="params"></div></div>
    <div style="min-width:0"><div class="tabs" role="tablist">${[['genel','Genel'],['kesim','Kesim listesi'],['malzeme','Malzeme'],['ekipman','Ekipman'],['plan','Planlar'],['yapim','Yapım']].map(([k,t])=>`<button role="tab" data-tab="${k}" aria-selected="${CUR.tab===k}">${t}</button>`).join('')}</div>
    <div id="tabbody"></div></div></div>`;
  renderSide();refresh();
}
function renderSide(){
  const {prod,pr}=CUR, mi=stOf(prod).m, m=prod.models[mi], p=CUR.p;
  document.getElementById('pmeta').innerHTML=`${lvl(pr.level)}<span class="tag">${clockI}${esc(pr.time)}</span>${prod.models.length>1?`<span class="tag">${esc(m.label)}</span>`:''}`;
  const o=m.kind==='fam'?optsOf(prod,mi):{}, pres=m.kind==='fam'?presets(m):[];
  const curP=pres.findIndex(x=>Object.entries(x.v).every(([k,v])=>p[k]===v));
  document.getElementById('choices').innerHTML=`
    ${prod.models.length>1?`<div class="cgroup"><h4>Model</h4><div class="models">${prod.models.map((mm,i)=>{const cp=configure(prod,i);
      return `<button class="model" data-model="${i}" aria-pressed="${i===mi}"><span class="pic stage">${thumb(cp,{studio:true,grain:false})}</span><span class="ml">${esc(mm.label)}</span></button>`;}).join('')}</div></div>`:''}
    ${m.optAx.map(([k,vals,L])=>{const info=INFO[k]&&INFO[k][o[k]];
      return `<div class="cgroup"><h4>${esc(AXL[k]||k)}</h4><div class="seg">${vals.map(v=>`<button data-opt="${esc(k)}" data-val="${esc(String(v))}" aria-pressed="${String(o[k])===String(v)}">${esc(cap(axLabel(L,v)))}</button>`).join('')}</div>${info?`<p class="cinfo">${esc(info)}</p>`:''}</div>`;}).join('')}
    ${pres.length>1?`<div class="cgroup"><h4>Hazır ölçüler</h4><div class="seg">${pres.map((x,i)=>`<button data-preset="${i}" aria-pressed="${i===curP}">${esc(x.label)}</button>`).join('')}</div></div>`:''}
    ${m.kind==='feat'?'<p class="cinfo">Bu model elle yazılmış, ayrıntılı bir kılavuzdur. Ölçüleri aşağıdan ayarlayabilirsin.</p>':''}`;
  document.getElementById('choices').hidden=!document.getElementById('choices').innerHTML.trim();
  document.getElementById('params').innerHTML=`<header><h3>Ölçüler</h3><button class="btn sm" id="reset">Varsayılana dön</button></header>
    ${pr.params.map(q=>`<div class="prm"><label for="r-${q.k}">${esc(q.l)}</label><span class="num"><input type="number" id="n-${q.k}" min="${q.min}" max="${q.max}" step="${q.step}" value="${p[q.k]}" data-k="${q.k}" aria-label="${esc(q.l)}"><span class="muted" style="font-size:13px">${q.k==='N'?'adet':q.k==='BA'?'°':'mm'}</span></span>
      <input type="range" id="r-${q.k}" min="${q.min}" max="${q.max}" step="${q.step}" value="${p[q.k]}" data-k="${q.k}"></div>`).join('')}`;
}
function reconfigure(){const {prod}=CUR, mi=stOf(prod).m;CUR.pr=configure(prod,mi);CUR.p=params(CUR.pr);CUR.c=compute(CUR.pr,CUR.p);CUR.step=null;renderSide();refresh();}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.mk!=null){Q.mk=t.dataset.mk;Q.page=1;renderCatalog();return;}
  if(t.dataset.ready){Q.ready=!Q.ready;Q.page=1;renderCatalog();return;}
  if(t.dataset.copy){copyText(t,t.dataset.copy==='kesim'?cutText():shopText());return;}
  if(!CUR||!CUR.prod)return;
  const {prod}=CUR, s=stOf(prod);
  if(t.dataset.model!=null){s.m=+t.dataset.model;persist();viewProduct({prod});return;}
  if(t.dataset.opt){const m=prod.models[s.m], ax=m.optAx.find(([k])=>k===t.dataset.opt);if(!ax)return;
    optsOf(prod,s.m)[ax[0]]=ax[1].find(v=>String(v)===t.dataset.val);
    if(m.f.vd){const pr=configure(prod,s.m), cur=params(pr), vd=m.f.vd(Object.assign({},cur,optsOf(prod,s.m)));SAVE.params[pr.id]=Object.assign({},cur,vd);}
    persist();reconfigure();return;}
  if(t.dataset.preset!=null){const m=prod.models[s.m];applyPreset(prod,s.m,presets(m)[+t.dataset.preset].v);reconfigure();return;}
});

/* ---------- verimlilik: hesap ve önizleme önbelleği ---------- */
const CC=new Map(), TC=new Map();
const cfgSig=pr=>pr.prod?JSON.stringify((SAVE.cfg[pr.prod.id]||{o:{}}).o[pr.mi]||{}):'';
const _compute=compute;
compute=function(pr,p){const k=pr.id+'|'+JSON.stringify(p)+'|'+cfgSig(pr);let c=CC.get(k);
  if(!c){c=_compute(pr,p);CC.set(k,c);if(CC.size>500)CC.delete(CC.keys().next().value);}return c;};
function thumb(pr,opt){const p=params(pr),k=pr.id+'|'+JSON.stringify(p)+'|'+cfgSig(pr)+'|'+JSON.stringify(opt);let s=TC.get(k);
  if(!s){s=iso(compute(pr,p).parts,opt);TC.set(k,s);if(TC.size>300)TC.delete(TC.keys().next().value);}return s;}

/* ---------- katalog: malzeme ve "aletlerim yeterli" süzgeçleri ---------- */
const MK=[['plaka','Plaka (kontrplak, MDF, suntalam)'],['masif','Masif ağaç'],['dis','Dış mekâna uygun']];
function kindsOf(prod){if(prod._k)return prod._k;const k=new Set();
  prod.models.forEach((m,i)=>{const pr=configure(prod,i),c=compute(pr,params(pr));
    c.parts.forEach(q=>{const t=MAT[q.mat].type;if(t==='sheet')k.add('plaka');if(t==='lumber')k.add('masif');});
    if(m.kind==='fam'&&(m.f.o.outdoor||m.f.o.sp==='emp'||m.optAx.some(([a,v])=>a==='sp'&&v.includes('emp'))))k.add('dis');});
  return prod._k=k;}
function missingTools(prod){const pr=configure(prod,stOf(prod).m),p=params(pr),c=compute(pr,p);
  return [...new Set(pr.tools(p,c).filter(([,n])=>!/isteğe/.test(n||'')).map(([id])=>id))].filter(id=>!SAVE.have[id]);}
Q.mk='';Q.ready=false;
filtered=function(skip){const words=trl(Q.q).split(/\s+/).filter(Boolean);
  return PRODUCTS.filter(p=>(skip==='cat'||!Q.cat||p.cat===Q.cat)&&(skip==='cat'||!Q.sub||p.sub===Q.sub)&&(skip==='lvl'||!Q.lvl||p.level===Q.lvl)
    &&(skip==='mk'||!Q.mk||kindsOf(p).has(Q.mk))&&(!Q.ready||!missingTools(p).length)&&(!words.length||words.every(w=>p._s.includes(w))));};
renderCatalog=function(){
  const F=document.getElementById('filters'); if(!F) return;
  const baseCat=filtered('cat'), baseLvl=filtered('lvl'), baseMk=filtered('mk'), cnt=(a,f)=>a.filter(f).length, desk=matchMedia('(min-width:900px)').matches;
  const haveN=Object.values(SAVE.have).filter(Boolean).length, active=Q.cat||Q.lvl||Q.mk||Q.ready;
  F.innerHTML=`<details class="fbox" ${desk||FOPEN?'open':''}><summary>Filtreler${active?' <span class="fdot"></span>':''}</summary>
    <div class="fgroup"><h4>Kategori</h4><ul class="tree"><li><button data-cat="" aria-pressed="${!Q.cat}">Tümü<span>${fmt(baseCat.length)}</span></button></li>
    ${CATS.map(cn=>{const open=Q.cat===cn;return `<li><button data-cat="${esc(cn)}" aria-pressed="${open&&!Q.sub}">${esc(cn)}<span>${cnt(baseCat,p=>p.cat===cn)}</span></button>${open?`<ul>${SUBS[cn].map(s=>`<li><button data-cat="${esc(cn)}" data-sub="${esc(s)}" aria-pressed="${Q.sub===s}">${esc(s)}<span>${cnt(baseCat,p=>p.cat===cn&&p.sub===s)}</span></button></li>`).join('')}</ul>`:''}</li>`;}).join('')}</ul></div>
    <div class="fgroup"><h4>Malzeme</h4><ul class="tree"><li><button data-mk="" aria-pressed="${!Q.mk}">Hepsi<span>${baseMk.length}</span></button></li>${MK.map(([k,t])=>`<li><button data-mk="${k}" aria-pressed="${Q.mk===k}">${t}<span>${cnt(baseMk,p=>kindsOf(p).has(k))}</span></button></li>`).join('')}</ul></div>
    <div class="fgroup"><h4>Zorluk</h4><ul class="tree">${['Hepsi','Kolay','Orta','İleri'].map((t,i)=>`<li><button data-lvl="${i}" aria-pressed="${Q.lvl===i}">${t}<span>${i?cnt(baseLvl,p=>p.level===i):baseLvl.length}</span></button></li>`).join('')}</ul></div>
    <div class="fgroup"><h4>Aletlerim</h4>${haveN?`<ul class="tree"><li><button data-ready="1" aria-pressed="${Q.ready}">Yalnızca yapabileceklerim<span>${cnt(PRODUCTS,p=>!missingTools(p).length)}</span></button></li></ul>`:`<p class="cinfo">Rehber'de ya da bir ürünün Ekipman sekmesinde "Bende var" işaretle; elindeki aletlerle yapabileceğin ürünleri süzebilirsin.</p>`}</div>
    ${active||Q.q?'<button class="btn sm" data-clear="1">Filtreleri temizle</button>':''}</details>`;
  F.querySelector('details').addEventListener('toggle',e=>{FOPEN=e.target.open;});
  let list=filtered();
  if(Q.sort==='ad') list=list.slice().sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  if(Q.sort==='kolay') list=list.slice().sort((a,b)=>a.level-b.level);
  if(Q.sort==='zor') list=list.slice().sort((a,b)=>b.level-a.level);
  if(Q.sort==='model') list=list.slice().sort((a,b)=>b.models.length-a.models.length);
  const n=Q.page*24, lbl=[Q.sub?esc(Q.cat)+' › '+esc(Q.sub):Q.cat?esc(Q.cat):'',Q.mk?MK.find(x=>x[0]===Q.mk)[1]:'',Q.ready?'aletlerimle yapılabilir':''].filter(Boolean).join(' · ');
  document.getElementById('catalog').innerHTML=`<div class="rbar"><p><b class="mono">${fmt(list.length)}</b> ürün${lbl?' · '+lbl:''}</p>
    <label for="sortSel">Sırala <select id="sortSel">${[['onerilen','Önerilen'],['ad','Ada göre'],['model','En çok modelli'],['kolay','Kolaydan zora'],['zor','Zordan kolaya']].map(([v,t])=>`<option value="${v}" ${Q.sort===v?'selected':''}>${t}</option>`).join('')}</select></label></div>
  ${list.length?`<div class="grid">${list.slice(0,n).map(prodCard).join('')}</div>`:`<div class="empty">Bu süzgeçlere uyan ürün yok. Bir süzgeci kaldırmayı ya da daha kısa bir kelime aramayı dene.<button class="btn" data-clear="1">Filtreleri temizle</button></div>`}
  ${list.length>n?`<button class="btn" data-more="1" style="justify-self:center;min-width:220px">Daha fazla göster (${fmt(list.length-n)} kaldı)</button>`:''}`;
};
document.addEventListener('click',e=>{if(e.target.closest('[data-clear]')){Q.mk='';Q.ready=false;}},true);

/* ---------- son bakılanlar ---------- */
const _viewHome=viewHome;
viewHome=function(){_viewHome();const rec=(SAVE.recent||[]).map(id=>PROD[id]).filter(Boolean).slice(0,4);
  if(rec.length) document.getElementById('katalog').insertAdjacentHTML('beforebegin',`<section class="sec"><header><h2>Son baktıkların</h2><span class="muted">Kaldığın yerden devam et</span></header><div class="grid">${rec.map(prodCard).join('')}</div></section>`);};

/* ---------- kopyalama ve maliyet ---------- */
function cutText(){const {prod,c}=CUR, by={};cutRows(c).forEach(r=>(by[r.mat]=by[r.mat]||[]).push(r));
  const m=prod.models[stOf(prod).m];
  let t=`${prod.name}${prod.models.length>1?' ('+m.label+')':''}: kesim listesi\nBitmiş ölçü ${c.dims.join(' × ')} mm. Parça ölçüleri mm: uzunluk × en × kalınlık\n`;
  Object.entries(by).forEach(([k,rs])=>{t+=`\n${MAT[k].n}\n`;rs.forEach(r=>{t+=`  ${r.num}. ${r.name}: ${r.n} adet, ${r.d.join(' × ')}${r.note?' ('+r.note+')':''}\n`;});});
  return t+'\nTalaş ile hazırlandı.';}
function shopText(){const {prod,c}=CUR;let t=`${prod.name}: alışveriş listesi\n\nAhşap\n`;
  stock(c).filter(s=>s.count).forEach(s=>{t+=`  • ${s.M.n}: ${s.count} ${s.type==='sheet'?`plaka (${s.M.SW}×${s.M.SH} mm)`:`boy (${s.L} mm)`}\n`;});
  t+='\nHırdavat ve sarf\n';c.hw.forEach(h=>{t+=`  • ${h[0]}: ${h[1]}${h[2]?' ('+h[2]+')':''}\n`;});return t;}
function copyText(btn,text){
  const label=btn.dataset.label||(btn.dataset.label=btn.textContent);
  const done=()=>{btn.textContent='Kopyalandı';setTimeout(()=>{btn.textContent=label;},1600);};
  const fallback=()=>{let ta=btn.parentElement.querySelector('textarea');if(!ta){ta=document.createElement('textarea');ta.readOnly=true;ta.className='copybox';ta.setAttribute('aria-label','Kopyalanacak metin');btn.parentElement.appendChild(ta);}
    ta.value=text;ta.focus();ta.select();btn.textContent='Metni seç ve kopyala';};
  try{navigator.clipboard.writeText(text).then(done,fallback);}catch(e){fallback();}
}
SAVE.price=SAVE.price||{};SAVE.priceX=SAVE.priceX||{};
const tl=n=>n.toLocaleString('tr-TR',{maximumFractionDigits:0})+' TL';
function costRows(){const st=stock(CUR.c);let tot=0,miss=0;
  const rows=st.map(s=>{const u=SAVE.price[s.m];if(u>0)tot+=u*s.count;else miss++;return {s,u};});
  const x=SAVE.priceX[CUR.prod.id];if(x>0)tot+=x;return {rows,tot,miss};}
// Parça başına maliyet: alınan stokun bedeli, o stoktan çıkan parçalara alanı (plaka) ya da boyu (kereste) oranında paylaştırılır.
// Böylece fire payı da parçalara dağılır; Atölyem'deki artandan çıkan parçalar 0 TL sayılır.
function partCosts(){const st=stock(CUR.c),cost={},cnt={},over={};let fire=0;
  const key=(m,x,sh)=>m+'|'+x.num+'|'+(sh?x.a+'x'+x.b:x.len);
  st.forEach(s=>{const sh=s.type==='sheet',u=SAVE.price[s.m];s.pk.over.forEach(x=>{const k=key(s.m,x,sh);over[k]=(over[k]||0)+1;});
    const list=(sh?s.pk.sheets:s.pk.boards).filter(b=>!b.off).flatMap(b=>sh?b.items:b.cuts),size=x=>sh?x.a*x.b:x.len,tot=list.reduce((a,x)=>a+size(x),0),pay=u>0&&tot>0;
    if(pay)fire+=u*s.count*(1-Math.min(1,s.eff));
    list.forEach(x=>{const k=key(s.m,x,sh);if(pay)cost[k]=(cost[k]||0)+u*s.count*size(x)/tot;cnt[k]=(cnt[k]||0)+1;});});
  const cnt0={...cnt};
  // Aynı numara ve ölçüde birden çok satır olabilir (farklı not ya da en): parçalar satırlara sırayla dağıtılır
  const rows=cutRows(CUR.c).map(r=>{const lum=MAT[r.mat].type==='lumber',k=key(r.mat,{num:r.num,len:r.d[0],a:r.d[0],b:r.d[1]},!lum),per=cost[k]?cost[k]/cnt0[k]:0;
    const n=Math.min(r.n,cnt[k]||0),o=Math.min(r.n-n,over[k]||0);if(cnt[k])cnt[k]-=n;if(over[k])over[k]-=o;
    return {r,tot:n*per,n,off:r.n-n-o,over:o,priced:SAVE.price[r.mat]>0};});
  return {rows,fire};}
function partCostHTML(){const {rows,fire}=partCosts();
  if(!rows.some(x=>x.priced))return '<p class="cinfo">Birim fiyatları girince her parçanın payına düşen tutar burada görünür.</p>';
  const q=({r,tot,n,off,over,priced})=>!priced?'fiyat yok':!n?(off?'artandan':'—'):tl(tot)+(n>1||off||over?`<br><span class="muted">${n>1?'adet '+tl(tot/n):''}${off?(n>1?' · ':'')+off+' tanesi artandan':''}${over?' · '+over+' tanesi stoktan uzun':''}</span>`:'');
  return `<div class="list">${rows.map(x=>`<div class="row"><div><div class="t"><b class="pn">${x.r.num}</b> ${esc(x.r.name)} ×${x.r.n}</div><div class="s">${x.r.d.join(' × ')} mm · ${esc(MAT[x.r.mat].n)}</div></div><span class="q mono" style="text-align:right">${q(x)}</span></div>`).join('')}</div>
  <p class="cinfo">Tutarlara fire payı dahildir${fire>0?`: alınan malzemenin yaklaşık ${tl(fire)} tutarındaki kısmı artan olarak kalır`:''}. Atölyem'deki artandan çıkan parçalar 0 TL sayılır.</p>`;}
const missTxt=m=>m?`${m} malzemenin fiyatı eksik; toplam yalnızca girdiklerini içerir. `:'';
function costHTML(){const {rows,tot,miss}=costRows();
  return `<div class="sec"><header><h2>Maliyet tahmini</h2><span class="muted" style="font-size:13px">Birim fiyatları kendi marketinden gir</span></header>
  <div class="list">${rows.map(({s,u})=>`<div class="row cost"><div><div class="t">${esc(s.M.n)}</div><div class="s">${s.count} ${s.type==='sheet'?'plaka':'boy'}</div></div>
    <input type="number" min="0" step="1" inputmode="decimal" data-price="${s.m}" value="${u>0?u:''}" placeholder="birim TL" id="price-${s.m}" aria-label="${esc(s.M.n)} birim fiyatı"><span class="q mono" data-ltot="${s.m}">${u>0?tl(u*s.count):'—'}</span></div>`).join('')}
    <div class="row cost"><div><div class="t">Hırdavat, tutkal, boya</div><div class="s">bu ürün için toplam</div></div><input type="number" min="0" step="1" inputmode="decimal" data-pricex="1" value="${SAVE.priceX[CUR.prod.id]||''}" placeholder="TL" id="pricex" aria-label="Hırdavat toplamı"><span class="q mono">&nbsp;</span></div>
    <div class="row cost total"><div class="t">Toplam</div><span></span><b class="q mono" id="costTot">${tot>0?tl(tot):'—'}</b></div></div>
  <p class="cinfo"><span id="costMiss">${missTxt(miss)}</span>Malzeme fiyatları bu tarayıcıda saklanır ve bütün ürünlerde kullanılır. Uygulama fiyat bilgisi içermez; değerleri sen girersin.</p></div>
  <div class="sec"><header><h2>Parça başına maliyet</h2><span class="muted" style="font-size:13px">Numaralar kesim listesiyle aynı</span></header><div id="partCost">${partCostHTML()}</div></div>`;}
document.addEventListener('input',e=>{const t=e.target;if(!CUR||!CUR.prod)return;
  if(t.dataset.price){const v=parseFloat(t.value);if(v>0)SAVE.price[t.dataset.price]=v;else delete SAVE.price[t.dataset.price];}
  else if(t.dataset.pricex){const v=parseFloat(t.value);if(v>0)SAVE.priceX[CUR.prod.id]=v;else delete SAVE.priceX[CUR.prod.id];}
  else return;
  persist();const {rows,tot,miss}=costRows();
  rows.forEach(({s,u})=>{const el=document.querySelector(`[data-ltot="${s.m}"]`);if(el)el.textContent=u>0?tl(u*s.count):'—';});
  document.getElementById('costTot').textContent=tot>0?tl(tot):'—';document.getElementById('costMiss').textContent=missTxt(miss);
  const pc=document.getElementById('partCost');if(pc)pc.innerHTML=partCostHTML();});
const _tKesim=TABS.kesim, _tMalz=TABS.malzeme;
TABS.kesim=()=>`<div class="copybar"><button class="btn sm" data-copy="kesim">Kesim listesini kopyala</button><span class="muted">Ebatlama servisine mesajla gönderebilirsin</span></div>`+_tKesim();
TABS.malzeme=()=>`<div class="copybar"><button class="btn sm" data-copy="malzeme">Alışveriş listesini kopyala</button><span class="muted">Hırdavatçıya ya da kendine gönder</span></div>`+_tMalz()+costHTML();

/* ---------- artan parçalar (Atölyem) ---------- */
SAVE.left=SAVE.left||[];
const leftDims=o=>o.L?`${o.L} mm boy`:`${o.W} × ${o.H} mm`;
function leftHTML(){const mats=Object.keys(MAT).filter(m=>MAT[m].type!=='hw');
  return `<section class="sec mine-section" id="artanlar"><header><h2>Artan parçalarım</h2><span class="muted">${SAVE.left.length} parça</span></header>
  ${SAVE.left.length?`<div class="list">${SAVE.left.map(o=>`<div class="row"><div><div class="t">${esc(MAT[o.m]?MAT[o.m].n:o.m)}</div><div class="s">${leftDims(o)}${o.src?' · '+esc(o.src):''}</div></div><button class="text-link" data-delleft="${esc(o.id)}" aria-label="${esc(leftDims(o))} artanını sil">Sil</button></div>`).join('')}</div>`:'<p class="muted">Kesim yerleşiminde “Artanı sakla”ya dokun ya da elindeki parçayı aşağıdan ekle. Sonraki projelerde parçalar önce bunlardan kesilir.</p>'}
  <div class="leftadd"><label>Malzeme <select id="leftMat">${mats.map(m=>`<option value="${m}">${esc(MAT[m].n)}</option>`).join('')}</select></label>
  <label>Boy (lif yönü) <input type="number" id="leftL" min="50" step="1" inputmode="numeric" placeholder="mm"></label>
  <label>En <input type="number" id="leftW" min="50" step="1" inputmode="numeric" placeholder="plaka için, mm"></label>
  <button class="btn sm" data-addleft="1">Ekle</button></div></section>`;}
function addLeft(o){SAVE.left.push(Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:new Date().toISOString().slice(0,10)},o));persist();}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.keep){const o=JSON.parse(t.dataset.keep);addLeft(Object.assign(o,{src:CUR&&CUR.prod?CUR.prod.name:''}));refresh();return;}
  if(t.dataset.useleft&&CUR){const ids=new Set(stock(CUR.c).flatMap(s=>(s.type==='sheet'?s.pk.sheets:s.pk.boards).filter(b=>b.off).map(b=>b.off.id)));
    SAVE.left=SAVE.left.filter(o=>!ids.has(o.id));persist();refresh();return;}
  if(t.dataset.delleft){SAVE.left=SAVE.left.filter(o=>o.id!==t.dataset.delleft);persist();viewMine();return;}
  if(t.dataset.addleft){const m=document.getElementById('leftMat').value,L=Math.round(+document.getElementById('leftL').value),W=Math.round(+document.getElementById('leftW').value);
    if(!(L>=50)){document.getElementById('leftL').focus();return;}
    if(MAT[m].type==='lumber')addLeft({m,L,src:'Elle eklendi'});
    else{if(!(W>=50)){document.getElementById('leftW').focus();return;}if(L>MAT[m].SW&&L>MAT[m].SH){document.getElementById('leftL').focus();return;}addLeft({m,W:L,H:W,src:'Elle eklendi'});}
    viewMine();document.getElementById('artanlar').scrollIntoView();return;}
});
