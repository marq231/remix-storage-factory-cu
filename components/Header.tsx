'use client';

import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/app/context/AppContext';
import { translate, getLanguageName } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, LogOut, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function Header() {
  const { isAuthenticated, language, setLanguage, logout } = useAppContext();

  if (!isAuthenticated) return null;

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
  };

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="bg-primary text-primary-foreground border-b-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent shadow-lg">
              <Image
                src="/military-logo.jpg"
                alt="D4 Battalion Squad Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-accent">
                D4 Battalion Squad
              </h1>
              <p className="text-xs text-primary-foreground/80">
                Military Services Portal
              </p>
            </div>
          </div>

          {/* Language Selector and Logout */}
          <div className="flex items-center gap-4">
            {/* Language Selector - More Prominent */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-accent font-semibold px-4 py-2 h-auto"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                  <span className="sm:hidden">{currentLanguage.flag}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-2 border-accent">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Select Language</p>
                </div>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                      language === lang.code ? 'bg-accent/20 text-accent font-semibold' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <span className="ml-auto text-accent text-xs font-bold">ACTIVE</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-red-600/30 hover:text-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{translate('header.logout', language)}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
