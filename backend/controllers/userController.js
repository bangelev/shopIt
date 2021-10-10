const User = require('../models/User')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

//registar a user => api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'v1629658765/a3v4nob3bgpbt79itekc',
            url: 'https://res.cloudinary.com/da1rwm8l6/image/upload/v1629658765/a3v4nob3bgpbt79itekc.jpg',
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
        // zachuvuvanej token vo user
    await user.save({ validateBeforeSave: false })

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`
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

//logout user => api/v1/logout
exports.logout = catchAsyncErrors(async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        HTTPOnly: true,
    })
    res.status(200).json({
        success: true,
        message: 'User logged out',
    })
})