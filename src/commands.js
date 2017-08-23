const { start: createStart, stop: createStop } = require('./events')

const start = ({ task }, events) => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.task === task) {
    return []
  }

  if (lastEvent && lastEvent.name === 'timer_started') {
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
  if (lastEvent && lastEvent.name === 'timer_stopped') {
    return []
  }

  return [
    createStop({
      task: lastEvent.task,
    }),
  ]
}

module.exports = { ...module.exports, start, stop }
