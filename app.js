const express = require('express');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const Event = require('./models/events');

const app = express();

app.use(bodyParser.json());
const events = [];
app.use(
  '/api',
  graphqlHTTP({
    schema: buildSchema(`
    type Events {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput{
        title:String!
        description: String!
        price: Float!
        date: String!
    }

    type rootQuery{
        events:[Events]!
    }

    type rootMutation{
        addEvent(eventInput:EventInput): Events
    }

    schema{
        query:rootQuery
        mutation:rootMutation
    }
    `),
    rootValue: {
      events: async () => {
        try {
          const res = await Event.find();
          console.log(res);
          return res;
        } catch (error) {
          console.log(error);
        }
      },
      addEvent: async (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
        });

        return event
          .save()
          .then((results) => {
            console.log(results);
            return results;
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
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
