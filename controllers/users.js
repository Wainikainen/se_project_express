const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTH_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(SERVER_ERROR).send({ message: err.message });
    }
    User.create({ name, avatar, email, password: hashedPassword })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Email already exists" });
        }
        if (err.name === "ValidationError") {
          return res.status(BAD_REQUEST).send({ message: err.message });
        }
        return res.status(SERVER_ERROR).send({ message: err.message });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(UNAUTH_ERROR).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(NOT_FOUND).send({ message: err.message });
    });
};

module.exports = { getUsers, getUser, createUser, login };
