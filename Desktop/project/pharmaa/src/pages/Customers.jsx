import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from "../components/ThemeContext";
import MedicalParticles from "../components/MedicalParticles"; 
import TiltCard from "./TiltCard"; 
import { Search, Filter, MessageCircle, Phone, Mail, MapPin, Calendar, DollarSign, ShoppingCart, User, Star, TrendingUp, MoreVertical } from 'lucide-react';

// --- Helper Components & Hooks ---
const useScript = (src) => {
  const [status, setStatus] = useState(src ? "loading" : "idle");
  useEffect(() => {
    if (!src) { setStatus("idle"); return; }
    let script = document.querySelector(`script[src="${src}"]`);
    
    const setStateFromEvent = (event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);
      
      const setAttributeFromEvent = (event) => {
        script.setAttribute("data-status", event.type === "load" ? "ready" : "error");
      };
      
      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    } else {
      setStatus(script.getAttribute("data-status") || 'ready');
    }
    
    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);
    
    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]);
  return status;
};

const MapComponent = ({ location, zoom = 15 }) => {
  const mapRef = useRef(null);
  const leafletStatus = useScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  
  useEffect(() => {
    if (leafletStatus !== 'ready' || !location || !mapRef.current || !window.L) return;
    
    const map = window.L.map(mapRef.current).setView([location.lat, location.lng], zoom);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    window.L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup('Customer Location')
      .openPopup();

    setTimeout(() => map.invalidateSize(), 100);
    
    return () => map.remove();
  }, [leafletStatus, location, zoom]);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const leafletCss = document.createElement('link');
      leafletCss.id = 'leaflet-css';
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);
    }
  }, []);
  
  if (leafletStatus === 'loading') return <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg"><p>Loading map...</p></div>;
  if (leafletStatus === 'error') return <div className="flex items-center justify-center h-full bg-red-100 text-red-700 rounded-lg"><p>Error loading map.</p></div>;
  
  return <div ref={mapRef} style={{ height: '200px', width: '100%', borderRadius: '8px' }} />;
};

