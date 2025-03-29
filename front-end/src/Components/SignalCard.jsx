import React, { useState, useEffect } from "react";
import "./SignalCard.css";
import redLight from "../assets/Images/red.jpg";
import yellowLight from "../assets/Images/yellow.jpg";
import greenLight from "../assets/Images/green.jpg";

const signalColors = ["Red", "Yellow", "Green"];
const signalImages = { Red: redLight, Yellow: yellowLight, Green: greenLight };

const SignalCard = ({ signalId, initialColor, updateSignal, socket }) => {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [history, setHistory] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {

    socket.on("receiveSignal", (signal) => {
      console.log("🚀 ~ socket.on ~ signal:", signal);
      
      if (signal.signalId === signalId) {
        setCurrentColor(signal.signal_color);
      }
    });
    
  }, []);



  const handleCardClick = () => {
    setIsPopupOpen(true);

    fetchHistory();
  };
  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/signals?signalId=${signalId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching signal history:", error);
    }
  }

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="signal-card" onClick={handleCardClick}>
      <h3>Signal {signalId}</h3>
      <img src={signalImages[currentColor]} alt={currentColor} className="signal-image" />
      <p>Current: {currentColor}</p>

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
                    <td>{entry.signal_color}</td>
                    <td>{new Date(entry.timestamp).toLocaleDateString()}-{new Date(entry.timestamp).toLocaleTimeString()}</td>
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
