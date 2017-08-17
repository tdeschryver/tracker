const { now, formatSeconds } = require('./utils')

const seconds = (a, b) => (a - b) / 1000

const timetable = events =>
  events.reduce((report, event) => {
    report[event.task] = report[event.task] || []
    if (event.name === 'timer_started') {
      return {
        ...report,
        [event.task]: [...report[event.task], [event.startedAt, null]],
      }
    }

    if (event.name === 'timer_stopped') {
      return {
        ...report,
        [event.task]: report[event.task].map((entry, index) => {
          if (index === report[event.task].length - 1) {
            return Object.assign(
              [],
              report[event.task][report[event.task].length - 1],
              { 1: event.stoppedAt },
            )
          }
          return entry
        }),
      }
    }
  }, {})

const status = events => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_started') {
    const hhMMss = formatSeconds(seconds(now(), lastEvent.startedAt))
    return `${lastEvent.task} been running for ${hhMMss}.`
  }

  return 'Nothing being tracked.'
}

const total = events => {
  const times = timetable(events)
  return Object.keys(times)
    .reduce((rpt, task) => {
      let running = false
      const totalSeconds = times[task].reduce((total, entry) => {
        running = entry[1] === null
        total += seconds(entry[1] || now(), entry[0])
        return total
      }, 0)
      return [...rpt, { task, totalSeconds, running }]
    }, [])
    .reduce((result, total, index) => {
      // eslint-disable-next-line
      return `${result}${index ? '\n' : ''}${total.task}: ${formatSeconds(total.totalSeconds)}${total.running ? ' (still running)' : ''}`
    }, '')
}

module.exports = { ...module.exports, status, total }
