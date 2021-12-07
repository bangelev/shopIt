import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.css'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
//cart components
import Cart from './components/cart/Cart'

import Home from './components/Home'

import { loadUser } from './redux/actions/userActions'
import store from './store'

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/products/:id" component={ProductDetails} exact />
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          {/*user routes*/}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />
          {/*Cart component*/}
          <Route path="/cart" component={Cart} exact />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
