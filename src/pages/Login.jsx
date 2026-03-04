import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  // modes: 'login', 'forgot', 'admin'
  const [mode, setMode] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', master: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 1. CUSTOMER LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Verifying account...');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Welcome back, ${data.user.username}!`, { id: loadingToast });
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error(data.error || "Login failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Server connection failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ADMIN MASTER LOGIN HANDLER ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Checking Master Access...');
    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.master }),
      });
      if (response.ok) {
        toast.success("Master Access Granted", { id: loadingToast });
        // Redirecting to your specific admin file path
        setTimeout(() => navigate('/admin/home'), 1500);
      } else {
        toast.error("Invalid Master Password", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Server connection failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div style={styles.card}>
        {/* LEFT SIDEBAR - Content changes based on Mode */}
        <div style={styles.leftSidebar}>
          <div style={styles.circle1}></div>
          <div style={styles.circle2}></div>
          <div style={styles.contentLeft}>
            <h2 style={styles.welcomeText}>
              {mode === 'admin' ? "SYSTEM CONTROL" : mode === 'forgot' ? "NO WORRIES" : "WELCOME BACK"}
            </h2>
            <h4 style={styles.headline}>OKOTH'S DELICACIES</h4>
            <p style={styles.subText}>
              {mode === 'admin' 
                ? "Enter the secure master password to manage system events and administrative settings."
                : "Ready for something delicious? Log in to access your orders and exclusive member discounts."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM AREA */}
        <div style={styles.rightSide}>
          
          {/* CASE 1: REGULAR LOGIN */}
          {mode === 'login' && (
            <div style={{ width: '100%' }}>
              <h2 style={styles.formTitle}>Sign in</h2>
              <p style={styles.formDesc}>Enter your details to access your account</p>
              <form style={styles.form} onSubmit={handleLogin}>
                <div style={styles.inputGroup}>
                  <span style={styles.icon}>✉️</span>
                  <input type="email" name="email" placeholder="Email Address" style={styles.input} onChange={handleChange} required />
                </div>
                <div style={styles.inputGroup}>
                  <span style={styles.icon}>🔒</span>
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" style={styles.input} onChange={handleChange} required />
                  <span style={styles.showBtn} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </span>
                </div>
                <div style={styles.options}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" style={{ marginRight: '8px' }} /> Remember me</label>
                  <span style={styles.forgotPass} onClick={() => setMode('forgot')}>Forgot Password?</span>
                </div>
                <button type="submit" style={styles.mainBtn} disabled={loading}>
                  {loading ? <span className="spinner"></span> : "Sign in"}
                </button>
              </form>
              <p style={styles.footerText}>Don't have an account? <span style={styles.link} onClick={() => navigate('/signup')}>Sign up</span></p>
              <p style={styles.adminLink} onClick={() => setMode('admin')}>Admin Portal Access</p>
            </div>
          )}

          {/* CASE 2: ADMIN MASTER FORM */}
          {mode === 'admin' && (
            <div style={{ width: '100%' }}>
              <h2 style={styles.formTitle}>Admin Login</h2>
              <p style={styles.formDesc}>Strictly for system administrators</p>
              <form style={styles.form} onSubmit={handleAdminLogin}>
                <div style={styles.inputGroup}>
                  <span style={styles.icon}>🔑</span>
                  <input type={showPassword ? "text" : "password"} name="master" placeholder="Master Password" style={styles.input} onChange={handleChange} required />
                  <span style={styles.showBtn} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "HIDE" : "SHOW"}</span>
                </div>
                <button type="submit" style={styles.mainBtn} disabled={loading}>
                  {loading ? <span className="spinner"></span> : "Verify Master Access"}
                </button>
                <button type="button" style={styles.secondaryBtn} onClick={() => setMode('login')}>Back to User Login</button>
              </form>
            </div>
          )}

          {/* CASE 3: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div style={{ width: '100%' }}>
              <h2 style={styles.formTitle}>Reset Password</h2>
              <p style={styles.formDesc}>Enter email to receive reset instructions</p>
              <form style={styles.form}>
                <div style={styles.inputGroup}>
                  <span style={styles.icon}>✉️</span>
                  <input type="email" placeholder="Registered Email" style={styles.input} required />
                </div>
                <button type="button" style={styles.mainBtn}>Send Reset Link</button>
                <button type="button" style={styles.secondaryBtn} onClick={() => setMode('login')}>Back to Login</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', width: '100vw', backgroundColor: '#e31837', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" },
  card: { width: '900px', minHeight: '550px', backgroundColor: '#fff', borderRadius: '30px', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
  leftSidebar: { flex: 1, backgroundColor: '#1a1a1a', position: 'relative', display: 'flex', alignItems: 'center', padding: '60px', color: 'white', overflow: 'hidden' },
  circle1: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: '#e31837', top: '-50px', left: '-100px', opacity: 0.6 },
  circle2: { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#333', bottom: '40px', right: '-50px', zIndex: 1 },
  contentLeft: { position: 'relative', zIndex: 2 },
  welcomeText: { fontSize: '2.4rem', fontWeight: '900', margin: 0, lineHeight: '1.1' },
  headline: { fontSize: '1.1rem', fontWeight: '400', margin: '10px 0 25px 0', opacity: 0.8 },
  subText: { fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.7 },
  rightSide: { flex: 1.2, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  formTitle: { fontSize: '2.5rem', fontWeight: '800', margin: '0 0 5px 0', color: '#1a1a1a' },
  formDesc: { fontSize: '0.9rem', color: '#777', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' },
  inputGroup: { display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '12px', padding: '12px 20px', position: 'relative' },
  icon: { marginRight: '15px', opacity: 0.5 },
  input: { border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' },
  showBtn: { fontSize: '0.75rem', fontWeight: '800', color: '#e31837', cursor: 'pointer' },
  options: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', margin: '5px 0', width: '100%' },
  forgotPass: { color: '#e31837', cursor: 'pointer', fontWeight: '600' },
  mainBtn: { backgroundColor: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' },
  secondaryBtn: { backgroundColor: 'white', color: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontWeight: '700', cursor: 'pointer' },
  footerText: { textAlign: 'center', fontSize: '0.85rem', color: '#777', marginTop: '20px' },
  link: { color: '#e31837', fontWeight: '800', cursor: 'pointer' },
  adminLink: { marginTop: '15px', fontSize: '0.7rem', color: '#bbb', cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default Login;