-- AsrNesli Profiles Tablosu
-- Supabase SQL Editor'de çalıştırın

-- 1. Profiles tablosu oluştur
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS (Row Level Security) aktifleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Politikaları
-- Kullanıcı sadece kendi profilini görebilir
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Kullanıcı kendi profilini güncelleyebilir
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Kullanıcı kendi profilini oluşturabilir
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Yeni kullanıcı kaydında otomatik profil oluşturma (Google OAuth için)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Anonim'),
    COALESCE(NEW.raw_user_meta_data->>'username', LOWER(REPLACE(NEW.email, '@', '_'))),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users tablosuna yeni kayıt eklendiğinde çalışır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Avatars bucket oluştur (Storage)
-- NOT: Bu SQL'i çalıştırdıktan sonra Supabase Dashboard > Storage bölümünden
-- "avatars" adında bir bucket oluşturun ve Public olarak ayarlayın.

-- 7. Index'ler
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Tamamlandı!
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın.
