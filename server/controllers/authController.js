import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorHandler from "../middleware/error.js";
import  {User}  from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = asyncHandler(async(req, res, next) => {
    const { name, email, password,role } = req.body;

    if (!name || !email || !password || !role) {
        return next(new ErrorHandler(400, 'Please enter all fields'));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler(400, 'User already exists'));
    }
    user = new User({
        name,
        email,
        password,
        role
    });
    await user.save();
    generateToken(user,201,'User registered successfully',res);
})

export const login = asyncHandler(async(req, res, next) => {
    const { email, password , role} = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler(400, 'Please enter all fields'));
    }
    const user = await User.findOne({
        email,role
    }).select('+password');
    if (!user) {
        return next(new ErrorHandler(401, 'Invalid credentials'));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler(401, 'Invalid credentials'));
    }
    generateToken(user,200,'User logged in successfully',res);
});

export const getUser = asyncHandler(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
})

export const logout = asyncHandler(async(req, res, next) => {
     res.status(200).cookie('token', '', {
        expires : new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: 'User logged out successfully',
    });
})

export const forgotPassword = asyncHandler(async(req, res, next) => {})

export const resetPassword = asyncHandler(async(req, res, next) => {})