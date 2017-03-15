const licenciaturas = require('./data/licenciaturas')
const builder = require('botbuilder')
const Score = require('./mongoModels/score')

module.exports = {
  licenciaturas: (session, response) => {
    licenciaturas.forEach((licenciatura) => {
      const licenciaturaCard = new builder.Message(session)
        .attachments([
          new builder.HeroCard(session)
            .text(licenciatura.descripcion)
            .title(licenciatura.nombre)
            .images([
              builder.CardImage.create(session, licenciatura.img)
            ])
        ])
      session.send(licenciaturaCard)
    })
  },
  apiAiDefault (session, response) {
    session.send(response.result.fulfillment.speech)
  },
  hello: (session, response) => {
    const userName = session.message.user.name.split(' ')
    if (userName.length > 3) {
      session.send(`${response.result.fulfillment.speech} ${userName.splice(0, 2).join(' ')}`)
    } else {
      session.send(`${response.result.fulfillment.speech} ${userName.splice(0, 1)}`)
    }
  },
  pack: (session) => {
    const packCard = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
          .text('SHHHHHHH, queda entre nosotros ;)')
          .images([builder.CardImage.create(session, 'https://mvideos.stanford.edu/Images/DestinyImages/Graduate%20Certificate%20Images/460X259/ElectronicCircuitsGraduateCertificate_MAIN.jpg')])
      ])

    session.send(packCard)
  },
  highScore: (session) => {
    const maxScore = Score.findOne({}).sort(({score: -1})).limit(1)
    maxScore.exec(function (err, maxResult) {
      if (err) {
        session.send('No pude encontrar la puntuación mas alta :( intenta en otro ratón')
      } else {
        session.send(`La puntiación más alta la tiene ${maxResult.name} con ${maxResult.score}`)
      }
    })
  }
}
