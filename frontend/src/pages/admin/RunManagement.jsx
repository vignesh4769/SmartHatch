import React, { useState, useEffect } from "react";

const RunManagement = () => {
  const [runs, setRuns] = useState([]);
  const [currentRun, setCurrentRun] = useState("");
  const [selectedRunDetails, setSelectedRunDetails] = useState(null);

  useEffect(() => {
    // Load previous runs from localStorage or database
    const savedRuns = JSON.parse(localStorage.getItem("runs")) || [];
    setRuns(savedRuns);
    setCurrentRun(localStorage.getItem("currentRun") || "No Active Run");
  }, []);

  const startRun = () => {
    const newRunName = `Run${runs.length + 1}`;
    const updatedRuns = [...runs, newRunName];

    setRuns(updatedRuns);
    setCurrentRun(newRunName);

    localStorage.setItem("runs", JSON.stringify(updatedRuns));
    localStorage.setItem("currentRun", newRunName);
  };

  const endRun = () => {
    setCurrentRun("No Active Run");
    localStorage.removeItem("currentRun");
  };

  const handleRunDetails = (run) => {
    // Here you can load specific details of each run.
    // For this example, we will just display a simple message.
    setSelectedRunDetails(`Details of ${run}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 ml-48">
      <header className="bg-white p-4 rounded-lg shadow mb-5">
        <h2 className="text-2xl font-bold">Run Management</h2>
      </header>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Current Run: {currentRun}</h3>
        <div className="flex gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={startRun}
          >
            Start New Run
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={endRun}
            disabled={currentRun === "No Active Run"}
          >
            End Current Run
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Previous Runs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {runs.map((run, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleRunDetails(run)}
            >
              {run}
            </button>
          ))}
        </div>
      </div>

      {/* Display Details of the Selected Run */}
      {selectedRunDetails && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Run Details</h3>
          <p>{selectedRunDetails}</p>
        </div>
      )}
    </div>
  );
};

export default RunManagement;
