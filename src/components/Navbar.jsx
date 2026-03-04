import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Import icons
import './Navbar.css';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check for logged-in user on load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <nav className="navbar-container">
      {/* Layer 1: Top Bar */}
      <div className="top-bar">
        <div className="brand-name">OKOTH'S DELICACIES</div>
        <div className="contact-info">
          <span>📧 okoth'sdelicacies@gmail.com</span>
          <span>📞 +254 11624386</span>
          <span>📍 Nyeri, KENYA</span>
        </div>
      </div>

      {/* Layer 2: Main Menu */}
      <div className="menu-bar">
        <div className="nav-spacer"></div>

        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link>
          </li>
          
          <li className="nav-item">
            MENU ▾
            <div className="dropdown-menu">
              <ul>
                <li>Hot Pizzas</li>
                <li>Gourmet Burgers</li>
                <li>Vegan Options</li>
                <li>Drinks & Desserts</li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            OFFERS
            <div className="dropdown-menu">
              <ul>
                <li>First Order: 20% OFF</li>
                <li>Family Bundles</li>
              </ul>
            </div>
          </li>

          <li className="nav-item"> 
            <Link to="/book" style={{ textDecoration: 'none', color: 'inherit' }}>SERVICES</Link>
          </li>

          <li className="nav-item">
            <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>ABOUT</Link>
          </li>

          {/* LINK TO CLIENT BOOKINGS / CART */}
          <li className="nav-item cart-link" onClick={() => navigate('/my-bookings')}>
            <FaShoppingCart className="nav-icon" />
            <span className="cart-label">CART</span>
          </li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <div className="user-profile-nav">
              <FaUserCircle className="user-icon" />
              <span className="user-name-text">{user.username}</span>
              <button className="logout-nav-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;