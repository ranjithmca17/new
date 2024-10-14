
// UserModel.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    tenantId: {
        type: String,
        required: [true, 'Tenant ID is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restrict to specific roles
        default: 'user', // Default role
        required: [true, 'Role is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpiry: {
        type: Date,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const UserVal = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserVal;
