// ============================================
// GS SPORT - Zod Validation Schemas
// ============================================

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  compare_at_price: z.number().nullable().optional(),
  category_id: z.string().min(1, 'Category is required'),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  featured: z.boolean(),
  best_seller: z.boolean(),
  active: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const siteContentSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  section: z.string().min(1, 'Section is required'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Review comment is required'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type BannerFormData = z.infer<typeof bannerSchema>;
export type SiteContentFormData = z.infer<typeof siteContentSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
