const fs = require('fs')
const test = require('tape-async')
const sinon = require('sinon')
const utils = require('../src/utils')
const tracker = require('../src')

const setup = async fileName => {
  return {
    stubs: [sinon.stub(utils, 'now').callsFake(() => 1502829303096)],
    fixture: await read(`./tests/fixtures/${fileName}.json`),
  }
}
const teardown = stubs => {
  stubs.forEach(stub => stub.restore())
}

const read = file =>
  new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })

test('status with no tasks', async assert => {
  const { stubs, fixture } = await setup('status-empty')
  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg =>
        assert.equal(msg, 'Nothing being tracked.', 'should show nothing'),
    },
  )

  teardown(stubs)
})

test('status with a running task', async assert => {
  const { stubs, fixture } = await setup('status-running')

  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg =>
        assert.equal(
          msg,
          'foo been running for 07h54m42s.',
          'should show running task with duration',
        ),
    },
  )

  teardown(stubs)
})

test('status with a stopped task', async assert => {
  const { stubs, fixture } = await setup('status-stopped')

  tracker(
    {
      command: 'status',
      history: fixture,
    },
    {
      message: msg =>
        assert.equal(msg, 'Nothing being tracked.', 'should show nothing'),
    },
  )

  teardown(stubs)
})

test('total', async assert => {
  const { stubs, fixture } = await setup('total')

  tracker(
    {
      command: 'total',
      history: fixture,
    },
    {
      message: msg =>
        assert.equal(msg, 'foo: 01h59m01s\nbar: 04s', 'should add up per task'),
    },
  )

  teardown(stubs)
})
