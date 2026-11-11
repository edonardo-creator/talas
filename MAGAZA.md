# Talaş Atölye: mağaza yayını ve gelir rehberi

Uygulama kimliği (paket adı): `com.talasatolye.app`. İlk yüklemeden sonra değiştirilemez; başka bir ad istiyorsan `capacitor.config.json` içinde şimdi değiştir.

Gelir üç yoldan gelir: **reklam** (AdMob, yalnız mağaza uygulamasında, Premium'da yok), **Premium abonelik** (RevenueCat ile Google Play ve App Store satın alması), **ortaklık bağlantıları** (malzeme ve alet listelerinde Amazon "Satın al"). Web sürümü şimdilik ücretsiz ve reklamsızdır (`ticari.js` → `TICARI.webAllFree`).

## Paintline ile ortak hesaplar (2026-11-10)

Paintline için açılan hesaplar Talaş'ta da kullanılır; yeni hesap değil, aynı hesapta yeni uygulama açılır.

| Hesap | Talaş için durum | Yapılacak |
|---|---|---|
| Google Play Console (EB Design TR) | Ortak, hazır | "Uygulama oluştur" → Talaş Atölye, paket `com.talasatolye.app`. Ödeme profili, satıcı adı, %15 ücret programı hesap düzeyinde geçerli. Kişisel hesap kuralı her yeni uygulama için yine 12 test kullanıcısı / 14 gün ister; Paintline'ın test listesi yeniden kullanılabilir. |
| Apple Developer (Team ID `775SY2VSNK`) | Ortak, hazır | Yeni paket kimliği `com.talasatolye.app` kaydı (In-App Purchase açık) ve App Store Connect'te yeni uygulama kaydı. Paid Apps sözleşmesi, banka, W-8BEN ve Küçük İşletme Programı hesap düzeyinde, yeniden yapılmaz. |
| App Store Connect API anahtarı | Ortak (paintline-ios deposunda gizli değer olarak) | Aynı anahtar talas deposunun gizli değerlerine de eklenmeli (`.p8` dosyası sende); GitHub gizli değerleri geri okunamaz. |
| AdSense (PUB-6247665234607957) | Ortak ödeme hesabı | AdMob, aynı Google hesabıyla açılınca bu yayıncı kimliğine ve ödeme profiline bağlanır; AdMob'a ilk girişte kayıt formu çıkar. |
| Android yükleme anahtarı | Paintline'ınki `boya-yolu/android/paintline-upload.jks` | Aynı anahtar Talaş'ta da kullanılabilir (Google izin verir); daha güvenlisi Talaş için ayrı anahtar. Şifreleri GitHub gizli değerlerine sen girersin. |
| RevenueCat | Paintline kullanmıyor | Yeni ücretsiz hesap gerekir. |
| Amazon Ortaklık | Paintline kullanmıyor | Yeni başvuru gerekir (isteğe bağlı). |

**Play Console (2026-11-10):** Uygulama oluşturuldu: "Talaş Atölye: Ahşap Projeler", `com.talasatolye.app`, varsayılan dil tr-TR, uygulama, ücretsiz (uygulama kimliği 4972176167883117271). Doldurulanlar (2026-11-10): gizlilik politikası, reklam (var), reklam kimliği (reklam + analiz), resmi kurum/finans/sağlık (hayır), içerik derecelendirmesi (PEGI 3 / Tüm yaşlar, uygulama içi satın alma), mağaza ayarları (Ev ve dekorasyon, mobilyaaser@gmail.com, site), varsayılan mağaza girişi (tr-TR metinler, simge, tanıtım görseli, 5 ekran görüntüsü; simge, tanıtım ve fotoğraflı 3 ekran yapay zekâ etiketli), veri güvenliği taslağı (yaklaşık konum, cihaz kimliği, uygulama etkileşimleri, teşhis: toplanır+paylaşılır, reklam/analiz; işlem geçmişi: toplanır, isteğe bağlı, uygulama işlevi; aktarımda şifreli; hesap yok). Tamamlanan (2026-11-10): oturum açma bilgileri (kullanıcı), hedef kitle 16+, veri güvenliği, satıcı durumu + koşullar bağlantısı. Kapalı test (Alpha): 178 ülke, test listesi "Paintline testcileri" (15 kişi), geri bildirim mobilyaaser@gmail.com, sürüm 2 (1.0) AAB (Capacitor 8, hedef SDK 36) yüklendi ve kaydedildi. 16 değişiklik kullanıcı onayıyla incelemeye gönderildi (2026-11-10; Google ön kontrolleri bitince otomatik iletilir). 2026-11-11: inceleme geçti, Alpha kanalı etkin (sürüm 2). Katılma bağlantıları: web https://play.google.com/apps/testing/com.talasatolye.app · Android https://play.google.com/store/apps/details?id=com.talasatolye.app. Sırada: 12 test kullanıcısı / 14 gün.

## Senin yapacakların (sırayla)

1. **Hesaplar**
   - Google Play Console geliştirici hesabı: tek seferlik 25 USD. Kişisel hesapta Google, yayından önce 12 kişilik 14 günlük kapalı test ister.
   - Apple Developer Program: yıllık 99 USD.
   - AdMob hesabı (admob.google.com), RevenueCat hesabı (ücretsiz başlangıç), Amazon Ortaklık Programı (ortaklik.amazon.com.tr).
   - Gelir alacağın için vergi mükellefiyeti gerekir (şahıs şirketi ya da mevcut şirket); mali müşavirine danış.
2. **Yasal metinler:** ✓ Dolduruldu (2026-11-10): EB DESİGN TR, Ortaca/Muğla adresi, mobilyaaser@gmail.com. Mağaza kayıtlarında "iletişim e-postası" ve "gizlilik politikası" olarak bunları kullan. Adresler: `https://edonardo-creator.github.io/talas/gizlilik.html` ve `.../kosullar.html`.
3. **AdMob:** ✓ 2026-11-10 kuruldu (Android `~3537180394` / banner `/1453767529`, iOS `~7364744769` / banner `/9719445366`; koda yazıldı). Kalan: Play yayını sonrası AdMob'da "Mağaza ekle" ile uygulamayı bağla, onay gelince `testAds: false`; GDPR mesajı. Eski not: Android ve iOS için iki uygulama oluştur, her birinde bir "Uyarlanabilir banner" reklam birimi aç.
   - Uygulama kimliklerini `android/app/src/main/AndroidManifest.xml` (`APPLICATION_ID`) ve `ios/App/App/Info.plist` (`GADApplicationIdentifier`) dosyalarına yaz; şu an Google test kimlikleri var.
   - Banner kimliklerini `ticari.js` → `TICARI.admob` içine yaz, yayından önce `testAds: false` yap.
   - AdMob > Gizlilik ve mesajlaşma bölümünde GDPR onay mesajını ve iOS izleme açıklamasını oluştur.
4. **Satın alma ürünleri** (Play Console > Abonelikler ve App Store Connect > Abonelikler, aynı kimliklerle):
   - `talas_premium_aylik` (aylık), `talas_premium_yillik` (yıllık); istersen `talas_premium_omur` (tek seferlik, ömür boyu).
   - Önerilen fiyat: aylık 49,99 TL, yıllık 349,99 TL (yaklaşık %40 indirim), ömür boyu 899,99 TL.
5. **RevenueCat:** ✓ Android kısmı 2026-11-11 kuruldu (abonelik `talas_premium` aylık 49,99 / yıllık 349,99 TL; yetki `premium`; `default` teklif; anahtar koda yazıldı). Hizmet hesabı: Google Cloud `paintline-513412` projesinde `revenuecat@paintline-513412.iam.gserviceaccount.com` (Pub/Sub Admin + Monitoring Viewer; Play Developer, Reporting, Pub/Sub API'leri açık). JSON anahtarı yalnız kullanıcının bilgisayarında, repoya konmaz. Kalan: Play Console'da daveti gönder (hesap izinleri: uygulama bilgisi, finansal veri, sipariş/abonelik yönetimi), JSON'u RevenueCat'e yükle, iOS. Eski not: Projeye Play ve App Store uygulamalarını bağla, ürünleri içe aktar, `premium` adlı yetki (entitlement) oluşturup ürünleri ona ekle, `default` teklifine paketleri koy. Genel SDK anahtarlarını (`goog_...`, `appl_...`) `ticari.js` → `TICARI.revenuecat` içine yaz.
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

Talaş Atölye, ahşapla bir şey yapmak isteyen herkes için ölçüsü ayarlanabilir proje kütüphanesidir. Kitaplıktan bahçe bankına, çocuk mobilyasından atölye tezgâhına 177 ürün ve 288 model seni bekliyor.

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
