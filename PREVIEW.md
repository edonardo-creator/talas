# Talaş Atölye — özel web ön izleme

Adres: https://ahsap-atolyesi-onizleme-edonardo.edonardo.chatgpt.site

Sites üzerinde yalnızca sahibinin erişimine açık olarak yayımlandı. Mobil veri veya farklı Wi-Fi ile kullanılabilir; sahibi olan ChatGPT hesabıyla giriş gerekebilir. Bu bağlantı App Store dağıtımı değildir. Bilgisayardaki yerel sunucunun açık olması gerekmez.

## Yayın kaydı

- Proje: `appgprj_6ae36094c41c8191bffd118810a83478`
- Sürüm: `appgprj_6ae36094c41c8191bffd118810a83478~appgver_a03a4a4adb2c819181e438004a8e7ece`
- Dağıtım: `appgdep_6ae722775d84819182188a619910164c`
- Durum: `succeeded`
- Yayın kaynak commit'i: `c8c4d18557a53081e7857dfc9f96490dbe25704d`
- GitHub Talaş commit'i: `d617a21ef9c33558a0564398fb08858d38aa9419`
- Son başarılı yayın: 2026-11-01
- Barındırma kaynağı: `sites/ahsap-atolyesi-preview`
- Güncel web uygulaması kaynağı: `C:\Users\EDONARDO\Projeler\talas` (edonardo-creator/talas deposunun son sürümü)
- Barındırma deposundaki güncel kaynak snapshot'ı: `talas-source/`
- Önceki tasarım çalışması: `talas-tasarim`.
- Yayın çıktısı: `dist/`
- Önceki dört projeli Expo prototipi: `ahsap-atolyesi` (72 ürünlü motor bu native prototipe henüz taşınmadı).

Bu sürüm GitHub'daki d617a21 sürümünden alınmıştır. 72 ürün ve 140 model korunur; yeni Fotoğraf bölümü, tarifle ürün eşleştirme ve küçültülmüş JPEG görseller yayındadır. Kaynak ve test kaydı `sites/ahsap-atolyesi-preview/UPSTREAM.md` içindedir. Resmî derleme `python tools/pages.py` ile yapılır. Kullanıcının asıl yerel `talas` deposu değiştirilmedi.

Fotoğraf bölümünde otomatik AI tanıma Claude içindeki köprüye bağlıdır. Bu Sites adresinde “Kendin tarif et” akışı çalışır. Bu commit'te öğretici veya Ayarlar → Güncellemeleri kontrol et düğmesi bulunmaz; sayfa yenilenerek yeni yayın açılır.

Sonraki uygulama değişikliklerinde web çıktısı yeniden oluşturulup barındırma kaynağıyla eşitlenmeli ve aynı Sites projesine yeni sürüm olarak gönderilmeli. Yeni Site oluşturulmaz. Proje kimliği `.openai/hosting.json` içinde tutulur.

Önceki `192.168.1.112:4173` adresi yalnızca bilgisayarla aynı ağdan ve yerel sunucu çalışırken açılır.
