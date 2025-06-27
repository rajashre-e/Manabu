const { Router } = require("express");
const Flashcard = require("../models/flashcard");
const {
  createflashcard,

  deleteFlashcard,
  updateFlashcard,
} = require("../controllers/flashcard");

const router = Router();

function requireAuth(req, res, next) {
  if (!req.user || !req.user._id) {
    return res.redirect("/user/login");
  }
  next();
}

router.get("/create", requireAuth, (req, res) => {
  res.render("addcard", { user: req.user, error: null });
});

router.get("/update/:id", requireAuth, async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);
  if (!flashcard) return res.status(404).send("FLASHCARD NOT FOUND");
  res.render("update", { flashcard, user: req.user, error: null });
});

router.post("/create", requireAuth, createflashcard);

router.delete("/delete/:id", requireAuth, deleteFlashcard);

router.put("/:id/update", requireAuth, updateFlashcard);

module.exports = router;
