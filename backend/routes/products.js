const express = require('express')
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController')

router.route('/products').get(isAuthenticatedUser, getProducts)

router.route('/products/:id').get(getSingleProduct)

router
    .route('/admin/products/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

router
    .route('/admin/products/new')
    .post(isAuthenticatedUser, authorizeRoles('admin'), newProduct)

module.exports = router