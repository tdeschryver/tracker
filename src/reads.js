const { log, now } = require('./utils')

const status = events => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_started') {
    const timeElapsed = now() - lastEvent.startedAt
    log(`${lastEvent.task} been running for ${timeElapsed / 1000} seconds.`)
  } else {
    log('Nothing being tracked.')
  }
}

module.exports = { ...module.exports, status }
