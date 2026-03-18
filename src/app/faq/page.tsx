// ============================================
// GS SPORT - FAQ Page
// ============================================

'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function FAQPage() {
  const { t } = useLanguage();
  const faqItems = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
    { q: t('faq_q7'), a: t('faq_a7') },
    { q: t('faq_q8'), a: t('faq_a8') },
  ];

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">{t('faq')}</h1>
        <p className="text-lg text-neutral-600 mb-12">
          {t('faq_intro')}
        </p>

        <div className="space-y-6">
          {faqItems.map((faq, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.q}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-neutral-50 rounded-xl p-6 text-center">
          <p className="text-neutral-900 font-semibold mb-2">{t('faq_still_questions')}</p>
          <p className="text-neutral-600 text-sm mb-4">{t('faq_help')}</p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            {t('contact_us')}
          </a>
        </div>
      </div>
    </main>
  );
}
