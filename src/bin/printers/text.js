const { formatSeconds } = require('../../utils')
const {
  STATUS,
  SUMMARY,
  SUMMARY_TODAY,
  TIMESHEET,
  TIMESHEET_TODAY,
} = require('../../queries').default

const summarize = tasks =>
  tasks
    .map(
      ({ task, totalSeconds, running }) =>
        `${task}: ${formatSeconds(totalSeconds)}${running
          ? ' (still running)'
          : ''}`,
    )
    .join('\n')

const timesheet = (entries, formatter) =>
  entries
    .map(
      ({ task, from, to }) =>
        `[${from ? formatter(new Date(from)) : '...'} - ${to
          ? formatter(new Date(to))
          : '...'}]: ${task}`,
    )
    .join('\n')

const printers = {
  [STATUS]: ({ task, running, seconds }) => {
    if (running) {
      return `${task} been running for ${formatSeconds(seconds)}`
    }

    return 'Nothing being tracked.'
  },
  [SUMMARY]: summarize,
  [SUMMARY_TODAY]: summarize,
  [TIMESHEET]: entries => timesheet(entries, date => date.toLocaleString()),
  [TIMESHEET_TODAY]: entries =>
    timesheet(entries, date => date.toLocaleTimeString()),
}

module.exports = (report, input) => printers[report](input)
