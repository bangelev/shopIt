const User = require('../models/User')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')
const sendToken = require('../utils/jwtToken')

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