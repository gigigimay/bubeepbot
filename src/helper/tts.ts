export const getVoiceLine = (text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  return `https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${formatted}&tl=th&client=tw-ob`
}

export const getVoiceLineNational = (langauge: string, gender: string,  text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  gender = [`Male`,`male`,`M`,`m`].includes(gender)? `male` : [`Female`,`female`,`F`,`f`].includes(gender) ? `female` : ``
  if (gender == ``) throw(Error) 

  return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${formatted}&lang=${langauge}&engine=g3&volume=1&key=WfWmvaX0&gender=${gender}&fbclid=IwAR15CgGIrGczJryIOR4nBebhoMimMqNGgk6OZ2G7WwSm04Au2p2lTsf-V8U`

}