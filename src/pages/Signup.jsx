import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIC ADDED HERE ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Welcome to Okoth's Delicacies.");
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Backend server is not running!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.leftSidebar}>
          <div style={styles.circle1}></div>
          <div style={styles.circle2}></div>
          <div style={styles.contentLeft}>
            <h2 style={styles.welcomeText}>WELCOME</h2>
            <h4 style={styles.headline}>OKOTH'S DELICACIES</h4>
            <p style={styles.subText}>
              Join our community of food lovers. Sign up to track your bookings and explore personalized catering packages.
            </p>
          </div>
        </div>

        <div style={styles.rightSide}>
          <h2 style={styles.formTitle}>Sign up</h2>
          <p style={styles.formDesc}>Create an account to get started</p>

          {/* ADDED onSubmit HERE */}
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <span style={styles.icon}>👤</span>
              <input 
                type="text" 
                name="username" 
                placeholder="User Name" 
                style={styles.input} 
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.icon}>✉️</span>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                style={styles.input} 
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.icon}>📍</span>
              <input 
                type="text" 
                name="location" 
                placeholder="Location (e.g. Nyeri Town)" 
                style={styles.input} 
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.icon}>🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                style={styles.input} 
                onChange={handleChange}
              />
              <span 
                style={styles.showBtn} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </div>

            <div style={styles.options}>
              <label style={styles.remember}>
                <input type="checkbox" style={{ marginRight: '8px' }} /> Remember me
              </label>
            </div>

            {/* CHANGED type="button" to type="submit" */}
            <button type="submit" style={styles.mainBtn}>Sign up</button>

            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>or</span>
              <span style={styles.dividerLine}></span>
            </div>

            <button type="button" style={styles.secondaryBtn}>Sign up with Google</button>

            <p style={styles.footerText}>
              Already have an account? <span style={styles.link} onClick={() => navigate('/login')}>Sign in</span>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

// ... ALL STYLES REMAIN EXACTLY THE SAME ...
const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#e31837', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif"
  },
  card: {
    width: '900px',
    height: '600px',
    backgroundColor: '#fff',
    borderRadius: '30px',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
  },
  leftSidebar: {
    flex: 1,
    backgroundColor: '#1a1a1a', 
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '60px',
    color: 'white',
    overflow: 'hidden'
  },
  circle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: '#e31837',
    top: '-50px',
    left: '-100px',
    opacity: 0.6
  },
  circle2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#333',
    bottom: '40px',
    right: '-50px',
    zIndex: 1
  },
  contentLeft: {
    position: 'relative',
    zIndex: 2
  },
  welcomeText: { fontSize: '3rem', fontWeight: '900', margin: 0, letterSpacing: '2px' },
  headline: { fontSize: '1.2rem', fontWeight: '400', margin: '10px 0 30px 0', opacity: 0.8 },
  subText: { fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.7 },

  rightSide: {
    flex: 1.2,
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formTitle: { fontSize: '2.5rem', fontWeight: '800', margin: '0 0 5px 0', color: '#1a1a1a' },
  formDesc: { fontSize: '0.9rem', color: '#777', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    padding: '12px 20px',
    position: 'relative'
  },
  icon: { marginRight: '15px', opacity: 0.5 },
  input: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
    fontSize: '0.95rem'
  },
  showBtn: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#e31837',
    cursor: 'pointer',
    marginLeft: '10px'
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#555',
    margin: '5px 0'
  },
  mainBtn: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '15px 0'
  },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#eee' },
  dividerText: { padding: '0 15px', color: '#999', fontSize: '0.8rem' },
  secondaryBtn: {
    backgroundColor: 'white',
    color: '#1a1a1a',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontWeight: '700',
    cursor: 'pointer'
  },
  footerText: { textAlign: 'center', fontSize: '0.85rem', color: '#777', marginTop: '20px' },
  link: { color: '#e31837', fontWeight: '800', cursor: 'pointer' }
};

export default Signup;