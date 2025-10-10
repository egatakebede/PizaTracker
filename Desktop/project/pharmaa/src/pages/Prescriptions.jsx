import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Moon, Sun, FileText, Search, Filter, Plus, MessageCircle, MapPin, Phone, Calendar, User, Pill, AlertTriangle, Clock, CheckCircle, XCircle, Download, Upload, BarChart3 } from 'lucide-react';
import { useTheme } from "../components/ThemeContext";
import MedicalParticles from "../components/MedicalParticles";

// --- Helper Components & Hooks ---

const TiltCard = ({ children, className, ...props }) => (
  <div className={`transform transition-transform duration-300 hover:rotate-1 hover:scale-105 ${className}`} {...props}>
    {children}
  </div>
);

const StatusBadge = ({ status, size = "sm" }) => {
  const statusConfig = {
    Pending: { color: "yellow", text: "Pending" },
    Processed: { color: "green", text: "Processed" },
    Expired: { color: "red", text: "Expired" },
    Urgent: { color: "orange", text: "Urgent" },
    Waiting: { color: "blue", text: "Waiting" }
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={`${sizeClasses[size]} rounded-full font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900 dark:text-${config.color}-200`}>
      {config.text}
    </span>
  );
};

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
      setStatus(script.getAttribute("data-status"));
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
    window.L.marker([location.lat, location.lng]).addTo(map);
    setTimeout(() => map.invalidateSize(), 100);
    return () => {
      map.remove();
    };
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
  return <div ref={mapRef} style={{ height: '250px', width: '100%', borderRadius: '12px', zIndex: 0 }}></div>;
};

// --- Main Prescriptions Component ---

