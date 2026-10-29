# Talaş

Ahşap ürünler için ölçüsü ayarlanabilir yapım kılavuzu. Her ürünün kesim listesi, kereste ve plaka yerleşimi, hırdavat ve ekipman listesi, ölçülü plan görünüşleri ve adım adım montaj anlatımı seçilen ölçüye göre hesaplanır.

Katalogda toplam 2.132 ürün var: elle yazılmış 7 öne çıkan proje ve 115 ürün ailesinden üretilen varyantlar. Kategoriler: ev mobilyası, bahçe ve dış mekân, mutfak, çocuk, atölye ve hobi. Eğik (yaslı raf, şövale, eğik sırtlı oturma, beşik çatı) ve yuvarlak (daire tabla, konik açılı ayak, yuvarlak tahta) parçalı ürünler de dahil.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Arayüz, çizim motoru (izometrik görünüm, plan görünüşleri), kesim yerleşimi, öne çıkan 7 proje |
| `aileler.js` | Kutu biçimli parçalardan oluşan ürün aileleri: gövde, çerçeve, kasa, kutu, raf, askılık, merdiven, yatak, oturma, tahta, çerçeve, stand |
| `sekilli.js` | Eğik ve yuvarlak parça yardımcıları ve bu parçaları kullanan aileler |

## Çalıştırma

Derleme gerekmez. Klasörde bir yerel sunucu açıp tarayıcıda `http://localhost:8765` adresine gidin:

```sh
python -m http.server 8765
```

## Nasıl çalışır

- Her parça iki kesit halkası arasında örülen dışbükey bir katıdır. Kutu, dört köşeli halkanın özel hâlidir; eğik kereste, konik ayak ve daire tabla aynı modelle çizilir.
- Bir aile; bir yapım motoru (`carcass`, `frame`, `roundTable`…), ayarlanabilir ölçü aralıkları ve varyant eksenlerinden oluşur. Eksenlerin kartezyen çarpımı katalogdaki ürünleri üretir.
- Kesim yerleşimi kerestede ilk uyan azalan sıralama (3 mm testere payı), plakada raf yerleşimi (4 mm testere payı) kullanır.

## Uyarı

Ölçüler ve birleştirme yöntemleri genel atölye pratiğine göre hesaplanır; dayanım için bir usta tarafından kontrol edilmemiştir. Üretimden önce özellikle büyük dolap, yatak ve oturma ürünlerinin bağlantılarını gözden geçirin.
