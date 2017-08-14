const now = () => Date.now()
const log = value => process.stdout.write(`${value}\n`)

module.exports = { ...module.exports, now, log }
