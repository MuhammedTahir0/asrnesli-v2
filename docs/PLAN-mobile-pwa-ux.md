# PLAN: Mobil PWA, Offline & Senkronizasyon Geliştirmesi

Bu plan, **Asr Nesli** uygulamasının mobil kullanıcı deneyimini maksimize etmek için PWA (Progressive Web App) dönüşümünü, çevrimdışı çalışma desteğini, veri senkronizasyonunu ve tarayıcı tabanlı bildirimleri kapsar.

## 📋 Proje Özeti
- **Proje Türü:** WEB (Mobile-First)
- **Hedef:** Uygulamayı tam bir mobil uygulama gibi hissettirmek ve internet olmasa dahi temel işlevleri sunmak.

## 🎯 Başarı Kriterleri
- [x] Uygulamanın ana ekrana "Uygulama" olarak yüklenebilmesi (PWA).
- [x] İnternet bağlantısı kesildiğinde önbellekteki içeriklerin (Ayet/Hadis) görüntülenebilmesi.
- [x] Kullanıcı tercihlerinin ve zikir sayacı gibi verilerin Supabase ile senkronize edilmesi.
- [x] Tarayıcı üzerinden (Web Push) temel bildirimlerin gönderilebilmesi.

## 🛠️ Teknoloji Yığını
- **PWA:** `vite-plugin-pwa` (Vite entegrasyonu için).
- **Offline Storage:** Service Workers + Cache API + `localStorage`.
- **Backend/Sync:** Supabase (Auth & Database).
- **Notifications:** Browser Notification API.

## 📂 Dosya Yapısı Değişiklikleri
```text
src/
├── hooks/
│   └── useSync.js           # Senkronizasyon mantığı (syncService olarak eklendi)
├── services/
│   ├── notificationService.js # Bildirim yönetimi
│   ├── offlineStorage.js      # Offline veri yönetimi
│   └── syncService.js         # Senkronizasyon servisi
├── pwa-config.js            # vite.config.js içine entegre edildi
```

## 📝 Görev Dağılımı

### Faz 1: PWA Kurulumu (Foundation)
- [x] **Görev 1:** `vite-plugin-pwa` kurulumu ve konfigürasyonu.
- [x] **Görev 2:** `manifest.json` ve uygulama ikonlarının (PWA standartları) oluşturulması.
- [x] **Görev 3:** Service Worker'ın "Stale-While-Revalidate" stratejisi ile yapılandırılması.

### Faz 2: Offline & Veri Yönetimi
- [x] **Görev 4:** Günlük içeriklerin (Ayet, Hadis, Esma) `localStorage` üzerinde yedeklenmesi.
- [x] **Görev 5:** `offlineStorage` servisinin yazılarak internet durumuna göre verilerin yüklenmesi.

### Faz 3: Senkronizasyon (Sync)
- [x] **Görev 6:** Supabase entegrasyonu ve senkronizasyon mantığının kurulması.
- [x] **Görev 7:** Profil sayfası ve AuthContext üzerinden veri senkronizasyonu.

### Faz 4: Bildirimler (Notifications)
- [x] **Görev 8:** Bildirim izni isteme arayüzünün oluşturulması.
- [x] **Görev 9:** Ezan vaktine 15 dakika kala tarayıcı bildirimi gönderilmesi.

## ✅ PHASE X COMPLETE
- PWA (Vite PWA): ✅ Çalışıyor
- Build Test: ✅ Başarılı
- Offline Fallback: ✅ Test Edildi
- Sync Logic: ✅ Aktif
- Notifications: ✅ Aktif
- Tarih: 2026-02-09


---
**Not:** Bu plan onaylandıktan sonra `/create` komutu ile uygulama aşamasına geçilebilir.
