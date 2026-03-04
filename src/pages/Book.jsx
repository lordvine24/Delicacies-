import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// Assets
import BirthdayBook from '../assets/book/birthday.jpeg';
import WeddingBook from '../assets/book/wedding.jpeg';
import EventBook from '../assets/book/event.jpeg';
import ChefBook from '../assets/book/chef.jpeg';
import CorporateBook from '../assets/book/coporate.jpeg';

const RevealSide = ({ children, direction = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { 
      if (entry.isIntersecting) setIsVisible(true); 
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const getTransform = () => {
    if (isVisible) return 'translateX(0)';
    return direction === 'right' ? 'translateX(100px)' : 'translateX(-100px)';
  };
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0, 
      transform: getTransform(),
      transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)', 
      width: '100%'
    }}>{children}</div>
  );
};

const Book = () => {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [numPeople, setNumPeople] = useState(25);
  const [totalPrice, setTotalPrice] = useState(0);

  const [emailInput, setEmailInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({ date: '', phone: '', location: '' });

  const bookingSections = [
    {
      title: "Royal Wedding Catering",
      quote: "A union of souls deserves a feast of kings.",
      desc: "Your wedding day is a once-in-a-lifetime milestone, and at Okoth's Delicacies, we treat it with the royal reverence it deserves. We specialize in grand culinary experiences that blend traditional Kenyan hospitality with modern elegance. From the initial menu tasting to the final plate served, our team manages every detail. Our wedding package includes a lavish multi-course buffet featuring our world-class slow-cooked beef pilau, marinated kienyeji chicken, and a refreshing array of garden salads.",
      price: 100000,
      img: WeddingBook,
      side: 'right'
    },
    {
      title: "Premium Birthday Bashes",
      quote: "Celebrate your legacy with flavors that pop.",
      desc: "Whether you are celebrating a milestone 50th birthday, a vibrant 1st birthday, or anything in between, we bring the flavor and the fun directly to your doorstep. We believe that every year of life is a victory worth celebrating with great food. Our birthday catering service is fully customizable to match your party's theme, offering everything from savory finger foods and bitings to a full-course celebratory meal.",
      price: 25000,
      img: BirthdayBook,
      side: 'left'
    },
    {
      title: "Exclusive Private Chef",
      quote: "Restaurant-grade luxury in the comfort of your home.",
      desc: "Experience the ultimate in culinary intimacy and luxury without leaving your dining room. Our Private Chef service is designed for the discerning client who values privacy, quality, and a personalized touch. Perfect for romantic anniversaries, secret proposals, or high-stakes business dinners, our chef will work with you to curate a bespoke 5-course menu tailored to your specific dietary preferences.",
      price: 15500,
      img: ChefBook,
      side: 'right'
    },
    {
      title: "Corporate Executive Dining",
      quote: "Success is best served with a side of gourmet.",
      desc: "In the world of business, first impressions and high energy are everything. Ditch the uninspiring office snacks and fuel your team’s success with our executive corporate catering. We provide premium meal solutions for board meetings, product launches, and annual general meetings. Our corporate packages feature balanced, nutritious, and incredibly flavorful meal boxes designed to be professional.",
      price: 40000,
      img: CorporateBook,
      side: 'left'
    },
    {
      title: "Grand Community Events",
      quote: "Feeding the masses with integrity and heart.",
      desc: "For large-scale gatherings such as Ruracios (dowry ceremonies), family reunions, or community ceremonies, Okoth's Delicacies is the trusted name for feeding the masses. We have the logistics and the culinary capacity to handle crowds of over 500 people while maintaining the high standards of taste and hygiene that Nyeri is famous for. We specialize in 'soul food'—authentic traditional meals.",
      price: 65000,
      img: EventBook,
      side: 'right'
    }
  ];

  const openBookingPanel = (service) => {
    setSelectedService(service);
    setNumPeople(25);
    setTotalPrice(service.price);
    setIsPanelOpen(true);
    setStep(1);
    setIsVerified(false);
    setEmailInput('');
  };

  const handlePeopleChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setNumPeople(val);
    const basePeople = 25;
    if (val <= basePeople) {
      setTotalPrice(selectedService.price);
    } else {
      const perPersonRate = selectedService.price / basePeople;
      setTotalPrice(selectedService.price + ((val - basePeople) * perPersonRate));
    }
  };

  const checkUserStatus = async () => {
    if (!emailInput) return toast.error("Please enter your email.");
    
    try {
      // Encode email and use explicit local session checks
      const email = encodeURIComponent(emailInput.toLowerCase().trim());
      const res = await fetch(`http://127.0.0.1:5000/api/check-user?email=${email}`);
      
      if (res.status === 404) {
        toast.error("Account not found. Redirecting to Signup...");
        setTimeout(() => navigate('/signup'), 2000);
        return;
      }

      const data = await res.json();
      
      if (res.ok && data.exists) {
        const stored = localStorage.getItem('user');
        const session = stored ? JSON.parse(stored) : null;
        if (session && session.email && session.email.toLowerCase() === emailInput.toLowerCase().trim()) {
          setIsVerified(true);
          toast.success("Account verified!");
        } else {
          toast.error("Account exists. Please Login to book.");
          setTimeout(() => navigate('/login'), 1500);
        }
      }
    } catch (e) {
      toast.error("Connection failed. Check if your Flask server is running on port 5000.");
    }
  };

  const handleFinalBooking = async () => {
    const stored = localStorage.getItem('user');
    const session = stored ? JSON.parse(stored) : null;
    if (!session || !session.email) {
      toast.error('You must be logged in to complete booking.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    const payload = {
      userid: session.email.toLowerCase(),
      username: session.username.toLowerCase(),
      servicetype: selectedService.title.toLowerCase(),
      eventdate: formData.date,
      location: formData.location.toLowerCase(),
      status: "pending",
      timestamp: Date.now(),
      totalprice: totalPrice,
      people: numPeople,
      phone: formData.phone
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Booking Request Sent!");
        setIsPanelOpen(false);
      } else {
        toast.error("Error submitting request.");
      }
    } catch (e) {
      toast.error("Network error.");
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', overflowX: 'hidden', position: 'relative' }}>
      <Toaster position="top-center" />
      
      <section style={{ padding: '140px 8% 80px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900' }}>BOOK <span style={{ color: '#e31837' }}>OUR EXPERTISE</span></h1>
      </section>

      {bookingSections.map((sec, index) => (
        <section key={index} style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', padding: '100px 8%', gap: '80px',
          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfc',
          flexDirection: sec.side === 'right' ? 'row' : 'row-reverse'
        }}>
          <div style={{ flex: '1.5', minWidth: '350px' }}>
            <RevealSide direction={sec.side === 'right' ? 'left' : 'right'}>
              <h4 style={{ color: '#e31837', fontWeight: '800', letterSpacing: '3px' }}>OFFER 0{index + 1}</h4>
              <h2 style={{ fontSize: '3.2rem', fontWeight: '900', marginBottom: '25px' }}>{sec.title}</h2>
              <p style={{ fontStyle: 'italic', borderLeft: '5px solid #e31837', paddingLeft: '20px', marginBottom: '30px' }}>"{sec.quote}"</p>
              <p style={{ lineHeight: '1.9', color: '#555', marginBottom: '35px', textAlign: 'justify' }}>{sec.desc}</p>
              <button className="book-btn-luxury" onClick={() => openBookingPanel(sec)}>START BOOKING</button>
            </RevealSide>
          </div>
          <div style={{ flex: '1' }}>
            <RevealSide direction={sec.side}>
              <img src={sec.img} alt={sec.title} style={{ width: '100%', height: '550px', objectFit: 'cover', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </RevealSide>
          </div>
        </section>
      ))}

      <div className={`slide-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-inner">
          <button className="panel-close" onClick={() => setIsPanelOpen(false)}>CLOSE ✕</button>
          <h2>{step === 1 ? 'Details' : 'Final Step'}</h2>
          
          <div className="service-mini-card">
            <h3>{selectedService?.title}</h3>
            <p style={{ color: '#e31837', fontWeight: '900', fontSize: '1.6rem' }}>KES {totalPrice.toLocaleString()}</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            {step === 1 ? (
              <div className="form-group-wrapper">
                <div className="input-group">
                  <label>Verify Account Email</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="email" placeholder="registered-email@mail.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} disabled={isVerified} required />
                    {!isVerified && <button type="button" onClick={checkUserStatus} className="verify-btn">VERIFY</button>}
                  </div>
                </div>
                
                {isVerified && (
                  <div className="fade-in">
                    <div className="row">
                      <div className="input-group"><label>Guests</label><input type="number" value={numPeople} onChange={handlePeopleChange} required /></div>
                      <div className="input-group"><label>Event Date</label><input type="date" onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
                    </div>
                    <div className="input-group"><label>M-Pesa Number</label><input type="tel" placeholder="07XXXXXXXX" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
                    <div className="input-group"><label>Event Venue Details</label><textarea placeholder="Specify the exact location" onChange={(e) => setFormData({ ...formData, location: e.target.value })} required /></div>
                    <button type="submit" className="next-btn">PROCEED</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="payment-step">
                <div className="mpesa-box">
                  <b>M-PESA CHECKOUT</b>
                  <p>Check your phone for the KES {totalPrice.toLocaleString()} prompt.</p>
                </div>
                <button type="button" onClick={handleFinalBooking} className="pay-btn">CONFIRM PAYMENT</button>
                <button type="button" onClick={() => setStep(1)} className="back-link">← Back to Details</button>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .book-btn-luxury { padding: 18px 45px; background: #e31837; color: white; border: none; font-weight: 800; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .book-btn-luxury:hover { background: #c2142d; transform: translateY(-3px); }
        .slide-panel { position: fixed; top: 0; right: -600px; width: 500px; height: 100vh; background: #fff; z-index: 2000; transition: 0.5s cubic-bezier(0.77, 0, 0.175, 1); box-shadow: -10px 0 30px rgba(0,0,0,0.1); padding: 40px; overflow-y: auto; }
        .slide-panel.open { right: 0; }
        .service-mini-card { background: #f4f4f4; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 6px solid #e31837; }
        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .input-group label { font-size: 0.8rem; font-weight: 800; color: #555; text-transform: uppercase; }
        .input-group input, .input-group textarea { padding: 14px; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; }
        .verify-btn { background: #1a1a1a; color: white; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; font-weight: 700; }
        .next-btn, .pay-btn { width: 100%; padding: 18px; border: none; border-radius: 10px; font-weight: 900; color: white; cursor: pointer; }
        .next-btn { background: #1a1a1a; } .pay-btn { background: #28a745; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .mpesa-box { border: 2px solid #28a745; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center; color: #28a745; }
        .panel-close { background: none; border: none; color: #e31837; font-weight: 900; cursor: pointer; margin-bottom: 25px; }
        .back-link { background: none; border: none; color: #888; margin-top: 20px; cursor: pointer; width: 100%; text-decoration: underline; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Book;