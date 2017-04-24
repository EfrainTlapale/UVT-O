const mongoose = require('mongoose')

const Evento = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  lugar: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Evento', Evento)
