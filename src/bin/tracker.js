const eventstore = require('./eventstore')
const {
  errorFormatter,
  infoFormatter,
  grayFormatter,
} = require('./logger/formatter')
const logger = require('./logger')
const printer = require('./printers')('text')
const tracker = require('../')
const { TIMER_STARTED, TIMER_STOPPED } = require('../events').default

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const history = file => {
  if (eventstore.exists(file)) {
    return eventstore.read(file)
  }

  eventstore.create(file)
  return []
}

const handleEvents = events => {
  events.forEach(({ name, task }) => {
    switch (name) {
      case TIMER_STARTED:
        logger.log(`Started ${task}`, infoFormatter)
        break
      case TIMER_STOPPED:
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

  const originalVersion = history.length
    ? history[history.length - 1].sequenceNumber
    : -1

  try {
    tracker(cmd, {
      message: msg => {
        logger.log(printer(command, msg), grayFormatter)
      },
      events: events => {
        eventstore.append(file, events, originalVersion)
        handleEvents(events)
      },
    })
  } catch (err) {
    logger.log(err, errorFormatter)
    process.exitCode = 1
  }
}

module.exports = { ...module.exports, track, history, defaultFile }
