# 📋 PLAN: Paylaşım Stüdyosu v2.0 - Kapsamlı Geliştirme

> **Oluşturulma Tarihi:** 2026-02-02
> **Durum:** 📝 PLANLANMIŞ
> **Öncelik:** ⭐⭐⭐⭐⭐ (Yüksek)
> **Tahmini Süre:** 3-4 saat

---

## 🎯 Hedef Özeti

Paylaşım Stüdyosu'nu sosyal medya paylaşımları için tam teşekküllü bir içerik oluşturma aracına dönüştürmek. Yeni şablonlar, yazı tipi seçimi, renk paleti, sticker/emoji, arka plan galerisi, animasyonlu çıktı, watermark özelleştirmesi ve içerik entegrasyonu eklenecek.

---

## 📊 Mevcut Durum Analizi

### Mevcut Özellikler
- ✅ 4 şablon (Nur, Doğa, Hat, Gece)
- ✅ 3 boyut (Hikaye 9:16, Gönderi 4:5, Kare 1:1)
- ✅ Metin düzenleme
- ✅ Görsel yükleme
- ✅ PNG indirme
- ✅ Native Share API

### Eksiklikler
- ❌ Platform bazlı boyutlar yok
- ❌ Yazı tipi seçimi yok
- ❌ Renk özelleştirmesi yok
- ❌ Sticker/emoji yok
- ❌ Hazır arka plan galerisi yok
- ❌ Animasyonlu/video çıktı yok
- ❌ Watermark özelleştirmesi yok
- ❌ İçerik entegrasyonu (ayet, hadis, namaz vakti) yok

---

## 🏗️ Mimari Tasarım

```
src/
├── components/
│   ├── ShareStudio/
│   │   ├── ShareStudio.jsx          # Ana konteyner (refactor)
│   │   ├── Canvas.jsx               # Görsel oluşturma alanı
│   │   ├── TemplateSelector.jsx     # Şablon seçici
│   │   ├── FontSelector.jsx         # Yazı tipi seçici
│   │   ├── ColorPalette.jsx         # Renk paleti
│   │   ├── StickerPanel.jsx         # Sticker/emoji paneli
│   │   ├── BackgroundGallery.jsx    # Arka plan galerisi
│   │   ├── WatermarkEditor.jsx      # Watermark özelleştirme
│   │   ├── SizeSelector.jsx         # Boyut seçici (genişletilmiş)
│   │   └── TextEditor.jsx           # Gelişmiş metin editörü
│   └── ...
├── data/
│   ├── templates.js                 # Tüm şablon tanımları
│   ├── fonts.js                     # Font listesi
│   ├── stickers.js                  # Sticker/emoji verileri
│   └── backgrounds.js               # Hazır arka planlar
└── services/
    └── canvasExport.js              # Canvas export servisi
```

---

## 📋 Görev Listesi

### Faz 1: Temel Altyapı (30 dk)
| # | Görev | Dosya | Durum |
|---|-------|-------|-------|
| 1.1 | ShareStudio klasör yapısını oluştur | `src/components/ShareStudio/` | ⬜ |
| 1.2 | Mevcut ShareStudio.jsx'i modüler hale getir | `ShareStudio.jsx` | ⬜ |
| 1.3 | Veri dosyalarını oluştur | `src/data/` | ⬜ |

### Faz 2: Yeni Şablonlar (45 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 2.1 | Ramazan Şablonu | Hilal, yıldızlar, iftar teması | ⬜ |
| 2.2 | Cuma Şablonu | Cami silueti, yeşil tonlar | ⬜ |
| 2.3 | Mevlid Şablonu | Kandil ışıkları, sıcak tonlar | ⬜ |
| 2.4 | Sabah Azkar Şablonu | Gün doğumu, pastel tonlar | ⬜ |
| 2.5 | Akşam Azkar Şablonu | Gün batımı, turuncu-mor tonlar | ⬜ |
| 2.6 | Gradient Şablonu | Modern gradient arka planlar | ⬜ |
| 2.7 | Geometrik İslami Şablon | Geometrik desenler | ⬜ |

