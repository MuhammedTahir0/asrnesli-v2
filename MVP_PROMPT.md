# PROMPT: "Asr Nesli" Geliştirme - Premium İslami Günlük Rehber PWA

**Rol:** Kıdemli Frontend Mühendisi & UI/UX Tasarımcısı
**Hedef:** Günlük İslami içerik, namaz vakitleri ve sosyal paylaşım araçları sunan, yüksek performanslı, çevrimdışı-öncelikli "Asr Nesli" adında bir Progresif Web Uygulaması (PWA) oluşturmak.

---

## **1. Proje Kapsamı ve Vizyon**
**Konsept:** Faydayı (namaz vakitleri, kıble) maneviyat (günlük ayetler, hadisler) ve topluluk (içerik paylaşımı) ile birleştiren "Müminler için Dijital Yol Arkadaşı".
**Tasarım Estetiği:** "İslami Lüks" - Derin Orman Yeşili (`#2D5A27`), Altın (`#C5A059`) ve Koyu Grafit (`#1a1c1a`) paleti kullanın. Arayüz huzurlu, premium ve yerel uygulama hissi vermelidir. İçerik için `Noto Serif`, arayüz metinleri için `Noto Sans` kullanın.

---

## **2. Fonksiyonel Gereksinimler (MVP)**

### **A. Kimlik Doğrulama ve Kullanıcı Sistemi**
- **Supabase Auth:** E-posta/Şifre ve Google OAuth.
- **Profiller:** `username`, `avatar_url` ve `token_balance` bilgilerini herkese açık `profiles` tablosunda saklayın.
- **Korumalı Rotalar:** Hassas sayfaların (Profil, Favoriler) `AuthGuard` tarafından korunduğundan emin olun.

### **B. Temel İçerik Özellikleri**
1.  **Ana Sayfa Akışı:** Şunları içeren günlük küratörlü bir "Kart" görüntüleyin:
    -   Bir Kuran Ayeti
    -   Bir Hadis-i Şerif
    -   Bir Allah'ın İsmi (Esma-ül Hüsna)
    -   Bu içerik sunucu saatine göre günlük olarak değişmelidir.
2.  **Namaz Vakitleri:**
    -   Kullanıcı GPS'ine veya seçilen şehre göre `aladhan.com` API'sinden veri çekin.
    -   Bir sonraki vakte kalan süreyi (geri sayım) gösterin.
    -   Çevrimdışı çalışabilmesi için verileri 24 saat önbelleğe alın.
3.  **Kıble Bulucu:** Cihaz yönelim sensörlerini kullanarak Kabe'yi (Mekke) gösteren bir pusula arayüzü.

### **C. Sosyal "Paylaşım Stüdyosu" (Çarpıcı Özellik)**
-   **Tuval Editörü:** Kullanıcıların güzel arka planlar üzerine metinler (Ayetler/Hadisler) yerleştirebileceği bir WYSIWYG editörü.
-   **Araçlar:**
    -   *Şablonlar:* Önceden tasarlanmış düzenler.
    -   *Çıkartmalar:* İslami hat sanatı katmanları (Bismillah, Maşallah).
    -   *Dışa Aktarma:* `html-to-image` kullanarak yüksek çözünürlüklü PNG olarak indirme.
    -   *Paylaşma:* Yerel Web Paylaşım API entegrasyonu.

### **D. Oyunlaştırma ve Gelir Modeli**
-   **Token Ekonomisi:** Kullanıcılar günlük içerik okuyarak veya Ödüllü Reklam izleyerek "Sev-ap Token" kazanır.
-   **Reklam Sistemi/Yeri:** Geçiş veya ödüllü reklamlar için Google AdSense/AdMob entegrasyonu.

---

## **3. Teknik Yığın ve Mimari**

-   **Framework:** React 18 + Vite 5
-   **Stillendirme:** Tailwind CSS v4 (Özel renkler/fontlar için `@theme` kullanın).
-   **Durum Yönetimi:** React Context (`AuthContext`) + LocalStorage (çevrimdışı önbellek için).
-   **Veritabanı:** Supabase (PostgreSQL).
-   **PWA:** `vite-plugin-pwa`, `generateSW` stratejisi ile.
-   **Animasyonlar:** Sayfa geçişleri ve mikro etkileşimler için `framer-motion`.

---

## **4. Veri Stratejisi (Çevrimdışı-Öncelikli)**
1.  **Senkronizasyon Servisi:** Tüm kullanıcı eylemleri (bir ayeti beğenme, ayarları değiştirme) iyimser (optimistic) olmalıdır. Önce LocalStorage'a kaydedin, çevrimiçi olduğunda Supabase'e senkronize edin.
2.  **Önbellekleme:** Günlük içeriği ve namaz vakitlerini önbelleğe alın. API çağrıları yalnızca önbellek süresi dolmuşsa veya boşsa yapılmalıdır.

---

## **5. Uygulama Adımları**
1.  **Kurulum:** Vite + Tailwind v4 + Supabase İstemcisini başlatın.
2.  **Tasarım Sistemi:** Altın/Yeşil tema için CSS değişkenlerini içeren geçerli `index.css` dosyasını oluşturun.
3.  **Auth Katmanı:** `AuthService` ve `AuthContext` yapısını kurun.
4.  **Temel UI:** `Layout`, `Home` ve `PrayerTimes` bileşenlerini uygulayın.
5.  **Özellik - Paylaşım Stüdyosu:** Tuval editörü mantığını oluşturun.
6.  **PWA Entegrasyonu:** `manifest.json` ve service worker'ları yapılandırın.
7.  **Oyunlaştırma:** Token mantığını ve reklam yerleşimlerini uygulayın.

---

**Çıktı Kısıtlaması:** Tüm kodun modüler olduğundan emin olun. API mantığını `src/services/` içine ve yeniden kullanılabilir UI'yı `src/components/shared/` içine ayırın.
