"""GitHub Pages çıktısını üretir: index.html'i tam bir HTML belgesine sarar ve betikleri docs/ altına kopyalar.

Kaynak index.html, Claude Artifact kalıbına göre yazılır (doctype/head/body yayın sırasında eklenir).
Pages bu kalıbı eklemediği için burada aynı iskeleti biz ekliyoruz. Kullanım: python tools/pages.py
"""
import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

HEAD = """<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Ölçüsü ayarlanabilir ahşap ürünler: kesim listesi, kereste ve plaka yerleşimi, ekipman, planlar ve adım adım yapım kılavuzu.">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
"""


def main():
    src = (ROOT / "index.html").read_text(encoding="utf-8")
    if src.startswith('<meta charset="utf-8">'):
        src = src.split("\n", 1)[1]
    # Baştaki <title>, <meta> ve <link> satırları <head> içine taşınır
    lines = src.split("\n")
    i = next(k for k, l in enumerate(lines) if l.startswith("<style>"))
    head_extra, body = "\n".join(lines[:i]), "\n".join(lines[i:])
    DOCS.mkdir(exist_ok=True)
    page = HEAD.replace("</head>", head_extra + "\n</head>") + body + "\n</body>\n</html>\n"
    (DOCS / "index.html").write_text(page, encoding="utf-8")
    for name in ("aileler.js", "sekilli.js", "katalog.js"):
        shutil.copyfile(ROOT / name, DOCS / name)
    (DOCS / ".nojekyll").write_text("", encoding="utf-8")
    print("docs/ güncellendi")


if __name__ == "__main__":
    main()
