const User = require("../models/user");
const dummyset = require("../defaults.json");
const Flashcard = require("../models/flashcard");
const { createtoken } = require("../controllers/auth");
const bcrypt = require("bcrypt");
const rounds = 10;

const login = async (req, res) => {
  const { email, password } = req.body;

  const found = await User.findOne({ email });
  if (!found) {
    return res.status(404).render("login", {
      error: "User not found. Redirecting to home...",
    });
  }

  const match = await bcrypt.compare(password, found.password);
  if (!match) {
    return res.status(401).render("login", {
      error: "Incorrect credentials. Redirecting to home...",
    });
  }

  const token = createtoken(found);
  return res.cookie("token", token, { httpOnly: true }).redirect("/");
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("ALL FIELDS REQUIRED");
  }

  const exist = await User.findOne({ email });

  if (exist) {
    return res.status(400).render("signup", {
      error: "User already exists. Redirecting to home...",
    });
  }

  const hashed = await bcrypt.hash(password, rounds);
  const newuser = await User.create({ username, email, password: hashed });

  const insertdummy = dummyset.map((card) => ({
    ...card,
    createdBy: newuser._id,
  }));

  await Flashcard.insertMany(insertdummy);
  const token = createtoken(newuser);

  return res.cookie("token", token, { httpOnly: true }).redirect("/");
};

module.exports = { signup, login };
