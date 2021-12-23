const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

// dotenv = require('dotenv')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//process stripe payment request => api/v1/payment/process

exports.processPayment = catchAsyncErrors(async(req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'eur',
        metadata: {
            integration_check: 'accept_a_payment',
        },
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
    })
})

//send stripe API key => api/v1/stripeapi

exports.sendStripeApi = catchAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY,
    })
})