export const getVoiceLine = (text: string | number): string => {
  const formatted = encodeURI(`${text}`)
  return `https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${formatted}&tl=th&client=tw-ob`
}
