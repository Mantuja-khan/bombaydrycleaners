-- Add is_admin to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create pricing categories table
CREATE TABLE IF NOT EXISTS public.pricing_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pricing items table
CREATE TABLE IF NOT EXISTS public.pricing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.pricing_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  total_items INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  delivery_charge INTEGER NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_option TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for pricing_categories
CREATE POLICY "Pricing categories are viewable by everyone" ON public.pricing_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing categories" ON public.pricing_categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update pricing categories" ON public.pricing_categories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can delete pricing categories" ON public.pricing_categories FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Policies for pricing_items
CREATE POLICY "Pricing items are viewable by everyone" ON public.pricing_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing items" ON public.pricing_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update pricing items" ON public.pricing_items FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can delete pricing items" ON public.pricing_items FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true));

-- Seed initial data
INSERT INTO public.pricing_categories (id, name, icon, sort_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'Daily Wear', '👕', 1),
('22222222-2222-2222-2222-222222222222', 'Traditional / Ethnic', '👗', 2),
('33333333-3333-3333-3333-333333333333', 'Formal Wear', '👔', 3),
('44444444-4444-4444-4444-444444444444', 'Home Items', '🛏️', 4),
('55555555-5555-5555-5555-555555555555', 'Accessories / Others', '👟', 5)
ON CONFLICT DO NOTHING;

INSERT INTO public.pricing_items (category_id, name, base_price) VALUES
('11111111-1111-1111-1111-111111111111', 'Shirt', 30),
('11111111-1111-1111-1111-111111111111', 'T-shirt', 25),
('11111111-1111-1111-1111-111111111111', 'Jeans', 40),
('11111111-1111-1111-1111-111111111111', 'Pants', 35),
('11111111-1111-1111-1111-111111111111', 'Shorts', 20),
('11111111-1111-1111-1111-111111111111', 'Kurta', 35),

('22222222-2222-2222-2222-222222222222', 'Saree', 80),
('22222222-2222-2222-2222-222222222222', 'Lehenga', 250),
('22222222-2222-2222-2222-222222222222', 'Suit / Salwar Kameez', 100),
('22222222-2222-2222-2222-222222222222', 'Sherwani', 200),
('22222222-2222-2222-2222-222222222222', 'Dupatta', 40),

('33333333-3333-3333-3333-333333333333', 'Blazer', 120),
('33333333-3333-3333-3333-333333333333', 'Coat', 150),
('33333333-3333-3333-3333-333333333333', 'Tie', 30),
('33333333-3333-3333-3333-333333333333', 'Formal Shirt', 40),
('33333333-3333-3333-3333-333333333333', 'Trousers', 45),

('44444444-4444-4444-4444-444444444444', 'Bedsheet', 60),
('44444444-4444-4444-4444-444444444444', 'Blanket', 150),
('44444444-4444-4444-4444-444444444444', 'Pillow Cover', 25),
('44444444-4444-4444-4444-444444444444', 'Curtains', 100),
('44444444-4444-4444-4444-444444444444', 'Sofa Cover', 180),

('55555555-5555-5555-5555-555555555555', 'Shoes Cleaning', 100),
('55555555-5555-5555-5555-555555555555', 'Bags', 120),
('55555555-5555-5555-5555-555555555555', 'Jackets', 100),
('55555555-5555-5555-5555-555555555555', 'Woolen Clothes', 80);
