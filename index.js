const restify = require('restify')
const builder = require('botbuilder')

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, (err) => {
  if (err) console.log('ERROR: Server not running')
  console.log(`Server listening in port: ${server}`)
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
        respuestas.saludo(session, response)
        break
      case 'infolicenciatura':
        respuestas.licenciaturas(session, response)
        break
      case 'identificacion':
        respuestas.identificacion(session, response)
        break
      case 'estadoanimo':
        respuestas.estadoanimo(session, response)
        break
      default:
        respuestas.error(session, response)
    }
  })

  request.on('error', (error) => {
    console.log(error)
  })

  request.end()
})
