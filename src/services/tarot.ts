import { TarotCard } from './../types'
import axios from './axios'

const endpoint = 'https://rws-cards-api.herokuapp.com/api/v1'

export const getMajorCards = async ():Promise<TarotCard[]> => {
  const { data } = await axios.get(`${endpoint}/cards/search?type=major`)
  return data.cards
}

export const getOneCardData = async (cardNumber = 0):Promise<TarotCard> => {
  const cardId = `ar${cardNumber < 10 ? 0 : ''}${cardNumber}`
  const { data } = await axios.get(`${endpoint}/cards/${cardId}`)
  return data.card
}
