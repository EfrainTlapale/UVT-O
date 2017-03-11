const server = require('./index')

module.exports = (message, intention) => {
  server.models.logs.create({
    message,
    intention
  }).exec((err, score) => {
    if (err) console.log('error al guardad desde el log')
  })
}
