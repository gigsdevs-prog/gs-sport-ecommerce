// ============================================
// GS SPORT - Cookie Policy Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Cookie Policy',
  description: `${SITE_NAME} Cookie Policy - How we use cookies.`,
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-neutral-500 mb-12">Last updated: March 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us provide a better browsing experience by remembering your preferences and login status.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Type</th>
                    <th className="py-3 px-4 text-left font-semibold">Purpose</th>
                    <th className="py-3 px-4 text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">Essential</td>
                    <td className="py-3 px-4 text-neutral-600">Authentication, cart state, security tokens</td>
                    <td className="py-3 px-4 text-neutral-600">Session / 30 days</td>
                  </tr>
                  <tr className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">Functional</td>
                    <td className="py-3 px-4 text-neutral-600">Preferences, language, currency</td>
                    <td className="py-3 px-4 text-neutral-600">1 year</td>
                  </tr>
                  <tr className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">Analytics</td>
                    <td className="py-3 px-4 text-neutral-600">Page views, performance metrics</td>
                    <td className="py-3 px-4 text-neutral-600">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Third-Party Cookies</h2>
            <p>We use the following third-party services that may set cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> — Authentication and session management.</li>
              <li><strong>BOG iPay</strong> — Secure payment processing via Bank of Georgia.</li>
              <li><strong>Vercel</strong> — Analytics and performance monitoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling essential cookies may affect website functionality. Most browsers allow you to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>View what cookies are stored on your device.</li>
              <li>Delete individual or all cookies.</li>
              <li>Block cookies from specific or all websites.</li>
              <li>Set preferences for first-party vs. third-party cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-900">Contact</h2>
            <p>If you have questions about our cookie usage, please <a href="/contact" className="text-black underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
