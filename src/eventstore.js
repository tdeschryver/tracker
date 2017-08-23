const append = (getEvents, saveEvents, events, expectedVersion) => {
  let history = getEvents()

  if (history.length) {
    const { sequenceNumber } = history[history.length - 1]
    if (sequenceNumber !== expectedVersion) {
      throw new Error('ConcurrencyException')
    }
  } else if (expectedVersion !== -1) {
    throw new Error('ConcurrencyException')
  }

  saveEvents(
    events.map((event, i) => ({
      ...event,
      sequenceNumber: i + expectedVersion + 1,
    })),
  )
}

module.exports = { ...module.exports, append }
