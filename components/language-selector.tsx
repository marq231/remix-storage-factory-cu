'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', googleCode: 'en' },
  { code: 'es', name: 'Español', flag: '🇪🇸', googleCode: 'es' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', googleCode: 'fr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', googleCode: 'de' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', googleCode: 'pt' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', googleCode: 'ja' },
  { code: 'zh', name: '中文', flag: '🇨🇳', googleCode: 'zh-CN' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', googleCode: 'ar' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', googleCode: 'hi' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', googleCode: 'ko' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', googleCode: 'ru' },
]

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get saved language or default to English
    const saved = localStorage.getItem('selectedLanguage') || 'en'
    setCurrentLang(saved)

    // Load Google Translate on mount
    if (!window.google) {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,es,fr,de,pt,ja,zh-CN,ar,hi,ko,ru',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          )
        } catch (e) {
          console.log('[v0] Google Translate init completed')
        }
      }
      
      document.head.appendChild(script)
    }
  }, [])

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    localStorage.setItem('selectedLanguage', lang)

    if (lang === 'en') {
      // Reload page to reset to English
      window.location.reload()
    } else {
      // Find the Google Translate dropdown and change language
      setTimeout(() => {
        const googleTranslateCombo = document.querySelector(
          '.goog-te-combo'
        ) as HTMLSelectElement
        
        if (googleTranslateCombo) {
          const langCode = LANGUAGES.find(l => l.code === lang)?.googleCode
          googleTranslateCombo.value = langCode || lang
          googleTranslateCombo.dispatchEvent(new Event('change'))
        }
      }, 100)
    }
  }

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang)

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
        <Globe className="w-5 h-5 text-white" />
        <span className="text-sm font-bold text-white">Translate</span>
      </div>
    )
  }

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 h-auto cursor-pointer transition-all font-bold text-white">
          <Globe className="w-5 h-5 text-white flex-shrink-0" />
          <span className="hidden sm:inline text-white font-bold">
            {currentLangObj?.flag} Translate
          </span>
          <span className="sm:hidden text-white font-bold">
            {currentLangObj?.flag}
          </span>
        </SelectTrigger>
        <SelectContent className="min-w-[220px]">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="cursor-pointer py-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
