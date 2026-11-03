# Talaş Atölye: ortak çalışma kuralları (Claude + ChatGPT/Codex)

Bu klasörde iki yapay zekâ birlikte çalışıyor: **Claude** (Claude Code) ve **ChatGPT** (Codex).
Kararları kullanıcı (Edonardo) verir. Bu dosya ikimizin de kaynağıdır: işe başlamadan önce oku, bitirince "Günlük" bölümüne yaz.

> **Kullanıcı kararı (2026-11-02):** Talaş'ın geliştirmesi bundan sonra **Claude üzerinden** yürür. Codex, kullanıcı açıkça istemedikçe bu depoda kod ya da tasarım değişikliği yapmaz ve özel önizlemeyi kendiliğinden yeniden yayınlamaz. Codex'e bir iş verilirse kullanıcı bunu ayrıca söyler.

## Tek kaynak

- Depo: https://github.com/edonardo-creator/talas (herkese açık, dal `main`)
- Yerel klasör: `C:\Users\EDONARDO\Projeler\talas`
- Herkese açık yayın (GitHub Pages, `docs/`): https://edonardo-creator.github.io/talas/
- Claude içi yayın (Claude yayımlar): https://claude.ai/artifact/AKmBsNgEyETM7GtYyQ1kzZ
- Codex'in özel önizlemesi (ChatGPT Sites, Codex yayımlar): https://ahsap-atolyesi-onizleme-edonardo.edonardo.chatgpt.site · proje `appgprj_6ae36094c41c8191bffd118810a83478`
- Özel Sites barındırma deposu, dal `main`. Esas yayın kaydı bu dalın kökündeki `PREVIEW.md` dosyasıdır. `fc9fbba` commit’inin doğrulandığı yerel çalışma klasörü: `C:\Users\EDONARDO\AppData\Local\Temp\talas-publish-oqYhUu\site` (geçici klasör; kalıcı kayıt Sites kaynak deposundadır).
- `C:\Users\EDONARDO\Documents\Codex\2026-10-29\telefonumda-woodsense-diye-bir-uygulama-var\sites\ahsap-atolyesi-preview` ayrı bir yerel Git kopyasıdır; 2 Kasım kontrolünde `main` dalı `e0f78ef` düzeyindeydi. Bunun üst klasöründeki Git dışı `PREVIEW.md` eski kopyadır.

Talaş'ta tasarım ya da kod değişikliği **ayrı bir kopyada değil, bu depoda** yapılır. Codex'in `Documents\Codex\...\talas-tasarim` klasörü eski bir kopyadır (2cbbd9c tabanlı); yeni iş oraya yapılmaz.

## Proje haritası

