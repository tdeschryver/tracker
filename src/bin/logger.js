const { defaultFormatter } = require('./logger-formatter')

const log = (message, formatter = defaultFormatter) =>
  process.stdout.write(`${formatter(message)}\n`)

module.exports = { ...module.exports, log }
