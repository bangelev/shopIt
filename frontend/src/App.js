import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'

import './App.css'
import { useEffect, useState } from 'react'
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
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
//stripe components
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Home from './components/Home'

//order components
import OrderList from './components/order/OrderList'
import OrderDetails from './components/order/OrderDetails'

import { loadUser } from './redux/actions/userActions'
import store from './store'

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('')
  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
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
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          )}
          {/*Order component*/}
          <ProtectedRoute path="/orders/me" component={OrderList} />
          <ProtectedRoute path="/orders/:id" component={OrderDetails} />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
