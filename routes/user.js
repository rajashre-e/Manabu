const express = require("express");
const router = express.Router();
const { checkforauth } = require("../controllers/auth");
const { signup, login } = require("../controllers/user");

router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

router.get("/login", (req, res) => {
  res.render("signin", { error: null });
});

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", checkforauth("token"), (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
