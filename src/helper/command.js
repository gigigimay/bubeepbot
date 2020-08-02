export const getCommand = (name, message) => {
  const { commands } = message.client
  return commands.get(name)
    || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))
}
