import { useEffect } from 'react'

export const LanguageSelector = () => {
  useEffect(() => {
    // Add custom styling for Google Translate widget
    const style = document.createElement('style')
    style.innerHTML = `
      #google_translate_element {
        display: inline-block;
      }

      .goog-te-gadget {
        font-family: inherit;
        border: none;
        background: transparent;
      }

      .goog-te-gadget-simple {
        background: transparent;
        border: 1px solid hsl(250, 15%, 85%);
        border-radius: 0.5rem;
        padding: 0.375rem 0.75rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .goog-te-gadget-simple .goog-te-combo {
        background-color: transparent;
        border: none;
        color: hsl(250, 20%, 20%);
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        padding: 0.25rem 0;
      }

      .goog-te-gadget-simple .goog-te-combo:hover {
        color: hsl(250, 50%, 45%);
      }

      .goog-te-gadget-simple .goog-te-combo option {
        background-color: white;
        color: hsl(250, 20%, 20%);
        padding: 0.5rem;
      }

      .goog-te-menu-value {
        color: hsl(250, 20%, 20%);
        font-weight: 500;
      }

      .goog-te-menu-value:hover {
        color: hsl(250, 50%, 45%);
      }
    `
    document.head.appendChild(style)

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
          gaTrack: true,
          gaId: 'UA-XXXXXXX-X',
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
