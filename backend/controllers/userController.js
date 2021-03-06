const User = require('../models/user')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2

//register a user => api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatar',
        width: 150,
        crop: 'scale',
    })
    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url, // contains http protocol
        },
    })

    sendToken(user, 200, res)
})

// user login => api/v1/login
exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const { email, password } = req.body

    // 1. checks if email and password are entered
    if (!email || !password) {
        return next(new ErrorHandler('Please enter your email and password', 400))
    }
    //2.  finding user in DB
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid email or password, try again', 401))
    }
    // 3. Checks if password is correct or not
    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid password or email, try again', 401))
    }

    sendToken(user, 200, res)
})

//forgot password => api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not found with this email address', 404))
    }
    // get reset token
    const resetToken = user.getResetPasswordToken()
        // saving token in user
    await user.save({ validateBeforeSave: false })

    // create reset password url without frontend
    //     const resetUrl = `${req.protocol}://${req.get(
    //     'host'
    //   )}/api/v1/password/reset/${resetToken}`

    // create reset password url for testing frontend
    const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/password/reset/${resetToken}`

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `ShopIT password recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(
            new ErrorHandler(
                'Password reset token is invalid or has been expired',
                400
            )
        )
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})

// get user profile details
exports.getUserProfile = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        message: 'User profile',
        user,
    })
})

// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'))
    }

    user.password = req.body.password
    await user.save()

    sendToken(user, 200, res)
})

//update user profile =>api/v1/me/update
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // Avatar

    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id
        const res = await cloudinary.uploader.destroy(image_id)

        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale',
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
    })
})

//logout user => api/v1/logout
exports.logout = catchAsyncErrors(async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        HttpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: 'User logged out',
    })
})

// Admin routes
//Get all users = api/v1/admin/users
exports.allUsers = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        message: 'Retrieved all users',
        // countUsers: users.length,
        users,
    })
})

// get user details => api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found by id ${req.params.id}`), 404)
    }
    res.status(200).json({
        success: true,
        message: 'User details',
        user,
    })
})

//ADMIN - update user profile =>api/v1/admin/users/:id
exports.updateUser = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindByIdAndModify: true,
        })
        // Avatar TODO
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user,
    })
})

// delete user profile details =>api/v1/admin/users/:id
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(
            new ErrorHandler(`User does not found with id: ${req.params.id}`)
        )
    }
    // Remove Avatar from cloudinary
    const image_id = user.avatar.public_id
    await cloudinary.uploader.destroy(image_id)

    await user.remove()
    res.status(200).json({
        success: true,
        message: 'User deleted',
        user,
    })
})