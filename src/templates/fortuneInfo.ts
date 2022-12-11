import { APIEmbed } from 'discord.js'
import { TarotCard } from './../types'
import embed from './embed'

const fortuneInfo = (cardData: { card: TarotCard, isReversed: boolean }): APIEmbed => {
  const { card, isReversed } = cardData
  const title = `#${card.value_int} - ${card.name} ${isReversed ? '- Reversed' : ''}`
  return embed({
    author: undefined,
    title,
    fields: [
      {
        name: 'Meaning',
        value: isReversed ? card.meaning_rev : card.meaning_up,
      },
    ],
    thumbnail: undefined,
  })
}

export default fortuneInfo
