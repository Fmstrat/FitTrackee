/* eslint-disable import/no-duplicates */
import { Locale } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'

import createI18n from '@/i18n'

export const localeFromLanguage: Record<string, Locale> = {
  en: enUS,
  fr: fr,
}

export const languageLabels: Record<string, string> = {
  en: 'English',
  fr: 'Français',
}

const { availableLocales } = createI18n.global
export const availableLanguages = availableLocales.map((l) => {
  return { label: languageLabels[l], value: l }
})
