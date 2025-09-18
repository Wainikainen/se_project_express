const { UNAUTH_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTH_ERROR).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTH_ERROR).send({ message: "Authorization failed!" });
  }

  req.user = payload;
  next();
};
