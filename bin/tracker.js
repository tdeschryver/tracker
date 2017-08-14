#!/usr/bin/env node

const args = process.argv.slice(2)
const command = {
  command: args[0],
  data: {
    task: args[1],
  },
}

require('../src')(command)
