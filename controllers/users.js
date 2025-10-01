const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequest,
  NotFound,
  ServerError,
  ConflictError,
  UnauthError,
} = require("../middlewares/error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password)
    return next(new BadRequest("All fields are required"));

  User.findOne({ email })
    .then((user) => {
      if (user) return next(new ConflictError("Email already exists!"));

      return bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return next(new ServerError(err.message));

        User.create({ name, avatar, email, password: hashedPassword })
          .then((createdUser) => {
            const userObj = createdUser.toObject();
            delete userObj.password;
            res.status(201).send(userObj);
          })
          .catch((err) => {
            if (err.code === 11000)
              return next(new ConflictError("Email already exists"));
            if (err.name === "ValidationError")
              return next(new BadRequest(err.message));
            next(new ServerError(err.message));
          });
      });
    })
    .catch((err) => next(new ServerError(err.message)));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new BadRequest("Enter both fields"));

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password!")
        return next(new UnauthError(err.message));
      next(new ServerError("Server error"));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(new ServerError(err.message)));
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (!user) return next(new NotFound("User not found"));
      res.status(200).send(user);
    })
    .catch((err) => next(new ServerError(err.message)));
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name && !avatar)
    return next(new BadRequest("No changes made to avatar or user"));

  const updatedData = {};
  if (name) updatedData.name = name;
  if (avatar) updatedData.avatar = avatar;

  return User.findByIdAndUpdate(req.user._id, updatedData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) return next(new NotFound("User not found!"));
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return next(new BadRequest(err.message));
      next(new ServerError(err.message));
    });
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateProfile };
