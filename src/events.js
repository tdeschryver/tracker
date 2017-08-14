const store = require('./store')
const { log, now } = require('./utils')

const start = async (
  { name = 'timer_started', startedAt = now(), task = '', sequenceNumber = 1 },
  file,
) => {
  await store.append({ name, task, startedAt, sequenceNumber }, file)
  log(`[${task}]: started`)
}

const stop = async (
  { name = 'timer_stopped', stoppedAt = now(), task = '', sequenceNumber = 1 },
  file,
) => {
  await store.append({ name, stoppedAt, sequenceNumber }, file)
  log(`[${task}]: stopped`)
}

module.exports = { ...module.exports, start, stop }
