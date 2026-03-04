// ============================================
// GS SPORT - Size Guide Page
// ============================================

import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Size Guide',
  description: `${SITE_NAME} size guide - Find your perfect fit.`,
};

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Size Guide</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Find the perfect fit with our size charts below.
        </p>

        {/* Men's Clothing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Men&apos;s Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Size</th>
                  <th className="py-3 px-4 text-left font-semibold">Chest (cm)</th>
                  <th className="py-3 px-4 text-left font-semibold">Waist (cm)</th>
                  <th className="py-3 px-4 text-left font-semibold">Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '84-88', '70-74', '84-88'],
                  ['S', '88-92', '74-78', '88-92'],
                  ['M', '92-100', '78-86', '92-100'],
                  ['L', '100-108', '86-94', '100-108'],
                  ['XL', '108-116', '94-102', '108-116'],
                  ['XXL', '116-124', '102-110', '116-124'],
                ].map(([size, chest, waist, hips]) => (
                  <tr key={size} className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">{size}</td>
                    <td className="py-3 px-4 text-neutral-600">{chest}</td>
                    <td className="py-3 px-4 text-neutral-600">{waist}</td>
                    <td className="py-3 px-4 text-neutral-600">{hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Women's Clothing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Women&apos;s Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Size</th>
                  <th className="py-3 px-4 text-left font-semibold">Bust (cm)</th>
                  <th className="py-3 px-4 text-left font-semibold">Waist (cm)</th>
                  <th className="py-3 px-4 text-left font-semibold">Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '78-82', '60-64', '84-88'],
                  ['S', '82-86', '64-68', '88-92'],
                  ['M', '86-94', '68-76', '92-100'],
                  ['L', '94-102', '76-84', '100-108'],
                  ['XL', '102-110', '84-92', '108-116'],
                  ['XXL', '110-118', '92-100', '116-124'],
                ].map(([size, bust, waist, hips]) => (
                  <tr key={size} className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">{size}</td>
                    <td className="py-3 px-4 text-neutral-600">{bust}</td>
                    <td className="py-3 px-4 text-neutral-600">{waist}</td>
                    <td className="py-3 px-4 text-neutral-600">{hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shoes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Shoes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">US</th>
                  <th className="py-3 px-4 text-left font-semibold">EU</th>
                  <th className="py-3 px-4 text-left font-semibold">UK</th>
                  <th className="py-3 px-4 text-left font-semibold">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['6', '38-39', '5.5', '24'],
                  ['7', '39-40', '6.5', '25'],
                  ['8', '40-41', '7.5', '25.5'],
                  ['9', '41-42', '8.5', '26.5'],
                  ['10', '42-43', '9.5', '27'],
                  ['11', '44-45', '10.5', '28'],
                  ['12', '45-46', '11.5', '29'],
                  ['13', '46-47', '12.5', '29.5'],
                ].map(([us, eu, uk, cm]) => (
                  <tr key={us} className="border-t border-neutral-100">
                    <td className="py-3 px-4 font-medium">{us}</td>
                    <td className="py-3 px-4 text-neutral-600">{eu}</td>
                    <td className="py-3 px-4 text-neutral-600">{uk}</td>
                    <td className="py-3 px-4 text-neutral-600">{cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-neutral-50 rounded-xl p-6 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900 mb-2">Not sure about your size?</p>
          <p>If you&apos;re between sizes, we recommend going up one size for a more comfortable fit. Feel free to <a href="/contact" className="text-black underline">contact us</a> for personalized sizing advice.</p>
        </div>
      </div>
    </main>
  );
}
