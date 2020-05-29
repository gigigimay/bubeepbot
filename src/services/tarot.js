import axios from "./axios";

const getTarotCards = async (_) => (await axios.get(`https://rws-cards-api.herokuapp.com/api/v1/cards/`)).data.cards
const getMajorCards = async (_) => (await getTarotCards()).filter(card => card.type == `major`)

export default getMajorCards