const CustomerProfileModal = ({ isOpen, onClose, customer, onSendMessage, theme }) => {
  if (!isOpen || !customer) return null;

  const cardClasses = `relative rounded-xl p-6 shadow-lg ${
    theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-gray-900"
      }`}>
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold">Customer Profile</h3>
          <button className="text-2xl hover:opacity-70" onClick={onClose}>✕</button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex items-center gap-4">
              <img src={customer.avatarUrl} alt={customer.name} className="w-24 h-24 rounded-full border-4 border-indigo-500" />
              <div>
                <h4 className="text-2xl font-bold">{customer.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined: {customer.joinDate}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {customer.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.loyaltyTier === 'Gold' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : customer.loyaltyTier === 'Silver'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {customer.loyaltyTier}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold">${customer.totalSpent.toFixed(2)}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Total Spent</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold">{customer.totalOrders}</div>
                <div className="text-xs text-green-600 dark:text-green-400">Total Orders</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold">{customer.avgRating}/5</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Avg Rating</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                <div className="text-lg font-bold">{customer.visitFrequency}</div>
                <div className="text-xs text-orange-600 dark:text-orange-400">Visits/Month</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={cardClasses}>
              <h5 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{customer.address}</span>
                </div>
              </div>
            </div>

            <div className={cardClasses}>
              <h5 className="font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Activity
              </h5>
              <div className="space-y-2">
                <p><strong>Last Order:</strong> {customer.lastOrderDate}</p>
                <p><strong>Last Activity:</strong> {customer.lastActivity}</p>
                <p><strong>Preferred Category:</strong> {customer.preferredCategory}</p>
                <p><strong>Average Order Value:</strong> ${customer.avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {customer.location && (
            <div className={`mt-6 ${cardClasses}`}>
              <h5 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h5>
              <MapComponent location={customer.location} />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onSendMessage(customer)}
              className="flex items-center gap-2 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
            >
              <MessageCircle className="w-4 h-4" />
              Send Message
            </button>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <Phone className="w-4 h-4" />
              Call Customer
            </button>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Customers Component ---
function CustomersComponent() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoyalty, setFilterLoyalty] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const customers = useMemo(() => [
    {
      id: 1,
      name: "Alice Brown",
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      joinDate: "2025-01-15",
      totalOrders: 12,
      totalSpent: 450.75,
      lastActivity: "2 days ago",
      lastOrderDate: "2025-09-10",
      email: "alice@example.com",
      phone: "+251 91 123 4567",
      address: "123 Main St, Addis Ababa",
      status: "Active",
      loyaltyTier: "Gold",
      avgRating: 4.8,
      visitFrequency: 4,
      preferredCategory: "Prescription",
      avgOrderValue: 37.56,
      location: { lat: 9.0054, lng: 38.7636 }
    },
    {
      id: 2,
      name: "Bob Smith",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      joinDate: "2025-03-22",
      totalOrders: 8,
      totalSpent: 320.50,
      lastActivity: "1 day ago",
      lastOrderDate: "2025-09-12",
      email: "bob@example.com",
      phone: "+251 92 234 5678",
      address: "456 Market St, Addis Ababa",
      status: "Active",
      loyaltyTier: "Silver",
      avgRating: 4.5,
      visitFrequency: 3,
      preferredCategory: "OTC Medicines",
      avgOrderValue: 40.06,
      location: { lat: 9.0154, lng: 38.7736 }
    },
    {
      id: 3,
      name: "Carol Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      joinDate: "2024-11-30",
      totalOrders: 25,
      totalSpent: 890.25,
      lastActivity: "1 week ago",
      lastOrderDate: "2025-09-05",
      email: "carol@example.com",
      phone: "+251 93 345 6789",
      address: "789 Health Ave, Addis Ababa",
      status: "Active",
      loyaltyTier: "Gold",
      avgRating: 4.9,
      visitFrequency: 6,
      preferredCategory: "Supplements",
      avgOrderValue: 35.61,
      location: { lat: 9.0254, lng: 38.7836 }
    },
    {
      id: 4,
      name: "David Wilson",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      joinDate: "2025-06-10",
      totalOrders: 3,
      totalSpent: 85.00,
      lastActivity: "3 weeks ago",
      lastOrderDate: "2025-08-20",
      email: "david@example.com",
      phone: "+251 94 456 7890",
      address: "321 Pharmacy Rd, Addis Ababa",
      status: "Inactive",
      loyaltyTier: "Bronze",
      avgRating: 4.2,
      visitFrequency: 1,
      preferredCategory: "First Aid",
      avgOrderValue: 28.33,
      location: { lat: 9.0354, lng: 38.7936 }
    }
  ], []);

  const sortedAndFilteredCustomers = useMemo(() => {
    return customers
      .filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((c) => filterStatus === "all" || c.status === filterStatus)
      .filter((c) => filterLoyalty === "all" || c.loyaltyTier === filterLoyalty)
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "joinDate") return new Date(b.joinDate) - new Date(a.joinDate);
        if (sortKey === "totalSpent") return b.totalSpent - a.totalSpent;
        if (sortKey === "totalOrders") return b.totalOrders - a.totalOrders;
        return 0;
      });
  }, [customers, searchTerm, sortKey, filterStatus, filterLoyalty]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);
    
    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      avgOrderValue: avgOrderValue || 0
    };
  }, [customers]);

  const handleViewProfile = (customer) => {
    setViewingCustomer(customer);
    setModalOpen(true);
  };

  const handleSendMessage = (customer) => {
    const subject = "Message from Athanex Pharmacy";
    const body = `Dear ${customer.name},\n\nWe hope this message finds you well.\n\nBest regards,\nAthanex Pharmacy Team`;
    window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const getLoyaltyColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'text-yellow-600 dark:text-yellow-400';
      case 'Silver': return 'text-gray-600 dark:text-gray-400';
      case 'Bronze': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`relative flex flex-col h-screen p-6 ${theme === 'dark' ? 'text-gray-200 bg-gray-900' : 'text-gray-800 bg-gray-50'}`}>
      <MedicalParticles variant="default" />
      
      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your pharmacy customers and build lasting relationships
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-blue-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Total Customers
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-green-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Active Customers
            </h3>
            <p className="text-3xl font-bold text-green-500 mt-2">{stats.activeCustomers}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-purple-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-purple-500 mt-2">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-orange-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              Avg Order Value
            </h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">${stats.avgOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={`relative z-10 p-6 rounded-xl shadow-md mb-6 ${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'light' 
                  ? 'border-gray-300 bg-white placeholder-gray-500' 
                  : 'border-gray-600 bg-slate-700 placeholder-gray-400 text-white'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select 
              value={filterLoyalty} 
              onChange={(e) => setFilterLoyalty(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
              }`}
            >
              <option value="all">All Tiers</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>

            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
              }`}
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalOrders">Sort by Total Orders</option>
            </select>

            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${
                  viewMode === "grid" 
                    ? 'bg-indigo-600 text-white' 
                    : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${
                  viewMode === "list" 
                    ? 'bg-indigo-600 text-white' 
                    : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid/List */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2">
        {viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
            {sortedAndFilteredCustomers.map((customer) => (
              <TiltCard
                key={customer.id}
                onClick={() => handleViewProfile(customer)}
                className={`rounded-xl p-5 shadow-lg border transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={customer.avatarUrl} alt={customer.name} className="w-16 h-16 rounded-full border-2 border-indigo-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{customer.name}</h2>
                      <Star className={`w-4 h-4 ${getLoyaltyColor(customer.loyaltyTier)}`} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Joined: {customer.joinDate}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {customer.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.loyaltyTier === 'Gold' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : customer.loyaltyTier === 'Silver'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {customer.loyaltyTier}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      Orders:
                    </span>
                    <span className="font-semibold">{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Total Spent:
                    </span>
                    <span className="font-semibold">${customer.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Rating:
                    </span>
                    <span className="font-semibold">{customer.avgRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Activity:</span>
                    <span className="font-semibold">{customer.lastActivity}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage(customer);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </TiltCard>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {sortedAndFilteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => handleViewProfile(customer)}
                className={`p-4 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img src={customer.avatarUrl} alt={customer.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                    <div>
                      <div className="font-semibold">{customer.totalOrders} orders</div>
                      <div className="text-sm text-gray-500">${customer.totalSpent.toFixed(2)} spent</div>
                    </div>
                    <div>
                      <div className="text-sm">Status: {customer.status}</div>
                      <div className="text-sm text-gray-500">Tier: {customer.loyaltyTier}</div>
                    </div>
                    <div className="text-sm">
                      <div>Last: {customer.lastActivity}</div>
                      <div>Rating: {customer.avgRating}/5</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(customer);
                    }}
                    className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {sortedAndFilteredCustomers.length === 0 && (
          <div className={`text-center py-12 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No customers found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <CustomerProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={viewingCustomer}
        onSendMessage={handleSendMessage}
        theme={theme}
      />
    </div>
  );
}

export default CustomersComponent;