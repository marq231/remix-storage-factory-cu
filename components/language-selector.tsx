'use client'

import { useEffect } from 'react'
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
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
]

export const LanguageSelector = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Initialize i18n on client side
    if (i18n && !i18n.isInitialized) {
      i18n.init().catch((err) => console.error('[v0] i18n init error:', err))
    }
  }, [i18n])

  const handleLanguageChange = (lang: string) => {
    if (i18n) {
      i18n.changeLanguage(lang)
      localStorage.setItem('preferredLanguage', lang)
    }
  }

  const currentLanguage = languages.find(
    (lang) => lang.code === (i18n?.language || 'en')
  )

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <Select value={i18n?.language || 'en'} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-fit border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0 hover:bg-accent">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
