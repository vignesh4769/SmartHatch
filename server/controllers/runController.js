import Run from "../models/Run.js";
import Employee from "../models/Employee.js";

export const createRun = async (req, res) => {
  try {
    const { runNumber, description, startDate, expectedEndDate, budget, assignedEmployees } = req.body;

    if (!runNumber || !startDate || !expectedEndDate || !budget || !assignedEmployees) {
      return res.status(400).json({
        success: false,
        error: "Run number, dates, budget, and assigned employees are required"
      });
    }

    // Validate employees exist and are active
    const employeeIds = assignedEmployees.map(assignment => assignment.employee);
    const employees = await Employee.find({
      _id: { $in: employeeIds },
      deletedAt: null
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        success: false,
        error: "One or more employees not found or inactive"
      });
    }

    // Validate assignedEmployees structure
    for (const assignment of assignedEmployees) {
      if (!assignment.employee || !assignment.role || !['morning', 'afternoon', 'night'].includes(assignment.shift)) {
        return res.status(400).json({
          success: false,
          error: "Invalid employee assignment data"
        });
      }
    }

    const run = new Run({
      runNumber,
      description,
      startDate,
      expectedEndDate,
      financials: { budget },
      assignedEmployees,
      createdBy: req.user._id,
      hatchery: employees[0].hatchery // Assuming hatchery comes from employees
    });

    await run.save();

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
    const { page = 1, limit = 10, status } = req.query;
    const query = { deletedAt: null };
    if (status) query.status = status;

    const runs = await Run.find(query)
      .populate('assignedEmployees.employee', 'employeeId firstName lastName position')
      .populate('createdBy', 'name')
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Run.countDocuments(query);

    res.status(200).json({
      success: true,
      runs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get runs error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error fetching runs" 
    });
  }
};

export const getRunDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const run = await Run.findById(id)
      .populate('assignedEmployees.employee', 'employeeId firstName lastName position')
      .populate('createdBy', 'name')
      .populate('tanks.maintenanceHistory.performedBy', 'employeeId firstName lastName')
      .populate('inventory.item', 'name')
      .populate('dailyReports.reportedBy', 'employeeId firstName lastName');

    if (!run || run.deletedAt) {
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

export const updateRunStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['planned', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status"
      });
    }

    const run = await Run.findById(id);
    if (!run || run.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    run.status = status;
    if (status === 'completed') {
      run.actualEndDate = new Date();
    }
    await run.save();

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

export const deleteRun = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const run = await Run.findById(id);
    if (!run || run.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    await run.softDelete(reason || "No reason provided");

    res.status(200).json({
      success: true,
      message: "Run deleted successfully"
    });
  } catch (error) {
    console.error("Delete run error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error deleting run" 
    });
  }
};

export const addEmployeeToRun = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, role, shift } = req.body;

    if (!employeeId || !role || !['morning', 'afternoon', 'night'].includes(shift)) {
      return res.status(400).json({
        success: false,
        error: "Employee ID, role, and valid shift are required"
      });
    }

    const run = await Run.findById(id);
    if (!run || run.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee || employee.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Employee not found" 
      });
    }

    run.assignedEmployees.push({ employee: employeeId, role, shift });
    await run.save();

    res.status(200).json({
      success: true,
      message: "Employee added to run",
      run
    });
  } catch (error) {
    console.error("Add employee to run error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error adding employee to run" 
    });
  }
};

export const removeEmployeeFromRun = async (req, res) => {
  try {
    const { id, employeeId } = req.params;

    const run = await Run.findById(id);
    if (!run || run.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    const index = run.assignedEmployees.findIndex(
      assignment => assignment.employee.toString() === employeeId
    );
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        error: "Employee not assigned to this run" 
      });
    }

    run.assignedEmployees.splice(index, 1);
    await run.save();

    res.status(200).json({
      success: true,
      message: "Employee removed from run",
      run
    });
  } catch (error) {
    console.error("Remove employee from run error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error removing employee from run" 
    });
  }
};

export const getRunStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const run = await Run.findById(id);
    if (!run || run.deletedAt) {
      return res.status(404).json({ 
        success: false, 
        error: "Run not found" 
      });
    }

    const stats = {
      totalExpenses: run.calculateTotalExpenses(),
      profitLoss: run.calculateProfitLoss(),
      employeeCount: run.assignedEmployees.length,
      tankUsage: run.tanks.length,
      daysRunning: run.actualEndDate 
        ? Math.ceil((run.actualEndDate - run.startDate) / (1000 * 60 * 60 * 24))
        : Math.ceil((new Date() - run.startDate) / (1000 * 60 * 60 * 24))
    };

    res.status(200).json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error("Get run statistics error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error fetching run statistics" 
    });
  }
};