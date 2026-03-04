import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Components
import Navbar from "./components/Navbar";

// Public & Client Pages
import Home from "./pages/Home"; 
import About from "./pages/About"; 
import Book from "./pages/Book"; 
import Signup from "./pages/Signup"; 
import Login from "./pages/Login"; 
import MyBookings from "./pages/mybookings"; 

// Admin Pages (Ensure these paths match your folder structure)
import HomeAdmin from "./pages/admin/homeadmin";

import "./index.css";

// Helper: Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// This component handles the conditional visibility of Global UI
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Logic: Hide Navbar/Footer if the URL starts with /admin
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      
      {/* Show Navbar only for regular users */}
      {!isAdminPage && <Navbar />}

      <main className="content" style={{ flex: '1', marginTop: !isAdminPage ? '110px' : '0' }}>
        {/* Note: Margin-top 110px accounts for your fixed double-layer navbar height */}
        {children}
      </main>

      {/* Show Footer only for regular users */}
      {!isAdminPage && (
        <footer style={{ backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center', padding: '30px 0', borderTop: '4px solid #e31837' }}>
          <p style={{ fontWeight: 'bold', letterSpacing: '1px' }}>© 2026 OKOTH'S DELICACIES</p>
          <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>Quality Catering & Gourmet Meals</p>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/login" element={<Login />} /> 
          
          {/* --- CLIENT SECURE ROUTES --- */}
          <Route path="/book" element={<Book />} /> 
          {/* This is linked to the "CART" icon in your Navbar */}
          <Route path="/my-bookings" element={<MyBookings />} /> 
          
          {/* --- ADMIN DASHBOARD --- */}
          <Route path="/admin/home" element={<HomeAdmin />} /> 
          
          {/* --- GLOBAL REDIRECT --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;