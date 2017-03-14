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
  score: Number
})

module.exports = mongoose.model('Score', Score)
