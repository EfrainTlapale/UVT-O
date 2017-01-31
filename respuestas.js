const licenciaturas = require('./data/licenciaturas')
const builder = require('botbuilder')

module.exports = {
  saludo: (session, response) =>{
    session.send(response.result.fulfillment.speech)
  },
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
  error: (session, response) => {
    session.send(response.result.fulfillment.speech)
  }
}
