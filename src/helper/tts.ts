export const getVoiceLine = (text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  return `https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${formatted}&tl=th&client=tw-ob`
}

const getGender = (value: string): string => {
  const lower = value.toLowerCase()
  if (['male', 'm'].includes(lower)) return 'male'
  if (['female', 'f'].includes(lower)) return 'female'
  throw new Error('invalid gender')
}

export const getVoiceLineNational = (langauge: string, gender: string, text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  const genderValue = getGender(gender)
  return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${formatted}&lang=${langauge}&engine=g3&volume=1&key=WfWmvaX0&gender=${genderValue}&fbclid=IwAR15CgGIrGczJryIOR4nBebhoMimMqNGgk6OZ2G7WwSm04Au2p2lTsf-V8U`
}
