const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: " Provide a valid URL! ",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: " Provide a valid email! ",
    },
  },
  password: {
    required: true,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message:
        "Password must be at least 8 characters long, with at least one lowercase letter, one uppercase letter, one number, and one symbol.",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error("Incorrect email or password!"));
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password!"));
      }
      return user;
    });
  });
};

module.exports = mongoose.model("User", userSchema);
