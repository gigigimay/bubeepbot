import { CommandExecution, TarotCard, Command, CommandParamType } from './../types'
import { exampleCommand, beep, withStar } from '../utilities/string'
import { sendError } from '../helper/message'

import { getOneCardData, getMajorCards } from '../services/tarot'
import fortuneInfo from '../templates/fortuneInfo'
import {
  getRandomInt,
  getNotDuplicatedRandomNumbers,
} from '../utilities/number'

const MAJOR_CARDS_LENGTH = 22

const error = [
  beep('You may give bubeep a wrong type.'),
  exampleCommand('tarot normal or n!tarot single'),
]

const randomReverse = (): boolean => getRandomInt(1) === 0
const randomCardNumber = (): number => getRandomInt(MAJOR_CARDS_LENGTH - 1)
const getCardNumbers = getNotDuplicatedRandomNumbers(MAJOR_CARDS_LENGTH - 1)

interface Card {
  card: TarotCard
  isReversed: boolean
}

const drawManyCards = async (amount: number): Promise<Card[]> => {
  const numberList = getCardNumbers(amount)
  const majorCards = await getMajorCards()
  const cardDataList = numberList.map((number) => ({
    card: majorCards[number],
    isReversed: randomReverse(),
  }))
  return cardDataList
}

const drawOneCard = async (): Promise<Card> => {
  const card = await getOneCardData(randomCardNumber())
  const isReversed = randomReverse()
  return { card, isReversed }
}

const execute: CommandExecution = async ({ message, param = 'normal' }) => {
  await message.channel.send('let me see. hmm...')
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
      data.forEach((item) => {
        message.channel.send(fortuneInfo(item))
      })
    } else {
      await message.channel.send(error)
    }
  } catch (e) {
    await sendError(e, message, `${withStar('BEEPBOOP')} Something Error O_o`)
  }
}
const command: Command = {
  name: 'fortune',
  desc: 'Let me read your mind then represent it as a card. ',
  cooldown: 5,
  param: CommandParamType.Optional,
  execute,
}

export default command
