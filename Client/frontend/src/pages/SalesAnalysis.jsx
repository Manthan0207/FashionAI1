// // src/pages/SellerSalesAnalysis.jsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import {
//     ShoppingBag, DollarSign, Package, TrendingUp,
//     BarChart2, PieChart, ShoppingCart, CheckCircle,
//     RefreshCw, User, Calendar, Filter, ArrowUpRight
// } from 'react-feather';
// import { ArrowDownRight } from 'lucide-react';
// import {
//     BarChart, Bar, PieChart as RechartsPie, Pie,
//     XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
// } from 'recharts';
// import Sidebar from '../components/Sidebar';
// import SellerNavbar from '../components/SellerNavbar';
// import { useOrderStore } from '../store/orderStore';
// import { useAuthStore } from '../store/authStore';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// const SalesAnalysis = () => {
//     const [timeFilter, setTimeFilter] = useState('month');
//     const [categoryFilter, setCategoryFilter] = useState('all');
//     const [products, setProducts] = useState([]);
//     const [salesData, setSalesData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('overview');

//     const { geSalesDetails } = useOrderStore();
//     const { user } = useAuthStore();

//     // Fetch seller's products
//     const getProducts = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/api/seller/get-seller-prods');
//             return response.data.prods || [];
//         } catch (error) {
//             console.error("Failed to fetch products:", error);
//             return [];
//         }
//     };

