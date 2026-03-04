// ============================================
// GS SPORT - Shipping & Returns Page
// ============================================

import { SITE_NAME } from '@/lib/constants';
import { Truck, RotateCcw, Shield, Clock } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Returns',
  description: `${SITE_NAME} shipping information and return policy.`,
};

const policies = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free standard shipping on all orders over $100. Standard delivery takes 3-7 business days.',
  },
  {
    icon: Clock,
    title: 'Express Delivery',
    description: 'Need it faster? Express delivery is available for an additional fee, arriving in 1-3 business days.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return unworn items within 30 days for a full refund. Items must be in original condition with tags attached.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'All our products are covered by a quality guarantee. If you receive a defective item, we\'ll replace it free of charge.',
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Shipping & Returns</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Everything you need to know about delivery and returns.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          {policies.map((p) => (
            <div key={p.title} className="border border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <p.icon size={22} className="text-neutral-700" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{p.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral max-w-none">
          <h2>Shipping Rates</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 text-left font-semibold">Method</th>
                <th className="py-3 text-left font-semibold">Delivery Time</th>
                <th className="py-3 text-left font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-100">
                <td className="py-3">Standard</td>
                <td className="py-3">3-7 business days</td>
                <td className="py-3">Free over $100 / $5.99</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3">Express</td>
                <td className="py-3">1-3 business days</td>
                <td className="py-3">$14.99</td>
              </tr>
            </tbody>
          </table>

          <h2 className="mt-12">Return Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-neutral-600">
            <li>Contact our support team to initiate a return.</li>
            <li>Pack the item securely in its original packaging.</li>
            <li>Ship the item using the provided return label.</li>
            <li>Refund will be processed within 5-10 business days after we receive the item.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
