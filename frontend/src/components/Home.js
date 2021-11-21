import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../redux/actions/productsActions'
import MetaData from './layout/MetaData'
import Product from './product/Product'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert'

const Home = () => {
  const alert = useAlert()
  const dispatch = useDispatch()

  const { loading, error, products, productCount } = useSelector(
    (state) => state.products
  )

  useEffect(() => {
    // alert.success('BRAVO')
    if (error) {
      return alert.error(error)
    }

    dispatch(getProducts())
  }, [dispatch, alert, error])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={'Buy best products online'} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Home
