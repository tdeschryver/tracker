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
    return {
      task: lastEvent.task,
      running: true,
      seconds: seconds(Date.now(), lastEvent.startedAt),
    }
  }

  return {
    task: '',
    running: false,
    seconds: 0,
  }
}

const total = events => {
  const times = timetable(events)
  return Object.keys(times).reduce((rpt, task) => {
    const taskEntries = times[task]
    return [
      ...rpt,
      {
        task,
        totalSeconds: taskEntries.reduce(
          (total, entry) => total + seconds(entry[1] || Date.now(), entry[0]),
          0,
        ),
        running: taskEntries[taskEntries.length - 1][1] === null,
      },
    ]
  }, [])
}

module.exports = { ...module.exports, status, total }
