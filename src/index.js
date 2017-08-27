const commands = require('./commands').default
const queries = require('./queries').default

module.exports = ({ command, data, history }, { message, events }) => {
  if (Object.values(commands).includes(command)) {
    events(require('./commands')[command](data, history))
    return
  }

  if (Object.values(queries).includes(command)) {
    message(require('./queries')[command](history))
    return
  }

  throw new Error(`Command ${command} not found.`)
}
