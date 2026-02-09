-- Admin Token Yönetimi ve İşlem Geçmişi
-- Supabase SQL Editor'de çalıştırın

-- =========================================
-- 0. TABLO GÜNCELLEMELERİ
-- =========================================

-- Profiles tablosunda created_at sütunu eksikse ekle
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- =========================================
-- 1. TOKEN TRANSACTIONS TABLOSU
-- =========================================
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('grant', 'consume', 'admin_grant', 'admin_deduct')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Indexler
CREATE INDEX IF NOT EXISTS token_transactions_user_id_idx ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS token_transactions_created_at_idx ON public.token_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS token_transactions_action_type_idx ON public.token_transactions(action_type);

-- =========================================
-- 2. RLS POLİTİKALARI
-- =========================================
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- Admin e-posta kontrolü için yardımcı fonksiyon
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email = 'tahircan.kozan@hotmail.com'
  );
END;
$$;

-- Admin tüm log kayıtlarını görebilir
DROP POLICY IF EXISTS "Admin can view all token transactions" ON public.token_transactions;
CREATE POLICY "Admin can view all token transactions" ON public.token_transactions
  FOR SELECT USING (public.is_admin());

-- Kullanıcılar kendi log kayıtlarını görebilir
DROP POLICY IF EXISTS "Users can view own token transactions" ON public.token_transactions;
CREATE POLICY "Users can view own token transactions" ON public.token_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Sadece RPC fonksiyonları insert yapabilir (SECURITY DEFINER ile)
DROP POLICY IF EXISTS "Only system can insert token transactions" ON public.token_transactions;
CREATE POLICY "Only system can insert token transactions" ON public.token_transactions
  FOR INSERT WITH CHECK (FALSE);

-- =========================================
-- 3. ADMIN RPC FONKSİYONLARI
-- =========================================

-- 3.1 Admin: Kullanıcı listesi ve token bakiyeleri
CREATE OR REPLACE FUNCTION public.admin_list_users_tokens()
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  email TEXT,
  username TEXT,
  tokens INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin kontrolü
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.full_name,
    p.email,
    p.username,
    p.tokens,
    p.created_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 3.2 Admin: Token ekle/çıkar
CREATE OR REPLACE FUNCTION public.admin_adjust_token(
  target_user_id UUID,
  adjust_amount INTEGER,
  adjust_reason TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tokens INTEGER;
  action TEXT;
BEGIN
  -- Admin kontrolü
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Miktar 0 olamaz
  IF adjust_amount = 0 THEN
    RAISE EXCEPTION 'Amount cannot be zero';
  END IF;

  -- İşlem türü
  action := CASE WHEN adjust_amount > 0 THEN 'admin_grant' ELSE 'admin_deduct' END;

  -- Token bakiyesini güncelle (negatife düşmesine izin verme)
  UPDATE public.profiles
  SET tokens = GREATEST(tokens + adjust_amount, 0)
  WHERE id = target_user_id
  RETURNING tokens INTO new_tokens;

  IF new_tokens IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Log kaydı oluştur
  INSERT INTO public.token_transactions (user_id, amount, balance_after, action_type, reason, created_by)
  VALUES (target_user_id, adjust_amount, new_tokens, action, adjust_reason, auth.uid());

  RETURN new_tokens;
END;
$$;

-- 3.3 Admin: Token işlem geçmişi
CREATE OR REPLACE FUNCTION public.admin_list_token_logs(
  target_user_id UUID DEFAULT NULL,
  start_date TIMESTAMPTZ DEFAULT NULL,
  end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  amount INTEGER,
  balance_after INTEGER,
  action_type TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ,
  admin_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin kontrolü
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    t.id,
    t.user_id,
    p.email as user_email,
    p.full_name as user_name,
    t.amount,
    t.balance_after,
    t.action_type,
    t.reason,
    t.created_at,
    admin.email as admin_email
  FROM public.token_transactions t
  LEFT JOIN public.profiles p ON t.user_id = p.id
  LEFT JOIN public.profiles admin ON t.created_by = admin.id
  WHERE 
    (target_user_id IS NULL OR t.user_id = target_user_id)
    AND (start_date IS NULL OR t.created_at >= start_date)
    AND (end_date IS NULL OR t.created_at <= end_date)
  ORDER BY t.created_at DESC
  LIMIT 100;
END;
$$;

-- =========================================
-- 4. İZİNLER
-- =========================================
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_users_tokens() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_adjust_token(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_token_logs(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- =========================================
-- 5. MEVCUT RPC'LERİ LOG İLE GÜNCELLE
-- =========================================

-- consume_token fonksiyonunu log ile güncelle
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

  -- Log kaydı
  INSERT INTO public.token_transactions (user_id, amount, balance_after, action_type, created_by)
  VALUES (auth.uid(), -1, new_tokens, 'consume', auth.uid());

  RETURN new_tokens;
END;
$$;

-- grant_token fonksiyonunu log ile güncelle
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

  -- Log kaydı
  INSERT INTO public.token_transactions (user_id, amount, balance_after, action_type, created_by)
  VALUES (auth.uid(), GREATEST(amount, 0), new_tokens, 'grant', auth.uid());

  RETURN new_tokens;
END;
$$;

-- Tamamlandı!
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın.
