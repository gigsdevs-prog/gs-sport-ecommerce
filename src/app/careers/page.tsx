// ============================================
// GS SPORT - Careers Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Careers',
  description: `Join the ${SITE_NAME} team. Explore career opportunities.`,
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Careers</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Join our team and help shape the future of athletic wear.
        </p>

        <div className="bg-neutral-50 rounded-xl p-8 text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏃</span>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-3">We&apos;re Growing</h2>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            While we don&apos;t have any open positions right now, we&apos;re always looking for talented people who share our passion for sport and innovation.
          </p>
          <a
            href="mailto:careers@gssport.ge"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Send Your CV
          </a>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Why {SITE_NAME}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Innovation First', desc: 'We push boundaries in athletic wear design and technology.' },
              { title: 'Team Culture', desc: 'A collaborative environment where every voice matters.' },
              { title: 'Growth', desc: 'Opportunities for professional development and career advancement.' },
              { title: 'Passion', desc: 'Work with people who live and breathe sport.' },
            ].map((v) => (
              <div key={v.title} className="border border-neutral-200 rounded-xl p-5">
                <h3 className="font-semibold text-neutral-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
