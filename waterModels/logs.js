const waterline = require('waterline')

const log = waterline.Collection.extend({
  identity: 'logs',
  connection: 'mySQL',
  autoPK: true,
  attributes: {
    message: {
      type: 'string'
    },
    intention: {
      type: 'string'
    }
  }
})

module.exports = log
