import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../components/ThemeContext";

// --- Helper Components ---
const MedicalParticles = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      opacity: 0.05,
    }}
  />
);

const useScript = (src) => {
  const [status, setStatus] = useState(src ? "loading" : "idle");
  useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }
    let script = document.querySelector(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);
      const setAttributeFromEvent = (event) => {
        script.setAttribute(
          "data-status",
          event.type === "load" ? "ready" : "error"
        );
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

// --- Loading Components ---
const ChartLoading = ({ theme }) => (
  <div className={`flex items-center justify-center h-64 rounded-lg ${
    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
  }`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">Loading chart...</p>
    </div>
  </div>
);

const ChartError = ({ theme, onRetry }) => (
  <div className={`flex items-center justify-center h-64 rounded-lg ${
    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
  }`}>
    <div className="text-center">
      <p className="text-red-500 mb-2">Failed to load chart</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Retry
      </button>
    </div>
  </div>
);

// --- Notification Component ---
const NotificationBell = ({ notifications, clearNotifications, theme }) => (
  <div className="relative">
    <button 
      className={`p-2 rounded-full ${
        theme === 'dark' 
          ? 'bg-slate-700 text-blue-300 hover:bg-slate-600' 
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      }`}
      onClick={clearNotifications}
    >
      🔔 {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {notifications.length}
        </span>
      )}
    </button>
    {notifications.length > 0 && (
      <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-20 border ${
        theme === 'dark' 
          ? 'bg-slate-800 border-slate-600' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`p-2 border-b ${
          theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
        } font-semibold text-sm`}>
          Notifications ({notifications.length})
        </div>
        {notifications.map(notif => (
          <div key={notif.id} className={`p-3 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          } last:border-b-0`}>
            <p className="text-sm">{notif.message}</p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>{notif.timestamp}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- Custom Date Picker ---
const CustomDatePicker = ({ dateRange, onDateChange, theme }) => (
  <div className="flex gap-2 items-center">
    <input
      type="date"
      value={dateRange.start.toISOString().split('T')[0]}
      onChange={(e) => onDateChange(prev => ({
        ...prev,
        start: new Date(e.target.value)
      }))}
      className={`px-2 py-1 border rounded text-sm ${
        theme === 'dark' 
          ? 'bg-slate-700 border-slate-600 text-white' 
          : 'bg-white border-gray-300'
      }`}
    />
    <span className="text-sm">to</span>
    <input
      type="date"
      value={dateRange.end.toISOString().split('T')[0]}
      onChange={(e) => onDateChange(prev => ({
        ...prev,
        end: new Date(e.target.value)
      }))}
      className={`px-2 py-1 border rounded text-sm ${
        theme === 'dark' 
          ? 'bg-slate-700 border-slate-600 text-white' 
          : 'bg-white border-gray-300'
      }`}
    />
    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">
      Apply
    </button>
  </div>
);

// --- Advanced Filters ---
const AdvancedFilters = ({ filters, onFiltersChange, theme }) => (
  <div className={`p-4 rounded-lg mb-4 ${
    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
  }`}>
    <h4 className={`font-semibold mb-3 ${
      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
    }`}>Advanced Filters</h4>
    <div className="flex gap-4 flex-wrap">
      <select 
        value={filters.category}
        onChange={(e) => onFiltersChange(prev => ({...prev, category: e.target.value}))}
        className={`px-3 py-2 border rounded text-sm ${
          theme === 'dark' 
            ? 'bg-slate-600 border-slate-500 text-white' 
            : 'bg-white border-gray-300'
        }`}
      >
        <option value="all">All Categories</option>
        <option value="prescription">Prescription</option>
        <option value="otc">OTC</option>
        <option value="medical">Medical Equipment</option>
        <option value="supplements">Supplements</option>
      </select>
      
      <div className="flex gap-2 items-center">
        <span className="text-sm">Value Range:</span>
        <input
          type="number"
          placeholder="Min"
          value={filters.minValue}
          onChange={(e) => onFiltersChange(prev => ({...prev, minValue: e.target.value}))}
          className={`w-20 px-2 py-1 border rounded text-sm ${
            theme === 'dark' 
              ? 'bg-slate-600 border-slate-500 text-white' 
              : 'bg-white border-gray-300'
          }`}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.maxValue}
          onChange={(e) => onFiltersChange(prev => ({...prev, maxValue: e.target.value}))}
          className={`w-20 px-2 py-1 border rounded text-sm ${
            theme === 'dark' 
              ? 'bg-slate-600 border-slate-500 text-white' 
              : 'bg-white border-gray-300'
          }`}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.onlyCritical}
          onChange={(e) => onFiltersChange(prev => ({...prev, onlyCritical: e.target.checked}))}
          className="rounded"
        />
        Show Critical Items Only
      </label>
    </div>
  </div>
);

// --- Comparison View ---
const ComparisonView = ({ currentValue, previousValue, label }) => {
  const difference = currentValue - previousValue;
  const percentageChange = previousValue ? ((difference / previousValue) * 100).toFixed(1) : 0;

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className={`text-sm font-medium ${
        difference >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {difference >= 0 ? '↗' : '↘'} {Math.abs(percentageChange)}%
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        vs previous period
      </span>
    </div>
  );
};

// --- Enhanced Stat Card ---
const EnhancedStatCard = ({ label, value, comparisonValue, theme, trend }) => (
  <div className={`p-4 rounded-lg text-center shadow ${
    theme === "dark" 
      ? "bg-slate-700" 
      : "bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100"
  }`}>
    <p className={`text-sm font-medium ${
      theme === "dark" ? "text-gray-300" : "text-gray-600"
    }`}>
      {label}
    </p>
    <p className={`text-lg font-bold ${
      theme === "dark" ? "text-white" : "text-gray-800"
    }`}>
      {value}
    </p>
    {comparisonValue && (
      <ComparisonView 
        currentValue={typeof value === 'string' ? parseFloat(value.replace('$', '')) : value}
        previousValue={comparisonValue}
        label={label}
      />
    )}
    {trend && (
      <div className={`text-xs mt-1 ${
        trend === 'up' ? 'text-green-500' : 'text-red-500'
      }`}>
        {trend === 'up' ? '📈' : '📉'} Trend
      </div>
    )}
  </div>
);

// --- Predictive Insights ---
const PredictiveInsights = ({ data, type, theme }) => {
  const predictNextPeriod = (historicalData) => {
    if (!historicalData || historicalData.length < 2) return null;
    
    const lastValue = historicalData[historicalData.length - 1].Sales || historicalData[historicalData.length - 1].value;
    const secondLastValue = historicalData[historicalData.length - 2].Sales || historicalData[historicalData.length - 2].value;
    const growth = lastValue - secondLastValue;
    
    return Math.max(0, lastValue + growth);
  };

  const prediction = predictNextPeriod(data.chartData || data);

  if (!prediction) return null;

  return (
    <div className={`mt-4 p-4 rounded-lg border ${
      theme === 'dark' 
        ? 'bg-slate-600 border-slate-500' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
        📈 Predictive Insights
      </h5>
      {prediction && (
        <p className="text-sm">
          Next period forecast: <strong>${prediction.toFixed(2)}</strong>
          <span className={`ml-2 text-xs ${
            prediction > (data.chartData?.[data.chartData.length - 1]?.Sales || data[data.length - 1]?.value) 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {prediction > (data.chartData?.[data.chartData.length - 1]?.Sales || data[data.length - 1]?.value) 
              ? '(Expected growth)' 
              : '(Potential decline)'}
          </span>
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Based on historical trends and growth patterns
      </p>
    </div>
  );
};

// --- Drill Down Chart ---
const DrillDownChart = ({ data, onDataPointClick, theme, chartStatus }) => {
  if (chartStatus !== "ready") {
    return <ChartLoading theme={theme} />;
  }

  if (!window.Recharts) {
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }

  try {
    const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } = window.Recharts;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="#3b82f6" 
            onClick={(data) => onDataPointClick && onDataPointClick(data)}
            style={{ cursor: onDataPointClick ? 'pointer' : 'default' }}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } catch (error) {
    console.error('Error rendering chart:', error);
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }
};

// --- Product Breakdown ---
const ProductBreakdown = ({ theme, chartStatus }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const productData = [
    { name: 'Prescription Drugs', value: 45, products: ['Lisinopril', 'Atorvastatin', 'Metformin'], revenue: 12500 },
    { name: 'OTC Medicines', value: 30, products: ['Ibuprofen', 'Acetaminophen', 'Antihistamines'], revenue: 8500 },
    { name: 'Medical Equipment', value: 15, products: ['Blood Pressure Monitors', 'Glucose Meters'], revenue: 4200 },
    { name: 'Health Supplements', value: 10, products: ['Vitamin D', 'Multivitamins', 'Omega-3'], revenue: 2800 },
  ];

  return (
    <div className={`p-5 rounded-xl shadow-lg mt-4 ${
      theme === "dark" ? "bg-slate-800" : "bg-white"
    }`}>
      <h3 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
        Product Category Breakdown
      </h3>
      <DrillDownChart 
        data={productData} 
        onDataPointClick={setSelectedCategory}
        theme={theme}
        chartStatus={chartStatus}
      />
      
      {selectedCategory && (
        <div className={`mt-4 p-4 border rounded-lg ${
          theme === 'dark' 
            ? 'bg-slate-700 border-slate-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-lg">{selectedCategory.name} Details</h4>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Market Share:</strong> {selectedCategory.value}%</p>
              <p><strong>Monthly Revenue:</strong> ${selectedCategory.revenue}</p>
            </div>
            <div>
              <p><strong>Top Products:</strong></p>
              <ul className="list-disc list-inside">
                {selectedCategory.products.map((product, idx) => (
                  <li key={idx}>{product}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Enhanced Export ---
const EnhancedExport = ({ pdfScriptsReady, activeTab, timeRange, theme }) => {
  const [exportFormat, setExportFormat] = useState('pdf');

  const exportPDF = () => {
    if (!pdfScriptsReady || !window.jspdf) {
      alert('PDF library not loaded yet. Please try again.');
      return;
    }
    
    try {
      const doc = new window.jspdf.jsPDF();
      doc.setFontSize(22);
      doc.text("Athanex Pharmacy - Enhanced Report", 14, 22);
      doc.setFontSize(12);
      doc.text(`Report Type: ${activeTab} | Period: ${timeRange}`, 14, 32);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 42);
      doc.save(`Athanex_${activeTab}_Report_${timeRange}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportExcel = async () => {
    // Simulate Excel export
    console.log('Exporting to Excel...', { activeTab, timeRange });
    
    // Show success message after delay
    setTimeout(() => {
      alert(`Excel file for ${activeTab} report has been generated!`);
    }, 1000);
  };

  const exportCSV = async () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Category,Value,Timestamp\n" +
      `${activeTab},${timeRange},"${new Date().toLocaleString()}"\n` +
      "Total Sales,475.5,\n" +
      "Total Orders,3,\n" +
      "Average Order Value,158.5,\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `athanex_${activeTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportData = async (format) => {
    try {
      switch (format) {
        case 'pdf':
          exportPDF();
          break;
        case 'excel':
          await exportExcel();
          break;
        case 'csv':
          await exportCSV();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Error exporting ${format.toUpperCase()} file. Please try again.`);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select 
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className={`px-3 py-2 border rounded text-sm ${
          theme === 'dark' 
            ? 'bg-slate-600 border-slate-500 text-white' 
            : 'bg-white border-gray-300'
        }`}
      >
        <option value="pdf">PDF Format</option>
        <option value="excel">Excel Format</option>
        <option value="csv">CSV Format</option>
      </select>
      
      <button
        onClick={() => exportData(exportFormat)}
        disabled={exportFormat === 'pdf' && !pdfScriptsReady}
        className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
      >
        {exportFormat === 'pdf' && '📄'}
        {exportFormat === 'excel' && '📊'}
        {exportFormat === 'csv' && '📝'}
        Export as {exportFormat.toUpperCase()}
      </button>
    </div>
  );
};

// --- Chart Components with Error Boundaries ---
const SalesChart = ({ data, theme, chartStatus }) => {
  if (chartStatus !== "ready") {
    return <ChartLoading theme={theme} />;
  }

  if (!window.Recharts) {
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }

  try {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Sales" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  } catch (error) {
    console.error('Error rendering sales chart:', error);
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }
};

const ProfitChart = ({ data, theme, chartStatus }) => {
  if (chartStatus !== "ready") {
    return <ChartLoading theme={theme} />;
  }

  if (!window.Recharts) {
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }

  try {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = window.Recharts;

    const chartData = [
      { 
        name: 'Profit Analysis', 
        totalRevenue: data.totalRevenue, 
        totalExpenses: data.totalExpenses, 
        netProfit: data.netProfit 
      }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9ca3af' : '#374151'}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          />
          <Bar dataKey="totalRevenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="totalExpenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
          <Bar dataKey="netProfit" fill="#22c55e" name="Profit" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  } catch (error) {
    console.error('Error rendering profit chart:', error);
    return <ChartError theme={theme} onRetry={() => window.location.reload()} />;
  }
};

// --- Main Reports Component ---
function ReportsComponent() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState("Today");
  const [activeTab, setActiveTab] = useState("sales");
  const [isRealTime, setIsRealTime] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [filters, setFilters] = useState({
    category: 'all',
    minValue: 0,
    maxValue: 10000,
    onlyCritical: false
  });

  // Load external scripts
  const jspdfStatus = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  );
  const autoTableStatus = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"
  );
  const rechartsStatus = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/recharts/2.12.7/recharts.min.js"
  );

  const pdfScriptsReady = jspdfStatus === "ready" && autoTableStatus === "ready";

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'info',
        message: `Real-time update: New ${activeTab} data available for ${timeRange}`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealTime, activeTab, timeRange]);

  // Mock data with enhanced structure
  const reportData = useMemo(
    () => ({
      Today: {
        sales: {
          totalSales: 475.5,
          totalOrders: 3,
          avgOrderValue: 158.5,
          previousSales: 420.0,
          chartData: [
            { name: "12AM", Sales: 0 },
            { name: "6AM", Sales: 120 },
            { name: "12PM", Sales: 280 },
            { name: "6PM", Sales: 475 },
          ],
        },
        inventory: {
          totalItems: 480,
          stockValue: 12340,
          lowStockCount: 2,
          previousItems: 485,
        },
        customers: {
          newCustomers: 1,
          returningCustomers: 2,
          topCustomers: [{ name: "Jane Doe", spent: 215.5 }],
          previousNewCustomers: 1,
        },
        profit: {
          totalRevenue: 475.5,
          totalExpenses: 200,
          netProfit: 275.5,
          previousProfit: 250.0,
        },
      },
      "This Week": {
        sales: {
          totalSales: 3250,
          totalOrders: 18,
          avgOrderValue: 180.5,
          previousSales: 2980,
          chartData: [
            { name: "Mon", Sales: 400 },
            { name: "Tue", Sales: 600 },
            { name: "Wed", Sales: 550 },
            { name: "Thu", Sales: 800 },
            { name: "Fri", Sales: 900 },
          ],
        },
        inventory: {
          totalItems: 470,
          stockValue: 12100,
          lowStockCount: 5,
          previousItems: 475,
        },
        customers: {
          newCustomers: 12,
          returningCustomers: 15,
          topCustomers: [
            { name: "Sam Smith", spent: 1200 },
            { name: "Jane Doe", spent: 950 },
          ],
          previousNewCustomers: 10,
        },
        profit: {
          totalRevenue: 3250,
          totalExpenses: 1400,
          netProfit: 1850,
          previousProfit: 1650,
        },
      },
      "This Month": {
        sales: {
          totalSales: 12850,
          totalOrders: 95,
          avgOrderValue: 135.2,
          previousSales: 11500,
          chartData: [
            { name: "Week 1", Sales: 3100 },
            { name: "Week 2", Sales: 2900 },
            { name: "Week 3", Sales: 3400 },
            { name: "Week 4", Sales: 3450 },
          ],
        },
        inventory: {
          totalItems: 460,
          stockValue: 11800,
          lowStockCount: 10,
          previousItems: 470,
        },
        customers: {
          newCustomers: 40,
          returningCustomers: 55,
          topCustomers: [
            { name: "Alice Brown", spent: 2400 },
            { name: "Sam Smith", spent: 1900 },
          ],
          previousNewCustomers: 35,
        },
        profit: {
          totalRevenue: 12850,
          totalExpenses: 6800,
          netProfit: 6050,
          previousProfit: 5500,
        },
      },
    }),
    []
  );

  const activeReport = reportData[timeRange] || {};

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={`relative flex flex-col h-screen p-6 ${
      theme === "dark" ? "text-gray-200 bg-slate-900" : "text-gray-800 bg-gray-50"
    }`}>
      <MedicalParticles />
      
      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Reports & Analytics
          </h1>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRealTime}
              onChange={(e) => setIsRealTime(e.target.checked)}
              className="rounded text-blue-500"
            />
            Real-time Updates
          </label>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell 
            notifications={notifications} 
            clearNotifications={clearNotifications}
            theme={theme}
          />
          <EnhancedExport 
            pdfScriptsReady={pdfScriptsReady}
            activeTab={activeTab}
            timeRange={timeRange}
            theme={theme}
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className={`relative z-10 p-4 rounded-xl shadow-md mb-6 ${
        theme === "dark" 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-gradient-to-r from-green-50 to-blue-50 border border-blue-100"
      }`}>
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Report Type:</span>
            <div className="flex flex-wrap gap-2">
              {["sales", "inventory", "customers", "profit"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition ${
                    activeTab === tab
                      ? "bg-blue-500 text-white shadow-md"
                      : theme === "dark"
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="font-semibold text-green-600 dark:text-green-400">Time Period:</span>
            <div className="flex flex-wrap gap-2">
              {["Today", "This Week", "This Month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    timeRange === range
                      ? "bg-green-500 text-white shadow-md"
                      : theme === "dark"
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
              Custom Date Range:
            </span>
            <CustomDatePicker 
              dateRange={customDateRange}
              onDateChange={setCustomDateRange}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters 
        filters={filters}
        onFiltersChange={setFilters}
        theme={theme}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-6">
        {activeTab === "sales" && activeReport.sales && (
          <>
            <div className={`p-5 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}>
              <h3 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400 text-lg">
                Sales Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <EnhancedStatCard 
                  label="Total Sales" 
                  value={`$${activeReport.sales.totalSales}`} 
                  comparisonValue={activeReport.sales.previousSales}
                  theme={theme} 
                  trend={activeReport.sales.totalSales > activeReport.sales.previousSales ? 'up' : 'down'}
                />
                <EnhancedStatCard 
                  label="Total Orders" 
                  value={activeReport.sales.totalOrders} 
                  theme={theme}
                />
                <EnhancedStatCard 
                  label="Avg Order Value" 
                  value={`$${activeReport.sales.avgOrderValue}`} 
                  theme={theme}
                />
              </div>
              <SalesChart 
                data={activeReport.sales.chartData} 
                theme={theme}
                chartStatus={rechartsStatus}
              />
            </div>
            <PredictiveInsights 
              data={activeReport.sales} 
              type="sales" 
              theme={theme} 
            />
            <ProductBreakdown 
              theme={theme} 
              chartStatus={rechartsStatus}
            />
          </>
        )}
        {activeTab === "inventory" && activeReport.inventory && (
          <>
            <div className={`p-5 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}>
              <h3 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400 text-lg">
                Inventory Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedStatCard 
                  label="Total Items" 
                  value={activeReport.inventory.totalItems} 
                  comparisonValue={activeReport.inventory.previousItems}
                  theme={theme} 
                />
                <EnhancedStatCard 
                  label="Stock Value" 
                  value={`$${activeReport.inventory.stockValue.toLocaleString()}`} 
                  theme={theme}
                />
                <EnhancedStatCard 
                  label="Low Stock Count" 
                  value={activeReport.inventory.lowStockCount} 
                  theme={theme}
                  trend={activeReport.inventory.lowStockCount > 5 ? 'down' : 'up'}
                />
              </div>
            </div>
            <PredictiveInsights 
              data={[
                { name: 'Previous', value: activeReport.inventory.previousItems },
                { name: 'Current', value: activeReport.inventory.totalItems }
              ]} 
              type="inventory" 
              theme={theme} 
            />
          </>
        )}
        {activeTab === "customers" && activeReport.customers && (
          <>
            <div className={`p-5 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}>
              <h3 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400 text-lg">
                Customer Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <EnhancedStatCard 
                  label="New Customers" 
                  value={activeReport.customers.newCustomers} 
                  comparisonValue={activeReport.customers.previousNewCustomers}
                  theme={theme} 
                />
                <EnhancedStatCard 
                  label="Returning Customers" 
                  value={activeReport.customers.returningCustomers} 
                  theme={theme}
                />
                <EnhancedStatCard 
                  label="Top Customer" 
                  value={`${activeReport.customers.topCustomers[0].name} - $${activeReport.customers.topCustomers[0].spent}`} 
                  theme={theme}
                />
              </div>
            </div>
            <PredictiveInsights 
              data={[
                { name: 'Previous', value: activeReport.customers.previousNewCustomers },
                { name: 'Current', value: activeReport.customers.newCustomers }
              ]} 
              type="customers" 
              theme={theme} 
            />
          </>
        )}
        {activeTab === "profit" && activeReport.profit && (
          <>
            <div className={`p-5 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}>
              <h3 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400 text-lg">
                Profit Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <EnhancedStatCard 
                  label="Total Revenue" 
                  value={`$${activeReport.profit.totalRevenue}`} 
                  theme={theme} 
                />
                <EnhancedStatCard 
                  label="Total Expenses" 
                  value={`$${activeReport.profit.totalExpenses}`} 
                  theme={theme}
                />
                <EnhancedStatCard 
                  label="Net Profit" 
                  value={`$${activeReport.profit.netProfit}`} 
                  comparisonValue={activeReport.profit.previousProfit}
                  theme={theme}
                  trend={activeReport.profit.netProfit > activeReport.profit.previousProfit ? 'up' : 'down'}
                />
              </div>
              <ProfitChart 
                data={activeReport.profit} 
                theme={theme}
                chartStatus={rechartsStatus}
              />
            </div>
            <PredictiveInsights 
              data={[
                { name: 'Previous', value: activeReport.profit.previousProfit },
                { name: 'Current', value: activeReport.profit.netProfit }
              ]} 
              type="profit" 
              theme={theme} 
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function Reports() {
  return <ReportsComponent />;
}