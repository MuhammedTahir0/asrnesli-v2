# PLAN-dashboard-controls.md - Dashboard Kart Görünürlük Kontrolleri

Bu plan, kullanıcının ana ekrandaki (Home) içerik kartlarını (Ayet, Hadis, Kıssa vb.) kendi tercihine göre açıp kapatabilmesini sağlayacak altyapıyı ve arayüzü kapsar.

## Analiz ve Varsayımlar
- **Depolama**: Ayarlar `user_settings` tablosunda `dashboard_visibility` (jsonb) alanında saklanacaktır.
- **Kapsam**: Ayet, Hadis, İlmihal, Esma-ül Hüsna, Kıssa, Dua, Hikmetli Söz kartları kontrol edilecektir.
- **Yerleşim**: `src/components/Settings.jsx` adında yeni bir bileşen oluşturulacak ve `App.jsx` içinde `/settings` rotasına eklenecektir.

## Uygulama Adımları

### 1. Veritabanı (Supabase)
- `user_settings` tablosuna `dashboard_visibility` sütununun (JSONB, default: all true) eklenmesi için migration hazırlanması.

### 2. Bileşenler & Sayfalar
- **[YENİ]** `src/components/Settings.jsx`:
    - Premium toggle switch görünümü.
    - Supabase ile gerçek zamanlı ayarlar senkronizasyonu.
    - Haptic feedback entegrasyonu.
- **[GÜNCELLEME]** `src/App.jsx`: `/settings` rotasının eklenmesi.
- **[GÜNCELLEME]** `src/components/Home.jsx`: `dashboard_visibility` ayarının okunması ve kartların buna göre filtrelenmesi.

### 3. Servisler
- `authService.js` veya `settingsService.js` içinde ayarları getiren ve güncelleyen fonksiyonların eklenmesi.

## Doğrulama Planı
1. Ayarlar sayfasında bir kartın kapatılması.
2. Ana sayfaya dönüldüğünde ilgili kartın görünmediğinin teyit edilmesi.
3. Sayfa yenilendiğinde tercihlerin korunduğunun doğrulanması.
