const { Schema, model } = require("mongoose");

const albumSchema = new Schema(
  {
    album_name: {
      type: String,
      required: true,
      maxlength: 280,
    },
    artist_name: {
      type: String,
    },
    artist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);
const Album = model("Album", albumSchema);
module.exports = Album;
