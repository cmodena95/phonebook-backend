const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://cmodena95:${password}@cluster0.exx04rj.mongodb.net/persons?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    console.log('phonebook')
    Person.find().then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} - ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`Added ${process.argv[3]} with number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}
