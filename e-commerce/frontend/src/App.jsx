import React, { useEffect } from 'react';
import { AppProvider } from './context/AppProvider';
import Home from './components/Home';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Product from './components/Product';
import UpdateProduct from './components/UpdateProduct';
import Signup from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add_product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/product/update/:id' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
