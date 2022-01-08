import { randomInt } from 'crypto';
import { Message, MessageReaction, ReactionCollector, ReactionEmoji, ReactionUserManager, User } from 'discord.js';
import { identity, List } from 'lodash';
import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from '../types'
import { exampleCommand, beep } from '../utilities/string'
import { getRandomInt } from '../utilities/number'

let players: User[] = []

const execute: CommandExecution = ({ message, param }) => (
  // message.channel.send(getContent(param))
  message.channel.send('alien~')
)

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  const message = await interaction.reply({ content: '👾 ALIEN GAME👾\nreact 🖐 to play and ▶️ to start', fetchReply: true }) as Message;
  message.react('🖐')
    .then(() => message.react('▶️'))
    .then(() => waitForNextReaction(message))
    .catch(error => console.error('One of the emojis failed to react:', error));


}

const filter = (reaction: MessageReaction) => {
  return ['🖐', '▶️'].includes(reaction.emoji.name ?? '');
};

const waitForNextReaction = (message: Message) => {
  message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'], })
    .then(collected => {
      const reaction = collected.first();
      if (reaction?.emoji.name === '🖐') {
        reaction.users.fetch().then((users) => {
          console.log(users.keys())
          players = Array.from(users.values()).filter((p) => !p.bot)
        })
      }
      else if (reaction?.emoji.name === '▶️') {
        console.log(players)
        const alienIndex = getRandomInt(players.length - 1, 0)
        console.log(alienIndex)
        const alien = players[alienIndex]
        players.splice(alienIndex)

        const question = getQuestions()

        sendHumanQuestions(question[0])
        sendAlienQuestions(alien!, question[1])
      }

      waitForNextReaction(message)
    })
    .catch(collected => {
      message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
    });
}

const sendHumanQuestions = (question: string[]) => {
  players.forEach((p) => {
    p.send("You are humans")
  })
}
const sendAlienQuestions = (user: User, question: string[]) => {
  user.send("You are alien")
}

const getQuestions = (): [humanQ: string[], alienQ: string[]] => {
  return [['a'], ['b']]
}

const command: Command = {
  name: 'alien',
  desc: 'find the alien',
  param: CommandParamType.None,
  execute,
  interactionExecute,
}

export default command
