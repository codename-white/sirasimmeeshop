-- 1. Create Products Table (Safe version)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  address TEXT,
  phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Using DO blocks to prevent 'already exists' errors)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public products are viewable by everyone') THEN
        CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own orders') THEN
        CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own orders') THEN
        CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- 7. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Insert Initial Data (Using ON CONFLICT to prevent duplicates if name is unique, 
-- or just truncate and refill for a clean state)
DELETE FROM products; -- ล้างข้อมูลเก่าเพื่อใส่ข้อมูลใหม่จากเว็บ
INSERT INTO products (name, description, price, image_url, category, stock)
VALUES 
('สติกเกอร์ MITH #1', 'สติกเกอร์ MITH รุ่นที่ 1 คุณภาพดี กันน้ำ', 109, 'https://shop.sirasimm.ee/cdn/shop/files/sticker1.jpg', 'Merch', 100),
('สติกเกอร์ MITH #2', 'สติกเกอร์ MITH รุ่นที่ 2 ดีไซน์ใหม่', 109, 'https://shop.sirasimm.ee/cdn/shop/files/sticker2.jpg', 'Merch', 100),
('ไอแก๊ป รุ่นที่ 1', 'ไอแก๊ป รุ่นที่ 1 ของสะสมสุด Limited', 349, 'https://shop.sirasimm.ee/cdn/shop/files/gapamulet.jpg', 'Merch', 50);
