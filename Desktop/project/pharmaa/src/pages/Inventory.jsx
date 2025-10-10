import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import MedicalParticles from "../components/MedicalParticles";
import TiltCard from "./TiltCard";
import { Search, Filter, AlertTriangle, Calendar, Package, Download, Upload, Plus, Edit, Trash2, BarChart3 } from "lucide-react";

export default function Inventory() {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];

  // Helper functions - defined FIRST
  const getDaysUntilExpiry = (expireDate) => {
    if (!expireDate) return Infinity;
    const expiry = new Date(expireDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const getStockStatus = (medicine) => {
    if (medicine.stock === 0) return { status: 'out', color: 'red', text: 'Out of Stock' };
    if (medicine.stock < medicine.lowStockThreshold) return { status: 'low', color: 'orange', text: 'Low Stock' };
    return { status: 'healthy', color: 'green', text: 'In Stock' };
  };

  const getExpiryStatus = (expireDate) => {
    const days = getDaysUntilExpiry(expireDate);
    if (days < 0) return { status: 'expired', color: 'red', text: 'Expired' };
    if (days <= 30) return { status: 'warning', color: 'orange', text: `${days} days` };
    if (days <= 90) return { status: 'notice', color: 'yellow', text: `${days} days` };
    return { status: 'good', color: 'green', text: `${days} days` };
  };

  const [medicines, setMedicines] = useState(() => {
    try {
      const savedMedicines = localStorage.getItem('medicinesInventory');
      if (savedMedicines) {
        return JSON.parse(savedMedicines);
      }
    } catch (error) {
      console.error("Failed to parse medicines from localStorage", error);
    }
    return [
        { 
          id: 1,
          name: "Paracetamol 500mg", 
          category: "Pain Relief", 
          stock: 150, 
          lowStockThreshold: 50,
          price: 2.5, 
          expireDate: "2026-10-20",
          supplier: "MediCorp Ltd",
          barcode: "1234567890123",
          lastRestocked: "2024-09-01",
          salesRate: 45
        },
        { 
          id: 2,
          name: "Ibuprofen 400mg", 
          category: "Pain Relief", 
          stock: 80, 
          lowStockThreshold: 50,
          price: 3.0, 
          expireDate: "2025-11-15",
          supplier: "PharmaGlobal",
          barcode: "1234567890124",
          lastRestocked: "2024-08-15",
          salesRate: 32
        },
        { 
          id: 3,
          name: "Amoxicillin 250mg", 
          category: "Antibiotic", 
          stock: 40, 
          lowStockThreshold: 30,
          price: 5.0, 
          expireDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          supplier: "BioPharm Inc",
          barcode: "1234567890125",
          lastRestocked: "2024-09-10",
          salesRate: 28
        },
        { 
          id: 4,
          name: "Cetirizine 10mg", 
          category: "Antihistamine", 
          stock: 200, 
          lowStockThreshold: 100,
          price: 1.8, 
          expireDate: "2027-01-01",
          supplier: "AllergyCare",
          barcode: "1234567890126",
          lastRestocked: "2024-08-20",
          salesRate: 15
        },
        { 
          id: 5,
          name: "Vitamin C 1000mg", 
          category: "Supplement", 
          stock: 15, 
          lowStockThreshold: 25,
          price: 8.5, 
          expireDate: "2024-09-30",
          supplier: "HealthPlus",
          barcode: "1234567890127",
          lastRestocked: "2024-07-15",
          salesRate: 12
        },
    ];
  });

  useEffect(() => {
    try {
        localStorage.setItem('medicinesInventory', JSON.stringify(medicines));
    } catch (error) {
        console.error("Failed to save medicines to localStorage", error);
    }
  }, [medicines]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notifiedMedicines, setNotifiedMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [bulkAction, setBulkAction] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const loaderRef = useRef(null);

  // Enhanced analytics data
  const analytics = useMemo(() => {
    const totalValue = medicines.reduce((sum, med) => sum + (med.stock * med.price), 0);
    const lowStockItems = medicines.filter(m => m.stock < m.lowStockThreshold);
    const expiringSoon = medicines.filter(m => getDaysUntilExpiry(m.expireDate) <= 30 && getDaysUntilExpiry(m.expireDate) >= 0);
    const outOfStock = medicines.filter(m => m.stock === 0);
    const topSelling = [...medicines].sort((a, b) => (b.salesRate || 0) - (a.salesRate || 0)).slice(0, 5);
    
    return {
      totalValue,
      lowStockCount: lowStockItems.length,
      expiringSoonCount: expiringSoon.length,
      outOfStockCount: outOfStock.length,
      totalMedicines: medicines.length,
      topSelling,
      categories: [...new Set(medicines.map(m => m.category))].length
    };
  }, [medicines]);

  // Enhanced filtering and sorting
  const filteredAndSortedMedicines = useMemo(() => {
    let sortableItems = [...medicines].filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
      const matchesStock = filterStock === 'all' || 
                          (filterStock === 'low' && medicine.stock < medicine.lowStockThreshold) ||
                          (filterStock === 'out' && medicine.stock === 0) ||
                          (filterStock === 'healthy' && medicine.stock >= medicine.lowStockThreshold);
      
      return matchesSearch && matchesCategory && matchesStock;
    });
    
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle nested properties and special cases
        if (sortConfig.key === 'daysUntilExpiry') {
          aVal = getDaysUntilExpiry(a.expireDate);
          bVal = getDaysUntilExpiry(b.expireDate);
        }
        
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [medicines, searchTerm, filterCategory, filterStock, sortConfig]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedMedicines.length / ITEMS_PER_PAGE), [filteredAndSortedMedicines]);

  // Auto-reorder suggestions
  const reorderSuggestions = useMemo(() => {
    return medicines
      .filter(med => med.stock < med.lowStockThreshold)
      .map(med => ({
        ...med,
        suggestedOrder: Math.max(med.lowStockThreshold * 2 - med.stock, 10) // Order enough to reach 2x threshold
      }))
      .sort((a, b) => a.stock / a.lowStockThreshold - b.stock / b.lowStockThreshold);
  }, [medicines]);

  // Enhanced notification system
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      const newExpiring = medicines.filter(med => {
        const days = getDaysUntilExpiry(med.expireDate);
        return days <= 15 && days >= 0 && !notifiedMedicines.includes(med.id);
      });

      newExpiring.forEach(med => {
        new Notification("Expiry Alert", {
          body: `${med.name} expires in ${getDaysUntilExpiry(med.expireDate)} days. Current stock: ${med.stock}`,
          icon: '/pill-icon.png',
          tag: `expiry-${med.id}`
        });
        setNotifiedMedicines(prev => [...prev, med.id]);
      });
    }
  }, [medicines, notifiedMedicines]);

  // Bulk actions
  const toggleSelectMedicine = (medicineId) => {
    const newSelected = new Set(selectedMedicines);
    if (newSelected.has(medicineId)) {
      newSelected.delete(medicineId);
    } else {
      newSelected.add(medicineId);
    }
    setSelectedMedicines(newSelected);
  };

  const selectAll = () => {
    if (selectedMedicines.size === visibleMedicines.length) {
      setSelectedMedicines(new Set());
    } else {
      setSelectedMedicines(new Set(visibleMedicines.map(m => m.id)));
    }
  };

  // FIXED: Bulk delete function
  const handleBulkDelete = () => {
    setMedicines(prev => prev.filter(med => !selectedMedicines.has(med.id)));
    setSelectedMedicines(new Set());
    setBulkAction(false);
  };

  const handleBulkRestock = () => {
    setMedicines(prev => prev.map(med => 
      selectedMedicines.has(med.id) 
        ? { ...med, stock: med.stock + med.lowStockThreshold * 2, lastRestocked: today }
        : med
    ));
    setSelectedMedicines(new Set());
    setBulkAction(false);
  };

  // Form handling with date validation
  const saveForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expireDate = formData.get("expireDate");
    
    // Validate expiry date is not in the past
    if (new Date(expireDate) < new Date(today)) {
      alert("Expiry date cannot be in the past. Please select a future date.");
      return;
    }

    const newMedicine = {
      id: editing?.id || Date.now(),
      name: formData.get("name") || "",
      category: formData.get("category") || "",
      stock: parseInt(formData.get("stock")) || 0,
      lowStockThreshold: parseInt(formData.get("lowStockThreshold")) || 25,
      price: parseFloat(formData.get("price")) || 0,
      expireDate: expireDate || "",
      supplier: formData.get("supplier") || "",
      barcode: formData.get("barcode") || "",
      lastRestocked: formData.get("lastRestocked") || today,
      salesRate: editing?.salesRate || 0
    };

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    if (editing) {
      setMedicines(prev => prev.map(m => m.id === editing.id ? { ...m, ...newMedicine } : m));
    } else {
      setMedicines(prev => [...prev, newMedicine]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  // FIXED: Delete functions
  const handleDelete = (medicine) => setDeleteConfirm(medicine);
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      setMedicines(prev => prev.filter(med => med.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  // View management
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStock, sortConfig]);

  const visibleMedicines = useMemo(() => {
    return filteredAndSortedMedicines.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredAndSortedMedicines, currentPage]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const categories = useMemo(() => ["all", ...new Set(medicines.map(m => m.category))], [medicines]);

  // Export functionality
  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Stock', 'Low Stock Threshold', 'Price', 'Expiry Date', 'Supplier', 'Barcode'];
    const csvData = medicines.map(med => [
      med.name,
      med.category,
      med.stock,
      med.lowStockThreshold,
      med.price,
      med.expireDate,
      med.supplier,
      med.barcode
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen p-6">
      <style>{`
        @keyframes pulse-warning { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse-warning { animation: pulse-warning 2s infinite; }
        .grid-view { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
        .list-view { display: flex; flex-direction: column; gap: 0.5rem; }
      `}</style>
      
      <MedicalParticles />
      
      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your pharmacy stock with real-time alerts and analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        {showAnalytics && (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-6 rounded-xl shadow-lg ${
            theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-800 border border-slate-700'
          }`}>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${analytics.totalValue.toLocaleString()}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Inventory Value</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{analytics.lowStockCount}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Low Stock Items</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.expiringSoonCount}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Expiring Soon</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.categories}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Categories</div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-blue-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              Total Medicines
            </h3>
            <p className="text-3xl font-bold mt-2">{analytics.totalMedicines}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-red-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Low Stock
            </h3>
            <p className="text-3xl font-bold text-red-500 mt-2">{analytics.lowStockCount}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-orange-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Expiring Soon
            </h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">{analytics.expiringSoonCount}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-green-500 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Out of Stock
            </h3>
            <p className="text-3xl font-bold text-green-500 mt-2">{analytics.outOfStockCount}</p>
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
              placeholder="Search medicines, categories, suppliers..."
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
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
              }`}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={filterStock} 
              onChange={(e) => setFilterStock(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-slate-700 text-white'
              }`}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="healthy">Healthy Stock</option>
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

            {/* Bulk Actions */}
            {bulkAction && (
              <div className="flex gap-2">
                <button
                  onClick={handleBulkRestock}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Restock Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setBulkAction(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            onClick={() => requestSort('name')}
            className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
              theme === 'light' ? 'border-gray-300' : 'border-gray-600'
            } ${sortConfig.key === 'name' ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}
          >
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => requestSort('stock')}
            className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
              theme === 'light' ? 'border-gray-300' : 'border-gray-600'
            } ${sortConfig.key === 'stock' ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}
          >
            Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => requestSort('price')}
            className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
              theme === 'light' ? 'border-gray-300' : 'border-gray-600'
            } ${sortConfig.key === 'price' ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}
          >
            Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => setBulkAction(!bulkAction)}
            className={`px-3 py-2 rounded-lg border ${
              bulkAction ? 'bg-indigo-600 text-white' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
            }`}
          >
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Reorder Suggestions */}
      {reorderSuggestions.length > 0 && (
        <div className={`relative z-10 mb-6 p-4 rounded-xl border-l-4 border-orange-500 ${
          theme === 'light' ? 'bg-orange-50 border border-orange-200' : 'bg-orange-900/20 border border-orange-800'
        }`}>
          <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Reorder Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {reorderSuggestions.map(med => (
              <div key={med.id} className="flex justify-between items-center p-2 text-sm">
                <span>{med.name}</span>
                <span className="font-semibold">Order {med.suggestedOrder} units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medicines Grid/List */}
      <div className={`relative z-10 ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
        {viewMode === 'list' && bulkAction && (
          <div className={`p-4 rounded-lg mb-2 ${
            theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
          }`}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedMedicines.size === visibleMedicines.length}
                onChange={selectAll}
                className="rounded"
              />
              Select All ({selectedMedicines.size} selected)
            </label>
          </div>
        )}

        {visibleMedicines.map((medicine, index) => {
          const stockStatus = getStockStatus(medicine);
          const expiryStatus = getExpiryStatus(medicine.expireDate);
          
          return viewMode === 'grid' ? (
            // Grid View Card
            <TiltCard 
              key={medicine.id} 
              className={`rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-l-4 ${
                stockStatus.color === 'red' ? 'border-red-500' : 
                stockStatus.color === 'orange' ? 'border-orange-500' : 
                'border-green-500'
              } ${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              } ${expiryStatus.status === 'warning' ? 'animate-pulse-warning' : ''}`}
            >
              {bulkAction && (
                <div className="mb-3">
                  <input
                    type="checkbox"
                    checked={selectedMedicines.has(medicine.id)}
                    onChange={() => toggleSelectMedicine(medicine.id)}
                    className="rounded"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold truncate">{medicine.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stockStatus.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                  stockStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {stockStatus.text}
                </span>
              </div>
              
              <div className="text-sm space-y-2">
                <p><strong>Category:</strong> {medicine.category}</p>
                <p><strong>Price:</strong> ${medicine.price.toFixed(2)}</p>
                <p><strong>Stock:</strong> {medicine.stock} / {medicine.lowStockThreshold}</p>
                <p className={`flex items-center gap-1 ${
                  expiryStatus.status === 'warning' ? 'text-orange-600 font-semibold' : ''
                }`}>
                  <strong>Expires:</strong> 
                  {medicine.expireDate} ({expiryStatus.text})
                </p>
                {medicine.supplier && <p><strong>Supplier:</strong> {medicine.supplier}</p>}
                {medicine.salesRate && <p><strong>Sales Rate:</strong> {medicine.salesRate}/month</p>}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  className="flex-1 flex items-center justify-center gap-1 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-500"
                  onClick={(e) => { e.stopPropagation(); setEditing(medicine); setModalOpen(true); }}
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-1 rounded-md bg-red-600 text-white px-3 py-2 text-sm hover:bg-red-500"
                  onClick={(e) => { e.stopPropagation(); handleDelete(medicine); }}
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </TiltCard>
          ) : (
            // List View Row
            <div 
              key={medicine.id}
              className={`p-4 rounded-lg border-l-4 ${
                stockStatus.color === 'red' ? 'border-red-500' : 
                stockStatus.color === 'orange' ? 'border-orange-500' : 
                'border-green-500'
              } ${
                theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-800 border border-slate-700'
              } ${expiryStatus.status === 'warning' ? 'animate-pulse-warning' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {bulkAction && (
                    <input
                      type="checkbox"
                      checked={selectedMedicines.has(medicine.id)}
                      onChange={() => toggleSelectMedicine(medicine.id)}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-semibold">{medicine.name}</div>
                      <div className="text-sm text-gray-500">{medicine.category}</div>
                    </div>
                    <div>
                      <div className="font-semibold">${medicine.price.toFixed(2)}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        stockStatus.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                        stockStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {medicine.stock} in stock
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">Expires: {medicine.expireDate}</div>
                      <div className={`text-xs ${expiryStatus.status === 'warning' ? 'text-orange-600 font-semibold' : ''}`}>
                        {expiryStatus.text}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div>Supplier: {medicine.supplier}</div>
                      <div>Sales: {medicine.salesRate}/month</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                    onClick={() => { setEditing(medicine); setModalOpen(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                    onClick={() => handleDelete(medicine)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div ref={loaderRef} className="relative z-10 col-span-1 sm:col-span-2 lg:col-span-3 h-10 flex justify-center items-center mt-6">
        {currentPage < totalPages && (
          <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Loading more medicines... ({visibleMedicines.length} of {filteredAndSortedMedicines.length})
          </p>
        )}
      </div>

      {/* Add/Edit Medicine Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModalOpen(false); setEditing(null); }} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
            theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b px-6 py-4 ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <h3 className="font-semibold text-xl">{editing ? "Edit Medicine" : "Add New Medicine"}</h3>
              <button className={`rounded-full p-2 text-xl hover:bg-opacity-20 ${
                theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-slate-700'
              }`} onClick={() => { setModalOpen(false); setEditing(null); }}>✕</button>
            </div>
            
            <form onSubmit={saveForm} noValidate className="grid grid-cols-1 gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Medicine Name *</label>
                <input 
                  name="name" 
                  defaultValue={editing?.name || ""} 
                  placeholder="e.g., Paracetamol 500mg" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category *</label>
                <input 
                  name="category" 
                  defaultValue={editing?.category || ""} 
                  placeholder="e.g., Pain Relief" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Supplier</label>
                <input 
                  name="supplier" 
                  defaultValue={editing?.supplier || ""} 
                  placeholder="e.g., PharmaCorp" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Barcode</label>
                <input 
                  name="barcode" 
                  defaultValue={editing?.barcode || ""} 
                  placeholder="e.g., 1234567890123" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  name="price" 
                  defaultValue={editing?.price ?? ""} 
                  placeholder="e.g., 2.50" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Stock Quantity *</label>
                <input 
                  type="number" 
                  min="0" 
                  name="stock" 
                  defaultValue={editing?.stock ?? ""} 
                  placeholder="e.g., 150" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Low Stock Threshold *</label>
                <input 
                  type="number" 
                  min="1" 
                  name="lowStockThreshold" 
                  defaultValue={editing?.lowStockThreshold || 25} 
                  placeholder="e.g., 25" 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Expiry Date *</label>
                <input 
                  type="date" 
                  min={today} 
                  name="expireDate" 
                  defaultValue={editing?.expireDate ?? ""} 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Last Restocked</label>
                <input 
                  type="date" 
                  name="lastRestocked" 
                  defaultValue={editing?.lastRestocked || today} 
                  className={`mt-1 w-full rounded-lg border bg-transparent px-3 py-2 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-700'
                  }`} 
                />
              </div>

              <div className={`sm:col-span-2 mt-6 flex items-center justify-end gap-3 border-t pt-6 ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <button 
                  type="button" 
                  className={`rounded-lg border px-6 py-2 ${
                    theme === 'light' ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-700 hover:bg-slate-700'
                  }`} 
                  onClick={() => { setModalOpen(false); setEditing(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-white shadow hover:bg-indigo-500 transition"
                >
                  {editing ? "Update Medicine" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className={`relative w-full max-w-sm rounded-xl shadow-2xl ${
            theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
          }`}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Medicine</h3>
              <p className={`text-sm mb-6 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className={`rounded-lg border px-6 py-2 ${
                    theme === 'light' ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-700 hover:bg-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="rounded-lg bg-red-600 text-white px-6 py-2 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Helper function for medical flash classes
const getMedicalFlashClass = (expiryStatus, stockStatus) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryStatus);
  
  if (stockStatus.status === 'out') return 'out-of-stock-emergency';
  if (expiryStatus.status === 'expired') return 'medical-expired-flash';
  if (daysUntilExpiry <= 7) return 'medical-critical-flash';
  if (daysUntilExpiry <= 30) return 'medical-alert-flash';
  if (daysUntilExpiry <= 90) return 'medical-warning-flash';
  if (stockStatus.status === 'low') return 'medical-notice-pulse';
  return '';
};

