import axios from 'axios'
import { createLogger } from '../utilities/logger'

const logger = createLogger('helper/tts.ts')

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export const getGender = (value: string): Gender => {
  const lower = value.toLowerCase()
  if (['male', 'm'].includes(lower)) return Gender.Male
  if (['female', 'f'].includes(lower)) return Gender.Female
  throw new Error('invalid gender!')
}

export const getVoiceLine = (text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  return `https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${formatted}&tl=th&client=tw-ob`
}

export const getVoiceLineNational = (language: string, gender: string, text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  const genderValue = getGender(gender)

  // use google translate voice for th female
  if (language === 'th' && genderValue === Gender.Female) {
    return getVoiceLine(text)
  }

  // otherwise, use by language
  return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${formatted}&lang=${language}&engine=g3&volume=1&key=WfWmvaX0&gender=${genderValue}&fbclid=IwAR15CgGIrGczJryIOR4nBebhoMimMqNGgk6OZ2G7WwSm04Au2p2lTsf-V8U`
}

export const checkLanguageValid = async (language: string): Promise<string> => {
  try {
    const url = getVoiceLineNational(language, Gender.Male, 'test')
    await axios.get(url)
    return language
  } catch (e) {
    logger.error('checkLanguageValid:', e)
    throw new Error('invalid language!')
  }
}
