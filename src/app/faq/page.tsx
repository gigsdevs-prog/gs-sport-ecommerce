// ============================================
// GS SPORT - FAQ Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'FAQ',
  description: `Frequently Asked Questions about ${SITE_NAME}.`,
};

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3-7 business days. Express delivery is available for 1-3 business days at an additional cost.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original condition with tags attached.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also check your order status in your account.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards (Visa, Mastercard, American Express) through BOG iPay (Bank of Georgia).',
  },
  {
    q: 'How do I find my size?',
    a: 'Check our Size Guide page for detailed measurements. If you\'re between sizes, we recommend going up one size.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed.',
  },
  {
    q: 'Do you have a physical store?',
    a: 'We are primarily an online store based in Tbilisi, Georgia. Follow our social media for pop-up event announcements.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">FAQ</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Find answers to our most frequently asked questions.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.q}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-neutral-50 rounded-xl p-6 text-center">
          <p className="text-neutral-900 font-semibold mb-2">Still have questions?</p>
          <p className="text-neutral-600 text-sm mb-4">We&apos;re here to help.</p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
