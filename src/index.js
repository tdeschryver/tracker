module.exports = ({ command, data, history }, { message, events }) => {
  switch (command) {
    case 'start':
    case 'stop':
      events(require('./commands')[command](data, history))
      break
    case 'status':
    case 'total':
    case 'today':
    case 'timesheet':
    case 'timesheettoday':
      message(require('./queries')[command](history))
      break
    default:
      throw new Error(`Command ${command} not found.`)
  }
}
