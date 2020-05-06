export const getCommandTarget = (message, param = '') => {
  const { author, mentions } = message
  const tagged = mentions.users.first()
  const target = tagged || author
  const aimed = param.match(/@/)
  return {
    target,
    aimed,
    tagged,
  }
}
