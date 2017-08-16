const { start: createStart, stop: createStop } = require('./events')

const start = ({ task }, events) => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.task === task) {
    return []
  }

  let currentSequenceNumber = (lastEvent && lastEvent.sequenceNumber) || 0
  if (lastEvent && lastEvent.name === 'timer_started') {
    return [
      createStop({
        task: lastEvent.task,
        sequenceNumber: ++currentSequenceNumber,
      }),
      createStart({
        task,
        sequenceNumber: ++currentSequenceNumber,
      }),
    ]
  }

  return [
    createStart({
      task: task,
      sequenceNumber: ++currentSequenceNumber,
    }),
  ]
}

const stop = (data, events) => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_stopped') {
    return []
  }

  const currentSequenceNumber = (lastEvent && lastEvent.sequenceNumber) || 0
  return [
    createStop({
      task: lastEvent.task,
      sequenceNumber: currentSequenceNumber + 1,
    }),
  ]
}

module.exports = { ...module.exports, start, stop }
