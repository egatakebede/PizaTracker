import React, { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";

// --- Helper Components & Hooks ---
const MedicalParticles = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.1 }} />
);

const TiltCard = ({ children, className, ...props }) => (
    <div className={className} {...props}>{children}</div>
);

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

// --- Alert Badge Component ---
const AlertBadge = ({ count, type, onClick }) => (
  <div 
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 ${
      type === 'expiry' 
        ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200' 
        : 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200'
    }`}
  >
    <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
    {count} {type === 'expiry' ? 'Expiring' : 'Low Stock'}
  </div>
);

// --- Quick Action Button ---
const QuickAction = ({ icon, label, description, onClick, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    orange: "bg-orange-500 hover:bg-orange-600"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 rounded-xl text-white transition-all hover:scale-105 shadow-lg ${colorClasses[color]}`}
    >
      <div className="text-2xl mr-3">{icon}</div>
      <div className="text-left">
        <div className="font-semibold">{label}</div>
        <div className="text-sm opacity-90">{description}</div>
      </div>
    </button>
  );
};

// --- Main Dashboard Component ---
function DashboardComponent() {
  const { theme } = useTheme();
  const rechartsStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/recharts/2.12.7/recharts.min.js');
  
  // Mock useNavigate
  const navigate = (path) => console.log(`Navigating to ${path}`);

  const [stats, setStats] = useState({ 
    salesToday: 0, 
    pendingOrders: 0, 
    lowStockItems: 0,
    expiringItems: 0,
    totalCustomers: 0,
    monthlyRevenue: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  useEffect(() => {
    // Mock data with enhanced features
    const mockOrders = [
        { status: 'Pending', total: 120.50, customer: 'Jane Doe' },
        { status: 'Completed', total: 85.00, customer: 'John Smith' },
        { status: 'Pending', total: 250.00, customer: 'Abebe Bikila' },
    ];

    const mockInventory = [
        { 
          name: 'Paracetamol 500mg', 
          stock: 150, 
          lowStockThreshold: 100,
          expiryDate: '2024-12-31',
          category: 'Pain Relief',
          sales: 45
        },
        { 
          name: 'Ibuprofen 400mg', 
          stock: 45, 
          lowStockThreshold: 50,
          expiryDate: '2024-11-15',
          category: 'Pain Relief',
          sales: 32
        },
        { 
          name: 'Amoxicillin 250mg', 
          stock: 20, 
          lowStockThreshold: 30,
          expiryDate: '2024-10-20',
          category: 'Antibiotic',
          sales: 28
        },
        { 
          name: 'Vitamin C 1000mg', 
          stock: 15, 
          lowStockThreshold: 25,
          expiryDate: '2024-09-30',
          category: 'Supplement',
          sales: 15
        },
    ];

    const mockPrescriptions = [
        { id: 'RX-HOS-003', source: 'Black Lion Hospital', patient: 'Abebe Bikila' }
    ];

    // Calculate expiry alerts (within 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiringItems = mockInventory.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    });

    const lowStockItems = mockInventory.filter(i => i.stock < i.lowStockThreshold);
    
    const salesToday = mockOrders.reduce((acc, order) => acc + order.total, 0);
    const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;
    
    // Top selling medicines
    const topSelling = [...mockInventory]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setStats({ 
      salesToday, 
      pendingOrders, 
      lowStockItems: lowStockItems.length,
      expiringItems: expiringItems.length,
      totalCustomers: 1247,
      monthlyRevenue: 15420
    });
    
    setRecentActivity([
        { description: `New order from ${mockOrders[0].customer}`, time: '5m ago', type: 'order' },
        { description: `New Rx from ${mockPrescriptions[0].source}`, time: '1h ago', type: 'prescription' },
        { description: `${mockInventory[1].name} is low on stock`, time: '3h ago', type: 'alert' },
        { description: `${expiringItems[0]?.name} expiring soon`, time: '2h ago', type: 'alert' },
    ]);
    
    setSalesData([
        { name: 'Mon', Sales: 400, Orders: 12 }, 
        { name: 'Tue', Sales: 300, Orders: 8 }, 
        { name: 'Wed', Sales: 500, Orders: 15 },
        { name: 'Thu', Sales: 475, Orders: 14 }, 
        { name: 'Fri', Sales: 620, Orders: 18 }, 
        { name: 'Sat', Sales: 800, Orders: 22 },
        { name: 'Sun', Sales: 750, Orders: 20 },
    ]);

    setTopMedicines(topSelling);
    setExpiringSoon(expiringItems);
    setLowStockAlerts(lowStockItems);

  }, []);

  const statCards = [
    { 
      label: "Total Sales Today", 
      value: `$${stats.salesToday.toFixed(2)}`, 
      path: '/reports',
      trend: "+12%",
      icon: "💰"
    },
    { 
      label: "Pending Orders", 
      value: stats.pendingOrders, 
      path: '/sales',
      trend: "-2%",
      icon: "📦"
    },
    { 
      label: "Low Stock Items", 
      value: stats.lowStockItems, 
      path: '/inventory',
      trend: stats.lowStockItems > 0 ? "Attention!" : "Good",
      icon: "⚠️"
    },
    { 
      label: "Expiring Soon", 
      value: stats.expiringItems, 
      path: '/inventory',
      trend: stats.expiringItems > 0 ? "Check!" : "Clear",
      icon: "📅"
    },
    { 
      label: "Total Customers", 
      value: stats.totalCustomers.toLocaleString(), 
      path: '/customers',
      trend: "+5%",
      icon: "👥"
    },
    { 
      label: "Monthly Revenue", 
      value: `$${stats.monthlyRevenue.toLocaleString()}`, 
      path: '/reports',
      trend: "+8%",
      icon: "📊"
    },
  ];

  const quickActions = [
    {
      icon: "📋",
      label: "New Prescription",
      description: "Process new Rx",
      onClick: () => navigate('/prescriptions'),
      color: "green"
    },
    {
      icon: "📦",
      label: "Check Inventory",
      description: "View stock levels",
      onClick: () => navigate('/inventory'),
      color: "blue"
    },
    {
      icon: "⚡",
      label: "Quick Sale",
      description: "Process OTC sale",
      onClick: () => navigate('/sales'),
      color: "orange"
    },
    {
      icon: "🔍",
      label: "Search Medicine",
      description: "Find products",
      onClick: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      },
      color: "red"
    }
  ];

  return (
    <div
      className={`relative min-h-screen p-6 overflow-y-auto ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 to-blue-50 text-gray-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-gray-200"
      }`}
    >
      <MedicalParticles variant="dashboard" />
      
      {/* Header with Alerts */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Pharmacy Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your pharmacy overview.</p>
        </div>
        <div className="flex gap-2">
          {stats.expiringItems > 0 && (
            <AlertBadge 
              count={stats.expiringItems} 
              type="expiry" 
              onClick={() => navigate('/inventory?filter=expiring')}
            />
          )}
          {stats.lowStockItems > 0 && (
            <AlertBadge 
              count={stats.lowStockItems} 
              type="lowstock" 
              onClick={() => navigate('/inventory?filter=lowstock')}
            />
          )}
        </div>
      </div>
      
      {/* Welcome Banner */}
      <TiltCard className="rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="p-8 text-center" style={{ backgroundImage: "linear-gradient(270deg, #16A34A, #3B82F6, #16A34A)", backgroundSize: "200% 200%", animation: "gradient-animation 6s ease infinite" }}>
          <style>{`@keyframes gradient-animation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
          <div className="text-4xl font-extrabold text-white drop-shadow-lg">Welcome, </div>
          <div className="text-lg mt-3 text-white/90">Manage your pharmacy efficiently with real-time insights</div>
        </div>
      </TiltCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((s, i) => (
          <TiltCard
            key={i}
            onClick={() => navigate(s.path)}
            className={`p-4 rounded-2xl shadow-lg transition hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
              theme === "light" ? "bg-white" : "bg-slate-800"
            } ${
              (s.label.includes('Low Stock') && s.value > 0) || 
              (s.label.includes('Expiring') && s.value > 0)
                ? 'border-l-4 border-red-500' 
                : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl">{s.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                s.trend.includes('+') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : s.trend.includes('Attention') || s.trend.includes('Check')
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {s.trend}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">{s.label}</div>
            <div className={`mt-1 text-xl font-bold ${
              s.label.includes('Low Stock') && s.value > 0 ? 'text-red-500' :
              s.label.includes('Expiring') && s.value > 0 ? 'text-orange-500' :
              'text-gray-800 dark:text-gray-200'
            }`}>
              {s.value}
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className={`lg:col-span-2 p-5 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
             <h3 className="font-semibold mb-4">Weekly Sales & Orders Trend</h3>
             {rechartsStatus === 'ready' ? (
                <div style={{ width: '100%', height: 300 }}>
                    <window.Recharts.ResponsiveContainer>
                        <window.Recharts.BarChart data={salesData}>
                            <window.Recharts.CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} />
                            <window.Recharts.XAxis dataKey="name" stroke={theme === 'dark' ? '#94A3B8' : '#4A5568'} />
                            <window.Recharts.YAxis stroke={theme === 'dark' ? '#94A3B8' : '#4A5568'} />
                            <window.Recharts.Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF' }} />
                            <window.Recharts.Legend />
                            <window.Recharts.Bar dataKey="Sales" fill="#3B82F6" name="Sales ($)" />
                            <window.Recharts.Bar dataKey="Orders" fill="#10B981" name="Orders" />
                        </window.Recharts.BarChart>
                    </window.Recharts.ResponsiveContainer>
                 </div>
             ) : <p>Loading chart...</p>}
        </div>

        {/* Recent Activity */}
        <div className={`p-5 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <span className="text-xs text-gray-500">Last 24 hours</span>
            </div>
            <ul className="space-y-4">
                {recentActivity.map((activity, i) => (
                    <li key={i} className={`border-l-4 pl-3 ${
                      activity.type === 'alert' ? 'border-red-500' :
                      activity.type === 'order' ? 'border-blue-500' :
                      'border-green-500'
                    }`}>
                        <p className="font-semibold text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{activity.time}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Bottom Section: Alerts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <div className={`p-5 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className="font-semibold mb-4 text-red-600 dark:text-red-400">⚠️ Expiring Soon (30 days)</h3>
          <div className="space-y-3">
            {expiringSoon.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                </div>
                <div className="text-red-600 dark:text-red-400 font-semibold">
                  {Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            ))}
            {expiringSoon.length === 0 && (
              <p className="text-gray-500 text-center py-4">No items expiring soon</p>
            )}
          </div>
        </div>

        {/* Top Selling Medicines */}
        <div className={`p-5 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className="font-semibold mb-4">🏆 Top Selling Medicines</h3>
          <div className="space-y-3">
            {topMedicines.map((medicine, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{medicine.name}</div>
                    <div className="text-xs text-gray-500">{medicine.category}</div>
                  </div>
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  {medicine.sales} sold
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Main App Component ---
export default function Dashboard() {
    return <DashboardComponent />;
}