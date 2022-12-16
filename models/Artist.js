const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Artist = model("Artist", artistSchema);

module.exports = Artist;