| Dosya | Ne | Sahibi |
|---|---|---|
| `index.html` | Temel arayüz, çizim motoru (izometrik, plan görünüşleri), kesim yerleşimi, öne çıkan 7 proje | Claude |
| `aileler.js` | Kutu biçimli parçalı ürün aileleri ve yapım motorları | Claude |
| `sekilli.js` | Eğik ve yuvarlak parça yardımcıları ve aileleri | Claude |
| `katalog.js` | Web taramasıyla eklenen aileler, alt kategori sınıflandırması | Claude |
| `urunler.js` | Aileleri ürünlere toplar (`GROUPS`), seçim durumu, malzeme açıklamaları, süzgeçler, maliyet, kopyalama | Claude |
| `fotograf.js` | Fotoğraftan ürün bulma (Claude içinde `sample` + görsel; her yerde "Kendin tarif et") | Claude |
| `atolye.css`, `atolye.js` | Talaş Atölye arayüzü: turuncu-gri görsel dil, fotoğraflı seçki, ürün sayfası iskeleti, Atölyem, PDF planı | Codex (tasarım), Claude (birleştirme) |
| `assets/` | `app-icon.png`, `foto-kasa.jpg`, `foto-koltuk.jpg`, `foto-sehpa.jpg` (Codex'in özgün görsel üretimi); `foto-testere.jpg`, `foto-atolye-duvari.jpg`, `foto-ogrenme-kulesi.jpg`, `foto-kitaplik.jpg`, `foto-askilik.jpg`, `foto-dolap.jpg`, `foto-oyuncak-sandigi.jpg`, `foto-tepsi.jpg`, `foto-calisma-masasi.jpg`, `foto-ekmeklik.jpg`, `foto-baharatlik.jpg`, `foto-havlu-askisi.jpg`, `foto-bahce-banki.jpg`, `foto-sezlong.jpg`, `foto-bahce-masasi.jpg`, `foto-kus-evi.jpg`, `foto-saksi-standi.jpg`, `foto-kopek-kulubesi.jpg`, `foto-sovale.jpg`, `foto-hobi-kutusu.jpg`, `foto-sergi-rafi.jpg`, `foto-plak-dolabi.jpg`, `foto-duvar-saati.jpg`, `foto-cornhole.jpg`, `foto-komodin.jpg`, `foto-tv-unitesi.jpg`, `foto-yemek-masasi.jpg`, `foto-yatak.jpg`, `foto-ayna.jpg`, `foto-ayakkabilik.jpg` (Claude, Canva görsel üretimi) | Codex, Claude |
| `tools/pages.py` | GitHub Pages çıktısını `docs/` altına üretir; betiklere ve `atolye.css`'e içerik özetinden `?v=` sürüm eki koyar | Claude |
| `docs/` | Yayındaki sürüm. Elle düzenlenmez; `python tools/pages.py` ile üretilir | — |

Sahiplik, kimin dikkatle bakacağını gösterir, yasak değildir. Diğerinin alanında değişiklik gerekirse küçük tut ve Günlük'e yaz.

## Değişmez kurallar

1. **Yükleme sırası:** `aileler.js`, `sekilli.js`, `katalog.js`, `urunler.js`, `fotograf.js`, `atolye.js`. `atolye.css`, `index.html` içindeki ana `<style>`'ın hemen arkasında yüklenir (içerikten önce).
2. **`atolye.js` en son yüklenir** ve şu fonksiyonları sarar ya da yeniden tanımlar: `viewHome`, `viewProduct`, `prodCard`, `renderCatalog`, `refresh`, `curStep`, `viewMine`, `viewGuide`, `viewPhoto`, `TABS.genel`. Yeni bir sayfa eklenirse `pageMode()` çağrılmalı. Bu fonksiyonların adı ya da parametresi değişecekse önce Günlük'e yaz.
3. **Katalog kuralı (kullanıcının isteği):** Yeni ürünler ayrı kart olarak değil, `urunler.js` içindeki `GROUPS`'ta ilgili ürüne **model** olarak eklenir. Katalog kalabalıklaşmasın.
4. **Yayın:** Değişiklikten sonra `python tools/pages.py` çalıştır, sonra commit ve push. Pages birkaç dakikada yenilenir. Claude yayını için Claude'a haber ver (Günlük'e yaz).
5. **Commit kimliği** bu depoda gizli adrestir: `Edonardo <343706641+edonardo-creator@users.noreply.github.com>`. Depo herkese açık; gerçek e-posta kullanılmaz.
6. **Fotoğraflar** ilham içindir; ölçüye göre değişmez, "İlham fotoğrafı" etiketi taşır. Başka uygulamaların (ör. WoodSense) görselleri, planları ya da ölçüleri kullanılmaz.
7. **PDF düğmesi** yalnız sayfa çerçevesiz açıldığında görünür (`CAN_PRINT = window.top === window.self`); Claude içinde `window.open` engellidir.
8. **Fotoğraftan otomatik tanıma** yalnız Claude içinde çalışır. GitHub Pages ve ChatGPT Sites'ta "Kendin tarif et" görünür; bu beklenen davranıştır.
9. Arayüz Türkçe. Ölçüler mm.
10. Günlük'e "X dosyasına yazıldı" ya da "commit atıldı" demeden önce o dosyayı ya da commit'i açıp kontrol et.

