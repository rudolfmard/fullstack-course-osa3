require('dotenv').config()
const cors = require("cors")
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require('./models/person')

morgan.token("req_content", function(req, res){
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }
    return ""
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.req_content(req, res)
    ].join(' ')
  }))

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.find({_id: req.params.id})
        .then(result => {
            if (result.length === 0){
                res.status(404).end()
            }
            else{
                res.json(result[0])
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = {...req.body}

    if (!body.name || body.name === ""){
        return res.status(400).json({error: "name is missing"})
    }
    else if (!body.number || body.number === ""){
        return res.status(400).json({error: "number is missing"})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = {...req.body}

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
    Person.find({})
    .then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date(Date.now()).toString()}</p>`)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})