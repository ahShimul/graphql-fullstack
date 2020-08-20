const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking{
        _id: ID
        event: Events!
        user:User!
        createdAt: String!
        updatedAt: String!
    }
    type Events {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }
    type User{
      _id: ID!
      email: String!
      password: String
      createdEvents: [Events!]
    }

    input UserInput{
      email: String!
      password: String!
    }
    input EventInput{
        title:String!
        description: String!
        price: Float!
        date: String!
    }

    type rootQuery{
        events:[Events]!
        bookings: [Booking!]!
    }

    type rootMutation{
        addEvent(eventInput:EventInput): Events
        createUser(userInput:UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId:ID!): Events!
    }

    schema{
        query:rootQuery
        mutation:rootMutation
    }
    `);
