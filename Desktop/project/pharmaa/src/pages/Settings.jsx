// C:\Users\User\Desktop\pharmaa\src\pages\Settings.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import MedicalParticles from "../components/MedicalParticles";
import { Camera, Mail, Bell, Shield, Users, Trash2, Key } from "lucide-react";

// --- Main Settings Component ---
function SettingsComponent() {
  const { theme, toggleTheme } = useTheme();
  
  // CAPTCHA State
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAction, setCaptchaAction] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Shared state with Topbar
  const [sharedProfile, setSharedProfile] = useState(() => {
    const saved = localStorage.getItem("sharedPharmacyProfile");
    return saved ? JSON.parse(saved) : {
      name: "Athanex Pharmacy",
      address: "123 Health St, Addis Ababa, Ethiopia",
      phone: "+251 91 123 4567",
      email: "contact@athanex.com",
      timezone: "Africa/Addis_Ababa",
      currency: "ETB",
      avatarUrl: "https://placehold.co/100x100/A78BFA/FFFFFF?text=AP",
    };
  });

  const [profile, setProfile] = useState(sharedProfile);

  // Profile Picture States
  const [avatar, setAvatar] = useState(profile.avatarUrl);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modalError, setModalError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Staff - Shared with Topbar for notifications
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem("sharedPharmacyStaff");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Admin User",
        email: "admin@athanex.com",
        role: "Admin",
        status: "Active",
      },
    ];
  });

  // Notifications - Shared with Topbar
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("sharedPharmacyNotifications");
    return saved ? JSON.parse(saved) : { 
      email: true, 
      sms: false, 
      push: true,
      emailNotifications: {
        enabled: false,
        recipient: 'pharmacy@yourdomain.com',
        lowStock: true,
        expiringSoon: true,
        outOfStock: true,
        dailyDigest: false
      }
    };
  });

  // Inventory data from Topbar
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("sharedPharmacyInventory");
    return saved ? JSON.parse(saved) : [];
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const cardClasses = `relative rounded-xl p-6 shadow-lg ${
    theme === "dark" ? "bg-slate-800 text-gray-200" : "bg-white text-gray-800"
  }`;
  const inputClasses = `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    theme === "dark" ? "bg-slate-700 border-gray-600" : "bg-white border-gray-300"
  }`;
  const labelClasses = `text-sm font-medium ${
    theme === "dark" ? "text-gray-300" : "text-gray-600"
  }`;

  // reCAPTCHA Enterprise Integration
  const executeRecaptcha = async (action) => {
    if (!window.grecaptcha || !window.grecaptcha.enterprise) {
      console.error('reCAPTCHA Enterprise not loaded');
      return null;
    }

    try {
      setIsVerifying(true);
      const token = await window.grecaptcha.enterprise.execute(
        '6LeGiOQrAAAAAE5OAKkQw3D-uADyUX3tYGYtryHX', 
        { action }
      );
      setCaptchaToken(token);
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      setModalError("Security verification failed. Please try again.");
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  // Verify CAPTCHA token with your backend
  const verifyCaptchaToken = async (token, action) => {
    try {
      // Send to your backend for verification
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('CAPTCHA verification failed:', error);
      return false;
    }
  };

  // Protected actions that require CAPTCHA
  const handleProtectedAction = async (action, callback) => {
    const token = await executeRecaptcha(action);
    if (token) {
      const isValid = await verifyCaptchaToken(token, action);
      if (isValid) {
        callback();
      } else {
        setModalError("Security verification failed. Please try again.");
      }
    }
  };

  // Sync with shared storage
  useEffect(() => {
    const savedProfile = localStorage.getItem("sharedPharmacyProfile");
    const savedStaff = localStorage.getItem("sharedPharmacyStaff");
    const savedNotifications = localStorage.getItem("sharedPharmacyNotifications");
    const savedInventory = localStorage.getItem("sharedPharmacyInventory");
    
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setSharedProfile(parsed);
      setProfile(parsed);
      setAvatar(parsed.avatarUrl);
    }
    if (savedStaff) setStaff(JSON.parse(savedStaff));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // Profile Picture Handlers
  useEffect(() => {
    const savedAvatar = localStorage.getItem("sharedPharmacyAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
      setProfile(prev => ({ ...prev, avatarUrl: savedAvatar }));
      setSharedProfile(prev => ({ ...prev, avatarUrl: savedAvatar }));
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const avatarUrl = reader.result;
        setAvatar(avatarUrl);
        setProfile((prev) => ({ ...prev, avatarUrl }));
        setSharedProfile((prev) => ({ ...prev, avatarUrl }));
        localStorage.setItem("sharedPharmacyAvatar", avatarUrl);
        localStorage.setItem("sharedPharmacyProfile", JSON.stringify({...profile, avatarUrl}));
      };
      reader.readAsDataURL(file);
    }
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
    const avatarUrl = canvas.toDataURL("image/png");
    setAvatar(avatarUrl);
    setProfile((prev) => ({ ...prev, avatarUrl }));
    setSharedProfile((prev) => ({ ...prev, avatarUrl }));
    localStorage.setItem("sharedPharmacyAvatar", avatarUrl);
    localStorage.setItem("sharedPharmacyProfile", JSON.stringify({...profile, avatarUrl}));
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setUseCamera(false);
    setCameraModalOpen(false);
  };

  const handleModalClose = () => {
    setCameraModalOpen(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setUseCamera(false);
    setModalError("");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
    setSharedProfile(profile);
    localStorage.setItem("sharedPharmacyProfile", JSON.stringify(profile));
    alert("Profile saved! Changes will reflect across the app.");
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    // Execute CAPTCHA for staff addition
    const token = await executeRecaptcha('ADD_STAFF');
    if (!token) {
      setModalError("Security verification required to add staff.");
      return;
    }

    const formData = new FormData(e.target);
    const newStaff = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      status: "Active",
    };
    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    localStorage.setItem("sharedPharmacyStaff", JSON.stringify(updatedStaff));
    
    // Add notification for new staff
    const newNotification = {
      id: Date.now(),
      message: `New staff member added: ${newStaff.name}`,
      time: "Just now",
      read: false,
      type: "staff",
      priority: "medium"
    };
    addNotification(newNotification);
    
    setInviteModalOpen(false);
    setCaptchaToken(""); // Reset token after use
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => {
      const updated = { ...prev, [name]: checked };
      localStorage.setItem("sharedPharmacyNotifications", JSON.stringify(updated));
      return updated;
    });
  };

  // Email Notification Handlers
  const handleEmailNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotifications((prev) => {
      const updated = {
        ...prev,
        emailNotifications: {
          ...prev.emailNotifications,
          [name]: type === 'checkbox' ? checked : value
        }
      };
      localStorage.setItem("sharedPharmacyNotifications", JSON.stringify(updated));
      return updated;
    });
  };

  // Add notification to shared storage
  const addNotification = (notification) => {
    const existing = JSON.parse(localStorage.getItem("sharedNotifications") || "[]");
    const updated = [notification, ...existing.slice(0, 49)]; // Keep last 50
    localStorage.setItem("sharedNotifications", JSON.stringify(updated));
  };

  const handleClearData = async () => {
    // Execute CAPTCHA for data clearance
    const token = await executeRecaptcha('CLEAR_DATA');
    if (!token) {
      setModalError("Security verification required to clear data.");
      return;
    }

    localStorage.removeItem("sharedPharmacyProfile");
    localStorage.removeItem("sharedPharmacyStaff");
    localStorage.removeItem("sharedPharmacyNotifications");
    localStorage.removeItem("sharedPharmacyAvatar");
    localStorage.removeItem("sharedPharmacyInventory");
    localStorage.removeItem("sharedNotifications");
    
    const defaultProfile = {
      name: "Athanex Pharmacy",
      address: "123 Health St, Addis Ababa, Ethiopia",
      phone: "+251 91 123 4567",
      email: "contact@athanex.com",
      timezone: "Africa/Addis_Ababa",
      currency: "ETB",
      avatarUrl: "https://placehold.co/100x100/A78BFA/FFFFFF?text=AP",
    };
    
    setProfile(defaultProfile);
    setSharedProfile(defaultProfile);
    setAvatar("https://placehold.co/100x100/A78BFA/FFFFFF?text=AP");
    setStaff([{ id: 1, name: "Admin User", email: "admin@athanex.com", role: "Admin", status: "Active" }]);
    setNotifications({ 
      email: true, 
      sms: false, 
      push: true,
      emailNotifications: {
        enabled: false,
        recipient: 'pharmacy@yourdomain.com',
        lowStock: true,
        expiringSoon: true,
        outOfStock: true,
        dailyDigest: false
      }
    });
    setInventory([]);
    setConfirmModalOpen(false);
    setCaptchaToken(""); // Reset token after use
    
    alert("All data cleared! App will refresh.");
    window.location.reload();
  };

  // Test email notification function
  const sendTestEmail = async () => {
    const token = await executeRecaptcha('SEND_EMAIL');
    if (!token) {
      setModalError("Security verification required to send test email.");
      return;
    }

    const { recipient } = notifications.emailNotifications;
    const subject = "Test Email - Pharmacy Inventory System";
    const body = "This is a test email from your Pharmacy Inventory System. Email notifications are working correctly!";
    window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setCaptchaToken(""); // Reset token after use
  };

  // Inventory statistics
  const inventoryStats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.stock < (item.lowStockThreshold || 25)).length,
    expiringSoon: inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    }).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0)
  };

  return (
    <div className={`relative flex flex-col h-screen p-6 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
      <MedicalParticles variant="default" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Settings</h1>

        {/* Security Status */}
        <div className={`${cardClasses} mb-6 border-l-4 border-green-500`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-semibold">Security Status</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  reCAPTCHA Enterprise Protected
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-600">Active</div>
              <div className="text-xs text-gray-500">All sensitive actions secured</div>
            </div>
          </div>
        </div>

        {/* Pharmacy Profile */}
        <div className={cardClasses}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pharmacy Profile
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-2 flex items-center gap-4 mb-4">
              <img src={avatar} alt="Pharmacy Avatar" className="w-20 h-20 rounded-full bg-gray-200" />
              <div>
                <button
                  onClick={() => setCameraModalOpen(true)}
                  className="flex items-center gap-2 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
                >
                  <Camera className="w-5 h-5" />
                  Change Profile Picture
                </button>
                <p className="text-xs text-gray-500 mt-1">This will update across the app</p>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Address</label>
              <input
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Phone</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Email</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Timezone</label>
              <input
                name="timezone"
                value={profile.timezone}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Currency</label>
              <input
                name="currency"
                value={profile.currency}
                onChange={handleProfileChange}
                className={inputClasses}
              />
            </div>
          </div>
          <button
            onClick={handleProfileSave}
            className="mt-4 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
          >
            Save Profile
          </button>
        </div>

        {/* Inventory Overview */}
        <div className={`${cardClasses} mt-6`}>
          <h3 className="text-lg font-semibold mb-4">Inventory Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inventoryStats.totalItems}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Total Items</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inventoryStats.lowStock}</div>
              <div className="text-xs text-orange-600 dark:text-orange-400">Low Stock</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{inventoryStats.expiringSoon}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Expiring Soon</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">${inventoryStats.totalValue.toFixed(2)}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Total Value</div>
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className={`${cardClasses} mt-6`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="enabled"
                checked={notifications.emailNotifications.enabled}
                onChange={handleEmailNotificationChange}
                className="rounded border-gray-300"
              />
              Enable Email Notifications
            </label>

            {notifications.emailNotifications.enabled && (
              <>
                <div>
                  <label className={labelClasses}>Recipient Email</label>
                  <input
                    type="email"
                    name="recipient"
                    value={notifications.emailNotifications.recipient}
                    onChange={handleEmailNotificationChange}
                    className={inputClasses}
                    placeholder="pharmacy@yourdomain.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="lowStock"
                      checked={notifications.emailNotifications.lowStock}
                      onChange={handleEmailNotificationChange}
                      className="rounded border-gray-300"
                    />
                    Low Stock Alerts
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="outOfStock"
                      checked={notifications.emailNotifications.outOfStock}
                      onChange={handleEmailNotificationChange}
                      className="rounded border-gray-300"
                    />
                    Out of Stock Alerts
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="expiringSoon"
                      checked={notifications.emailNotifications.expiringSoon}
                      onChange={handleEmailNotificationChange}
                      className="rounded border-gray-300"
                    />
                    Expiry Alerts (30 days)
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="dailyDigest"
                      checked={notifications.emailNotifications.dailyDigest}
                      onChange={handleEmailNotificationChange}
                      className="rounded border-gray-300"
                    />
                    Daily Digest (8 AM)
                  </label>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={sendTestEmail}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Verifying..." : "Send Test Email"}
                  </button>
                </div>

                {isVerifying && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    🔒 Verifying security check...
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* General Notifications */}
        <div className={`${cardClasses} mt-6`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            General Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="email"
                checked={notifications.email}
                onChange={handleNotificationChange}
                className="rounded border-gray-300"
              />
              Email Notifications (General)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sms"
                checked={notifications.sms}
                onChange={handleNotificationChange}
                className="rounded border-gray-300"
              />
              SMS Notifications
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="push"
                checked={notifications.push}
                onChange={handleNotificationChange}
                className="rounded border-gray-300"
              />
              Push Notifications
            </label>
          </div>
        </div>

        {/* Staff Management */}
        <div className={`${cardClasses} mt-6`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Management ({staff.length})
          </h3>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700">
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.email} | {member.role} | {member.status}
                  </p>
                </div>
              </div>
            ))}
            <button
              onClick={() => setInviteModalOpen(true)}
              className="mt-4 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
            >
              Add Staff Member
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className={`${cardClasses} mt-6`}>
          <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This will clear all pharmacy data including profile, staff, inventory, and settings.
          </p>
          <button
            onClick={() => setConfirmModalOpen(true)}
            className="rounded-md bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-500"
          >
            Clear All Data
          </button>
        </div>

        {/* Profile Picture Modal */}
        {cameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleModalClose} />
            <div className={`${cardClasses} w-full max-w-md`}>
              <h3 className="text-lg font-semibold mb-4">Change Profile Picture</h3>
              {modalError && <p className="text-red-500 text-sm mb-4">{modalError}</p>}
              {!useCamera && (
                <div className="flex flex-col items-center gap-4">
                  <div className="py-10 border-2 border-dashed rounded-lg w-full text-center">
                    <button
                      onClick={() => document.getElementById('avatar-file-input').click()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 mb-2"
                    >
                      Upload Photo
                    </button>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-sm my-2">OR</p>
                    <button
                      onClick={startCamera}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                      Use Camera
                    </button>
                  </div>
                </div>
              )}
              {useCamera && (
                <div className="flex flex-col items-center gap-4">
                  <h4 className="text-lg font-semibold">Camera</h4>
                  <video ref={videoRef} autoPlay className="w-full h-60 bg-gray-200 dark:bg-slate-700 rounded-md" />
                  <button
                    onClick={handleCapturePhoto}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                  >
                    Capture Photo
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setInviteModalOpen(false)}
            />
            <div className={`${cardClasses} w-full max-w-md`}>
              <h3 className="text-lg font-semibold mb-4">Add Staff Member</h3>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className={labelClasses}>Name</label>
                  <input name="name" required className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Email</label>
                  <input type="email" name="email" required className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Role</label>
                  <select name="role" required className={inputClasses}>
                    <option>Pharmacist</option>
                    <option>Admin</option>
                    <option>Cashier</option>
                    <option>Manager</option>
                  </select>
                </div>
                
                {isVerifying && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                    🔒 Verifying security check...
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 rounded-md border dark:border-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Adding..." : "Add Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirmModalOpen(false)}
            />
            <div className={`${cardClasses} w-full max-w-md text-center`}>
              <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
              <p className="text-sm text-gray-500 mb-4">
                This will permanently delete all pharmacy data including:
                <br />
                • Pharmacy Profile
                <br />
                • Staff Members
                <br />
                • Inventory Data
                <br />
                • Notification Settings
                <br />
                This action cannot be undone.
              </p>

              {isVerifying && (
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                  🔒 Verifying security check...
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-md border dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  disabled={isVerifying}
                  className="px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "Yes, Clear All Data"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsComponent;