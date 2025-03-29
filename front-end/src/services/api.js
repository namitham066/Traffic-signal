const updateSignal = async (signalId, color) => {
  try {
    const response = await fetch("http://localhost:5000/api/signals/update-signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signalId, signal_color:  newColor }),
    });

    const data = await response.json();
    console.log("Signal Update Response:", data);
  } catch (error) {
    console.error("Error updating signal:", error);
  }
};
