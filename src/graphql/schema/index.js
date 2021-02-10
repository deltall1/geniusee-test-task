const {buildSchema} = require('graphql');

module.exports = buildSchema(`
  type Task {
    _id: ID!
    title: String!
    status: String!
    creator: String!
  }
  
  input TaskInput {
    title: String!
    status: String!
  }
  
  input TaskUpdateInput {
    id: ID!
    status: String!
  }
  
  type AuthData {
    idToken: String!
    refreshToken: String!
  }

  type RootQuery {
    tasks: [Task!]!
  }
  
  type RootMutation {
    createTask(taskInput: TaskInput): Task
    updateTaskStatus(taskInput: TaskUpdateInput): Task
    deleteTask(id: ID!): Task
    register(email: String!, password: String!): String
    login(email: String!, password: String!): AuthData
    refreshToken(refreshToken: String!): AuthData
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
