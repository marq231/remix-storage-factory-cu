'use client'

import { useEffect } from 'react'

export const LanguageSelector = () => {
  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)

    // Initialize function for Google Translate
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
      } catch (e) {
        console.error('[v0] Google Translate init error:', e)
      }
    }
  }, [])

  return (
    <div 
      id="google_translate_element" 
      className="flex items-center"
    ></div>
  )
}
