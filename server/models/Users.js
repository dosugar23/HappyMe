const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  isWorker: {
      type: Boolean,
  },
  gender: {
    type: String,
  },
  birthday: {
    type: String,
  },
  description: {
    type: String,
  },
  skill: {
    type: Array,
  },
  role: {
    type: String,
    // freelance , company , admin
  },
  money: {
    type: Number
  }
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
