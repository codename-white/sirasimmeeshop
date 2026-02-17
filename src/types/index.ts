export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[]; // Multiple images for the product
  category: string;
  stock: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  address?: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}
