import * as UserService from '../services/userService.js';  
import {asyncHandler} from '../middleware/asyncHandler.js';
import ErrorHandler from "../middleware/error.js";

export const createStudent = asyncHandler(async (req, res , next ) => {
    const { name, email, password , department } = req.body;
    if(!name || !email || !password || !department) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }
    const user = await UserService.createUser({
        name,
        email,
        password,
        role: 'Student',
        department : department || 'NULL'
    });
    res.status(201).json({  
        success: true,
        message: 'Student created successfully',
        data: {user}
    });
});

export const updateStudent = asyncHandler(async (req, res , next ) => {
    const { id } = req.params;
    const updateData = {...req.body};  
    delete updateData.role;
    const user = await UserService.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler('Student not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: {user}
    }); 
});

export const deleteStudent = asyncHandler(async (req, res , next ) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
        return next( new ErrorHandler('Student not found', 404));
    } 
    if (user.role !== 'Student') {
        return next(new ErrorHandler('User is not a student', 400));
    }
    await UserService.deleteUser(id);
    res.status(200).json({
        success: true,
        message: 'Student deleted successfully'
    });
});

export const createTeacher = asyncHandler(async (req, res , next ) => {
    const { name, email, password , department , maxStudents , expertise } = req.body;
    if(!name || !email || !password || !department || !maxStudents || !expertise) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }
    const user = await UserService.createUser({
        name,
        email,
        password,
        role: 'Teacher',
        department : department || 'NULL',
        maxStudents : maxStudents,
        expertise : Array.isArray(expertise) ? expertise : typeof expertise === 'string' && expertise.trim() !== '' ? expertise.split(',').map(item => item.trim()) : []
    });
    res.status(201).json({  
        success: true,
        message: 'Teacher created successfully',
        data: {user}
    });
});

export const updateTeacher = asyncHandler(async (req, res , next ) => {
    const { id } = req.params;
    const updateData = {...req.body};  
    delete updateData.role;
    const user = await UserService.updateUser(id, updateData);
    if (!user) {
        return next(new ErrorHandler('Teacher not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        data: {user}
    }); 
});

export const deleteTeacher = asyncHandler(async (req, res , next ) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
        return next( new ErrorHandler('Teacher not found', 404));
    } 
    if (user.role !== 'Teacher') {
        return next(new ErrorHandler(404,'User is not a teacher'));
    }
    await UserService.deleteUser(id);
    res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully'
    });
});

export const getAllUser = asyncHandler(async (req, res , next ) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: {users}
    });
});

export const getUserById = asyncHandler(async (req, res , next ) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: {user}
    });
});