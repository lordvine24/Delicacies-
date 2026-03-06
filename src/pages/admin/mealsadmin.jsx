import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { FaArrowLeft, FaTrash, FaPlus, FaUtensils, FaImage, FaHashtag, FaMoneyBillWave } from 'react-icons/fa';

const MealsAdmin = () => {
  const navigate = useNavigate();
  const API_BASE = 'http://127.0.0.1:5000';

  // --- 1. SCAN LOCAL ASSETS ---
  const getAssetImages = () => {
    try {
      // Scans your actual src/assets folder for image files
      const context = require.context('../../assets', false, /\.(jpe?g|png|webp|JPG|jpeg)$/);
      return context.keys().map(path => path.replace('./', ''));
    } catch (err) {
      console.error("Asset folder not found at ../../assets", err);
      return [];
    }
  };
  const assetPhotos = getAssetImages();

  // --- STATE ---
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMeal, setNewMeal] = useState({
    name: '',
    price: '',
    category: 'Food',
    imageName: '', // This is temporary state for the picker
    availableQuantity: '' 
  });

  // --- 2. THE IMAGE TRANSLATOR ---
  const getImgUrl = (name) => {
    if (!name) return "https://via.placeholder.com/150?text=No+Image+Name";
    try {
      return require(`../../assets/${name}`);
    } catch (err) {
      console.warn(`Webpack cannot find: ${name}`);
      return "https://via.placeholder.com/150?text=File+Not+Found";
    }
  };

  const fetchMeals = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/meals`);
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error("Backend offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // --- 3. SAVE LOGIC (MATCHING YOUR FIREBASE) ---
  const handleAddMeal = async () => {
    if (!newMeal.name || !newMeal.imageName || !newMeal.price) {
      return Swal.fire('Incomplete', 'Please fill all fields and pick an image!', 'warning');
    }

    const dataToSave = {
      name: newMeal.name,
      price: Number(newMeal.price),
      category: newMeal.category,
      availableQuantity: Number(newMeal.availableQuantity),
      imageUrl: newMeal.imageName, // SAVING FILENAME TO YOUR 'imageUrl' FIELD
      timestamp: Date.now() / 1000
    };

    try {
      const res = await fetch(`${API_BASE}/api/admin/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Meal Published!', showConfirmButton: false, timer: 1500 });
        setNewMeal({ name: '', price: '', category: 'Food', imageName: '', availableQuantity: '' });
        fetchMeals();
      }
    } catch (err) {
      Swal.fire('Error', 'Could not save to Firebase', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Item?',
      text: "This will remove it from the customer menu!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      await fetch(`${API_BASE}/api/admin/meals/${id}`, { method: 'DELETE' });
      fetchMeals();
    }
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerContent}>
          <button onClick={() => navigate('/admin/home')} style={s.backBtn}>
            <FaArrowLeft /> Dashboard
          </button>
          <h1 style={s.title}>Menu <span style={{color: '#e31837'}}>Admin</span></h1>
        </div>
      </header>

      <div style={s.mainGrid}>
        {/* LEFT SIDE: CREATION FORM */}
        <div style={s.card}>
          <h3 style={s.cardTitle}><FaPlus /> Add New Dish</h3>
          
          <label style={s.label}>Product Name</label>
          <div style={s.inputBox}>
            <FaUtensils style={s.icon}/>
            <input style={s.input} value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})} placeholder="e.g. Samosa" />
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div style={{flex: 1}}>
              <label style={s.label}>Price (KES)</label>
              <div style={s.inputBox}>
                <FaMoneyBillWave style={s.icon}/>
                <input style={s.input} type="number" value={newMeal.price} onChange={e => setNewMeal({...newMeal, price: e.target.value})} placeholder="60" />
              </div>
            </div>
            <div style={{flex: 1}}>
              <label style={s.label}>Quantity</label>
              <div style={s.inputBox}>
                <FaHashtag style={s.icon}/>
                <input style={s.input} type="number" value={newMeal.availableQuantity} onChange={e => setNewMeal({...newMeal, availableQuantity: e.target.value})} placeholder="1200" />
              </div>
            </div>
          </div>

          <label style={s.label}>Select Local Image (Picker)</label>
          <div style={s.assetPicker}>
            {assetPhotos.map(fileName => (
              <div 
                key={fileName} 
                onClick={() => setNewMeal({...newMeal, imageName: fileName})}
                style={{
                  ...s.assetCard,
                  borderColor: newMeal.imageName === fileName ? '#e31837' : 'transparent',
                  transform: newMeal.imageName === fileName ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <img src={getImgUrl(fileName)} alt="asset" style={s.assetImg} />
                <span style={s.assetText}>{fileName}</span>
              </div>
            ))}
          </div>

          <button onClick={handleAddMeal} style={s.submitBtn}>PUBLISH MEAL</button>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW LIST */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Live Menu List</h3>
          <div style={s.listArea}>
            {loading ? <p>Loading Firebase data...</p> : meals.map(meal => (
              <div key={meal.id} style={s.mealRow}>
                {/* MATCHING YOUR FIREBASE FIELD 'imageUrl' */}
                <img src={getImgUrl(meal.imageUrl)} alt="live-dish" style={s.listImg} />
                <div style={s.mealInfo}>
                  <h4 style={s.mealName}>{meal.name}</h4>
                  <p style={s.mealPrice}>KES {meal.price} • {meal.availableQuantity} Qty • <span style={{color: '#888', fontSize: '10px'}}>{meal.imageUrl || "No Image String"}</span></p>
                </div>
                <button onClick={() => handleDelete(meal.id)} style={s.delBtn}><FaTrash /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: '40px' },
  headerContent: { display: 'flex', alignItems: 'center', gap: '30px' },
  backBtn: { padding: '10px 20px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  title: { margin: 0, fontSize: '2.2rem', fontWeight: '900' },
  mainGrid: { display: 'grid', gridTemplateColumns: '450px 1fr', gap: '35px' },
  card: { background: 'white', padding: '30px', borderRadius: '28px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, marginBottom: '25px', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' },
  label: { fontSize: '0.8rem', fontWeight: 'bold', color: '#555', marginBottom: '8px', display: 'block' },
  inputBox: { display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '0 15px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #eee' },
  icon: { color: '#bbb', marginRight: '12px' },
  input: { border: 'none', background: 'transparent', padding: '16px 0', width: '100%', outline: 'none', fontSize: '1rem' },
  assetPicker: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxHeight: '250px', overflowY: 'auto', padding: '10px', background: '#fcfcfc', borderRadius: '14px', border: '1px solid #eee', marginBottom: '25px' },
  assetCard: { cursor: 'pointer', borderRadius: '12px', border: '2px solid transparent', transition: '0.2s', background: '#fff', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  assetImg: { width: '100%', height: '65px', objectFit: 'cover' },
  assetText: { fontSize: '0.6rem', padding: '5px', textAlign: 'center', display: 'block', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden' },
  submitBtn: { width: '100%', padding: '20px', borderRadius: '18px', border: 'none', background: '#111', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' },
  listArea: { maxHeight: '650px', overflowY: 'auto' },
  mealRow: { display: 'flex', alignItems: 'center', padding: '18px', borderRadius: '22px', border: '1px solid #f8f8f8', marginBottom: '15px', background: '#fff' },
  listImg: { width: '75px', height: '75px', borderRadius: '18px', objectFit: 'cover', marginRight: '20px' },
  mealInfo: { flex: 1 },
  mealName: { margin: 0, fontSize: '1.2rem', fontWeight: '800' },
  mealPrice: { margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' },
  delBtn: { background: '#fff0f0', border: 'none', color: '#e31837', cursor: 'pointer', borderRadius: '12px', padding: '12px' }
};

export default MealsAdmin;