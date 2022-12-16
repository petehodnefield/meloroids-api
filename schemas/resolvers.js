const { Parser } = require("graphql/language/parser");
const { AuthenticationError } = require("apollo-server-express");

const { models } = require("mongoose");
const { User, Artist, Song, Album, Midi } = require("../models");
const { signToken } = require("../utils/auth");
const resolvers = {
  Query: {
    artists: async () => {
      return Artist.find().populate({
        path: "albums",
        populate: {
          path: "artist",
          model: "Artist",
        },
      });
    },
    artist: async (parent, { name }) => {
      return Artist.findOne({ name })
        .populate({
          path: "albums",
          populate: {
            path: "artist",
            model: "Artist",
          },
        })
        .populate({
          path: "albums",
          populate: {
            path: "songs",
            model: "Song",
          },
        });
    },

    songs: async () => {
      return Song.find().populate("artist");
    },
    song: async (parent, { artist_name }) => {
      return Song.find({ artist_name });
    },
    artistAndProgression: async (parent, { artist_name, progression }) => {
      return Song.find({ artist_name, progression });
    },

    referenceSongs: async (parent, { artist_name, progression }) => {
      return Song.find({ artist_name, progression });
    },

    albums: async () => {
      return Album.find()
        .populate({
          path: "artist",
          populate: {
            path: "albums",
            model: "Album",
          },
        })
        .populate({
          path: "songs",
        });
    },
    album: async (parent, { artist_name }) => {
      return Album.find({ artist_name }).populate({
        path: "songs",
      });
    },

    midi: async (parent, {}) => {
      return Midi.find();
    },

    users: async (parent, {}) => {
      return User.find();
    },
  },
  Mutation: {
    addArtist: async (parent, args) => {
      const artist = await Artist.create(args);
    },
    createUser: async (parent, args) => {
      const user = await User.create(args);
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;
