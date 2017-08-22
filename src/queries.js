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

const totalRecuder = (task, entries) => ({
  task,
  totalSeconds: entries.reduce(
    (total, [from, to]) => total + seconds(duration(to || Date.now(), from)),
    0,
  ),
  running: entries[entries.length - 1][2],
})

const timesheetReducer = (task, entries) =>
  entries.map(([from, to]) => ({
    task,
    from,
    to,
  }))

const totals = (events, recuder, checkFrom, checkTo) => {
  const times = timetable(events)
  return Object.keys(times).reduce((rpt, task) => {
    const taskEntries = times[task]
      .filter(entry => {
        const entryFrom = entry[0]
        const entryTo = entry[1] || Date.now()

        const fromOutRange =
          checkFrom && entryFrom < checkFrom && entryTo < checkFrom
        const toOutRange = checkTo && entryFrom > checkTo && entryTo > checkTo

        return !fromOutRange && !toOutRange
      })
      .map(([from, to]) => [
        Math.max(from, checkFrom || from),
        Math.min(to, checkTo || to),
        to === null,
      ])

    return taskEntries.length ? rpt.concat(recuder(task, taskEntries)) : rpt
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

const total = events => totals(events, totalRecuder)

const today = events => {
  const from = todayDate()
  const to = from + ONE_DAY
  return totals(events, totalRecuder, from, to)
}

const timesheet = events =>
  totals(events, timesheetReducer).sort(
    ({ from: fromA }, { from: fromB }) => fromA - fromB,
  )

module.exports = {
  ...module.exports,
  status,
  total,
  today,
  timesheet,
}
