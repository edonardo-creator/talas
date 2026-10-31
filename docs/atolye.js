'use strict';
/* Talaş Atölye arayüzü (Codex tasarımı). Hesap motoru ve sayfaların içeriği önceki betiklerden gelir;
   bu dosya yalnız görünümü ve sayfa iskeletlerini değiştirir. En son yüklenir. */
const PHOTO_OF = { 'saklama-kasasi-u': 'kasa', 'bahce-koltugu-u': 'koltuk', 'orta-sehpa': 'sehpa' };
const photoHTML = (n, label) => `<div class="photo"><img src="assets/foto-${n}.jpg" alt="${esc(label)} için ilham fotoğrafı" decoding="async" loading="lazy" width="900" height="900"><span class="photo-caption">İlham fotoğrafı</span></div>`;
// PDF önizlemesi yeni pencere açar; Claude içinde çerçeveli sayfada bu engellidir.
const CAN_PRINT = window.top === window.self;
const arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>';
const brand = `<a class="site-brand" href="#projeler" aria-label="Talaş Atölye ana sayfa"><img src="assets/app-icon.png" alt="" width="38" height="40"><span class="site-word">Talaş<b> Atölye</b><small>KENDİ ELLERİNLE, KENDİ HİKÂYEN.</small></span></a>`;
document.getElementById('app').insertAdjacentHTML('beforebegin', `<header class="site-top"><div class="top-inner">${brand}<nav class="site-links" aria-label="Üst gezinme"><a href="#projeler" data-site-nav="projeler">Keşfet</a><a href="#fotograf" data-site-nav="fotograf">Fotoğraftan bul</a><a href="#rehber" data-site-nav="rehber">Rehber</a><a href="#defterim" data-site-nav="defterim">Atölyem</a></nav></div></header>`);
for (const [key, name] of [['projeler', 'Keşfet'], ['fotograf', 'Fotoğraf'], ['rehber', 'Rehber'], ['defterim', 'Atölyem']]) {
  const link = document.querySelector(`.nav a[data-nav="${key}"]`);
  if (link) { const icon = link.querySelector('svg').outerHTML; link.innerHTML = icon + name; }
}
function pageMode(mode) {
  document.body.classList.toggle('project-page', mode === 'product');
  document.body.dataset.screen = mode;
  const section = mode === 'product' ? 'projeler' : mode;
  document.querySelectorAll('[data-site-nav]').forEach(a => { if (a.dataset.siteNav === section) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
function favoriteButton(prod, position = '') {
  return `<button class="fav" ${position} data-fav="${prod.id}" aria-pressed="${!!SAVE.fav[prod.id]}" aria-label="${esc(prod.name)}: ${SAVE.fav[prod.id] ? 'Favorilerden çıkar' : 'Favorilere ekle'}">${heart}</button>`;
}
function favoriteLabels() {
  document.querySelectorAll('[data-fav]').forEach(b => {
    const prod = PROD[b.dataset.fav];
    if (prod) b.setAttribute('aria-label', prod.name + ': ' + (SAVE.fav[prod.id] ? 'Favorilerden çıkar' : 'Favorilere ekle'));
  });
}
prodCard = function(prod) {
  const mi = stOf(prod).m, pr = configure(prod, mi), c = compute(pr, params(pr));
  const d = (SAVE.steps[pr.id] || []).filter(Boolean).length;
  const pic = PHOTO_OF[prod.id];
  return `<article class="card"><a class="card-link" href="#${prod.id}" aria-label="${esc(prod.name)} projesini aç"><div class="pic ${pic !== undefined ? 'is-photo' : 'stage'}">${pic !== undefined ? photoHTML(pic, prod.name) : thumb(pr, { aria: prod.name, studio: true, grain: false })}${prod.hasFeat && pic === undefined ? '<span class="badge">Ayrıntılı kılavuz</span>' : ''}</div><div class="body"><div class="eyebrow">${esc(prod.sub)}</div><h3>${esc(prod.name)}</h3><p class="muted cdesc">${esc(prod.desc)}</p><div class="meta">${lvl(prod.level)}${prod.models.length > 1 ? `<span class="tag">${prod.models.length} model</span>` : '<span class="tag">Ölçü ayarlı</span>'}<span class="tag aux">${clockI} ${esc(pr.time)}</span>${Object.values(SAVE.have).some(Boolean) ? (n => `<span class="tag ${n ? '' : 'ok'}">${n ? n + ' alet eksik' : 'Aletlerin hazır'}</span>`)(missingTools(prod).length) : ''}</div>${d ? `<div class="prog" aria-label="${d} / ${c.steps.length} adım"><i style="width:${Math.min(100, d / c.steps.length * 100)}%"></i></div>` : ''}</div></a>${favoriteButton(prod)}</article>`;
};
function featureTile(prod) {
  const mi = stOf(prod).m, pr = configure(prod, mi), photo = PHOTO_OF[prod.id];
  return `<article class="project-tile"><a href="#${prod.id}" aria-label="${esc(prod.name)} seçkisini aç">${photo !== undefined ? photoHTML(photo, prod.name) : `<div class="tile-art stage">${thumb(pr, { studio: true, grain: false })}</div>`}<div class="tile-body"><div class="eyebrow">${esc(prod.cat)}</div><h3>${esc(prod.name)}</h3><div class="tile-bottom">${clockI} ${esc(pr.time)} <span class="tile-arrow" aria-hidden="true">→</span></div></div></a></article>`;
}
const quickCategories = [['', 'Tümü'], ['beginner', 'Başlangıç'], ['Bahçe ve dış mekân', 'Bahçe'], ['Ev mobilyası', 'Ev'], ['Mutfak ve küçük eşya', 'Mutfak'], ['Çocuk', 'Çocuk'], ['Atölye', 'Atölye'], ['Hobi', 'Hobi']];
viewHome = function() {
  pageMode('projeler');
  const picks = ['saklama-kasasi-u', 'orta-sehpa', 'bahce-koltugu-u'].map(id => PROD[id]).filter(Boolean);
  const nmod = PRODUCTS.reduce((sum, p) => sum + p.models.length, 0);
  const rec = (SAVE.recent || []).map(id => PROD[id]).filter(Boolean).slice(0, 4);
  const byCat = Object.fromEntries(CATS.map(c => [c, PRODUCTS.filter(p => p.cat === c)]));
  app.innerHTML = `<section class="welcome"><p class="eyebrow">BİRAZ İLHAM, BİRAZ EMEK.</p><h1>Bugün ne yapalım?</h1><p>Bir fikir seç. Ölçüsünü kendine göre ayarla.</p><a class="photo-cta" href="#fotograf"><span class="photo-cta-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7.5h3l2-3h6l2 3h3V19H4z"/><circle cx="12" cy="12.5" r="3.6"/></svg></span><span><strong>Beğendiğin bir ürün mü var?</strong><small>Fotoğrafını çek, en yakın projeyi ve ölçülerini bulalım.</small></span><span class="tile-arrow" aria-hidden="true">→</span></a></section>
    <section class="sec"><header><div class="section-copy"><h2>Atölyeden seçtiklerimiz</h2></div><span class="muted">Evine bir dokunuş</span></header><div class="feature-rail">${picks.map(featureTile).join('')}</div><div class="home-facts"><span><strong>${PRODUCTS.length}</strong> proje</span><i></i><span><strong>${nmod}</strong> model</span><i></i><span>Ölçüsüne göre hesaplanan planlar</span></div></section>
    <section class="sec" id="katalog"><div class="catalog-intro"><header class="section-copy"><p class="eyebrow">KÜÇÜK FİKİRLER, GÜZEL ŞEYLER.</p><h2>İlham köşesi</h2></header><input id="q" type="search" class="search" placeholder="Nasıl bir proje arıyorsun?" value="${esc(Q.q)}" aria-label="Katalogda ara"><div class="quick-cats" role="group" aria-label="Hızlı kategori seçimi">${quickCategories.map(([cat, label]) => `<button ${cat === '' ? 'data-clear="1"' : cat === 'beginner' ? 'data-beginner="1"' : `data-quick-cat="${esc(cat)}"`} aria-pressed="false">${label}</button>`).join('')}</div></div><div class="catlay"><aside class="filters" id="filters"></aside><div class="results"><div id="catalog" style="display:grid;gap:14px"></div></div></div><p class="photo-note">Fotoğraflar ilham içindir. Teknik çizimler, seçtiğin model ve ölçülerden üretilir.</p></section>
    ${rec.length ? `<section class="sec"><header><h2>Son baktıkların</h2><span class="muted">Kaldığın yerden devam et</span></header><div class="grid">${rec.map(prodCard).join('')}</div></section>` : ''}
    <details class="catalog-map"><summary>Kategorileri ve alt kategorileri keşfet</summary>${mapHTML(byCat)}</details><footer class="site-foot"><span>◇</span> Güzel şeyler, küçük bir fikirle başlar.</footer>`;
  renderCatalog();
};
const renderTechnicalCatalog = renderCatalog;
renderCatalog = function() {
  renderTechnicalCatalog();
  document.querySelectorAll('.quick-cats button').forEach(b => {
    const selected = b.dataset.beginner ? Q.lvl === 1 && !Q.cat : b.dataset.quickCat ? Q.cat === b.dataset.quickCat : !Q.cat && !Q.lvl && !Q.mk && !Q.ready && !Q.q;
    b.setAttribute('aria-pressed', selected);
  });
  favoriteLabels();
};
matchMedia('(min-width:900px)').addEventListener('change', () => {
  if (document.getElementById('filters')) renderCatalog();
});

viewProduct = function(r) {
  const prod = r.prod, state = stOf(prod);
  if (r.mi != null) state.m = r.mi;
  if (r.apply) { Object.assign(optsOf(prod, state.m), r.apply.opts); SAVE.params[prod.id + '.' + state.m] = Object.assign({}, r.apply.params); }
  persist();
  SAVE.recent = [prod.id, ...(SAVE.recent || []).filter(x => x !== prod.id)].slice(0, 8); persist();
  const same = CUR && CUR.prod === prod, pr = configure(prod, state.m), p = params(pr);
  CUR = { prod, pr, p, c: compute(pr, p), tab: same ? CUR.tab : 'genel', view: same ? CUR.view : 'iso', step: same ? CUR.step : null };
  pageMode('product');
  const pic = PHOTO_OF[prod.id], open = matchMedia('(min-width:900px)').matches ? 'open' : '';
  app.innerHTML = `<div class="project-toolbar"><a class="back" href="#projeler" aria-label="Projelere dön">←<span>Projelere dön</span></a><div class="toolbar-title">${esc(prod.name)}</div>${favoriteButton(prod)}</div>
    ${pic !== undefined ? `<div class="project-photo">${photoHTML(pic, prod.name)}</div>` : ''}
    <section class="phead"><p class="eyebrow">${esc(prod.cat)} / ${esc(prod.sub)}</p><h1>${esc(prod.name)}</h1><div class="meta" id="pmeta"></div><p class="muted">${esc(prod.desc)}</p></section>
    <div class="layout"><div class="side"><div class="viewer stage" id="viewer"></div><div class="facts" id="facts"></div><details class="config-panel" ${open}><summary>Model ve malzeme</summary><div class="panel choices" id="choices"></div></details><details class="config-panel" ${open}><summary>Ölçülerini ayarla</summary><div class="panel params" id="params"></div></details></div>
      <div class="detail-pane"><div class="tabs" role="tablist" aria-label="Proje bölümleri">${[['genel', 'Genel'], ['kesim', 'Kesim'], ['malzeme', 'Malzeme'], ['ekipman', 'Ekipman'], ['plan', 'Planlar'], ['yapim', 'Yapım']].map(([key, label]) => `<button role="tab" data-tab="${key}" aria-selected="${CUR.tab === key}">${label}</button>`).join('')}</div><div id="tabbody"></div></div></div><div class="project-actions" id="project-actions"></div>`;
  renderSide(); refresh();
};
const refreshTechnicalProject = refresh;
// Kaydedilmiş dizi henüz tüm adımları içermediğinde ilk eksik adımdan devam et.
curStep = function() {
  const done = SAVE.steps[CUR.pr.id] || [], total = CUR.c.steps.length;
  if (CUR.step == null) {
    const next = Array.from({ length: total }, (_, i) => i).find(i => !done[i]);
    CUR.step = next === undefined ? total - 1 : next;
  }
  return Math.max(0, Math.min(CUR.step, total - 1));
};
refresh = function() {
  refreshTechnicalProject();
  const viewer = document.getElementById('viewer');
  if (viewer) viewer.insertAdjacentHTML('beforeend', '<span class="viewer-label">SEÇTİĞİN ÖLÇÜLERLE · CANLI ÇİZİM</span>');
  const page = document.getElementById('tabbody');
  if (page && CUR.tab === 'yapim') { const caption = page.querySelector('.player > p.muted'); if (caption) caption.textContent = 'Turuncu çerçeveli parçalar bu adımda eklenenlerdir. Kesik çizgili parçalar sonraki adımlarda gelecek.'; }
  const actions = document.getElementById('project-actions');
  if (!actions) return;
  const completed = CUR.c.steps.every((_, i) => (SAVE.steps[CUR.pr.id] || [])[i]);
  let attr = 'data-tab="yapim"', label = 'Yapıma başla →';
  if (CUR.tab === 'genel') { attr = 'data-tab="kesim"'; label = 'Kesim listesini aç →'; }
  if (CUR.tab === 'yapim') { attr = completed ? 'data-finish="1"' : 'data-go="1"'; label = completed ? 'Atölyeme dön ✓' : curStep() === CUR.c.steps.length - 1 ? 'Projeyi tamamla ✓' : 'Sonraki adım →'; }
  actions.innerHTML = `<div class="action-inner">${CAN_PRINT ? `<button class="print-action" data-print="1" aria-label="Proje planını PDF olarak yazdır">${arrowIcon}<span>PDF</span></button>` : ''}<span class="action-hint">${esc(CUR.prod.name)} · ${CUR.c.dims.join(' × ')} mm</span><button class="btn primary" ${attr}>${label}</button></div>`;
};
TABS.genel = function() {
  const { pr, c, p } = CUR, notes = (pr.notes(p, c) || []).filter(Boolean), list = pr.tools(p, c).slice(0, 4);
  return `${notes.length ? `<div class="sec">${notes.map(n => `<div class="note ${n.t}"><b>${n.t === 'warn' ? 'Dikkat' : 'Not'}</b><span>${esc(n.x)}</span></div>`).join('')}</div>` : ''}
    <section class="sec"><header><h2>Ekipman</h2><button class="text-link" data-tab="ekipman">Tümünü gör →</button></header><div class="equipment-preview">${list.map(([id]) => `<div class="equip-mini"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[TOOLS[id].i]}</svg></span><span>${esc(TOOLS[id].n)}</span></div>`).join('')}</div></section>
    <section class="sec"><header><h2>Alışveriş listesi</h2><button class="text-link" data-tab="malzeme">Listeyi aç →</button></header><div class="list">${stock(c).map(item => `<div class="row"><div><div class="t">${esc(item.M.n)}</div><div class="s">${item.type === 'sheet' ? `${item.M.SW} × ${item.M.SH} mm plaka` : `${item.L} mm boy`}</div></div><span class="q">×${item.count}</span></div>`).join('')}</div>${c.hw.length ? `<div class="muted" style="font-size:11px">Hırdavat ve sarf kalemleri malzeme bölümünde.</div>` : ''}</section>
    <section class="sec"><header><h2>Ahşap ve kesim listesi</h2><span class="muted">${c.parts.filter(q => MAT[q.mat].type !== 'hw').length} parça</span></header><div class="cut-preview">${iso(c.parts, { explode: .55, labels: true, gnum: c.gnum, studio: true })}</div><button class="text-link link-center" data-tab="kesim">Kesim listesine bak →</button></section>
    <section class="sec"><header><h2>Proje planları</h2></header><div class="preview-plans">${[['front', 'Önden'], ['side', 'Yandan'], ['top', 'Üstten']].map(([view, label]) => `<figure>${ortho(c.parts.filter(q => q.g !== 'slide'), view)}<figcaption>${label}</figcaption></figure>`).join('')}</div><button class="text-link link-center" data-tab="plan">Ölçülü planları incele →</button><p class="spec-note">Ölçüler ve bağlantılar hesaplanır; dayanım doğrulaması yapılmamıştır. Üretimden önce bağlantıları ve malzeme seçimini bir ustayla kontrol et.</p></section>
    <section class="sec"><header><h2>Adım adım yapım</h2><span class="muted">${c.steps.length} adım</span></header><div class="list">${c.steps.map((step, i) => `<div class="row"><div class="t">${i + 1}. ${esc(step.t)}</div><span class="q">${(SAVE.steps[pr.id] || [])[i] ? '✓' : ''}</span></div>`).join('')}</div><button class="btn primary" data-tab="yapim">Yapıma başla</button></section>`;
};

const viewTechnicalGuide = viewGuide;
viewGuide = function() {
  pageMode('rehber'); viewTechnicalGuide();
  const title = app.querySelector('h1'); title.textContent = 'Atölyenin yardımcıları';
  title.insertAdjacentHTML('beforebegin', '<p class="eyebrow" style="margin-bottom:10px">AHŞABI TANI, ELİNİ ALIŞTIR.</p>');
  const intro = app.querySelector('p.muted'); if (intro) intro.textContent = 'Ahşap türleri, birleştirme yöntemleri ve aletlerin için bir başvuru köşesi.';
  const toc = app.querySelector('.toc');
  toc.outerHTML = `<div class="guide-tiles">${[['g-ahsap', 'Ahşabı tanı', 'Türünü, dokusunu ve kullanımını öğren.', '◫'], ['g-birlesim', 'Sağlam bağlantılar', 'Projene uygun birleştirmeyi keşfet.', '⌑'], ['g-alet', 'Alet çantam', 'Elindeki aletleri işaretle, projeleri süz.', '⌁']].map(([id, title, desc, symbol]) => `<a class="guide-tile" href="#rehber" data-jump="${id}"><span class="guide-symbol" aria-hidden="true">${symbol}</span><span><strong>${title}</strong><small>${desc}</small></span></a>`).join('')}</div>`;
};
function savedProgress(prod) {
  const models = prod.models.map((_, mi) => {
    const done = (SAVE.steps[prod.id + '.' + mi] || []).filter(Boolean).length;
    if (!done) return null;
    const pr = configure(prod, mi), total = compute(pr, params(pr)).steps.length;
    return { prod, mi, done, total };
  }).filter(Boolean);
  return models.find(m => m.done < m.total) || models[0] || null;
}
viewMine = function() {
  pageMode('defterim');
  const fav = PRODUCTS.filter(p => SAVE.fav[p.id]);
  const states = PRODUCTS.map(savedProgress).filter(Boolean), active = states.filter(s => s.done < s.total), complete = states.filter(s => s.done >= s.total);
  const have = Object.keys(SAVE.have).filter(k => SAVE.have[k]);
  const rows = states => `<div class="list">${states.map(s => `<a class="row" href="#${s.prod.id}" data-resume="${s.mi}" data-product="${s.prod.id}" style="color:inherit;text-decoration:none"><div><div class="t">${esc(s.prod.name)}</div><div class="prog" style="margin-top:8px"><i style="width:${Math.min(100, s.done / s.total * 100)}%"></i></div></div><span class="q">${s.done}/${s.total} →</span></a>`).join('')}</div>`;
  app.innerHTML = `<header class="welcome"><p class="eyebrow">FİKİRDEN GERÇEĞE</p><h1>Benim atölyem</h1><p>Sakladığın fikirler, başladığın hikâyeler.</p></header><div class="mine-stats"><div><b>${fav.length}</b><span>Favori</span></div><div><b>${active.length}</b><span>Devam eden</span></div><div><b>${complete.length}</b><span>Tamamlanan</span></div></div><section class="sec mine-section"><header><h2>Devam eden</h2></header>${active.length ? rows(active) : '<div class="empty">İlk adımını at. Bir projenin yapım adımlarında ilerledikçe burada göreceksin.<a class="btn" href="#projeler">Projelere göz at</a></div>'}</section><section class="sec"><header><h2>Favoriler</h2></header>${fav.length ? `<div class="grid">${fav.map(prodCard).join('')}</div>` : '<div class="empty">Beğendiğin projedeki kalbe dokun. İlhamlarını burada biriktir.</div>'}</section>${complete.length ? `<section class="sec mine-section"><header><h2>Tamamlanan projeler</h2></header>${rows(complete)}</section>` : ''}<section class="sec mine-section"><header><h2>Alet çantam</h2><span class="muted">${have.length} alet</span></header><p class="muted">${have.length ? have.map(id => esc(TOOLS[id].n)).join(' · ') : 'Rehberde veya proje ekipmanında “Bende var” kutularını işaretle.'}</p><a class="text-link" href="#rehber">Aletlerini düzenle →</a></section><p class="photo-note">Kayıtların bu tarayıcıda saklanır. Hesaplar arası eşitleme henüz yok.</p>`;
};

function printProject() {
  if (!CUR) return;
  const { prod, pr, c, p } = CUR, win = window.open('', '_blank');
  if (!win) { document.getElementById('project-actions').insertAdjacentHTML('beforeend', '<p role="status" class="muted">PDF ön izlemesi için açılır pencereye izin verip yeniden dene.</p>'); return; }
  const rows = cutRows(c), model = prod.models[stOf(prod).m];
  const styles = `:root{--edge:#705d46;--edge-soft:#998672;--panel:#fff;--ink:#28251f;--muted:#777;--accent:#d95f08;--accent-ink:#fff;--dim:#666;--sunk:#f3f1e9;--shadow:#ccc;--f-mono:monospace}body{font:13px/1.6 Arial,sans-serif;color:#292923;margin:32px}h1{font-size:28px;line-height:1.2}h2{font-size:19px;margin:24px 0 12px;color:#bd5105}header{font-size:11px;letter-spacing:2px;color:#bd5105}table{width:100%;border-collapse:collapse}td,th{padding:10px;text-align:left;border-bottom:1px solid #ddd;font-size:11px}.figs{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.figs svg{width:100%;height:210px}.f,.orect{stroke:#79644b;stroke-width:.7;vector-effect:non-scaling-stroke}.dimln{stroke:#666;stroke-width:.7;fill:none;vector-effect:non-scaling-stroke}.dimtx{fill:#666;text-anchor:middle;font-family:monospace}.lbl circle{fill:white;stroke:#555;stroke-width:1}.lbl text{text-anchor:middle;dominant-baseline:central}.note{font-size:11px;background:#faf5ea;padding:12px}.step{break-inside:avoid;page-break-inside:avoid}.pn{font-weight:bold}svg{overflow:visible}.muted{color:#888}button{padding:10px 14px;background:#d95f08;color:white;border:0;border-radius:4px}@media print{body{margin:15px}button{display:none}thead{display:table-header-group}}`;
  win.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(prod.name)} — Talaş planı</title><style>${styles}</style></head><body><header>TALAŞ ATÖLYE / PROJE DEFTERİ</header><h1>${esc(prod.name)}</h1><p>${esc(model.label)} · ${c.dims.join(' × ')} mm · ${esc(pr.wood || woodOf(c))}</p><p class="note">Bu plan seçilen model, malzeme ve ölçülerden hesaplanmıştır. Dayanım doğrulaması yapılmamıştır; üretim öncesi bağlantıları ve malzemeyi bir ustayla kontrol edin.</p><button onclick="window.print()">PDF olarak kaydet / Yazdır</button><h2>Ölçülü görünüşler</h2><div class="figs">${['front', 'side', 'top'].map(v => ortho(c.parts.filter(q => q.g !== 'slide'), v)).join('')}</div><h2>Kesim listesi</h2><table><thead><tr><th>No</th><th>Parça / malzeme</th><th>Ölçü (mm)</th><th>Adet</th></tr></thead><tbody>${rows.map(row => `<tr><td>${row.num}</td><td>${esc(row.name)}<br>${esc(MAT[row.mat].n)}</td><td>${row.d.join(' × ')}${row.note ? '<br>' + esc(row.note) : ''}</td><td>${row.n}</td></tr>`).join('')}</tbody></table><h2>Alışveriş listesi</h2><ul>${stock(c).map(s => `<li>${esc(s.M.n)}: ${s.count} ${s.type === 'sheet' ? `${s.M.SW} × ${s.M.SH} mm plaka` : `${s.L} mm boy`}</li>`).join('')}${c.hw.map(h => `<li>${esc(h[0])}: ${esc(h[1])}${h[2] ? ' · ' + esc(h[2]) : ''}</li>`).join('')}</ul><h2>Ekipman</h2><p>${[...new Set(pr.tools(p, c).concat(SAFETY).map(([id]) => TOOLS[id].n))].map(esc).join(' · ')}</p><h2>Yapım adımları</h2>${c.steps.map((s, i) => `<section class="step"><h3>${i + 1}. ${esc(s.t)}</h3>${s.x}${s.tip ? `<p>İpucu: ${esc(s.tip)}</p>` : ''}${s.warn ? `<p class="note">${esc(s.warn)}</p>` : ''}</section>`).join('')}</body></html>`);
  win.document.close();
  win.focus();
}
document.addEventListener('click', e => {
  const target = e.target.closest('button,a'); if (!target) return;
  if (target.dataset.quickCat) { Q.cat = target.dataset.quickCat; Q.sub = ''; Q.lvl = 0; Q.page = 1; renderCatalog(); }
  if (target.dataset.beginner) { Q.cat = ''; Q.sub = ''; Q.lvl = Q.lvl === 1 ? 0 : 1; Q.page = 1; renderCatalog(); }
  if (target.dataset.print) printProject();
  if (target.dataset.finish) location.hash = 'defterim';
  if (target.dataset.resume != null) { const prod = PROD[target.dataset.product]; if (prod) { stOf(prod).m = +target.dataset.resume; persist(); } }
  if (target.dataset.fav) favoriteLabels();
});

const viewTechnicalPhoto = viewPhoto;
viewPhoto = function() { pageMode('fotograf'); return viewTechnicalPhoto(); };
