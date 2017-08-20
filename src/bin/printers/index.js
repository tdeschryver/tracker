module.exports = type => (report, input) => require(`./${type}`)(report, input)
