import axios from './axios'

export const getMajorCards = async () => {
  const { cards: majorCards } = (await axios.get('https://rws-cards-api.herokuapp.com/api/v1/cards/search?type=major')).data
  return majorCards
}

export const getOneCardData = async (cardNumber = 0, isReversed = false) => {
  const url = `https://rws-cards-api.herokuapp.com/api/v1/cards/ar${cardNumber < 10 ? 0 : ''}${cardNumber}`
  const { card } = (await axios.get(url)).data
  return { card, isReversed }
}
export default getOneCardData
