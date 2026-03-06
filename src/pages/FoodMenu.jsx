import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaLock, FaTimes, FaShoppingBag, FaArrowRight, FaMapMarkerAlt, FaPhoneAlt, FaSun, FaMoon, FaCoffee } from 'react-icons/fa';

const FoodMenu = () => {
  const navigate = useNavigate();
  const API_BASE = 'http://127.0.0.1:5000'; // Ensure your backend is running here
  
  const [foods, setFoods] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState({ text: '', icon: null });

  const [showForm, setShowForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [orderForm, setOrderForm] = useState({ phone: '', address: '', quantity: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. DYNAMIC GREETING
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting({ text: 'Good Morning', icon: <FaCoffee color="#f39c12" /> });
    else if (hour < 18) setGreeting({ text: 'Good Afternoon', icon: <FaSun color="#e67e22" /> });
    else setGreeting({ text: 'Good Evening', icon: <FaMoon color="#2c3e50" /> });
  }, []);

  // 2. PATH FIX (src/pages/ to src/assets/)
  const getImgUrl = (name) => {
    if (!name) return "https://via.placeholder.com/400x300?text=No+Image+Name";
    try {
      return require(`../assets/${name.trim()}`);
    } catch (err) {
      return "https://via.placeholder.com/400x300?text=Image+Not+Found";
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      fetchAvailableFoods();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAvailableFoods = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/meals`);
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  // 3. THE PAYMENT LOGIC (FIXED)
  const handlePaymentAndOrder = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!orderForm.phone || !orderForm.address) {
      return toast.error("Please fill in all delivery details");
    }

    setIsProcessing(true);

    const orderData = {
      username: user.username,
      email: user.email,
      itemName: selectedFood.name,
      price: selectedFood.price,
      amount: selectedFood.price * orderForm.quantity, // For M-Pesa
      quantity: orderForm.quantity,
      phone: orderForm.phone,
      address: orderForm.address,
      timestamp: Date.now() / 1000
    };

    try {
      const res = await fetch(`${API_BASE}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        toast.success("Order Received! Check phone for M-Pesa prompt.");
        setShowForm(false);
        setOrderForm({ phone: '', address: '', quantity: 1 });
        fetchAvailableFoods(); // Refresh stock
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Payment request failed");
      }
    } catch (err) {
      toast.error("Network error: Is the backend running?");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user && !loading) {
    return (
      <div style={s.loginMsg}>
        <FaLock size={50} color="#e31837" />
        <h2>Please Login</h2>
        <button onClick={() => navigate('/login')} style={s.loginBtn}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={s.pageWrapper}>
      <Toaster position="top-center" />
      
      <div style={s.contentContainer}>
        <header style={s.header}>
          <div style={s.greetingBox}>
              {greeting.icon} 
              <span style={s.greetingText}>{greeting.text}, {user?.username}</span>
          </div>
          <h1 style={s.mainTitle}>Okoth <span style={{ color: '#e31837' }}>Delicacies</span></h1>
        </header>

        <div style={s.menuGrid}>
          {foods.map((food) => (
            <div key={food.id} style={s.card}>
              <div style={s.imgWrapper}>
                <img src={getImgUrl(food.imageUrl)} alt={food.name} style={s.img} />
                <div style={s.priceTag}>KES {food.price}</div>
              </div>
              <div style={s.cardBody}>
                <h3 style={s.foodTitle}>{food.name}</h3>
                <p style={{...s.stockTxt, color: food.availableQuantity > 0 ? '#27ae60' : '#e74c3c'}}>
                  {food.availableQuantity > 0 ? `● ${food.availableQuantity} available` : '● Out of Stock'}
                </p>
                <button 
                  disabled={food.availableQuantity <= 0}
                  onClick={() => { setSelectedFood(food); setShowForm(true); }}
                  style={{ ...s.orderBtn, backgroundColor: food.availableQuantity <= 0 ? '#f0f0f0' : '#111', color: food.availableQuantity <= 0 ? '#999' : '#fff' }}
                >
                  {food.availableQuantity <= 0 ? 'SOLD OUT' : 'ORDER NOW'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={s.modalOverlay}>
            <div style={s.modal}>
                <button onClick={() => setShowForm(false)} style={s.closeBtn}><FaTimes /></button>
                <h2 style={{marginTop: 0}}><FaShoppingBag color="#e31837" /> Checkout</h2>
                <div style={s.summaryBox}>
                    <p>Item: <strong>{selectedFood?.name}</strong></p>
                    <p style={{color: '#e31837', fontWeight: 'bold'}}>Total: KES {selectedFood?.price}</p>
                </div>
                
                <form onSubmit={handlePaymentAndOrder}>
                    <label style={s.label}><FaPhoneAlt /> M-Pesa Number</label>
                    <input 
                      style={s.input} 
                      placeholder="254712345678" 
                      required 
                      value={orderForm.phone} 
                      onChange={e => setOrderForm({...orderForm, phone: e.target.value})} 
                    />
                    
                    <label style={s.label}><FaMapMarkerAlt /> Delivery Spot</label>
                    <input 
                      style={s.input} 
                      placeholder="e.g. Table 4 or Office Name" 
                      required 
                      value={orderForm.address} 
                      onChange={e => setOrderForm({...orderForm, address: e.target.value})} 
                    />
                    
                    <button type="submit" disabled={isProcessing} style={s.payBtn}>
                        {isProcessing ? "Processing..." : "PAY NOW"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

const s = {
  pageWrapper: { width: '100%', minHeight: '100vh', backgroundColor: '#fff', paddingTop: '180px', boxSizing: 'border-box' },
  contentContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px 100px 20px' },
  header: { textAlign: 'center', marginBottom: '50px' },
  greetingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '5px' },
  greetingText: { fontSize: '1.2rem', fontWeight: '500', color: '#555' },
  mainTitle: { fontSize: '3.5rem', fontWeight: '900', margin: 0 },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  card: { background: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', border: '1px solid #f1f1f1' },
  imgWrapper: { position: 'relative', height: '220px' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  priceTag: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#e31837', color: 'white', padding: '6px 15px', borderRadius: '12px', fontWeight: 'bold' },
  cardBody: { padding: '25px' },
  foodTitle: { margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '800' },
  stockTxt: { margin: '0 0 20px 0', fontSize: '0.9rem', fontWeight: '700' },
  orderBtn: { width: '100%', padding: '16px', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100000, backdropFilter: 'blur(10px)' },
  modal: { background: 'white', padding: '40px', borderRadius: '30px', width: '380px', position: 'relative' },
  summaryBox: { background: '#f9f9f9', padding: '15px', borderRadius: '15px', marginBottom: '20px' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#ddd' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px' },
  input: { width: '100%', padding: '15px', marginTop: '5px', borderRadius: '12px', border: '1px solid #eee', boxSizing: 'border-box' },
  payBtn: { width: '100%', padding: '18px', background: '#e31837', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', marginTop: '25px', cursor: 'pointer' },
  loginMsg: { textAlign: 'center', marginTop: '250px' },
  loginBtn: { padding: '15px 40px', background: '#111', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }
};

export default FoodMenu;