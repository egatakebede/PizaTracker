// C:\Users\User\Desktop\pharmaa\src\components\Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Camera, Bell, Stethoscope, Moon, Sun, Search, AlertTriangle, Clock, Package } from "lucide-react";
import { useTheme } from "./ThemeContext";
import MedicalParticles from "./MedicalParticles";

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [medicineData, setMedicineData] = useState({ photoUrl: "", price: 0, name: "", category: "", expiryDate: "" });
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [modalStep, setModalStep] = useState('initial');

  // Enhanced Search Bar State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("all");
  const searchRef = useRef(null);

  // Shared data from Settings
  const [sharedProfile, setSharedProfile] = useState({
    name: "Alex Williams",
    username: "@alexpharma",
    bio: "Passionate about healthcare & pharma innovation.",
    role: "Senior Pharmacist"
  });
  
  const [profileData, setProfileData] = useState(sharedProfile);
  const [tempProfileData, setTempProfileData] = useState(profileData);

  // Shared inventory data
  const [inventory, setInventory] = useState([]);

  // Enhanced Notifications with Shared Data
  const [notifications, setNotifications] = useState([]);

  // Enhanced Search Data with Real Inventory
  const [searchData, setSearchData] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Load shared data
  useEffect(() => {
    const loadSharedData = () => {
      const savedProfile = localStorage.getItem("sharedPharmacyProfile");
      const savedAvatar = localStorage.getItem("sharedPharmacyAvatar");
      const savedInventory = localStorage.getItem("sharedPharmacyInventory");
      const savedNotifications = localStorage.getItem("sharedNotifications");
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setSharedProfile(parsed);
        setProfileData(prev => ({ ...prev, name: parsed.name || "Alex Williams" }));
        setTempProfileData(prev => ({ ...prev, name: parsed.name || "Alex Williams" }));
      }
      
      if (savedAvatar) setAvatar(savedAvatar);
      if (savedInventory) {
        const parsedInventory = JSON.parse(savedInventory);
        setInventory(parsedInventory);
        
        // Update search data with real inventory
        const inventorySearchData = parsedInventory.map(item => ({
          type: "medicine",
          name: item.name,
          id: item.id,
          details: `${item.category} • Stock: ${item.stock || 0}`,
          stock: item.stock || 0,
          lowStock: item.stock < (item.lowStockThreshold || 25),
          expiryDate: item.expiryDate,
          category: item.category,
          price: item.price
        }));
        
        setSearchData(prev => [
          ...inventorySearchData,
          // Keep static customer and order data
          ...prev.filter(item => item.type !== "medicine")
        ]);
      }
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    };

    loadSharedData();
    
    // Listen for storage changes (for real-time updates)
    const handleStorageChange = (e) => {
      if (e.key === "sharedPharmacyProfile" || e.key === "sharedPharmacyAvatar" || 
          e.key === "sharedPharmacyInventory" || e.key === "sharedNotifications") {
        loadSharedData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced Search Filtering
  const filteredSearchResults = searchData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = searchCategory === "all" || item.type === searchCategory.slice(0, -1);
    return matchesSearch && matchesCategory;
  });

  // Alert counters for badge
  const highPriorityAlerts = notifications.filter(n => !n.read && n.priority === "high").length;
  const lowStockAlerts = inventory.filter(item => item.stock < (item.lowStockThreshold || 25)).length;
  const expiryAlerts = inventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length;

  const handleModalClose = () => {
    setCameraModalOpen(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setTimeout(() => {
      setMedicineData({ photoUrl: "", price: 0, name: "", category: "", expiryDate: "" });
      setUseCamera(false);
      setModalError("");
      setModalSuccess("");
      setModalStep('initial');
    }, 300);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseCamera(true);
      setModalError("");
    } catch (err) {
      setModalError("Failed to access camera. Please check permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const photoUrl = canvas.toDataURL("image/png");
    setMedicineData((prev) => ({ ...prev, photoUrl }));
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setUseCamera(false);
  };

  const handleMedicinePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedicineData((prev) => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMedicineInputChange = (e) => {
    const { name, value } = e.target;
    setMedicineData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMedicine = () => {
    if (!medicineData.photoUrl || !medicineData.price || !medicineData.name) {
      setModalError("Please provide photo, name, and price.");
      return;
    }
    
    // Add to shared inventory
    const newMedicine = {
      ...medicineData,
      id: Date.now(),
      stock: 0, // New items start with 0 stock
      lowStockThreshold: 25,
      addedDate: new Date().toISOString()
    };
    
    const updatedInventory = [...inventory, newMedicine];
    setInventory(updatedInventory);
    localStorage.setItem("sharedPharmacyInventory", JSON.stringify(updatedInventory));
    
    setModalSuccess("Medicine added to inventory successfully!");
    
    // Add notification to shared storage
    const newNotification = {
      id: Date.now(),
      message: `New medicine added: ${medicineData.name}`,
      time: "Just now",
      read: false,
      type: "inventory",
      priority: "medium"
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem("sharedNotifications") || "[]");
    const updatedNotifications = [newNotification, ...existingNotifications.slice(0, 49)];
    localStorage.setItem("sharedNotifications", JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    
    // Update search data
    const newSearchItem = {
      type: "medicine",
      name: newMedicine.name,
      id: newMedicine.id,
      details: `${newMedicine.category} • Stock: ${newMedicine.stock}`,
      stock: newMedicine.stock,
      lowStock: newMedicine.stock < newMedicine.lowStockThreshold,
      expiryDate: newMedicine.expiryDate,
      category: newMedicine.category
    };
    
    setSearchData(prev => [newSearchItem, ...prev.filter(item => item.type !== "medicine" || item.id !== newMedicine.id)]);
    
    setTimeout(() => {
      handleModalClose();
    }, 1500);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
    setProfileData(tempProfileData);
    localStorage.setItem("userProfile", JSON.stringify(tempProfileData));
    setIsEditing(false);
    setProfileOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        localStorage.setItem("userAvatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("sharedNotifications", JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem("sharedNotifications", JSON.stringify(updatedNotifications));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
        setIsEditing(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (item) => {
    console.log(`Selected ${item.type}: ${item.name}`, item);
    setSearchTerm("");
    setSearchOpen(false);
    
    // Navigate based on item type
    switch(item.type) {
      case "medicine":
        console.log(`Opening medicine details for: ${item.name}`);
        // Could navigate to inventory page with this item selected
        break;
      case "customer":
        console.log(`Opening customer profile: ${item.name}`);
        break;
      case "order":
        console.log(`Opening order: ${item.name}`);
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "low_stock":
        return <Package className="w-4 h-4 text-orange-500" />;
      case "expiry":
        return <Clock className="w-4 h-4 text-red-500" />;
      case "order":
        return <Bell className="w-4 h-4 text-blue-500" />;
      case "inventory":
        return <Package className="w-4 h-4 text-green-500" />;
      case "staff":
        return <Bell className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "low":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  return (
    <header className={`relative flex items-center justify-between p-4 border-b ${theme === "dark" ? "bg-slate-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
      <MedicalParticles variant="default" />
      <div className="flex items-center gap-4">
        <Stethoscope className="w-6 h-6 text-indigo-600" />
        <h1 className="text-lg font-semibold">{sharedProfile.name || "AthaNex"}</h1>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        {/* Enhanced Search Bar */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search medicines, customers, orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 ${
                theme === "dark" ? "bg-slate-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>
          {searchOpen && (
            <div className={`absolute right-0 mt-2 w-96 rounded-xl shadow-lg p-4 max-h-96 overflow-y-auto ${
              theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
            }`}>
              {/* Search Categories */}
              <div className="flex gap-2 mb-3">
                {["all", "medicines", "customers", "orders"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSearchCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      searchCategory === category
                        ? "bg-indigo-600 text-white"
                        : theme === "dark" 
                          ? "bg-slate-700 text-gray-300" 
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold mb-2">
                Search Results {filteredSearchResults.length > 0 && `(${filteredSearchResults.length})`}
              </h3>
              
              {searchTerm && filteredSearchResults.length > 0 ? (
                <div className="space-y-2">
                  {filteredSearchResults.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSearchSelect(item)}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        theme === "dark" 
                          ? "hover:bg-slate-700 border border-slate-600" 
                          : "hover:bg-gray-50 border border-gray-200"
                      } ${
                        item.type === "medicine" && item.lowStock ? "border-l-4 border-orange-500" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm flex items-center gap-2">
                            {item.type === "medicine" && item.lowStock && (
                              <AlertTriangle className="w-3 h-3 text-orange-500" />
                            )}
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.details}</p>
                          
                          {/* Medicine-specific info */}
                          {item.type === "medicine" && (
                            <div className="flex gap-3 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.lowStock 
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }`}>
                                Stock: {item.stock}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          item.type === "medicine" 
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : item.type === "customer"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <p className="text-gray-500 text-center py-4">No results found for "{searchTerm}"</p>
              ) : (
                <p className="text-gray-500 text-center py-4">Start typing to search...</p>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Enhanced Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {(highPriorityAlerts > 0 || lowStockAlerts > 0 || expiryAlerts > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 flex items-center justify-center">
                {highPriorityAlerts + lowStockAlerts + expiryAlerts}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className={`absolute right-0 mt-2 w-96 rounded-xl shadow-lg p-4 max-h-96 overflow-y-auto ${
              theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              {/* Alert Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {lowStockAlerts > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded">
                    <Package className="w-3 h-3" />
                    {lowStockAlerts} low stock
                  </div>
                )}
                {expiryAlerts > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {expiryAlerts} expiring
                  </div>
                )}
                {highPriorityAlerts > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                    <Bell className="w-3 h-3" />
                    {highPriorityAlerts} urgent
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        getPriorityColor(notif.priority)
                      } ${notif.read ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notif.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={avatar || sharedProfile.avatarUrl || "https://placehold.co/40x40"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
            />
            <div className="text-left hidden sm:block">
              <span className="text-sm font-medium block">{profileData.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{profileData.role}</span>
            </div>
          </button>
          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg p-4 ${
              theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
            }`}>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <img
                      src={avatar || sharedProfile.avatarUrl || "https://placehold.co/80x80"}
                      alt="User"
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-indigo-500"
                    />
                    <button
                      onClick={() => document.getElementById('avatar-file-input').click()}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Change Photo
                    </button>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={tempProfileData.name}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-700 dark:border-gray-600"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    name="username"
                    value={tempProfileData.username}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-700 dark:border-gray-600"
                    placeholder="Username"
                  />
                  <input
                    type="text"
                    name="role"
                    value={tempProfileData.role}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-700 dark:border-gray-600"
                    placeholder="Role"
                  />
                  <textarea
                    name="bio"
                    value={tempProfileData.bio}
                    onChange={handleProfileChange}
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-700 dark:border-gray-600"
                    placeholder="Bio"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileSave}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={avatar || sharedProfile.avatarUrl || "https://placehold.co/80x80"}
                      alt="User"
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-indigo-500"
                    />
                    <p className="font-semibold">{profileData.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{profileData.bio}</p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setCameraModalOpen(true)}
                      className="w-full rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Add Medicine via Camera
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Medicine Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleModalClose} />
          <div className={`w-full max-w-2xl rounded-xl p-6 relative ${
            theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
          }`}>
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-semibold mb-6">Add New Medicine to Inventory</h3>
            
            {modalSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {modalSuccess}
              </div>
            )}
            
            {modalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {modalError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Photo Upload */}
              <div className="space-y-4">
                <h4 className="font-semibold">Medicine Photo</h4>
                
                {modalStep === 'initial' && !useCamera && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {medicineData.photoUrl ? (
                      <div className="space-y-4">
                        <img
                          src={medicineData.photoUrl}
                          alt="medicine preview"
                          className="w-full h-48 object-contain rounded-md mx-auto"
                        />
                        <button
                          onClick={() => setMedicineData(prev => ({ ...prev, photoUrl: "" }))}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                        <button
                          onClick={() => document.getElementById('medicine-file-input').click()}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
                        >
                          Upload Photo
                        </button>
                        <input
                          id="medicine-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleMedicinePhotoChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500">OR</p>
                        <button
                          onClick={startCamera}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 flex items-center justify-center gap-2 mx-auto"
                        >
                          <Camera className="w-4 h-4" />
                          Use Camera
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {useCamera && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-center">Camera</h4>
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-48 bg-gray-200 dark:bg-slate-700 rounded-md"
                    />
                    <button
                      onClick={handleCapturePhoto}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 w-full"
                    >
                      Capture Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Medicine Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">Medicine Details</h4>
                
                <div>
                  <label className="text-sm font-medium">Medicine Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={medicineData.name}
                    onChange={handleMedicineInputChange}
                    placeholder="e.g., Paracetamol 500mg"
                    className="border w-full px-3 py-2 rounded-md dark:bg-slate-700 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={medicineData.category}
                    onChange={handleMedicineInputChange}
                    className="border w-full px-3 py-2 rounded-md dark:bg-slate-700 mt-1"
                  >
                    <option value="">Select Category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={medicineData.price}
                      onChange={handleMedicineInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="border w-full px-3 py-2 rounded-md dark:bg-slate-700 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={medicineData.expiryDate}
                      onChange={handleMedicineInputChange}
                      className="border w-full px-3 py-2 rounded-md dark:bg-slate-700 mt-1"
                    />
                  </div>
                </div>

                {medicineData.photoUrl && (
                  <button
                    onClick={handleSaveMedicine}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 w-full font-semibold mt-4"
                  >
                    Add to Inventory
                  </button>
                )}
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </header>
  );
}