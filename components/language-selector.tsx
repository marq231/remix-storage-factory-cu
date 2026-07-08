import { useEffect } from 'react'

export const LanguageSelector = () => {
  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    // Initialize Google Translate
    ;(window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,ru,ja,zh-CN,ar,hi,ko',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      )
    }
  }, [])

  return (
    <div 
      id="google_translate_element"
      className="flex items-center"
      style={{
        display: 'inline-block',
      }}
    />
  )
}
