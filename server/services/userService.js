import { User } from "../models/user.js";



export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
        
    } catch (error) {
        throw new Error('Error creating user', 500);
    }
}

export const updateUser = async (id, updateData) => {
    try {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        return user;
    } catch (error) {
        throw new Error('Error updating user', 500);
    }
}

export const getUserById = async (id) => {
    try {
        const user = await User.findById(id).select('-password -resetpasswordToken -resetpasswordExpire');
        return user;
    } catch (error) {
        throw new Error('Error fetching user', 500);
    }
}

export const deleteUser = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found', 404);
        }
        return await user.deleteOne();
    }
    catch (error) {
        throw new Error('Error deleting user', 500);
    }   
}

export const getAllUsers = async () => {
    try {
        const query = { role : { $ne : "Admin"}}
        const users = await User.find(query).select('-password -resetpasswordToken -resetpasswordExpire').sort({ createdAt: -1 });
        const totalUsers = await User.countDocuments(query);
        return { users, totalUsers };
    } catch (error) {
        throw new Error('Error fetching users', 500);
    }
}
