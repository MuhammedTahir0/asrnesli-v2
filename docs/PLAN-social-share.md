# PLAN-social-share.md - Sosyal Medya Paylaşım Butonları

## 🎯 Hedef
Kullanıcıların **Share Studio** (Paylaşım Stüdyosu) sayfasında oluşturdukları tasarım kartlarını (ayet, hadis vb.) doğrudan **WhatsApp, Instagram ve Telegram** uygulamalarında paylaşabilmelerini sağlamak.

---

## 📋 Kapsam

### 1. Kullanıcı Arayüzü (UI)
- "Kaydet" butonunun yanına aşağıdaki butonlar eklenecek:
  - **WhatsApp** (Yeşil, ikonlu)
  - **Instagram** (Mor/Gradient, ikonlu)
  - **Telegram** (Mavi, ikonlu)
- Butonlar mobil uyumlu ve dokunmatik dostu olacak.
- "Kaydet" butonu ile görsel bütünlük sağlanacak.

### 2. Fonksiyonel Mantık
- **Genel Paylaşım Mantığı (Hibrit):**
  - Öncelikle tarayıcının **Web Share API** (yerel paylaşım menüsü) desteği kontrol edilecek.
  - Destekleniyorsa: Oluşturulan görsel (PNG blob) doğrudan paylaşım menüsüne gönderilecek.
  - Desteklenmiyorsa: Görsel indirilecek ve ilgili uygulamanın web sürümüne (WhatsApp Web, Telegram Web) yönlendirme yapılacak veya kullanıcıya manuel paylaşım talimatı verilecek.

- **Platform Özel Davranışları:**
  - **WhatsApp:** 
    - Mobil: Görsel dosyası ile direkt paylaşım (destekliyorsa).
    - Desktop: `wa.me` linki ile metin paylaşımı (Görseli manuel ekleme gerekir).
  - **Telegram:**
    - Mobil: Görsel dosyası ile direkt paylaşım.
    - Desktop: `t.me/share` linki.
  - **Instagram:**
    - Mobil: Görseli cihaza indir -> "Görsel indirildi, Instagram'ı açıp hikayene ekle" uyarısı göster -> Instagram uygulamasını aç (`instagram://` şeması ile).
    - Desktop: Sadece indirme ve uyarı.

### 3. Teknik Gereksinimler
- `html-to-image` kütüphanesi zaten mevcut, görsel oluşturma için kullanılacak.
- `navigator.share` (Web Share API Level 2) dosya paylaşımı için kullanılacak.
- `react-hot-toast` kullanıcı bildirimleri için kullanılacak.

---

## 🛠️ Görev Dağılımı

1.  [ ] **Helper Fonksiyonu:** `shareCanvas(platform)` fonksiyonunun yazılması.
    - Görseli oluştur (blob).
    - Platforma göre paylaşım akışını yönet.
2.  [ ] **UI Güncellemesi:** `ShareStudio.jsx` içine yeni buton grubunun eklenmesi.
3.  [ ] **İkonlar:** Gerekli ikonların (WhatsApp, Instagram, Telegram) projeye dahil edilmesi veya SVG olarak eklenmesi.
4.  [ ] **Test:** Mobil ve masaüstü cihazlarda davranışların doğrulanması.

---

## ⚠️ Önemli Notlar
- Instagram'ın web üzerinden doğrudan "Hikaye Paylaş" API desteği yoktur. Bu yüzden "İndir + Aç" yöntemi en güvenilir yoldur.
- Masaüstü tarayıcılarda Web Share API genellikle görsel dosya paylaşımını desteklemez. Bu durumda butonlar "İndir" işlevi görüp kullanıcıyı yönlendirecektir.
