#!/usr/bin/env node

const { parse, value } = require('./parser')
const { track, defaultFile, history } = require('./tracker')

const args = process.argv.slice(2)
const input = parse(args)
const file = value(input, 'file', 'f', defaultFile)

track({
  file,
  command: args[0],
  task: args[1],
  history: history(file),
})
