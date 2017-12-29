var express = require('express')
var bodyParser = require('body-parser')
var {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todos')
var {User} = require('./models/users')

var app = express()
const port = process.env.PORT || 3456

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  console.log(req.body)
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc)=>{
    res.send(doc)
  }, (err)=>{
    res.status(400).send(err)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    console.log(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)) return res.status(404).send()

  Todo.findById(id).then((todo) => {
    if(!todo) return res.status(404).send()
    res.send({todo})
  }, (e) => {
    console.log(e)
    return res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = {
  app
}
