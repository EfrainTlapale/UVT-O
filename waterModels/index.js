const mysqlAdapter = require('sails-mysql')
var Waterline = require('waterline')
const dbconfig = require('../dbconfig')

const orm = new Waterline()

var config = {
  adapters: {
    adapterMysql: mysqlAdapter
  },

  connections: {
    mySQL: {
      adapter: 'adapterMysql',
      host: dbconfig.host,
      user: dbconfig.user,
      password: dbconfig.password,
      database: 'uvto'
    }
  },
  defaults: {
    migrate: 'safe'
  }
}

var fs = require('fs')
var path = require('path')

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    var model = require(path.join(__dirname, file))
    orm.loadCollection(model)
  })

module.exports = {waterline: orm, config: config}
