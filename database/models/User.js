const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    telegramId: {
      type: Number,
    },
  })
);

module.exports = User;
