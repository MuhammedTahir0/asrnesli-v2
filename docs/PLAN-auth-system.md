# 📋 PLAN: AsrNesli Kimlik Doğrulama Sistemi

> **Oluşturulma Tarihi:** 2026-02-02
> **Durum:** 📝 PLANLANMIŞ
> **Öncelik:** ⭐⭐⭐⭐⭐ (Kritik)
> **Tahmini Süre:** 2-3 saat
> **Tasarım Stili:** İslami-Lüks (Koyu yeşil/altın, geometrik desenler, hat yazısı vurgusu)

---

## 🎯 Hedef Özeti

AsrNesli uygulaması için premium, İslami estetiğe sahip kimlik doğrulama sistemi. Supabase Auth + Google OAuth entegrasyonu ile güvenli ve kullanıcı dostu kayıt/giriş deneyimi.

---

## 📊 Gereksinimler

### Kullanıcı Profil Alanları
| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `full_name` | string | ✅ | Ad Soyad |
| `email` | string | ✅ | E-posta (unique) |
| `phone` | string | ✅ | Telefon numarası |
| `username` | string | ✅ | Kullanıcı adı (unique) |
| `avatar_url` | string | ❌ | Profil fotoğrafı URL |
| `created_at` | timestamp | auto | Kayıt tarihi |

### Sayfalar
1. **Kayıt Sayfası** (`/register`)
2. **Giriş Sayfası** (`/login`)
3. **Şifre Sıfırlama** (`/forgot-password`)
4. **E-posta Doğrulama** (`/verify-email`)
5. **Profil Düzenleme** (`/profile`)

### Özellikler
- ✅ E-posta/Şifre ile kayıt
- ✅ Google OAuth ile giriş
- ✅ Şifre sıfırlama (e-posta ile)
- ✅ E-posta doğrulama
- ✅ "Beni Hatırla" seçeneği
- ✅ Korumalı rotalar (auth guard)

---

## 🎨 Tasarım Konsepti: İslami-Lüks

### Renk Paleti
```css
--primary-green: #2D5A27      /* Ana yeşil */
--dark-green: #1a3a1a         /* Koyu arka plan */
--gold: #C5A059               /* Altın aksanlar */
--gold-light: #E8D5A3         /* Açık altın */
--cream: #FDFBF7              /* Krem beyaz */
--dark: #0f1a0f               /* En koyu ton */
```

### Görsel Elementler
- **Geometrik İslami desenler** (arka plan texture)
- **Hat yazısı** (Bismillah veya dekoratif)
- **Hilal ve yıldız** (subtle aksanlar)
- **Altın çerçeveler ve ayraçlar**
- **Yumuşak parıltı efektleri**

### Tipografi
- **Başlıklar:** Amiri (Arapça hat hissi)
- **Gövde:** Inter veya Poppins (okunabilirlik)

---

## 🏗️ Mimari Tasarım

```
src/
├── components/
│   └── auth/
│       ├── AuthLayout.jsx       # Ortak layout (desenli arka plan)
│       ├── LoginForm.jsx        # Giriş formu
│       ├── RegisterForm.jsx     # Kayıt formu
│       ├── ForgotPassword.jsx   # Şifre sıfırlama
│       ├── VerifyEmail.jsx      # E-posta doğrulama
│       ├── GoogleButton.jsx     # Google OAuth butonu
│       ├── AuthInput.jsx        # Özel input bileşeni
│       └── AuthGuard.jsx        # Korumalı rota wrapper
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── VerifyEmail.jsx
│   └── Profile.jsx
│
├── contexts/
│   └── AuthContext.jsx          # Auth state yönetimi
│
├── hooks/
│   └── useAuth.js               # Auth hook
│
└── services/
    └── authService.js           # Supabase auth işlemleri
```

---

## 📋 Görev Listesi

