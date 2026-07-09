'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { LANGUAGES, getCurrentLanguage, setLanguage } from '@/lib/translate'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = getCurrentLanguage()
    setCurrentLang(savedLang)

    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      
      ;(window as any).googleTranslateElementInit = function () {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,es,fr,de,pt,ja,zh-CN,ar,hi,ko,ru',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          )
          
          const gTranslateElement = document.getElementById('google_translate_element')
          if (gTranslateElement) {
            gTranslateElement.style.display = 'none'
          }
        } catch (e) {
          console.error('[v0] Google Translate init error:', e)
        }
      }

      document.head.appendChild(script)
    }
  }, [])

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    setLanguage(lang)

    if (lang !== 'en') {
      const translateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (translateCombo) {
        translateCombo.value = lang === 'zh' ? 'zh-CN' : lang
        translateCombo.dispatchEvent(new Event('change'))
      }
    } else {
      window.location.href = window.location.pathname
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