export default function Prescriptions() {
  const { theme } = useTheme();

  const hospitalData = {
    'Black Lion Hospital': {
      name: 'Black Lion Specialized Hospital',
      address: 'Tikur Anbessa, Addis Ababa, Ethiopia',
      contact: '+251 11 551 1211',
      website: 'https://www.aau.edu.et/chs/black-lion-specialized-hospital/',
      location: { lat: 9.0223, lng: 38.7486 }
    },
    'St. Paul\'s Hospital': {
      name: 'St. Paul\'s Hospital Millennium Medical College',
      address: 'Gulele, Addis Ababa, Ethiopia',
      contact: '+251 11 123 4567',
      website: 'https://sphmmc.edu.et/',
      location: { lat: 9.0300, lng: 38.7500 }
    }
  };

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmacyPrescriptionsV5');
      return saved ? JSON.parse(saved) : [
        { 
          id: "RX-001", 
          patientName: "Jane Doe", 
          birthDate: "1993-05-15", 
          patientContact: "555-1234", 
          dateIssued: "2025-09-11", 
          expiryDate: "2025-10-11",
          status: "Pending", 
          priority: "normal",
          notes: "Patient has mild headache.", 
          medicines: [
            { name: "Paracetamol 500mg", quantity: 2, dosage: "1 pill twice a day", duration: "5 days" },
            { name: "Ibuprofen 400mg", quantity: 1, dosage: "1 pill after meals", duration: "3 days" }
          ], 
          source: 'pharmacist',
          allergies: "None",
          insurance: "ABC Insurance",
          doctorNotes: "Follow up if symptoms persist"
        },
        { 
          id: "RX-002", 
          patientName: "John Smith", 
          birthDate: "1985-10-20", 
          patientContact: "555-5678", 
          dateIssued: "2025-09-12", 
          expiryDate: "2025-10-12",
          status: "Processed", 
          priority: "normal",
          notes: "Follow up after one week.", 
          medicines: [
            { name: "Amoxicillin 250mg", quantity: 1, dosage: "1 capsule every 8 hours", duration: "7 days" }
          ], 
          source: 'pharmacist',
          allergies: "Penicillin",
          insurance: "XYZ Health",
          doctorNotes: "Complete full course"
        },
        { 
          id: "RX-HOS-003", 
          patientName: "Abebe Bikila", 
          birthDate: "1978-02-28", 
          patientContact: "555-9900", 
          dateIssued: "2025-09-10", 
          expiryDate: "2025-09-25",
          status: "Pending", 
          priority: "urgent",
          notes: "Received via secure mail.", 
          medicines: [
            { name: "Lisinopril 10mg", quantity: 1, dosage: "10mg once daily", duration: "30 days" }
          ], 
          source: 'hospital', 
          doctorName: 'Dr. Eleni', 
          hospitalName: 'Black Lion Hospital', 
          conversation: [
            { sender: 'Dr. Eleni', text: 'Please confirm you have received this prescription for Abebe Bikila.', timestamp: '11:15 AM' }, 
            { sender: 'You', text: 'Received. We are processing it now.', timestamp: '11:17 AM' }
          ],
          allergies: "None known",
          insurance: "National Health",
          doctorNotes: "Monitor blood pressure weekly"
        },
      ];
    } catch (error) {
      console.error("Failed to parse prescriptions from localStorage", error);
      return [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [hospitalModalOpen, setHospitalModalOpen] = useState(false);
  const [messagingModalOpen, setMessagingModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [viewingHospital, setViewingHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedPrescriptions, setSelectedPrescriptions] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(false);

  useEffect(() => {
    localStorage.setItem('pharmacyPrescriptionsV5', JSON.stringify(prescriptions));
  }, [prescriptions]);

  // Enhanced analytics
  const analytics = useMemo(() => {
    const total = prescriptions.length;
    const pending = prescriptions.filter(p => p.status === "Pending").length;
    const processed = prescriptions.filter(p => p.status === "Processed").length;
    const expired = prescriptions.filter(p => new Date(p.expiryDate) < new Date() && p.status !== "Processed").length;
    const urgent = prescriptions.filter(p => p.priority === "urgent").length;
    const hospitalRx = prescriptions.filter(p => p.source === "hospital").length;
    const pharmacistRx = prescriptions.filter(p => p.source === "pharmacist").length;
    
    // Recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recent = prescriptions.filter(p => new Date(p.dateIssued) >= oneWeekAgo).length;

    return {
      total, pending, processed, expired, urgent, hospitalRx, pharmacistRx, recent
    };
  }, [prescriptions]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : 0;
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "urgent": return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      case "high": return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      default: return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const handleAdd = () => setModalOpen(true);

  const handleViewHospital = (hospitalName) => {
    const hospital = hospitalData[hospitalName];
    if (hospital) {
      setViewingHospital(hospital);
      setHospitalModalOpen(true);
    }
  };

  const handleOpenMessaging = (prescription) => {
    setActiveConversation(prescription);
    setMessagingModalOpen(true);
  };

  const handleSendMessage = (prescriptionId, text) => {
    const newMessage = {
      sender: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedPrescriptions = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        const conversation = p.conversation ? [...p.conversation, newMessage] : [newMessage];
        return { ...p, conversation };
      }
      return p;
    });
    setPrescriptions(updatedPrescriptions);
    setActiveConversation(prev => ({ ...prev, conversation: [...(prev.conversation || []), newMessage] }));
  };

  // Enhanced filtering
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(p =>
      (filterStatus === 'all' || p.status === filterStatus) &&
      (filterPriority === 'all' || p.priority === filterPriority) &&
      (filterSource === 'all' || p.source === filterSource) &&
      (p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map(p => ({ 
      ...p, 
      patientAge: calculateAge(p.birthDate),
      expiringSoon: isExpiringSoon(p.expiryDate),
      expired: isExpired(p.expiryDate)
    }));
  }, [prescriptions, searchTerm, filterStatus, filterPriority, filterSource]);

  // Bulk actions
  const toggleSelectPrescription = (prescriptionId) => {
    const newSelected = new Set(selectedPrescriptions);
    if (newSelected.has(prescriptionId)) {
      newSelected.delete(prescriptionId);
    } else {
      newSelected.add(prescriptionId);
    }
    setSelectedPrescriptions(newSelected);
  };

  const selectAll = () => {
    if (selectedPrescriptions.size === filteredPrescriptions.length) {
      setSelectedPrescriptions(new Set());
    } else {
      setSelectedPrescriptions(new Set(filteredPrescriptions.map(p => p.id)));
    }
  };

  const handleBulkProcess = () => {
    setPrescriptions(prev => prev.map(p => 
      selectedPrescriptions.has(p.id) ? { ...p, status: 'Processed' } : p
    ));
    setSelectedPrescriptions(new Set());
    setBulkAction(false);
  };

  const handleBulkDelete = () => {
    setPrescriptions(prev => prev.filter(p => !selectedPrescriptions.has(p.id)));
    setSelectedPrescriptions(new Set());
    setBulkAction(false);
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['ID', 'Patient Name', 'Age', 'Status', 'Priority', 'Source', 'Date Issued', 'Expiry Date', 'Doctor', 'Hospital', 'Medicines Count'];
    const csvData = prescriptions.map(p => [
      p.id,
      p.patientName,
      calculateAge(p.birthDate),
      p.status,
      p.priority,
      p.source,
      p.dateIssued,
      p.expiryDate,
      p.doctorName || 'N/A',
      p.hospitalName || 'N/A',
      p.medicines.length
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prescriptions-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const PrescriptionFormModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ 
      patientName: '', 
      birthDate: '', 
      patientContact: '', 
      notes: '', 
      allergies: '',
      insurance: '',
      doctorNotes: '',
      priority: 'normal',
      expiryDate: '',
      medicines: [{ name: '', quantity: 1, dosage: '', duration: '' }] 
    });

    useEffect(() => {
      // Set default expiry date to 30 days from now
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 30);
      setFormData({ 
        patientName: '', 
        birthDate: '', 
        patientContact: '', 
        notes: '', 
        allergies: '',
        insurance: '',
        doctorNotes: '',
        priority: 'normal',
        expiryDate: defaultExpiry.toISOString().split('T')[0],
        medicines: [{ name: '', quantity: 1, dosage: '', duration: '' }] 
      });
    }, [isOpen]);

    const handleChange = (e, index) => {
      const { name, value } = e.target;
      if (name.startsWith('med-')) {
        const field = name.split('-')[1];
        const newMedicines = [...formData.medicines];
        newMedicines[index][field] = value;
        setFormData(prev => ({ ...prev, medicines: newMedicines }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    const addMedicine = () => setFormData(prev => ({ 
      ...prev, 
      medicines: [...prev.medicines, { name: '', quantity: 1, dosage: '', duration: '' }] 
    }));

    const removeMedicine = (index) => {
      if (formData.medicines.length <= 1) return;
      setFormData(prev => ({ 
        ...prev, 
        medicines: prev.medicines.filter((_, i) => i !== index) 
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const cleanedMedicines = formData.medicines.filter(m => m.name.trim() !== '');
      if (!formData.patientName || !formData.birthDate || cleanedMedicines.length === 0) {
        alert("Patient Name, Birth Date, and at least one medicine are required.");
        return;
      }
      onSave({ ...formData, medicines: cleanedMedicines });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full max-w-4xl max-h-[90vh] animate-modal-pop rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Add New Prescription</h3>
            <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Patient Information</h4>
                
                <div>
                  <label className="text-sm font-medium">Patient Name *</label>
                  <input required name="patientName" value={formData.patientName} onChange={handleChange} 
                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Birth Date *</label>
                    <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} 
                      max={new Date().toISOString().split("T")[0]} 
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact</label>
                    <input name="patientContact" value={formData.patientContact} onChange={handleChange} 
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Allergies</label>
                  <input name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any allergies"
                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                </div>

                <div>
                  <label className="text-sm font-medium">Insurance</label>
                  <input name="insurance" value={formData.insurance} onChange={handleChange} placeholder="Insurance provider"
                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>

              {/* Prescription Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Prescription Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange}
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expiry Date *</label>
                    <input required type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Doctor Notes</label>
                  <textarea name="doctorNotes" value={formData.doctorNotes} onChange={handleChange} rows="3"
                    placeholder="Additional notes from the doctor"
                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>

                <div>
                  <label className="text-sm font-medium">Pharmacist Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2"
                    placeholder="Additional notes"
                    className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
              </div>
            </div>

            {/* Medicines Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-lg border-b pb-2 mb-4">Medicines</h4>
              {formData.medicines.map((med, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 mb-4 items-end p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="col-span-4">
                    <label className="text-sm font-medium">Medicine Name *</label>
                    <input name={`med-name`} value={med.name} onChange={(e) => handleChange(e, index)} 
                      placeholder="e.g., Paracetamol 500mg"
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <input type="number" name={`med-quantity`} value={med.quantity} onChange={(e) => handleChange(e, index)} 
                      min="1" placeholder="Qty"
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-sm font-medium">Dosage</label>
                    <input name={`med-dosage`} value={med.dosage} onChange={(e) => handleChange(e, index)} 
                      placeholder="e.g., 1 pill twice daily"
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Duration</label>
                    <input name={`med-duration`} value={med.duration} onChange={(e) => handleChange(e, index)} 
                      placeholder="e.g., 7 days"
                      className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-600 dark:border-gray-500" />
                  </div>
                  <div className="col-span-1">
                    <button type="button" onClick={() => removeMedicine(index)} disabled={formData.medicines.length <= 1} 
                      className="h-10 w-10 text-red-500 disabled:text-gray-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 disabled:hover:bg-transparent flex items-center justify-center">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addMedicine} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                <Plus className="w-4 h-4" />
                Add another medicine
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
                Save Prescription
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const HospitalProfileModal = ({ isOpen, onClose, hospital }) => {
    if (!isOpen || !hospital) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full max-w-lg animate-modal-pop rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Hospital Profile</h3>
            <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold">{hospital.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{hospital.address}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{hospital.contact}</span>
              </div>
              <a href={hospital.website} target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                <span>Website</span>
              </a>
            </div>

            <div>
              <h5 className="font-semibold mb-2">Location</h5>
              <MapComponent location={hospital.location} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2 p-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const MessagingModal = ({ isOpen, onClose, prescription, onSendMessage }) => {
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [prescription?.conversation]);

    if (!isOpen || !prescription) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      onSendMessage(prescription.id, text);
      setText('');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full max-w-lg h-[70vh] flex flex-col animate-modal-pop rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <div className="flex-shrink-0 flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="font-semibold text-lg">Chat re: {prescription.id}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">With {prescription.doctorName} at {prescription.hospitalName}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
          </div>
          <div className="flex-grow p-6 overflow-y-auto space-y-4">
            {(prescription.conversation || []).map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'You' ? 'bg-indigo-600 text-white rounded-br-none' : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-bl-none`}`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t flex items-center gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className={`w-full p-2 rounded-full border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            />
            <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  const AnalyticsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full max-w-4xl max-h-[90vh] animate-modal-pop rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Prescriptions Analytics</h3>
            <button onClick={onClose} className="p-1 rounded-full text-xl h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">✕</button>
          </div>
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.total}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Prescriptions</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.pending}</div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Pending</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.processed}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Processed</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{analytics.expired}</div>
                <div className="text-sm text-red-600 dark:text-red-400">Expired</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Source Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Hospital Prescriptions</span>
                    <span className="font-semibold">{analytics.hospitalRx}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pharmacist Prescriptions</span>
                    <span className="font-semibold">{analytics.pharmacistRx}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Priority Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Urgent Prescriptions</span>
                    <span className="font-semibold text-red-600">{analytics.urgent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recent (7 days)</span>
                    <span className="font-semibold text-green-600">{analytics.recent}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSave = (data) => {
    const newPrescription = { 
      ...data, 
      id: `RX-${Date.now()}`, 
      patientAge: calculateAge(data.birthDate), 
      status: 'Pending', 
      dateIssued: new Date().toISOString().split("T")[0], 
      source: 'pharmacist' 
    };
    setPrescriptions([newPrescription, ...prescriptions]);
  };

  return (
    <div className={`relative min-h-screen p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <MedicalParticles />
      
      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Prescriptions Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage patient prescriptions with digital workflow and hospital integrations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setAnalyticsModalOpen(true)}
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
              onClick={() => setBulkAction(!bulkAction)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bulkAction 
                  ? 'bg-indigo-600 text-white' 
                  : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Bulk Actions
            </button>
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Prescription
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-blue-500 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Total
            </h3>
            <p className="text-3xl font-bold mt-2">{analytics.total}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-orange-500 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Pending
            </h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">{analytics.pending}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-green-500 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Processed
            </h3>
            <p className="text-3xl font-bold text-green-500 mt-2">{analytics.processed}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md border-l-4 border-red-500 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Urgent
            </h3>
            <p className="text-3xl font-bold text-red-500 mt-2">{analytics.urgent}</p>
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
              placeholder="Search by ID, patient name, or doctor..."
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
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Expired">Expired</option>
            </select>

            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
              }`}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>

            <select 
              value={filterSource} 
              onChange={(e) => setFilterSource(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700 text-white'
              }`}
            >
              <option value="all">All Sources</option>
              <option value="hospital">Hospital</option>
              <option value="pharmacist">Pharmacist</option>
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

        {/* Bulk Actions */}
        {bulkAction && (
          <div className="flex flex-wrap gap-2 mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center gap-2 mr-4">
              <input
                type="checkbox"
                checked={selectedPrescriptions.size === filteredPrescriptions.length}
                onChange={selectAll}
                className="rounded"
              />
              <span className="text-sm">
                Select All ({selectedPrescriptions.size} selected)
              </span>
            </div>
            <button
              onClick={handleBulkProcess}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Mark as Processed
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setBulkAction(false)}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Prescriptions Grid */}
      <div className={`relative z-10 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredPrescriptions.map((p) => {
          const isHospitalRx = p.source === 'hospital';
          const priorityStyle = getPriorityStyles(p.priority);
          
          return (
            <TiltCard
              key={p.id}
              className={`relative rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-black'
              } ${priorityStyle} ${p.expired ? 'border-red-500' : ''} ${
                p.expiringSoon ? 'animate-pulse border-orange-500' : ''
              }`}
            >
              {/* Bulk Action Checkbox */}
              {bulkAction && (
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedPrescriptions.has(p.id)}
                    onChange={() => toggleSelectPrescription(p.id)}
                    className="rounded"
                  />
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    p.expired ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                    p.expiringSoon ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' :
                    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{p.patientName} ({p.patientAge})</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{p.id} • {p.dateIssued}</p>
                    {isHospitalRx && (
                      <p className="text-xs text-indigo-400 mt-1 font-semibold cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); handleViewHospital(p.hospitalName); }}>
                        From {p.hospitalName} (Dr. {p.doctorName})
                      </p>
                    )}
                  </div>
                </div>
                <StatusBadge status={p.expired ? "Expired" : p.status} />
              </div>

              {/* Medicines */}
              <div className="text-sm space-y-3 mb-4">
                {p.medicines.map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-gray-500 ml-2">({m.quantity})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 dark:text-gray-300">{m.dosage}</div>
                      {m.duration && <div className="text-xs text-gray-500">{m.duration}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="space-y-2 text-sm mb-4">
                {p.allergies && p.allergies !== "None" && (
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Allergies: {p.allergies}</span>
                  </div>
                )}
                {p.insurance && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <User className="w-3 h-3" />
                    <span>Insurance: {p.insurance}</span>
                  </div>
                )}
                {p.expiryDate && (
                  <div className={`flex items-center gap-2 ${
                    p.expired ? 'text-red-600 dark:text-red-400' :
                    p.expiringSoon ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {p.expiryDate} {p.expiringSoon && '(Soon)'}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {(p.notes || p.doctorNotes) && (
                <div className="text-sm space-y-2 mb-4">
                  {p.doctorNotes && (
                    <p className="italic border-l-4 pl-3 py-1 border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30">
                      <strong>Doctor:</strong> {p.doctorNotes}
                    </p>
                  )}
                  {p.notes && (
                    <p className="italic border-l-4 pl-3 py-1 border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30">
                      <strong>Pharmacist:</strong> {p.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setPrescriptions(prescriptions.map(item => item.id === p.id ? { ...item, status: 'Processed' } : item))}
                  className={`flex-1 rounded-md px-3 py-2 text-sm ${
                    theme === 'dark' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                  } disabled:bg-gray-400 disabled:hover:bg-gray-400`}
                  disabled={p.status === 'Processed' || p.expired}
                >
                  {p.expired ? 'Expired' : p.status === 'Processed' ? 'Processed' : 'Mark Processed'}
                </button>
                {isHospitalRx && (
                  <button
                    onClick={() => handleOpenMessaging(p)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm ${
                      theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Message
                  </button>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <div className={`relative z-10 text-center py-12 rounded-xl ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No prescriptions found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterSource !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first prescription'
            }
          </p>
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500"
          >
            Add Prescription
          </button>
        </div>
      )}

      {/* Modals */}
      <PrescriptionFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
      <HospitalProfileModal isOpen={hospitalModalOpen} onClose={() => setHospitalModalOpen(false)} hospital={viewingHospital} />
      <MessagingModal isOpen={messagingModalOpen} onClose={() => setMessagingModalOpen(false)} prescription={activeConversation} onSendMessage={handleSendMessage} />
      <AnalyticsModal isOpen={analyticsModalOpen} onClose={() => setAnalyticsModalOpen(false)} />
    </div>
  );
}