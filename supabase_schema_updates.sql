-- Supabase Schema Updates for Admin Content Editor

-- Site Categories table
CREATE TABLE IF NOT EXISTS public.site_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    name_en text,
    name_ar text,
    name_ku text,
    icon text,
    image_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.site_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.site_categories FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON public.site_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Features table
CREATE TABLE IF NOT EXISTS public.features (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en text,
    title_ar text,
    title_ku text,
    description_en text,
    description_ar text,
    description_ku text,
    icon text,
    image_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.features FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON public.features FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ensure profiles table has role column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- Update specific admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'mahdialmuntadhar1@gmail.com';

-- Site Settings for miscellaneous text
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value_en TEXT,
  value_ar TEXT,
  value_ku TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin write site_settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert some initial settings
INSERT INTO public.site_settings (key, value_en, value_ar, value_ku)
VALUES 
  ('features_title', 'Why Shaku Maku?', 'لماذا شكو ماكو؟', 'بۆچی شکو ماکو؟'),
  ('features_subtitle', 'The best way to explore Iraq', 'أفضل طريقة لاستكشاف العراق', 'باشترین ڕێگە بۆ گەڕان لە عێراق'),
  ('directory_title', 'Business Directory', 'دليل الأعمال', 'دليل الأعمال'),
  ('directory_subtitle', 'Discover the best local services', 'استكشف أفضل الخدمات في منطقتك', 'Discover the best local services'),
  ('feed_title', 'Shaku Maku Community', 'شكو ماكو', 'شکو ماکو'),
  ('feed_subtitle', 'Latest events & offers', 'أحدث الفعاليات والعروض', 'Latest events & offers')
ON CONFLICT (key) DO NOTHING;
