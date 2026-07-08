import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export const LanguageSelector = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Add custom styling for Google Translate widget
    const style = document.createElement('style')
    style.innerHTML = `
      #google_translate_element {
        display: inline-flex !important;
        align-items: center !important;
      }

      .goog-te-gadget {
        font-family: inherit !important;
        border: none !important;
        background: transparent !important;
        display: inline-flex !important;
        align-items: center !important;
      }

      .goog-te-gadget-simple {
        background: transparent !important;
        border: 1px solid hsl(250, 15%, 85%) !important;
        border-radius: 0.5rem !important;
        padding: 0.375rem 0.75rem !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        display: inline-flex !important;
        align-items: center !important;
      }

      .goog-te-gadget-simple .goog-te-combo {
        background-color: transparent !important;
        border: none !important;
        color: hsl(250, 20%, 20%) !important;
        font-size: 0.875rem !important;
        font-weight: 500 !important;
        font-family: inherit !important;
        cursor: pointer !important;
        padding: 0.25rem 0 !important;
        display: inline-block !important;
      }

      .goog-te-gadget-simple .goog-te-combo:hover {
        color: hsl(250, 50%, 45%) !important;
      }

      .goog-te-gadget-simple .goog-te-combo option {
        background-color: white !important;
        color: hsl(250, 20%, 20%) !important;
        padding: 0.5rem !important;
      }

      .goog-te-menu-value {
        color: hsl(250, 20%, 20%) !important;
        font-weight: 500 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }

      .goog-te-menu-value:hover {
        color: hsl(250, 50%, 45%) !important;
      }

      .goog-te-menu-value span:nth-child(2) {
        display: inline-flex !important;
        align-items: center !important;
      }
    `
    document.head.appendChild(style)

    // Load Google Translate script
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    // Initialize Google Translate
    ;(window as any).googleTranslateElementInit = function () {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,ru,ja,zh-CN,ar,hi,ko',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            gaTrack: true,
            gaId: 'UA-XXXXXXX-X',
          },
          'google_translate_element'
        )
      } catch (e) {
        console.error('Translation initialization error:', e)
      }
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div 
        id="google_translate_element"
        style={{
          display: 'inline-block',
          minHeight: '20px',
        }}
      />
    </div>
  )
}
