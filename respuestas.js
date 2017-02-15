const licenciaturas = require('./data/licenciaturas')
const builder = require('botbuilder')

module.exports = {
  licenciaturas: (session, response) => {
    licenciaturas.forEach((licenciatura) => {
      const licenciaturaCard = new builder.Message(session)
        .attachments([
          new builder.HeroCard(session)
            .text(licenciatura.descripcion)
            .title(licenciatura.nombre)
            .images([
              builder.CardImage.create(session, 'http://uvtlax.com/wp-content/uploads/revslider/index_01/index_revs_02_b.jpg')
            ])
        ])
      session.send(licenciaturaCard)
    })
  },
  apiAiDefault (session, response) {
    session.send(response.result.fulfillment.speech)
  },
  hello: (session, response) => {
    session.send(`Hola ${session.message.user.name.split(' ').slice(0,1)}`)
  }
}
