const mongoose = require('mongoose')

const Score = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Score', Score)