//     // Fetch data on component mount
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const [prods, sales] = await Promise.all([
//                     getProducts(),
//                     geSalesDetails()
//                 ]);

//                 // Ensure we have arrays before proceeding
//                 setProducts(Array.isArray(prods) ? prods : []);
//                 setSalesData(Array.isArray(sales) ? sales : []);

//                 if (Array.isArray(prods) && Array.isArray(sales)) {
//                     calculateStats(prods, sales);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch data:", error);
//                 setProducts([]);
//                 setSalesData([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // Apply filters whenever filters change
//     useEffect(() => {
//         if (salesData.length === 0 || products.length === 0) return;

//         const now = new Date();
//         let startDate = new Date(0); // Default to beginning of time

//         switch (timeFilter) {
//             case 'today':
//                 startDate = new Date(now.setHours(0, 0, 0, 0));
//                 break;
//             case 'week':
//                 startDate = new Date(now.setDate(now.getDate() - now.getDay()));
//                 break;
//             case 'month':
//                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//                 break;
//             case 'quarter':
//                 startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
//                 break;
//             case 'year':
//                 startDate = new Date(now.getFullYear(), 0, 1);
//                 break;
//             default:
//                 startDate = new Date(0);
//         }

//         // Filter by time and category
//         const filtered = salesData.filter(order => {
//             const orderDate = new Date(order?.createdAt || new Date());
//             const timeMatch = orderDate >= startDate;

//             // Find the product for this order item
//             const firstItem = order?.items?.[0];
//             const product = firstItem
//                 ? products.find(p => p?._id === firstItem?.productId)
//                 : null;

//             const categoryMatch = categoryFilter === 'all' ||
//                 (product && product?.category === categoryFilter);

//             return timeMatch && categoryMatch;
//         });

//         // Sort by date descending (most recent first)
//         const sorted = [...filtered].sort((a, b) =>
//             new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
//         );

//         setFilteredData(sorted);
//     }, [salesData, products, timeFilter, categoryFilter]);

//     const calculateStats = (prods, sales) => {
//         // Guard against invalid data
//         if (!Array.isArray(prods)) prods = [];
//         if (!Array.isArray(sales)) sales = [];

//         // Basic stats with safe access
//         const totalRevenue = sales.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
//         const totalOrders = sales.length;
//         const totalItems = sales.reduce((sum, order) =>
//             sum + (order.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0), 0);

//         // Time-based calculations
//         const now = new Date();
//         const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//         const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

//         const currentMonthSales = sales.filter(order =>
//             order?.createdAt && new Date(order.createdAt) >= currentMonthStart
//         );

//         const prevMonthSales = sales.filter(order =>
//             order?.createdAt &&
//             new Date(order.createdAt) >= prevMonthStart &&
//             new Date(order.createdAt) <= prevMonthEnd
//         );

//         // Revenue calculations
//         const currentMonthRevenue = currentMonthSales.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
//         const prevMonthRevenue = prevMonthSales.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
//         const revenueIncDecRate = prevMonthRevenue === 0 ? 100
//             : ((currentMonthRevenue - prevMonthRevenue) * 100) / prevMonthRevenue;
//         const revenueSign = currentMonthRevenue >= prevMonthRevenue ? "+" : "";

//         // Order calculations
//         const currentMonthOrders = currentMonthSales.length;
//         const prevMonthOrders = prevMonthSales.length;
//         const ordersIncDecRate = prevMonthOrders === 0 ? 100
//             : ((currentMonthOrders - prevMonthOrders) * 100) / prevMonthOrders;
//         const ordersSign = currentMonthOrders >= prevMonthOrders ? "+" : "";

//         // Item calculations
//         const itemSoldCurrentMonth = currentMonthSales.reduce((sum, order) =>
//             sum + (order.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0), 0);
//         const itemSoldPrevMonth = prevMonthSales.reduce((sum, order) =>
//             sum + (order.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0), 0);
//         const itemsIncDecRate = itemSoldPrevMonth === 0 ? 100
//             : ((itemSoldCurrentMonth - itemSoldPrevMonth) * 100) / itemSoldPrevMonth;
//         const itemsSign = itemSoldCurrentMonth >= itemSoldPrevMonth ? "+" : "";

//         // Status counts
//         const statusCounts = {
//             Pending: 0,
//             Shipped: 0,
//             Delivered: 0,
//             Cancelled: 0
//         };

//         sales.forEach(order => {
//             if (order?.status && statusCounts.hasOwnProperty(order.status)) {
//                 statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
//             }
//         });

//         // Convert to array for charts
//         const statusData = Object.entries(statusCounts).map(([name, value]) => ({
//             name,
//             value
//         }));

//         // Top products (by revenue)
//         const productRevenue = {};
//         sales.forEach(order => {
//             order.items?.forEach(item => {
//                 const productId = item?.productId;
//                 if (productId) {
//                     const product = prods.find(p => p?._id === productId);
//                     if (product) {
//                         const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
//                         productRevenue[productId] = (productRevenue[productId] || 0) +
//                             price * (item?.quantity || 0);
//                     }
//                 }
//             });
//         });

//         // Map to product details
//         const topProducts = Object.entries(productRevenue)
//             .map(([productId, revenue]) => {
//                 const product = prods.find(p => p?._id === productId);
//                 const units = sales.reduce((sum, order) => {
//                     const item = order.items?.find(i => i?.productId === productId);
//                     return sum + (item?.quantity || 0);
//                 }, 0);

//                 return {
//                     id: productId,
//                     name: product?.name || "Unknown Product",
//                     revenue,
//                     units,
//                     image: product?.images?.[0] || ""
//                 };
//             })
//             .sort((a, b) => b.revenue - a.revenue)
//             .slice(0, 5);

//         // Sales by category
//         const categorySales = {};
//         prods.forEach(product => {
//             if (product?.category) {
//                 categorySales[product.category] = categorySales[product.category] || 0;
//             }
//         });

//         sales.forEach(order => {
//             order.items?.forEach(item => {
//                 const product = prods.find(p => p?._id === item?.productId);
//                 if (product?.category) {
//                     const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
//                     categorySales[product.category] = (categorySales[product.category] || 0) +
//                         price * (item?.quantity || 0);
//                 }
//             });
//         });

//         // Convert to array for charts
//         const categoryData = Object.entries(categorySales).map(([name, value]) => ({
//             name,
//             value
//         }));

//         // Top customers
//         const customerSpending = {};
//         sales.forEach(order => {
//             if (order?.user) {
//                 if (!customerSpending[order.user]) {
//                     customerSpending[order.user] = {
//                         name: order?.userName || `Customer ${order.user.slice(-4)}`,
//                         total: 0,
//                         orders: 0
//                     };
//                 }
//                 customerSpending[order.user].total += order?.totalAmount || 0;
//                 customerSpending[order.user].orders += 1;
//             }
//         });

//         const topCustomers = Object.values(customerSpending)
//             .sort((a, b) => b.total - a.total)
//             .slice(0, 5);

//         // Sales trend (last 7 days)
//         const salesTrend = {};
//         const today = new Date();
//         for (let i = 6; i >= 0; i--) {
//             const date = new Date(today);
//             date.setDate(today.getDate() - i);
//             const dateStr = date.toISOString().split('T')[0];
//             salesTrend[dateStr] = 0;
//         }

//         sales.forEach(order => {
//             if (order?.createdAt) {
//                 const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
//                 if (salesTrend[orderDate] !== undefined) {
//                     salesTrend[orderDate] += order?.totalAmount || 0;
//                 }
//             }
//         });

//         const salesTrendData = Object.entries(salesTrend).map(([date, revenue]) => ({
//             date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
//             revenue
//         }));

//         // Inventory health
//         const inventoryHealth = {
//             lowStock: prods.filter(p => p?.stock > 0 && p.stock <= 5).length,
//             mediumStock: prods.filter(p => p?.stock > 5 && p.stock <= 20).length,
//             highStock: prods.filter(p => p?.stock > 20).length
//         };

//         setStats({
//             totalRevenue,
//             totalOrders,
//             totalItems,
//             currentMonthRevenue,
//             prevMonthRevenue,
//             revenueIncDecRate,
//             revenueSign,
//             currentMonthOrders,
//             prevMonthOrders,
//             ordersIncDecRate,
//             ordersSign,
//             itemSoldCurrentMonth,
//             itemSoldPrevMonth,
//             itemsIncDecRate,
//             itemsSign,
//             statusCounts,
//             topProducts,
//             categoryData,
//             topCustomers,
//             salesTrend: salesTrendData,
//             statusData,
//             inventoryHealth
//         });
//     };

//     // Format currency
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount || 0);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Get status badge
//     const getStatusBadge = (status) => {
//         if (!status) return null;

//         const statusClasses = {
//             Pending: "bg-yellow-100 text-yellow-800",
//             Shipped: "bg-blue-100 text-blue-800",
//             Delivered: "bg-green-100 text-green-800",
//             Cancelled: "bg-red-100 text-red-800"
//         };

//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//                 {status}
//             </span>
//         );
//     };

//     // Get unique categories
//     const getCategories = () => {
//         const categories = new Set();
//         products.forEach(p => {
//             if (p?.category) {
//                 categories.add(p.category);
//             }
//         });
//         return ['all', ...Array.from(categories)];
//     };

//     // Get time filter label
//     const getTimeFilterLabel = () => {
//         switch (timeFilter) {
//             case 'today': return 'Today';
//             case 'week': return 'This Week';
//             case 'month': return 'This Month';
//             case 'quarter': return 'This Quarter';
//             case 'year': return 'This Year';
//             default: return '';
//         }
//     };

//     // Custom tooltip for charts
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
//                     <p className="font-medium">{label}</p>
//                     <p className="text-sm">
//                         <span className="text-gray-600">Revenue: </span>
//                         <span className="font-medium">{formatCurrency(payload[0].value)}</span>
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     // Loading state
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <RefreshCw className="animate-spin text-indigo-600" size={32} />
//                 <span className="ml-3 text-gray-600">Loading sales data...</span>
//             </div>
//         );
//     }

//     // No data state
//     if (!stats || salesData.length === 0) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <ShoppingBag className="mx-auto text-slate-300" size={48} />
//                     <h2 className="mt-4 text-xl font-medium text-slate-800">No Sales Data Available</h2>
//                     <p className="mt-2 text-slate-600">You haven't made any sales yet</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50">
//             <Sidebar />
//             <div className="flex-1 min-w-0 lg:ml-20">
//                 <SellerNavbar />
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//                         <div>
//                             <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Sales Analysis Dashboard</h1>
//                             <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">
//                                 {user?.name ? `Welcome, ${user.name}` : "Seller Dashboard"} • Showing data for {getTimeFilterLabel()}
//                             </p>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
//                             <div className="relative">
//                                 <select
//                                     value={timeFilter}
//                                     onChange={(e) => setTimeFilter(e.target.value)}
//                                     className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm md:text-base"
//                                 >
//                                     <option value="today">Today</option>
//                                     <option value="week">This Week</option>
//                                     <option value="month">This Month</option>
//                                     <option value="quarter">This Quarter</option>
//                                     <option value="year">This Year</option>
//                                 </select>
//                                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
//                             </div>

//                             <div className="relative">
//                                 <select
//                                     value={categoryFilter}
//                                     onChange={(e) => setCategoryFilter(e.target.value)}
//                                     className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm md:text-base"
//                                 >
//                                     <option value="all">All Categories</option>
//                                     {getCategories().filter(c => c !== 'all').map(category => (
//                                         <option key={category} value={category}>{category}</option>
//                                     ))}
//                                 </select>
//                                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Tabs */}
//                     <div className="flex border-b border-gray-200 mb-6">
//                         <button
//                             className={`py-2 px-4 font-medium text-sm ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
//                             onClick={() => setActiveTab('overview')}
//                         >
//                             Overview
//                         </button>
//                         <button
//                             className={`py-2 px-4 font-medium text-sm ${activeTab === 'products' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
//                             onClick={() => setActiveTab('products')}
//                         >
//                             Product Analysis
//                         </button>
//                         <button
//                             className={`py-2 px-4 font-medium text-sm ${activeTab === 'customers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
//                             onClick={() => setActiveTab('customers')}
//                         >
//                             Customer Insights
//                         </button>
//                     </div>

//                     {/* Overview Tab */}
//                     {activeTab === 'overview' && (
//                         <div className="space-y-6">
//                             {/* Stats Cards */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 0.1 }}
//                                     className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <p className="text-slate-600 text-sm">Total Revenue</p>
//                                             <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
//                                                 {formatCurrency(stats.totalRevenue)}
//                                             </p>
//                                         </div>
//                                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
//                                             <DollarSign className="text-indigo-600" size={20} />
//                                         </div>
//                                     </div>
//                                     <div
//                                         className={`flex items-center mt-3 text-sm ${stats.revenueSign === '+' ? "text-green-600" : "text-red-500"}`}
//                                     >
//                                         {stats.revenueSign === '+' ? (
//                                             <ArrowUpRight size={16} />
//                                         ) : (
//                                             <ArrowDownRight size={16} />
//                                         )}
//                                         <span className="ml-1 font-medium">
//                                             {stats.revenueSign}{Math.abs(stats.revenueIncDecRate || 0).toFixed(2)}% from last month
//                                         </span>
//                                     </div>
//                                 </motion.div>

//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 0.2 }}
//                                     className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <p className="text-slate-600 text-sm">Total Orders</p>
//                                             <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
//                                                 {stats.totalOrders}
//                                             </p>
//                                         </div>
//                                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
//                                             <ShoppingBag className="text-blue-600" size={20} />
//                                         </div>
//                                     </div>
//                                     <div
//                                         className={`flex items-center mt-3 text-sm ${stats.ordersSign === '+' ? "text-green-600" : "text-red-500"}`}
//                                     >
//                                         {stats.ordersSign === '+' ? (
//                                             <ArrowUpRight size={16} />
//                                         ) : (
//                                             <ArrowDownRight size={16} />
//                                         )}
//                                         <span className="ml-1 font-medium">
//                                             {stats.ordersSign}{Math.abs(stats.ordersIncDecRate || 0).toFixed(2)}% from last month
//                                         </span>
//                                     </div>
//                                 </motion.div>

//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 0.3 }}
//                                     className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <p className="text-slate-600 text-sm">Items Sold</p>
//                                             <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
//                                                 {stats.totalItems}
//                                             </p>
//                                         </div>
//                                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 flex items-center justify-center">
//                                             <Package className="text-green-600" size={20} />
//                                         </div>
//                                     </div>
//                                     <div
//                                         className={`flex items-center mt-3 text-sm ${stats.itemsSign === '+' ? "text-green-600" : "text-red-500"}`}
//                                     >
//                                         {stats.itemsSign === '+' ? (
//                                             <ArrowUpRight size={16} />
//                                         ) : (
//                                             <ArrowDownRight size={16} />
//                                         )}
//                                         <span className="ml-1 font-medium">
//                                             {stats.itemsSign}{Math.abs(stats.itemsIncDecRate || 0).toFixed(2)}% from last month
//                                         </span>
//                                     </div>
//                                 </motion.div>

//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 0.4 }}
//                                     className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <p className="text-slate-600 text-sm">Avg. Order Value</p>
//                                             <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
//                                                 {stats.totalOrders > 0
//                                                     ? formatCurrency(stats.totalRevenue / stats.totalOrders)
//                                                     : formatCurrency(0)}
//                                             </p>
//                                         </div>
//                                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
//                                             <TrendingUp className="text-purple-600" size={20} />
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             </div>

//                             {/* Charts Section */}
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 {/* Sales Trend Chart */}
//                                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                     <h2 className="text-lg font-semibold text-slate-800 mb-4">Sales Trend (Last 7 Days)</h2>
//                                     <ResponsiveContainer width="100%" height={300}>
//                                         <BarChart data={stats.salesTrend}>
//                                             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                                             <XAxis dataKey="date" stroke="#64748b" />
//                                             <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value}`} />
//                                             <Tooltip content={<CustomTooltip />} />
//                                             <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>

//                                 {/* Status Distribution */}
//                                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                     <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Status Distribution</h2>
//                                     <ResponsiveContainer width="100%" height={300}>
//                                         <RechartsPie>
//                                             <Pie
//                                                 data={stats.statusData}
//                                                 cx="50%"
//                                                 cy="50%"
//                                                 labelLine={false}
//                                                 outerRadius={100}
//                                                 dataKey="value"
//                                                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                             >
//                                                 {stats.statusData.map((entry, index) => (
//                                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                                 ))}
//                                             </Pie>
//                                             <Tooltip formatter={(value) => value} />
//                                             <Legend />
//                                         </RechartsPie>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>

//                             {/* Top Products and Categories */}
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 {/* Top Products */}
//                                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                     <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Products</h2>
//                                     <div className="space-y-4">
//                                         {stats.topProducts.map((product, index) => (
//                                             <div key={product.id} className="flex items-center">
//                                                 <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-3">
//                                                     {index + 1}
//                                                 </div>
//                                                 <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden mr-3">
//                                                     {product.image ? (
//                                                         <img
//                                                             src={product.image}
//                                                             alt={product.name}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                                             <Package className="text-gray-400" size={16} />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <div className="font-medium text-slate-800 truncate">{product.name}</div>
//                                                     <div className="text-sm text-slate-600">{product.units} units sold</div>
//                                                 </div>
//                                                 <div className="text-slate-800 font-medium">
//                                                     {formatCurrency(product.revenue)}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Category Distribution */}
//                                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                     <h2 className="text-lg font-semibold text-slate-800 mb-4">Sales by Category</h2>
//                                     <ResponsiveContainer width="100%" height={300}>
//                                         <BarChart data={stats.categoryData}>
//                                             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                                             <XAxis dataKey="name" stroke="#64748b" />
//                                             <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value}`} />
//                                             <Tooltip formatter={(value) => formatCurrency(value)} />
//                                             <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Product Analysis Tab */}
//                     {activeTab === 'products' && (
//                         <div className="space-y-6">
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                                 <div className="lg:col-span-2">
//                                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                         <h2 className="text-lg font-semibold text-slate-800 mb-4">Product Performance</h2>
//                                         <ResponsiveContainer width="100%" height={300}>
//                                             <BarChart data={stats.topProducts}>
//                                                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                                                 <XAxis dataKey="name" stroke="#64748b" />
//                                                 <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value}`} />
//                                                 <Tooltip formatter={(value) => formatCurrency(value)} />
//                                                 <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[4, 4, 0, 0]} />
//                                                 <Bar dataKey="units" fill="#10b981" name="Units Sold" radius={[4, 4, 0, 0]} />
//                                                 <Legend />
//                                             </BarChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                         <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory Health</h2>
//                                         <ResponsiveContainer width="100%" height={300}>
//                                             <RechartsPie>
//                                                 <Pie
//                                                     data={[
//                                                         { name: 'Low Stock', value: stats.inventoryHealth.lowStock },
//                                                         { name: 'Medium Stock', value: stats.inventoryHealth.mediumStock },
//                                                         { name: 'High Stock', value: stats.inventoryHealth.highStock }
//                                                     ]}
//                                                     cx="50%"
//                                                     cy="50%"
//                                                     innerRadius={60}
//                                                     outerRadius={100}
//                                                     paddingAngle={5}
//                                                     dataKey="value"
//                                                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                                 >
//                                                     <Cell fill="#ef4444" />
//                                                     <Cell fill="#f59e0b" />
//                                                     <Cell fill="#10b981" />
//                                                 </Pie>
//                                                 <Tooltip />
//                                                 <Legend />
//                                             </RechartsPie>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory Overview</h2>
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {products.map(product => {
//                                                 const productSales = salesData.filter(order =>
//                                                     order.items?.some(item => item?.productId === product?._id)
//                                                 );
//                                                 const totalSales = productSales.reduce((sum, order) => {
//                                                     const item = order.items?.find(i => i?.productId === product?._id);
//                                                     return sum + (item?.quantity || 0);
//                                                 }, 0);
//                                                 const totalRevenue = productSales.reduce((sum, order) => {
//                                                     const item = order.items?.find(i => i?.productId === product?._id);
//                                                     if (item) {
//                                                         const price = product?.discountedPrice > 0
//                                                             ? product.discountedPrice
//                                                             : product?.price || 0;
//                                                         return sum + (price * (item?.quantity || 0));
//                                                     }
//                                                     return sum;
//                                                 }, 0);

//                                                 return (
//                                                     <tr key={product?._id} className="hover:bg-slate-50">
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="flex items-center">
//                                                                 <div className="flex-shrink-0 h-10 w-10">
//                                                                     {product?.images?.[0] ? (
//                                                                         <img className="h-10 w-10 rounded-md" src={product.images[0]} alt={product?.name} />
//                                                                     ) : (
//                                                                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="ml-4">
//                                                                     <div className="text-sm font-medium text-gray-900">{product?.name || 'Unnamed Product'}</div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="text-sm text-gray-900">{product?.category || '-'}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                             {formatCurrency(product?.price || 0)}
//                                                             {product?.discountedPrice > 0 && (
//                                                                 <span className="ml-1 text-green-600">
//                                                                     ({formatCurrency(product.discountedPrice)})
//                                                                 </span>
//                                                             )}
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                                 ${product?.stock > 10 ? 'bg-green-100 text-green-800' :
//                                                                     product?.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
//                                                             >
//                                                                 {product?.stock || 0} in stock
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                             <div>{totalSales} sold</div>
//                                                             <div className="text-xs text-gray-400">{formatCurrency(totalRevenue)}</div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Customer Insights Tab */}
//                     {activeTab === 'customers' && (
//                         <div className="space-y-6">
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                                 <div className="lg:col-span-1">
//                                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                         <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Customers</h2>
//                                         <div className="space-y-4">
//                                             {stats.topCustomers.map((customer, index) => (
//                                                 <div key={`${customer.name}-${index}`} className="flex items-center">
//                                                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium mr-3">
//                                                         <User size={16} />
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <div className="font-medium text-slate-800 truncate">{customer.name}</div>
//                                                         <div className="text-sm text-slate-600">
//                                                             {customer.orders} orders • {formatCurrency(customer.total)}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="lg:col-span-2">
//                                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                                         <h2 className="text-lg font-semibold text-slate-800 mb-4">Customer Orders</h2>
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full divide-y divide-gray-200">
//                                                 <thead className="bg-gray-50">
//                                                     <tr>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white divide-y divide-gray-200">
//                                                     {filteredData.map(order => (
//                                                         <tr key={order?._id} className="hover:bg-slate-50">
//                                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                                 <div className="flex items-center">
//                                                                     <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                                         <User className="text-gray-400" size={16} />
//                                                                     </div>
//                                                                     <div className="ml-4">
//                                                                         <div className="text-sm font-medium text-gray-900">
//                                                                             {order?.userName || `Customer ${order?.user?.slice(-4) || 'N/A'}`}
//                                                                         </div>
//                                                                         <div className="text-sm text-gray-500">{order?.userEmail || 'No email'}</div>
//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                 #{order?.orderId?.slice(-6) || 'N/A'}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                 {formatDate(order?.createdAt)}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                                 {getStatusBadge(order?.status)}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                 {formatCurrency(order?.totalAmount)}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         {filteredData.length === 0 && (
//                                             <div className="py-12 text-center">
//                                                 <ShoppingBag className="mx-auto text-slate-300" size={48} />
//                                                 <p className="mt-4 text-slate-500">No orders found</p>
//                                                 <p className="text-sm text-slate-400 mt-2">Try changing your filters</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesAnalysis;

import React from 'react'

function SalesAnalysis() {
    return (
        <div>SalesAnalysis</div>
    )
}

export default SalesAnalysis