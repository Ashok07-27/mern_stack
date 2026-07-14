import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, qty, type) => {
    setCart((prevCart) => {
      // Find if item of same ID and type already in cart
      const existItem = prevCart.find((x) => x.book._id === book._id && x.type === type);

      if (existItem) {
        return prevCart.map((x) =>
          x.book._id === book._id && x.type === type ? { ...x, qty: Math.min(book.stock, x.qty + qty) } : x
        );
      } else {
        return [...prevCart, { book, qty, type }];
      }
    });
  };

  const updateQty = (bookId, type, qty) => {
    setCart((prevCart) =>
      prevCart.map((x) => (x.book._id === bookId && x.type === type ? { ...x, qty } : x))
    );
  };

  const removeFromCart = (bookId, type) => {
    setCart((prevCart) => prevCart.filter((x) => !(x.book._id === bookId && x.type === type)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar cartCount={cartCount} />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books/:id" element={<BookDetail addToCart={addToCart} />} />
              <Route path="/cart" element={
                <Cart 
                  cart={cart} 
                  updateQty={updateQty} 
                  removeFromCart={removeFromCart} 
                  clearCart={clearCart} 
                />
              } />
              <Route path="/auth" element={<Auth />} />
              
              {/* Dashboard for standard customer */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Admin dashboard */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              } />

            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
