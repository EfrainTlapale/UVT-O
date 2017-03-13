const router = require('express').Router()
const server = require('../index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {secret} = require('../dbconfig')
const expressjwt = require('express-jwt')

const jwtcheck = expressjwt({secret: secret})

router.route('/signup')
  .post((req, res) => {
    server.models.users.create(
      Object.assign({}, req.body)
    ).exec((err, user) => {
      if (err) {
        return res.status(400).json({success: false, err})
      } else {
        return res.json({success: true, user})
      }
    })
  })

router.post('/login', (req, res) => {
  server.models.users.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({success: false, err})
    } else {
      bcrypt.compare(req.body.password, user.password, (err) => {
        if (err) {
          return res.status(400).json({success: false, err})
        } else {
          let jwtuser = Object.assign({}, user)
          delete jwtuser.password
          // console.log(secret)
          const token = jwt.sign({
            user
          }, secret, {
            expiresIn: '6h'
          })
          return res.json({success: true, token})
        }
      })
    }
  })
})

router.get('/protected', jwtcheck, (req, res) => {
  res.json({secret: 'data', ultra: 'topSecret'})
})

router.get('/logs', (req, res) => {
  server.models.logs.find({}).exec((err, logs) => {
    if (err) {
      res.status(400).json({success: false, err})
    } else {
      res.json({logs})
    }
  })
})

// router.get('/intentions', (req, res) => {
//   server.models.logs.query('Select distinct intention from logs;', (err, intentions) => {
//     if (err) {
//       res.status(400).json({err})
//     } else {
//       res.json({intentions})
//     }
//   })
// })

module.exports = router
