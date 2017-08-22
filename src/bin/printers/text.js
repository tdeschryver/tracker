const { formatSeconds } = require('../../utils')

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
  status: ({ task, running, seconds }) => {
    if (running) {
      return `${task} been running for ${formatSeconds(seconds)}`
    }

    return 'Nothing being tracked.'
  },
  total: summarize,
  today: summarize,
  timesheet: entries => timesheet(entries, date => date.toLocaleString()),
}

module.exports = (report, input) => printers[report](input)
