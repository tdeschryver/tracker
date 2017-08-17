const store = require('./store')
const tracker = require('../')

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const track = ({ file, command, task }) => {
  if (!store.exists(file)) {
    store.create(file)
  }

  const cmd = {
    command,
    data: {
      task,
    },
    history: store.read(file),
  }

  const log = value => process.stdout.write(`${value}\n`)
  tracker(cmd, {
    message: log,
    error: log,
    events: events => store.append(file, events),
  })
}

module.exports = { ...module.exports, track, defaultFile }
