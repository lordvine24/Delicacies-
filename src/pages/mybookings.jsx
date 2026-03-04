import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, 
  FaCreditCard, FaCheckCircle, FaClock, 
  FaTimes, FaMobileAlt, FaInfoCircle
} from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('254'); // Start with 254
  
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchMyBookings = async () => {
    try {
      // Fetching all bookings - then filtering for the logged-in client
      const res = await fetch('http://127.0.0.1:5000/api/admin/bookings');
      const data = await res.json();
      const myData = data.filter(b => b.userid === user?.email.toLowerCase());
      setBookings(myData);
    } catch (err) {
      toast.error("Network error: Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, []);

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    
    // VALIDATION: Must start with 254 and be exactly 12 digits (covers 2547... and 2541...)
    const phoneRegex = /^254\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid Number! Use 2547XXXXXXXX or 2541XXXXXXXX");
      return;
    }

    const exactAmount = Math.round(selectedBooking.totalprice);
    const tId = toast.loading(`Initiating KES ${exactAmount.toLocaleString()}...`);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/payments/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: exactAmount,
          bookingId: selectedBooking.id
        })
      });

      const result = await res.json();
      
      // ResponseCode "0" is Safaricom's signal that the prompt was sent
      if (res.ok && result.ResponseCode === "0") {
        toast.success("STK Push Sent! Check your phone for PIN prompt.", { id: tId });
        setShowModal(false);
      } else {
        toast.error(result.CustomerMessage || "M-Pesa request failed.", { id: tId });
      }
    } catch (err) {
      toast.error("Backend server is unreachable.", { id: tId });
    }
  };

  return (
    <div style={styles.page}>
      <Toaster position="top-right" />
      
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>MY <span style={{color: '#e31837'}}>BOOKINGS</span></h1>
          <p style={styles.subtitle}>Review your catering requests and complete payments.</p>
        </header>

        {loading ? (
          <div style={styles.loaderArea}><div className="spinner"></div></div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <FaInfoCircle size={40} color="#ddd" />
            <p>You haven't made any bookings yet.</p>
            <button onClick={() => window.location.href='/book'} style={styles.bookNowBtn}>BOOK A SERVICE</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {bookings.map((b) => (
              <div key={b.id} style={styles.card}>
                <div style={styles.mainInfo}>
                  <div style={styles.serviceType}>
                    {b.status === 'approved' ? 
                      <FaCheckCircle style={{color: '#28a745'}} /> : 
                      <FaClock style={{color: '#f39c12'}} />
                    }
                    <h3 style={{textTransform: 'capitalize', margin: 0}}>{b.servicetype}</h3>
                  </div>
                  <div style={styles.details}>
                    <div style={styles.detailItem}><FaCalendarAlt /> {b.eventdate}</div>
                    <div style={styles.detailItem}><FaMapMarkerAlt /> {b.location}</div>
                    <div style={styles.detailItem}><FaUsers /> {b.people} Pax</div>
                  </div>
                </div>

                <div style={styles.actionArea}>
                  <div style={styles.priceSection}>
                    <span style={styles.label}>Total Amount</span>
                    <span style={styles.amount}>KES {b.totalprice?.toLocaleString()}</span>
                  </div>

                  {b.status === 'approved' ? (
                    <button style={styles.payBtn} onClick={() => openPaymentModal(b)}>
                      <FaCreditCard /> PAY WITH M-PESA
                    </button>
                  ) : (
                    <div style={styles.pendingBadge}>Pending Approval</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0}}>Lipa na M-PESA</h3>
              <FaTimes style={{cursor: 'pointer'}} onClick={() => setShowModal(false)} />
            </div>
            
            <form onSubmit={handleMpesaPayment} style={styles.form}>
              <div style={styles.modalSummary}>
                <p style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Event: <strong>{selectedBooking?.servicetype}</strong></p>
                <p style={{margin: 0, fontSize: '1.1rem'}}>Total: <strong>KES {selectedBooking?.totalprice?.toLocaleString()}</strong></p>
              </div>

              <label style={styles.inputLabel}>M-Pesa Number (254...)</label>
              <div style={styles.inputWrapper}>
                <FaMobileAlt style={styles.inputIcon} />
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254712345678"
                  style={styles.input}
                  maxLength={12}
                  required
                />
              </div>
              <p style={styles.hint}>Ensure your phone is active and near you to enter your PIN.</p>
              
              <button type="submit" style={styles.confirmBtn}>
                SEND PAYMENT REQUEST
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #e31837; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '120px 0 60px 0' },
  wrapper: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
  header: { marginBottom: '30px', borderLeft: '4px solid #e31837', paddingLeft: '15px' },
  title: { fontSize: '2rem', fontWeight: '900', margin: 0 },
  subtitle: { color: '#777', marginTop: '5px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' },
  mainInfo: { flex: 1 },
  serviceType: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px' },
  details: { display: 'flex', gap: '15px', color: '#666', fontSize: '0.85rem' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  actionArea: { textAlign: 'right', paddingLeft: '20px', borderLeft: '1px solid #f0f0f0' },
  priceSection: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', fontWeight: 'bold' },
  amount: { fontSize: '1.25rem', fontWeight: '900', color: '#1a1a1a' },
  payBtn: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' },
  pendingBadge: { backgroundColor: '#fdf3d8', color: '#856404', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' },
  
  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { backgroundColor: 'white', width: '90%', maxWidth: '360px', borderRadius: '16px', padding: '24px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalSummary: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #eee' },
  inputLabel: { display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' },
  inputWrapper: { position: 'relative', marginBottom: '15px' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#e31837' },
  input: { width: '100%', padding: '12px 12px 12px 38px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  hint: { fontSize: '0.75rem', color: '#888', marginBottom: '20px' },
  confirmBtn: { width: '100%', padding: '14px', backgroundColor: '#e31837', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  bookNowBtn: { marginTop: '15px', padding: '10px 25px', backgroundColor: '#e31837', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  loaderArea: { padding: '100px 0' }
};

export default MyBookings;