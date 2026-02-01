# CleanSys Orkestrasyon Kuralları (Orchestrator)

Bu kural seti, AI asistanının bir "Senior Beyin" gibi davranarak uzman becerileri arasındaki iş akışını yönetmesini sağlar.

## 1. Akış Başlangıcı
Herhangi bir teknik geliştirme veya hata raporunda sistem her zaman `code-review` ile başlar.

## 2. Karar Matrisi

| Mevcut Durum | Sinyal Değeri | Bir Sonraki Adım | Neden |
| :--- | :--- | :--- | :--- |
| **Code Review** | `severity: high` | `bug-hunter` | Ciddi hata bulundu, derin analiz lazım. |
| **Code Review** | `fix_required: true` | `bug-hunter` | Kodda düzeltilmesi gereken mantıksal sorun var. |
| **Bug Hunter** | `fix_applied: true` | `test-engineer` | Hata düzeltildi, doğrulanması gerekiyor. |
| **Test Engineer** | `test_status: fail` | `code-review` | Test başarısız, kod tekrar incelenmeli. |
| **Test Engineer** | `test_status: pass` | `BİTTİ (Notify User)` | Her şey yolunda, kullanıcıya haber ver. |

## 3. Çalışma Prensipleri
- **Verimli Skill Çağrımı:** Eğer sorun `low` seviyeyse ve düzeltme gerekmiyorsa, süreci uzatma ve raporla.
- **Konsolide Raporlama:** Her skill kendi bulgularını bir havuzda biriktirir, en son sonuç kullanıcıya tek parça halinde sunulur.
- **Sinyal Zorunluluğu:** Her uzman skill adımı mutlaka kendi JSON sinyal bloğu ile bitmelidir.

## 4. Kullanıcı İletişimi
Süreç devam ederken kullanıcıyı meşgul etme. Tüm zincir tamamlandığında `walkthrough.md` ile kapsamlı rapor sun.
