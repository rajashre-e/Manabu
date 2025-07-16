const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sentenceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sentence: {
      type: String,
      required: true,
      trim: true,
    },
    furigana: {
      type: String,
      trim: true,
    },
    translation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Sentence = model("Sentence", sentenceSchema); // 👈 Use PascalCase singular for model name
module.exports = Sentence;
