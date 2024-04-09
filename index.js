require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())
// const morgan = require('morgan');

const Person = require('./models/person')

// morgan.token('postData', function(req, res) {
//     return JSON.stringify(req.body);
// });

// app.use(morgan('tiny'));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postData'));
// app.use(express.static('dist'))
// app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}, (err, count) => {
    if (err) {
      // Handle the error
      response.status(500).json({ error: 'Internal Server Error' });
    } else {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    }
  });
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id).then(deletedPerson => {
    if (!deletedPerson) {
      response.status(404).json({ error: 'Person not found' });
    } else {
      response.status(204).end();
    }
  })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('asds')

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        }) 
    }

    Person.find({name: body.name}).then(existingPersons => {
      if (existingPersons.length > 0) {
        return response.status(400).json({ 
          error: 'Name must be unique' 
        });
      }

      const person = new Person({
        "name": body.name,
        "number": body.number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})