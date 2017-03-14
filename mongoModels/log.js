const mongoose = require('mongoose')

const Log = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  intention: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Log', Log)
