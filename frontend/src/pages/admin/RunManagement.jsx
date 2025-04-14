import React, { useState, useEffect } from "react";
import RunForm from "../../components/admin/RunForm";
import { createRun, getRuns, updateRunStatus, getRunById } from "../../api/runApi";
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
        setRuns(data.runs);
        const activeRun = data.runs.find(run => run.status === 'in-progress');
        setCurrentRun(activeRun || null);
      } catch (error) {
        toast.error(error.error || "Failed to fetch runs");
      }
    };
    fetchRuns();
  }, []);

  const handleCreateRun = async (runData) => {
    setLoading(true);
    try {
      const newRun = await createRun(runData);
      setRuns([...runs, newRun.run]);
      setCurrentRun(newRun.run);
      setIsFormOpen(false);
      toast.success('Run created successfully');
    } catch (error) {
      toast.error(error.error || "Failed to create run");
    } finally {
      setLoading(false);
    }
  };

  const handleEndRun = async () => {
    try {
      await updateRunStatus(currentRun._id, { status: 'completed' });
      setCurrentRun(null);
      const updatedRuns = await getRuns();
      setRuns(updatedRuns.runs);
      toast.success('Run ended successfully');
    } catch (error) {
      toast.error(error.error || "Failed to end run");
    }
  };

  const handleRunDetails = async (run) => {
    try {
      const details = await getRunById(run._id);
      setSelectedRunDetails(details.run);
    } catch (error) {
      toast.error(error.error || "Failed to fetch run details");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 ml-56">
      <header className="bg-white p-4 rounded-lg shadow mb-5">
        <h2 className="text-2xl font-bold">Run Management</h2>
      </header>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Current Run: {currentRun ? currentRun.runNumber : "No Active Run"}
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

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
          {runs.map((run) => (
            <button
              key={run._id}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleRunDetails(run)}
            >
              {run.runNumber}
            </button>
          ))}
        </div>
      </div>

      {selectedRunDetails && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Run Details</h3>
          <p><strong>Run Number:</strong> {selectedRunDetails.runNumber}</p>
          <p><strong>Status:</strong> {selectedRunDetails.status}</p>
          <p><strong>Start Date:</strong> {new Date(selectedRunDetails.startDate).toLocaleDateString()}</p>
          <p><strong>Expected End Date:</strong> {new Date(selectedRunDetails.expectedEndDate).toLocaleDateString()}</p>
          {selectedRunDetails.actualEndDate && (
            <p><strong>Actual End Date:</strong> {new Date(selectedRunDetails.actualEndDate).toLocaleDateString()}</p>
          )}
          <p><strong>Budget:</strong> ${selectedRunDetails.financials.budget}</p>
          <p><strong>Assigned Employees:</strong></p>
          <ul>
            {selectedRunDetails.assignedEmployees.map((assignment) => (
              <li key={assignment.employee._id}>
                {assignment.employee.firstName} {assignment.employee.lastName} ({assignment.role}, {assignment.shift})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RunManagement;