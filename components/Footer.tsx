'use client';

import React from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { translate } from '@/lib/translations';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const { isAuthenticated, language } = useAppContext();

  if (!isAuthenticated) return null;

  const whatsappUrl = `https://wa.me/14302913433?text=Hello,%20I%20need%20military%20support%20services`;

  return (
    <footer className="bg-primary text-primary-foreground border-t border-accent mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent">
              {translate('footer.support', language)}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a
                  href="mailto:military@d4battalion.us"
                  className="hover:text-accent transition"
                >
                  {translate('footer.email', language)}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <a href="tel:+14302913433" className="hover:text-accent transition">
                  {translate('footer.phone', language)}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  {translate('footer.whatsapp', language)}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent">
              {translate('footer.contactUs', language)}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:military@d4battalion.us"
                  className="hover:text-accent transition"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a href="tel:+14302913433" className="hover:text-accent transition">
                  Call Us
                </a>
              </li>
              <li>
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent">
              D4 Battalion Squad
            </h3>
            <p className="text-sm opacity-90">
              D4 Battalion Squad - Professional military leave management and family support services.
              Serving our military community with excellence and dedication.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-accent mt-8 pt-8 text-center text-sm opacity-75">
          {translate('footer.copyright', language)}
        </div>
      </div>
    </footer>
  );
}
