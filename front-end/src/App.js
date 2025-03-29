import React, { useEffect, useState } from "react";
import axios from "axios";
import SignalCard from "./Components/SignalCard"; 
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    // Fetch initial signals
    const fetchSignals = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/signals?signalId=S1");
        setSignals(data);
      } catch (error) {
        console.error("Error fetching signals:", error);
      }
    };

    fetchSignals();

    // Listen for real-time updates
    socket.on("receiveSignal", (updatedSignals) => {
      setSignals(updatedSignals); // Replace full list of 10 signals
    });
    

    return () => socket.off("receiveSignal"); // Cleanup on unmount
  }, []);

  return (
    <div className="app">
      <h1>Real-Time Traffic Signals</h1>
      <div className="signal-grid">
      {signals.length > 0 ? (
  signals.map((signal, index) => (
    <SignalCard
      key={signal.signalId || index}
      signalId={signal.signalId}
      initialColor={signal.signal_color}
    />
  ))
) : (
  <p>No signals available</p>
)}

      </div>
    </div>
  );
};

export default App;
