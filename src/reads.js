const { log, now } = require('./utils')

const seconds = (a, b) => (a - b) / 1000

const timetable = events =>
  events.reduce((report, event) => {
    report[event.task] = report[event.task] || []
    if (event.name === 'timer_started') {
      report[event.task] = [...report[event.task], [event.startedAt, null]]
      return report
    }

    if (event.name === 'timer_stopped') {
      report[event.task][
        report[event.task].length - 1
      ] = Object.assign([], report[event.task][report[event.task].length - 1], {
        1: event.stoppedAt,
      })
      return report
    }
  }, {})

const status = events => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_started') {
    const secondsElapsed = seconds(now(), lastEvent.startedAt)
    log(`${lastEvent.task} been running for ${secondsElapsed} seconds.`)
    return
  }

  log('Nothing being tracked.')
}

const total = events => {
  const times = timetable(events)
  Object.keys(times)
    .reduce((rpt, task) => {
      let running = false
      const totalSeconds = times[task].reduce((total, entry) => {
        running = entry[1] === null
        total += seconds(entry[1] || now(), entry[0])
        return total
      }, 0)

      rpt.push({ task, totalSeconds, running })
      return rpt
    }, [])
    .forEach(total => {
      log(
        `${total.task}: ${total.totalSeconds} seconds${total.running
          ? ' (still running)'
          : ''}.`,
      )
    })
}

module.exports = { ...module.exports, status, total }
