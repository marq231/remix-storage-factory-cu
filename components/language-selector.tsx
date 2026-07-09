'use client'

import { Globe } from 'lucide-react'
import { useState } from 'react'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

const LANG_MAP: { [key: string]: string } = {
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  ja: 'ja',
  zh: 'zh-CN',
  ar: 'ar',
  hi: 'hi',
  ko: 'ko',
  ru: 'ru',
}

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<string>('en')

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    setIsOpen(false)
    localStorage.setItem('selectedLanguage', lang)

    if (lang === 'en') {
      // Return to original English page
      window.location.href = 'https://www.nextfundus.com'
    } else {
      // Redirect to Google Translate - use base domain only to avoid loops
      const targetLang = LANG_MAP[lang] || lang
      const baseUrl = 'https://www.nextfundus.com'
      window.location.href = `https://translate.google.com/translate?sl=en&tl=${targetLang}&u=${encodeURIComponent(baseUrl)}&client=srpclient`
    }
  }

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang)

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 h-auto cursor-pointer transition-all font-bold text-white"
        >
          <Globe className="w-5 h-5 text-white flex-shrink-0" />
          <span className="hidden sm:inline text-white font-bold">
            {currentLangObj?.flag} Translate
          </span>
          <span className="sm:hidden text-white font-bold">
            {currentLangObj?.flag}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                  currentLang === lang.code ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
