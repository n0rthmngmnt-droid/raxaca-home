# Raxaca Home — Proje Logu

Statik ebook mağazası (mutfak & ev nişi). Orvenio Fitness (`~/Downloads/ebook`) kod tabanından türetildi; aynı mimari (Netlify Function + Stripe Checkout, `products.js` tek kaynak), farklı marka/tasarım/şirket. Ayrı GitHub ve Netlify hesabı.

## 2026-10-15 — Kickoff

**Şirket:** RAXACA LLC (Wyoming, US) · public name "Raxaca Home" · 30 N Gould St, Ste 26295, Sheridan, WY 82801 · support +90 554 911 99 11 · info@raxaca.com · statement descriptor `RAXACA`. Temsilcinin DOB/ev adresi siteye KONMAZ.

**Katalog:** Kullanıcının Stripe ekran görüntüsündeki 3 farklı fiyat → her fiyattan 1 ebook: $22.99 The Weeknight Kitchen (cooking), $34.99 The Sourdough Handbook (baking), $46.49 The Home Reset (organization). Filtre/kategori UI yok.

**Tasarım kararı:** açık/krem zemin, serif başlık (Fraunces) + DM Sans, kil/adaçayı/krem kapaklar, pill butonlar, bol boşluk. Orvenio'dan ~%60 farklı layout: hero'da üç kapak, her rehber ana sayfada büyük "feature" satırı (kapak + içerik, sağ/sol dönüşümlü), dikey liste/raf yok.

**Değişmeyen:** checkout fonksiyonu, ürün sayfası mantığı, legal/contact sayfa yapısı (metin Wyoming/US'e göre güncellenecek).

## 2026-10-15 — Sıralı sipariş numarası / ödeme açıklaması

Kullanıcı Stripe'ta ödemelerin "Marka Order #NNNNN" görünmesini istedi. Checkout Session'a `payment_intent_data[description] = "Raxaca Home Order #N"`, `client_reference_id = order-N`, `metadata[order_number]` eklendi; success URL'ine `&order=N` geçiyor ve success sayfası numarayı gösteriyor.
- Sayaç: **Netlify Blobs** (`orders` store, `counter` anahtarı), 10001'den başlar. Tek npm bağımlılığı `@netlify/blobs` (sıfır-bağımlılık ilkesinden sapma, bilinçli). Netlify dışında (lokal Node testi) Blobs yoksa zaman tabanlı numaraya düşer.
- Blobs'ta atomik artırma yok; aynı saniyede iki sipariş çok düşük olasılıkla aynı numarayı alabilir — kabul edildi.
- Güvenlik: kullanıcı ikinci kez bir `sk_live_` key yapıştırdı; roll etmesi söylendi, kullanılmadı.

- 2026-10-15: Domain **raxaca.com** (contact sayfasına + canonical/og:url eklendi). Repo: diğer hesapta, `boratsd` collaborator.

## 2026-10-15 — Canlı: https://raxaca.netlify.app

Deploy kullanıcı tarafından yapıldı. Canlı kontrol: sayfalar, `/ebooks/:slug` rewrite, asset'ler, 404, HSTS, fonksiyon (GET→405, POST→Stripe'a ulaşıyor) OK; tarayıcıda fontlar/kapaklar doğru, konsol temiz.
- **Sorun:** `STRIPE_SECRET_KEY` olarak key'in ID'si (`mk_…`) girilmiş; Stripe 502 "looks like the ID of an API key". Kullanıcıya `sk_test_…` değerini girip yeniden deploy etmesi söylendi.
- Domain raxaca.com kullanıcı tarafından bağlanıyor.
- Netlify "Powered by Netlify" rozeti görünüyor — bizim koddan değil.
- Key düzeltildi; `/api/checkout` artık Stripe Checkout URL'i döndürüyor (HTTP 200, hosted sayfa 200). **Ancak session `cs_live_` → Netlify'a LIVE key girilmiş.** Teslimat (PDF e-postası) olmadan canlı ödeme alınmamalı; kullanıcıya `sk_test_` ile değiştirmesi söylendi. Test sırasında 2 session oluşturuldu (ödeme yapılmadı; panelde "incomplete" görünür).
