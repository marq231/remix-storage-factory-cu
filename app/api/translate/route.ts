import { NextRequest, NextResponse } from 'next/server'

const LANGUAGE_MAP: Record<string, string> = {
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  ja: 'ja',
  zh: 'zh',
  ar: 'ar',
  hi: 'hi',
  ko: 'ko',
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || targetLanguage === 'en') {
      return NextResponse.json({ translatedText: text })
    }

    const langCode = LANGUAGE_MAP[targetLanguage]
    if (!langCode) {
      return NextResponse.json({ translatedText: text })
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`
    )

    const data = await response.json()

    if (data.responseStatus === 200) {
      return NextResponse.json({
        translatedText: data.responseData.translatedText,
      })
    }

    return NextResponse.json({ translatedText: text })
  } catch (error) {
    console.error('[v0] Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
