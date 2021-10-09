const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your username'],
        maxLength: [30, 'Name can not exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validators: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Your password must be at least 6 characters'],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
})

// Ebcrypting password before saving user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// compare pasword instace methods
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

// return JWB token instance method
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    })
}

module.exports = mongoose.model('User', userSchema)