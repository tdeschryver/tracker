const { now } = require('./utils')

const start = ({
  name = 'timer_started',
  startedAt = now(),
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
  stoppedAt = now(),
  task = '',
  sequenceNumber = 1,
}) => ({
  name,
  task,
  stoppedAt,
  sequenceNumber,
})

module.exports = { ...module.exports, start, stop }
