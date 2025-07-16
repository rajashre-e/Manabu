const express = require("express");
const mongo = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const path = require("path");
const cookieparser = require("cookie-parser");
const { checkforauth } = require("./controllers/auth");
const Flashcard = require("./models/flashcard");
const defaults = require("./defaults.json");
const axios = require("axios");
const session = require("express-session");

const userroute = require("./routes/user");
const flashcardroute = require("./routes/flashcard");
const testroute = require("./routes/test");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(checkforauth("token"));

mongo
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.error(`DB CONNECTION ERROR ${err}`));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  try {
    let show = [];

    if (req.user && req.user._id) {
      const userflash = await Flashcard.find({
        createdBy: req.user._id,
      }).sort({ createdAt: -1 });

      show = userflash;
    } else {
      show = defaults;
    }

    return res.render("home", {
      flashcards: show,
      user: req.user || null,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
});

app.use("/user", userroute);

app.use("/flashcard", flashcardroute);

app.use("/test", testroute);

app.get("/test-openrouter", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: "Say hello in Japanese" }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Flashcard Sentence Generator",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.send(`<h2>✅ OpenRouter (DeepSeek) Connected!</h2><p>${reply}</p>`);
  } catch (error) {
    console.error(
      "OpenRouter test error:",
      error?.response?.data || error.message
    );
    res
      .status(500)
      .send("❌ OpenRouter call failed. Check your API key or model.");
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(port, () => console.log(`SERVER CONNECTED AT PORT ${port}`));
