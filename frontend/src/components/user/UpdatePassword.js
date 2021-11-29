import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router-dom'

import MetaData from '../layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { updatePassword, clearError } from '../../redux/actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../redux/constants/usersConstants'

const UpdatePassword = () => {
  //component state
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')

  const alert = useAlert()
  const history = useHistory()
  const dispatch = useDispatch()

  const { isUpdated, error, loading } = useSelector((state) => state.user)

  // Use Effect HOOK
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }

    if (isUpdated) {
      alert.success('Password updated successfully')

      history.push('/me')

      dispatch({ type: UPDATE_PASSWORD_RESET })
    }
  }, [dispatch, alert, error, loading, isUpdated, history])

  //handlers
  const submitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData() // plain  js - MDN
    formData.set('oldPassword', oldPassword)
    formData.set('password', password)

    console.log(formData)
    dispatch(updatePassword(formData))
  }

  return (
    <Fragment>
      <MetaData title="Change Password" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={loading ? true : false}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default UpdatePassword
