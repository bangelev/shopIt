import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearError } from '../../redux/actions/orderActions'

const OrderList = () => {
  const alert = useAlert()
  const dispatch = useDispatch()

  const { loading, error, orders } = useSelector((state) => state.myOrders)

  useEffect(() => {
    dispatch(myOrders())
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
  }, [dispatch, alert, error])

  const setOrders = () => {
    const data = {
      // columns Array of objects
      columns: [
        {
          label: 'Order Id',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Number Of Items',
          field: 'numOfItems',
          sort: 'asc',
        },
        {
          label: 'Amount',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: 'Status',
          field: 'status',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    }
    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes('Delivered') ? (
            <p style={{ color: 'green' }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: 'red' }}>{order.orderStatus}</p>
          ),
        actions: (
          <Link to={`/orders/${order._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
        ),
      })
    })
    return data
  }
  return (
    <Fragment>
      <MetaData title={'My orders'} />
      <h1 className="my-5">My orders</h1>
      {loading ? (
        <Loader />
      ) : (
        <MDBDataTable
          data={setOrders()}
          className="mx-3"
          bordered
          striped
          hover
        />
      )}
    </Fragment>
  )
}

export default OrderList
