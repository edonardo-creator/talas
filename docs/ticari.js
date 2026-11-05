"use strict";
/* Talaş Atölye: gelir katmanı (reklam, premium, ortaklık bağlantıları). atolye.js'den sonra yüklenir.
   Mağaza uygulamasında (Capacitor) AdMob ve RevenueCat eklentileri window.Capacitor.Plugins üzerinden kullanılır;
   web'de eklenti yoktur: reklam gösterilmez, premium WEB_ALL_FREE ile belirlenir. Kimlikler TICARI içinde, gerçek
   değerler hesaplar açılınca girilir (boşken ya da test modunda Google'ın herkese açık test kimlikleri kullanılır). */

const TICARI = {
  webUrl: 'https://edonardo-creator.github.io/talas/',
  webAllFree: true,                       // web sürümünde premium özellikler açık, reklam yok
  testAds: true,                          // yayından önce false yap ve gerçek reklam birimlerini gir
  admob: {
    android: { banner: '' },              // ca-app-pub-XXXX/YYYY (AdMob > Uygulamalar > Reklam birimleri)
    ios: { banner: '' }
  },
  revenuecat: { android: '', ios: '' },   // RevenueCat genel SDK anahtarları (goog_... / appl_...)
  entitlement: 'premium',
  affiliate: { amazonTag: '' },           // Amazon Ortaklık takip kimliği (ör. talas-21)
  privacyUrl: 'https://edonardo-creator.github.io/talas/gizlilik.html',
  termsUrl: 'https://edonardo-creator.github.io/talas/kosullar.html'
};
const TEST_BANNER = { android: 'ca-app-pub-3940256099942544/6300978111', ios: 'ca-app-pub-3940256099942544/2934735716' };

const CAP = window.Capacitor, NATIVE = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform()), PLATFORM = NATIVE ? CAP.getPlatform() : 'web';
const plug = n => NATIVE && CAP.Plugins ? CAP.Plugins[n] : null;

/* ---------- premium durumu ---------- */
let PREMIUM = !NATIVE && TICARI.webAllFree;
try { if (NATIVE && localStorage.getItem('talas_premium') === '1') PREMIUM = true; } catch (e) {}
const isPremium = () => PREMIUM;
function setPremium(v) {
  if (v === PREMIUM) return;
  PREMIUM = v;
  try { localStorage.setItem('talas_premium', v ? '1' : '0'); } catch (e) {}
  if (v) Ads.remove(); else Ads.place();
  if (typeof refresh === 'function' && CUR && CUR.prod) refresh(); else if (location.hash === '#defterim' && typeof viewMine === 'function') viewMine();
}

const Store = {
  ready: false,
  async init() {
    const P = plug('Purchases'), key = TICARI.revenuecat[PLATFORM];
    if (!P || !key) return;
    try {
      await P.configure({ apiKey: key });
      this.ready = true;
      await this.sync();
      P.addCustomerInfoUpdateListener && P.addCustomerInfoUpdateListener(info => this.apply(info));
    } catch (e) { console.warn('RevenueCat', e); }
  },
  apply(res) { const info = res && (res.customerInfo || res); if (info && info.entitlements) setPremium(!!info.entitlements.active[TICARI.entitlement]); },
  async sync() { const P = plug('Purchases'); if (this.ready) this.apply(await P.getCustomerInfo()); },
  async packages() {
    const P = plug('Purchases'); if (!this.ready) return [];
    const o = await P.getOfferings(); return (o.current && o.current.availablePackages) || [];
  },
  async buy(pkg) { const P = plug('Purchases'); this.apply(await P.purchasePackage({ aPackage: pkg })); },
  async restore() { const P = plug('Purchases'); this.apply(await P.restorePurchases()); }
};

