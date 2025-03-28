const express = require("express");
const router = express.Router();
const Signal = require("../models/Signal");

// ✅ Update or Insert Signal Data
router.post("/update-signal", async (req, res) => {
  try {
    
    
    const { signalId, signal_color } = req.body;
    // console.log(si);
    

    if (!signalId || !signal_color) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedSignal = await Signal.findOneAndUpdate(
      { signalId },
      { $set: { signal_color, timestamp: new Date() } }, // ✅ Fix: Use $set to update fields
      { new: true, upsert: false }
    );
    req.io.emit("receiveSignal", updatedSignal)

    res.status(200).json({ message: "Signal updated successfully", data: updatedSignal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Fetch last 10 updates for a specific signal
router.get("/", async (req, res) => {
  try {
    // const { signalId } = req.query;
    const history = await Signal.find({ })
      .sort({ timestamp: -1 }) // Sort latest first
      .limit(10); // Get only last 10 records

    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
