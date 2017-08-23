const start = ({
  name = 'timer_started',
  startedAt = Date.now(),
  task = '',
}) => ({
  name,
  task,
  startedAt,
})

const stop = ({
  name = 'timer_stopped',
  stoppedAt = Date.now(),
  task = '',
}) => ({
  name,
  task,
  stoppedAt,
})

module.exports = { ...module.exports, start, stop }
