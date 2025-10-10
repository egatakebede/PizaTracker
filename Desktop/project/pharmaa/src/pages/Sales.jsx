import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from "../components/ThemeContext";
import MedicalParticles from "../components/MedicalParticles";
import TiltCard from "./TiltCard";
import { Search, Filter, Plus, Calendar, DollarSign, User, MapPin, Phone, Mail, Package, Truck, CheckCircle, Clock, XCircle, MoreVertical, Download, Eye, Edit, Trash2, BarChart3, TrendingUp, Users } from 'lucide-react';

// Custom hook to reliably load external scripts like Leaflet.js
const useScript = (src) => {
    const [status, setStatus] = useState(src ? "loading" : "idle");
    useEffect(() => {
        if (!src) { setStatus("idle"); return; }
        let script = document.querySelector(`script[src="${src}"]`);
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
        const setStateFromEvent = (event) => {
            setStatus(event.type === "load" ? "ready" : "error");
        };
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

// Map Component to display patient location
const MapComponent = ({ location }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const leafletStatus = useScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    
    useEffect(() => {
        if (!document.getElementById('leaflet-css')) {
            const leafletCss = document.createElement('link');
            leafletCss.id = 'leaflet-css';
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCss);
        }
    }, []);
    
    useEffect(() => {
        if (leafletStatus === 'ready' && mapContainerRef.current && location && !mapInstanceRef.current && window.L) {
            mapInstanceRef.current = window.L.map(mapContainerRef.current).setView([location.lat, location.lng], 14);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);
            
            window.L.marker([location.lat, location.lng])
                .addTo(mapInstanceRef.current)
                .bindPopup('Patient Location')
                .openPopup();
                
            setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
        }
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location, leafletStatus]);
    
    if (leafletStatus === 'loading') return <div className="flex items-center justify-center h-[250px] bg-gray-200 rounded-lg"><p>Loading map...</p></div>;
    if (leafletStatus === 'error') return <div className="flex items-center justify-center h-[250px] bg-red-100 text-red-700 rounded-lg"><p>Error loading map.</p></div>;
    
    return <div ref={mapContainerRef} style={{ height: '250px', width: '100%', borderRadius: '12px', zIndex: 0 }}></div>;
};

// --- Main Sales Component ---
export default function Sales() {
    const { theme } = useTheme();
    const [orders, setOrders] = useState(() => {
        try {
            const savedOrders = localStorage.getItem('pharmacyPatientOrdersV3');
            if (savedOrders) return JSON.parse(savedOrders);
        } catch (error) { 
            console.error("Failed to parse orders from localStorage", error); 
        }
        return [
            { 
                id: "ORD-101", 
                total: 58.2, 
                date: "2025-08-10", 
                status: "Completed", 
                items: [
                    { name: "Paracetamol 500mg", quantity: 2, price: 2.5 },
                    { name: "Vitamin C 1000mg", quantity: 1, price: 8.5 },
                    { name: "Blood Pressure Monitor", quantity: 1, price: 45.0 }
                ],
                patient: { 
                    name: "John Doe", 
                    age: 45, 
                    gender: "Male", 
                    contact: "+251 91 123 4567", 
                    email: "john.doe@example.com",
                    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        lat: 9.005401, 
                        lng: 38.763611, 
                        address: "Bole, Addis Ababa, Ethiopia" 
                    } 
                } 
            },
            { 
                id: "ORD-102", 
                total: 92.5, 
                date: "2025-08-11", 
                status: "Pending", 
                items: [
                    { name: "Ibuprofen 400mg", quantity: 3, price: 3.0 },
                    { name: "Amoxicillin 250mg", quantity: 2, price: 5.0 },
                    { name: "First Aid Kit", quantity: 1, price: 25.0 }
                ],
                patient: { 
                    name: "Jane Smith", 
                    age: 34, 
                    gender: "Female", 
                    contact: "+251 92 234 5678", 
                    email: "jane.smith@example.com",
                    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        lat: 8.9806, 
                        lng: 38.7578, 
                        address: "Old Airport, Addis Ababa, Ethiopia" 
                    } 
                } 
            },
            { 
                id: "ORD-103", 
                total: 120.0, 
                date: "2025-08-12", 
                status: "Shipped", 
                items: [
                    { name: "Diabetes Test Strips", quantity: 1, price: 35.0 },
                    { name: "Insulin Syringes", quantity: 2, price: 15.0 },
                    { name: "Glucose Meter", quantity: 1, price: 55.0 }
                ],
                patient: { 
                    name: "Alice Johnson", 
                    age: 62, 
                    gender: "Female", 
                    contact: "+251 93 345 6789", 
                    email: "alice.johnson@example.com",
                    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        lat: 9.0215, 
                        lng: 38.7469, 
                        address: "Kazanchis, Addis Ababa, Ethiopia" 
                    } 
                } 
            },
        ];
    });
    
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortKey, setSortKey] = useState("date");
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        localStorage.setItem('pharmacyPatientOrdersV3', JSON.stringify(orders));
    }, [orders]);

    // Statistics
    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'Completed').length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const avgOrderValue = totalRevenue / totalOrders;
        
        return {
            totalOrders,
            completedOrders,
            totalRevenue,
            avgOrderValue: avgOrderValue || 0
        };
    }, [orders]);

    const openModal = (order) => {
        setViewingOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setViewingOrder(null);
    };

    const handleDeleteOrder = (orderId) => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        setDeleteConfirm(null);
        if (viewingOrder?.id === orderId) {
            closeModal();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            case "Shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed": return <CheckCircle className="w-4 h-4" />;
            case "Pending": return <Clock className="w-4 h-4" />;
            case "Shipped": return <Truck className="w-4 h-4" />;
            case "Cancelled": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusBorderColor = (status) => {
        switch (status) {
            case "Completed": return "border-green-500";
            case "Pending": return "border-yellow-500";
            case "Shipped": return "border-blue-500";
            case "Cancelled": return "border-red-500";
            default: return theme === 'light' ? "border-gray-200" : "border-gray-700";
        }
    };

    const filteredOrders = useMemo(() => {
        let filtered = orders.filter(order =>
            (filterStatus === "all" || order.status === filterStatus) &&
            (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.patient.contact.includes(searchTerm))
        );

        // Sort orders
        filtered.sort((a, b) => {
            if (sortKey === "date") return new Date(b.date) - new Date(a.date);
            if (sortKey === "total") return b.total - a.total;
            if (sortKey === "name") return a.patient.name.localeCompare(b.patient.name);
            return 0;
        });

        return filtered;
    }, [orders, searchTerm, filterStatus, sortKey]);
    
    const orderStatuses = useMemo(() => ["all", ...new Set(orders.map(o => o.status))], [orders]);

    const exportToCSV = () => {
        const headers = ['Order ID', 'Patient Name', 'Date', 'Status', 'Total Amount', 'Contact'];
        const csvData = orders.map(order => [
            order.id,
            order.patient.name,
            order.date,
            order.status,
            `$${order.total.toFixed(2)}`,
            order.patient.contact
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales-orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const OrderDetailsModal = ({ isOpen, onClose, order, onDelete }) => {
        if (!isOpen || !order) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl ${
                    theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
                }`}>
                    <div className="flex-shrink-0 flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h3 className="font-semibold text-lg">Order Details</h3>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => onDelete(order)}
                                className="p-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={onClose}
                                className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-grow p-6 overflow-y-auto">
                        {/* Patient Information */}
                        <div className="flex items-center gap-4 mb-6">
                            <img src={order.patient.avatarUrl} alt={order.patient.name} className="w-20 h-20 rounded-full border-4 border-indigo-500" />
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold">{order.patient.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {order.patient.age} years old, {order.patient.gender}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{order.patient.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{order.patient.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    ${order.total.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-1 justify-end mt-1">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Order Information */}
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border ${
                                    theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'
                                }`}>
                                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order Information
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Order ID</p>
                                            <p className="font-semibold">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Date</p>
                                            <p className="font-semibold">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Status</p>
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
                                            <p className="font-semibold text-green-600 dark:text-green-400">
                                                ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className={`p-4 rounded-lg border ${
                                    theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'
                                }`}>
                                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        Order Items ({order.items.length})
                                    </h5>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-600 last:border-b-0">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Patient Location */}
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border ${
                                    theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'
                                }`}>
                                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Patient Location
                                    </h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {order.patient.location.address}
                                    </p>
                                    <MapComponent location={order.patient.location} />
                                </div>

                                {/* Quick Actions */}
                                <div className={`p-4 rounded-lg border ${
                                    theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-700 border-slate-600'
                                }`}>
                                    <h5 className="font-semibold mb-3">Quick Actions</h5>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500">
                                            <Phone className="w-4 h-4" />
                                            Call Patient
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-500">
                                            <Mail className="w-4 h-4" />
                                            Email Receipt
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <Edit className="w-4 h-4" />
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteConfirmationModal = ({ isOpen, onClose, order, onConfirm }) => {
        if (!isOpen || !order) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
                    theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
                }`}>
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Delete Order</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to delete order "{order.id}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => onConfirm(order.id)}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`relative flex flex-col h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-gray-50" : "bg-gray-50 text-gray-900"}`}>
            <MedicalParticles />
            
            {/* Header Section */}
            <div className="relative z-10 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Sales & Orders
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage patient orders and track sales performance
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-blue-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-slate-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-500" />
                            Total Orders
                        </h3>
                        <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                    </div>
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-green-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-slate-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Completed
                        </h3>
                        <p className="text-3xl font-bold text-green-500 mt-2">{stats.completedOrders}</p>
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
                            <TrendingUp className="w-5 h-5 text-orange-500" />
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
                            placeholder="Search by order ID, patient name, or contact..."
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
                            {orderStatuses.filter(status => status !== 'all').map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select 
                            value={sortKey} 
                            onChange={(e) => setSortKey(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
                            }`}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="total">Sort by Amount</option>
                            <option value="name">Sort by Name</option>
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

            {/* Orders Grid/List */}
            <div className="relative z-10 flex-1 overflow-y-auto pr-2">
                {viewMode === 'grid' ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
                        {filteredOrders.map((order) => (
                            <TiltCard
                                key={order.id}
                                onClick={() => openModal(order)}
                                className={`rounded-xl p-5 shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${getStatusBorderColor(order.status)} ${
                                    theme === 'light' ? 'bg-white' : 'bg-slate-800'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className={`text-sm font-semibold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
                                            {order.id}
                                        </p>
                                        <p className="font-bold text-lg">{order.patient.name}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(order.status)}
                                        <span className={`px-2.5 py-0.5 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={order.patient.avatarUrl} alt={order.patient.name} className="w-12 h-12 rounded-full" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.patient.age} years, {order.patient.gender}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.patient.contact}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <p className={`text-xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                                        ${order.total.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {order.date}
                                    </p>
                                </div>
                                
                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    {order.items.length} items • {order.patient.location.address.split(',')[0]}
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => openModal(order)}
                                className={`p-4 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
                                    theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <img src={order.patient.avatarUrl} alt={order.patient.name} className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="font-semibold">{order.patient.name}</div>
                                            <div className="text-sm text-gray-500">{order.id}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">${order.total.toFixed(2)}</div>
                                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                                        </div>
                                        <div>
                                            <div className="text-sm">{order.date}</div>
                                            <div className="text-sm text-gray-500">{order.patient.contact}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {filteredOrders.length === 0 && (
                    <div className={`text-center py-12 rounded-lg ${
                        theme === 'light' ? 'bg-white' : 'bg-slate-800'
                    }`}>
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-500">No orders found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <OrderDetailsModal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                order={viewingOrder} 
                onDelete={setDeleteConfirm}
            />
            <DeleteConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                order={deleteConfirm}
                onConfirm={handleDeleteOrder}
            />
        </div>
    );
}