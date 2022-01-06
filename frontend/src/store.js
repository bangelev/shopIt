import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    productsReducer,
    productDetailReducer,
    newProductReducer,
    productReducer,
    newReviewReducer,
    productReviewReducer,
    reviewReducer,
} from './redux/reducers/productReducers'

import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
    allUsersReducer,
    userDetailsReducer,
} from './redux/reducers/userReducers'
import { cartReducer } from './redux/reducers/cartReducers'
import {
    newOrderReducer,
    myOrdersReducer,
    orderDetailsReducer,
    allOrderReducer,
    orderReducers,
} from './redux/reducers/orderReducers'

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailReducer,
    newProduct: newProductReducer,
    product: productReducer,
    productReviews: productReviewReducer,
    review: reviewReducer,
    auth: authReducer,
    user: userReducer,
    userDetails: userDetailsReducer,
    allUsers: allUsersReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrderReducer,
    order: orderReducers,
    newReview: newReviewReducer,
})

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ?
            JSON.parse(localStorage.getItem('cartItems')) :
            [],
        shippingInfo: localStorage.getItem('shippingInfo') ?
            JSON.parse(localStorage.getItem('shippingInfo')) :
            {},
    },
}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store