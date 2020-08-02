import { MessageEmbed } from 'discord.js'
import { TarotCard } from './../types'
import embed from './embed'

const fortuneInfo = (cardData:{card:TarotCard, isReversed:boolean}):{embed: MessageEmbed} => {
  const { card, isReversed } = cardData

  return embed({
    author: null,
    title: `#${card.value_int} - ${card.name} ${
      isReversed ? '- Reversed' : ''
    }`,
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
