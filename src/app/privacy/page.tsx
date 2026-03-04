// ============================================
// GS SPORT - Privacy Policy Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy',
  description: `${SITE_NAME} Privacy Policy - How we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-12">Last updated: March 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">1. Information We Collect</h2>
            <p>When you use {SITE_NAME}, we may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personal details (name, email, phone) when you create an account or place an order.</li>
              <li>Payment information processed securely through Stripe — we never store your card details.</li>
              <li>Shipping address for order delivery.</li>
              <li>Usage data including pages visited, browser type, and device information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and deliver your orders.</li>
              <li>Send order confirmation and shipping updates.</li>
              <li>Improve our website and services.</li>
              <li>Send promotional emails (only with your consent).</li>
              <li>Respond to customer support inquiries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">3. Data Sharing</h2>
            <p>We do not sell your personal data. We may share information with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment processors (Stripe) to complete transactions.</li>
              <li>Shipping partners to deliver your orders.</li>
              <li>Analytics tools to improve our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including SSL encryption, secure authentication via Supabase, and regular security audits.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of promotional communications.</li>
              <li>Request data portability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">6. Contact</h2>
            <p>If you have questions about this policy, please <a href="/contact" className="text-black underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
