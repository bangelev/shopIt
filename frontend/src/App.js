import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

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
// Admin component
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews'

import { loadUser } from './redux/actions/userActions'
import store from './store'

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth)
  const [stripeApiKey, setStripeApiKey] = useState('')
  useEffect(() => {
    store.dispatch(loadUser())
    // if (error) {
    //   console.log(error)
    // }

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
          <ProtectedRoute path="/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          )}
          {/*Order component*/}
          <ProtectedRoute path="/orders/me" component={OrderList} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} />
        </div>
        {/*admin routes*/}
        <ProtectedRoute
          path="/dashboard"
          isAdmin={true}
          component={Dashboard}
        />
        <ProtectedRoute
          path="/admin/products"
          isAdmin={true}
          component={ProductsList}
        />
        <ProtectedRoute
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
        <ProtectedRoute
          path="/admin/product"
          exact
          isAdmin={true}
          component={NewProduct}
        />
        <ProtectedRoute
          path="/admin/order/:id"
          exact
          isAdmin={true}
          component={ProcessOrder}
        />
        <ProtectedRoute
          path="/admin/orders"
          exact
          isAdmin={true}
          component={OrdersList}
        />
        <ProtectedRoute
          path="/admin/users/:id"
          exact
          isAdmin={true}
          component={UpdateUser}
        />
        <ProtectedRoute
          path="/admin/users"
          exact
          isAdmin={true}
          component={UsersList}
        />
        <ProtectedRoute
          path="/admin/reviews"
          exact
          isAdmin={true}
          component={ProductReviews}
        />

        {/* <Footer /> */}
        {/* {!loading && <Footer />} */}
        {!loading && (!isAuthenticated || user.role !== 'admin') && <Footer />}
      </div>
    </Router>
  )
}

export default App
