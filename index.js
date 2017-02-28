const express = require('express')
const builder = require('botbuilder')

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
const server = express()
const port = process.env.port || process.env.PORT || 3978
server.listen(port, (err) => {
  if (err) console.log('ERROR: Server not running')
  console.log(`Server listening in port: ${port}`)
})

// Create chat bot
const connector = new builder.ChatConnector({
  appId: 'aa4984b4-2f36-4be4-864d-1b5d013cbc89',
  appPassword: 'dawCxefqAiqrzPOeyX0SF6k'
})
const bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

// =========================================================
// Bots Dialogs
// =========================================================

const licenciaturas = require('./data/licenciaturas')

const apiai = require('apiai')
const ai = apiai('b0fb9d9ce53641a1aaddce07ada5109a')
var respuestas = require('./respuestas')

bot.dialog('/', (session) => {
  const request = ai.textRequest(session.message.text, {
    sessionId: 'something'
  })

  request.on('response', (response) => {
    switch (response.result.action) {
      case 'input.welcome':
        respuestas.hello(session, response)
        break
      case 'identificacion' || 'estadoanimo':
        respuestas.apiAiDefault(session, response)
        break
      case 'infolicenciatura':
        session.beginDialog('/licenciatura')
        break
      case 'promoSticker':
        session.beginDialog('/acertijo')
        break
      default:
        respuestas.apiAiDefault(session, response)
    }
  })

  request.on('error', (error) => {
    console.log(error)
  })

  request.end()
})

bot.dialog('/licenciatura', [
  function (session) {
    const opciones = licenciaturas.map(l => l.nombre)
    builder.Prompts.choice(session, 'Selecciona una Licenciatura para obtener mas informes', opciones, {retryPrompt: 'Intenta de nuevo', listStyle: builder.ListStyle['button']})
  }, function (session, result) {
    if (result.response) {
      const lic = licenciaturas.find(lic => lic.nombre === result.response.entity)
      const licenciaturaCard = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
        .text(lic.descripcion)
        .title(lic.nombre)
        .images([
          builder.CardImage.create(session, 'http://uvtlax.com/wp-content/uploads/revslider/index_01/index_revs_02_b.jpg')
        ])
        .tap(builder.CardAction.openUrl(session, lic.link))
      ])
      session.send(licenciaturaCard)
      session.endDialog()
    } else {
      session.endDialog()
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
    if (result.response.toLowerCase() === session.userData.respuesta) {
      session.userData.ganador = true
      session.send('¡Correcto!, utiliza este código xxx-xxx-xxx, muestraselo a mis creadores')
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
        session.beginDialog('/acertijo')
      }
    }
  }
])
