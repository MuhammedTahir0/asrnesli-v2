---
description: Yapay Zeka Tester Uzmanı 
---

# Test Verisi Oluşturma Kural Seti
## Yapay Zeka Tester Uzmanı İçin

### **KURAL 1: Temel Prensip ve Zihniyet**
```
"Her test verisi parçası bir hikaye anlatmalı, 
sadece bir değer değil, bir senaryoyu temsil etmelidir."
```

### **KURAL 2: Kapsamlı Tarama Yaklaşımı**

**2.1 Sistem Analiz Katmanları:**
```
- Giriş: API endpoint'leri, formlar, kullanıcı etkileşim noktaları
- İş Mantığı: Karar noktaları, durum makineleri, iş kuralları
- Veri Katmanı: Veritabanı şemaları, ilişkiler, constraint'ler
- Arayüz: UI bileşenleri, validasyonlar, kullanıcı akışları
```

### **KURAL 3: Test Verisi Kategorizasyon Matrisi**

**3.1 Zorunlu Veri Tipleri:**

| Kategori | Oran | Açıklama |
|----------|------|----------|
| **Normal/Happy Path** | %20 | Beklenen, geçerli senaryolar |
| **Sınır Değerleri** | %25 | Minimum, maksimum, eşik değerler |
| **Geçersiz/Exception** | %30 | Hata tetikleyen veriler |
| **Edge Case** | %15 | Nadir, özel durumlar |
| **Güvenlik** | %10 | SQLi, XSS, injection verileri |

### **KURAL 4: Veri Üretme Stratejileri**

**4.1 Sınır Değer Analizi (BVA):**
```python
# Her alan için üretilecek veri seti:
- Alt sınır - 1
- Alt sınır
- Alt sınır + 1
- Normal değer
- Üst sınır - 1
- Üst sınır
- Üst sınır + 1
- Boş/null
- Whitespace çeşitleri
```

**4.2 Eşdeğer Sınıf Bölümleme:**
```
Geçerli Sınıf: [a-z], [A-Z], [0-9], belirtilen özel karakterler
Geçersiz Sınıf: Unicode, emoji, kontrol karakterleri, SQL özel karakterleri
```

### **KURAL 5: İlişkisel Veri Üretme Kuralları**

**5.1 Tutarlılık Kuralı:**
```
"Veritabanındaki her foreign key ilişkisi için,
test verisinde hem geçerli hem geçersiz referanslar oluştur."
```

**5.2 Durum Uyumu:**
```
"Sistemin her durumu için (örn: 'Aktif', 'Pasif', 'Beklemede'),
tüm geçiş senaryolarını kapsayan veri setleri oluştur."
```

### **KURAL 6: Karakter Seti ve Encoding Matrisi**

```
MUTLAKA dahil edilecek karakterler:
- Unicode: Emoji (😀), Çince karakter (中), Arapça (ء)
- Özel: " ' ; -- /* */ = < > & | 
- Whitespace: \t, \n, \r, \u200B (zero-width space)
- UTF-8 sınır: U+10FFFF
```

### **KURAL 7: Güvenlik Test Verisi Şablonları**

**7.1 Injection Pattern'leri:**
```
- SQL: ' OR '1'='1'; DROP TABLE users; --
- XSS: <script>alert(1)</script>
- Command: ; ls -la; $(whoami)
- Path Traversal: ../../../etc/passwd
```

**7.2 Yetki Test Verileri:**
```
- Normal kullanıcı → Admin fonksiyonlarına erişim
- Expired token ile işlem
- Diğer kullanıcıların ID'leri ile istek
```

### **KURAL 8: Performans Test Verisi Kuralları**

**8.1 Yük Testi Verileri:**
```
- Büyük dosya upload: 1MB, 10MB, 100MB, >max_limit
- Uzun stringler: 255, 1000, 10000 karakter
- Çoklu ilişkili kayıtlar: 1000 child kayıtlı parent
```

### **KURAL 9: Veri Yaşam Döngüsü Senaryoları**

**9.1 Zaman Bazlı Veriler:**
```
- Geçmiş tarih: 1900-01-01
- Gelecek tarih: 2100-12-31
- Timezone farklılıkları: UTC, +14:00, -12:00
- DST geçişleri
```

### **KURAL 10: Hata Senaryo Kataloğu**

**10.1 Sistem Hataları:**
```
- Concurrency: Aynı veriye paralel update
- Transaction rollback senaryoları
- Deadlock üretecek veri dizileri
```

### **KURAL 11: Test Verisi Kalite Kontrol Checklist**

```
[ ] Veri her kategoriyi kapsıyor mu?
[ ] İlişkisel bütünlük sağlanıyor mu?
[ ] Gerçek hayat senaryolarını temsil ediyor mu?
[ ] Otomasyona uygun formatta mı?
[ ] Temizlenebilir ve tekrar üretilebilir mi?
[ ] Regülasyonlara uygun mu? (GDPR, PII)
[ ] Performansı ölçmeye uygun mu?
```

### **KURAL 12: Meta Veri ve Dokümantasyon**

```
Her test verisi seti için:
- Üretim tarihi ve versiyon
- Kapsanan senaryolar listesi
- Beklenen sonuçlar
- Bilinen sınırlamalar
- Bağımlılıklar
```

### **KURAL 13: Otomasyon Entegrasyonu**

```
Test verisi formatı:
{
  "test_data_id": "unique_hash",
  "category": "boundary|security|performance",
  "description": "İngilizce ve Türkçe açıklama",
  "data": {...},
  "expected_result": "success|error_code",
  "tags": ["api_v2", "user_registration", "negative"],
  "priority": "P0-P3"
}
```

### **KURAL 14: Regression ve Bakım**

```
- Her sprintte test verisi revizyonu
- Kullanılmayan verilerin arşivlenmesi
- Yeni feature'lar için genişletme planı
- Production'daki değişikliklerin mirror'u
```

### **KURAL 15: Etik ve Güvenlik**

```
- Production verisi KULLANILMAYACAK
- Gerçek kişi bilgisi içermeyecek
- Test ortamında izole kalacak
- Otomatik temizleme script'leri olacak
```

---

**Uygulama Notu:** Bu kurallar çerçevesinde, her test senaryosu için minimum 5 farklı veri seti oluşturulmalı ve her biri hem pozitif hem negatif akışlarda test edilmelidir. Test verisi, testin yarısından fazlasını oluşturur; bu nedenle veri kalitesi doğrudan test kalitesini belirler.