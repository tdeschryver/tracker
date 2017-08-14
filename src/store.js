const fs = require('fs')

const exists = file => {
  return new Promise(resolve => {
    fs.exists(file, exists => {
      resolve(exists)
    })
  })
}

const read = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(result))
      }
    })
  })
}

const create = file => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify([], null, 2), (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

const append = async (event, file) => {
  const store = await read(file)
  store.push(event)
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(store, null, 2), (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = { ...module.exports, read, exists, create, append }
