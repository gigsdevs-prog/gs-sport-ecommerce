// ============================================
// GS SPORT - Contact Us Page
// ============================================

import { SITE_NAME } from '@/lib/constants';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${SITE_NAME}. We're here to help.`,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Contact Us</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Have a question or need help? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                <p className="text-neutral-600">support@gssport.ge</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
                <p className="text-neutral-600">+995 XXX XXX XXX</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Address</h3>
                <p className="text-neutral-600">Tbilisi, Georgia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Working Hours</h3>
                <p className="text-neutral-600">Mon - Fri: 10:00 - 19:00</p>
                <p className="text-neutral-600">Sat: 11:00 - 17:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
