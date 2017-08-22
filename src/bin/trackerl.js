#!/usr/bin/env node

const inquirer = require('inquirer')
const Fuse = require('fuse.js')
const { track, defaultFile, history } = require('./tracker')

let _history

const questions = [
  {
    type: 'input',
    name: 'file',
    message: 'Store location',
    default: defaultFile(),
  },
  {
    type: 'list',
    name: 'command',
    message: 'Select a command to run',
    choices: ['start', 'stop', 'status', 'report'],
    default: 'start',
  },
  {
    type: 'autocomplete',
    name: 'task',
    message: 'What are you up to?',
    suggestOnly: true,
    source: ({ file }, input) => {
      if (typeof historyCache === 'undefined') {
        const his = history(file)
        _history = {
          fuseInstance: new Fuse(
            his.filter(({ name }) => name === 'timer_started'),
            {
              id: 'task',
              keys: ['task'],
              shouldSort: true,
              tokenize: true,
              threshold: 0.6,
              location: 0,
              distance: 100,
            },
          ),
          cache: his,
        }
      }

      return new Promise(resolve => {
        let result = input
          ? [...new Set(_history.fuseInstance.search(input))]
          : []
        resolve(result)
      })
    },
    when: answers => answers.command === 'start',
    validate: val => {
      return val ? true : 'You must fill in a task'
    },
  },
  {
    type: 'list',
    name: 'report',
    message: 'Choose a report',
    choices: ['total', 'today', 'timesheet', 'timesheettoday'],
    when: answers => answers.command === 'report',
  },
]

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.prompt(questions).then(answers => {
  track({
    file: answers.file,
    command: answers.command === 'report' ? answers.report : answers.command,
    task: answers.task,
    history: _history ? _history.cache : history(answers.file),
  })
})
