import React, { useState, useEffect } from "react";
import "./SignalCard.css";
import redLight from "../assets/Images/red.jpg";
import yellowLight from "../assets/Images/yellow.jpg";
import greenLight from "../assets/Images/green.jpg";

const signalColors = ["Red", "Yellow", "Green"];
const signalImages = { Red: redLight, Yellow: yellowLight, Green: greenLight };

const SignalCard = ({ signalId, initialColor, updateSignal }) => {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [history, setHistory] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevColor) => {
        const nextIndex = (signalColors.indexOf(prevColor) + 1) % signalColors.length;
        const newColor = signalColors[nextIndex];

        setHistory((prevHistory) => {
          const newHistory = [{ color: newColor, timestamp: new Date().toLocaleString() }, ...prevHistory];
          return newHistory.slice(0, 10);
        });

        return newColor;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Function to manually change signal color
  const handleSignalChange = (newColor) => {
    setCurrentColor(newColor);

    setHistory((prevHistory) => {
      const newHistory = [{ color: newColor, timestamp: new Date().toLocaleString() }, ...prevHistory];
      return newHistory.slice(0, 10);
    });

    // if (updateSignal) {
      updateSignal(signalId, newColor); // Call backend function if provided
    // }
  };

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="signal-card" onClick={handleCardClick}>
      <h3>Signal {signalId}</h3>
      <img src={signalImages[currentColor]} alt={currentColor} className="signal-image" />
      <p>Current: {currentColor}</p>

      {/* 🔹 Buttons to manually update signal */}
      <div className="signal-buttons">
        <button onClick={() => handleSignalChange("Red")} style={{ background: "red" }}>
          Red
        </button>
        <button onClick={() => handleSignalChange("Yellow")} style={{ background: "yellow" }}>
          Yellow
        </button>
        <button onClick={() => handleSignalChange("Green")} style={{ background: "green" }}>
          Green
        </button>
      </div>

      {isPopupOpen && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Signal History</h3>
            <table>
              <thead>
                <tr>
                  <th>Signal Color</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.color}</td>
                    <td>{entry.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalCard;
