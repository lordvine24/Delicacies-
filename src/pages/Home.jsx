import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- 1. ALL ASSETS IMPORTS ---
import HomeImg from '../assets/HOME.jpeg'; 
import AboutBg from '../assets/about.jpeg'; 
import FounderImg from '../assets/manager.jpeg'; 
import ManagerImg from '../assets/director.jpeg';

// SERVICE IMAGES
import BirthdayImg from '../assets/birthday.jpeg'; 
import WeddingImg from '../assets/wedding.jpeg'; 
import EventImg from '../assets/event.jpeg'; 
import ChefImg from '../assets/chef.jpeg'; 
import CorporateImg from '../assets/coporate.jpeg';

// MENU GLIMPSE IMAGES (.jpeg)
import FoodImg from '../assets/food.jpeg';
import BurgerImg from '../assets/burger.jpeg';
import VegImg from '../assets/vegetable.jpeg';
import DrinkImg from '../assets/drink.jpeg';

// --- 2. ANIMATION WRAPPER COMPONENT ---
const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
        transition: 'all 1.1s cubic-bezier(0.17, 0.55, 0.55, 1)',
        width: '100%'
      }}>
      {children}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  // --- 3. TYPING EFFECT LOGIC ---
  const [displayText, setDisplayText] = useState("");
  const fullText = "WELCOME TO OKOTH'S DELICACIES";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(typingInterval);
    }, 100); 
    return () => clearInterval(typingInterval);
  }, []);

  // --- 4. SERVICES DATA ---
  const services = [
    { title: "Birthday Celebrations", desc: "Themed decor and custom menus for unforgettable parties.", icon: "🎈", img: BirthdayImg },
    { title: "Wedding Catering", desc: "Exquisite multi-course meals and elegant buffet setups for your big day.", icon: "💍", img: WeddingImg },
    { title: "Event Catering", desc: "Professional buffet services for dowries, funerals, and large gatherings.", icon: "🍲", img: EventImg },
    { title: "Private Chef", desc: "A personalized fine-dining experience served directly in your home.", icon: "👨‍🍳", img: ChefImg },
    { title: "Corporate Lunch", desc: "Fresh, healthy, and gourmet meal boxes delivered to your workspace.", icon: "💼", img: CorporateImg }
  ];

  // --- 5. TESTIMONIALS DATA ---
  const testimonials = [
    { name: "Grace Wanjiku", role: "Wedding Client", text: "We hired Okoth's Delicacies for our wedding in Nyeri. The booking process was seamless, and the food was the highlight of the day! Everyone is still talking about the pilau." },
    { name: "David Maina", role: "Corporate Manager", text: "Professionalism at its best. We booked them for our end-of-year corporate lunch. Arrived on time, set up beautifully, and the flavors were authentic." },
    { name: "Sarah Njeri", role: "Birthday Party", text: "I hired a private chef from Okoth's for my husband's 40th birthday. It was a 5-star experience in our own dining room. Highly recommend!" },
    { name: "Peter Kamau", role: "Family Gathering", text: "Best catering service in the region. We booked them for a large family event and they handled the crowd with ease. Fresh and delicious food." },
    { name: "Mercy Otieno", role: "Event Organizer", text: "As an organizer, I need reliability. Okoth's Delicacies is my go-to. Their team is disciplined and their food quality never drops." }
  ];

  // --- 6. MANAGEMENT DATA ---
  const managementData = [
    {
      img: FounderImg,
      name: "Mr. Okoth",
      role: "FOUNDER & CEO",
      color: "#e31837",
      text: '"Karibu Sana! At Okoth\'s Delicacies, we treat every customer like family. My personal promise is to ensure you experience the most authentic flavors of Kenya."'
    },
    {
      img: ManagerImg,
      name: "Operations Director",
      role: "GENERAL MANAGER",
      color: "#1a1a1a",
      text: '"Our team is dedicated to providing you with a world-class hospitality experience. We focus on precision, speed, and that special touch of warmth."'
    }
  ];

  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page" style={{ backgroundColor: '#ffffff', overflowX: 'hidden' }}>
      
      {/* --- SECTION 1: HERO --- */}
      <section className="hero-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '100px 8% 60px 8%', minHeight: '85vh', gap: '60px', flexWrap: 'wrap'
      }}>
        <div className="hero-content" style={{ flex: '1.2', minWidth: '350px' }}>
          <div style={{ color: '#e31837', fontSize: '14px', fontWeight: '800', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' }}>
            savor the flavor of Kenya
          </div>
          <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '1.05', color: '#1a1a1a', margin: '0 0 30px 0', minHeight: '160px' }}>
            <span style={{ color: '#e31837' }}>{displayText}</span>
            <span className="cursor" style={{ borderRight: '4px solid #1a1a1a', marginLeft: '5px', animation: 'blink 0.7s infinite' }}></span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.7', marginBottom: '40px', maxWidth: '550px' }}>
            Experience the true taste of Kenya. From traditional Nyeri meals to modern snacks, 
            we bring fresh, high-quality ingredients straight to your table.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="signup-btn" onClick={scrollToContact} style={{ padding: '18px 40px', fontSize: '15px', fontWeight: '700' }}>BOOK US</button>
            <button className="login-btn" style={{ padding: '18px 40px', fontSize: '15px', fontWeight: '700' }}>VIEW MENU</button>
          </div>
        </div>
        <div className="hero-image-wrapper" style={{ flex: '1', minWidth: '400px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderTop: '10px solid #e31837', borderRight: '10px solid #e31837', borderRadius: '0 40px 0 0', zIndex: '1' }}></div>
          <img src={HomeImg} alt="Hero" style={{ width: '65%', borderRadius: '50px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', display: 'block', position: 'relative', zIndex: '2' }} />
        </div>
      </section>

      {/* --- SECTION 2: ICON GRID --- */}
      <RevealOnScroll>
        <section style={{ padding: '100px 8%', backgroundColor: '#fcfcfc', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            {[{ title: "Fine Dining", icon: "🍷" }, { title: "Fast Delivery", icon: "🚗" }, { title: "Best Quality", icon: "⭐" }, { title: "24/7 Support", icon: "📞" }].map((item, index) => (
              <div key={index} style={{ backgroundColor: '#fff', padding: '50px 30px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{item.icon}</div>
                <h4 style={{ fontWeight: '800', color: '#1a1a1a' }}>{item.title}</h4>
                <p style={{ fontSize: '14px', color: '#777', marginTop: '10px' }}>Premium service tailored specifically for your needs.</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* --- SECTION 3: OUR STORY --- */}
      <section id="about" style={{
        position: 'relative', padding: '120px 8%', color: 'white', textAlign: 'center',
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${AboutBg})`,
        backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center'
      }}>
        <RevealOnScroll>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px' }}>Our Story</h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#e31837', margin: '0 auto 30px' }}></div>
          <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '2', fontWeight: '300' }}>
            What began as a passion for authentic Kenyan flavors in the heart of Nyeri has blossomed into <strong>Okoth's Delicacies</strong>. 
            Our journey is one of culinary heritage.
          </p>
        </RevealOnScroll>
      </section>

      {/* --- NEW SECTION: MENU GLIMPSE --- */}
      <RevealOnScroll>
        <section style={{ padding: '100px 8%', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h5 style={{ color: '#e31837', letterSpacing: '3px', fontWeight: '800', margin: '0' }}>SIGNATURE SELECTION</h5>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a1a1a', marginTop: '10px' }}>A Glimpse of our Menu</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {/* FOOD */}
            <div className="menu-glimpse-card">
              <div className="menu-img-container"><img src={FoodImg} alt="Food" /></div>
              <div className="menu-category-header">FOOD</div>
              <ul className="menu-list">
                <li><span>Beef Pilau</span> <strong>KES 1,200</strong></li>
                <li><span>Nyeri Mukimo</span> <strong>KES 850</strong></li>
                <li><span>Kienyeji Chicken</span> <strong>KES 1,500</strong></li>
              </ul>
              <button className="menu-nav-btn" onClick={() => navigate('/menu/food')}>VIEW ALL FOOD</button>
            </div>

            {/* BURGERS */}
            <div className="menu-glimpse-card">
              <div className="menu-img-container"><img src={BurgerImg} alt="Burgers" /></div>
              <div className="menu-category-header">BURGERS</div>
              <ul className="menu-list">
                <li><span>Royal Burger</span> <strong>KES 950</strong></li>
                <li><span>Crispy Chicken</span> <strong>KES 800</strong></li>
                <li><span>Double Cheese</span> <strong>KES 1,100</strong></li>
              </ul>
              <button className="menu-nav-btn" onClick={() => navigate('/menu/burgers')}>VIEW BURGERS</button>
            </div>

            {/* VEGETABLES */}
            <div className="menu-glimpse-card">
              <div className="menu-img-container"><img src={VegImg} alt="Vegetables" /></div>
              <div className="menu-category-header">VEGETABLES</div>
              <ul className="menu-list">
                <li><span>Creamy Spinach</span> <strong>KES 400</strong></li>
                <li><span>Traditional Managu</span> <strong>KES 450</strong></li>
                <li><span>Stir-fry Medley</span> <strong>KES 500</strong></li>
              </ul>
              <button className="menu-nav-btn" onClick={() => navigate('/menu/vegetables')}>VIEW VEGGIES</button>
            </div>

            {/* DRINKS */}
            <div className="menu-glimpse-card">
              <div className="menu-img-container"><img src={DrinkImg} alt="Drinks" /></div>
              <div className="menu-category-header">DRINKS</div>
              <ul className="menu-list">
                <li><span>Tropical Juice</span> <strong>KES 350</strong></li>
                <li><span>Artisan Coffee</span> <strong>KES 300</strong></li>
                <li><span>Kenyan Tea</span> <strong>KES 200</strong></li>
              </ul>
              <button className="menu-nav-btn" onClick={() => navigate('/menu/drinks')}>VIEW DRINKS</button>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* --- SECTION 4: RESTORED OUR SERVICES --- */}
      <RevealOnScroll>
        <section id="services" style={{ padding: '100px 8%', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1.2', minWidth: '350px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>Our <span style={{ color: '#e31837' }}>Services</span></h2>
              <p style={{ color: '#777', fontStyle: 'italic', marginBottom: '30px', fontSize: '1.1rem', borderLeft: '4px solid #e31837', paddingLeft: '15px' }}>
                "Great food is the foundation of genuine happiness."
              </p>
              <div className="services-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '480px', overflowY: 'auto', paddingRight: '15px', marginBottom: '40px' }}>
                {services.map((s, i) => (
                  <div key={i} className="service-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: '0.4s ease' }}>
                    <img src={s.img} alt={s.title} style={{ width: '90px', height: '90px', borderRadius: '20px', objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontWeight: '800' }}>{s.icon} {s.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="signup-btn" 
                onClick={() => navigate('/book')} 
                style={{ padding: '18px 45px', fontSize: '16px', fontWeight: '800', boxShadow: '0 15px 30px rgba(227, 24, 55, 0.2)' }}
              >
                BOOK US TODAY
              </button>
            </div>
            <div style={{ flex: '1', minWidth: '400px', position: 'relative', height: '550px' }}>
              <div style={{ width: '85%', height: '400px', borderRadius: '40px', overflow: 'hidden', position: 'absolute', top: '0', right: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <img src={HomeImg} alt="Large" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: '65%', height: '320px', borderRadius: '40px', overflow: 'hidden', position: 'absolute', bottom: '0', left: '0', border: '12px solid #fff', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', zIndex: '2' }}>
                <img src={AboutBg} alt="Small" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* --- SECTION 5: MANAGEMENT --- */}
      <RevealOnScroll>
        <section style={{ padding: '100px 8%', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', marginBottom: '60px' }}>Meet Our <span style={{ color: '#e31837' }}>Team</span></h2>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {managementData.map((m, idx) => (
              <div key={idx} style={{ width: '350px', background: '#fff', padding: '40px 30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ width: '150px', height: '150px', margin: '0 auto 20px', overflow: 'hidden', borderRadius: '75px', border: `5px solid ${m.color}` }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ margin: '0 0 10px', fontWeight: '800' }}>{m.name}</h3>
                <p style={{ color: m.color, fontWeight: '700', marginBottom: '15px' }}>{m.role}</p>
                <p style={{ margin: 0, color: '#666', fontStyle: 'italic', lineHeight: '1.6' }}>{m.text}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* --- SECTION 6: TESTIMONIALS --- */}
      <RevealOnScroll>
        <section style={{ padding: '100px 8%', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '15px' }}>
               What Our <span style={{ color: '#e31837' }}>Clients Say</span>
             </h2>
             <div style={{ width: '50px', height: '3px', backgroundColor: '#e31837', margin: '20px auto' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '30px', overflowX: 'auto', padding: '20px 10px 40px', scrollbarWidth: 'none' }} className="testimonials-row">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card" style={{ 
                minWidth: '350px', backgroundColor: '#fff', padding: '45px 35px', borderRadius: '35px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', position: 'relative', transition: '0.4s ease'
              }}>
                <div style={{ color: '#FFD700', fontSize: '18px', marginBottom: '20px' }}>★★★★★</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: '#444', lineHeight: '1.8', marginBottom: '25px', fontSize: '1.05rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '10px', height: '40px', backgroundColor: '#e31837', borderRadius: '5px' }}></div>
                    <div>
                      <h4 style={{ margin: '0', color: '#1a1a1a', fontWeight: '900' }}>{t.name}</h4>
                      <p style={{ margin: '0', color: '#e31837', fontSize: '12px', fontWeight: '800' }}>{t.role} • <span style={{ color: '#28a745' }}>✓ Verified Booking</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* --- SECTION 7: CONTACT --- */}
      <RevealOnScroll>
        <section id="contact" style={{ padding: '100px 8%', backgroundColor: '#1a1a1a', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>Get In <span style={{ color: '#e31837' }}>Touch</span></h2>
              <p style={{ color: '#bbb' }}>📍 Nyeri Town, Kenya | 📞 +254 11624386</p>
              <p style={{ color: '#bbb' }}>📧 okothdelicacies@gmail.com</p>
            </div>
            <div style={{ flex: '1.5', minWidth: '300px' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Name" style={{ padding: '18px', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: 'white' }} />
                <textarea placeholder="Message" rows="4" style={{ padding: '18px', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: 'white' }}></textarea>
                <button type="button" style={{ padding: '18px', backgroundColor: '#e31837', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <style>{`
        @keyframes blink { from, to { border-color: transparent } 50% { border-color: #1a1a1a; } }
        .services-list::-webkit-scrollbar { width: 6px; }
        .services-list::-webkit-scrollbar-thumb { background: #e31837; border-radius: 10px; }
        .service-card:hover { transform: translateX(15px); border-left: 6px solid #e31837; }
        .testimonial-card:hover { transform: translateY(-15px); border-color: #e31837 !important; }
        .testimonials-row::-webkit-scrollbar { display: none; }

        .menu-glimpse-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee; transition: 0.3s; display: flex; flex-direction: column; }
        .menu-glimpse-card:hover { border-color: #e31837; transform: translateY(-10px); }
        .menu-img-container { width: 100%; height: 180px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; }
        .menu-img-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .menu-glimpse-card:hover .menu-img-container img { transform: scale(1.1); }
        .menu-category-header { font-size: 1.3rem; font-weight: 900; color: #1a1a1a; margin-bottom: 15px; border-bottom: 3px solid #e31837; width: fit-content; }
        .menu-list { list-style: none; padding: 0; margin: 0 0 25px 0; flex-grow: 1; }
        .menu-list li { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; color: #555; }
        .menu-list li strong { color: #e31837; }
        .menu-nav-btn { padding: 12px; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .menu-nav-btn:hover { background: #e31837; }
      `}</style>
    </div>
  );
};

export default Home;