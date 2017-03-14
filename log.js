const Log = require('./mongoModels/log')

module.exports = (message, intention) => {
  const log = new Log({
    message,
    intention
  })
  log.save(err => {
    if (err) {
      console.log(err)
    }
  })
}
