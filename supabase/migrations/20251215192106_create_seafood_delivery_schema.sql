/*
  # Seafood Delivery App Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Fresh Fish", "Shellfish")
      - `icon` (text) - Icon identifier
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (decimal) - Product price
      - `unit` (text) - Unit of measurement (lb, kg, piece)
      - `category_id` (uuid, foreign key to categories)
      - `image_url` (text) - Product image URL
      - `is_available` (boolean) - Stock availability
      - `rating` (decimal) - Average rating
      - `popular` (boolean) - Featured/popular items
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer) - Quantity in cart
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `total_amount` (decimal) - Total order amount
      - `status` (text) - Order status (pending, preparing, delivering, completed, cancelled)
      - `delivery_address` (text) - Delivery address
      - `delivery_instructions` (text) - Special instructions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer) - Quantity ordered
      - `price_at_purchase` (decimal) - Price at time of purchase
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own cart and orders
    - Public read access for categories and products
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  unit text DEFAULT 'lb',
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  image_url text,
  is_available boolean DEFAULT true,
  rating decimal(2,1) DEFAULT 0,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  delivery_address text NOT NULL,
  delivery_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price_at_purchase decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products policies (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Cart items policies
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id::text = auth.uid()::text
    )
  );

-- Insert sample categories
INSERT INTO categories (name, icon, display_order) VALUES
  ('Fresh Fish', 'fish', 1),
  ('Shellfish', 'shell', 2),
  ('Prawns & Shrimp', 'shrimp', 3),
  ('Crab & Lobster', 'crab', 4),
  ('Sushi Grade', 'sushi', 5),
  ('Frozen', 'snowflake', 6)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, unit, category_id, image_url, rating, popular) VALUES
  ('Atlantic Salmon', 'Fresh wild-caught Atlantic salmon, rich in Omega-3', 24.99, 'lb', (SELECT id FROM categories WHERE name = 'Fresh Fish'), 'https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg', 4.8, true),
  ('Sea Bass', 'Premium Mediterranean sea bass, delicate flavor', 32.99, 'lb', (SELECT id FROM categories WHERE name = 'Fresh Fish'), 'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg', 4.7, true),
  ('Yellow Fin Tuna', 'Sushi-grade yellowfin tuna, perfect for sashimi', 38.99, 'lb', (SELECT id FROM categories WHERE name = 'Sushi Grade'), 'https://images.pexels.com/photos/7363676/pexels-photo-7363676.jpeg', 4.9, true),
  ('Tiger Prawns', 'Large tiger prawns, perfect for grilling', 28.99, 'lb', (SELECT id FROM categories WHERE name = 'Prawns & Shrimp'), 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg', 4.6, true),
  ('King Crab Legs', 'Alaskan king crab legs, sweet and tender', 49.99, 'lb', (SELECT id FROM categories WHERE name = 'Crab & Lobster'), 'https://images.pexels.com/photos/2374946/pexels-photo-2374946.jpeg', 5.0, true),
  ('Fresh Oysters', 'Pacific oysters, briny and delicious', 18.99, 'dozen', (SELECT id FROM categories WHERE name = 'Shellfish'), 'https://images.pexels.com/photos/5638597/pexels-photo-5638597.jpeg', 4.5, false),
  ('Lobster Tail', 'Maine lobster tail, succulent and buttery', 42.99, 'lb', (SELECT id FROM categories WHERE name = 'Crab & Lobster'), 'https://images.pexels.com/photos/5638597/pexels-photo-5638597.jpeg', 4.8, true),
  ('Jumbo Shrimp', 'Extra large shrimp, versatile for any recipe', 22.99, 'lb', (SELECT id FROM categories WHERE name = 'Prawns & Shrimp'), 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg', 4.4, false)
ON CONFLICT DO NOTHING;