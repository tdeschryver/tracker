const fs = require('fs')

const exists = file => fs.existsSync(file)
const create = file => fs.writeFileSync(file, JSON.stringify([], null, 2))
const append = async (file, events) => {
  let store = read(file)
  store = store.concat(events)
  fs.writeFileSync(file, JSON.stringify(store, null, 2), { encoding: 'utf-8' })
}
const read = file => JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))

module.exports = { ...module.exports, read, exists, create, append }
