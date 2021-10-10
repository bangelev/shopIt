const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/APIfeatures')

// Create New Product => /api/v1/products/new
exports.newProduct = catchAsyncErrors(async(req, res, next) => {
    req.body.user = req.user._id

    const product = await Product.create(req.body)

    res.status(201).json({
        succsess: true,
        message: 'Product created successfully',
        product,
    })
})

// get ALL products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async(req, res, next) => {
    // rezultati po strana
    const resPerPage = Number(req.query.limit) || 4
        // Ovaj del e potreben za backend -ot
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

// update a single Product => /api/v1/products/:id
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
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

// delete product  => api/v1/admin/products/:id

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    await product.deleteOne()
    res.status(200).json({
        success: true,
        message: 'Product deleted',
    })
})