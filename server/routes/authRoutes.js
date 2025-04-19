import express from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  getEmployees,
  getAdminEmployees,
} from "../controllers/authController.js";
import { registerEmployee } from "../controllers/employeeController.js";
import { getDashboardStats, getEmployeeDetails } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/admin/login", (req, res) => login({ ...req, body: { ...req.body, role: "admin" } }, res));
router.post("/employee/login", (req, res) => login({ ...req, body: { ...req.body, role: "employee" } }, res));
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// Admin-only routes
router.post("/admin/employee/register", protect, admin, registerEmployee);
router.get("/admin/employees", protect, admin, getAdminEmployees);
router.get("/admin/employees/:id", protect, admin, getEmployeeDetails);
router.get("/admin/dashboard-stats", protect, admin, getDashboardStats);

export default router;