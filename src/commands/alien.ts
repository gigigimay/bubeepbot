import { getQuestions } from '../services/alien'
import { Message, MessageReaction, ReactionCollector, ReactionEmoji, ReactionUserManager, User } from 'discord.js'
import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from '../types'
import { getRandomInt } from '../utilities/number'
import { ApplicationCommandOptionType } from 'discord-api-types'
import embed from '../templates/embed'
import { MessageEmbedImage, MessageAttachment } from 'discord.js'

let players: User[] = []
let alien: User | null = null

const execute: CommandExecution = ({ message, param }) => (
  message.channel.send('try /alien')
)

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  let content = ''
  if (interaction.options.getBoolean('see_rules')) {
    content += '🎯 RULES\n' +
      '1. One of you is an 👽 alien!\n' +
      '2. Every one will got the exactly same set of question but the alien will got a bit different\n' +
      '3. Each of you can ask another player one question using the question number eg. "Mr.A, please answer question number 1."\n' +
      '4. After every one asked and answered, guess who is the alien\n' +
      'See all possible questions here: https://docs.google.com/spreadsheets/d/1FId-8RNEedkMRCSEh9-agXmNB47ZsI_tW4q4_PNjitA/edit?usp=sharing\n'
  }
  content += '👽 LET\'S FIND AN ALIEN 👽\n🖐 to join & ▶️ to start'

  const message = await interaction.reply({
    content: content, fetchReply: true
  }) as Message
  message.react('▶️')
    .then(() => message.react('🖐'))
    .then(() => waitForNextReaction(message))
    .catch(error => console.error('One of the emojis failed to react:', error))
}

const filter = (reaction: MessageReaction) => {
  return ['🖐', '▶️'].includes(reaction.emoji.name ?? '')
}

const waitForNextReaction = (message: Message) => {
  message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'], })
    .then(async collected => {
      const reaction = collected.first()
      if (reaction?.emoji.name === '🖐') {
        reaction.users.fetch().then((users) => {
          players = Array.from(users.values()).filter((p) => !p.bot)
        })
      }
      else if (reaction?.emoji.name === '▶️') {
        if (players.length < 2) {
          message.reply('You can\'t play this alone, find some friend.')
          message.reply('https://media1.giphy.com/media/7mQbDHkoSsWl2/giphy.gif?cid=ecf05e475vw1gt3g5fqsvqjtnxe65kl8ps74os5fk8z5mdpj&rid=giphy.gif&ct=g')
          return
        }

        const alienIndex = getRandomInt(players.length - 1, 0)
        alien = players[alienIndex]
        players.splice(alienIndex)

        const questions = await getQuestions(players.length)
        sendHumanQuestions(questions.human)
        sendAlienQuestions(alien!, questions.alien)
      }

      waitForNextReaction(message)
    })
    .catch(collected => {
      message.reply('Timeout!!, this message will be expired.')
    })
}

const sendHumanQuestions = (questions: string[]) => {
  players.forEach((p) => {
    p.send(`🙂🙂🙂 YOU ARE A HUMAN 🙂🙂🙂\n${createQuestionText(questions)}`)
  })
}
const sendAlienQuestions = (user: User, questions: string[]) => {
  user.send(`👽👽👽 YOU ARE AN ALIEN 👽👽👽\n${createQuestionText(questions)}`)
}

const createQuestionText = (questions: string[]) => {
  let text = ''
  questions.forEach((question, index) => {
    text += `${index + 1}. ${question}\n`
  })
  return text
}

const command: Command = {
  name: 'alien',
  desc: 'Find the alien!',
  param: CommandParamType.Optional,
  options: [
    {
      name: 'see_rules',
      description: 'Do you want to see play rules?',
      type: ApplicationCommandOptionType.Boolean,
      isRequired: false
    }
  ],
  execute,
  interactionExecute,
}

export default command
