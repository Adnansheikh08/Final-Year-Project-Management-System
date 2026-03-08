import { asyncHandler } from "./asyncHandler.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.js";


export const isAuthenticated = asyncHandler(async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler(401, 'Please login to access this resource'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select('-resetpasswordToken -resetpasswordExpire');
    if (!req.user) {
        return next(new ErrorHandler(404, 'Not authorized, user not found'));
    }
    next();
})

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(403, `Role: ${req.user.role} is not allowed to access this resource`));
        }       
        next();
}
}