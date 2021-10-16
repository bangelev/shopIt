const express = require('express')
const router = express.Router()

const {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/ordersController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/orders/new').post(isAuthenticatedUser, newOrder)
router.route('/orders/me').get(isAuthenticatedUser, myOrders)
router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder)
    //admin
router
    .route('/admin/orders')
    .get(isAuthenticatedUser, authorizeRoles('admin'), allOrders)
router
    .route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

module.exports = router