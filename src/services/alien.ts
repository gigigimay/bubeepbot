import { AlienGameQuestions } from '../types'
import axios from './axios'

const endpoint = 'https://script.google.com/macros/s/AKfycbxTnk7oKvS_6nd9MM1pson2w_Cmjy8Doza0n2rVzaQ_2ex5m7aGp-isczXpl52HTkCwKg/exec'

export const getQuestions = async (size: number = 2): Promise<AlienGameQuestions> => {
  const url = `${endpoint}?size=${size}`
  console.log(url)
  const { data } = await axios.get(url)
  return data
}
