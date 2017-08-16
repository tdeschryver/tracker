module.exports = ({ command, data, history }, { message, events, error }) => {
  switch (command) {
    case 'start':
    case 'stop':
      events(require('./commands')[command](data, history))
      break
    case 'status':
    case 'total':
      message(require('./queries')[command](history))
      break
    default:
      error(`Command ${command} not found.`)
      break
  }
}
