import { exampleCommand, beep, withStar } from "../utilities/string";
import { sendError } from "../utilities/message";

import { getOneCardData, getMajorCards } from "../services/tarot";
import fortuneInfo from "../templates/fortuneInfo";

const error = [
  beep("You may give bubeep a wrong type."),
  exampleCommand('"tarot normal" or "tarot single"'),
]

const randomCardNumber = () => Math.floor(Math.random() * 22)
const randomReverse = () => Math.floor(Math.random() >= 0.5)

const getNotDuplicatedNumberList = (amount) => {
  const NumberList = []
  do{
    const _cardNumber = randomCardNumber()
    if(!NumberList.includes(_cardNumber))
      { NumberList.push(_cardNumber) }
  }while(NumberList.length < amount)
  return NumberList
}

const drawManyCard = async (amount) => {
  const _numberList = getNotDuplicatedNumberList(amount)
  const _majorCards = await getMajorCards()
  const _cardDataList = _numberList.map((number)=> {
    return { card: _majorCards[number] ,isReversed: randomReverse() }})
  return Object.values(_cardDataList);
}

const drawCard = async () => {
  const card = await getOneCardData(randomCardNumber())
  const isReversed = randomReverse()
  return { card, isReversed };
}

const execute = async (message, param = "normal") => {
  message.channel.send("let me see. hmm...")
  try {
    let data;
    switch (param) {
      case "normal":
        data = await drawManyCard(3)
        break;
      case "single":
        data = [await drawCard()]
        break;
      default:
        data = null
    }

    if (data) {
      data.forEach((item) => message.channel.send(fortuneInfo(item)))
    } else {
      message.channel.send("no card draw.")
    }
  } catch (e) {
    sendError(e, message, `${withStar("BEEPBOOP")} Something Error O_o`)
  }
}

export default {
  name: "fortune",
  desc: "Let me read your mind then represent it as a card. ",
  cooldown: 5,
  param: 1, // 0: no param, 1: optional, 2: required
  execute,
}
