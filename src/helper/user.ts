import { User } from 'discord.js'

export const getAvatarUrl = (user: User): string => user.displayAvatarURL()
