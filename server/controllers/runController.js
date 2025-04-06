import Run from "../models/Run.js";
import Employee from "../models/Employee.js";

export const createRun = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget, employeeIds } = req.body;

    if (!name || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        error: "Name, dates and budget are required"
      });
    }

    // Validate employees exist
    const employees = await Employee.find({
      _id: { $in: employeeIds },
      status: 'active'
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        success: false,
        error: "One or more employees not found or inactive"
      });
    }

    const run = new Run({
      name,
      description,
      startDate,
      endDate,
      budget,
      employees: employeeIds,
      createdBy: req.user._id
    });

    await run.save();

    // Add run to employees
    await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $addToSet: { runs: run._id } }
    );

    res.status(201).json({
      success: true,
      message: "Run created successfully",
      run
    });
  } catch (error) {
    console.error("Create run error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error creating run" 
    });
  }
};

export const getRuns = async (req, res) => {
  try {
    const runs = await Run.find()
      .populate('employees', 'employeeId designation')
      .populate('createdBy', 'name')
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      runs
    });
  } catch (error) {
    console.error("Get runs error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error fetching runs" 
    });
  }
};

export const updateRunStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['planned', 'active', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status"
      });
    }

    const run = await Run.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!run) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: `Run marked as ${status}`,
      run
    });
  } catch (error) {
    console.error("Update run status error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error updating run status" 
    });
  }
};

export const getRunDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const run = await Run.findById(id)
      .populate('employees', 'employeeId name designation')
      .populate('createdBy', 'name')
      .populate('expenses');

    if (!run) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    res.status(200).json({
      success: true,
      run
    });
  } catch (error) {
    console.error("Get run details error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error fetching run details" 
    });
  }
};