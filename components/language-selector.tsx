'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const languages = [
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

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (lang: string) => {
    if (i18n) {
      i18n.changeLanguage(lang)
      localStorage.setItem('preferredLanguage', lang)
    }
  }

  const currentLang = languages.find(lang => lang.code === (i18n?.language || 'en'))

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-700 shadow-lg">
        <Globe className="w-5 h-5 text-white flex-shrink-0 animate-bounce" />
        <span className="text-sm font-bold text-white">Translator</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center">
      <Select value={i18n?.language || 'en'} onValueChange={handleLanguageChange}>
        <SelectTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 h-auto cursor-pointer transition-all font-bold text-white no-underline">
          <Globe className="w-5 h-5 text-white flex-shrink-0" />
          <span className="hidden sm:inline text-white font-bold">
            {currentLang?.flag} Translate
          </span>
          <span className="sm:hidden text-white font-bold">
            {currentLang?.flag}
          </span>
        </SelectTrigger>
        <SelectContent className="min-w-[220px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="cursor-pointer py-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
