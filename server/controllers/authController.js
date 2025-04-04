import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
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

const signup = async (req, res) => {
  try {
    const { email, password, name, role, hatcheryName, caaNumber, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: "Email already registered" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      hatcheryName,
      caaNumber,
      phone
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        hatcheryName: newUser.hatcheryName
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export { login, signup };