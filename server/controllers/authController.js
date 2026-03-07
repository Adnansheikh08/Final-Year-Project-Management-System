import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/user.js";
import { generateEmailTemplate } from "../utils/emailTemplate.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../services/emailService.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(new ErrorHandler(400, "Please enter all fields"));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(400, "User already exists"));
  }
  user = new User({
    name,
    email,
    password,
    role,
  });
  await user.save();
  generateToken(user, 201, "User registered successfully", res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler(400, "Please enter all fields"));
  }
  const user = await User.findOne({
    email,
    role,
  }).select("+password");
  if (!user) {
    return next(new ErrorHandler(401, "Invalid credentials"));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler(401, "Invalid credentials"));
  }
  generateToken(user, 200, "User logged in successfully", res);
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler(404, "User not found with this email"));
  }
  const resetToken = user.getResetPasswordToken();
 

  await user.save({ validateBeforeSave: false });

  

  const resetpasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const message = generateEmailTemplate(resetpasswordUrl);
 

  try {
    await sendEmail({
      to: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(500, error.message || "Email could not be sent"),
    );
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const resetpasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetpasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler(400, "Invalid or expired token"));
  }
  if (!req.body.password || !req.body.confirmPassword) {
    return next(new ErrorHandler(400, "Please enter a new password"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(400, "Passwords do not match"));
  }

  user.password = req.body.password;
  user.resetpasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();
  generateToken(user, 200, "Password reset successfully", res);
});
