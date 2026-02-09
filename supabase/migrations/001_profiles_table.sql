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
  tokens INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varolan tablolar için tokens alanını ekle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tokens INTEGER NOT NULL DEFAULT 5;

-- 2. RLS (Row Level Security) aktifleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Politikaları
-- Kullanıcı sadece kendi profilini görebilir
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Kullanıcı kendi profilini güncelleyebilir
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND tokens = (SELECT tokens FROM public.profiles WHERE id = auth.uid())
  );

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
  INSERT INTO public.profiles (id, full_name, username, email, tokens)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Anonim'),
    COALESCE(NEW.raw_user_meta_data->>'username', LOWER(REPLACE(NEW.email, '@', '_'))),
    NEW.email,
    5
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

-- 8. Token RPC Fonksiyonları (güvenli ve atomik)
CREATE OR REPLACE FUNCTION public.consume_token()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tokens INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET tokens = tokens - 1
  WHERE id = auth.uid() AND tokens > 0
  RETURNING tokens INTO new_tokens;

  IF new_tokens IS NULL THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  RETURN new_tokens;
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_token(amount INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tokens INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET tokens = tokens + GREATEST(amount, 0)
  WHERE id = auth.uid()
  RETURNING tokens INTO new_tokens;

  RETURN new_tokens;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_token() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_token(INTEGER) TO authenticated;

-- Tamamlandı!
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın.