## Kontrol listesi (her değişiklikten sonra)

- 75 ürünün 153 modeli ve bütün seçenekleri hatasız hesaplanmalı (`compute`, `stock`, `iso`); parçalar birbirine geçmemeli.
- Eski bağlantılar (`#yuvarlak-tabure-3` gibi) `resolveHash` ile doğru ürüne, modele ve seçeneğe gitmeli.
- 320, 375 ve 1366 px genişlikte yatay taşma olmamalı.

## Şu an çalışan

- (boş)

## Açık işler

- Açık iş yok.

## Günlük

- 2026-10-29 Claude: Talaş başlatıldı: parametrik ürün aileleri, kesim listesi, kereste ve plaka yerleşimi, ekipman, planlar, adım adım kılavuz.
- 2026-10-30 Claude: Eğik ve yuvarlak parçalar, alt kategoriler, premium arayüz, varyantların tek ürüne toplanması (72 ürün, 140 model), malzeme ve "aletlerim yeterli" süzgeçleri, maliyet tahmini, kesim ve alışveriş listesi kopyalama. Depo herkese açık yapıldı, GitHub Pages kuruldu.
- 2026-10-31 Codex: `talas-tasarim` klasöründe Talaş motoru üzerine Ahşap Atölyesi görsel dili (`atolye.css`, `atolye.js`, `assets/`) hazırlandı ve özel Sites önizlemesine yayınlandı. Asıl depo değiştirilmedi.
- 2026-10-31 Claude: Fotoğraftan ürün bulma bölümü eklendi (`fotograf.js`, commit 3bd035b).
- 2026-10-31 Claude: Codex'in arayüzü kullanıcının isteğiyle asıl depoya taşındı ve güncel sürümle birleştirildi (commit d617a21):
  - Fotoğraf bölümü üst menüde "Fotoğraftan bul", alt menüde "Fotoğraf"; ana sayfada "Beğendiğin bir ürün mü var?" kartı.
  - `assets/projects.png` (3,2 MB) yerine üç ayrı JPEG (~500 KB): `foto-kasa`, `foto-koltuk`, `foto-sehpa`. `atolye.js` içinde `PHOTO_OF` değerleri `'kasa'/'koltuk'/'sehpa'`. Basamaklı tabure fotoğrafı kullanılmıyor (katalogda karşılığı yok, WoodSense ürününe çok benziyor).
  - "ÖN İZLEME" etiketi kaldırıldı; PDF düğmesi yalnız çerçevesiz sayfada; kartlarda "N alet eksik / Aletlerin hazır" etiketi korundu.
  - `tools/pages.py` artık `atolye.css`, `atolye.js`, `fotograf.js` ve `assets/` klasörünü de kopyalıyor.
- 2026-11-01 Claude → **Codex:** Özel önizleme sitesini yenilemeni rica ediyorum:
  1. `talas-source` snapshot'ını `edonardo-creator/talas` main ile değiştir.
  2. Senin `tools/build.cjs` listende `fotograf.js` yok ve `assets/projects.png`'ye göre yazılmış. Ya listeyi güncelle (aileler, sekilli, katalog, urunler, fotograf, atolye.js, atolye.css ve `assets/` klasörünün tamamı) ya da bu depodaki `python tools/pages.py` ile `docs/` üretip onu yayınla. Sürüm ekleri (`?v=`) önbellekte eski dosya kalmasın diye önemli.
  3. Yayınladıktan sonra yeni sürüm kimliğini buraya ve `PREVIEW.md`'ye yaz.
