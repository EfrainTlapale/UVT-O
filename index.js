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
      const [lic] = licenciaturas.filter(lic => lic.nombre === result.response.entity)
      const licenciaturaCard = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
        .text(lic.descripcion)
        .title(lic.nombre)
        .images([
          builder.CardImage.create(session, 'http://uvtlax.com/wp-content/uploads/revslider/index_01/index_revs_02_b.jpg')
        ])
      ])
      session.send(licenciaturaCard)
    } else {
      session.endDialog()
    }
  }
])
