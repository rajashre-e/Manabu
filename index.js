const express = require("express");
const mongo = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const path = require("path");
const cookieparser = require("cookie-parser");
const { checkforauth } = require("./controllers/auth");
const Flashcard = require("./models/flashcard");
const defaults = require("./defaults.json");

const userroute = require("./routes/user");
const flashcardroute = require("./routes/flashcard");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.use(checkforauth("token"));
app.use(methodOverride("_method"));

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
      error: null, // ✅ Add this line
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
});

app.use("/user", userroute);

app.use("/flashcard", flashcardroute);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(port, () => console.log(`SERVER CONNECTED AT PORT ${port}`));
