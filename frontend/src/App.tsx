import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Products from './Pages/Products';
import Admin from './Pages/Admin';
import Cart from './Pages/Cart';
import Orders from './Pages/Orders';
import ProductDetail from './Pages/ProductDetail';
import { supabase } from './Config/supabase';
import { useAuthStore } from './Store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'font-heading font-medium text-textMain bg-surface border border-border shadow-md rounded-xl',
          duration: 4000,
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
        }} 
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin_pratik" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
