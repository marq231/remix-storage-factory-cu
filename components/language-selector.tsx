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
  'zh': 'zh-CN',
  ar: 'ar',
  hi: 'hi',
  ko: 'ko',
  ru: 'ru',
}

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('selectedLanguage') || 'en'
    setCurrentLang(saved)
  }, [])

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    localStorage.setItem('selectedLanguage', lang)

    if (lang === 'en') {
      window.location.reload()
    } else {
      // Use the simple, reliable method: add Google Translate class to html
      const html = document.documentElement
      
      // Remove existing Google Translate class
      Array.from(html.classList).forEach(className => {
        if (className.startsWith('translated-')) {
          html.classList.remove(className)
        }
      })

      // Set language attribute
      html.lang = LANG_MAP[lang] || lang

      // Reload page so Google Translate picks it up from the language attribute
      setTimeout(() => {
        window.location.reload()
      }, 300)
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
  )
}
