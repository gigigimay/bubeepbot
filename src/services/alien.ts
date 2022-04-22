import { AlienGameQuestions } from '../types'
import axios from './axios'

const endpoint = process.env.ALIEN_API_ENDPOINT || ''

export const getQuestions = async (size: number = 2): Promise<AlienGameQuestions> => {
  const { data } = await axios.get(endpoint, { params: size })
  if (data.status !== 'success') {
    throw new Error(data.message)
  }
  return data.data
}
