import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility functions
const generateOTP = () => crypto.randomInt(1000, 9999).toString();

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength)
    errors.push(`Password must be at least ${minLength} characters long`);
  if (!hasUpperCase)
    errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase)
    errors.push("Password must contain at least one lowercase letter");
  if (!hasNumbers) errors.push("Password must contain at least one number");
  if (!hasSpecialChar)
    errors.push("Password must contain at least one special character");

  return errors;
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Email, password, and role are required",
      });
    }

    let userResponse;
    if (role === "admin") {
      const user = await User.findOne({ email }).select("+password");

      if (!user || user.role !== "admin") {
        return res.status(401).json({
          success: false,
          error: "Invalid admin credentials",
        });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          success: false,
          error: "Invalid password",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          error: "Account not verified. Please check your email.",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          role: user.role,
          email: user.email,
          timestamp: Date.now(),
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      userResponse = {
        _id: user._id,
        role: user.role,
        name: user.name,
        hatcheryName: user.hatcheryName,
        caaNumber: user.caaNumber,
        email: user.email,
        token,
      };
    } else if (role === "employee") {
      const employee = await Employee.findOne({ email, deletedAt: null }).select("+password");

      if (!employee) {
        return res.status(401).json({
          success: false,
          error: "Employee account not found",
        });
      }

      if (!(await bcrypt.compare(password, employee.password))) {
        return res.status(401).json({
          success: false,
          error: "Invalid employee credentials",
        });
      }

      const token = jwt.sign(
        { _id: employee._id, role: "employee", email: employee.email },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      userResponse = {
        _id: employee._id,
        role: "employee",
        name: `${employee.firstName} ${employee.lastName}`,
        hatcheryName: employee.hatchery,
        email: employee.email,
        employeeId: employee.employeeId,
        token,
      };
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid role specified",
      });
    }

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: `Authentication failed: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { hatcheryName, caaNumber, name, phone, email, password } = req.body;

    if (!hatcheryName || !caaNumber || !name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Password validation failed",
        details: passwordErrors,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationOTP = generateOTP();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      hatcheryName,
      caaNumber,
      phone,
      verificationOTP,
      verificationOTPExpires: Date.now() + 600000,
    });

    await newUser.save();

    await transporter.sendMail({
      from: `SmartHatch <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your SmartHatch Admin Account",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">SmartHatch Admin Registration</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${verificationOTP}
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered. Verification OTP sent to email.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email,
      verificationOTP: otp,
      verificationOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during verification",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset link has been sent",
      });
    }

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    const resetOTP = generateOTP();
    user.resetPasswordOTP = resetOTP;
    user.resetPasswordOTPExpires = Date.now() + 600000;
    await user.save();

    await transporter.sendMail({
      from: `SmartHatch <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Password Reset</h2>
          <p>Your reset code is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${resetOTP}
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reset OTP sent to email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during password reset",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Password validation failed",
        details: passwordErrors,
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during password reset",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during logout",
    });
  }
};

export const registerEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      position,
      department,
      salary,
      emergencyContact,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !position ||
      !department ||
      !salary ||
      !emergencyContact ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Password validation failed",
        details: passwordErrors,
      });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    const employeeId = `EMP${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      address,
      position,
      department,
      salary,
      emergencyContact,
      employeeId,
      hatchery: admin.hatcheryName,
      password: hashedPassword,
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      employee: {
        employeeId,
        firstName,
        lastName,
        email,
        hatchery: admin.hatcheryName,
      },
    });
  } catch (error) {
    console.error("Employee registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during employee registration",
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    const employees = await Employee.find({
      hatchery: admin.hatcheryName,
      deletedAt: null,
    }).select("-password");

    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching employees",
    });
  }
};

export const getAdminEmployees = async (req, res) => {
  try {
    if (!req.user?._id) {
      console.error("No user ID in request");
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      console.error("Admin not found for ID:", req.user._id);
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    if (admin.role !== "admin") {
      console.error("User is not an admin:", req.user);
      return res.status(403).json({
        success: false,
        error: "Not authorized as an admin",
      });
    }

    const employees = await Employee.find({
      hatchery: admin.hatcheryName,
      deletedAt: null,
    }).select("-password");

    res.status(200).json(employees);
  } catch (error) {
    console.error("Get admin employees error:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: "Server error while fetching employees",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user?._id) {
      console.error("No user ID in request for dashboard stats");
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      console.error("Admin not found for ID:", req.user._id);
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    if (admin.role !== "admin") {
      console.error("User is not an admin:", req.user);
      return res.status(403).json({
        success: false,
        error: "Not authorized as an admin",
      });
    }

    // Mock data (replace with real data from your models)
    const stats = {
      activeRuns: 10,
      pendingLeaves: 5,
      lowStockItems: 3,
      recentActivities: [
        { id: 1, action: "Employee registered", timestamp: new Date() },
        { id: 2, action: "Leave requested", timestamp: new Date() },
      ],
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get dashboard stats error:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: "Server error while fetching dashboard stats",
    });
  }
};