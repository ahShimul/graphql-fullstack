const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
  '/api',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true,
  }),
);

mongoose
  .connect(
    `mongodb+srv://Shimul:${process.env.MONGO_PASSWORD}@graphql.t7myv.mongodb.net/graphql`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    app.listen(4000, () => {
      console.log('Server is lisening to 4000 port');
    });
  })
  .catch((err) => {
    console.log(err);
  });
