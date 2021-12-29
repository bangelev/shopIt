import axios from 'axios'
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    CLEAR_ERROR,
} from '../constants/productsConstants'

export const getProducts =
    (currentPage = 1, keyword = '', price, category, rating = 0) =>
    async(dispatch) => {
        try {
            dispatch({
                type: ALL_PRODUCTS_REQUEST,
            })
            let link = `/api/v1/products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`
            if (category) {
                link = `/api/v1/products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${rating}`
            }
            const { data } = await axios.get(link)

            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: data,
            })
        } catch (error) {
            dispatch({
                type: ALL_PRODUCTS_FAIL,
                payload: error.response.data.message,
            })
        }
    }

export const getProductDetails = (id) => async(dispatch) => {
    try {
        dispatch({
            type: PRODUCT_DETAILS_REQUEST,
        })

        const { data } = await axios.get(`/api/v1/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
}

// new product => /api/v1/admin/products/new
export const newProduct = (productData) => async(dispatch) => {
    try {
        dispatch({
            type: NEW_PRODUCT_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post(
            `/api/v1/admin/products/new`,
            productData,
            config
        )

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// update product => api/v1/admin/products/":id"
export const updateProduct = (id, productData) => async(dispatch) => {
    try {
        dispatch({
            type: UPDATE_PRODUCT_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(
            `/api/v1/admin/products/${id}`,
            productData,
            config
        )

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Reviews
export const newReview = (reviewData) => async(dispatch) => {
    try {
        dispatch({
            type: NEW_REVIEW_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(`/api/v1/review`, reviewData, config)

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message,
        })
    }
}

// admin products api/v1/admin/products

export const getAdminProducts = () => async(dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST })

        const { data } = await axios.get('/api/v1/admin/products')

        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products,
        })
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response.data.message,
        })
    }
}

// Delete  by admin => api/admin/products/:id
export const deleteProduct = (id) => async(dispatch) => {
    try {
        dispatch({
            type: DELETE_PRODUCT_REQUEST,
        })

        const { data } = await axios.delete(`/api/v1/admin/products/${id}`)

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}

// clear error
export const clearError = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERROR,
    })
}