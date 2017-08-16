const { start: createStart, stop: createStop } = require('./events')

const start = (data, events) => {
  const lastEvent = events[events.length - 1]
  let currentSequenceNumber = (lastEvent && lastEvent.sequenceNumber) || 0

  if (lastEvent && lastEvent.task === data.task) {
    return []
  }

  if (lastEvent && lastEvent.name === 'timer_started') {
    return [
      createStop({
        task: lastEvent.task,
        sequenceNumber: ++currentSequenceNumber,
      }),
      createStart({
        ...data,
        task: data.task,
        sequenceNumber: ++currentSequenceNumber,
      }),
    ]
  }

  return [
    createStart({
      task: data.task,
      sequenceNumber: ++currentSequenceNumber,
      ...data,
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
      ...data,
      task: lastEvent.task,
      sequenceNumber: currentSequenceNumber + 1,
    }),
  ]
}

module.exports = { ...module.exports, start, stop }
