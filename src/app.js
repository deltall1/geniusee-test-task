const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const authMiddleware = require('./middleware/auth');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));

const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.laf7z.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to database')
    app.listen(PORT, () => console.log(`App listening on ${PORT} port`));
  }).catch(err => {
  console.log(err)
});
