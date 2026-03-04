import React, { useEffect, useRef, useState } from 'react';

// Import assets
import AboutHero from '../assets/aboutm.jpeg'; 
import StoryImg1 from '../assets/aboutb1.jpeg'; 
import StoryImg2 from '../assets/aboutd2.jpeg'; 

// --- ENHANCED REVEAL ON SCROLL ---
const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.9)',
        transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
        width: '100%'
      }}>
      {children}
    </div>
  );
};

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storyRef = useRef(null);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const brandQuotes = [
    { text: "Food is not just fuel, it’s the language of care and the foundation of every great celebration.", author: "The Okoth Philosophy" },
    { text: "We don't just cook recipes; we preserve the heritage of Nyeri and serve it with modern excellence.", author: "Our Culinary Promise" },
    { text: "A meal at Okoth’s is a journey home—where every spice tells a story and every bite feels like family.", author: "The Heart of the Kitchen" }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', overflowX: 'hidden' }}>
      
      {/* --- QUOTE DISPLAY MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="close-modal">✕</button>
            <h2 style={{ fontWeight: '900', color: '#1a1a1a', textAlign: 'center', marginBottom: '30px' }}>
              OUR <span style={{ color: '#e31837' }}>INSPIRATION</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {brandQuotes.map((q, idx) => (
                <div key={idx} style={{ padding: '20px', borderLeft: '5px solid #e31837', backgroundColor: '#f9f9f9', borderRadius: '0 15px 15px 0' }}>
                  <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#333', marginBottom: '10px' }}>"{q.text}"</p>
                  <p style={{ fontWeight: '800', fontSize: '0.8rem', color: '#e31837', textTransform: 'uppercase', letterSpacing: '1px' }}>— {q.author}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setIsModalOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: '30px' }}>CLOSE</button>
          </div>
        </div>
      )}

      {/* --- 1. HERO SECTION --- */}
      <section style={{ 
        backgroundColor: '#1a1a1a', color: 'white', display: 'flex', alignItems: 'center', 
        padding: '120px 8%', minHeight: '85vh', gap: '60px', flexWrap: 'wrap' 
      }}>
        <div style={{ flex: '1', minWidth: '350px' }}>
          <span style={{ color: '#e31837', fontSize: '14px', fontWeight: '800', letterSpacing: '3px' }}>ESTABLISHED 2024</span>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '20px 0', lineHeight: '1.1' }}>
            ABOUT <br /> <span style={{ color: '#e31837' }}>OUR STORY</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#bbb', marginBottom: '40px' }}>
            Okoth’s Delicacies is a premier catering service based in Nyeri, dedicated to bringing authentic Kenyan soul food to your most cherished events.
          </p>
          <button onClick={scrollToStory} className="btn-primary">DISCOVER OUR STORY</button>
        </div>
        <div style={{ flex: '1', minWidth: '400px' }}>
          <img src={AboutHero} alt="Hero" style={{ width: '100%', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
        </div>
      </section>

      {/* --- 2. MISSION & VISION --- */}
      <RevealOnScroll>
        <section style={{ padding: '80px 8%', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div className="info-card light">
            <h3 style={{ color: '#e31837', fontWeight: '900' }}>Our Mission</h3>
            <p>To provide exceptional catering services that combine the rich heritage of Nyeri flavors with modern standards.</p>
          </div>
          <div className="info-card dark">
            <h3 style={{ color: '#e31837', fontWeight: '900' }}>Our Vision</h3>
            <p>To be the leading hospitality brand in Kenya, recognized for culinary innovation and integrity.</p>
          </div>
        </section>
      </RevealOnScroll>

      {/* --- 3. WHY CHOOSE US --- */}
      <RevealOnScroll>
        <section style={{ padding: '100px 8%', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>WHY <span style={{ color: '#e31837' }}>CHOOSE US?</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[
              { title: "Local Nyeri Sourcing", desc: "Freshness from farm to fork.", icon: "🚜" },
              { title: "Customized Menus", desc: "Tailored to your budget and taste.", icon: "📋" },
              { title: "Professional Staff", desc: "Elegance in every interaction.", icon: "👔" },
              { title: "Safety & Hygiene", desc: "Your health is our priority.", icon: "🛡️" }
            ].map((item, idx) => (
              <div key={idx} className="feature-card">
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{item.icon}</div>
                <h4 style={{ fontWeight: '900', marginBottom: '15px' }}>{item.title}</h4>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* --- 4. THE PHILOSOPHY (EXPANDED MESSAGES) --- */}
      <RevealOnScroll>
        <section ref={storyRef} style={{ padding: '100px 8%', display: 'flex', gap: '80px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white' }}>
          <div style={{ flex: '1', display: 'flex', gap: '20px', minWidth: '400px' }}>
            <img src={StoryImg1} alt="Kitchen" className="story-img" style={{ marginTop: '50px' }} />
            <img src={StoryImg2} alt="Serving" className="story-img" />
          </div>
          <div style={{ flex: '1', minWidth: '350px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '30px' }}>OUR <span style={{ color: '#e31837' }}>PHILOSOPHY</span></h2>
            
            <div style={{ marginBottom: '30px' }}>
               <h4 style={{ color: '#e31837', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '10px' }}>Heritage Meets Innovation</h4>
               <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
                 We believe that cooking is a sacred art. Our kitchen is where the deep, earthy traditions of the Nyeri highlands meet the precision of modern culinary science. We don't just follow recipes; we honor ancestral secrets while embracing new-age plating and flavor profiles.
               </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
               <h4 style={{ color: '#e31837', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '10px' }}>The Power of Freshness</h4>
               <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
                 Our philosophy is rooted in the soil. By sourcing 100% of our ingredients from local small-holder farms, we ensure that every bite carries the vibrant energy of fresh harvest. If it's not fresh, it's not Okoth's.
               </p>
            </div>

            <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
              <div>
                <h3 style={{ color: '#e31837', fontSize: '2.5rem', fontWeight: '900' }}>100%</h3>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>Organic</p>
              </div>
              <div>
                <h3 style={{ color: '#e31837', fontSize: '2.5rem', fontWeight: '900' }}>500+</h3>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>Events</p>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* --- 5. BRAND PROMISE --- */}
      <RevealOnScroll>
        <section style={{ padding: '120px 8%', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>"We serve <span style={{ color: '#e31837' }}>Trust</span>."</h2>
            <h4 style={{ fontWeight: '900', marginTop: '30px', letterSpacing: '2px' }}>— MR. OKOTH</h4>
            <button onClick={() => setIsModalOpen(true)} className="btn-secondary">READ OUR INSPIRATION</button>
          </div>
        </section>
      </RevealOnScroll>

      <style>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); zIndex: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(5px); }
        .modal-content { background: white; padding: 50px; borderRadius: 30px; maxWidth: 600px; width: 100%; position: relative; animation: slideIn 0.5s cubic-bezier(0.25, 1, 0.5, 1); }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .close-modal { position: absolute; top: 20px; right: 20px; border: none; background: none; fontSize: 24px; cursor: pointer; color: #999; }
        
        .btn-primary { padding: 18px 45px; background-color: #e31837; color: white; border: none; font-weight: 800; cursor: pointer; border-radius: 5px; transition: 0.3s; }
        .btn-primary:hover { background-color: #1a1a1a; transform: translateY(-3px); }
        
        .btn-secondary { margin-top: 50px; padding: 20px 50px; background-color: #1a1a1a; color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn-secondary:hover { background-color: #e31837; transform: translateY(-5px); }

        .info-card { flex: 1; minWidth: 300px; padding: 50px; borderRadius: 30px; }
        .info-card.light { background-color: #f9f9f9; }
        .info-card.dark { background-color: #1a1a1a; color: white; }

        .feature-card { padding: 40px; border-radius: 30px; background-color: #f9f9f9; border-bottom: 5px solid #e31837; transition: 0.4s ease; }
        .feature-card:hover { transform: translateY(-15px); background-color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        .story-img { width: 50%; height: 500px; object-fit: cover; borderRadius: 20px; transition: transform 0.8s ease; }
      `}</style>
    </div>
  );
};

export default About;