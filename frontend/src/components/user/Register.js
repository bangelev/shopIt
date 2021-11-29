import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router-dom'

import MetaData from '../layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { register, clearError } from '../../redux/actions/userActions'

const Register = () => {
  //component state
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = user
  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(
    '/images/default_avatar.png'
  )

  const alert = useAlert()
  const history = useHistory()
  const dispatch = useDispatch()
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth)

  // Use Effect HOOK
  useEffect(() => {
    // If user is logged in, not to log again
    if (isAuthenticated) {
      history.push('/')
    }

    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
  }, [dispatch, alert, error, loading, isAuthenticated, history])

  //handlers
  const submitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData() // plain  js - MDN
    formData.set('name', name)
    formData.set('email', email)
    formData.set('password', password)
    if (!avatar) {
      console.log('Nema av')
      formData.set(
        'avatar',
        'https://res.cloudinary.com/da1rwm8l6/image/upload/v1638083140/avatar/xrmingyfd5vtyumckmjy.png'
      )
    } else {
      console.log('Ima avatar')
      formData.set('avatar', avatar)
    }

    console.log('SUBMIT THE FORM')
    dispatch(register(formData))
  }

  const onChangeHandler = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader()

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result)
          setAvatarPreview(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
    console.log('ON CHANGE')
  }

  return (
    <Fragment>
      <MetaData title={'Register User'} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            {/*  Important multipart form encType*/}
            <h1 className="mb-3">Register</h1>
            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="images/*"
                    onChange={onChangeHandler}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Register
