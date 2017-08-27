const fs = require('fs')
const eventstore = require('../eventstore')

const stringify = value => JSON.stringify(value, null, 2)

const exists = file => fs.existsSync(file)
const create = file => fs.writeFileSync(file, stringify([], null, 2))
const read = file => JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))
const append = (file, events, expectedVersion) => {
  const store = read(file)
  eventstore.append(
    () => store,
    events =>
      fs.writeFileSync(file, stringify(store.concat(events), null, 2), {
        encoding: 'utf-8',
      }),
    events,
    expectedVersion,
  )
}

module.exports = { ...module.exports, read, exists, create, append }
