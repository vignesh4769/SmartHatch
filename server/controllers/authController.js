import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 4-digit OTP
const generateOTP = () => crypto.randomInt(1000, 9999).toString();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        error: "Account not verified. Please check your email." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    // Omit sensitive data from response
    const userResponse = {
      _id: user._id,
      role: user.role,
      name: user.name,
      hatcheryName: user.hatcheryName,
      email: user.email
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during authentication" 
    });
  }
};

// Other controller functions remain the same as in your original code
// (signup, verifyEmail, forgotPassword, verifyOTP, resetPassword, logout)

export const logout = async (req, res) => {
  try {
    // In a production system, you might:
    // 1. Add token to a blacklist
    // 2. Track logout time in user record
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during logout" 
    });
  }
};

// Password validation rules
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters long`);
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');

  return errors;
};

export const signup = async (req, res) => {
  try {
    const { hatcheryName, caaNumber, name, phone, email, password } = req.body;
    
    // Validate required fields
    if (!hatcheryName || !caaNumber || !name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Password validation failed",
        details: passwordErrors
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: "Email already registered" 
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
      verificationOTPExpires: Date.now() + 600000 // 10 minutes
    });

    await newUser.save();

    // Send verification email
    await transporter.sendMail({
      from: `SmartHatch <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your SmartHatch Admin Account',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">SmartHatch Admin Registration</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${verificationOTP}
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: "Admin registered. Verification OTP sent to email.",
      email
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during registration" 
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ 
      email,
      verificationOTP: otp,
      verificationOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired OTP" 
      });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during verification" 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const user = await User.findOne({ email, isVerified: true });
    
    if (!user) {
      // Return generic message for security
      return res.status(200).json({ 
        success: true, 
        message: "If this email exists, a reset link has been sent" 
      });
    }

    // Clear any existing OTP first
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    // Generate and save new OTP
    const resetOTP = generateOTP();
    user.resetPasswordOTP = resetOTP;
    user.resetPasswordOTPExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      from: `SmartHatch <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Password Reset</h2>
          <p>Your reset code is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${resetOTP}
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Reset OTP sent to email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during password reset" 
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired OTP" 
      });
    }
    
    const tempToken = jwt.sign(
      { 
        _id: user._id, 
        resetAuth: true,
        email: user.email
      },
      process.env.JWT_KEY,
      { expiresIn: '15m' }
    );

    res.status(200).json({ 
      success: true, 
      message: "OTP verified",
      tempToken
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during OTP verification" 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Password validation failed",
        details: passwordErrors
      });
    }

    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired OTP" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during password reset" 
    });
  }
};