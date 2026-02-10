# Proje Planı: Premium Paylaşım Önizleme ve Lightbox

Bu doküman, Paylaşım Stüdyosu'nda görsel önizleme ve Lightbox özelliklerinin eklenmesine dair teknik ve süreç planını içerir.

## 1. Hedef
Kullanıcının oluşturduğu tasarıma tıkladığında, tüm araçlardan arınmış, temiz ve tam ekran bir önizleme (Lightbox) görmesini ve bu ekran üzerinden doğrudan paylaşım yapabilmesini sağlamak.

## 2. Görev Listesi (Task Breakdown)

### Faz 1: Altyapı ve Hazırlık
- [ ] `ShareStudio.jsx` içinde `isPreviewOpen` state'inin tanımlanması.
- [ ] Kanvas alanına (cardRef) tıklama olayının (onClick) eklenmesi.
- [ ] Görsel üzerine "Önizle" overlay (katman) tasarımı.

### Faz 2: Lightbox & Modal Geliştirme
- [ ] `src/components/shared/PreviewModal.jsx` bileşeninin oluşturulması.
- [ ] Framer Motion ile giriş/çıkış animasyonlarının eklenmesi.
- [ ] Görselin `html-to-image` ile render edilip modal içinde gösterilmesi.

### Faz 3: Paylaşım Entegrasyonu
- [ ] Sosyal medya ikonlarının modal içine yerleştirilmesi.
- [ ] `handleSharePlatform` fonksiyonunun modal ile uyumlu hale getirilmesi.
- [ ] Mobil cihazlarda "Native Share" API entegrasyonu.

## 3. Ajan Atamaları
- **Frontend Specialist**: UI kurulumu ve animasyonlar.
- **Backend/Auth Specialist**: Token kontrolü ve paylaşım servisleri.

## 4. Doğrulama (Verification)
- [ ] Masaüstünde tıklayınca Lightbox açılıyor mu?
- [ ] Mobilde tam ekran görünümü düzgün mü?
- [ ] Paylaşım butonları token düşürüp ilgili uygulamayı açıyor mu?

---
[OK] Plan oluşturuldu. Uygulamaya başlamak için `/create` komutunu çalıştırabilir veya planı onaylayabilirsiniz.
