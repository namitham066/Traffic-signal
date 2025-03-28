const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema({
  signalId: String,
  signal_color: {
    type: String,
    enum: ["Red", "Yellow", "Green"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Signal", signalSchema);
