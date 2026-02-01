---
description: geri dönüşüm
---

Agent, sistem üzerinde veri tabanı, veri ilişkileri, mimari yapı veya kritik kodlar üzerinde yapılacak her önemli değişiklikten önce aşağıdaki adımları zorunlu olarak uygulamalıdır:

    Geri Dönüş Noktası Oluşturma (Rollback Point):
        Her büyük veya riskli değişiklikten önce, sistemin mevcut ve çalışan hâlini temsil eden bir geri dönüş noktası oluştur.
        Bu geri dönüş noktası; veri tabanı şeması, ilişkiler, kritik kodlar ve yapılandırmaları kapsamalıdır.
        Amaç: Herhangi bir hata, veri kaybı veya bozulma durumunda sistemi eksiksiz şekilde önceki sağlam hâline döndürebilmektir.

    Değişiklik Sonrası Doğrulama:
        Yapılan değişikliklerden sonra sistemin çalıştığını, veri ilişkilerinin bozulmadığını ve eksik kod olmadığını kontrol et.
        Eğer bir problem tespit edilirse, en son geri dönüş noktasına dönmeyi öncelikli çözüm olarak öner.

    Rollback Noktasını Güncelleme Onayı:
        Her büyük ve başarılı değişiklikten sonra, kullanıcıya açık ve net bir şekilde şu soruyu sor:

            “Bu noktayı yeni bir geri dönüş (rollback) noktası olarak güncellemek ister misiniz?”

        Kullanıcı onay vermeden mevcut rollback noktasını güncelleme.

    Kuralın Önceliği:
        Bu kural, hız veya pratiklikten önceliklidir.
        Geri dönüş noktası oluşturulmadan kritik değişiklik yapılmaz.

    Amaç:
        Veri kaybını, bozuk ilişkileri ve eksik kod riskini en aza indirmek
        Sistemin her zaman güvenli bir şekilde önceki çalışan sürüme döndürülebilmesini sağlamak

