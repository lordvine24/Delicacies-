import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Replacing standard alerts
import { FaCheck, FaUtensils, FaSyncAlt, FaUser, FaClock } from 'react-icons/fa';

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://127.0.0.1:5000';

  // --- 1. FETCH ORDERS & FILTER BY STATUS ---
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings`);
      const data = await res.json();
      
      // We only want orders that are NOT served yet
      const pendingOrders = data.filter(order => order.status !== 'served');
      setOrders(pendingOrders);
    } catch (err) {
      console.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  // --- 2. UPDATE STATUS (SERVED) ---
  const handleMarkServed = async (orderId) => {
    const confirm = await Swal.fire({
      title: 'Is it ready?',
      text: "Marking as served will move this to history.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Served!'
    });

    if (confirm.isConfirmed) {
      try {
        // Change from DELETE to POST to update the status in Firestore
        const res = await fetch(`${API_BASE}/api/admin/update-booking/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'served' })
        });

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Order Served!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });
          // Instantly remove from UI without full refresh
          setOrders(orders.filter(order => order.id !== orderId));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update order', 'error');
      }
    }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.titleGroup}>
          <FaUtensils size={24} color="#e31837" />
          <h2 style={s.title}>Live Kitchen Orders</h2>
          <span style={s.badge}>{orders.length} Pending</span>
        </div>
        <button onClick={fetchOrders} style={s.refreshBtn}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={s.loading}>Checking kitchen...</div>
      ) : (
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Time</th>
                <th style={s.th}>Customer</th>
                <th style={s.th}>Item Ordered</th>
                <th style={s.th}>Qty</th>
                <th style={s.th}>Delivery/Table</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <FaClock color="#888" size={12}/>
                        {new Date(order.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={{fontWeight: 'bold'}}><FaUser size={12} style={{marginRight: '5px'}}/> {order.username}</div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>{order.phone}</div>
                  </td>
                  <td style={s.td}><span style={s.foodTag}>{order.itemName}</span></td>
                  <td style={s.td}><strong>x{order.quantity || 1}</strong></td>
                  <td style={s.td}>{order.address}</td>
                  <td style={s.td}>
                    <button 
                      onClick={() => handleMarkServed(order.id)} 
                      style={s.serveBtn}
                    >
                      <FaCheck /> SERVED
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div style={s.emptyState}>
              <p>Kitchen is clear! No active orders. 👨‍🍳</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- STYLES (Slightly improved for clarity) ---
const s = {
  container: { background: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  titleGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  title: { margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#111' },
  badge: { background: '#e31837', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', cursor: 'pointer', fontWeight: '700' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { borderBottom: '2px solid #f5f5f5' },
  th: { padding: '15px', color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '800' },
  tr: { borderBottom: '1px solid #f9f9f9', transition: '0.2s' },
  td: { padding: '20px 15px', fontSize: '0.95rem', color: '#333' },
  foodTag: { background: '#111', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' },
  serveBtn: { background: '#28a745', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', padding: '80px 0', color: '#ccc', fontSize: '1.2rem' },
  loading: { textAlign: 'center', padding: '50px', color: '#e31837', fontWeight: 'bold' }
};

export default AdminOrdersList;