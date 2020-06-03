import axios from './axios'

export const getMajorCards = async () => {
  const { data } = await axios.get(
    'https://rws-cards-api.herokuapp.com/api/v1/cards/search?type=major',
  )
  return data.cards
}

export const getOneCardData = async (cardNumber = 0) => {
  const url = `https://rws-cards-api.herokuapp.com/api/v1/cards/ar${
    cardNumber < 10 ? 0 : ''
  }${cardNumber}`
  const { data } = await axios.get(url)
  return data.card
}
export default getOneCardData
