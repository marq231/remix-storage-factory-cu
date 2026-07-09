// Simple translation utility using browser's built-in translation or a service

export interface LanguageOption {
  code: string
  name: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
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

export const getCurrentLanguage = (): string => {
  if (typeof window === 'undefined') return 'en'
  return localStorage.getItem('selectedLanguage') || 'en'
}

export const setLanguage = (lang: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('selectedLanguage', lang)
}

export const initiatePageTranslation = (languageCode: string): void => {
  if (typeof window === 'undefined' || languageCode === 'en') return

  // Use Google Translate API via hidden iframe method
  const googleTranslateElement = document.getElementById('google_translate_element')
  if (googleTranslateElement) {
    const frame = document.querySelector('iframe.goog-te-menu-frame')
    if (frame && frame.parentElement) {
      frame.parentElement.style.display = 'none'
    }

    // Trigger translation by simulating the translate menu
    const translateSelector = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (translateSelector) {
      translateSelector.value = languageCode
      translateSelector.dispatchEvent(new Event('change'))
    }
  }
}
