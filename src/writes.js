const { start: startEvent, stop: stopEvent } = require('./events')
const { log } = require('./utils')

const start = async (data, events, file) => {
  const lastEvent = events[events.length - 1]
  let currentSequenceNumber = (lastEvent && lastEvent.sequenceNumber) || 0

  if (lastEvent && lastEvent.task === data.task) {
    log(`[${data.task}]: already running`)
    return
  }

  if (lastEvent && lastEvent.name === 'timer_started') {
    await stopEvent(
      { task: lastEvent.task, sequenceNumber: ++currentSequenceNumber },
      file,
    )
  }
  await startEvent(
    { task: data.task, sequenceNumber: ++currentSequenceNumber },
    file,
  )
}

const stop = async (data, events, file) => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_stopped') {
    return
  }

  let currentSequenceNumber = (lastEvent && lastEvent.sequenceNumber) || 0

  await stopEvent(
    { task: lastEvent.task, sequenceNumber: currentSequenceNumber + 1 },
    file,
  )
}

module.exports = { ...module.exports, start, stop }
