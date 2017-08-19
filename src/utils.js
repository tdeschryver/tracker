const pad = (value, { padder = '0', count = 2 } = {}) =>
  `${padder}${value}`.slice(-count)

const formatSeconds = value => {
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor(value % 3600 / 60)
  const seconds = Math.floor(value % 3600 % 60)

  const format = (value, suffix) => (value ? `${pad(value)}${suffix}` : '')
  return `${format(hours, 'h')}${format(minutes, 'm')}${format(seconds, 's')}`
}

module.exports = { ...module.exports, pad, formatSeconds }
