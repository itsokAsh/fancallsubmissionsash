-- Create enums
CREATE TYPE public.user_role AS ENUM ('fan', 'creator');
CREATE TYPE public.creator_status AS ENUM ('Live', 'Online', 'Busy', 'Offline');
CREATE TYPE public.call_type AS ENUM ('video', 'audio');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Table 1: profiles (all users from CSV)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  dob DATE,
  role user_role NOT NULL DEFAULT 'fan',
  state TEXT,
  city TEXT,
  wallet_balance_inr INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table 2: creators (creator-specific data)
CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  video_call_price_inr INTEGER NOT NULL DEFAULT 0,
  audio_call_price_inr INTEGER NOT NULL DEFAULT 0,
  status creator_status NOT NULL DEFAULT 'Offline',
  available_slots INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  bio TEXT,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table 3: categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT
);

-- Table 4: creator_categories (many-to-many)
CREATE TABLE public.creator_categories (
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (creator_id, category_id)
);

-- Table 5: user_categories (fan onboarding choices)
CREATE TABLE public.user_categories (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, category_id)
);

-- Table 6: favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (fan_profile_id, creator_id)
);

-- Table 7: bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  call_type call_type NOT NULL,
  dwell_percent INTEGER DEFAULT 0,
  status booking_status NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table 8: videos (for Phase 2 attribution)
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: readable by everyone (public data)
CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT USING (true);

-- Creators: readable by everyone (public profiles)
CREATE POLICY "Creators are publicly readable" ON public.creators
  FOR SELECT USING (true);

-- Creator categories: readable by everyone
CREATE POLICY "Creator categories are publicly readable" ON public.creator_categories
  FOR SELECT USING (true);

-- Profiles: readable by everyone (basic profile info is public)
CREATE POLICY "Profiles are publicly readable" ON public.profiles
  FOR SELECT USING (true);

-- Videos: readable by everyone
CREATE POLICY "Videos are publicly readable" ON public.videos
  FOR SELECT USING (true);

-- User categories: users can manage their own
CREATE POLICY "Users can view all user categories" ON public.user_categories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own categories" ON public.user_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own categories" ON public.user_categories
  FOR DELETE USING (true);

-- Favorites: users can manage their own
CREATE POLICY "Users can view all favorites" ON public.favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can insert favorites" ON public.favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete favorites" ON public.favorites
  FOR DELETE USING (true);

-- Bookings: users can manage their own
CREATE POLICY "Users can view all bookings" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- Seed categories
INSERT INTO public.categories (name, icon) VALUES
  ('Fitness', '💪'),
  ('Tech', '💻'),
  ('Gaming', '🎮'),
  ('Music', '🎵'),
  ('Finance', '💰'),
  ('Comedy', '😂'),
  ('Cooking', '🍳'),
  ('Fashion', '👗');