import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'

import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layout/Loader'

import {
  getOrderDetails,
  updateOrder,
  clearError,
} from '../../redux/actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../redux/constants/orderConstants'

const ProcessOrder = ({ match }) => {
  const alert = useAlert()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('')

  const { loading, order = {} } = useSelector((state) => state.orderDetails)
  const { error: updateError, isUpdated } = useSelector((state) => state.order)

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order

  const orderId = match.params.id

  const address =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

  const isPaid =
    paymentInfo && paymentInfo.status === 'succeeded' ? true : false

  useEffect(() => {
    dispatch(getOrderDetails(orderId))

    if (updateError) {
      alert.error(updateError)
      dispatch(clearError)
    }
    if (isUpdated) {
      alert.success('Order updated successfully')
      dispatch({ type: UPDATE_ORDER_RESET })
    }
  }, [dispatch, orderId, updateError, alert, isUpdated])

  const updateOrderHandler = (id) => {
    const formData = new FormData()
    formData.set('status', status)
    dispatch(updateOrder(id, formData))
  }
  return (
    <Fragment>
      <MetaData title={`Update order #${orderId}`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            {loading ? (
              <Loader />
            ) : (
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-7 order-details">
                  <h1 className="my-5">Order # {`${order && order._id}`}</h1>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {user && user.name}
                  </p>
                  <p>
                    <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
                  </p>
                  <p className="mb-4">
                    <b>Address:</b>
                    {address}
                  </p>
                  <p>
                    <b>Amount:</b> $ {totalPrice}
                  </p>

                  <hr />

                  <h4 className="my-4">Payment</h4>
                  <p className="greenColor">
                    <p className={isPaid ? 'greenColor' : 'redColor'}>
                      <b>{isPaid ? 'PAID' : 'NOT PAID'}</b>
                    </p>
                  </p>

                  <h4 className="my-4">Stripe ID</h4>
                  <p>
                    <b>{paymentInfo && paymentInfo.id}</b>
                  </p>

                  <h4 className="my-4">Order Status:</h4>
                  <p
                    className={
                      order.orderStatus &&
                      String(order.orderStatus).includes('Delivered')
                        ? 'greenColor'
                        : 'redColor'
                    }
                  >
                    <b>{orderStatus}</b>
                  </p>

                  <h4 className="my-4">Order Items:</h4>
                  {orderItems &&
                    orderItems.map((item) => (
                      <Fragment key={item.product}>
                        <hr />
                        <div className="cart-item my-1">
                          <div className="row my-5">
                            <div className="col-4 col-lg-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                height="45"
                                width="65"
                              />
                            </div>

                            <div className="col-5 col-lg-5">
                              <Link to={`/products/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p>$ {item.price}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <p>{item.quantity} Piece(s)</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    ))}
                </div>

                <div className="col-12 col-lg-3 mt-5">
                  <h4 className="my-4">Status</h4>

                  <div className="form-group">
                    <select
                      className="form-control"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => updateOrderHandler(order._id)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ProcessOrder
