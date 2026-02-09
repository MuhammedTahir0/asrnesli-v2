## Amaç
ShareStudio sayfasına token tabanlı indirme/paylaşma kontrolü eklemek; Supabase profil tablosunda token takibi yapmak; reklam (AdSense) izleme ile token artırımı sağlamak; İslami‑lüks temaya uygun UI/UX sunmak; güvenli ve manipülasyona dayanıklı bir akış kurmak.

## Kapsam ve Varsayımlar
- AdSense ile reklam izleme sonrası `+1 token` verilecek.
- Kullanıcı kayıt olduğunda token başlangıcı `5` olacak.
- Token limiti **yok**; reklam izledikçe sınırsız artabilir.
- Toast bildirimleri `react-hot-toast` ile gösterilecek.
- İndirme/paylaşma akışları ShareStudio içerisinden yönetiliyor.

## Değiştirilecek Dosyalar ve Bileşenler
- `src/components/ShareStudio.jsx`
  - Token durumunu gösteren UI
  - Token tüketimi (download/share) öncesi kontrol
  - Token yokken buton disable + alternatif reklam CTA
  - Toast bildirimleri
- `src/services/authService.js`
  - Kayıt sonrası profil oluştururken `tokens: 5` yazımı
  - Token güncelleme yardımcı fonksiyonları (artır/azalt)
- `src/contexts/AuthContext.jsx`
  - Profil state’inde `tokens` alanı ve güncelleme akışı
- (Gerekirse) `src/services/tokenService.js` (yeni dosya)
  - Sunucu tarafı / RPC benzeri tek nokta token mutasyonu
- `src/lib/supabaseClient.js`
  - Değişiklik yok, sadece mevcut istemci kullanımı
- Supabase Veritabanı
  - `profiles` tablosuna `tokens` alanı ekleme
  - Güvenlik politikaları (RLS) ve RPC fonksiyonları

## Uygulama Planı
### 1) Veritabanı Şeması ve Güvenlik
- `profiles` tablosuna `tokens` (integer, default 5, not null) ekle.
- RLS politikaları:
  - Kullanıcı sadece kendi profilini okuyabilsin.
  - Kullanıcı doğrudan `tokens` alanını güncelleyemesin.
  - Token artırma/azaltma işlemleri için **RPC** fonksiyonları kullanılsın.
- RPC Fonksiyonları:
  - `consume_token(user_id)` → tokens > 0 ise 1 azaltıp yeni değeri döndürür; yetersizse hata.
  - `grant_token(user_id, amount)` → tokens artırır ve yeni değeri döndürür.
- Sunucu tarafı kural: `consume_token` atomik olmalı (race condition önlenir).

### 2) Auth Servis Katmanı
- `signUpWithEmail` sonrası profil oluşturma/upsert sırasında `tokens: 5` yaz.
- Token işlemleri için servis fonksiyonları ekle:
  - `consumeToken()` → RPC çağrısı
  - `grantToken(1)` → RPC çağrısı
- Hata yönetimi: RPC’den gelen hata mesajlarını toast’a ilet.

### 3) Auth Context ve Profil State
- Profil state’ine `tokens` alanı dahil et.
- Token güncellemeleri sonrası `profile` state’ini güncelle (optimistic + geri alma mantığı eklenebilir).
- Oturum yoksa token işlemlerini engelle.

### 4) ShareStudio UI/UX (İslami‑Lüks Tema)
- Üst bölümde “Token Durumu” bileşeni:
  - “`X token`” ve “`başlangıç 5`” yerine “`X token` / “`kalan`” mesajı.
  - Altın bordür, koyu arka plan, zarif serif başlık + rafine gövde font eşleşmesi.
  - İnce geometrik desen/arabesk çizgi dokusu (CSS arka plan).
- Token yokken:
  - İndirme/Paylaşma butonları disable + tooltip benzeri bilgi metni.
  - “Reklam İzle ve Token Kazan” CTA butonu görünür.
- Token varken:
  - Download/Share butonları aktif.
  - İşlem sonrası token güncellenir.

### 5) ShareStudio Token Akışı
- `handleDownload` ve `handleShare` çağrısından önce:
  - Kullanıcı girişli mi? Değilse: toast ile giriş yönlendirmesi.
  - Token > 0 mı? Değilse: toast + reklam CTA göster.
- Download/Share başarılı olduğunda:
  - `consumeToken()` çağrısı (token 1 azalır).
  - UI’da token sayısı güncellenir.
- Web Share desteklenmiyorsa indirmeye fallback, token yine 1 azalır.

### 6) AdSense Entegrasyon Akışı
- AdSense reklam izleme tamamlandığında:
  - `grantToken(1)` çağrısı.
  - Başarılıysa toast “+1 token eklendi”.
  - Hata varsa toast ile kullanıcı bilgilendirilir.
- Reklam gösterim/izleme doğrulaması:
  - AdSense onay event’i veya callback üzerinden tetikleme.

### 7) Toast Mesajları
- Başarılı: “Token harcandı”, “+1 token eklendi”.
- Hata: “Token yetersiz”, “Oturum açmanız gerekiyor”, “Reklam doğrulanamadı”.

## Güvenlik ve Manipülasyon Önlemleri
- Token düşürme/artırma yalnızca Supabase RPC ile yapılır.
- RLS ile `tokens` alanı doğrudan update edilemez.
- RPC fonksiyonları atomik çalışır ve `tokens > 0` kontrolü SQL seviyesinde yapılır.
- İstemci tarafı sadece UI için; gerçek kaynak doğrulama sunucu tarafında olmalıdır.
- Reklam izleme doğrulaması olmadan token artırma engellenir (callback doğrulaması şart).
- Loglama: RPC çağrıları için minimum denetim kaydı (user_id, action, timestamp).

## Doğrulama / Kabul Kriterleri
- Yeni kayıt olan kullanıcı `tokens = 5` ile başlar.
- Download/Share işleminde token 1 azalır.
- Token 0 olduğunda indirme/paylaşma devre dışı ve reklam CTA görünür.
- Reklam izleme sonrası token +1 artar.
- UI token sayısı anlık güncellenir.
- Oturum yokken token işlemleri çalışmaz ve toast ile bilgilendirilir.
- RLS, doğrudan token manipülasyonunu engeller.

## Adım → Hedefler → Doğrulama Eşlemesi
1. **DB Şema + RLS + RPC** → `profiles.tokens`, güvenlik kuralları → Supabase SQL testleri ile RPC fonksiyon denemesi
2. **authService güncellemeleri** → `tokens: 5`, RPC çağrıları → kayıt sonrası profil verisi kontrolü
3. **AuthContext state** → `tokens` state senkronu → oturum aç/çıkışta token değerinin görünmesi
4. **ShareStudio UI/UX** → token göstergesi, CTA, disable → görsel kontrol + manual QA
5. **ShareStudio akışları** → token tüketimi/izin kontrolü → indirme/paylaşma test akışı
6. **AdSense token artırımı** → `grantToken` tetikleme → reklam callback testi
7. **Toast mesajları** → bilgi/hata akışı → durum bazlı toast doğrulaması
