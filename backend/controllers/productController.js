const Product = require('../models/product')

// Create New Product => /api/v1/products/new
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body)

  res.status(201).json({
    succsess: true,
    message: 'Product created successfully',
    product,
  })
}

// get ALL products => /api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await Product.find()
  res.status(200).json({
    success: true,
    message: 'This route will show all the products',
    count: products.length,
    products,
  })
}

// get ONE Product => /api/v1/products/:id
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    })
  }
  res.status(200).json({
    success: true,
    message: 'Product was successfully retrieved',
    product,
  })
}
// update a single Product => /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    })
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
}

// delete product  => api/v1/admin/products/:id

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    })
  }
  await product.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Product deleted',
  })
}
