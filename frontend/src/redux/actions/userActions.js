import axios from 'axios'
import {
    LOGGING_REQUEST,
    LOGGING_SUCCESS,
    LOGGING_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILURE,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAILURE,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAILURE,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
    CLEAR_ERROR,
} from '../constants/usersConstants'

export const login = (email, password) => async(dispatch) => {
    try {
        dispatch({
                type: LOGGING_REQUEST,
            })
            // it is post request so:
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post(
            '/api/v1/login', { email, password },
            config
        )

        dispatch({
            type: LOGGING_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: LOGGING_FAILURE,
            payload: error.response.data.message,
        })
    }
}

// register user
export const register = (userData) => async(dispatch) => {
    try {
        dispatch({
            type: REGISTER_USER_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // Must multipart/form-data because pictures
            },
        }
        const { data } = await axios.post('/api/v1/register', userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}

// loading logged in user
export const loadUser = () => async(dispatch) => {
    try {
        dispatch({
            type: LOAD_USER_REQUEST,
        })

        const { data } = await axios.get('/api/v1/me')

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}

// update profile
export const updateProfile = (userData) => async(dispatch) => {
    try {
        dispatch({
            type: UPDATE_PROFILE_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // Must multipart/form-data because pictures
            },
        }
        const { data } = await axios.put('/api/v1/me/update', userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAILURE,
            payload: error.response.data.message,
        })
    }
}

// update password
export const updatePassword = (passwords) => async(dispatch) => {
        try {
            dispatch({
                type: UPDATE_PASSWORD_REQUEST,
            })
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await axios.put(
                '/api/v1/password/update',
                passwords,
                config
            )

            dispatch({
                type: UPDATE_PASSWORD_SUCCESS,
                payload: data.success,
            })
        } catch (error) {
            dispatch({
                type: UPDATE_PASSWORD_FAILURE,
                payload: error.response.data.message,
            })
        }
    }
    //logout user
export const logout = () => async(dispatch) => {
    try {
        await axios.get('/api/v1/logout')

        dispatch({
            type: LOGOUT_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: LOGOUT_FAILURE,
            payload: error.response.data.message,
        })
    }
}

// forgot password
export const forgotPassword = (email) => async(dispatch) => {
        try {
            dispatch({
                type: FORGOT_PASSWORD_REQUEST,
            })
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await axios.post('/api/v1/password/forgot', email, config)

            dispatch({
                type: FORGOT_PASSWORD_SUCCESS,
                payload: data.message,
            })
        } catch (error) {
            dispatch({
                type: FORGOT_PASSWORD_FAILURE,
                payload: error.response.data.message,
            })
        }
    }
    // Reset  password
export const resetPassword = (token, passwords) => async(dispatch) => {
    try {
        dispatch({
            type: NEW_PASSWORD_REQUEST,
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(
            `/api/v1/password/reset/${token}`,
            passwords,
            config
        )

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAILURE,
            payload: error.response.data.message,
        })
    }
}

//admin actions
export const allUsers = () => async(dispatch) => {
    try {
        dispatch({
            type: ALL_USERS_REQUEST,
        })

        const { data } = await axios.get('/api/v1/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        })
    } catch (error) {
        dispatch({
            type: {
                ALL_USERS_FAILURE,
                payload: error.response.data.message,
            },
        })
    }
}

// USER UPDATE ACTIONS
export const updateUser = (id, userData) => async(dispatch) => {
        try {
            dispatch({
                type: UPDATE_USER_REQUEST,
            })
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.put(
                `/api/v1/admin/users/${id}`,
                userData,
                config
            )

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: data.success,
            })
        } catch (error) {
            dispatch({
                type: {
                    UPDATE_USER_FAILURE,
                    payload: error.response.data.message,
                },
            })
        }
    }
    // USER DETAILS ACTIONS
export const userDetails = (id) => async(dispatch) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
        })

        const { data } = await axios.get(`/api/v1/admin/users/${id}`)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        })
    } catch (error) {
        dispatch({
            type: {
                USER_DETAILS_FAILURE,
                payload: error.response.data.message,
            },
        })
    }
}

//DELETE USER BY ADMIN
export const deleteUser = (id) => async(dispatch) => {
    try {
        dispatch({
            type: DELETE_USER_REQUEST,
        })

        const { data } = await axios.delete(`/api/v1/admin/users/${id}`)

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        dispatch({
            type: {
                DELETE_USER_FAILURE,
                payload: error.response.data.message,
            },
        })
    }
}

// clear error
export const clearError = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERROR,
    })
}