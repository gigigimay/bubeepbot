export const getRandomInt = (from = 0, to = 0, inclusive = true) => {
  const fromInt = Math.round(from)
  const toInt = Math.floor(to)
  const inclusiveInt = inclusive ? 1 : 0
  return Math.floor(Math.random() * (toInt - fromInt + inclusiveInt)) + fromInt
}
