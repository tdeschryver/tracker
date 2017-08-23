const test = require('tape')
const sinon = require('sinon')
const tracker = require('../src')

const setup = () => {
  return [sinon.useFakeTimers(1502829303096)]
}

const teardown = stubs => {
  stubs.forEach(stub => stub.restore())
}

test('starting a task', assert => {
  const stubs = setup()

  const config = createConfig({
    command: 'start',
  })

  const expected = [
    {
      name: 'timer_started',
      task: 'foo',
      startedAt: 1502829303096,
    },
  ]

  tracker(config, {
    events: events =>
      assert.deepEqual(
        events,
        expected,
        'start should create a timer_started entry',
      ),
  })

  teardown(stubs)
  assert.end()
})

test('starting a task while already running', assert => {
  const stubs = setup()

  const config = createConfig({
    command: 'start',
    history: [
      {
        name: 'timer_started',
        task: 'foo',
        startedAt: 1502829303096,
      },
    ],
  })

  const expected = []

  tracker(config, {
    events: events =>
      assert.deepEqual(
        events,
        expected,
        'start should do nothing while the same task is running',
      ),
  })

  teardown(stubs)
  assert.end()
})

test('starting a task while another task is already running', assert => {
  const stubs = setup()

  const config = createConfig({
    command: 'start',
    data: createData({ task: 'bar' }),
    history: [
      {
        name: 'timer_started',
        task: 'foo',
        startedAt: 1502829303096,
      },
    ],
  })

  const expected = [
    {
      name: 'timer_stopped',
      task: 'foo',
      stoppedAt: 1502829303096,
    },
    {
      name: 'timer_started',
      task: 'bar',
      startedAt: 1502829303096,
    },
  ]

  tracker(config, {
    events: events =>
      assert.deepEqual(
        events,
        expected,
        'start should create a timer_stopped and timer_started entry when another task is running',
      ),
  })

  teardown(stubs)
  assert.end()
})

test('stopping a task', assert => {
  const stubs = setup()

  const config = createConfig({
    command: 'stop',
    history: [
      {
        name: 'timer_started',
        task: 'foo',
        startedAt: 1502829303096,
      },
    ],
  })

  const expected = [
    {
      name: 'timer_stopped',
      task: 'foo',
      stoppedAt: 1502829303096,
    },
  ]

  tracker(config, {
    events: events =>
      assert.deepEqual(
        events,
        expected,
        'stop should create a timer_stopped entry',
      ),
  })

  teardown(stubs)
  assert.end()
})

test('stopping a task while none is running', assert => {
  const stubs = setup()

  const config = createConfig({
    command: 'stop',
    history: [
      {
        name: 'timer_stopped',
      },
    ],
  })

  const expected = []

  tracker(config, {
    events: events =>
      assert.deepEqual(
        events,
        expected,
        'stop should do nothing when nothing is running',
      ),
  })

  teardown(stubs)
  assert.end()
})

const createData = ({ task = 'foo', ...rest } = {}) => ({
  task,
  ...rest,
})

const createConfig = (
  { command = '', data = createData(), history = [] } = {},
) => ({
  command,
  data,
  history,
})
