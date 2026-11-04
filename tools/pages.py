"""GitHub Pages çıktısını üretir: index.html'i tam bir HTML belgesine sarar ve betikleri docs/ altına kopyalar.

Kaynak index.html, Claude Artifact kalıbına göre yazılır (doctype/head/body yayın sırasında eklenir).
Pages bu kalıbı eklemediği için burada aynı iskeleti biz ekliyoruz. Kullanım: python tools/pages.py
"""
import hashlib
import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SCRIPTS = ("aileler.js", "sekilli.js", "katalog.js", "urunler.js", "fotograf.js", "atolye.js", "atolye.css")

HEAD = """<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f2f1ec">
<link rel="icon" href="assets/app-icon-192.png">
<link rel="apple-touch-icon" href="assets/app-icon-192.png">
<link rel="manifest" href="manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Talaş">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Talaş Atölye">
<meta property="og:title" content="Talaş Atölye: ölçüsü ayarlanabilir ahşap projeler">
<meta property="og:description" content="109 ürün, 211 model. Ölçüyü gir; kesim listesi, plaka yerleşimi, malzeme ve adım adım yapım kılavuzu hazır.">
<meta property="og:image" content="https://edonardo-creator.github.io/talas/assets/foto-kasa.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="Ölçüsü ayarlanabilir ahşap ürünler: kesim listesi, kereste ve plaka yerleşimi, ekipman, planlar ve adım adım yapım kılavuzu.">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
"""

MANIFEST = """{
  "name": "Talaş Atölye",
  "short_name": "Talaş",
  "description": "Ölçüsü ayarlanabilir ahşap projeler: kesim listesi, plaka yerleşimi ve yapım kılavuzu.",
  "lang": "tr",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#eceeea",
  "theme_color": "#f2f1ec",
  "icons": [{"src": "assets/app-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"}, {"src": "assets/app-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}, {"src": "assets/app-icon.png", "sizes": "1024x1024", "type": "image/png", "purpose": "any"}]
}
"""

# Sayfa ağdan gelir (çevrimdışıysa önbellekten); sürüm ekli betikler ve görseller önce önbellekten
SW = """const C = 'talas-__VER__';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok && (new URL(r.url).origin === location.origin || r.url.startsWith('https://fonts.'))) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); }
    return res;
  })));
});
"""
REGISTER = "<script>if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js')</script>\n"


def main():
    src = (ROOT / "index.html").read_text(encoding="utf-8")
    if src.startswith('<meta charset="utf-8">'):
        src = src.split("\n", 1)[1]
    # Baştaki <title>, <meta> ve <link> satırları <head> içine taşınır
    lines = src.split("\n")
    i = next(k for k, l in enumerate(lines) if l.startswith("<style>"))
    head_extra, body = "\n".join(lines[:i]), "\n".join(lines[i:])
    DOCS.mkdir(exist_ok=True)
    page = HEAD.replace("</head>", head_extra + "\n</head>") + body + "\n" + REGISTER + "</body>\n</html>\n"
    for name in SCRIPTS:
        shutil.copyfile(ROOT / name, DOCS / name)
        # Sürüm eki: tarayıcı yeni sayfayı eski önbellekli betikle birleştirmesin
        ver = hashlib.md5((ROOT / name).read_bytes()).hexdigest()[:8]
        page = page.replace(f'src="{name}"', f'src="{name}?v={ver}"').replace(f'href="{name}"', f'href="{name}?v={ver}"')
    if (ROOT / "assets").exists():
        shutil.copytree(ROOT / "assets", DOCS / "assets", dirs_exist_ok=True)
    (DOCS / "index.html").write_text(page, encoding="utf-8")
    (DOCS / ".nojekyll").write_text("", encoding="utf-8")
    (DOCS / "manifest.webmanifest").write_text(MANIFEST, encoding="utf-8")
    # Önbellek adı içerik özetinden gelir: her yayında eski önbellek temizlenir
    ver = hashlib.md5(page.encode("utf-8")).hexdigest()[:8]
    (DOCS / "sw.js").write_text(SW.replace("__VER__", ver), encoding="utf-8")
    print("docs/ güncellendi")


if __name__ == "__main__":
    main()
