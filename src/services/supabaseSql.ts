/**
 * Supabase PostgreSQL Schema with Row Level Security (RLS)
 * Meets Requirement F: "Implement Row Level Security (RLS) policies so customers can only access
 * their own orders and profiles, while authorized owners can manage store data."
 */

export const SUPABASE_SCHEMA_SQL = `-- BrewBean Coffee Co. Database Schema & RLS Policies

-- 1. Create User Roles Enum
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'OWNER');
CREATE TYPE order_status AS ENUM ('Placed', 'Preparing', 'Ready', 'Completed', 'Cancelled');

-- 2. Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  customer_type TEXT DEFAULT 'REGULAR',
  student_id TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies:
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Owners can view all profiles for customer management
CREATE POLICY "Owners can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN DEFAULT true,
  roast_level TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Menu Items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public can read menu items
CREATE POLICY "Anyone can browse active menu"
  ON public.menu_items FOR SELECT
  USING (true);

-- Only Owners can INSERT, UPDATE, DELETE menu items
CREATE POLICY "Owners can insert menu items"
  ON public.menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );

CREATE POLICY "Owners can update menu items"
  ON public.menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );

CREATE POLICY "Owners can delete menu items"
  ON public.menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_type TEXT DEFAULT 'REGULAR',
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  pickup_counter TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'Placed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customer can SELECT only their own orders
CREATE POLICY "Customers view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Customer can INSERT their own orders
CREATE POLICY "Customers create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Owner can SELECT all orders
CREATE POLICY "Owners view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );

-- Owner can UPDATE orders (e.g. status updates)
CREATE POLICY "Owners can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'OWNER'
    )
  );
`;
