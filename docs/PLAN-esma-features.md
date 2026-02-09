# PLAN: Esmaül Hüsna ve İçerik Kaydetme/Paylaşma Özellikleri

Esmaül Hüsna ve genel içerik detaylarında bulunan "Paylaş" ve "Kaydet" butonlarının işlevsel hale getirilmesi, verilerin bulutta saklanması ve içeriğin "Studio" modülüne aktarılması planıdır.

## 📝 Mevcut Durum Analizi
- `ContentReader.jsx` ve `EsmaDetail.jsx` bileşenlerinde butonlar mevcut ancak `onClick` işleyicileri yok.
- Veritabanında favori/kayıtlı içerikler için bir tablo bulunmuyor.
- Stüdyo modülü (`ShareStudio`?) mevcut ancak içerik aktarımı entegre edilmemiş.

## 🛠 Teknik Çözüm Yaklaşımı
1.  **Veritabanı:** Supabase üzerinde `user_favorites` tablosu oluşturulacak. Ek olarak "Hızlı Kaydet" için bir servis yazılacak.
2.  **Paylaşım:** İçeriğin doğrudan "Studio" (Paylaşım Stüdyosu) sayfasına verilerle (`state`) birlikte yönlendirilmesi sağlanacak.
3.  **Favoriler Sayfası:** Profil sayfasından erişilebilen, kaydedilen Esma ve duaların listelendiği şık bir arayüz eklenecek.

---

## 📅 Faz 1: Altyapı ve Veritabanı
- [ ] **DB Görevi:** `user_favorites` tablosunu oluştur (`user_id`, `content_id`, `content_type`, `meta_data`).
- [ ] **RLS Politikaları:** Kullanıcıların sadece kendi favorilerini görebilmesi/silebilmesi için RLS ekle.
- [ ] **Servis Katmanı:** `favoriteService.js` oluştur (`addFavorite`, `removeFavorite`, `getFavorites`).

## 📅 Faz 2: İçerik Okuyucu (ContentReader) Entegrasyonu
- [ ] **Kaydet Butonu:** `ContentReader.jsx` içerisinde Supabase bağlantısını kur. Giriş yapılmamışsa uyarı ver.
- [ ] **Paylaş Butonu:** Tıklandığında mevcut içeriği (`title`, `arabic`, `content`) `location.state` ile `/studio` sayfasına gönder.
- [ ] **Durum Kontrolü:** İçeriğin daha önce kaydedilip edilmediğini kontrol eden görsel (dolu/boş ikon) geri bildirimi ekle.

## 📅 Faz 3: Favoriler Sayfası ve Profil Entegrasyonu
- [ ] **Yeni Sayfa:** `Favorites.jsx` oluştur. Esmaül Hüsna ve Dualar için sekmeli (Tabs) yapı kur.
- [ ] **Profil Güncelleme:** `Profile.jsx` içine "Kaydedilenler" butonu ve favori sayısını gösteren bir sayaç ekle.
- [ ] **Navigasyon:** Uygulama rotalarına (`App.jsx`) favoriler sayfasını ekle.

## 📅 Faz 4: Final Kontroller ve UX
- [ ] Animasyonların (Framer Motion) her adımda premium hissettirdiğinden emin ol.
- [ ] Hata yönetimi (Toast mesajları) ekle (Örn: "Başarıyla kaydedildi").
- [ ] Mobil uyumluluk ve performans testlerini yap.

---

## 🚦 Doğrulama Kriterleri
1. Esma detayında "Kaydet"e basınca veritabanına kayıt düşüyor mu?
2. "Paylaş"a basınca Studio sayfası o esmanın metniyle açılıyor mu?
3. Profil sayfasından favorilere gidince tüm kayıtlı içerikler görünüyor mu?
4. Kayıtlı bir öğe tekrar basıldığında favorilerden çıkarılıyor mu?

**Sonraki Adım:** Uygulamaya başlamak için `/create` komutunu çalıştırabilirsiniz.
