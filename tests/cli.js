const test = require('tape')
const sinon = require('sinon')
const store = require('../src/bin/store')
const logger = require('../src/bin/logger')
const cli = require('../src/bin/tracker')

const setup = () => ({
  stubs: [sinon.stub(store, 'append').callsFake()],
  logSpy: sinon.spy(logger, 'log'),
})

const teardown = ({ stubs, logSpy }) => {
  stubs.forEach(stub => stub.restore())
  logSpy.restore()
}

test('log: starting a task', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'start',
    history: [],
  })

  assert.true(logSpy.calledOnce, 'logs the task is being started')
  teardown({ stubs, logSpy })
  assert.end()
})

test('log: starting a task when already running', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'start',
    history: [createTimerStartedEvent()],
  })

  assert.true(
    logSpy.notCalled,
    'logs nothing when the same task is already running',
  )
  teardown({ stubs, logSpy })
  assert.end()
})

test('log: starting a task when another one is already running', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'start',
    history: [createTimerStartedEvent('foo')],
  })

  assert.true(
    logSpy.calledTwice,
    'logs the previous task is stopped and the new one is being started',
  )
  teardown({ stubs, logSpy })
  assert.end()
})

test('log: stopping a task', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'stop',
    history: [createTimerStartedEvent()],
  })

  assert.true(logSpy.calledOnce, 'logs the task is being stopped')
  teardown({ stubs, logSpy })
  assert.end()
})

test('log: stopping a task when nothing is running', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'stop',
    history: [createTimerStoppedEvent()],
  })

  assert.true(logSpy.notCalled, 'logs nothing when there is no task runing')
  teardown({ stubs, logSpy })
  assert.end()
})

test('log: stopping a task when there is no history', assert => {
  const { stubs, logSpy } = setup()

  cli.track({
    command: 'stop',
    history: [],
  })

  assert.true(logSpy.notCalled, 'logs nothing when there is no history')
  teardown({ stubs, logSpy })
  assert.end()
})

const createTimerStartedEvent = task => ({
  name: 'timer_started',
  task,
})

const createTimerStoppedEvent = () => ({
  name: 'timer_stopped',
})
