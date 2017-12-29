const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

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

app.delete('/todos/:id', (req, res) => {
  //get the id
  var id = req.params.id

  //validate the id -> not valid return 404
  if(!ObjectID.isValid(id)) return res.status(404).send()

  //remove todo by id
    //success
      //if no doc, send 404
      //if doc, send doc back
    //error
      //400 with empty body
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) return res.status(404).send()
    res.send({todo})
  }, (e) => {
    console.log(e)
    return res.status(400).send()
  })
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['text', 'completed']) //only get props which is exist in arr

  if(!ObjectID.isValid(id)) return res.status(404).send()

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime()
  }else{
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {
    new: true
  }).then((todo)=>{
    if(!todo) return res.status(404).send()

    res.send({todo})
  }).catch( e => res.status(400).send())
})





app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = {
  app
}
