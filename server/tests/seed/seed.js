const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todos')
const {User} = require('./../../models/users')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
  _id: userOneId,
  email: 'test@test.com',
  password: 'testpass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
    _id: userTwoId,
    email: 'test2@test.com',
    password: 'test2pass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}]

const todos = [{
  _id: new ObjectID(),
  text: 'first',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'second',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then(() => done())
  })
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = {
  todos, populateTodos,
  users, populateUsers,
}
