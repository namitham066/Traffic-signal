const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const Signal = require("./models/Signal"); 
const signalRoutes = require("./routes/signalRoutes"); 

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Attach Socket.io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Use Routes
app.use("/api/signals", signalRoutes);

// ✅ Fetch latest 10 signals or create default ones
// app.get("/api/signals", async (req, res) => {
//   try {
//     // Fetch the latest 10 signals from MongoDB
//     let signals = await Signal.find().sort({ timestamp: -1 }).limit(10);

//     // If there are no signals in the database, insert default ones
//     if (await Signal.countDocuments() === 0) {
//       const defaultSignals = Array.from({ length: 10 }, (_, i) => ({
//         signalId: `S${i + 1}`,
//         signal_color: "Red",
//         timestamp: new Date(),
//       }));

//       await Signal.insertMany(defaultSignals);
//       signals = await Signal.find().sort({ timestamp: -1 }).limit(10); // Fetch again
//     }

//     res.json(signals);
//   } catch (error) {
//     console.error("Error fetching signals:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// Default Route (Check if server is running)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Real-time updates using Socket.io
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("updateSignal", async ({ signalId, signal_color }) => {
    try {
      const updatedSignal = await Signal.findOneAndUpdate(
        { signalId },
        { $set: { signal_color, timestamp: new Date() } },
        { new: true, upsert: true }
      );
      
      io.emit("receiveSignal", updatedSignal);
    } catch (error) {
      console.error("Error updating signal:", error);
    }
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
