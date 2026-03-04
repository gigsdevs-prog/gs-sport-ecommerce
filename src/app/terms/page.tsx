// ============================================
// GS SPORT - Terms of Service Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Terms of Service',
  description: `${SITE_NAME} Terms of Service.`,
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-neutral-500 mb-12">Last updated: March 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">1. Acceptance of Terms</h2>
            <p>By accessing and using the {SITE_NAME} website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">2. Products and Pricing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All prices are displayed in USD and include applicable taxes unless noted otherwise.</li>
              <li>We reserve the right to modify prices at any time without prior notice.</li>
              <li>Product images are for illustration purposes. Actual products may vary slightly.</li>
              <li>We strive for accuracy in product descriptions but do not guarantee they are error-free.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">3. Orders and Payment</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Placing an order constitutes an offer to purchase. We reserve the right to refuse any order.</li>
              <li>Payment is processed securely through Stripe at the time of checkout.</li>
              <li>Orders may be cancelled within 1 hour of placement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">4. Shipping and Delivery</h2>
            <p>Delivery times are estimates and may vary. {SITE_NAME} is not responsible for delays caused by shipping carriers or customs. See our <a href="/shipping" className="text-black underline">Shipping & Returns</a> page for details.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">5. Returns and Refunds</h2>
            <p>Items may be returned within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Refunds are processed within 5-10 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">6. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You must provide accurate and complete information when registering.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">7. Intellectual Property</h2>
            <p>All content on this website, including logos, text, images, and designs, is the property of {SITE_NAME} and is protected by copyright laws. Unauthorized use is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">8. Limitation of Liability</h2>
            <p>{SITE_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">9. Contact</h2>
            <p>For questions about these terms, please <a href="/contact" className="text-black underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