### Faz 1: Veritabanı Şeması (15 dk)
| # | Görev | Durum |
|---|-------|-------|
| 1.1 | Supabase'de `profiles` tablosu oluştur | ⬜ |
| 1.2 | RLS (Row Level Security) politikaları | ⬜ |
| 1.3 | Trigger: auth.users → profiles sync | ⬜ |

**SQL Şeması:**
```sql
-- profiles tablosu
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi profilini görebilir/düzenleyebilir
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Faz 2: Auth Servisi (20 dk)
| # | Görev | Durum |
|---|-------|-------|
| 2.1 | `authService.js` oluştur | ⬜ |
| 2.2 | signUp, signIn, signOut fonksiyonları | ⬜ |
| 2.3 | Google OAuth fonksiyonu | ⬜ |
| 2.4 | Şifre sıfırlama fonksiyonu | ⬜ |
| 2.5 | Profil CRUD fonksiyonları | ⬜ |

### Faz 3: Auth Context (20 dk)
| # | Görev | Durum |
|---|-------|-------|
| 3.1 | `AuthContext.jsx` oluştur | ⬜ |
| 3.2 | Session yönetimi | ⬜ |
| 3.3 | Loading state | ⬜ |
| 3.4 | `useAuth` hook | ⬜ |

### Faz 4: UI Bileşenleri (60 dk) - İslami-Lüks Tasarım
| # | Görev | Açıklama | Durum |
|---|-------|----------|-------|
| 4.1 | `AuthLayout.jsx` | Geometrik desenli arka plan, altın çerçeve | ⬜ |
| 4.2 | `AuthInput.jsx` | Altın border, focus efektleri | ⬜ |
| 4.3 | `GoogleButton.jsx` | Premium Google butonu | ⬜ |
| 4.4 | `LoginForm.jsx` | Giriş formu (e-posta + Google) | ⬜ |
| 4.5 | `RegisterForm.jsx` | Kayıt formu (tüm alanlar) | ⬜ |
| 4.6 | `ForgotPassword.jsx` | Şifre sıfırlama formu | ⬜ |
| 4.7 | `VerifyEmail.jsx` | E-posta doğrulama sayfası | ⬜ |

### Faz 5: Sayfalar (30 dk)
| # | Görev | Route | Durum |
|---|-------|-------|-------|
| 5.1 | Login sayfası | `/login` | ⬜ |
| 5.2 | Register sayfası | `/register` | ⬜ |
| 5.3 | ForgotPassword sayfası | `/forgot-password` | ⬜ |
| 5.4 | VerifyEmail sayfası | `/verify-email` | ⬜ |
| 5.5 | Profile sayfası | `/profile` | ⬜ |

### Faz 6: Auth Guard & Routing (20 dk)
| # | Görev | Durum |
|---|-------|-------|
| 6.1 | `AuthGuard.jsx` bileşeni | ⬜ |
| 6.2 | App.jsx route güncellemesi | ⬜ |
| 6.3 | Korumalı rotalar tanımlama | ⬜ |
| 6.4 | Redirect mantığı | ⬜ |

### Faz 7: Profil Düzenleme (20 dk)
| # | Görev | Durum |
|---|-------|-------|
| 7.1 | Profil görüntüleme | ⬜ |
| 7.2 | Profil düzenleme formu | ⬜ |
| 7.3 | Avatar yükleme (Supabase Storage) | ⬜ |
| 7.4 | Çıkış yap butonu | ⬜ |

---

## 🎨 UI/UX Tasarım Detayları

### Kayıt/Giriş Sayfası Layout
```
┌─────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════╗  │
│  ║                                           ║  │
│  ║     ☪ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم  ║  │
│  ║                                           ║  │
│  ║            🌙 ASR NESLİ 🌙              ║  │
│  ║                                           ║  │
│  ║   ┌─────────────────────────────────┐   ║  │
│  ║   │  E-posta                       │   ║  │
│  ║   └─────────────────────────────────┘   ║  │
│  ║   ┌─────────────────────────────────┐   ║  │
│  ║   │  Şifre                    👁   │   ║  │
│  ║   └─────────────────────────────────┘   ║  │
│  ║                                           ║  │
│  ║   [ ] Beni Hatırla    Şifremi Unuttum   ║  │
│  ║                                           ║  │
│  ║   ╔═══════════════════════════════════╗   ║  │
│  ║   ║         GİRİŞ YAP                 ║   ║  │
│  ║   ╚═══════════════════════════════════╝   ║  │
│  ║                                           ║  │
│  ║   ──────────── veya ────────────         ║  │
│  ║                                           ║  │
│  ║   ┌─────────────────────────────────┐   ║  │
│  ║   │  🔵 Google ile Giriş Yap       │   ║  │
│  ║   └─────────────────────────────────┘   ║  │
│  ║                                           ║  │
│  ║   Hesabın yok mu? Kayıt Ol              ║  │
│  ║                                           ║  │
│  ╚═══════════════════════════════════════════╝  │
│                                                 │
│  [Geometrik İslami desen arka plan]            │
└─────────────────────────────────────────────────┘
```

### Görsel Efektler
- **Arka Plan:** Koyu yeşil gradient + geometrik İslami desen overlay
- **Kart:** Glassmorphism efekti, altın border
- **Inputlar:** Altın focus ring, subtle glow
- **Butonlar:** Altın gradient, hover'da parlama
- **Animasyonlar:** Yumuşak fade-in, input focus animasyonları

---

## 📦 Bağımlılıklar

### Mevcut (Kullanılacak)
- `@supabase/supabase-js` - Auth & Database
- `react-router-dom` - Routing
- `framer-motion` - Animasyonlar

### Eklenecek
- Yok (vanilla çözümlerle yapılacak)

---

## ✅ Doğrulama Kontrol Listesi

### Fonksiyonel Testler
- [ ] E-posta/şifre ile kayıt çalışıyor
- [ ] E-posta/şifre ile giriş çalışıyor
- [ ] Google OAuth çalışıyor
- [ ] Şifre sıfırlama e-postası gönderiliyor
- [ ] E-posta doğrulama çalışıyor
- [ ] Profil kayıt ediliyor (profiles tablosu)
- [ ] Korumalı rotalara erişim engelleniyor
- [ ] Çıkış yap çalışıyor
- [ ] "Beni Hatırla" persist yapıyor

### UI/UX Testler
- [ ] Responsive tasarım (mobil/tablet/desktop)
- [ ] Loading state'ler mevcut
- [ ] Hata mesajları gösteriliyor
- [ ] Başarı mesajları gösteriliyor
- [ ] Form validasyonu çalışıyor
- [ ] İslami-Lüks tema tutarlı

---

## 🔐 Güvenlik Notları

1. **RLS Politikaları:** Kullanıcı sadece kendi verisine erişebilir
2. **Şifre Kuralları:** Min 8 karakter (Supabase varsayılan)
3. **Session Yönetimi:** Supabase otomatik yönetir
4. **CORS:** Supabase dashboard'dan yapılandırılmalı

---

## 🚀 Uygulama Sırası

1. **Faz 1** - Veritabanı şeması (temel)
2. **Faz 2** - Auth servisi
3. **Faz 3** - Auth context
4. **Faz 4** - UI bileşenleri (İslami-Lüks tasarım)
5. **Faz 5** - Sayfalar
6. **Faz 6** - Auth guard & routing
7. **Faz 7** - Profil düzenleme

---

## 📝 Supabase Kurulum Notları

### Google OAuth Aktifleştirme
1. Supabase Dashboard → Authentication → Providers
2. Google'ı etkinleştir
3. Google Cloud Console'dan OAuth credentials oluştur
4. Client ID ve Secret'i Supabase'e ekle
5. Redirect URL'i Google Console'a ekle

### Gerekli Environment Variables
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

**Plan Durumu:** ✅ TAMAMLANDI
**Sonraki Adım:** `/create` komutu ile uygulamaya geçilebilir
