# Sesli Okuma Özelliği Yapılacaklar

## Genel Bakış
Yasin Suresi ve diğer surelerin sesli olarak dinlenebilmesi için gerekli geliştirmeler.

---

## 1. Veritabanı Değişiklikleri

### 1.1 Vers Tablosuna Audio URL Ekleme
```sql
ALTER TABLE public.verses 
ADD COLUMN IF NOT EXISTS audio_url TEXT;
```

### 1.2 Surah Tablosu Oluşturma (İleride)
- Sure bazlı ses dosyaları için ayrı tablo
- `surah_audio` tablosu: surah_number, audio_url, reciter_name

---

## 2. Backend API

### 2.1 Storage Yapılandırması
- Supabase Storage'da `quran-audio` bucket oluştur
- Ses dosyalarını yükleme endpoint'i

### 2.2 Upload Fonksiyonu
- Admin panel'e ses yükleme özelliği ekle
- Batch upload desteği (83 ayet için)

---

## 3. Frontend Bileşenleri

### 3.1 AudioPlayer Bileşeni
- `src/components/shared/AudioPlayer.jsx` olarak oluştur
- Özellikler:
  - Play/Pause butonu
  - Progress bar
  - Ses seviyesi kontrolü
  - Hangi ayet çalıyor gösterimi
  - Otomatik sonraki ayete geçiş

### 3.2 QuranReader Güncellemesi
- AudioPlayer bileşenini entegre et
- Her ayette play butonu (isteğe bağlı)
- Sesli okuma modu toggle

### 3.3 Arka Plan Çalma
- Uygulama kapalıyken sesin devam etmesi
- Bildirim ile kontrol

---

## 4. Ses Kaynakları

### 4.1 Kur'an Okunuşları
- Abdurrahman es-Sudais
- Mishary Rashid Alafasy
- Mahmoud Khalil Al-Husary
- Diyanet İşleri Başkanlığı

### 4.2 Telif Hakları
- Lisanslı kaynak kullanımı
- Creative Commons seçenekleri araştır

---

## 5. İleride Eklenecek Özellikler

- [ ] Tekrarlama modu (loop)
- [ ] Ayet sonunda duraklatma
- [ ] Hızlı ileri/geri (10 saniye)
- [ ] Farklı hafızlar arası geçiş
- [ ] İndirme özelliği (offline dinleme)
- [ ] Son dinlenen yerden devam etme

---

## Öncelik Sırası
1. **Yüksek**: Vers tablosuna audio_url ekleme
2. **Yüksek**: AudioPlayer bileşeni oluşturma
3. **Orta**: Sample ses dosyaları yükleme
4. **Düşük**: Arka plan çalma özelliği

---

## Notlar
- Ses dosyaları büyük olabilir → CDN kullanımı düşünülmeli
- Mobil veri için otomatik indirme kontrolü ekle
- Kullanıcı tercihlerini kaydet (son dinlenen, tercih edilen hafız)

---

**Oluşturulma Tarihi:** 2026-02-14
**Son Güncelleme:** 2026-02-14
**Durum:** Planlama Aşamasında
