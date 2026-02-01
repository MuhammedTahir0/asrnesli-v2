---
description: Kapsamlı Hata Yönetimi Stratejisi ve Uygulama Kuralı
---

1) Hata Yönetimi Ana Kuralı: BSKÖ Döngüsü

BSKÖ = Belirtiyi sabitle → Sınıflandır → Kök nedeni bul → Önle (tekrarı kapat)

A. Belirtiyi sabitle (Reproduce + Snapshot)

Tekrarlanabilir senaryo yaz: adımlar, kullanıcı rolü, ortam (prod/stage/dev), tarih/saat, browser/device, request payload/headers.

Kanıt topla:

Frontend: console log, network tab (request/response), UI state snapshot (store, route, feature flags).

Backend: request id/trace id, server log, DB query log, queue/job log.

Tek cümlelik hata tanımı: “X ekranında Y aksiyonunda Z oluyor (beklenen: …)”.

B. Sınıflandır (Ağaç gibi değil, etiket gibi)

Aynı hataya birden fazla etiket koyabilirsin.

Frontend sınıfları

UI/Render (component crash, hydration, layout)

State/Flow (state yarışları, stale state, route guard)

Network/API (timeout, 4xx/5xx, CORS)

Data/Validation (type mismatch, parse, null/undefined)

Performance (slow render, memory leak)

Security (XSS, auth token sızıntısı, CSP)

Compatibility (browser/device)

Backend sınıfları

API Contract (schema uyuşmazlığı, versiyon)

Auth/Permission (401/403, RBAC/ABAC)

Business Logic (kural ihlali, edge-case)

Data Layer (DB constraint, migration, N+1, deadlock)

Concurrency/Consistency (race condition, idempotency)

Integration (3rd party, webhook, queue)

Infra/Config (env, secrets, timeout, DNS)

Security (injection, SSRF, rate limit)

C. Kök nedeni bul (5 Why + “nerede kırılıyor?”)

En yakın kırılma noktasını bul: stack trace’in ilk “bizim kod” satırı, failing query, failing validation.

Kontrat kontrolü: input→output şeması, nullable alanlar, enum’lar, tarih/saat formatları.

Sistemik soru: “Bu hata hangi koşulda ortaya çıkar ve neden guardrail yok?”

D. Önle (Sadece fix değil, guardrail)

Her fix yanında en az 1 önlem ekle:

Test (unit/integration/e2e)

Validation (schema, DTO)

Observability (log/metric/trace + alert)

Lint/Type check

Rate limit / circuit breaker

Feature flag / rollout planı

Dokümantasyon / runbook

2) Hata Türüne Göre Sistematik Çözüm Rehberi
1) API/Network Hataları (4xx/5xx, timeout)

Belirti: UI’da “failed to fetch”, backend log’da 500, network’te uzun bekleme.
Çözüm:

Frontend: retry (backoff), timeout, cancel (abort controller), kullanıcıya anlamlı mesaj.

Backend: endpoint için idempotency (özellikle POST), rate limit, bulkhead.

İkisi: contract test + OpenAPI/JSON schema doğrulama.

Önleme:

“Her request’e trace-id” + 4xx/5xx dağılımına alarm.

Zorunlu alanlar için request/response schema validation.

2) Veri/Şema Uyuşmazlığı (type mismatch, null, parse)

Belirti: “Cannot read property of undefined”, “invalid date”, yanlış para birimi.
Çözüm:

Frontend: runtime schema parse (örn. zod benzeri), null stratejisi (UI fallback).

Backend: DTO validation, DB constraint, migration düzeltmesi.

Ortak: tek kaynak şema (shared types veya OpenAPI codegen).

Önleme:

“Strict mode + type check” + zorunlu alanlar için test fixture’ları.

3) Auth/Yetki Hataları (401/403)

Belirti: Bazı kullanıcılarda çalışıyor, bazılarında çalışmıyor.
Çözüm:

Token expiry/refresh akışını netleştir.

Backend: RBAC/ABAC kontrolünü tek katmanda topla (middleware/policy).

Frontend: route guard + “login’a yönlendir” + “yetkin yok” sayfası.

Önleme:

Permission matrix testi (rol × endpoint × aksiyon).

Audit log (kim neye erişti/denedi).

4) İş Kuralı / Edge-case Hataları

Belirti: “Bazen” bozuluyor, belirli verilerde patlıyor.
Çözüm:

Kuralı kodda tek yerde topla (domain service).

“Illegal state” durumlarını erken yakala (guard clause).

Kullanıcıya net hata (örn. “stok yetersiz”).

Önleme:

Kritik kurallara property-based test veya kapsamlı senaryo testleri.

Ürün kural dokümanı + test case’lerle eşleştirme.

5) Concurrency / Race Condition / Consistency

Belirti: Çift kayıt, kaybolan güncelleme, aynı anda iki işlem.
Çözüm:

Backend: transaction, unique constraint, optimistic/pessimistic lock.

API: idempotency key, “exactly-once” beklentisini tasarla.

Frontend: çift tıklamayı engelle, istekleri seri hale getir.

Önleme:

Load/soak test + aynı resource üzerinde paralel test.

DB seviyesinde constraint’ler (kod yerine veri gerçeği).

6) Performans / Kaynak Hataları

Belirti: yavaş ekran, CPU spike, memory leak, DB yavaş.
Çözüm:

FE: render profili, memoization, sanallaştırma, chunk splitting.

BE: query index, N+1 fix, cache, queue offload.

Infra: timeout’ları bilinçli ayarla.

Önleme:

Performans bütçesi (örn. TTFB/INP), threshold aşımlarına alarm.

7) Entegrasyon / 3rd Party Hataları

Belirti: webhook kaçırma, dış servis 500.
Çözüm:

Circuit breaker, retry + jitter, fallback.

Dead-letter queue, replay mekanizması.

İmzalı webhook doğrulama.

Önleme:

“Degrade mode” tasarımı (servis yoksa temel akış çalışsın).

3) Uçtan Uca Hata Yönetimi Standardı (Frontend + Backend)
A. Hata Kimliği ve İz Sürme

Her request: correlation/trace id üret, FE loglarına ve BE loglarına taşı.

FE: “error boundary + global handler” ile yakala, kritiklerde raporla.

BE: structured log (JSON), stack trace + request meta.

B. Tek Tip Hata Sözleşmesi

Backend’in her hatası şu biçimde dönsün:

code (makine okunur, örn. PAYMENT_DECLINED)

message (kullanıcı-dostu veya geliştirici-dostu)

details (field errors, validation)

traceId

Frontend: code’a göre UI davranışı (toast, form error, redirect).

C. Hata Şiddeti ve SLA

P0: data kaybı / güvenlik / ödeme — anında.

P1: ana akış bozuk — hızlı.

P2: kısmi bozukluk — planlı.

P3: kozmetik — backlog.

D. “Fix tamam” kriteri (Done Definition)

Bir hata kapanırken:

Reproduce edildi mi?

Kök neden yazıldı mı?

Fix + test eklendi mi?

Log/metric/alert iyileştirildi mi?

Regression engeli kondu mu?

4) Hata Önleme: Guardrail Paketi

CI’da zorunlu: type check, lint, unit + integration test, migration check.

Contract: OpenAPI + consumer-driven test.

Release: feature flag + kademeli rollout + hızlı rollback.

Observability: dashboard (4xx/5xx, latency, error rate), alert (eşik + anomali).

Postmortem kültürü: suçlama yok; “hangi kontrol eksikti?” odaklı.