import React from "react";

const SignalPopup = ({ signal, onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold">Signal Details</h2>
        <p>Color: {signal.color}</p>
        <p>Timestamp: {new Date(signal.timestamp).toLocaleString()}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default SignalPopup;
