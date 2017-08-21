const seconds = value => value / 1000
const duration = (a, b) => a - b
const todayDate = () => {
  const date = new Date()
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}
const ONE_DAY = 24 * 60 * 60 * 1000

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

const totals = (events, checkFrom, checkTo) => {
  const times = timetable(events)
  return Object.keys(times).reduce((rpt, task) => {
    const taskEntries = times[task].filter(entry => {
      const entryFrom = entry[0]
      const entryTo = entry[1] || Date.now()

      const fromOutRange =
        checkFrom && entryFrom < checkFrom && entryTo < checkFrom
      const toOutRange = checkTo && entryFrom > checkTo && entryTo > checkTo

      return !fromOutRange && !toOutRange
    })

    return taskEntries.length
      ? [
          ...rpt,
          {
            task,
            totalSeconds: taskEntries.reduce((total, entry) => {
              const entryFrom = entry[0]
              const entryTo = entry[1] || Date.now()

              let from = Math.max(entryFrom, checkFrom || entryFrom)
              let to = Math.min(entryTo, checkTo || entryTo)
              return total + seconds(duration(to, from))
            }, 0),
            running: taskEntries[taskEntries.length - 1][1] === null,
          },
        ]
      : []
  }, [])
}

const status = events => {
  const lastEvent = events[events.length - 1]
  if (lastEvent && lastEvent.name === 'timer_started') {
    return {
      task: lastEvent.task,
      running: true,
      seconds: seconds(duration(Date.now(), lastEvent.startedAt)),
    }
  }

  return {
    task: '',
    running: false,
    seconds: 0,
  }
}

const total = events => totals(events)

const today = events => {
  const checker = todayDate()
  const tomorrow = checker + ONE_DAY
  return totals(events, checker, tomorrow)
}

module.exports = { ...module.exports, status, total, today }