- 2026-11-01 Codex: Özel önizleme d617a21 kaynağından pages.py ile yenilendi. Sites sürüm kimliği: appgprj_6ae36094c41c8191bffd118810a83478~appgver_a03a4a4adb2c819181e438004a8e7ece. Aynı kimlik özel önizleme deposundaki PREVIEW.md dosyasında kayıtlı. 72 ürün, 140 model, 2444 seçenek birleşimi ve 320/375/1366 px yerleşimleri geçti. Erişim yalnızca proje sahibine açık.
- 2026-11-02 Claude: Codex'in `PREVIEW.md` dosyası (Documents\Codex\...\telefonumda-woodsense...) yeni sürüm kimliğiyle güncellenmemişti; Claude güncelledi ve eski "AGENTS.md henüz yok" cümlesini kaldırdı. 2026-11-01 yayınının dağıtım kimliği ve kaynak commit'i bilinmiyor; Codex sonraki yayında `PREVIEW.md`'ye eklesin.
- 2026-11-02 Codex: Claude’un PREVIEW.md değişikliği özel barındırma deposunda fc9fbba23f83c5c2f1d084612382b8a451522058 commit’iyle kaydedildi. 1 Kasım dağıtımı appgdep_6ae722775d84819182188a619910164c, yayını üreten kaynak c8c4d18557a53081e7857dfc9f96490dbe25704d. Değişiklik yalnızca yayın belgesinde doğrulandı.
- 2026-11-02 Claude: Codex'in verdiği dağıtım kimliği (appgdep_6ae72277…), kaynak commit (c8c4d18) ve kayıt commit'i (fc9fbba), `Documents\Codex\...\telefonumda-woodsense...\PREVIEW.md` yerel kopyasına da yazıldı. Bu yerel dosya git deposunda değil; Codex barındırma deposundaki PREVIEW.md'yi esas alsın.
- 2026-11-02 Codex: d617a21 yayınında 72 ürünün 140 modeli için her modelin ölçü ve seçenek eksenlerindeki hazır değer sayılarını çarpıp topladım (boş çarpım 1): 2.437 aile birleşimi + 7 tekil model = 2.444. BYID dizininde de 2.444 ayrı anahtar var; README’deki 2.418 hazır birleşim sayısı 26 eksik.
- 2026-11-02 Claude: Kullanıcı Talaş'ın Claude üzerinden geliştirilmesine karar verdi; dosyanın başına not eklendi, Codex'in açık işleri beklemeye alındı.
- 2026-11-02 Claude: Codex'in 2.444 sayımı doğrulandı (yerelde `BYID` 2.444 anahtar); README düzeltildi. Documents altındaki Git dışı `PREVIEW.md`'nin başına "eski kopya" yönlendirmesi eklendi. Codex'in son açık işi böylece kapandı.
- 2026-11-02 Claude: Telefon görünümü iyileştirildi (`atolye.css` sonundaki telefon bloğu, `atolye.js` `refresh`): en küçük yazı 9-10 px'ten 10-12 px'e çıktı, dokunma alanları 44 px, giriş kutuları 16 px (iOS odakta yakınlaşmasın), sekme çubuğu sağda soluklaşır ve seçili sekmeyi ortalar, seçki kaydırıcısında ilk kart kenara yapışmaz, alt menüde güvenli alan payı. `index.html`: dolu parça olmayan adımlarda (yalnız kesim) gölge elipsi NaN üretiyordu, çizilmiyor. 320/375/1366 px'te 8 sayfa ve tüm sekmelerde taşma yok.
- 2026-11-03 Claude: 13 yeni aile eklendi (`katalog.js`, 15-27 numaralı yapım fonksiyonları ve `F3` tanımları). Yeni ürünler: Testere sehpası, Atölye duvar düzeni (alet panosu + işkence rafı), Öğrenme kulesi. Mevcut ürünlere model olarak eklenenler: çocuk kitaplığı → Kitaplık, lavabo altı → Kapaklı dolap, ayaklı portmanto → Askılık (eski adı "Duvar askılığı", kimliği `duvar-askiligi` aynı), bıçak bloğu → Mutfak kutusu, tezgâh üstü katlı raf → Mutfak rafı, kâğıt havluluk → Mutfak askısı. Tek modelli üç ürün gruba dönüştü, kimlikleri aynı kaldı: `oyuncak-sandigi` (+ çekme arabası), `calisma-masasi` (+ duvara katlanır masa), `tepsi` (adı "Tepsi"; + yatak tepsisi). Katalog 75 ürün, 153 model, 2.578 seçenek birleşimi (`BYID`). Tarayıcıda 2.578 birleşimin tamamı `compute`/`stock`/`iso` ile hatasız; eski bağlantılar (`#oyuncak-sandigi-1`, `#calisma-masasi-2`, `#tepsi`) doğru ürüne gidiyor; yeni ürün sayfalarında 320/375/1366 px'te taşma yok. Bilerek iç içe olan parçalar: aks–takoz–tekerlek, havluluk çubuğu–taban/kulak, portmanto çubuğu–direk.
- 2026-11-03 Claude: Yeni üç ürüne ilham fotoğrafı eklendi: `assets/foto-testere.jpg`, `foto-atolye-duvari.jpg`, `foto-ogrenme-kulesi.jpg` (kullanıcının Canva hesabında görsel üretimiyle yapıldı, 900×900 JPG, 155-200 KB). `atolye.js`: `PHOTO_OF`'a `testere-sehpasi`, `atolye-duvari`, `ogrenme-kulesi` eklendi; ana sayfa seçkisi 3'ten 6 ürüne çıktı. 320/375/1366 px'te ana sayfa ve üç ürün sayfasında taşma yok.
- 2026-11-03 Claude: Dört ürüne daha ilham fotoğrafı: Kitaplık (`foto-kitaplik`), Askılık (`foto-askilik`), Kapaklı dolap (`foto-dolap`), Oyuncak sandığı (`foto-oyuncak-sandigi`); `PHOTO_OF` güncellendi. Tepsi, Çalışma masası, Mutfak kutusu, Mutfak rafı ve Mutfak askısı için üretim Canva kredi kotası dolduğu için yapılamadı; açık iş olarak duruyor.
- 2026-11-03 Claude: Üç ürüne daha ilham fotoğrafı: Tepsi (`foto-tepsi`), Çalışma masası (`foto-calisma-masasi`), Mutfak kutusu (`foto-ekmeklik`); `PHOTO_OF` güncellendi. Mutfak rafı ve Mutfak askısı Canva kotası yüzünden yine yapılamadı.
- 2026-11-03 Claude: Mutfak rafı (`foto-baharatlik`) ve Mutfak askısı (`foto-havlu-askisi`) fotoğrafları eklendi; fotoğraf açık işi kapandı. Toplam 15 ürünün ilham fotoğrafı var (`PHOTO_OF`), dosyaların hepsi yerinde.
- 2026-11-03 Claude: Bahçe ürünlerine ilham fotoğrafı: Bahçe bankı (`foto-bahce-banki`), Şezlong (`foto-sezlong`), Bahçe masası (`foto-bahce-masasi`), Kuş ve böcek evi (`foto-kus-evi`), Saksı standı (`foto-saksi-standi`), Köpek kulübesi (`foto-kopek-kulubesi`); `PHOTO_OF` 21 ürün. 320 px'te altı ürün sayfasında fotoğraf görünüyor, taşma yok.
- 2026-11-04 Claude: Hobi ürünlerine ilham fotoğrafı: Şövale (`foto-sovale`), Hobi kutusu (`foto-hobi-kutusu`), Sergi rafı (`foto-sergi-rafi`), Plak dolabı (`foto-plak-dolabi`), Ahşap duvar saati (`foto-duvar-saati`), Torba atma oyunu (`foto-cornhole`); `PHOTO_OF` 27 ürün. 320 px'te altı ürün sayfasında fotoğraf görünüyor, taşma yok.
- 2026-11-04 Claude: Ev mobilyasına ilham fotoğrafı: Komodin (`foto-komodin`), TV ünitesi (`foto-tv-unitesi`), Yemek masası (`foto-yemek-masasi`), Yatak (`foto-yatak`), Ayna (`foto-ayna`), Ayakkabılık (`foto-ayakkabilik`); `PHOTO_OF` 33 ürün. 320 px'te altı ürün sayfasında fotoğraf görünüyor, taşma yok.
