const Flashcard = require("../models/flashcard");

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

module.exports = { createflashcard, deleteFlashcard, updateFlashcard };
