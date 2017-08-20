const { formatSeconds } = require('../../utils')

const printers = {
  status: ({ task, running, seconds }) => {
    if (running) {
      return `${task} been running for ${formatSeconds(seconds)}`
    }

    return 'Nothing being tracked.'
  },
  total: tasks =>
    tasks.reduce(
      (result, total, index) =>
        // eslint-disable-next-line
        `${result}${index ? '\n' : ''}${total.task}: ${formatSeconds(total.totalSeconds)}${total.running ? ' (still running)' : ''}`,     '',
    ),
}

module.exports = (report, input) => printers[report](input)
