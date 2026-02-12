# Kapsamlı Analiz: İslami Günlük Uygulama (Asr Nesli)

## **1. Proje Genel Bakış**
**Adı:** Asr Nesli (İslami Günlük Rehber)
**Türü:** React.js & Vite ile geliştirilmiş, İslami günlük içerik, namaz vakitleri, kıble yönü ve içerik paylaşımı sunan Progresif Web Uygulaması (PWA).
**Temel Felsefe:** "Hakkı ve Sabrı Tavsiye Edenler".
**Gelir Modeli:** Google AdSense (`index.html` içinde ekli), Ödüllü Reklamlar (`AdReward.jsx` ve `adminGetAdStats` ile anlaşılıyor).
**Tasarım:** Tailwind CSS v4 kullanan Premium/Lüks İslami estetik (Altın/Koyu Yeşil/Siyah tema).

---

## **2. Teknoloji Yığını**
- **Frontend Framework:** React 18
- **Derleme Aracı:** Vite 5
- **Dil:** JavaScript (ESModules)
- **Stillendirme:** Tailwind CSS v4 (`@tailwindcss/vite` eklentisi ile), tema özelleştirmesi için standart CSS değişkenleri.
- **Durum Yönetimi:** React Context API (`AuthContext`), Yerel Bileşen Durumu (Local State).
- **Yönlendirme:** `react-router-dom` v6.
- **Animasyonlar:** UI geçişleri için `framer-motion`.
- **Backend/Veritabanı:** Supabase (Auth, PostgreSQL Veritabanı, Depolama).
- **İkonlar:** `react-icons` (Fa, Md), Material Symbols, FontAwesome.
- **PWA Desteği:** `vite-plugin-pwa` (çevrimdışı yetenekler, service worker).
- **Harici API'ler:**
  - `aladhan.com` (Namaz Vakitleri).
  - `openstreetmap.org` (Ters Coğrafi Kodlama - Reverse Geocoding).
- **Yardımcı Araçlar:** `date-fns` (tarihlerde kullanıldığı varsayılıyor), `html-to-image`/`html2canvas` (Paylaşma işlevi).

---

## **3. Mimari ve Dosya Yapısı**
Proje **Özellik-Tabanlı + Servis-Katmanı** mimarisini takip etmektedir.

### **3.1 Dizin Yapısı**
- `/src/components`: Özelliğe göre organize edilmiş UI Bileşenleri.
  - `/auth`: Kimlik doğrulama mantığı (`AuthGuard`, `AuthInput`).
  - `/details`: İçerik detay görünümleri (`QuranDetail`, `HadithDetail` vb.).
  - `/home`: Anasayfaya özgü bileşenler (`PrayerHero`).
  - `/layout`: Uygulama iskelet bileşenleri (`Layout`, `Sidebar/Header` varsayılıyor).
  - `/shared`: Yeniden kullanılabilir bileşenler (`PreviewModal` varsayılıyor).
- `/src/services`: İş mantığı ve API entegrasyon katmanı.
  - `authService.js`: Supabase Auth sarmalayıcısı.
  - `prayerTimes.js`: Harici API entegrasyonu.
  - `syncService.js`: Çevrimdışı-öncelikli senkronizasyon mantığı.
  - `offlineStorage.js`: Önbellekleme için LocalStorage sarmalayıcısı.
- `/src/pages`: Üst seviye rota bileşenleri (çoğunlukla Auth ile ilgili).
- `/src/contexts`: Global durum sağlayıcıları (`AuthContext`).
- `/src/lib`: Yapılandırma ve örneklemeler (`supabaseClient.js`).

### **3.2 Temel Uygulama Akışları**

#### **Kimlik Doğrulama ve Kullanıcı Yönetimi**
- **Yöntemler:** E-posta/Şifre, Google OAuth.
- **Koruma:** Rotaları koruyan `AuthGuard` ara katman bileşeni.
- **Durum:** `AuthContext` oturum sürekliliğini ve profil yüklemeyi yönetir.
- **Profil:** Özel profil tablosu ile Supabase auth kullanıcısını genişletir (`public.users` veya metadata varsayılıyor).

#### **Veri Yönetim Stratejisi (Çevrimdışı-Öncelikli)**
- **Service Worker:** VitePWA aracılığıyla statik varlıkları önbelleğe alır.
- **API Önbellekleme:** `vite.config.js` içinde yapılandırılmış `prayer-times-cache` (24 saat) ve `google-fonts-cache` (1 yıl).
- **Senkronizasyon Mantığı:** `syncService.js`, çevrimdışı olunduğunda veri değişikliklerini (tercihler, tesbihat sayıları) kuyruğa alır ve çevrimiçi olunduğunda işler.

#### **İçerik Sunumu**
- **Günlük İçerik:** Optimize edilmiş günlük karışımı (Ayet, Hadis, Esma-ül Hüsna) getirir.
- **Kategoriler:** Dinamik yönlendirme ile belirli içerik türlerine yapılandırılmış erişim sağlar.

#### **Paylaşım Stüdyosu Özelliği**
- Paylaşılabilir İslami içerik kartları oluşturmak için özelleştirilmiş bir WYSIWYG editörü.
- Arka plan seçimi, metin özelleştirme ve çıkartmaları destekler.
- İndirilebilir/paylaşılabilir görseller oluşturmak için `html-to-image` kullanır.

---

## **4. Veritabanı Şeması (Türlerden Çıkarılan)**
- **`categories`**: İçerik kategorilendirmesi (id, name, slug, icon).
- **`daily_content`**: Diğer tablolara bağlanan günlük dönüşümlü içerik.
- **`hadiths`**: Peygamber Efendimizin sözleri (content, source, category).
- **`ilmihals`**: Soru-Cevap tarzı İslami bilgiler (question, answer).
- **`names_of_allah`**: 99 İsim (Esma-ül Hüsna) ve anlamları.
- **`verses`**: Kuran ayetleri (Arapça, Türkçe, Tefsir).
- **`user_favorites`**: Kullanıcı yer imleri için çoktan çoğa ilişki.
- **`user_preferences`**: Ayarlar senkronizasyonu.

---

## **5. Benzersiz Satış Noktaları (MVP Özellikleri)**
1.  **Premium Estetik:** Sadece bir araç uygulaması değil; görsel zarafete odaklanır.
2.  **Sosyal Paylaşım:** Yerleşik "Paylaşım Stüdyosu" viral büyümeyi teşvik eder.
3.  **Oyunlaştırma:** Kullanıcılar için "Token" sistemi (`authService` içinde grant/consume mantığı).
4.  **Reklam Destekli Model:** Sürdürülebilirlik için ödüllü reklam entegrasyonu.
5.  **Güvenilirlik:** Çevrimdışı-öncelikli mimari, internet olmadan bile kullanım sağlar.

---

## **6. Gelecek Ölçeklenebilirliği ve Teknik Borç**
- **Mevcut Durum:** Sağlam React kodu, modüler servisler.
- **Potansiyel Sorunlar:** Büyük bileşen dosyaları (`ShareStudio.jsx` ~76KB, `AdminPanel.jsx` ~78KB), daha küçük alt bileşenlere ayrıştırılması gerektiğini gösteriyor.
- **Güvenlik:** Supabase üzerindeki RLS (Satır Düzeyi Güvenlik) politikaları kritiktir (burada görünmüyor ancak şema için gereklidir).
