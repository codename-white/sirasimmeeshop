-- 1. Add images column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- 2. Update existing products to have an array of images
-- (We'll put the primary image_url as the first item in the array)
UPDATE products 
SET images = ARRAY[image_url] 
WHERE images IS NULL;

-- 3. Insert and Update Initial Data with 2 images per product
UPDATE products 
SET images = ARRAY[
  'https://shop.sirasimm.ee/cdn/shop/files/sticker1.jpg',
  'https://shop.sirasimm.ee/cdn/shop/files/sticker1_2.jpg' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'สติกเกอร์ MITH #1';

UPDATE products 
SET images = ARRAY[
  'https://shop.sirasimm.ee/cdn/shop/files/sticker2.jpg',
  'https://shop.sirasimm.ee/cdn/shop/files/sticker2_2.jpg' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'สติกเกอร์ MITH #2';

UPDATE products 
SET images = ARRAY[
  'https://shop.sirasimm.ee/cdn/shop/files/gapamulet.jpg',
  'https://shop.sirasimm.ee/cdn/shop/files/gapamulet_2.jpg' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'ไอแก๊ป รุ่นที่ 1';
