const Signal = require("../models/Signal");

// Fetch latest 10 signals
const getSignals = async (req, res) => {
  try {
    const signals = await Signal.find().sort({ timestamp: -1 }).limit(10);
    res.json(signals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new signal
const addSignal = async (req, res) => {
  console.log(req.body);
  
  const { signal_color } = req.body;
  if (!["Red", "Yellow", "Green"].includes(signal_color)) {
    return res.status(400).json({ message: "Invalid signal color" });
  }

  try {
    const newSignal = new Signal({ signal_color });
    await newSignal.save();

    // Emit real-time update
    req.io.emit("newSignal", newSignal);

    res.status(201).json(newSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSignals, addSignal };
