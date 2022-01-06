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
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAILURE,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAILURE,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAILURE,
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

// ADMIN REDUCERS

// All order by admin
export const allOrderReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ALL_ORDERS_REQUEST:
            return {
                loading: true,
            }
        case ALL_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                totalAmount: action.payload.totalAmount,
            }
        case ALL_ORDERS_FAILURE:
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

// process -update order by admin
export const orderReducers = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
            }
        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload,
            }
        case UPDATE_ORDER_RESET:
            return {
                ...state,
                loading: false,
                isUpdated: false,
            }
        case DELETE_ORDER_RESET:
            return {
                ...state,
                loading: false,
                isDeleted: false,
            }
        case UPDATE_ORDER_FAILURE:
        case DELETE_ORDER_FAILURE:
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