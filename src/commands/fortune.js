import { withStar } from '../utilities/string'
import { sendError } from '../utilities/message'

import { getOneCardData, getMajorCards } from '../services/tarot'
import fortuneInfo from '../templates/fortuneInfo'

const randomCardNumber = () => Math.floor(Math.random() * 22)
const randomReverse = () => Math.floor(Math.random() >= 0.5)

const getNotDuplicatedNumberList = amount => {
  const numberList = []
  do {
    const cardNumber = randomCardNumber()
    if (!numberList.includes(cardNumber)) {
      numberList.push(cardNumber)
    }
  } while (numberList.length < amount)
  return numberList
}

const drawManyCard = async amount => {
  const numberList = getNotDuplicatedNumberList(amount)
  const majorCards = await getMajorCards()
  const cardDataList = numberList.map(number => ({
    card: majorCards[number],
    isReversed: randomReverse(),
  }))
  return Object.values(cardDataList)
}

const drawCard = async () => {
  const card = await getOneCardData(randomCardNumber())
  const isReversed = randomReverse()
  return { card, isReversed }
}

const execute = async (message, param = 'normal') => {
  message.channel.send('let me see. hmm...')
  try {
    let data
    switch (param) {
    case 'normal':
      data = await drawManyCard(3)
      break
    case 'single':
      data = [await drawCard()]
      break
    default:
      data = null
    }

    if (data) {
      data.forEach(item => message.channel.send(fortuneInfo(item)))
    } else {
      message.channel.send('no card draw.')
    }
  } catch (e) {
    sendError(e, message, `${withStar('BEEPBOOP')} Something Error O_o`)
  }
}

export default {
  name: 'fortune',
  desc: 'Let me read your mind then represent it as a card. ',
  cooldown: 5,
  param: 1, // 0: no param, 1: optional, 2: required
  execute,
}
