import { exampleCommand, beep, withStar } from '../utilities/string'
import { sendError } from '../utilities/message'

import { getOneCardData, getMajorCards } from '../services/tarot'
import fortuneInfo from '../templates/fortuneInfo'

const error = [
  beep('You may give bubeep a wrong type.'),
  exampleCommand('"tarot normal" or "tarot single"'),
]

const drawCard = async () => {
  const cardNumber = Math.floor(Math.random() * 22)
  const isReversed = Math.floor(Math.random() >= 0.5)
  const cardData = await getOneCardData(cardNumber, isReversed)
  return { ...cardData }
}

const drawManyCard = async amount => {
  const cardDataDict = {}
  const majorCards = await getMajorCards()
  do {
    const cardNumber = Math.floor(Math.random() * 22)

    if (!cardDataDict[cardNumber]) {
      cardDataDict[cardNumber] = {
        card: majorCards.find(item => item.value_int === cardNumber),
        isReversed: Math.floor(Math.random() >= 0.5),
      }
    }
  }
  while (Object.keys(cardDataDict).length < amount)
  return Object.values(cardDataDict)
}

const execute = async (message, param = 'normal') => {
  if (!param) return message.channel.send(error)
  message.channel.send('let me see. hmm...')
  try {
    let data
    switch (param) {
    case 'normal': data = await drawManyCard(3)
      break
    case 'single': data = [await drawCard()]
      break
    default: data = null
    }

    if (data.length) {
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
