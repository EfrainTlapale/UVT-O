const router = require('express').Router()
// const server = require('../index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {secret} = require('../dbconfig')
const expressjwt = require('express-jwt')
const User = require('../mongoModels/user')
const Log = require('../mongoModels/log')
const Score = require('../mongoModels/score')
const Evento = require('../mongoModels/evento')

const jwtcheck = expressjwt({secret: secret})

router.route('/signup')
  .post((req, res) => {
    const user = new User(req.body)
    user.save(err => {
      if (err) {
        res.status(400).json({success: false, err})
      } else {
        res.json({success: true, user})
      }
    })
  })

router.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err || !user) {
      res.status(401).json({success: false, err})
    } else {
      bcrypt.compare(req.body.password, user.password, (err, success) => {
        if (err) {
          return res.status(400).json({success: false, err})
        } else if (success) {
          user.password = undefined
          // console.log(secret)
          const token = jwt.sign({
            // horas minutos segundos milesimas
            exp: Date.now() + (2 * 60 * 60 * 1000),
            user
          }, secret)
          return res.json({success: true, token})
        } else {
          res.status(400).json({success: false})
        }
      })
    }
  })
})

router.get('/protected', jwtcheck, (req, res) => {
  res.json({secret: 'data', ultra: 'topSecret'})
})

router.get('/logs', jwtcheck, (req, res) => {
  Log.find({}, (err, logs) => {
    if (err) {
      res.status(400).json({success: false, err})
    } else {
      res.json({logs})
    }
  })
})

router.get('/scores', (req, res) => {
  Score.find({}, (err, scores) => {
    if (err) {
      res.status(400).json({success: false, err})
    } else {
      res.json({scores})
    }
  })
})

router.put('/scores', jwtcheck, (req, res) => {
  Score.findByIdAndUpdate(req.body.id, {score: req.body.newScore}, (err, score) => {
    if (err || !score) {
      res.status(400).json({success: false, err})
    } else {
      res.json({success: true})
    }
  })
})

router.get('/highscore', (req, res) => {
  const maxScore = Score.findOne({}).sort(({score: -1})).limit(1)
  maxScore.exec(function (err, maxResult) {
    if (err) {
      res.status(400).json({success: false, err})
    } else {
      res.json({maxResult})
    }
  })
})

router.post('/evento', (req, res) => {
  const evento = new Evento(req.body)
  evento.save(err => {
    if (err) {
      res.status(400).json({success: false, err})
    } else {
      res.json({success: true, evento})
    }
  })
})

router.get('/evento', jwtcheck, (req, res) => {
  Evento.find({}).sort('-fecha').exec((err, eventos) => {
    if (err) {
      res.status(400).json({err})
    } else {
      res.json({eventos})
    }
  })
})

module.exports = router
