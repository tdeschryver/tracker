#!/usr/bin/env node

const { parse, value } = require('./parser')
const store = require('./store')
const tracker = require('../src')

const log = value => process.stdout.write(`${value}\n`)

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const args = process.argv.slice(2)
const input = parse(args)
const file = value(input, 'file', 'f', defaultFile)

if (!store.exists(file)) {
  store.create(file)
}

const command = {
  command: args[0],
  data: {
    task: args[1],
  },
  history: store.read(file),
}

tracker(command, {
  message: log,
  error: log,
  events: events => store.append(file, events),
})
