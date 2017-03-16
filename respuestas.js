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
  },
  ubicacion: (session) => {
    const ubicacion = new builder.Message(session)
      .attachments([
        new builder.HeroCard()
          .text('Pulsa o da click para abrir en Google Maps')
          .title('Ubicación')
          .images(builder.CardImage.create(session, 'http://es.tinypic.com/view.php?pic=sdhcnl&s=9#.WMr3mojyvVM'))
          .tap(builder.CardAction.openUrl(session, 'https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.google.com%2Fmaps%3Fll%3D19.407639%252C-98.114006%26z%3D18%26t%3Dm%26hl%3Des-US%26gl%3DMX%26mapclient%3Dembed%26cid%3D2446350351016656415&h=ATO4cMXSeYrKGFYg4YEM83urXAyaSrYTje2XUW7HUgfx9t584kqZHKRgMycBwTNMl2v49Mji5VqJ3pzAVleCqCp7jzCmGv0L4Hlj_BYwVU4967irPbiARJers1U3KA'))
      ])
    session.send(ubicacion)
  }
}
