var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'aa4984b4-2f36-4be4-864d-1b5d013cbc89',
    appPassword: 'dawCxefqAiqrzPOeyX0SF6k'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var apiai = require('apiai')
var ai = apiai('b0fb9d9ce53641a1aaddce07ada5109a');
var respuestas = require('./respuestas');

bot.dialog('/', function (session) {
  var request = ai.textRequest(session.message.text, {
    sessionId: 'something'
  });

  request.on('response', function (response) {
    switch (response.result.action) {
      case 'input.welcome':
        respuestas.saludo(session, response)
        break;
      case 'infolicenciatura':
        respuestas.licenciaturas(session, response)
        break;
      default:
      respuestas.error(session, response)

    }
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
});

var handleResponse = function(session, response) {
  session.send(response.result.fulfillment.speech)
}
