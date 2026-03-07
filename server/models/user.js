import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        MaxLength: [50, 'Name cannot exceed 50 characters']
    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter your password'],
        select: false,
        minLength: [8, 'Password must be at least 8 characters']
    },
    role:{
        type: String,
        enum: ['Student', 'Admin' , "Teacher"],
        default: 'Student'
    },
    resetpasswordToken: String,
    resetpasswordExpire: Date,

    department:{
        type : String,
        trim: true,
        default: null,
    },
    expertise:{
        type :[String],
        default: [],
    },  
    maxStudents:{
        type: Number,
        default: 10,
        min : [1, 'Max students must be at least 1']
    },
    assignedStudents:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null,
    },
},{
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}
export const User = mongoose.model('User', userSchema);