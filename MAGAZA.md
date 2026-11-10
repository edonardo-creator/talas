# Talaş Atölye: mağaza yayını ve gelir rehberi

Uygulama kimliği (paket adı): `com.talasatolye.app`. İlk yüklemeden sonra değiştirilemez; başka bir ad istiyorsan `capacitor.config.json` içinde şimdi değiştir.

Gelir üç yoldan gelir: **reklam** (AdMob, yalnız mağaza uygulamasında, Premium'da yok), **Premium abonelik** (RevenueCat ile Google Play ve App Store satın alması), **ortaklık bağlantıları** (malzeme ve alet listelerinde Amazon "Satın al"). Web sürümü şimdilik ücretsiz ve reklamsızdır (`ticari.js` → `TICARI.webAllFree`).

## Senin yapacakların (sırayla)

1. **Hesaplar**
   - Google Play Console geliştirici hesabı: tek seferlik 25 USD. Kişisel hesapta Google, yayından önce 12 kişilik 14 günlük kapalı test ister.
   - Apple Developer Program: yıllık 99 USD.
   - AdMob hesabı (admob.google.com), RevenueCat hesabı (ücretsiz başlangıç), Amazon Ortaklık Programı (ortaklik.amazon.com.tr).
   - Gelir alacağın için vergi mükellefiyeti gerekir (şahıs şirketi ya da mevcut şirket); mali müşavirine danış.
2. **Yasal metinler:** `yasal/gizlilik.html` ve `yasal/kosullar.html` içindeki `[AD SOYAD / ŞİRKET UNVANI]`, `[ADRES]`, `[İLETİŞİM E-POSTASI]` alanlarını doldur. Adresler: `https://edonardo-creator.github.io/talas/gizlilik.html` ve `.../kosullar.html`.
3. **AdMob:** Android ve iOS için iki uygulama oluştur, her birinde bir "Uyarlanabilir banner" reklam birimi aç.
   - Uygulama kimliklerini `android/app/src/main/AndroidManifest.xml` (`APPLICATION_ID`) ve `ios/App/App/Info.plist` (`GADApplicationIdentifier`) dosyalarına yaz; şu an Google test kimlikleri var.
   - Banner kimliklerini `ticari.js` → `TICARI.admob` içine yaz, yayından önce `testAds: false` yap.
   - AdMob > Gizlilik ve mesajlaşma bölümünde GDPR onay mesajını ve iOS izleme açıklamasını oluştur.
4. **Satın alma ürünleri** (Play Console > Abonelikler ve App Store Connect > Abonelikler, aynı kimliklerle):
   - `talas_premium_aylik` (aylık), `talas_premium_yillik` (yıllık); istersen `talas_premium_omur` (tek seferlik, ömür boyu).
   - Önerilen fiyat: aylık 49,99 TL, yıllık 349,99 TL (yaklaşık %40 indirim), ömür boyu 899,99 TL.
5. **RevenueCat:** Projeye Play ve App Store uygulamalarını bağla, ürünleri içe aktar, `premium` adlı yetki (entitlement) oluşturup ürünleri ona ekle, `default` teklifine paketleri koy. Genel SDK anahtarlarını (`goog_...`, `appl_...`) `ticari.js` → `TICARI.revenuecat` içine yaz.
6. **Amazon takip kimliği:** `ticari.js` → `TICARI.affiliate.amazonTag`.
7. **Android imza anahtarı** (bir kez; dosyayı ve şifreyi güvenli sakla, kaybedersen güncelleme yayınlayamazsın):
   - Android Studio > Build > Generate Signed Bundle ile oluştur, ya da Java kuruluysa: `keytool -genkey -v -keystore upload.jks -alias talas -keyalg RSA -keysize 2048 -validity 10000`.
   - GitHub deposu > Settings > Secrets > Actions altına `ANDROID_KEYSTORE_BASE64` (dosyanın base64 hali), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` ekle. Play App Signing'i açık bırak.
8. **Derleme:** GitHub > Actions > "Mobil derleme" > Run workflow.
   - Android: deneme için `app-debug.apk`, Play için `app-release.aab` üretilir.
   - iOS: bulutta yalnız derleme denetimi yapılır. App Store'a yüklemek için Mac'te Xcode (`npx cap open ios` > Product > Archive) ya da Codemagic gibi bir bulut hizmeti ve Apple sertifikası gerekir.
9. **Mağaza kayıtları:** Aşağıdaki metinleri, ekran görüntülerini, veri güvenliği ve yaş derecelendirmesi yanıtlarını gir; önce kapalı testte dene, sonra yayına al.

## Mağaza metinleri

**Ad (30 karakter):** Talaş Atölye: Ahşap Projeler

**Kısa açıklama (80 karakter):** Ölçüyü gir; kesim listesi, plaka yerleşimi ve adım adım ahşap yapım planı hazır.

**Uzun açıklama:**

Talaş Atölye, ahşapla bir şey yapmak isteyen herkes için ölçüsü ayarlanabilir proje kütüphanesidir. Kitaplıktan bahçe bankına, çocuk mobilyasından atölye tezgâhına 177 ürün ve 287 model seni bekliyor.

Ölçüyü değiştir, gerisini Talaş hesaplasın:
• Parça parça kesim listesi ve numaralı çizimler
• Kereste ve plaka yerleşimi, en az fireyle; artan parçalar
• Malzeme ve hırdavat listesi, maliyet tahmini
• Gereken aletler; elindekileri işaretle, eksiklerini gör
• Ön, yan ve üst görünüşlü planlar
• Adım adım, resimli yapım kılavuzu ve güvenlik uyarıları
• Ağaç türleri, birleştirmeler ve alet rehberi

Kesim listesini ebatlama servisine, alışveriş listesini hırdavatçıya tek dokunuşla gönder. Favorilerini ve yarım kalan projelerini Atölyem'de takip et.

Talaş Premium ile reklamsız kullan, kesimden artan parçaları sakla ve yeni projelerin önce onlardan kesilsin, her parçanın sana kaça mal olduğunu gör.

Ürün fotoğrafları yapay zekâ ile üretilmiş ilham görselleridir; yapım için çizim ve ölçüler esas alınır.

**Kategori:** Ev ve Bahçe (Play) · Yaşam Tarzı (App Store). **Etiketler:** ahşap, marangoz, kendin yap, mobilya, kesim listesi.

## Veri güvenliği (Play) ve gizlilik etiketi (App Store) yanıtları

- **Toplanan veriler:**
  - Cihaz ya da diğer kimlikler (reklam kimliği, AdMob): reklam ve analiz için, üçüncü tarafla paylaşılır.
  - Satın alma geçmişi (RevenueCat): uygulama işlevi için.
  - Yaklaşık konum (IP'den, AdMob): reklam için.
- **Toplanmayan veriler:** ad, e-posta, kişiler, fotoğraflar (cihazdan çıkmaz), sağlık, finans bilgisi.
- **Diğer yanıtlar:**
  - Veriler aktarımda şifrelenir.
  - Hesap olmadığı için hesap silme gerekmez; yerel veriler uygulama silinince gider.
  - Apple "Takip": evet (yalnız izin verilirse, AdMob).
- **Yaş derecelendirmesi:** Herkes / 4+ (şiddet, kumar, kullanıcı içeriği yok; reklam var). Hedef kitle: 18 yaş ve üstü (Play "Hedef kitle" bölümünde çocukları seçme; seçersen Aileler politikası ve sertifikalı reklam ağları gerekir).
- **Reklam içerir:** evet.

## Ekran görüntüleri

- **Gereken boyutlar:**
  - Play: en az 2 telefon görüntüsü (1080×1920), 512×512 simge (`assets/app-icon-512.png`), 1024×500 tanıtım görseli.
  - App Store: 6,9" (1320×2868) ve 6,5" (1284×2778) iPhone görüntüleri; uygulama iPad'de de çalıştığı için 13" iPad (2064×2752) görüntüleri de zorunlu.
- **Önerilen ekranlar:** Ana sayfa, bir ürün sayfası (fotoğraf + çizim), Kesim sekmesi (plaka yerleşimi), Yapım adımı, Atölyem.
- **Hazır (2026-11-09):** `Projeler/talas-magaza` klasöründe (depoya alınmadı): `play-1080x1920/`, `appstore-6.9-1320x2868/`, `appstore-6.5-1284x2778/`, `appstore-ipad-13-2064x2752/` içinde beşer ekran (1-kesfet … 5-atolyem) ve `play-tanitim-1024x500.png`. Tanıtım görselinin kaynağı `tanitim.html`.

## Kod tarafı (hazır)

- `ticari.js`: reklam (AdMob, alt menünün ya da eylem çubuğunun üstünde banner), Premium (RevenueCat), satın alma ekranı, kilitler (artan parça takibi, parça başına maliyet) ve Amazon bağlantıları.
- `capacitor.config.json`, `android/`, `ios/`: Capacitor 6 projeleri; web kodu `python tools/pages.py` ile `docs/`'a üretilir, `npx cap sync` ile uygulamaya kopyalanır.
- `.github/workflows/mobil.yml`: bulutta Android APK/AAB ve iOS derleme denetimi.
