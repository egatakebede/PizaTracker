import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../components/ThemeContext';
import MedicalParticles from "../components/MedicalParticles";
import TiltCard from "./TiltCard";
import { Search, Filter, Plus, MessageCircle, Phone, Mail, MapPin, Package, Truck, DollarSign, Users, TrendingUp, MoreVertical, Edit, Trash2, Star, ShoppingCart } from 'lucide-react';

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
            .bindPopup('Supplier Location')
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
    
    return <div ref={mapRef} style={{ height: '200px', width: '100%', borderRadius: '12px', zIndex: 0 }}></div>;
};

// --- Main Suppliers Component ---
function SuppliersComponent() {
    const { theme } = useTheme();

    const allPurchaseOrders = [
        { id: 'PO-001', supplierId: 1, date: '2025-07-20', total: 1250.00, status: 'Received', items: 45 },
        { id: 'PO-002', supplierId: 2, date: '2025-08-05', total: 3400.50, status: 'Shipped', items: 120 },
        { id: 'PO-003', supplierId: 1, date: '2025-08-15', total: 850.75, status: 'Placed', items: 25 },
        { id: 'PO-004', supplierId: 3, date: '2025-09-01', total: 2100.25, status: 'Received', items: 80 },
    ];
    
    const allProducts = [
        { id: 'PROD-01', supplierId: 1, name: 'Paracetamol 500mg', cost: 1.50, stock: 150, category: 'Pain Relief' },
        { id: 'PROD-02', supplierId: 1, name: 'Ibuprofen 200mg', cost: 2.10, stock: 80, category: 'Pain Relief' },
        { id: 'PROD-03', supplierId: 2, name: 'Amoxicillin 250mg', cost: 3.50, stock: 40, category: 'Antibiotic' },
        { id: 'PROD-04', supplierId: 2, name: 'Blood Pressure Monitor', cost: 45.00, stock: 15, category: 'Equipment' },
        { id: 'PROD-05', supplierId: 3, name: 'Vitamin C 1000mg', cost: 8.50, stock: 200, category: 'Supplement' },
    ];

    const [suppliers, setSuppliers] = useState(() => {
        try {
            const saved = localStorage.getItem('pharmacySuppliers');
            return saved ? JSON.parse(saved) : [
                { 
                    id: 1, 
                    name: "PharmaSource Inc.", 
                    category: "General Medications", 
                    status: "Active", 
                    contactPerson: "John Doe", 
                    email: "john@pharmasource.com",
                    phone: "+251 91 123 4567",
                    rating: 4.8,
                    deliveryTime: "2-3 days",
                    avatarUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        address: "123 Pharma Lane, Addis Ababa", 
                        lat: 9.021, 
                        lng: 38.752 
                    }, 
                    conversation: [
                        { sender: 'John Doe', text: 'Hi, confirming your last PO-003.', timestamp: '11:00 AM' },
                        { sender: 'You', text: 'Thanks John, when can we expect delivery?', timestamp: '11:15 AM' }
                    ] 
                },
                { 
                    id: 2, 
                    name: "MediEquip Solutions", 
                    category: "Medical Equipment", 
                    status: "Active", 
                    contactPerson: "Jane Smith", 
                    email: "jane@mediequip.com",
                    phone: "+251 92 234 5678",
                    rating: 4.5,
                    deliveryTime: "1-2 days",
                    avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        address: "456 Health St, Addis Ababa", 
                        lat: 9.015, 
                        lng: 38.765 
                    }, 
                    conversation: [] 
                },
                { 
                    id: 3, 
                    name: "HealthPlus Supplements", 
                    category: "Vitamins & Supplements", 
                    status: "Active", 
                    contactPerson: "Mike Johnson", 
                    email: "mike@healthplus.com",
                    phone: "+251 93 345 6789",
                    rating: 4.9,
                    deliveryTime: "3-4 days",
                    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", 
                    location: { 
                        address: "789 Wellness Ave, Addis Ababa", 
                        lat: 9.035, 
                        lng: 38.775 
                    }, 
                    conversation: [] 
                },
            ];
        } catch (error) {
            console.error("Failed to parse suppliers from localStorage", error);
            return [];
        }
    });

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewingSupplier, setViewingSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        localStorage.setItem('pharmacySuppliers', JSON.stringify(suppliers));
    }, [suppliers]);

    // Statistics
    const stats = useMemo(() => {
        const totalSuppliers = suppliers.length;
        const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
        const totalSpent = allPurchaseOrders.reduce((sum, order) => sum + order.total, 0);
        const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
        
        return {
            totalSuppliers,
            activeSuppliers,
            totalSpent,
            avgRating: avgRating || 0
        };
    }, [suppliers, allPurchaseOrders]);

    const handleViewProfile = (supplier) => {
        setViewingSupplier(supplier);
        setIsProfileModalOpen(true);
    };

    const handleAddSupplier = (newSupplierData) => {
        const newSupplier = {
            id: Date.now(),
            ...newSupplierData,
            rating: 4.0,
            deliveryTime: "3-5 days",
            avatarUrl: `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face&text=${newSupplierData.name.substring(0,2).toUpperCase()}`,
            conversation: []
        };
        setSuppliers(prev => [newSupplier, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleEditSupplier = (updatedData) => {
        setSuppliers(prev => prev.map(s => 
            s.id === viewingSupplier.id ? { ...s, ...updatedData } : s
        ));
        setViewingSupplier(prev => ({ ...prev, ...updatedData }));
        setIsEditModalOpen(false);
    };

    const handleDeleteSupplier = (supplierId) => {
        setSuppliers(prev => prev.filter(s => s.id !== supplierId));
        setDeleteConfirm(null);
        if (viewingSupplier?.id === supplierId) {
            setIsProfileModalOpen(false);
        }
    };

    const handleSendMessage = (supplierId, text) => {
        const newMessage = {
            sender: 'You', 
            text, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedSuppliers = suppliers.map(s => {
            if (s.id === supplierId) {
                const conversation = s.conversation ? [...s.conversation, newMessage] : [newMessage];
                return { ...s, conversation };
            }
            return s;
        });
        setSuppliers(updatedSuppliers);
        setViewingSupplier(prev => ({...prev, conversation: [...(prev.conversation || []), newMessage]}));
    };

    const sortedAndFilteredSuppliers = useMemo(() => {
        return suppliers
            .filter(s => 
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(s => filterCategory === "all" || s.category === filterCategory)
            .filter(s => filterStatus === "all" || s.status === filterStatus)
            .sort((a, b) => {
                if (sortKey === "name") return a.name.localeCompare(b.name);
                if (sortKey === "rating") return b.rating - a.rating;
                if (sortKey === "category") return a.category.localeCompare(b.category);
                return 0;
            });
    }, [suppliers, searchTerm, sortKey, filterCategory, filterStatus]);

    const categories = useMemo(() => 
        ["all", ...new Set(suppliers.map(s => s.category))], 
        [suppliers]
    );

    // --- MODAL COMPONENTS ---
    const AddSupplierForm = ({ isOpen, onClose, onSave }) => {
        const [formData, setFormData] = useState({ 
            name: '', 
            category: '', 
            contactPerson: '', 
            email: '',
            phone: '',
            status: 'Active', 
            location: { address: '', lat: '', lng: '' }
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
            setFormData({ 
                name: '', category: '', contactPerson: '', email: '', phone: '', 
                status: 'Active', location: { address: '', lat: '', lng: '' }
            });
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
                    theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h3 className="font-semibold text-lg">Add New Supplier</h3>
                        <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Supplier Name *</label>
                                <input required name="name" value={formData.name} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <input name="category" value={formData.category} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Contact Person</label>
                                <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Address</label>
                                <input name="location.address" value={formData.location.address} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6 border-t pt-4 dark:border-gray-700">
                            <button type="button" onClick={onClose} 
                                className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit" 
                                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500">
                                Save Supplier
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const EditSupplierForm = ({ isOpen, onClose, supplier, onSave }) => {
        const [formData, setFormData] = useState(supplier || {});

        useEffect(() => {
            if (supplier) setFormData(supplier);
        }, [supplier]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };

        if (!isOpen || !supplier) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
                    theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h3 className="font-semibold text-lg">Edit Supplier</h3>
                        <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Supplier Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <input name="category" value={formData.category} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Contact Person</label>
                                <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Address</label>
                                <input name="location.address" value={formData.location?.address || ''} onChange={handleChange} 
                                    className={`w-full mt-1 p-2 rounded-md border ${
                                        theme === 'dark' ? 'bg-slate-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6 border-t pt-4 dark:border-gray-700">
                            <button type="button" onClick={onClose} 
                                className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit" 
                                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500">
                                Update Supplier
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const SupplierProfileModal = ({ isOpen, onClose, supplier, onSendMessage }) => {
        const [activeTab, setActiveTab] = useState('profile');
        const [newMessage, setNewMessage] = useState('');
        const messagesEndRef = useRef(null);
        
        const supplierOrders = useMemo(() => supplier ? allPurchaseOrders.filter(o => o.supplierId === supplier.id) : [], [supplier]);
        const supplierProducts = useMemo(() => supplier ? allProducts.filter(p => p.supplierId === supplier.id) : [], [supplier]);

        useEffect(() => { if (isOpen) setActiveTab('profile'); }, [isOpen]);
        useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [supplier?.conversation]);

        if (!isOpen || !supplier) return null;

        const getStatusColor = (status) => {
            switch (status) {
              case "Received": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
              case "Placed": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
              case "Shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
              default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
            }
        };

        const handleMessageSubmit = (e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;
            onSendMessage(supplier.id, newMessage);
            setNewMessage('');
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl ${
                    theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <div className="flex-shrink-0 flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h3 className="font-semibold text-lg">Supplier Profile</h3>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setDeleteConfirm(supplier)}
                                className="p-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 p-6 flex items-center gap-4">
                        <img src={supplier.avatarUrl} alt={supplier.name} className="w-24 h-24 rounded-full border-4 border-indigo-500" />
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold">{supplier.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.category}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contact: {supplier.contactPerson}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    {supplier.rating}/5
                                </span>
                                <span className="flex items-center gap-1">
                                    <Truck className="w-4 h-4 text-blue-500" />
                                    {supplier.deliveryTime}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    supplier.status === 'Active' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                    {supplier.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-shrink-0 border-b px-6 dark:border-gray-700">
                        <div className="flex space-x-8">
                            {['profile', 'products', 'orders', 'messaging'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 px-1 text-sm font-semibold border-b-2 capitalize ${
                                        activeTab === tab 
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </nav>

                    <div className="flex-grow p-6 overflow-y-auto">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h5 className="font-semibold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Location
                                    </h5>
                                    <p className="text-sm mb-2 text-gray-500 dark:text-gray-400">{supplier.location.address}</p>
                                    <MapComponent location={supplier.location} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Contact Information
                                        </h5>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span>{supplier.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span>{supplier.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            Performance
                                        </h5>
                                        <div className="space-y-2">
                                            <p><strong>Rating:</strong> {supplier.rating}/5</p>
                                            <p><strong>Delivery Time:</strong> {supplier.deliveryTime}</p>
                                            <p><strong>Total Orders:</strong> {supplierOrders.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div>
                                <h5 className="font-semibold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Product Catalog ({supplierProducts.length})
                                </h5>
                                <div className="grid gap-3">
                                    {supplierProducts.map(prod => (
                                        <div key={prod.id} className="p-4 rounded-lg border flex justify-between items-center dark:border-gray-700">
                                            <div>
                                                <p className="font-semibold">{prod.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {prod.category} • Cost: ${prod.cost.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{prod.stock}</p>
                                                <p className="text-sm text-gray-500">in stock</p>
                                            </div>
                                        </div>
                                    ))}
                                    {supplierProducts.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                            No products found for this supplier.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h5 className="font-semibold mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Order History ({supplierOrders.length})
                                </h5>
                                <div className="space-y-3">
                                    {supplierOrders.map(order => (
                                        <div key={order.id} className="p-4 rounded-lg border flex justify-between items-center dark:border-gray-700">
                                            <div>
                                                <p className="font-semibold">{order.id}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {order.date} • {order.items} items
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {supplierOrders.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                            No purchase order history found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'messaging' && (
                            <div className="h-full flex flex-col">
                                <div className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4">
                                    {(supplier.conversation || []).map((msg, i) => (
                                        <div key={i} className={`flex items-end gap-2 ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-md p-3 rounded-2xl ${
                                                msg.sender === 'You' 
                                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                                            }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-xs mt-1 ${
                                                    msg.sender === 'You' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {msg.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleMessageSubmit} className="flex-shrink-0 flex items-center gap-3">
                                    <input 
                                        value={newMessage} 
                                        onChange={(e) => setNewMessage(e.target.value)} 
                                        placeholder="Type a message..." 
                                        className={`flex-1 p-3 rounded-full border bg-transparent dark:border-gray-600`} 
                                    />
                                    <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const DeleteConfirmationModal = ({ isOpen, onClose, supplier, onConfirm }) => {
        if (!isOpen || !supplier) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
                    theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
                }`}>
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Delete Supplier</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete <strong>{supplier.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(supplier.id)}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                            >
                                Delete Supplier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`relative min-h-screen p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            <MedicalParticles />
            
            {/* Header Section */}
            <div className="relative z-10 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Suppliers Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your pharmacy suppliers, track performance, and communicate seamlessly
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Supplier
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-blue-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Total Suppliers
                        </h3>
                        <p className="text-3xl font-bold mt-2">{stats.totalSuppliers}</p>
                    </div>
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-green-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Active
                        </h3>
                        <p className="text-3xl font-bold text-green-500 mt-2">{stats.activeSuppliers}</p>
                    </div>
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-purple-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-purple-500" />
                            Total Spent
                        </h3>
                        <p className="text-3xl font-bold text-purple-500 mt-2">${stats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className={`p-4 rounded-xl shadow-md border-l-4 border-yellow-500 ${
                        theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Avg Rating
                        </h3>
                        <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.avgRating.toFixed(1)}/5</p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className={`relative z-10 p-6 rounded-xl shadow-md mb-6 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search suppliers by name or contact person..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                theme === 'light' 
                                    ? 'border-gray-300 bg-white placeholder-gray-500' 
                                    : 'border-gray-600 bg-gray-700 placeholder-gray-400 text-white'
                            }`}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
                            }`}
                        >
                            <option value="all">All Categories</option>
                            {categories.filter(cat => cat !== 'all').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
                            }`}
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select 
                            value={sortKey} 
                            onChange={(e) => setSortKey(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
                            }`}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="category">Sort by Category</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-2 ${
                                    viewMode === "grid" 
                                        ? 'bg-indigo-600 text-white' 
                                        : theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                                }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-2 ${
                                    viewMode === "list" 
                                        ? 'bg-indigo-600 text-white' 
                                        : theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suppliers Grid */}
            <div className={`relative z-10 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedAndFilteredSuppliers.map((supplier) => (
                    <TiltCard
                        key={supplier.id}
                        className={`relative rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                            theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-200 text-black'
                        }`}
                        onClick={() => handleViewProfile(supplier)}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <img src={supplier.avatarUrl} alt={supplier.name} className="w-16 h-16 rounded-full border-2 border-indigo-500" />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold tracking-tight">{supplier.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.category}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-sm">
                                        <Star className="w-3 h-3 text-yellow-500" />
                                        {supplier.rating}/5
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        supplier.status === 'Active' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}>
                                        {supplier.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span>{supplier.contactPerson}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="truncate">{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Truck className="w-4 h-4 text-gray-500" />
                                <span>{supplier.deliveryTime}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(supplier);
                                }}
                                className="flex-1 rounded-md px-3 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-500"
                            >
                                View Profile
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewingSupplier(supplier);
                                    setIsEditModalOpen(true);
                                }}
                                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </TiltCard>
                ))}
            </div>

            {/* Empty State */}
            {sortedAndFilteredSuppliers.length === 0 && (
                <div className={`relative z-10 text-center py-12 rounded-xl ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}>
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Get started by adding your first supplier'
                        }
                    </p>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500"
                    >
                        Add Supplier
                    </button>
                </div>
            )}

            {/* Modals */}
            <AddSupplierForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddSupplier} />
            <EditSupplierForm isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} supplier={viewingSupplier} onSave={handleEditSupplier} />
            <SupplierProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} supplier={viewingSupplier} onSendMessage={handleSendMessage} />
            <DeleteConfirmationModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} supplier={deleteConfirm} onConfirm={handleDeleteSupplier} />
        </div>
    );
}

export default SuppliersComponent;