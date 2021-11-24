import React, { Fragment, useEffect, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../redux/actions/productsActions'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'

import MetaData from './layout/MetaData'
import Product from './product/Product'
import Loader from './layout/Loader'

const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([1, 1000])
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const alert = useAlert()
  const dispatch = useDispatch()

  const { loading, error, products, productCount, resPerPage } = useSelector(
    (state) => state.products
  )
  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home',
  ]

  const keyword = match.params.keyword
  useEffect(() => {
    if (error) {
      return alert.error(error)
    }

    dispatch(getProducts(currentPage, keyword, price, category, rating))
  }, [dispatch, alert, error, currentPage, keyword, price, category, rating])

  const setCurrentPageNum = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$1000`,
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4>Categories</h4>
                        <ul className="pl-0">
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: 'pointer',
                                listStyleType: 'none',
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <h4>Ratings</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <li
                              key={star}
                              style={{
                                cursor: 'pointer',
                                listStyleType: 'none',
                              }}
                              onClick={() => setRating(star)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{
                                    width: `${star * 20}%`,
                                  }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>
          <div className="d-flex justify-content-center mt-5">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resPerPage}
              totalItemsCount={productCount}
              onChange={setCurrentPageNum}
              itemClass="page-item"
              linkClass="page-link"
              prevPageText={'Prev'}
              nextPageText={'Next'}
              firstPageText={'First'}
              lastPageText={'Last'}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Home
