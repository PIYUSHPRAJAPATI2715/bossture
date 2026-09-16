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
    name: '', type: 'Sedan', capacity: '4+1 Seater', price_per_km: 12, base_price: 2500, image: '/images/fleet-sedan.jpg', specs: 'Air Conditioned, Clean Seat Cover, Luggage Space'
  });

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageImageType, setPackageImageType] = useState('upload'); // 'upload' or 'url'
  const [uploadingPackageImage, setUploadingPackageImage] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: '', category: 'Spiritual', duration: '2 Days / 1 Night', price: 5000, badge: 'Best Seller', image: '/images/package-1.jpg', description: '', highlights: 'VIP Darshan, Doorstep Pickup, Luxury AC'
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

  // --- FILE UPLOAD HANDLERS (Base64 + Server Upload Fallback) ---
  const handleCarFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCarImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCarForm({ ...carForm, image: reader.result });
      setUploadingCarImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePackageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPackageImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPackageForm({ ...packageForm, image: reader.result });
      setUploadingPackageImage(false);
    };
    reader.readAsDataURL(file);
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
    <div className="min-h-screen bg-dark-bg text-gray-200">
      
      {/* Dedicated Admin Header Topbar */}
      <header className="bg-dark-card border-b border-gold/30 sticky top-0 z-40 px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-black font-extrabold flex items-center justify-center font-serif text-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-white tracking-wider">
                BOSS <span className="text-gold">ADMIN PANEL</span>
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest block -mt-1">
                ● Dynamic Live System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gold bg-gold/10 px-4 py-2 rounded-xl border border-gold/30 hover:bg-gold hover:text-black transition"
            >
              <Eye className="w-4 h-4" /> View Public Site
            </Link>

            <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
              <span className="text-xs font-medium text-white hidden md:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-500/30 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sub Header & Refresh */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">System Dashboard</h2>
            <p className="text-xs text-gray-400">Manage real-time bookings, fleet cars, tour packages, image uploads, and user accounts</p>
          </div>

          <button
            onClick={loadAllData}
            className="flex items-center gap-2 bg-dark-card border border-gold/30 text-gold px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gold hover:text-black transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Clock },
            { id: 'fleet', label: `Fleet Cars (${cars.length})`, icon: Car },
            { id: 'packages', label: `Tour Packages (${packages.length})`, icon: Package },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'gold-btn shadow-lg'
                    : 'bg-dark-card text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gold text-lg">Loading Admin Dashboard...</div>
        ) : (
          <div>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-gold/30">
                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Total Revenue</span>
                    <span className="font-serif text-3xl font-bold text-gold">₹{stats.total_revenue?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-gold/30">
                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Total Bookings</span>
                    <span className="font-serif text-3xl font-bold text-white">{stats.total_bookings}</span>
                    <span className="text-[10px] text-amber-400 block mt-1">{stats.pending_bookings} Pending</span>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-gold/30">
                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Active Fleet Vehicles</span>
                    <span className="font-serif text-3xl font-bold text-white">{stats.total_cars}</span>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-gold/30">
                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Customer Leads</span>
                    <span className="font-serif text-3xl font-bold text-white">{stats.new_inquiries}</span>
                  </div>
                </div>

                {/* Recent Bookings Quick Table */}
                <div className="glass-card p-6 rounded-2xl border border-gold/20">
                  <h3 className="font-serif text-xl font-bold text-white mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-dark-card uppercase text-gold border-b border-gray-800">
                        <tr>
                          <th className="p-3">Ref Code</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Route</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Vehicle</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="border-b border-gray-800/50 hover:bg-dark-card/50">
                            <td className="p-3 font-mono font-bold text-gold">{b.booking_code}</td>
                            <td className="p-3 font-medium text-white">{b.customer_name}<br/><span className="text-[10px] text-gray-400">{b.phone}</span></td>
                            <td className="p-3">{b.pickup_location} &rarr; {b.drop_location}</td>
                            <td className="p-3">{b.pickup_date}</td>
                            <td className="p-3">{b.vehicle_name}</td>
                            <td className="p-3 font-semibold">{b.status}</td>
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
              <div className="glass-card p-6 rounded-2xl border border-gold/20 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-dark-card uppercase text-gold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Ref Code</th>
                      <th className="p-3">Customer Info</th>
                      <th className="p-3">Trip Details</th>
                      <th className="p-3">Date / Time</th>
                      <th className="p-3">Fare</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-gray-800/50 hover:bg-dark-card/50">
                        <td className="p-3 font-mono font-bold text-gold">{b.booking_code}</td>
                        <td className="p-3">
                          <strong className="text-white block">{b.customer_name}</strong>
                          <span className="text-gray-400">{b.phone}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-white font-medium">{b.pickup_location} &rarr; {b.drop_location}</span>
                          <span className="block text-gray-400">{b.vehicle_name}</span>
                        </td>
                        <td className="p-3">{b.pickup_date}<br/><span className="text-gray-400">{b.pickup_time}</span></td>
                        <td className="p-3 font-bold text-gold">₹{b.total_amount}</td>
                        <td className="p-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="bg-dark-card border border-gray-700 text-xs rounded px-2 py-1 font-semibold text-white focus:outline-none focus:border-gold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="text-red-400 hover:text-red-300 p-1"
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
            )}

            {/* 3. FLEET CARS TAB */}
            {activeTab === 'fleet' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xl font-bold text-white">Fleet Inventory</h3>
                  <button
                    onClick={() => {
                      setEditingCar(null);
                      setCarForm({ name: '', type: 'Sedan', capacity: '4+1 Seater', price_per_km: 12, base_price: 2500, image: '/images/fleet-sedan.jpg', specs: 'Air Conditioned, Clean Seats' });
                      setCarModalOpen(true);
                    }}
                    className="gold-btn px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Vehicle
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map(c => (
                    <div key={c.id} className="glass-card p-5 rounded-2xl border border-gold/20 flex flex-col justify-between">
                      <div>
                        <img 
                          src={getImageUrl(c.image)} 
                          onError={handleImageError} 
                          alt={c.name} 
                          className="w-full h-40 object-cover rounded-xl mb-4 bg-dark-card" 
                        />
                        <h4 className="font-serif text-lg font-bold text-white">{c.name}</h4>
                        <p className="text-xs text-gold font-semibold">{c.type} &bull; {c.capacity}</p>
                        <p className="text-xs text-gray-400 mt-2">₹{c.price_per_km}/km &bull; Base Fare: ₹{c.base_price}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-800 mt-4">
                        <button
                          onClick={() => {
                            setEditingCar(c);
                            setCarForm({ ...c, specs: c.specs ? (Array.isArray(c.specs) ? c.specs.join(', ') : c.specs) : '' });
                            setCarModalOpen(true);
                          }}
                          className="text-xs bg-gray-800 hover:bg-gold hover:text-black text-gray-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCar(c.id)}
                          className="text-xs bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white px-3 py-1.5 rounded-lg transition"
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
                  <h3 className="font-serif text-xl font-bold text-white">Tour Packages</h3>
                  <button
                    onClick={() => {
                      setEditingPackage(null);
                      setPackageForm({ title: '', category: 'Spiritual', duration: '2 Days / 1 Night', price: 5000, badge: 'Best Seller', image: '/images/package-1.jpg', description: '', highlights: 'VIP Darshan, AC Vehicle' });
                      setPackageModalOpen(true);
                    }}
                    className="gold-btn px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Tour Package
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map(p => (
                    <div key={p.id} className="glass-card p-5 rounded-2xl border border-gold/20 flex flex-col justify-between">
                      <div>
                        <img 
                          src={getImageUrl(p.image)} 
                          onError={handleImageError} 
                          alt={p.title} 
                          className="w-full h-40 object-cover rounded-xl mb-4 bg-dark-card" 
                        />
                        <h4 className="font-serif text-lg font-bold text-white">{p.title}</h4>
                        <p className="text-xs text-gold font-semibold">{p.category} &bull; {p.duration}</p>
                        <p className="text-sm font-bold text-white mt-1">₹{p.price}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-800 mt-4">
                        <button
                          onClick={() => {
                            setEditingPackage(p);
                            setPackageForm({ ...p, highlights: p.highlights ? (Array.isArray(p.highlights) ? p.highlights.join(', ') : p.highlights) : '' });
                            setPackageModalOpen(true);
                          }}
                          className="text-xs bg-gray-800 hover:bg-gold hover:text-black text-gray-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(p.id)}
                          className="text-xs bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white px-3 py-1.5 rounded-lg transition"
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
              <div className="glass-card p-6 rounded-2xl border border-gold/20 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-dark-card uppercase text-gold border-b border-gray-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id} className="border-b border-gray-800/50 hover:bg-dark-card/50">
                        <td className="p-3 font-mono font-bold text-gray-400">#{u.id}</td>
                        <td className="p-3 font-bold text-white">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.phone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-gray-800 text-gray-300'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            className="text-xs text-gold hover:underline"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="glass-card p-6 rounded-2xl border border-gold/20 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-dark-card uppercase text-gold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Message</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr key={inq.id} className="border-b border-gray-800/50 hover:bg-dark-card/50">
                        <td className="p-3 text-gray-400">{inq.created_at?.split('T')[0] || 'Today'}</td>
                        <td className="p-3 font-bold text-white">{inq.name}</td>
                        <td className="p-3 text-gold font-semibold">{inq.phone}</td>
                        <td className="p-3">{inq.service}</td>
                        <td className="p-3 text-gray-300 max-w-xs">{inq.message}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* CAR MODAL (Dual File Upload & Paste URL) */}
        {carModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-gold/40 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingCar ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h3>

              <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={carForm.name}
                    onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                    required
                    placeholder="e.g. Toyota Innova Crysta"
                    className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Type</label>
                    <input
                      type="text"
                      value={carForm.type}
                      onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
                      required
                      placeholder="e.g. Premium SUV"
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Capacity</label>
                    <input
                      type="text"
                      value={carForm.capacity}
                      onChange={(e) => setCarForm({ ...carForm, capacity: e.target.value })}
                      required
                      placeholder="e.g. 7 Seater AC"
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Price per KM (₹)</label>
                    <input
                      type="number"
                      value={carForm.price_per_km}
                      onChange={(e) => setCarForm({ ...carForm, price_per_km: e.target.value })}
                      required
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={carForm.base_price}
                      onChange={(e) => setCarForm({ ...carForm, base_price: e.target.value })}
                      required
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                </div>

                {/* DUAL IMAGE OPTIONS: Upload File vs Paste URL */}
                <div className="bg-dark-card/90 p-4 rounded-2xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-gold font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Vehicle Image Source
                    </label>
                    <div className="flex gap-2 bg-black p-1 rounded-lg border border-gray-800">
                      <button
                        type="button"
                        onClick={() => setCarImageType('upload')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                          carImageType === 'upload' ? 'gold-btn' : 'text-gray-400'
                        }`}
                      >
                        <Upload className="w-3 h-3" /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarImageType('url')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                          carImageType === 'url' ? 'gold-btn' : 'text-gray-400'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" /> Paste URL
                      </button>
                    </div>
                  </div>

                  {carImageType === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCarFileUpload}
                        className="w-full bg-black border border-gray-700 rounded-xl p-2.5 text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-light cursor-pointer"
                      />
                      {uploadingCarImage && <p className="text-[11px] text-gold mt-1">Processing image file...</p>}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={carForm.image}
                        onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                        required
                        placeholder="Paste image URL (https://... or /images/...)"
                        className="w-full bg-black border border-gray-700 rounded-xl p-3 text-xs text-white focus:border-gold"
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
                        className="w-16 h-12 object-cover rounded-lg border border-gold/30 bg-dark-card" 
                      />
                      <span className="text-[11px] text-gray-400 truncate max-w-xs">Selected Image Loaded</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Specifications (Comma separated)</label>
                  <input
                    type="text"
                    value={carForm.specs}
                    onChange={(e) => setCarForm({ ...carForm, specs: e.target.value })}
                    placeholder="e.g. Dual AC, Pushback Seats, Bluetooth Audio"
                    className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="gold-btn w-full py-3 rounded-xl text-xs font-bold uppercase shadow-lg">
                    Save Vehicle
                  </button>
                  <button type="button" onClick={() => setCarModalOpen(false)} className="w-full bg-dark-card border border-gray-700 text-gray-300 py-3 rounded-xl text-xs font-bold uppercase">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PACKAGE MODAL (Dual File Upload & Paste URL) */}
        {packageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-gold/40 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingPackage ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>

              <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Package Title</label>
                  <input
                    type="text"
                    value={packageForm.title}
                    onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                    required
                    placeholder="e.g. Shirdi Spiritual Yatra"
                    className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={packageForm.category}
                      onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
                      required
                      placeholder="e.g. Spiritual"
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Duration</label>
                    <input
                      type="text"
                      value={packageForm.duration}
                      onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                      required
                      placeholder="e.g. 2 Days / 1 Night"
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Package Price (₹)</label>
                    <input
                      type="number"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      required
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={packageForm.badge}
                      onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                      placeholder="e.g. Best Seller"
                      className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                    />
                  </div>
                </div>

                {/* DUAL IMAGE OPTIONS */}
                <div className="bg-dark-card/90 p-4 rounded-2xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-gold font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Package Image Source
                    </label>
                    <div className="flex gap-2 bg-black p-1 rounded-lg border border-gray-800">
                      <button
                        type="button"
                        onClick={() => setPackageImageType('upload')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                          packageImageType === 'upload' ? 'gold-btn' : 'text-gray-400'
                        }`}
                      >
                        <Upload className="w-3 h-3" /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setPackageImageType('url')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                          packageImageType === 'url' ? 'gold-btn' : 'text-gray-400'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" /> Paste URL
                      </button>
                    </div>
                  </div>

                  {packageImageType === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePackageFileUpload}
                        className="w-full bg-black border border-gray-700 rounded-xl p-2.5 text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-light cursor-pointer"
                      />
                      {uploadingPackageImage && <p className="text-[11px] text-gold mt-1">Processing image file...</p>}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={packageForm.image}
                        onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                        required
                        placeholder="Paste image URL (https://... or /images/...)"
                        className="w-full bg-black border border-gray-700 rounded-xl p-3 text-xs text-white focus:border-gold"
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
                        className="w-16 h-12 object-cover rounded-lg border border-gold/30 bg-dark-card" 
                      />
                      <span className="text-[11px] text-gray-400 truncate max-w-xs">Selected Image Loaded</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Description</label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    rows={2}
                    placeholder="Brief package summary..."
                    className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Highlights (Comma separated)</label>
                  <input
                    type="text"
                    value={packageForm.highlights}
                    onChange={(e) => setPackageForm({ ...packageForm, highlights: e.target.value })}
                    placeholder="e.g. VIP Darshan, Doorstep Pickup, Luxury AC"
                    className="w-full bg-dark-card border border-gray-700 rounded-xl p-3 text-white focus:border-gold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="gold-btn w-full py-3 rounded-xl text-xs font-bold uppercase shadow-lg">
                    Save Package
                  </button>
                  <button type="button" onClick={() => setPackageModalOpen(false)} className="w-full bg-dark-card border border-gray-700 text-gray-300 py-3 rounded-xl text-xs font-bold uppercase">
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
