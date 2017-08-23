const fs = require('fs')
const test = require('tape')
const eventstore = require('../src/eventstore')

const fixture = JSON.parse(fs.readFileSync('./tests/fixtures/eventstore.json'))
const fixtureEmpty = JSON.parse(
  fs.readFileSync('./tests/fixtures/eventstore-empty.json'),
)

test('append()', assert => {
  assert.doesNotThrow(() => {
    eventstore.append(() => fixture, () => {}, [], 0)
  })

  assert.doesNotThrow(() => {
    eventstore.append(() => [], () => {}, [], -1)
  })
  assert.end()
})

test("append() throws an error when expected sequence isn't the latest sequence", assert => {
  assert.throws(() => {
    eventstore.append(() => fixture, () => {}, [], 1)
  })

  assert.throws(() => {
    eventstore.append(() => fixtureEmpty, () => {}, [], 1)
  })
  assert.end()
})
