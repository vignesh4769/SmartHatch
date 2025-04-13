import React, { useState, useEffect } from "react";
import RunForm from "../../components/admin/RunForm";
import { createRun } from "../../api/runApi";
import { getRuns, endRun } from "../../api/adminApi";
import { toast } from "react-toastify";

const RunManagement = () => {
  const [runs, setRuns] = useState([]);
  const [currentRun, setCurrentRun] = useState(null);
  const [selectedRunDetails, setSelectedRunDetails] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const data = await getRuns();
        setRuns(data);
        const activeRun = data.find(run => run.status === 'active');
        setCurrentRun(activeRun || null);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchRuns();
  }, []);

  const handleCreateRun = async (runData) => {
    setLoading(true);
    try {
      const newRun = await createRun(runData);
      setRuns([...runs, newRun]);
      setCurrentRun(newRun);
      setIsFormOpen(false);
      toast.success('Run created successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndRun = async () => {
    try {
      await endRun(currentRun._id);
      setCurrentRun(null);
      toast.success('Run ended successfully');
    } catch (error) {
      toast.error(error.message);
    }
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
        <h3 className="text-lg font-semibold mb-4">
          Current Run: {currentRun ? currentRun.name : "No Active Run"}
        </h3>
        <div className="flex gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsFormOpen(true)}
          >
            Start New Run
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={handleEndRun}
            disabled={!currentRun}
          >
            End Current Run
          </button>
        </div>
      </div>

      {/* Run Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Run</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <RunForm 
              onSubmit={handleCreateRun} 
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Previous Runs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {runs.map((run, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleRunDetails(run)}
            >
              {run.name}
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
