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

module.exports = {
  ...module.exports,
  defaultFormatter: message => `${reset}${message}${reset}`,
  infoFormatter: message => `${colors.cyan}${message}${reset}`,
  successFormatter: message => `${colors.green}${message}${reset}`,
  warningFormatter: message => `${colors.yellow}${message}${reset}`,
  errorFormatter: message => `${colors.red}${message}${reset}`,
  grayFormatter: message => `${colors.gray}${message}${reset}`,
}
