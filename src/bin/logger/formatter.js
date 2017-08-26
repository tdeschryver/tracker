const reset = '\u001b[0m'
const colors = {
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  gray: '\u001b[90m',
}

const format = (ansi, message) => `${ansi}${message}${reset}`

module.exports = {
  ...module.exports,
  defaultFormatter: message => format(reset, message),
  infoFormatter: message => format(colors.cyan, message),
  successFormatter: message => format(colors.green, message),
  warningFormatter: message => format(colors.yellow, message),
  errorFormatter: message => format(colors.red, message),
  grayFormatter: message => format(colors.gray, message),
}
