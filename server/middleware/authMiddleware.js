import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      if (!token || token.trim() === "") {
        console.error("Empty token provided");
        res.status(401);
        throw new Error("Empty token provided");
      }

      if (!process.env.JWT_KEY) {
        console.error("JWT_KEY environment variable is not set");
        res.status(500);
        throw new Error("Authentication service misconfigured");
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log("Token decoded:", {
        _id: decoded._id,
        role: decoded.role,
        email: decoded.email,
      });

      if (!decoded._id || !decoded.role || !decoded.email) {
        console.error("Invalid token format:", decoded);
        res.status(401);
        throw new Error("Invalid token format - please login again");
      }

      if (decoded.role === "admin") {
        req.user = await User.findById(decoded._id).select("-password");
      } else if (decoded.role === "employee") {
        req.user = await Employee.findById(decoded._id).select("-password");
      }

      if (!req.user) {
        console.error("User not found for ID:", decoded._id);
        res.status(401);
        throw new Error("User not found or deactivated");
      }

      console.log("Authenticated user:", {
        _id: req.user._id,
        role: req.user.role,
      });
      next();
    } catch (error) {
      console.error("Authentication error:", {
        message: error.message,
        type: error.name,
        token: token ? "[provided]" : "[missing]",
      });
      res.status(401);
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid or malformed token");
      } else if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired - please login again");
      } else {
        throw new Error(error.message || "Authentication failed");
      }
    }
  } else {
    console.error("No authorization header provided");
    res.status(401);
    throw new Error("Authentication required - no token provided");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("Admin access granted:", req.user._id);
    next();
  } else {
    console.error("Admin access denied:", req.user);
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
});

export { protect, admin };