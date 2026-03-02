// ============================================
// GS SPORT - Constants
// ============================================

export const SITE_NAME = 'GS SPORT';
export const SITE_DESCRIPTION = 'Premium Athletic Wear for Champions';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gssport.vercel.app';

export const DEFAULT_CONTENT: Record<string, string> = {
  'hero_headline': 'Elevate Your Game',
  'hero_subheadline': 'Premium athletic wear designed for those who demand excellence.',
  'hero_cta': 'Shop Now',
  'featured_title': 'Featured Collection',
  'featured_subtitle': 'Curated pieces for the modern athlete',
  'bestseller_title': 'Best Sellers',
  'bestseller_subtitle': 'Our most loved products',
  'newsletter_title': 'Join the GS SPORT Family',
  'newsletter_subtitle': 'Subscribe and get 10% off your first order',
  'promo_title': 'New Season, New Goals',
  'promo_subtitle': 'Up to 40% off on selected items',
  'promo_cta': 'Shop Sale',
  'footer_about': 'GS SPORT is a premium athletic brand dedicated to empowering athletes with high-quality, stylish performance wear.',
};

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12', '13'] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=men', label: 'Men' },
  { href: '/shop?category=women', label: 'Women' },
  { href: '/shop?category=accessories', label: 'Accessories' },
  { href: '/shop?category=shoes', label: 'Shoes' },
] as const;
