const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://jacquesroux:xWt394nEGH32bK6O@cluster0.khugxo3.mongodb.net/?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!')
    callback(client)
  })
  .catch(err => console.log(err))
}

module.exports = mongoConnect