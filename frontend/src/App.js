import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProductDetails from './components/product/ProductDetails'

import Home from './components/Home'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/products/:id" component={ProductDetails} exact />
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
