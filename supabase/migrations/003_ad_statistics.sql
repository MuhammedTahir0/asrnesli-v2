-- Reklam İstatistikleri Takip Sistemi
-- Supabase SQL Editor'de çalıştırın

-- =========================================
-- 1. AD_EVENTS TABLOSU (Ham Veri)
-- =========================================
CREATE TABLE IF NOT EXISTS public.ad_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'reward', 'skip')),
  platform TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexler
CREATE INDEX IF NOT EXISTS ad_events_event_type_idx ON public.ad_events(event_type);
CREATE INDEX IF NOT EXISTS ad_events_created_at_idx ON public.ad_events(created_at DESC);

-- RLS
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

-- Admin her şeyi görebilir
DROP POLICY IF EXISTS "Admin can view all ad events" ON public.ad_events;
CREATE POLICY "Admin can view all ad events" ON public.ad_events
  FOR SELECT USING (public.is_admin());

-- Kullanıcılar sadece kendi verilerini ekleyebilir
DROP POLICY IF EXISTS "Users can insert own ad events" ON public.ad_events;
CREATE POLICY "Users can insert own ad events" ON public.ad_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- =========================================
-- 2. İSTATİSTİK RPC FONKSİYONU
-- =========================================
CREATE OR REPLACE FUNCTION public.get_ad_statistics(
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  stat_date DATE,
  impressions BIGINT,
  rewards BIGINT,
  skips BIGINT
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
    created_at::DATE as stat_date,
    COUNT(*) FILTER (WHERE event_type = 'impression') as impressions,
    COUNT(*) FILTER (WHERE event_type = 'reward') as rewards,
    COUNT(*) FILTER (WHERE event_type = 'skip') as skips
  FROM public.ad_events
  WHERE 
    (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date)
  GROUP BY created_at::DATE
  ORDER BY created_at::DATE DESC;
END;
$$;

-- İzin
GRANT EXECUTE ON FUNCTION public.get_ad_statistics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- =========================================
-- 3. OLAY TAKİP YARDIMCI FONKSİYONU
-- =========================================
CREATE OR REPLACE FUNCTION public.track_ad_event(
  p_event_type TEXT,
  p_platform TEXT DEFAULT 'web'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ad_events (user_id, event_type, platform)
  VALUES (auth.uid(), p_event_type, p_platform);
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_ad_event(TEXT, TEXT) TO authenticated;
