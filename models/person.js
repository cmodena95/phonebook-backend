const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// const url = process.env.MONGODB_URI
const url = 'mongodb+srv://cmodena95:Barcelona123@cluster0.exx04rj.mongodb.net/persons?retryWrites=true&w=majority&appName=Cluster0'

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)