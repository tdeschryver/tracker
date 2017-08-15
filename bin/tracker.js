#!/usr/bin/env node

const { parse, value } = require('./parser')
const args = process.argv.slice(2)
const tracker = require('../src')

const defaultFile = () =>
  process.platform === 'win32'
    ? `${process.env.userprofile}\\.tracker-store.json`
    : '~/.tracker-store.json'

const input = parse(args)
const command = {
  command: args[0],
  data: {
    task: args[1],
  },
  file: value(input, 'file', 'f', defaultFile),
}

tracker(command)
