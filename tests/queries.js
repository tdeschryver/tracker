const fs = require('fs')
const test = require('tape-async')
const sinon = require('sinon')
const tracker = require('../src')

const setup = async fileName => {
  return {
    stubs: [sinon.useFakeTimers(1502829303096)],
    fixture: await read(`./tests/fixtures/${fileName}.json`),
  }
}

const teardown = stubs => {
  stubs.forEach(stub => stub.restore())
}

test('status with no tasks', async assert => {
  const { stubs, fixture } = await setup('status-empty')
  const expected = { task: '', running: false, seconds: 0 }

  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg => assert.deepEqual(msg, expected, 'should show nothing'),
    },
  )

  teardown(stubs)
})

test('status with a running task', async assert => {
  const { stubs, fixture } = await setup('status-running')
  const expected = { task: 'foo', running: true, seconds: 28482.014 }

  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg =>
        assert.deepEqual(
          msg,
          expected,
          'should show running task with duration',
        ),
    },
  )

  teardown(stubs)
})

test('status with a stopped task', async assert => {
  const { stubs, fixture } = await setup('status-stopped')
  const expected = { task: '', running: false, seconds: 0 }

  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg => assert.deepEqual(msg, expected, 'should show nothing'),
    },
  )

  teardown(stubs)
})

test('total', async assert => {
  const { stubs, fixture } = await setup('total')
  const expected = [
    { task: 'foo', totalSeconds: 7141.147999999999, running: false },
    { task: 'bar', totalSeconds: 4.043, running: false },
  ]

  tracker(
    {
      command: 'total',
      history: fixture,
    },
    {
      message: msg => assert.deepEqual(msg, expected),
    },
  )

  teardown(stubs)
})

const read = file =>
  new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
