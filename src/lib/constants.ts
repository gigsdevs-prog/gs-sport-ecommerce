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
  'top_bar_text': 'Free shipping on orders over $100',
  'top_bar_right': 'Premium Athletic Wear',
  'topbar_free_shipping': 'Free Shipping on Orders Over ₾100',
  'topbar_new_arrivals': 'New Arrivals Just Dropped',
  'topbar_premium_athletic': 'Premium Athletic Wear',
  'topbar_easy_returns': 'Easy Returns & Exchanges',
  'topbar_signup_discount': 'Sign Up & Get 10% Off',
  'categories_title': 'Shop by Category',
  'categories_subtitle': 'Find your perfect fit',
  'product_details_title': 'Product Details',
  'add_to_cart_text': 'Add to Cart',
  'footer_copyright': 'All rights reserved.',
  'site_logo_url': '/logo.png',
  'promo_image_url': '',
};

export const ORDER_STATUSES = [
  { value: 'awaiting_payment', label: 'Awaiting Payment', color: 'bg-orange-100 text-orange-800' },
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
  { href: '/about', label: 'About' },
] as const;
