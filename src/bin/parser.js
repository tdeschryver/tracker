const parse = args => {
  return args.reduce((result, arg, index) => {
    if (arg[0] !== '-') {
      return result
    }
    const equalsIndex = arg.indexOf('=')
    const dashIndex =
      arg.indexOf('--') === -1 ? arg.indexOf('-') : arg.indexOf('--') + 1

    const key =
      equalsIndex === -1
        ? arg.substring(dashIndex + 1)
        : arg.substring(dashIndex + 1, equalsIndex)

    const value =
      equalsIndex === -1 ? args[index + 1] : arg.substring(equalsIndex + 1)

    return { ...result, [key]: value }
  }, {})
}

const value = (args, key, abbreviation, defaultValue) => {
  return args[abbreviation] || args[key] || defaultValue()
}

module.exports = { ...module.exports, parse, value }
