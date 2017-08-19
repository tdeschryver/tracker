const start = ({
  name = 'timer_started',
  startedAt = Date.now(),
  task = '',
  sequenceNumber = 1,
}) => ({
  name,
  task,
  startedAt,
  sequenceNumber,
})

const stop = ({
  name = 'timer_stopped',
  stoppedAt = Date.now(),
  task = '',
  sequenceNumber = 1,
}) => ({
  name,
  task,
  stoppedAt,
  sequenceNumber,
})

module.exports = { ...module.exports, start, stop }
