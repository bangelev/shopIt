import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router-dom'

import MetaData from '../layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { resetPassword, clearError } from '../../redux/actions/userActions'

const NewPassword = ({ match }) => {
  //component state
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const alert = useAlert()
  const dispatch = useDispatch()
  const history = useHistory()

  const { success, error, loading } = useSelector(
    (state) => state.forgotPassword
  )

  // Use Effect HOOK
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }

    if (success) {
      alert.success('Password updated successfully')
      history.push('/login')
    }
  }, [dispatch, alert, error, success, history, loading])

  //handlers
  const submitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData() // plain  js - MDN
    formData.set('password', password)
    formData.set('confirmPassword', confirmPassword)

    console.log(formData)
    dispatch(resetPassword(match.params.token, formData))
  }
  return (
    <Fragment>
      <MetaData title={'Reset Password'} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default NewPassword
