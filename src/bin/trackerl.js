#!/usr/bin/env node

const inquirer = require('inquirer')
const { track, defaultFile } = require('./tracker')

const questions = [
  {
    type: 'list',
    name: 'command',
    message: 'Which command do you wanna run?',
    choices: ['start', 'stop', 'status', 'report'],
    default: 'start',
  },
  {
    type: 'input',
    name: 'task',
    message: 'Task:',
    when: answers => answers.command === 'start',
  },
  {
    type: 'list',
    name: 'report',
    message: 'Which report?',
    choices: ['total'],
    when: answers => answers.command === 'report',
  },
  {
    type: 'input',
    name: 'file',
    message: 'Store:',
    default: defaultFile(),
  },
]

inquirer.prompt(questions).then(answers => {
  track({
    file: answers.file,
    command: answers.command === 'report' ? answers.report : answers.command,
    task: answers.task,
  })
})
