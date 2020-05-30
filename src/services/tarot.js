import axios from './axios'

const getTarotCards = async () => (await axios.get('https://rws-cards-api.herokuapp.com/api/v1/cards/')).data.cards
const getMajorCards = async () => (await getTarotCards()).filter(card => card.type === 'major')

export default getMajorCards
