const waterline = require('waterline')

const score = waterline.Collection.extend({
  connection: 'mySQL',
  identity: 'score',
  autoPK: true,
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    school: {
      type: 'string',
      required: true
    },
    score: {
      type: 'string'
    }
  }
})

module.exports = score
