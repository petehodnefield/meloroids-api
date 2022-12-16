const { Schema, model } = require("mongoose");

const MidiSchema = new Schema(
  {
    progression: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Midi = model("Midi", MidiSchema);

module.exports = Midi;
