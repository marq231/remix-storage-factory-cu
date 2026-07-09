'use client'

import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (i18n && !i18n.isInitialized) {
      i18n.init().then(() => setIsReady(true))
    } else {
      setIsReady(true)
    }
  }, [])

  if (!isReady) return <>{children}</>

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
