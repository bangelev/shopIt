import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAILURE,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAILURE,
    CLEAR_ERROR,
} from '../constants/orderConstants'

export const newOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            }
        case CREATE_ORDER_FAILURE:
            return {
                loading: false,
                error: action.payload,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }
        default:
            return state
    }
}

//My orders => api/v1/orders/me
export const myOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_ORDERS_REQUEST:
            return {
                loading: true,
            }
        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            }
        case MY_ORDERS_FAILURE:
            return {
                loading: false,
                error: action.payload,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }
        default:
            return state
    }
}

//orders details => api/v1/orders/:id
export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
            }
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            }
        case ORDER_DETAILS_FAILURE:
            return {
                loading: false,
                error: action.payload,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }
        default:
            return state
    }
}