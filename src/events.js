const TIMER_STARTED = 'timer_started'
const TIMER_STOPPED = 'timer_stopped'

const start = ({ startedAt = Date.now(), task = '' }) => ({
  name: TIMER_STARTED,
  task,
  startedAt,
})

const stop = ({ stoppedAt = Date.now(), task = '' }) => ({
  name: TIMER_STOPPED,
  task,
  stoppedAt,
})

module.exports = {
  ...module.exports,
  default: {
    TIMER_STARTED,
    TIMER_STOPPED,
  },
  start,
  stop,
}
