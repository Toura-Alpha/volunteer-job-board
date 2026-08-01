
-- 1. TABLES SETUP


-- Create Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  organization TEXT,
  type TEXT DEFAULT 'job',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Profiles Table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'applicant',
  location TEXT,
  phone TEXT,
  bio TEXT,
  admin_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure email column exists if table was pre-existing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Backfill existing profile emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;


-- 2. AUTOMATIC EMAIL SYNC TRIGGER

-- Create automatic sync trigger function for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'applicant')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();


-- 3. ROW LEVEL SECURITY (RLS) POLICIES


-- Enable Row Level Security on both tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Listings RLS Policies

-- Allow anyone (public/applicants/admins) to view listings
CREATE POLICY "Allow public read access on listings" 
ON public.listings FOR SELECT 
USING (true);

-- Allow only users with the 'admin' role to insert, update, or delete listings
CREATE POLICY "Allow admin full access on listings" 
ON public.listings FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


-- Profiles RLS Policies


-- Allow users to view profiles (needed for the admin user management screen)
CREATE POLICY "Allow read access on profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to insert their own profile during signup
CREATE POLICY "Allow system insert on profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile, or admins to update any profile
CREATE POLICY "Allow users to update own profile or admin to manage" 
ON public.profiles FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

