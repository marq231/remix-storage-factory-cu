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

const translatePage = async (fromLang: string, toLang: string) => {
  if (toLang === 'en') {
    // For English, just reload the page
    window.location.reload()
    return
  }

  try {
    // Get all text nodes on the page
    const elements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, button, label, a, input, textarea, div'
    )

    for (const element of elements) {
      if (element.children.length === 0 && element.textContent && element.textContent.trim()) {
        const text = element.textContent.trim()
        
        // Skip if text is too short or contains special characters
        if (text.length < 2 || /^[0-9$,\-\s%]*$/.test(text)) continue

        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
          )
          const data = await response.json()
          
          if (data.responseData.translatedText && data.responseData.translatedText !== text) {
            element.textContent = data.responseData.translatedText
          }
        } catch (e) {
          console.log('[v0] Translation skipped for:', text)
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
  } catch (error) {
    console.error('[v0] Translation error:', error)
  }
}

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const [mounted, setMounted] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('selectedLanguage') || 'en'
    setCurrentLang(saved)
  }, [])

  const handleLanguageChange = async (lang: string) => {
    setCurrentLang(lang)
    localStorage.setItem('selectedLanguage', lang)
    setIsTranslating(true)

    await translatePage('en', lang)
    
    setIsTranslating(false)
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
    <Select value={currentLang} onValueChange={handleLanguageChange} disabled={isTranslating}>
      <SelectTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 h-auto cursor-pointer transition-all font-bold text-white disabled:opacity-75 disabled:cursor-not-allowed">
        <Globe className={`w-5 h-5 text-white flex-shrink-0 ${isTranslating ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline text-white font-bold">
          {isTranslating ? 'Translating...' : `${currentLangObj?.flag} Translate`}
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
