import React, { useState, useEffect, Fragment } from 'react'

import MetaData from '../layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { forgotPassword, clearError } from '../../redux/actions/userActions'

const ForgotPassword = () => {
  //component state
  const [email, setEmail] = useState('')

  const alert = useAlert()
  const dispatch = useDispatch()

  const { message, error, loading } = useSelector(
    (state) => state.forgotPassword
  )

  // Use Effect HOOK
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }

    if (message) {
      alert.success(message)
    }
  }, [dispatch, alert, error, message, loading])

  //handlers
  const submitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData() // plain  js - MDN
    formData.set('email', email)

    console.log(formData)
    dispatch(forgotPassword(formData))
  }
  return (
    <Fragment>
      <MetaData title={'Forgot Password'} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default ForgotPassword
