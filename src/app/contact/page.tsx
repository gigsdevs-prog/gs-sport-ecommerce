// ============================================
// GS SPORT - Contact Us Page
// ============================================

'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function ContactPage() {
  const { t } = useLanguage();
  const contactPhoneDisplay = '557781251';
  const contactPhoneHref = `tel:${contactPhoneDisplay.replace(/[^0-9+]/g, '')}`;

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">{t('contact_title')}</h1>
        <p className="text-lg text-neutral-600 mb-12">
          {t('contact_intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{t('email')}</h3>
                <a href="mailto:support@gssport.ge" className="text-neutral-600 hover:text-black transition-colors">support@gssport.ge</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{t('phone')}</h3>
                <a href={contactPhoneHref} className="text-neutral-600 hover:text-black transition-colors">{contactPhoneDisplay}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{t('address')}</h3>
                <p className="text-neutral-600">Tbilisi, Georgia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{t('working_hours')}</h3>
                <p className="text-neutral-600">Mon - Fri: 10:00 - 19:00</p>
                <p className="text-neutral-600">Sat: 11:00 - 17:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">{t('name')}</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder={t('your_name')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">{t('email')}</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">{t('message')}</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                placeholder={t('how_can_help')}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              {t('send_message')}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
