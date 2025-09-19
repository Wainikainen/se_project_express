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
  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: " email already exists!! " });
    }
      return bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        return res.status(SERVER_ERROR).send({ message: error.message });
      }

      return User.create({ name, avatar, email, password: hashedPassword })

        .then((createdUser) => {
          const userObj = createdUser.toObject();
          delete userObj.password;
          res.status(201).send(userObj);
        })
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
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Enter both fields !!!" });
  }

    return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })

    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password!") {
        return res.status(UNAUTH_ERROR).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
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

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(NOT_FOUND).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: " No changes made to avatar or user!! " });
  }
  const updatedData = {};
  if (name) updatedData.name = name;
  if (avatar) updatedData.avatar = avatar;

    return User.findByIdAndUpdate(req.user._id, updatedData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found!!" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateProfile };
