import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// Updated Import: Looking in the same directory (.)
import AdminBookings from './AdminBookings'; 

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('meals');
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Form States
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [newMeal, setNewMeal] = useState({ name: '', price: '', category: 'Food', image: '' });

  const categories = ["Food", "Burgers", "Vegetables", "Drinks"];
  const assetPhotos = ['burger_classic.jpg', 'coke.png', 'greens.jpg', 'pilau.jpg', 'ugali.jpg'];

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using 127.0.0.1 to match our backend binding
        const response = await fetch(`http://127.0.0.1:5000/api/admin/${activeTab}`);
        const data = await response.json();
        
        if (activeTab === 'orders') setOrders(data);
        if (activeTab === 'messages') setMessages(data);
      } catch (err) { 
        console.log("Backend connection pending..."); 
      }
    };

    // Skip fetching if it's meals/security (static) or bookings (handled in AdminBookings.jsx)
    if (!['meals', 'security', 'bookings'].includes(activeTab)) {
      fetchData();
    }
  }, [activeTab]);

  const handleLogout = () => {
    toast.success("Safe travels, Admin!");
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-right" />
      
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <h2 style={styles.logoText}>OKOTH'S</h2>
          <span style={styles.logoSub}>MANAGEMENT</span>
        </div>
        
        <nav style={styles.nav}>
          <button style={activeTab === 'meals' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('meals')}>🍲 MENU ITEMS</button>
          <button style={activeTab === 'bookings' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('bookings')}>📅 BOOKINGS</button>
          <button style={activeTab === 'orders' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('orders')}>🛒 ORDERS</button>
          <button style={activeTab === 'messages' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('messages')}>✉️ MESSAGES</button>
          <button style={activeTab === 'security' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('security')}>🔒 SECURITY</button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>LOGOUT</button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        
        {/* TAB 1: BOOKINGS (Rendered from separate file) */}
        {activeTab === 'bookings' && (
          <div className="fade-in">
            <header style={styles.header}>
              <h1 style={{fontSize: '2rem', fontWeight: '800'}}>Client <span style={{color: '#e31837'}}>Bookings</span></h1>
            </header>
            <AdminBookings />
          </div>
        )}

        {/* TAB 2: MEALS */}
        {activeTab === 'meals' && (
          <div className="fade-in">
            <header style={styles.header}><h1>Menu Management</h1></header>
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>Add New Dish</h3>
                <input style={styles.input} placeholder="Name" onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} />
                <input style={styles.input} placeholder="Price" type="number" onChange={(e) => setNewMeal({...newMeal, price: e.target.value})} />
                <select style={styles.input} onChange={(e) => setNewMeal({...newMeal, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button style={styles.saveBtn}>PUBLISH MEAL</button>
              </div>
              <div style={styles.card}>
                <h3>Select Image</h3>
                <div style={styles.photoGrid}>
                  {assetPhotos.map(p => (
                    <div key={p} style={{...styles.photoItem, border: newMeal.image === p ? '3px solid #e31837' : '1px solid #eee'}} onClick={() => setNewMeal({...newMeal, image: p})}>
                      <span style={{fontSize: '0.6rem'}}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            <header style={styles.header}><h1>Recent Orders</h1></header>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={{padding: '15px'}}>User</th>
                    <th style={{padding: '15px'}}>Item</th>
                    <th style={{padding: '15px'}}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={i} style={styles.tableRow}>
                      <td style={{padding: '15px'}}>{order.username}</td>
                      <td style={{padding: '15px'}}>{order.itemName}</td>
                      <td style={{padding: '15px'}}>{new Date(order.timestamp * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeTab === 'security' && (
          <div style={{maxWidth: '500px'}} className="fade-in">
            <header style={styles.header}><h1>System Security</h1></header>
            <div style={styles.card}>
                <label style={styles.label}>Update Master Password</label>
                <input style={styles.input} type="password" placeholder="New Password" />
                <button style={{...styles.saveBtn, backgroundColor: '#e31837'}}>Update Password</button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f0f2f5', overflow: 'hidden', fontFamily: "'Inter', sans-serif" },
  sidebar: { width: '260px', backgroundColor: '#111', display: 'flex', flexDirection: 'column', padding: '30px 20px' },
  logoArea: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' },
  logoText: { color: '#e31837', margin: 0, fontSize: '1.6rem', fontWeight: '900' },
  logoSub: { color: '#555', fontSize: '0.7rem', fontWeight: 'bold' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: { padding: '14px', textAlign: 'left', background: 'none', border: 'none', color: '#777', cursor: 'pointer', borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem', transition: '0.2s' },
  activeNav: { padding: '14px', textAlign: 'left', background: '#e31837', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem' },
  logoutBtn: { padding: '14px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { marginBottom: '30px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '20px', overflow: 'hidden' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', outline: 'none' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' },
  photoItem: { height: '80px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeader: { borderBottom: '2px solid #f0f2f5', color: '#111', fontWeight: '800' },
  tableRow: { borderBottom: '1px solid #f0f2f5', fontSize: '0.9rem' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', display: 'block' }
};

export default HomeAdmin;