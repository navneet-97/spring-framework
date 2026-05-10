import React, { useEffect } from 'react'
import { AppProvider } from './context/AppProvider'
import Home from './components/Home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import AddProduct from './components/AddProduct'
import Cart from './components/Cart'
import Product from './components/Product'
import UpdateProduct from './components/UpdateProduct'

const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add_product' element={<AddProduct />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/product/update/:id' element={<UpdateProduct />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
