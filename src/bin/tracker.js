const store = require('./store')
const tracker = require('../')

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const history = file => {
  if (store.exists(file)) {
    return store.read(file)
  }

  store.create(file)
  return []
}

const track = ({ file, command, task, history }) => {
  const cmd = {
    command,
    data: {
      task,
    },
    history,
  }

  const log = value => process.stdout.write(`${value}\n`)
  tracker(cmd, {
    message: log,
    error: log,
    events: events => store.append(file, events),
  })
}

module.exports = { ...module.exports, track, history, defaultFile }