### Faz 3: Yazı Tipi Seçimi (30 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 3.1 | FontSelector bileşeni | Font seçim UI'ı | ⬜ |
| 3.2 | Google Fonts entegrasyonu | Dinamik font yükleme | ⬜ |
| 3.3 | Font kategorileri | Arapça Hat, Modern, Klasik, El Yazısı | ⬜ |

**Önerilen Fontlar:**
- **Arapça Hat:** Amiri, Scheherazade New, Lateef
- **Modern:** Inter, Poppins, Outfit
- **Klasik Serif:** Playfair Display, Crimson Text
- **El Yazısı:** Caveat, Dancing Script

### Faz 4: Renk Paleti (30 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 4.1 | ColorPalette bileşeni | Renk seçim UI'ı | ⬜ |
| 4.2 | Hazır paletler | 10+ hazır renk paleti | ⬜ |
| 4.3 | Özel renk seçici | Color picker entegrasyonu | ⬜ |

**Hazır Paletler:**
- İslami Yeşil (#2D5A27, #C5A059)
- Gece Mavisi (#0f172a, #1e3a5f)
- Ramazan Mor (#2c1a4d, #6b2457)
- Doğa Yeşili (#065f46, #10b981)
- Gün Batımı (#f97316, #ec4899)
- Minimalist (#ffffff, #1f2937)

### Faz 5: Sticker/Emoji Paneli (45 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 5.1 | StickerPanel bileşeni | Drag & drop sticker ekleme | ⬜ |
| 5.2 | İslami sticker seti | Cami, hilal, Kâbe, tesbih, vb. | ⬜ |
| 5.3 | Emoji kategorileri | Dua, kutlama, doğa emojileri | ⬜ |
| 5.4 | Sticker boyutlandırma/döndürme | Transform kontrolları | ⬜ |

**Sticker Kategorileri:**
- Camiler ve İslami mimari
- Hilal ve yıldızlar
- Kâbe ve Mescid-i Nebevi
- Tesbih ve seccade
- Kuran ve mushaf
- Dekoratif İslami desenler

### Faz 6: Arka Plan Galerisi (30 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 6.1 | BackgroundGallery bileşeni | Galeri UI'ı | ⬜ |
| 6.2 | Hazır arka plan koleksiyonu | 20+ premium arka plan | ⬜ |
| 6.3 | Kategori filtreleme | Doğa, Şehir, Soyut, İslami | ⬜ |
| 6.4 | Blur/overlay seçenekleri | Arka plan efektleri | ⬜ |

### Faz 7: Platform Boyutları (20 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 7.1 | Genişletilmiş boyut seçenekleri | Tüm platformlar | ⬜ |

**Desteklenecek Boyutlar:**
| Platform | Boyut | Oran |
|----------|-------|------|
| Instagram Story | 1080x1920 | 9:16 |
| Instagram Post | 1080x1350 | 4:5 |
| Instagram Square | 1080x1080 | 1:1 |
| Instagram Reels | 1080x1920 | 9:16 |
| WhatsApp Status | 1080x1920 | 9:16 |
| TikTok | 1080x1920 | 9:16 |
| Twitter/X | 1200x675 | 16:9 |
| Facebook Post | 1200x630 | 1.91:1 |
| YouTube Thumbnail | 1280x720 | 16:9 |

### Faz 8: Watermark Özelleştirmesi (20 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 8.1 | WatermarkEditor bileşeni | Watermark düzenleme UI'ı | ⬜ |
| 8.2 | Konum seçimi | 4 köşe + merkez | ⬜ |
| 8.3 | Özel logo yükleme | Kullanıcı logosu desteği | ⬜ |
| 8.4 | Watermark gizleme | Toggle seçeneği | ⬜ |

### Faz 9: İçerik Entegrasyonu (45 dk)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 9.1 | Ayet/Hadis entegrasyonu | Günlük içerikten doğrudan paylaşım | ⬜ |
| 9.2 | Namaz vakti görseli | Dinamik vakit kartı | ⬜ |
| 9.3 | Dua paylaşımı | Dua detay sayfasından paylaşım | ⬜ |
| 9.4 | Quick Share butonları | "Paylaş" butonu her içeriğe | ⬜ |

### Faz 10: Animasyonlu/Video Çıktı (Gelecek - Opsiyonel)
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 10.1 | Lottie animasyonları | Animasyonlu sticker desteği | ⬜ |
| 10.2 | Video export | MP4/GIF çıktı (gelişmiş) | ⬜ |

---

## 🎨 UI/UX Tasarım Notları

### Yeni Kontrol Paneli Yapısı
```
┌─────────────────────────────────────┐
│  [X]           STÜDYO         [✓]  │  <- Header
├─────────────────────────────────────┤
│                                     │
│         [CANVAS ALANI]              │  <- Önizleme
│                                     │
├─────────────────────────────────────┤
│  Stil │ Boyut │ Yazı │ Renk │ Arka │  <- Tab Bar (kaydırılabilir)
├─────────────────────────────────────┤
│                                     │
│      [SEÇİLİ TAB İÇERİĞİ]          │  <- Dinamik içerik
│                                     │
├─────────────────────────────────────┤
│  [📥 İndir]          [📤 Paylaş]   │  <- Eylem butonları
└─────────────────────────────────────┘
```

### Tab Listesi (Yeni)
1. **Şablon** - Tüm şablonlar (grid)
2. **Boyut** - Platform seçimi
3. **Yazı** - Font + boyut + hizalama
4. **Renk** - Paletler + özel renk
5. **Arka Plan** - Galeri + yükleme
6. **Sticker** - Emoji + İslami stickerlar
7. **Watermark** - Logo özelleştirme
8. **Metin** - İçerik düzenleme

---

## 📦 Bağımlılıklar

### Mevcut (Zaten Var)
- `html2canvas` - Canvas export
- `framer-motion` - Animasyonlar

### Eklenmesi Gereken
- Yok (vanilla çözümlerle yapılacak)

---

## ✅ Doğrulama Kontrol Listesi

### Fonksiyonel Testler
- [ ] Tüm yeni şablonlar doğru render ediliyor
- [ ] Font değişikliği anında yansıyor
- [ ] Renk değişikliği tüm öğelere uygulanıyor
- [ ] Sticker drag & drop çalışıyor
- [ ] Arka plan galerisi lazy loading yapıyor
- [ ] Watermark konum ve boyutu kaydediliyor
- [ ] PNG export tüm boyutlarda çalışıyor
- [ ] Share API hala fonksiyonel

### Performans Testler
- [ ] 60 FPS animasyon performansı
- [ ] Canvas export < 3 saniye
- [ ] Lazy loading arka planlar

### Erişilebilirlik
- [ ] Tüm butonlar keyboard accessible
- [ ] Yeterli renk kontrastı
- [ ] Screen reader uyumluluğu

---

## 🚀 Uygulama Sırası

1. **Faz 1** - Altyapı (önce modüler yapı)
2. **Faz 2** - Yeni şablonlar (görsel etki)
3. **Faz 7** - Platform boyutları (kolay)
4. **Faz 3** - Yazı tipi seçimi
5. **Faz 4** - Renk paleti
6. **Faz 6** - Arka plan galerisi
7. **Faz 8** - Watermark
8. **Faz 5** - Sticker paneli (komplex)
9. **Faz 9** - İçerik entegrasyonu

---

## 📝 Notlar

- Video export (Faz 10) şimdilik kapsam dışı, gelecek versiyon için planlanabilir
- Sticker için SVG formatı tercih edilecek (ölçeklenebilirlik)
- Arka planlar için WebP formatı (boyut optimizasyonu)
- LocalStorage'da kullanıcı tercihleri (son kullanılan şablon, font, renk) kaydedilecek

---

**Plan Durumu:** ✅ TAMAMLANDI
**Sonraki Adım:** `/create` komutu ile uygulamaya geçilebilir
