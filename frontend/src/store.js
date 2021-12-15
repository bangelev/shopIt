import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    productsReducer,
    productDetailReducer,
} from './redux/reducers/productReducers'

import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
} from './redux/reducers/userReducers'
import { cartReducer } from './redux/reducers/cartReducers'
import { newOrderReducer } from './redux/reducers/orderReducers'

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
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