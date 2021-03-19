import axios from 'axios'

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

export const getVoiceLineNational = (langauge: string, gender: string, text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  const genderValue = getGender(gender)
  const url = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${formatted}&lang=${langauge}&engine=g3&volume=1&key=WfWmvaX0&gender=${genderValue}&fbclid=IwAR15CgGIrGczJryIOR4nBebhoMimMqNGgk6OZ2G7WwSm04Au2p2lTsf-V8U`
  return url
}

export const checkLanguageValid = async (langauge: string): Promise<string> => {
  try {
    const url = getVoiceLineNational(langauge, Gender.Male, 'test')
    await axios.get(url)
    return langauge
  } catch (e) {
    console.error('checkLanguageValid', e)
    throw new Error('invalid language!')
  }
}
