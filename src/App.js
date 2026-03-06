import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar'; // Adjust this path to where your Navbar file is

// --- CLIENT PAGES ---
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Book from './pages/Book';
import FoodMenu from './pages/FoodMenu';

// --- ADMIN PAGES ---
import HomeAdmin from './pages/admin/homeadmin'; 
import MealsAdmin from './pages/admin/mealsadmin'; 

// This helper component handles the logic of when to show the Navbar
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Define paths where the CLIENT Navbar should NOT appear
  const hideNavbarOn = ['/admin/home', '/mealsadmin', '/login', '/signup'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Client Routes - Navbar will show here */}
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/menu" element={<FoodMenu />} />

          {/* Auth Routes - Navbar is hidden here usually */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes - Navbar is hidden here */}
          <Route path="/admin/home" element={<HomeAdmin />} />
          <Route path="/mealsadmin" element={<MealsAdmin />} />

          {/* Catch-all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;