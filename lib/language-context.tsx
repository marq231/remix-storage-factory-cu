'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ko', name: '한국어' },
]

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  translate: (text: string) => Promise<string>
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem('selectedLanguage')
    if (saved) {
      setLanguage(saved)
    }
  }, [])

  const translate = async (text: string): Promise<string> => {
    if (language === 'en') return text
    if (!text || text.trim().length === 0) return text

    const cacheKey = `${language}:${text}`
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey]
    }

    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: language }),
      })

      const data = await response.json()
      const translated = data.translatedText || text

      setTranslationCache((prev) => ({
        ...prev,
        [cacheKey]: translated,
      }))

      return translated
    } catch (error) {
      console.error('[v0] Translation error:', error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('selectedLanguage', lang)
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, translate, isTranslating }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
