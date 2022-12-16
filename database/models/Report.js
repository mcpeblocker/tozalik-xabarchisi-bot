const mongoose = require("mongoose");

const Report = mongoose.model(
  "Report",
  new mongoose.Schema({
    photo: String,
    comment: String,
    reportedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    region: String, // viloyat
    district: String, // tuman
    latitude: String,
    longitude: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = Report;
