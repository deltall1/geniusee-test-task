import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  type Task {
    _id: ID!
    title: String!
    status: String!
    creator: String!
  }

  type Query {
    tasks: [Task!]!
  }
  
  type AuthData {
    accessToken: String!
    refreshToken: String!
  }
  
  type Mutation {
    createTask(title: String!, status: String!): Task
    updateTaskStatus(id: ID!, status: String!): Task
    deleteTask(id: ID!): Task
    
    register(email: String!, password: String!): String
    login(email: String!, password: String!): AuthData
    refreshToken(refreshToken: String!): AuthData
  }
`;