import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Bookings from Flask
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/bookings');
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      } else {
        toast.error("Database connection failed");
      }
    } catch (err) {
      toast.error("Check if Flask Server is running");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Handle Approval Logic
  const handleStatusUpdate = async (id, currentStatus) => {
    if (currentStatus === 'approved') return; // Already approved

    const load = toast.loading("Updating status...");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/admin/update-booking/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (res.ok) {
        toast.success("Event Approved! Client notified.", { id: load });
        fetchBookings(); // Refresh the list
      } else {
        toast.error("Failed to update status", { id: load });
      }
    } catch (err) {
      toast.error("Server connection error", { id: load });
    }
  };

  return (
    <div style={adminStyles.container}>
      <Toaster />
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '100px'}}>
           <div className="loader"></div>
           <p style={{color: '#888', marginTop: '15px'}}>Scanning for new events...</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={adminStyles.table}>
            <thead>
              <tr style={adminStyles.thead}>
                <th style={adminStyles.th}>CLIENT & PHONE</th>
                <th style={adminStyles.th}>SERVICE</th>
                <th style={adminStyles.th}>DATE</th>
                <th style={adminStyles.th}>REGION/COUNTY</th>
                <th style={adminStyles.th}>GUESTS</th>
                <th style={adminStyles.th}>TOTAL (KES)</th>
                <th style={adminStyles.th}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={adminStyles.tr}>
                  <td style={adminStyles.td}>
                    <div style={{fontWeight: '800'}}>{b.username}</div>
                    <div style={{fontSize: '0.75rem', color: '#e31837'}}>{b.phone || 'No Phone'}</div>
                    <div style={{fontSize: '0.7rem', color: '#999'}}>{b.userid}</div>
                  </td>
                  <td style={{...adminStyles.td, textTransform: 'capitalize'}}>{b.servicetype}</td>
                  <td style={adminStyles.td}>{b.eventdate}</td>
                  <td style={adminStyles.td}>
                    <span style={{fontSize: '0.8rem', color: '#555'}}>{b.location}</span>
                  </td>
                  <td style={adminStyles.td}>{b.people} Pax</td>
                  <td style={{...adminStyles.td, fontWeight: '700'}}>
                    {b.totalprice?.toLocaleString()}
                  </td>
                  <td style={adminStyles.td}>
                    {b.status === 'pending' ? (
                      <button 
                        onClick={() => handleStatusUpdate(b.id, b.status)}
                        style={adminStyles.approveBtn}
                      >
                        APPROVE
                      </button>
                    ) : (
                      <div style={adminStyles.approvedBadge}>
                        ✓ APPROVED
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {bookings.length === 0 && (
            <div style={{padding: '50px', textAlign: 'center', color: '#999'}}>
              No active bookings found.
            </div>
          )}
        </div>
      )}

      <style>{`
        .loader { border: 3px solid #f3f3f3; border-top: 3px solid #e31837; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const adminStyles = {
  container: { backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { textAlign: 'left', borderBottom: '2px solid #f5f5f5' },
  th: { padding: '15px', fontSize: '0.75rem', fontWeight: '900', color: '#333' },
  tr: { borderBottom: '1px solid #f9f9f9', transition: '0.2s' },
  td: { padding: '15px', fontSize: '0.85rem' },
  approveBtn: { 
    backgroundColor: '#1a1a1a', color: 'white', border: 'none', 
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', 
    fontWeight: 'bold', fontSize: '0.75rem', transition: '0.3s' 
  },
  approvedBadge: { 
    color: '#28a745', fontWeight: '900', fontSize: '0.75rem', 
    letterSpacing: '1px', border: '1px solid #28a745', 
    padding: '5px 10px', borderRadius: '5px', textAlign: 'center' 
  }
};

export default AdminBookings;