/* ---------- reklam (yalnız mağaza uygulaması, premium değilse) ---------- */
const Ads = {
  on: false, margin: null,
  async init() {
    const A = plug('AdMob'); if (!A || PREMIUM) return;
    try {
      if (PLATFORM === 'ios' && A.requestTrackingAuthorization) { const s = await A.trackingAuthorizationStatus(); if (s.status === 'notDetermined') await A.requestTrackingAuthorization(); }
      await A.initialize({ initializeForTesting: TICARI.testAds });
      const ci = await A.requestConsentInfo();
      if (ci.isConsentFormAvailable && ci.status === 'REQUIRED') await A.showConsentForm();
      this.on = true; this.place();
    } catch (e) { console.warn('AdMob', e); }
  },
  // Alt menünün ya da ürün sayfasındaki eylem çubuğunun hemen üstüne yerleşir; yapım adımlarında içeriği örtmez
  async place() {
    const A = plug('AdMob'); if (!A || !this.on || PREMIUM) return;
    const bar = document.querySelector(document.body.classList.contains('project-page') ? '.project-actions' : '.nav');
    const m = bar && getComputedStyle(bar).display !== 'none' ? Math.round(bar.getBoundingClientRect().height) : 0;
    if (m === this.margin) return;
    try {
      if (this.margin !== null) await A.removeBanner();
      const id = TICARI.testAds || !TICARI.admob[PLATFORM].banner ? TEST_BANNER[PLATFORM] : TICARI.admob[PLATFORM].banner;
      await A.showBanner({ adId: id, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER', margin: m, isTesting: TICARI.testAds });
      this.margin = m; document.body.classList.add('has-ad');
    } catch (e) { console.warn('AdMob banner', e); }
  },
  async remove() { const A = plug('AdMob'); if (!A || this.margin === null) return; try { await A.removeBanner(); } catch (e) {} this.margin = null; document.body.classList.remove('has-ad'); }
};
const _pageMode = pageMode;
pageMode = function(mode) { _pageMode(mode); setTimeout(() => Ads.place(), 60); };

/* ---------- premium ekranı ---------- */
const PERKS = [['Reklamsız kullanım', 'Hiçbir sayfada reklam görmezsin.'], ['Artan parça takibi', 'Kesimden artanları Atölyem’de sakla, yeni projeler önce onlardan kesilsin.'], ['Parça başına maliyet', 'Her parçanın, fire dahil, sana kaça mal olduğunu gör.'], ['Yeni projelere destek', 'Her hafta eklenen yeni ürünlerin üretimine katkı.']];
function lockCard(title, text) {
  return `<div class="lock-card"><span class="lock-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg></span><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div><button class="btn primary sm" data-premium="1">Premium’u incele</button></div>`;
}
async function openPaywall() {
  let dlg = document.getElementById('paywall');
  if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'paywall'; dlg.className = 'paywall'; document.body.appendChild(dlg); }
  const head = `<button class="pw-close" data-pwclose="1" aria-label="Kapat">×</button><p class="eyebrow">TALAŞ PREMIUM</p><h2>Atölyeni bir üst seviyeye taşı</h2>
    <ul class="pw-perks">${PERKS.map(([t, s]) => `<li><b>${esc(t)}</b><span>${esc(s)}</span></li>`).join('')}</ul>`;
  const foot = `<p class="pw-legal">Abonelik, dönem bitmeden en az 24 saat önce iptal edilmezse aynı ücretle yenilenir; ${PLATFORM === 'ios' ? 'App Store' : 'Google Play'} hesap ayarlarından yönetip iptal edebilirsin. <a href="${TICARI.termsUrl}" target="_blank" rel="noopener">Kullanım koşulları</a> · <a href="${TICARI.privacyUrl}" target="_blank" rel="noopener">Gizlilik</a></p>`;
  dlg.innerHTML = head + '<div class="pw-plans"><p class="muted">Yükleniyor…</p></div>' + foot;
  if (!dlg.open) dlg.showModal();
  const box = dlg.querySelector('.pw-plans');
  if (PREMIUM) { box.innerHTML = '<p class="pw-ok">Premium açık. Teşekkürler!</p>'; return; }
  if (!NATIVE) { box.innerHTML = '<p class="muted">Premium, Talaş Atölye’nin Google Play ve App Store uygulamasında satın alınır.</p>'; return; }
  try {
    const pk = await Store.packages();
    if (!pk.length) { box.innerHTML = '<p class="muted">Şu an satın alma seçeneği yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.</p>'; return; }
    const name = p => ({ ANNUAL: 'Yıllık', MONTHLY: 'Aylık', LIFETIME: 'Ömür boyu' }[p.packageType] || p.product.title);
    box.innerHTML = pk.map((p, i) => `<button class="pw-plan${p.packageType === 'ANNUAL' ? ' best' : ''}" data-buy="${i}"><span>${esc(name(p))}${p.packageType === 'ANNUAL' ? ' <em>en avantajlı</em>' : ''}</span><b>${esc(p.product.priceString)}</b></button>`).join('') + '<button class="text-link link-center" data-restore="1">Satın alımlarımı geri yükle</button>';
    box._pk = pk;
  } catch (e) { box.innerHTML = '<p class="muted">Satın alma seçenekleri yüklenemedi.</p>'; }
}
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-premium],[data-pwclose],[data-buy],[data-restore]'); if (!t) return;
  if (t.dataset.premium) { e.preventDefault(); openPaywall(); return; }
  const dlg = document.getElementById('paywall');
  if (t.dataset.pwclose) { dlg.close(); return; }
  const box = dlg.querySelector('.pw-plans');
  try {
    t.disabled = true;
    if (t.dataset.buy) await Store.buy(box._pk[+t.dataset.buy]);
    if (t.dataset.restore) await Store.restore();
    if (PREMIUM) box.innerHTML = '<p class="pw-ok">Premium açık. Teşekkürler!</p>';
    else if (t.dataset.restore) box.insertAdjacentHTML('beforeend', '<p class="muted">Geri yüklenecek satın alım bulunamadı.</p>');
  } catch (err) { if (!(err && (err.userCancelled || err.code === '1'))) box.insertAdjacentHTML('beforeend', '<p class="muted">İşlem tamamlanamadı, yeniden dene.</p>'); }
  finally { t.disabled = false; }
});

