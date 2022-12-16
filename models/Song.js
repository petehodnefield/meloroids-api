const { Schema, model } = require("mongoose");
const albumSchema = require("./Album");

const songSchema = new Schema(
  {
    song_name: {
      type: String,
      required: "You need to leave a thought!",
      minlength: 1,
      maxlength: 280,
    },

    progression: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    tempo: {
      type: String,
      required: true,
    },
    artist_name: {
      type: String,
      required: true,
    },
    album_name: {
      type: String,
    },
    artist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);
const Song = model("Song", songSchema);

module.exports = Song;
