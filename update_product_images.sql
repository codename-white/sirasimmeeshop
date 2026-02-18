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
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/1.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wLzEud2VicCIsImlhdCI6MTc3MTM0NTgwNywiZXhwIjoxODAyODgxODA3fQ.y1sVJfmWY8BBxXCIvWin4r_3gWzQEVtfWNB0_ipuiHQ',
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/ddd.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wL2RkZC53ZWJwIiwiaWF0IjoxNzcxMzQ1NzYwLCJleHAiOjE4MDI4ODE3NjB9.FG2ee26VdSb-n39VG09Bmwe0Q92OCbB1fBqtqLzuaDE' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'สติกเกอร์ MITH #1';

UPDATE products 
SET images = ARRAY[
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/2.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wLzIud2VicCIsImlhdCI6MTc3MTM0NTc5MCwiZXhwIjoxODAyODgxNzkwfQ.hEcvDxpVaO_sFXcpQjBHK8rUCzC3g8KoCWWRnOWtAt8',
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/ddd.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wL2RkZC53ZWJwIiwiaWF0IjoxNzcxMzQ1NzYwLCJleHAiOjE4MDI4ODE3NjB9.FG2ee26VdSb-n39VG09Bmwe0Q92OCbB1fBqtqLzuaDE' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'สติกเกอร์ MITH #2';

UPDATE products 
SET images = ARRAY[
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/3.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wLzMud2VicCIsImlhdCI6MTc3MTM0NTY4NSwiZXhwIjoxODAyODgxNjg1fQ.kJvYY-IvE7mvGEJkYUNXFD0KY7RDU3gWe8NKJ94seyQ',
  'https://lsctinvlisgyasqgmivm.supabase.co/storage/v1/object/sign/shop/d039600d6ac2ab010bdc6fae236acf26.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOGE3NWJjNS0wNjdjLTRjM2MtYTNhOC0zZGI3OGY2YjNlYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaG9wL2QwMzk2MDBkNmFjMmFiMDEwYmRjNmZhZTIzNmFjZjI2LndlYnAiLCJpYXQiOjE3NzEzNDU2OTksImV4cCI6MTgwMjg4MTY5OX0.OMjrhDmH51dUr_bNBmMPWavRJMRhnc0-6N1OO33sm7k' -- สมมติว่ามีรูปที่ 2
]
WHERE name = 'ไอแก๊ป รุ่นที่ 1';
