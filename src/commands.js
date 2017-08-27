const {
  default: { TIMER_STARTED, TIMER_STOPPED },
  start: createStart,
  stop: createStop,
} = require('./events')

const START = 'start'
const STOP = 'stop'

const start = ({ task }, events) => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.task === task) {
    return []
  }

  if (lastEvent && lastEvent.name === TIMER_STARTED) {
    return [
      createStop({
        task: lastEvent.task,
      }),
      createStart({
        task,
      }),
    ]
  }

  return [
    createStart({
      task: task,
    }),
  ]
}

const stop = (data, events) => {
  if (!events.length) {
    return []
  }

  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === TIMER_STOPPED) {
    return []
  }

  return [
    createStop({
      task: lastEvent.task,
    }),
  ]
}

module.exports = {
  ...module.exports,
  default: {
    START,
    STOP,
  },
  [START]: start,
  [STOP]: stop,
}
