const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.SECRET;

const User = require("../models/user");

function createtoken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  return JWT.sign(payload, secret, { expiresIn: "7d" });
}
function validatetoken(token) {
  return JWT.verify(token, secret);
}

function checkforauth(cookiename) {
  return async (req, res, next) => {
    const token = req.cookies?.[cookiename];
    if (!token) {
      req.user = null;
      res.locals.user = null;
      return next();
    }

    try {
      const decoded = validatetoken(token);
      const user = await User.findById(decoded._id);

      if (!user) {
        res.clearCookie(cookiename);
        return res.status(401).send("USER NOT FOUND");
      }

      req.user = user;
      res.locals.user = user;
      return next();
    } catch (error) {
      res.clearCookie(cookiename);

      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." });
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }
  };
}

module.exports = {
  checkforauth,
  validatetoken,
  createtoken,
};
