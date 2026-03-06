// ============================================
// GS SPORT - Type Definitions
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  category?: Category;
  images: string[];
  videos: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  best_seller: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: 'cash' | 'card';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  bog_order_id: string | null;
  bog_payment_hash: string | null;
  bog_transaction_id: string | null;
  shipping_address: ShippingAddress;
  items?: OrderItem[];
  user?: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export type OrderStatus = 'awaiting_payment' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  blocked: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string;
  section: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: UserProfile;
  rating: number;
  comment: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface AboutPage {
  id: string;
  image_url: string | null;
  title: string;
  description: string;
  phone: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  updated_at: string;
}

export interface GifSection {
  id: string;
  title: string | null;
  gif_url: string;
  category_id: string | null;
  product_id: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