/* ---------- premium kilitleri ---------- */
const _partCostHTML = partCostHTML;
partCostHTML = function() { return PREMIUM ? _partCostHTML() : lockCard('Parça başına maliyet', 'Her parçanın, fire dahil, kaça mal olduğunu Premium ile gör.'); };
const _leftHTML = leftHTML;
leftHTML = function() { return PREMIUM ? _leftHTML() : `<section class="sec mine-section" id="artanlar"><header><h2>Artan parçalarım</h2></header>${lockCard('Artan parça takibi', 'Kesimden artanları sakla; yeni projelerin önce bunlardan kesilsin, daha az malzeme al.')}</section>`; };
const _keepBtn = keepBtn;
keepBtn = function(k, o) { return PREMIUM ? _keepBtn(k, o) : '<button class="keep" data-premium="1">Artanı sakla · Premium</button>'; };

/* ---------- ortaklık (satın alma) bağlantıları ---------- */
const buyUrl = q => `https://www.amazon.com.tr/s?k=${encodeURIComponent(q)}${TICARI.affiliate.amazonTag ? '&tag=' + encodeURIComponent(TICARI.affiliate.amazonTag) : ''}`;
const buyLink = (q, label) => `<a class="buy-link" href="${buyUrl(q)}" target="_blank" rel="sponsored noopener">${label || 'Satın al'} ↗</a>`;
const _tMalzeme = TABS.malzeme;
TABS.malzeme = function() {
  const items = [...new Set([...stock(CUR.c).map(s => s.M.n), ...(CUR.c.hw || []).filter(Boolean).map(h => h[0])])];
  return _tMalzeme() + `<div class="sec buy-sec"><header><h2>Nereden alınır?</h2><span class="muted">Ortaklık bağlantısı</span></header>
    <div class="list">${items.map(n => `<div class="row"><div class="t">${esc(n)}</div>${buyLink(n.replace(/\s*\(.*?\)/g, ''))}</div>`).join('')}</div>
    <p class="cinfo">Bu bağlantılardan alışveriş yaparsan Talaş Atölye küçük bir komisyon alabilir; fiyat sana değişmez. Kereste ve plakayı yakınındaki keresteciden ya da ebatlama servisinden almak çoğu zaman daha uygundur.</p></div>`;
};
const _toolCard = toolCard;
toolCard = function(id, note) { return _toolCard(id, note).replace('<label class="tool-have">', `${buyLink(TOOLS[id].n, 'Satın al')}<label class="tool-have">`); };

/* ---------- uygulama içi düzenlemeler ---------- */
if (NATIVE) {
  document.documentElement.classList.add('native');
}

/* Atölyem'e premium kartı */
const _viewMine = viewMine;
viewMine = function() {
  _viewMine();
  if (!NATIVE) return;
  const stats = document.querySelector('.mine-stats');
  if (stats) stats.insertAdjacentHTML('afterend', PREMIUM ? '<div class="pw-badge">Premium açık ✓</div>' : `<button class="premium-cta" data-premium="1"><span><strong>Talaş Premium</strong><small>Reklamsız kullanım, artan parça takibi ve parça başına maliyet</small></span><span class="tile-arrow" aria-hidden="true">→</span></button>`);
};

Store.init().then(() => Ads.init());
