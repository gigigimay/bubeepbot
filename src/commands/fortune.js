import { exampleCommand, beep, withStar } from '../utilities/string'
import { sendError } from '../utilities/message'

import { getOneCardData, getMajorCards } from '../services/tarot'
import fortuneInfo from '../templates/fortuneInfo'
import { getRandomInt, getNotDuplicatedRandomNumbers } from '../utilities/number'

const MAJOR_CARDS_LENGTH = 22

const error = [
  beep('You may give bubeep a wrong type.'),
  exampleCommand('tarot normal or n!tarot single'),
]

const randomReverse = () => getRandomInt(1)
const randomCardNumber = () => getRandomInt(MAJOR_CARDS_LENGTH)
const getCardNumbers = getNotDuplicatedRandomNumbers(MAJOR_CARDS_LENGTH)

const drawManyCards = async amount => {
  const numberList = getCardNumbers(amount)
  const majorCards = await getMajorCards()
  const cardDataList = numberList.map(number => ({
    card: majorCards[number],
    isReversed: randomReverse(),
  }))
  return cardDataList
}

const drawOneCard = async () => {
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
      data = await drawManyCards(3)
      break
    case 'single':
      data = [await drawOneCard()]
      break
    default:
      data = null
    }

    if (data) {
      data.forEach(item => message.channel.send(fortuneInfo(item)))
    } else {
      message.channel.send(error)
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
