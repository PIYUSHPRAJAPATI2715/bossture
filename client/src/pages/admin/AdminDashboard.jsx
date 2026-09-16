import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, Car, Package, Users, MessageSquare, Plus, Trash2, Edit, CheckCircle, 
  XCircle, Clock, ShieldCheck, DollarSign, Search, RefreshCw, Upload, Link as LinkIcon, 
  Eye, LogOut, Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carImageType, setCarImageType] = useState('upload'); // 'upload' or 'url'
  const [uploadingCarImage, setUploadingCarImage] = useState(false);
  const [carForm, setCarForm] = useState({
    name: '', type: 'Sedan', capacity: '4+1 Seater', price_per_km: 13, base_price: 2500, image: '/images/fleet-sedan.jpg', specs: 'Air Conditioned, Clean Seats'
  });

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageImageType, setPackageImageType] = useState('upload'); // 'upload' or 'url'
  const [uploadingPackageImage, setUploadingPackageImage] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: '', category: 'Spiritual', duration: '2 Days / 1 Night', price: 0, badge: 'Special Yatra', image: '/images/package-3jyotirlinga.jpg', description: '', highlights: 'VIP Darshan, Doorstep Pickup, Luxury AC'
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadAllData();
  }, [isAdmin, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sRes, bRes, cRes, pRes, uRes, iRes] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/bookings'),
        axios.get('/api/cars'),
        axios.get('/api/packages'),
        axios.get('/api/users'),
        axios.get('/api/contact')
      ]);

      setStats(sRes.data);
      setBookings(bRes.data);
      setCars(cRes.data);
      setPackages(pRes.data);
      setUsersList(uRes.data);
      setInquiries(iRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- FILE UPLOAD HANDLERS WITH CANVAS COMPRESSION & BACKEND UPLOAD ---
  const compressAndProcessImage = async (file, onComplete) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      if (res.data && (res.data.url || res.data.filename)) {
        const finalUrl = res.data.url || `/images/${res.data.filename}`;
        onComplete(finalUrl);
        return;
      }
    } catch (uploadErr) {
      console.warn('Server endpoint upload fallback to canvas compression:', uploadErr);
    }

    // Fallback: Client-Side HTML5 Canvas Compression to ~80KB JPEG
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
        onComplete(compressedUrl);
      };
    };
  };

  const handleCarFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCarImage(true);
    compressAndProcessImage(file, (imgUrl) => {
      setCarForm((prev) => ({ ...prev, image: imgUrl }));
      setUploadingCarImage(false);
    });
  };

  const handlePackageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPackageImage(true);
    compressAndProcessImage(file, (imgUrl) => {
      setPackageForm((prev) => ({ ...prev, image: imgUrl }));
      setUploadingPackageImage(false);
    });
  };

  // --- BOOKING ACTIONS ---
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  // --- CAR ACTIONS ---
  const handleSaveCar = async (e) => {
    e.preventDefault();
    const specsArray = typeof carForm.specs === 'string' 
      ? carForm.specs.split(',').map(s => s.trim()).filter(Boolean)
      : carForm.specs;
      
    const payload = { ...carForm, specs: specsArray };

    try {
      if (editingCar) {
        await axios.put(`/api/cars/${editingCar.id}`, payload);
      } else {
        await axios.post('/api/cars', payload);
      }
      setCarModalOpen(false);
      setEditingCar(null);
      loadAllData();
    } catch (err) {
      console.error('Save car error:', err);
      alert(err.response?.data?.error || 'Failed to save car details');
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Delete this vehicle from fleet?')) return;
    try {
      await axios.delete(`/api/cars/${id}`);
      setCars(cars.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete car');
    }
  };

  // --- PACKAGE ACTIONS ---
  const handleSavePackage = async (e) => {
    e.preventDefault();
    const highlightsArray = typeof packageForm.highlights === 'string'
      ? packageForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : packageForm.highlights;

    const payload = { ...packageForm, highlights: highlightsArray };

    try {
      if (editingPackage) {
        await axios.put(`/api/packages/${editingPackage.id}`, payload);
      } else {
        await axios.post('/api/packages', payload);
      }
      setPackageModalOpen(false);
      setEditingPackage(null);
      loadAllData();
    } catch (err) {
      console.error('Save package error:', err);
      alert(err.response?.data?.error || 'Failed to save package');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await axios.delete(`/api/packages/${id}`);
      setPackages(packages.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  // --- USER ACTIONS ---
  const handleToggleUserRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/users/${id}/role`, { role: newRole });
      setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsersList(usersList.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // --- INQUIRY ACTIONS ---
  const handleDeleteInquiry = async (id) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
      
      {/* Dedicated Admin Header Topbar */}
      <header className="bg-slate-900 border-b border-amber-500/30 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-xl text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center font-serif text-lg shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-xl font-bold text-white tracking-wider leading-tight">
                BOSS <span className="text-amber-400 font-extrabold">ADMIN</span>
              </h1>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                ● Live System Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-amber-500 hover:text-slate-950 transition shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View Public Site</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-800 pl-2 sm:pl-4">
              <span className="text-xs font-bold text-slate-200 hidden md:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-white font-extrabold bg-rose-50 hover:bg-rose-600 px-3 py-1.5 rounded-xl border border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Sub Header & Refresh */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">System Dashboard</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Manage real-time bookings, fleet cars, tour packages, image uploads, and user accounts
            </p>
          </div>

          <button
            onClick={loadAllData}
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-800 hover:border-amber-500 hover:text-amber-700 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Refresh Live Data
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Clock },
            { id: 'fleet', label: `Fleet Cars (${cars.length})`, icon: Car },
            { id: 'packages', label: `Tour Packages (${packages.length})`, icon: Package },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 shadow-md scale-105 border border-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-amber-700 font-serif text-lg font-bold">Loading Admin Dashboard Data...</div>
        ) : (
          <div>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Total Revenue</span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-600">₹{stats.total_revenue?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Total Bookings</span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total_bookings}</span>
                    <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200 inline-block mt-2">
                      {stats.pending_bookings} Pending
                    </span>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Active Vehicles</span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total_cars}</span>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Customer Leads</span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.new_inquiries}</span>
                  </div>
                </div>

                {/* Recent Bookings Quick Table */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-serif text-lg sm:text-xl font-extrabold text-slate-900 mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-700 min-w-[600px]">
                      <thead className="bg-slate-900 text-amber-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Ref Code</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Route</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Vehicle</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-mono font-bold text-amber-700 bg-amber-50 rounded px-2">{b.booking_code}</td>
                            <td className="p-3.5 font-bold text-slate-900">{b.customer_name}<br/><span className="text-[10px] text-slate-500">{b.phone}</span></td>
                            <td className="p-3.5 text-slate-900 font-semibold">{b.pickup_location} &rarr; {b.drop_location}</td>
                            <td className="p-3.5">{b.pickup_date}</td>
                            <td className="p-3.5">{b.vehicle_name}</td>
                            <td className="p-3.5 font-bold text-slate-900">{b.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
                <h3 className="font-serif text-xl font-extrabold text-slate-900 mb-4">All Trip Bookings</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[750px]">
                    <thead className="bg-slate-900 text-amber-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Ref Code</th>
                        <th className="p-3.5">Customer Info</th>
                        <th className="p-3.5">Trip Details</th>
                        <th className="p-3.5">Date / Time</th>
                        <th className="p-3.5">Fare</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-amber-700 bg-amber-50 rounded px-2">{b.booking_code}</td>
                          <td className="p-3.5">
                            <strong className="text-slate-900 block font-bold">{b.customer_name}</strong>
                            <span className="text-slate-500">{b.phone}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-slate-900 font-bold block">{b.pickup_location} &rarr; {b.drop_location}</span>
                            <span className="text-slate-500">{b.vehicle_name}</span>
                          </td>
                          <td className="p-3.5">{b.pickup_date}<br/><span className="text-slate-500">{b.pickup_time}</span></td>
                          <td className="p-3.5 font-serif text-sm font-extrabold text-amber-600">₹{b.total_amount?.toLocaleString('en-IN')}</td>
                          <td className="p-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-2.5 py-1 font-bold focus:outline-none focus:border-amber-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="text-rose-600 hover:text-white hover:bg-rose-600 p-2 rounded-lg transition"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. FLEET CARS TAB */}
            {activeTab === 'fleet' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xl font-extrabold text-slate-900">Fleet Inventory ({cars.length})</h3>
                  <button
                    onClick={() => {
                      setEditingCar(null);
                      setCarForm({ name: '', type: 'Sedan', capacity: '4+1 Seater', price_per_km: 13, base_price: 2500, image: '/images/fleet-sedan.jpg', specs: 'Air Conditioned, Clean Seats' });
                      setCarModalOpen(true);
                    }}
                    className="gold-btn px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {cars.map(c => (
                    <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between transition">
                      <div>
                        <img 
                          src={getImageUrl(c.image)} 
                          onError={handleImageError} 
                          alt={c.name} 
                          className="w-full h-44 object-cover rounded-2xl mb-4 bg-slate-100" 
                        />
                        <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">{c.name}</h4>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-2">
                          {c.type} • {c.capacity}
                        </span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-serif text-2xl font-extrabold text-amber-600">₹{c.price_per_km}</span>
                          <span className="text-xs text-slate-500 font-medium">/ km (Base: ₹{c.base_price})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                        <button
                          onClick={() => {
                            setEditingCar(c);
                            setCarForm({ ...c, specs: c.specs ? (Array.isArray(c.specs) ? c.specs.join(', ') : c.specs) : '' });
                            setCarModalOpen(true);
                          }}
                          className="text-xs bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white border border-slate-300 px-3.5 py-1.5 rounded-xl font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCar(c.id)}
                          className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 px-3.5 py-1.5 rounded-xl font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PACKAGES TAB */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xl font-extrabold text-slate-900">Tour Packages ({packages.length})</h3>
                  <button
                    onClick={() => {
                      setEditingPackage(null);
                      setPackageForm({ title: '', category: 'Spiritual', duration: '2 Days / 1 Night', price: 0, badge: 'Special Yatra', image: '/images/package-3jyotirlinga.jpg', description: '', highlights: 'VIP Darshan, AC Vehicle' });
                      setPackageModalOpen(true);
                    }}
                    className="gold-btn px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Package
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {packages.map(p => (
                    <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between transition">
                      <div>
                        <div className="w-full bg-slate-900 p-2 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                          <img 
                            src={getImageUrl(p.image)} 
                            onError={handleImageError} 
                            alt={p.title} 
                            className="w-full h-auto max-h-48 object-contain rounded-xl" 
                          />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-slate-900 mb-1 leading-snug">{p.title}</h4>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-2">
                          {p.category} • {p.duration}
                        </span>
                        {p.badge && (
                          <span className="block text-[11px] font-extrabold text-slate-700 mt-1">
                            Badge: <strong className="text-amber-600">{p.badge}</strong>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                        <button
                          onClick={() => {
                            setEditingPackage(p);
                            setPackageForm({ ...p, highlights: p.highlights ? (Array.isArray(p.highlights) ? p.highlights.join(', ') : p.highlights) : '' });
                            setPackageModalOpen(true);
                          }}
                          className="text-xs bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white border border-slate-300 px-3.5 py-1.5 rounded-xl font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(p.id)}
                          className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 px-3.5 py-1.5 rounded-xl font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. USERS TAB */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
                <h3 className="font-serif text-xl font-extrabold text-slate-900 mb-4">User Accounts</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[600px]">
                    <thead className="bg-slate-900 text-amber-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">User Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {usersList.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-slate-500">#{u.id}</td>
                          <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                          <td className="p-3.5">{u.email}</td>
                          <td className="p-3.5">{u.phone || 'N/A'}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              className="text-xs text-amber-700 hover:text-amber-800 font-bold"
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
                <h3 className="font-serif text-xl font-extrabold text-slate-900 mb-4">Customer Contact Inquiries</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                    <thead className="bg-slate-900 text-amber-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Service</th>
                        <th className="p-3.5">Message</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {inquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-slate-50">
                          <td className="p-3.5 text-slate-500 font-semibold">{inq.created_at?.split('T')[0] || 'Today'}</td>
                          <td className="p-3.5 font-bold text-slate-900">{inq.name}</td>
                          <td className="p-3.5 text-amber-700 font-bold">{inq.phone}</td>
                          <td className="p-3.5">{inq.service}</td>
                          <td className="p-3.5 text-slate-600 max-w-xs">{inq.message}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-rose-600 hover:text-rose-700 font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* CAR MODAL */}
        {carModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900 shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingCar ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h3>

              <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={carForm.name}
                    onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                    required
                    placeholder="e.g. Toyota Innova Crysta"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Type</label>
                    <input
                      type="text"
                      value={carForm.type}
                      onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
                      required
                      placeholder="e.g. Premium SUV"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Capacity</label>
                    <input
                      type="text"
                      value={carForm.capacity}
                      onChange={(e) => setCarForm({ ...carForm, capacity: e.target.value })}
                      required
                      placeholder="e.g. 7 Seater AC"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Price per KM (₹)</label>
                    <input
                      type="number"
                      value={carForm.price_per_km}
                      onChange={(e) => setCarForm({ ...carForm, price_per_km: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={carForm.base_price}
                      onChange={(e) => setCarForm({ ...carForm, base_price: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* DUAL IMAGE OPTIONS: Upload File vs Paste URL */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-amber-700 font-extrabold flex items-center gap-1.5 uppercase">
                      <ImageIcon className="w-4 h-4 text-amber-600" /> Vehicle Image Source
                    </label>
                    <div className="flex gap-1.5 bg-slate-200 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setCarImageType('upload')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          carImageType === 'upload' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        <Upload className="w-3 h-3" /> Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarImageType('url')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          carImageType === 'url' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" /> URL
                      </button>
                    </div>
                  </div>

                  {carImageType === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCarFileUpload}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer"
                      />
                      {uploadingCarImage && <p className="text-[11px] text-amber-600 font-bold mt-1">Processing image file...</p>}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={carForm.image}
                        onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                        required
                        placeholder="Paste image URL (https://... or /images/...)"
                        className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {carForm.image && (
                    <div className="flex items-center gap-3 pt-2">
                      <img 
                        src={getImageUrl(carForm.image)} 
                        onError={handleImageError} 
                        alt="Preview" 
                        className="w-16 h-12 object-cover rounded-lg border border-slate-300 bg-white" 
                      />
                      <span className="text-[11px] text-slate-500 font-bold truncate max-w-xs">Selected Image Loaded</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold uppercase mb-1">Specifications (Comma separated)</label>
                  <input
                    type="text"
                    value={carForm.specs}
                    onChange={(e) => setCarForm({ ...carForm, specs: e.target.value })}
                    placeholder="e.g. Dual AC, Pushback Seats, Bluetooth Audio"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" className="gold-btn w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow">
                    Save Vehicle
                  </button>
                  <button type="button" onClick={() => setCarModalOpen(false)} className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 py-3 rounded-xl text-xs font-extrabold uppercase">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PACKAGE MODAL */}
        {packageModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900 shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingPackage ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>

              <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-extrabold uppercase mb-1">Package Title</label>
                  <input
                    type="text"
                    value={packageForm.title}
                    onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                    required
                    placeholder="e.g. Shirdi Spiritual Yatra"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Category</label>
                    <input
                      type="text"
                      value={packageForm.category}
                      onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
                      required
                      placeholder="e.g. Spiritual"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Duration</label>
                    <input
                      type="text"
                      value={packageForm.duration}
                      onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                      required
                      placeholder="e.g. 2 Days / 1 Night"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Package Price (₹)</label>
                    <input
                      type="number"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-extrabold uppercase mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={packageForm.badge}
                      onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                      placeholder="e.g. Best Seller"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* DUAL IMAGE OPTIONS */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-amber-700 font-extrabold flex items-center gap-1.5 uppercase">
                      <ImageIcon className="w-4 h-4 text-amber-600" /> Package Image Source
                    </label>
                    <div className="flex gap-1.5 bg-slate-200 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setPackageImageType('upload')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          packageImageType === 'upload' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        <Upload className="w-3 h-3" /> Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setPackageImageType('url')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          packageImageType === 'url' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" /> URL
                      </button>
                    </div>
                  </div>

                  {packageImageType === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePackageFileUpload}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer"
                      />
                      {uploadingPackageImage && <p className="text-[11px] text-amber-600 font-bold mt-1">Processing image file...</p>}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={packageForm.image}
                        onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                        required
                        placeholder="Paste image URL (https://... or /images/...)"
                        className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {packageForm.image && (
                    <div className="flex items-center gap-3 pt-2">
                      <img 
                        src={getImageUrl(packageForm.image)} 
                        onError={handleImageError} 
                        alt="Preview" 
                        className="w-16 h-12 object-cover rounded-lg border border-slate-300 bg-white" 
                      />
                      <span className="text-[11px] text-slate-500 font-bold truncate max-w-xs">Selected Image Loaded</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold uppercase mb-1">Description</label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    rows={2}
                    placeholder="Brief package summary..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold uppercase mb-1">Highlights (Comma separated)</label>
                  <input
                    type="text"
                    value={packageForm.highlights}
                    onChange={(e) => setPackageForm({ ...packageForm, highlights: e.target.value })}
                    placeholder="e.g. VIP Darshan, Doorstep Pickup, Luxury AC"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" className="gold-btn w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow">
                    Save Package
                  </button>
                  <button type="button" onClick={() => setPackageModalOpen(false)} className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 py-3 rounded-xl text-xs font-extrabold uppercase">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
