# Amel Defteri ve Günlük Aktivite Geçmişi Planı

Bu plan, kullanıcıların "Günün Amelleri" (Checklist) kısmını işaretleyebilmesini ve bu aktivitelerin gün bazında kaydedilerek profillerinde bir takvim (calendar) olarak sunulmasını hedefler.

## Hedef
Kullanıcının yaptığı ibadetleri/görevleri dijital olarak takip edebilmesi, yanlışlıkla işaretlediğinde geri alabilmesi ve kazandığı puanların hesabına yansıması.

## Kullanıcı Tercihleri (Onaylananlar)
1. **Puan Sistemi:** İşaretlenen her görev için puanlar kullanıcının token bakiyesine anlık yansıyacak.
2. **Profil Geçmişi:** Profil sayfasında geçmiş aktiviteler şık bir **Takvim** görünümünde gösterilecek.
3. **Toggle (Geri Alma):** Kullanıcı işaretlediği bir görevi gün bitmeden geri alabilecek, bu durumda puanlar hesaptan düşülecek.

## Önerilen Değişiklikler

### 1. Veritabanı (Supabase)
- **[YENİ] `user_checklist_completions` Tablosu:**
    - `id` (uuid)
    - `user_id` (uuid)
    - `task_id` (uuid)
    - `completion_date` (date) -> Sorgu kolaylığı için.
    - `points` (integer) -> O an kazanılan puan.

### 2. Bileşenler
- **[MODIFY] `ContentCards.jsx` (`ChecklistCard`):**
    - `handleToggle` fonksiyonu eklenecek.
    - Haptik (titreşim) ve puan animasyonu eklenecek.

- **[MODIFY] `pages/Profile.jsx`:**
    - `CalendarView` bileşeni eklenecek.
    - Kullanıcının günlük toplam puanlarını gösteren bir heatmap/takvim yapısı kurulacak.

## Doğrulama Planı
- [ ] Görev işaretlendiğinde `tokens` artıyor mu?
- [ ] Görev geri alındığında `tokens` azalıyor mu?
- [ ] Takvim üzerinde geçmiş günler doğru puanlarla renkleniyor mu?
