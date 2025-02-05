import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    verifyOTP: {
        type: String,
        default: ''
    },
    verifyOTPExpire: {
        type: Number,
        default: 0
    },
    IsAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOTP: {
        type: String,
        default: ''
    },
    resetOTPExpire: {
        type: Number,
        default: 0
    },
}, { timestamps: true })


export const User = mongoose.model("User", UserSchema)