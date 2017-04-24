const express = require('express')
const builder = require('botbuilder')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

const log = require('./log')

// Mongoose connection
const mongoUri = process.env.MONGO || 'mongodb://localhost/uvto'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(mongoUri, err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected to Mongo')
  }
})

server.use('/api', require('./api'))

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
const port = process.env.port || process.env.PORT || 3978
server.listen(port, (err) => {
  if (err) console.log('ERROR: Server not running')
  console.log(`Server listening in port: ${port}`)
})

// Create chat bot
const connector = new builder.ChatConnector({
  // appId: 'aa4984b4-2f36-4be4-864d-1b5d013cbc89',
  // appPassword: 'dawCxefqAiqrzPOeyX0SF6k'
})
const bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

const path = require('path')

server.use(express.static(path.resolve(__dirname, 'build')))

// Always return the main index.html, so react-router render the route in the client
server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

// =========================================================
// Bots Dialogs
// =========================================================

const licenciaturas = require('./data/licenciaturas')

const apiai = require('apiai')
const ai = apiai('b0fb9d9ce53641a1aaddce07ada5109a')
var respuestas = require('./respuestas')

function processMessage (response, session) {
  log(session.message.text, response.result.metadata.intentName)
  switch (response.result.action) {
    case 'input.welcome':
      respuestas.hello(session, response)
      break
    case 'identificacion' || 'estadoanimo':
      respuestas.apiAiDefault(session, response)
      break
    case 'infolicenciatura' || 'licenciaturaespecifica':
      session.beginDialog('/licenciatura')
      break
    case 'promoSticker':
      session.beginDialog('/acertijo')
      break
    case 'torneoGC':
      session.beginDialog('/torneo')
      break
    case 'pack':
      respuestas.pack(session)
      break
    case 'highscore':
      respuestas.highScore(session)
      break
    case 'ubicacion':
      respuestas.ubicacion(session)
      break
    case 'evento':
      session.beginDialog('/eventos')
      break
    default:
      respuestas.apiAiDefault(session, response)
  }
}

const evento = require('./mongoModels/evento')

bot.dialog('/', (session) => {
  const request = ai.textRequest(session.message.text, {
    sessionId: 'something'
  })
  request.on('response', (response) => {
    if (session.message.text === 'cleandata') {
      session.beginDialog('/cleandata')
    } else {
      processMessage(response, session)
    }
  })

  request.on('error', (error) => {
    console.log(error)
  })

  request.end()
})

const moment = require('moment')
moment.locale('es')

bot.dialog('/eventos', [
  function (session) {
    evento.find({}, (err, eventos) => {
      if (err) {
        session.endDialog('Error al cargar los eventos')
      } else {
        const opciones = eventos.filter(e => new Date(e.fecha) > new Date()).map(e => e.nombre)
        builder.Prompts.choice(session, 'Selecciona un evento para obtener más información', opciones, {retryPrompt: 'Intenta de nuevo', listStyle: builder.ListStyle['button'], maxRetries: 0})
      }
    })
  }, function (session, result) {
    if (result.response) {
      evento.findOne({nombre: result.response.entity}, (err, e) => {
        if (err || !e) {
          session.endDialog('Error al encontrar evento')
        } else {
          console.log(e)
          session.send('Nombre: ' + e.nombre + '\n' + ', Descripción: ' + e.descripcion + '\n' + ', Lugar: ' + e.lugar + '\n' + ', Fecha ' + moment(e.fecha).format('LL'))
          session.endDialog()
        }
      })
    } else {
      session.beginDialog('/')
    }
  }
])

bot.dialog('/licenciatura', [
  function (session) {
    const opciones = licenciaturas.map(l => l.nombre)
    builder.Prompts.choice(session, 'Selecciona una Licenciatura para obtener mas informes', opciones, {retryPrompt: 'Intenta de nuevo', listStyle: builder.ListStyle['button'], maxRetries: 0})
  }, function (session, result) {
    if (result.response) {
      const lic = licenciaturas.find(lic => lic.nombre === result.response.entity)
      const licenciaturaCard = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
        .text(lic.descripcion)
        .title(lic.nombre)
        .images([
          builder.CardImage.create(session, lic.img)
        ])
        .tap(builder.CardAction.openUrl(session, lic.link))
      ])
      session.send(licenciaturaCard)
      session.endDialog()
    } else {
      session.beginDialog('/')
    }
  }
])

const acertijos = require('./acertijos')
bot.dialog('/acertijo', [
  function (session) {
    if (session.userData.intentos > 3) {
      session.send('Perdiste tu oportunidad')
      session.endDialog()
    } else if (session.userData.ganador) {
      session.send('Ya ganaste un sticker')
      session.endDialog()
    } else {
      const random = Math.floor((Math.random() * acertijos.length))
      const acertijo = acertijos[random]
      session.userData.respuesta = acertijo.respuesta
      builder.Prompts.text(session, acertijo.pregunta)
    }
  }, function (session, result) {
    if (result.response.toLowerCase().trim() === session.userData.respuesta) {
      const code = Date.now()
      session.userData.ganador = true
      session.send(`¡Correcto!, utiliza este código ${code}, muestraselo a mis creadores`)
    } else {
      if (session.userData.intentos) {
        session.userData.intentos = session.userData.intentos + 1
      } else {
        session.userData.intentos = 1
      }

      if (session.userData.intentos > 3) {
        session.send('Demasiados intentos :(')
        session.endDialog()
      } else {
        session.send('Respuesta equivocada, intenta de nuevo ;)')
        session.beginDialog('/acertijo')
      }
    }
  }
])

const Score = require('./mongoModels/score')

bot.dialog('/torneo', [
  function (session) {
    if (session.userData.registradoTorneo) {
      session.endDialog('Ya estás registrado, acude al salón 3-16 para participar en el torneo')
    } else {
      builder.Prompts.text(session, 'Para tu registro necesito que a continuación escribas el nombre de tu escuela, porfa')
    }
  },
  function (session, result) {
    const score = new Score({
      name: session.message.user.name,
      school: result.response
    })
    score.save(err => {
      if (err) {
        session.send('Hubo un error en tu registro :(, intenta de nuevo porfa')
      } else {
        session.userData.registradoTorneo = true
        session.send('Gracias por registrarse, el torneo se realiza en el salón 3-16, consulta a mis creadores (ingeniería en sistemas) para más información')
      }
      session.endDialog()
    })
  }
])

// SOLO PARA DESARROLLO, ELIMINA LA INFO TEMPORAL DEL USUARIO
bot.dialog('/cleandata', [
  function (session) {
    builder.Prompts.text(session, 'password')
  }, function (session, result) {
    if (result.response === 'admin17') {
      session.userData.intentos = 1
      session.userData.ganador = false
      session.userData.registradoTorneo = false
      session.endDialog('data cleaned')
    } else {
      session.endDialog('wrong')
    }
  }
])
