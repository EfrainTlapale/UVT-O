const waterline = require('waterline')
var bcrypt = require('bcrypt')

const user = waterline.Collection.extend({
  identity: 'users',
  connection: 'mySQL',
  autoPK: true,
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: 'true'
    },
    role: {
      type: 'string',
      required: true
    }
  },
  beforeCreate: function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(values.password, salt, function (err, hash) {
        if (err) return next(err)

        values.password = hash
        next()
      })
    })
  }
})

module.exports = user
