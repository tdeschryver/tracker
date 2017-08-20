const store = require('./store')
const {
  errorFormatter,
  infoFormatter,
  grayFormatter,
} = require('./logger/formatter')
const logger = require('./logger')
const printer = require('./printers')('text')
const tracker = require('../')

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const history = file => {
  if (store.exists(file)) {
    return store.read(file)
  }

  store.create(file)
  return []
}

const handleEvents = events => {
  events.forEach(({ name, task }) => {
    switch (name) {
      case 'timer_started':
        logger.log(`Started ${task}`, infoFormatter)
        break
      case 'timer_stopped':
        logger.log(`Stopped ${task}`, infoFormatter)
        break
    }
  })
}

const track = ({ file, command, task, history }) => {
  const cmd = {
    command,
    data: {
      task,
    },
    history,
  }

  tracker(cmd, {
    message: msg => {
      logger.log(printer(command, msg), grayFormatter)
    },
    error: err => {
      logger.log(err, errorFormatter)
      process.exitCode = 1
    },
    events: events => {
      store.append(file, events)
      handleEvents(events)
    },
  })
}

module.exports = { ...module.exports, track, history, defaultFile }
