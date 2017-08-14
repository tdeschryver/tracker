const store = require('./store')

module.exports = async ({ command, data, file = '/.tracker-store.json' }) => {
  if (!await store.exists(file)) {
    await store.create(file)
  }
  const events = await store.read(file)

  switch (command) {
    case 'start':
    case 'stop':
      require('./writes')[command](data, events, file)
      break
    case 'status':
      require('./reads')[command](events)
      break
    default:
      require('./utils').log(`Command ${command} not found.`)
      break
  }
}
