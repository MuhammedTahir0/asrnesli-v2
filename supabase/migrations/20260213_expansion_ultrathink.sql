-- MEGA CONTENT EXPANSION MIGRATION (ULTRATHINK)
-- DATE: 2026-02-13
-- VERSION: 1.0

-- 1. STORIES (Dini Hikayeler)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    category_id UUID REFERENCES public.categories(id),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRAYERS (Dualar)
CREATE TABLE IF NOT EXISTS public.prayers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_tr TEXT NOT NULL,
    content_ar TEXT,
    phonetic TEXT,
    source TEXT,
    benefits TEXT, -- Faziletleri
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RELIGIOUS_INFO (Dini Bilgiler / Makaleler)
CREATE TABLE IF NOT EXISTS public.religious_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WISDOM_NOTES (Hikmethane / Özlü Sözler)
CREATE TABLE IF NOT EXISTS public.wisdom_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT,
    content TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PRAYER_REQUESTS (Dua Kardeşliği)
CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_count INTEGER DEFAULT 100,
    current_count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PRAYER_TIME_CONTENT (Vakitlere Özel Ayet/Hadis)
CREATE TABLE IF NOT EXISTS public.prayer_time_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_time TEXT NOT NULL, -- fajr, dhuhr, asr, maghrib, isha
    verse_id UUID REFERENCES public.verses(id),
    hadith_id UUID REFERENCES public.hadiths(id),
    wisdom_note_id UUID REFERENCES public.wisdom_notes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. QUIZ_QUESTIONS (Bilgi Yarışması)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- ["A", "B", "C", "D"]
    correct_option INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'easy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. DAILY_CHECKLISTS (Amel Defteri Görevleri)
CREATE TABLE IF NOT EXISTS public.daily_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL,
    points INTEGER DEFAULT 10,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. AUDIOS (Radyo / Podcast / Kıraat)
CREATE TABLE IF NOT EXISTS public.audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT,
    url TEXT NOT NULL,
    duration INTEGER,
    cover_url TEXT,
    type TEXT DEFAULT 'podcast', -- podcast, radio, quran
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- UPDATE daily_content table to support new relationships
ALTER TABLE public.daily_content 
ADD COLUMN IF NOT EXISTS story_id UUID REFERENCES public.stories(id),
ADD COLUMN IF NOT EXISTS prayer_id UUID REFERENCES public.prayers(id),
ADD COLUMN IF NOT EXISTS info_id UUID REFERENCES public.religious_info(id),
ADD COLUMN IF NOT EXISTS wisdom_id UUID REFERENCES public.wisdom_notes(id);

-- RLS POLICES
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.religious_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wisdom_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_time_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audios ENABLE ROW LEVEL SECURITY;

-- Select policies for all users
CREATE POLICY "Allow public select on all content" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.prayers FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.religious_info FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.wisdom_notes FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.prayer_requests FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.prayer_time_content FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.daily_checklists FOR SELECT USING (true);
CREATE POLICY "Allow public select on all content" ON public.audios FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.stories(category_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user ON public.prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_content_date ON public.daily_content(display_date);
