import {
  CommandInteraction,
  VoiceChannel,
  StageChannel,
  GuildMember
} from 'discord.js'

export const getVoiceChannel = (interaction: CommandInteraction): VoiceChannel | StageChannel | null | undefined => (interaction.member as GuildMember)?.voice.channel
export const getAuthorUsername = (interaction: CommandInteraction): string => (interaction.member as GuildMember)?.user.username
export const getAuthorNickname = (interaction: CommandInteraction): string | null | undefined => (interaction.member as GuildMember)?.nickname
