const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Event = require('../../models/events');
const Booking = require('../../models/booking');
const user = require('../../models/user');
module.exports = {
  events: async () => {
    try {
      const res = await Event.find();
      return res.map(async (event) => {
        return transformEvent(event);
      });
    } catch (error) {
      console.log(error);
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: getUser.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  addEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5f2bf616994d880cbc9e53af',
    });
    try {
      const eventRes = await event.save();
      const user = await User.findOne({ _id: '5f2bf616994d880cbc9e53af' });
      if (!user) {
        throw new Error('User not found');
      }
      user.createdEvents.push(event);
      await user.save();
      return {
        ...eventRes._doc,
        creator: await getUser.bind(this, eventRes.creator),
      };
    } catch (error) {
      console.log(error);
      throw new Error('User not found');
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });

      const booking = new Booking({
        user: '5f2bf616994d880cbc9e53af',
        event: fetchedEvent,
      });

      const res = await booking.save();

      return {
        ...res._doc,
        user: getUser.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(res._doc.createdAt).toISOString(),
        updatedAt: new Date(res._doc.updatedAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');

      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const hasedPass = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hasedPass,
      });
      const res = await user.save();
      return { ...res._doc, password: 'Hidden' };
    } catch (error) {
      throw error;
    }
  },
};

const events = async (eventIds) => {
  try {
    const resp = await Event.find({ _id: { $in: eventIds } });
    return resp.map((event) => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: getUser.bind(this, event.creator) };
  } catch (error) {
    throw error;
  }
};
const getUser = async (userId) => {
  try {
    const resp = await User.findById(userId);
    return {
      ...resp._doc,
      createdEvents: events.bind(this, resp.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event.date).toISOString(),
    creator: getUser.bind(this, event.creator),
  };
};
