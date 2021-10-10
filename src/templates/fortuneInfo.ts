import { MessageEmbed } from 'discord.js'
import { TarotCard } from './../types'
import embed from './embed'

const fortuneInfo = (cardData: { card: TarotCard, isReversed: boolean }): MessageEmbed => {
  const { card, isReversed } = cardData
  const title = `#${card.value_int} - ${card.name} ${isReversed ? '- Reversed' : ''}`
  return embed({
    author: null,
    title,
    fields: [
      {
        name: 'Meaning',
        value: isReversed ? card.meaning_rev : card.meaning_up,
      },
    ],
    thumbnail: null,
  })
}

export default fortuneInfo
