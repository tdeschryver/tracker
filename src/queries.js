const { TIMER_STARTED, TIMER_STOPPED } = require('./events').default

const STATUS = 'status'
const SUMMARY = 'summary'
const SUMMARY_TODAY = 'summary_today'
const TIMESHEET = 'timesheet'
const TIMESHEET_TODAY = 'timesheet_today'

const ONE_DAY = 24 * 60 * 60 * 1000

const seconds = value => value / 1000
const duration = (a, b) => a - b
const todayDate = () => {
  const date = new Date()
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

const timetable = events =>
  events.reduce((report, event) => {
    report[event.task] = report[event.task] || []
    if (event.name === TIMER_STARTED) {
      return {
        ...report,
        [event.task]: [...report[event.task], [event.startedAt, null]],
      }
    }

    if (event.name === TIMER_STOPPED) {
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
  if (lastEvent && lastEvent.name === TIMER_STARTED) {
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

const summary = (events, from, to) =>
  totals(
    events,
    (task, entries) => ({
      task,
      totalSeconds: entries.reduce(
        (total, [from, to]) =>
          total + seconds(duration(to || Date.now(), from)),
        0,
      ),
      running: entries[entries.length - 1][2],
    }),
    from,
    to,
  )

const summaryToday = events => {
  const from = todayDate()
  const to = from + ONE_DAY
  return summary(events, from, to)
}

const timesheet = (events, from, to) =>
  totals(
    events,
    (task, entries) =>
      entries.map(([from, to]) => ({
        task,
        from,
        to,
      })),
    from,
    to,
  ).sort(({ from: fromA }, { from: fromB }) => fromA - fromB)

const timesheetToday = events => {
  const from = todayDate()
  const to = from + ONE_DAY
  return timesheet(events, from, to)
}

module.exports = {
  ...module.exports,
  default: {
    STATUS,
    SUMMARY,
    SUMMARY_TODAY,
    TIMESHEET,
    TIMESHEET_TODAY,
  },
  [STATUS]: status,
  [SUMMARY]: summary,
  [SUMMARY_TODAY]: summaryToday,
  [TIMESHEET]: timesheet,
  [TIMESHEET_TODAY]: timesheetToday,
}
