import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateOTP = () => crypto.randomInt(1000, 9999).toString();

// Existing login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        error: "Account not verified. Please check your email." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { 
        _id: user._id, 
        role: user.role, 
        name: user.name,
        hatcheryName: user.hatcheryName 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Updated signup with email verification
export const signup = async (req, res) => {
  try {
    const { hatcheryName, caaNumber, name, phone, email, password } = req.body;
    
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
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
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
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
// In forgotPassword function - Update the OTP generation and storage:
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: true });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "No verified account found with this email" 
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

    console.log(`Generated OTP for ${email}:`, resetOTP); // Debug log

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
      error: error.message 
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
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
    
    res.status(200).json({ 
      success: true, 
      message: "OTP verified",
      tempToken: jwt.sign(
        { _id: user._id, resetAuth: true },
        process.env.JWT_KEY,
        { expiresIn: '15m' }
      )
    });
  } catch (error) {
   
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// In resetPassword function:
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    

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
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};