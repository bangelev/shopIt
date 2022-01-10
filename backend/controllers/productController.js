const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary').v2

// Create New Product => /api/v1/products/new
exports.newProduct = catchAsyncErrors(async(req, res, next) => {
    // In case is one img it will be string not Array
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    let imagesLinks = []
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: 'products',
        })
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }
    req.body.images = imagesLinks
    req.body.user = req.user._id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
    })
})

// get ALL products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async(req, res, next) => {
    // Results per page
    const resPerPage = Number(req.query.limit) || 4

    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
        // Mora da go pvikame query za da se izvrshi baraweto t.e
        // query ce bide Product.find({name:"keyword"})
    const products = await apiFeatures.query

    res.status(200).json({
        success: true,
        message: 'This route will show all selected products',
        count: products.length,
        productCount,
        resPerPage,
        products,
    })
})

// get ONE Product => /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    res.status(200).json({
        success: true,
        message: 'Product was successfully retrieved',
        product,
    })
})

// update a single Product => /api/v1/admin/products/:id
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    // In case is one img it will be string not Array
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if (images !== undefined) {
        //Deleting images associated with product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.uploader.destroy(
                product.images[i].public_id
            )
        }

        let imagesLinks = []
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'products',
            })
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }
        req.body.images = imagesLinks
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
    })
})

// Get admin product api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async(req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        success: true,
        products,
    })
})

// delete product  => api/v1/admin/products/:id

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    //Deleting images associated with product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.uploader.destroy(
            product.images[i].public_id
        )
    }
    await product.deleteOne()
    res.status(200).json({
        success: true,
        message: 'Product deleted',
    })
})

//Create and update review to product =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
        const { rating, comment, productId } = req.body

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId)

        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        )

        if (isReviewed) {
            product.reviews.forEach((review) => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment
                    review.rating = rating
                }
            })
        } else {
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }

        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length

        await product.save({ validateBeforeSave: false })

        res.status(200).json({
            success: true,
        })
    })
    // Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    )

    const numOfReviews = reviews.length

    const ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(
        req.query.productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    )

    res.status(200).json({
        success: true,
    })
})