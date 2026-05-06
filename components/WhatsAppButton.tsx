'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';

export default function WhatsAppButton() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) return null;

  const whatsappUrl = `https://wa.me/14302913433?text=Hello,%20I%20need%20military%20support%20services`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border">
        WhatsApp Support
      </span>
    </a>
  );
}
