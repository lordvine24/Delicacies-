import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// --- IMPORTS ---
import AdminBookings from './AdminBookings'; 
import AdminOrdersList from './AdminOrdersList'; // New Component for the Orders Table

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings'); 
  
  // Data States for Messages (Bookings and Orders handled by sub-components)
  const [messages, setMessages] = useState([]);
  const API_BASE = 'http://127.0.0.1:5000';

  // --- FETCH MESSAGES ONLY (Bookings/Orders have their own fetchers now) ---
  useEffect(() => {
    if (activeTab === 'messages') {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${API_BASE}/api/admin/messages`);
          const data = await response.json();
          setMessages(data);
        } catch (err) { 
          console.log("Backend connection pending..."); 
        }
      };
      fetchMessages();
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
          <button style={styles.navBtn} onClick={() => navigate('/mealsadmin')}>🍲 MENU ITEMS</button>
          <button style={activeTab === 'bookings' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('bookings')}>📅 BOOKINGS</button>
          <button style={activeTab === 'orders' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('orders')}>🛒 LIVE ORDERS</button>
          <button style={activeTab === 'messages' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('messages')}>✉️ MESSAGES</button>
          <button style={activeTab === 'security' ? styles.activeNav : styles.navBtn} onClick={() => setActiveTab('security')}>🔒 SECURITY</button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>LOGOUT</button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        
        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="fade-in">
            <header style={styles.header}>
              <h1 style={{fontSize: '2rem', fontWeight: '800'}}>Catering <span style={{color: '#e31837'}}>Bookings</span></h1>
            </header>
            <AdminBookings />
          </div>
        )}

        {/* TAB 2: ORDERS (Updated to use AdminOrdersList) */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            <header style={styles.header}>
              <h1 style={{fontSize: '2rem', fontWeight: '800'}}>Kitchen <span style={{color: '#e31837'}}>Orders</span></h1>
              <p style={{color: '#666'}}>Serve and clear orders as they are completed.</p>
            </header>
            <AdminOrdersList />
          </div>
        )}

        {/* TAB 3: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="fade-in">
            <header style={styles.header}><h1>Contact Messages</h1></header>
            <div style={styles.card}>
              {messages.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={{padding: '15px'}}>User</th>
                      <th style={{padding: '15px'}}>Email</th>
                      <th style={{padding: '15px'}}>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg, i) => (
                      <tr key={i} style={styles.tableRow}>
                        <td style={{padding: '15px'}}>{msg.name}</td>
                        <td style={{padding: '15px'}}>{msg.email}</td>
                        <td style={{padding: '15px'}}>{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No messages found.</p>}
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
  input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', outline: 'none' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeader: { borderBottom: '2px solid #f0f2f5', color: '#111', fontWeight: '800' },
  tableRow: { borderBottom: '1px solid #f0f2f5', fontSize: '0.9rem' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', display: 'block' }
};

export default HomeAdmin;