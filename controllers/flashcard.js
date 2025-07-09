const Flashcard = require("../models/flashcard");

const axios = require("axios");
const Sentence = require("../models/sentence");

const createflashcard = async (req, res) => {
  try {
    const { japanese, english, type } = req.body;

    if (!japanese || !english) {
      return res.status(400).render("addcard", {
        error: "Required fields incomplete. Redirecting to home...",
        user: req.user,
      });
    }

    await Flashcard.create({
      japanese,
      english,
      type,
      createdBy: req.user._id,
    });

    return res.redirect("/");
  } catch (error) {
    return res.status(500).render("addcard", {
      error: "Server error. Redirecting to home...",
      user: req.user,
    });
  }
};

const updateFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { japanese, english, type } = req.body;

    const found = await Flashcard.findById(id);

    if (!found) {
      return res.status(404).render("update", {
        flashcard: null,
        error: "Flashcard not found. Redirecting to home...",
        user: req.user,
      });
    }

    if (found.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).render("update", {
        flashcard: found,
        error: "Forbidden. Redirecting to home...",
        user: req.user,
      });
    }

    await Flashcard.findByIdAndUpdate(id, { japanese, english, type });
    return res.redirect("/");
  } catch (error) {
    return res.status(500).render("update", {
      flashcard: null,
      error: "Server error. Redirecting to home...",
      user: req.user,
    });
  }
};

const deleteFlashcard = async (req, res) => {
  try {
    const id = req.params.id;
    const found = await Flashcard.findById(id);

    if (!found || found.createdBy.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    await Flashcard.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (error) {
    return res.redirect("/");
  }
};

const generateSentence = async (req, res) => {
  try {
    const id = req.params.id;
    const found = await Flashcard.findById(id);

    if (!found || found.createdBy.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    const prompt = `Generate a JLPT N5-level Japanese sentence using "${found.japanese}".
Provide the output in this format:
Sentence: <sentence>
Furigana: <furigana>
Translation: <translation>`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free", // ✅ DeepSeek V3 model
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Optional
          "X-Title": "Flashcard Sentence Generator", // Optional
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const sentence = content.match(/Sentence:\s*(.*)/)?.[1] || "";
    const furigana = content.match(/Furigana:\s*(.*)/)?.[1] || "";
    const translation = content.match(/Translation:\s*(.*)/)?.[1] || "";

    return res.render("generate", {
      flashcard: found,
      user: req.user,
      sentence,
      furigana,
      translation,
      error: null, // ✅ add this line to avoid ReferenceError
    });
  } catch (error) {
    console.error("OpenRouter error:", error?.response?.data || error.message);
    return res.redirect("/");
  }
};

const saveSentence = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sentence, furigana, translation } = req.body;
    const flashcardId = req.params.id;

    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      res.status(404).render("generate", {
        error: "Flashcard not found.",
        flashcard: null,
        sentence: null,
        furigana: null,
        translation: null,
        user: req.user,
      });
    }

    if (!sentence) {
      return res.status(400).render("generate", {
        error: "Sentence is required. Please try again.",
        flashcard: null,
        sentence: null,
        furigana: null,
        translation: null,
        user: req.user,
      });
    }

    await Sentence.create({
      user: userId,
      sentence,
      furigana: furigana || null,
      translation: translation || null,
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Save error:", error);
    let flashcard = null;
    try {
      flashcard = await Flashcard.findById(req.params.id);
    } catch {}

    return res.status(500).render("generate", {
      error: "Something went wrong. Please try again.",
      flashcard: null,
      sentence: null,
      furigana: null,
      translation: null,
      user: req.user,
    });
  }
};
const viewSentence = async (req, res) => {
  try {
    let show = [];

    if (req.user && req.user._id) {
      const usersentence = await Sentence.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      show = usersentence;
    } else {
      show = [];
    }

    return res.render("viewsentence", {
      sentences: show,
      user: req.user,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
};

const deleteSentence = async (req, res) => {
  try {
    const id = req.params.id;
    const found = await Sentence.findById(id);

    if (!found || found.user.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    await Sentence.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (error) {
    return res.redirect("/");
  }
};

module.exports = {
  createflashcard,
  deleteFlashcard,
  updateFlashcard,
  generateSentence,
  saveSentence,
  viewSentence,
  deleteSentence,
};
