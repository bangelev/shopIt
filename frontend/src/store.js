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

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
})

let initialState = {}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store