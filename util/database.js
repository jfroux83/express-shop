const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('express-shop', 'root', 'karools', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize