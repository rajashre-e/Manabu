const { Schema, model } = require("mongoose");

const flashcardschema = new Schema(
  {
    japanese: {
      type: String,
      required: true,
    },

    english: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["kanji", "vocab", "phrase"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const flashcard = model("flashcard", flashcardschema);
module.exports = flashcard;
