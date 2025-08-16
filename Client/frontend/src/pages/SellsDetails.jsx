// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//     ArrowUpRight, ShoppingBag, TrendingUp, DollarSign,
//     Package, CreditCard, Calendar, Filter,
//     RefreshCw, BarChart2, PieChart, ShoppingCart,
//     CheckCircle, XCircle, Clock, User
// } from 'react-feather';
// import { ArrowDownRight } from 'lucide-react';
// import Sidebar from '../components/Sidebar';
// import SellerNavbar from '../components/SellerNavbar';
// import { useOrderStore } from '../store/orderStore';

// const SellsDetails = () => {
//     const [timeFilter, setTimeFilter] = useState('month');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [salesData, setSalesData] = useState([]);
//     const [stats, setStats] = useState({});
//     const [loading, setLoading] = useState(true);

//     const { geSalesDetails } = useOrderStore();


//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const salesData = await geSalesDetails();

//                 setSalesData(salesData);
//                 calculateStats(salesData);
//             } catch (error) {
//                 console.error("Failed to fetch sales data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const calculateStats = (data) => {
//         const totalRevenue = data.reduce((sum, order) => sum + order.totalAmount, 0);
//         const totalOrders = data.length;
//         const totalItems = data.reduce((sum, order) => sum + order.item.quantity, 0);

//         const currentMonthProds = data.filter((val) => new Date(val.createdAt).getMonth() == new Date().getMonth())
//         const prevMonthProds = data.filter((val) => new Date(val.createdAt).getMonth() == new Date().getMonth() - 1)

//         const currentMonthRevenue = currentMonthProds.reduce((sum, order) => sum + order.totalAmount, 0);
//         const prevMonthRevenue = prevMonthProds.reduce((sum, order) => sum + order.totalAmount, 0);
//         const revenueIncDecRate = prevMonthRevenue === 0 ? 100
//             : ((currentMonthRevenue - prevMonthRevenue) * 100) / prevMonthRevenue;
//         const sign = currentMonthRevenue > prevMonthRevenue ? "+" : "-"



//         const currentMonthOrders = currentMonthProds.length
//         const prevMonthOrders = prevMonthProds.length
//         const salesIncDecRate = prevMonthOrders === 0 ? 100
//             : ((currentMonthOrders - prevMonthOrders) * 100) / prevMonthOrders;


//         const itemSoldCurrentMonth = currentMonthProds.length;
//         const itemSoldPrevMonth = prevMonthProds.length;
//         const itemSoldIncDecRate = itemSoldPrevMonth === 0 ? 100
//             : ((itemSoldCurrentMonth - itemSoldPrevMonth) * 100) / itemSoldPrevMonth;


//         // const currentMonthAvgOrder








//         const statusCounts = {
//             Pending: 0,
//             Shipped: 0,
//             Delivered: 0,
//             Cancelled: 0
//         };

//         data.forEach(order => {
//             statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
//         });

//         const topProducts = {};
//         data.forEach(order => {
//             const productName = order.product.name;
//             topProducts[productName] = (topProducts[productName] || 0) + order.item.quantity;
//         });

//         const sortedProducts = Object.entries(topProducts)
//             .sort((a, b) => b[1] - a[1])
//             .slice(0, 5);

//         setStats({
//             totalRevenue,
//             totalOrders,
//             totalItems,
//             statusCounts,
//             topProducts: sortedProducts,
//             sign,
//             revenueIncDecRate,
//             salesIncDecRate,
//             itemSoldIncDecRate
//         });
//     };

//     const getStatusBadge = (status) => {
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

//     const getPaymentStatusBadge = (status) => {
//         return status === "Paid" ? (
//             <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                 Paid
//             </span>
//         ) : (
//             <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                 Unpaid
//             </span>
//         );
//     };

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     const filteredData = salesData.filter(order => {
//         if (statusFilter !== 'all' && order.status !== statusFilter) return false;
//         // Time filtering would be implemented with actual date comparisons
//         return true;
//     });

//     return (
//         <div className="min-h-screen bg-slate-50">
//             <Sidebar />
//             <div className="flex-1 min-w-0 lg:ml-20">
//                 <SellerNavbar />
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//                         {/* <div>
//                             <h1 className="text-3xl font-bold text-slate-800">Sales Dashboard</h1>
//                             <p className="text-slate-600 mt-2">Track your orders, revenue, and performance</p>
//                         </div> */}

//                         <div className="flex items-center gap-4 mt-4 md:mt-0">
//                             <div className="relative">
//                                 <select
//                                     value={timeFilter}
//                                     onChange={(e) => setTimeFilter(e.target.value)}
//                                     className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
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
//                                     value={statusFilter}
//                                     onChange={(e) => setStatusFilter(e.target.value)}
//                                     className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
//                                 >
//                                     <option value="all">All Statuses</option>
//                                     <option value="Pending">Pending</option>
//                                     <option value="Shipped">Shipped</option>
//                                     <option value="Delivered">Delivered</option>
//                                     <option value="Cancelled">Cancelled</option>
//                                 </select>
//                                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.1 }}
//                             className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600">Total Revenue</p>
//                                     <p className="text-2xl font-bold text-slate-800 mt-2">
//                                         {formatCurrency(stats.totalRevenue || 0)}
//                                     </p>
//                                 </div>
//                                 <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
//                                     <DollarSign className="text-indigo-600" size={24} />
//                                 </div>
//                             </div>
//                             <div
//                                 className={`flex items-center mt-3 ${stats.revenueIncDecRate >= 0 ? "text-green-600" : "text-red-500"
//                                     }`}
//                             >
//                                 {stats.revenueIncDecRate >= 0 ? (
//                                     <ArrowUpRight size={16} />
//                                 ) : (
//                                     <ArrowDownRight size={16} />
//                                 )}
//                                 <span className="text-sm ml-1 font-medium">
//                                     {stats.sign}
//                                     {Math.abs(stats.revenueIncDecRate).toFixed(2)}% from last month
//                                 </span>
//                             </div>

//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.2 }}
//                             className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600">Total Orders</p>
//                                     <p className="text-2xl font-bold text-slate-800 mt-2">
//                                         {stats.totalOrders || 0}
//                                     </p>
//                                 </div>
//                                 <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
//                                     <ShoppingBag className="text-blue-600" size={24} />
//                                 </div>
//                             </div>
//                             <div
//                                 className={`flex items-center mt-3 ${stats.salesIncDecRate >= 0 ? "text-green-600" : "text-red-500"
//                                     }`}
//                             >
//                                 {stats.salesIncDecRate >= 0 ? (
//                                     <ArrowUpRight size={16} />
//                                 ) : (
//                                     <ArrowDownRight size={16} />
//                                 )}
//                                 <span className="text-sm ml-1 font-medium">
//                                     {Math.abs(stats.salesIncDecRate).toFixed(2)}% from last month
//                                 </span>
//                             </div>

//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.3 }}
//                             className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600">Items Sold</p>
//                                     <p className="text-2xl font-bold text-slate-800 mt-2">
//                                         {stats.totalItems || 0}
//                                     </p>
//                                 </div>
//                                 <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
//                                     <Package className="text-green-600" size={24} />
//                                 </div>
//                             </div>

//                             <div
//                                 className={`flex items-center mt-3 ${stats.itemSoldIncDecRate >= 0 ? "text-green-600" : "text-red-500"
//                                     }`}
//                             >
//                                 {stats.itemSoldIncDecRate >= 0 ? (
//                                     <ArrowUpRight size={16} />
//                                 ) : (
//                                     <ArrowDownRight size={16} />
//                                 )}
//                                 <span className="text-sm ml-1 font-medium">
//                                     {Math.abs(stats.itemSoldIncDecRate).toFixed(2)}% from last month
//                                 </span>
//                             </div>
//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.4 }}
//                             className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600">Avg. Order Value</p>
//                                     <p className="text-2xl font-bold text-slate-800 mt-2">
//                                         {stats.totalOrders ? formatCurrency(stats.totalRevenue / stats.totalOrders) : formatCurrency(0)}
//                                     </p>
//                                 </div>
//                                 <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
//                                     <TrendingUp className="text-purple-600" size={24} />
//                                 </div>
//                             </div>
//                             {/* <div className="flex items-center text-green-600 mt-3">
//                             <ArrowUpRight size={16} />
//                             <span className="text-sm ml-1">4.3% from last month</span>
//                         </div> */}
//                         </motion.div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Sales Table */}
//                         <div className="lg:col-span-2">
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.5 }}
//                                 className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
//                             >
//                                 <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
//                                     <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
//                                     <p className="text-slate-600 text-sm">{filteredData.length} orders</p>
//                                 </div>

//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-slate-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-slate-200">
//                                             {filteredData.map((order, index) => (
//                                                 <tr key={`${order._id}-${index}`} className="hover:bg-slate-50">
//                                                     <td className="px-6 py-4">
//                                                         <div className="flex items-center">
//                                                             <img
//                                                                 src={order.item.image}
//                                                                 alt={order.product.name}
//                                                                 className="w-10 h-10 rounded-md object-cover mr-3"
//                                                             />
//                                                             <div>
//                                                                 <div className="font-medium text-slate-800">{order.product.name}</div>
//                                                                 <div className="text-sm text-slate-600">
//                                                                     {order.item.quantity} × {formatCurrency(order.product.price)}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm text-slate-600">
//                                                         #{order.orderId.slice(-6)}
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm text-slate-600">
//                                                         {formatDate(order.createdAt)}
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="flex flex-col gap-1">
//                                                             {getStatusBadge(order.status)}
//                                                             {getPaymentStatusBadge(order.paymentStatus)}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 font-medium text-slate-800">
//                                                         {formatCurrency(order.totalAmount)}
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </motion.div>
//                         </div>

//                         {/* Analytics Sidebar */}
//                         <div className="space-y-8">
//                             {/* Status Distribution */}
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.6 }}
//                                 className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                             >
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-lg font-semibold text-slate-800">Order Status</h2>
//                                     <PieChart className="text-indigo-600" size={20} />
//                                 </div>

//                                 <div className="space-y-4">
//                                     {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
//                                         <div key={status}>
//                                             <div className="flex justify-between text-sm mb-1">
//                                                 <span className="text-slate-700">{status}</span>
//                                                 <span className="font-medium">{count} orders</span>
//                                             </div>
//                                             <div className="w-full bg-slate-200 rounded-full h-2">
//                                                 <div
//                                                     className={`h-2 rounded-full ${status === 'Delivered' ? 'bg-green-500' :
//                                                         status === 'Shipped' ? 'bg-blue-500' :
//                                                             status === 'Pending' ? 'bg-yellow-500' :
//                                                                 'bg-red-500'
//                                                         }`}
//                                                     style={{ width: `${(count / stats.totalOrders) * 100 || 0}%` }}
//                                                 ></div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </motion.div>

//                             {/* Top Products */}
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.7 }}
//                                 className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                             >
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-lg font-semibold text-slate-800">Top Products</h2>
//                                     <BarChart2 className="text-indigo-600" size={20} />
//                                 </div>

//                                 <div className="space-y-4">
//                                     {stats.topProducts?.map(([product, count], index) => (
//                                         <div key={product} className="flex items-center">
//                                             <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-3">
//                                                 {index + 1}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <div className="font-medium text-slate-800">{product}</div>
//                                                 <div className="text-sm text-slate-600">{count} sold</div>
//                                             </div>
//                                             <div className="text-slate-800 font-medium">
//                                                 {formatCurrency(
//                                                     salesData.find(o => o.product.name === product)?.product.price * count || 0
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </motion.div>

//                             {/* Recent Activity */}
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.8 }}
//                                 className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
//                             >
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
//                                     <Clock className="text-indigo-600" size={20} />
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div className="flex">
//                                         <div className="mr-3">
//                                             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                                                 <CheckCircle className="text-green-600" size={16} />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-slate-800">Order #D786F2 delivered</p>
//                                             <p className="text-sm text-slate-600">2 hours ago</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex">
//                                         <div className="mr-3">
//                                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                                                 <Package className="text-blue-600" size={16} />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-slate-800">Order #A342B1 shipped</p>
//                                             <p className="text-sm text-slate-600">5 hours ago</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex">
//                                         <div className="mr-3">
//                                             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                                                 <ShoppingCart className="text-indigo-600" size={16} />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-slate-800">New order #C934D2 placed</p>
//                                             <p className="text-sm text-slate-600">Yesterday</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SellsDetails;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight, ShoppingBag, TrendingUp, DollarSign,
    Package, CreditCard, Calendar, Filter,
    RefreshCw, BarChart2, PieChart, ShoppingCart,
    CheckCircle, XCircle, Clock, User, Loader
} from 'react-feather';
import { ArrowDownRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SellerNavbar from '../components/SellerNavbar';
import { useOrderStore } from '../store/orderStore';

const SellsDetails = () => {
    const [timeFilter, setTimeFilter] = useState('month');
    const [statusFilter, setStatusFilter] = useState('all');
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    const { geSalesDetails } = useOrderStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const salesData = await geSalesDetails();
                setSalesData(salesData);
                calculateStats(salesData);
            } catch (error) {
                console.error("Failed to fetch sales data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters whenever timeFilter, statusFilter or salesData changes
    useEffect(() => {
        if (salesData.length === 0) return;

        const filtered = salesData.filter(order => {
            // Time filtering
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            let startDate = new Date(0); // Default to beginning of time

            switch (timeFilter) {
                case 'today':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'quarter':

                    startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                    break;

                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    startDate = new Date(0);
            }

            // Status filtering
            const statusMatch = statusFilter === 'all' || order.status === statusFilter;

            return orderDate >= startDate && statusMatch;
        });

        // Sort by date descending (most recent first)
        const sorted = [...filtered].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFilteredData(sorted);
    }, [salesData, timeFilter, statusFilter]);

    const calculateStats = (data) => {
        const totalRevenue = data.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = data.length;
        const totalItems = data.reduce((sum, order) => sum + order.item.quantity, 0);

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthProds = data.filter(order =>
            new Date(order.createdAt) >= currentMonthStart
        );

        const prevMonthProds = data.filter(order =>
            new Date(order.createdAt) >= prevMonthStart &&
            new Date(order.createdAt) <= prevMonthEnd
        );

        const currentMonthRevenue = currentMonthProds.reduce((sum, order) => sum + order.totalAmount, 0);
        const prevMonthRevenue = prevMonthProds.reduce((sum, order) => sum + order.totalAmount, 0);

        const revenueIncDecRate = prevMonthRevenue === 0 ? 100
            : ((currentMonthRevenue - prevMonthRevenue) * 100) / prevMonthRevenue;
        const sign = currentMonthRevenue >= prevMonthRevenue ? "+" : "";

        const currentMonthOrders = currentMonthProds.length;
        const prevMonthOrders = prevMonthProds.length;
        const salesIncDecRate = prevMonthOrders === 0 ? 100
            : ((currentMonthOrders - prevMonthOrders) * 100) / prevMonthOrders;

        const itemSoldCurrentMonth = currentMonthProds.reduce((sum, order) => sum + order.item.quantity, 0);
        const itemSoldPrevMonth = prevMonthProds.reduce((sum, order) => sum + order.item.quantity, 0);
        const itemSoldIncDecRate = itemSoldPrevMonth === 0 ? 100
            : ((itemSoldCurrentMonth - itemSoldPrevMonth) * 100) / itemSoldPrevMonth;

        // Status counts
        const statusCounts = {
            Pending: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };

        data.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        // Top products
        const topProducts = {};
        data.forEach(order => {
            const productName = order.product.name;
            topProducts[productName] = (topProducts[productName] || 0) + order.item.quantity;
        });

        const sortedProducts = Object.entries(topProducts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        setStats({
            totalRevenue,
            totalOrders,
            totalItems,
            statusCounts,
            topProducts: sortedProducts,
            sign,
            revenueIncDecRate,
            salesIncDecRate,
            itemSoldIncDecRate,
            currentMonthRevenue,
            prevMonthRevenue,
            currentMonthOrders,
            prevMonthOrders,
            itemSoldCurrentMonth,
            itemSoldPrevMonth
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            Pending: "bg-yellow-100 text-yellow-800",
            Shipped: "bg-blue-100 text-blue-800",
            Delivered: "bg-green-100 text-green-800",
            Cancelled: "bg-red-100 text-red-800"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        return status === "Paid" ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Unpaid
            </span>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getTimeFilterLabel = () => {
        switch (timeFilter) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            case 'quarter': return 'This Quarter';
            case 'year': return 'This Year';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 min-w-0 lg:ml-20">
                <SellerNavbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Sales Dashboard</h1>
                            <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">
                                Showing data for <span className="font-semibold">{getTimeFilterLabel()}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                            <div className="relative">
                                <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm md:text-base"
                                >
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="quarter">This Quarter</option>
                                    <option value="year">This Year</option>
                                </select>
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                            </div>

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 text-sm md:text-base"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="animate-spin text-indigo-600" size={32} />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600 text-sm">Total Revenue</p>
                                            <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                                                {formatCurrency(stats.totalRevenue || 0)}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {formatCurrency(stats.currentMonthRevenue)} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <DollarSign className="text-indigo-600" size={20} />
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center mt-3 text-sm ${stats.revenueIncDecRate >= 0 ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {stats.revenueIncDecRate >= 0 ? (
                                            <ArrowUpRight size={16} />
                                        ) : (
                                            <ArrowDownRight size={16} />
                                        )}
                                        <span className="ml-1 font-medium">
                                            {stats.sign}
                                            {Math.abs(stats.revenueIncDecRate).toFixed(2)}% from last month
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600 text-sm">Total Orders</p>
                                            <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                                                {stats.totalOrders || 0}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {stats.currentMonthOrders} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <ShoppingBag className="text-blue-600" size={20} />
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center mt-3 text-sm ${stats.salesIncDecRate >= 0 ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {stats.salesIncDecRate >= 0 ? (
                                            <ArrowUpRight size={16} />
                                        ) : (
                                            <ArrowDownRight size={16} />
                                        )}
                                        <span className="ml-1 font-medium">
                                            {Math.abs(stats.salesIncDecRate).toFixed(2)}% from last month
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600 text-sm">Items Sold</p>
                                            <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                                                {stats.totalItems || 0}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {stats.itemSoldCurrentMonth} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                            <Package className="text-green-600" size={20} />
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center mt-3 text-sm ${stats.itemSoldIncDecRate >= 0 ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {stats.itemSoldIncDecRate >= 0 ? (
                                            <ArrowUpRight size={16} />
                                        ) : (
                                            <ArrowDownRight size={16} />
                                        )}
                                        <span className="ml-1 font-medium">
                                            {Math.abs(stats.itemSoldIncDecRate).toFixed(2)}% from last month
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-600 text-sm">Avg. Order Value</p>
                                            <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                                                {stats.totalOrders ? formatCurrency(stats.totalRevenue / stats.totalOrders) : formatCurrency(0)}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {stats.currentMonthOrders ? formatCurrency(stats.currentMonthRevenue / stats.currentMonthOrders) : formatCurrency(0)} this month
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <TrendingUp className="text-purple-600" size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Sales Table */}
                                <div className="lg:col-span-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 sm:px-6 border-b border-slate-200 flex items-center justify-between">
                                            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Recent Orders</h2>
                                            <p className="text-slate-600 text-sm">{filteredData.length} orders</p>
                                        </div>

                                        {filteredData.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <ShoppingBag className="mx-auto text-slate-300" size={48} />
                                                <p className="mt-4 text-slate-500">No orders found</p>
                                                <p className="text-sm text-slate-400 mt-2">Try changing your filters</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-max">
                                                    <thead className="bg-slate-50">
                                                        <tr>
                                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                                            <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200">
                                                        {filteredData.map((order) => (
                                                            <tr key={order._id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 sm:px-6">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                                                                            <img
                                                                                src={order.item.image}
                                                                                alt={order.product.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <div className="font-medium text-slate-800 text-sm">{order.product.name}</div>
                                                                            <div className="text-xs text-slate-600">
                                                                                {order.item.quantity} × {formatCurrency(order.product.price)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 sm:px-6 text-sm text-slate-600">
                                                                    #{order.orderId.slice(-6)}
                                                                </td>
                                                                <td className="px-4 py-3 sm:px-6 text-sm text-slate-600">
                                                                    {formatDate(order.createdAt)}
                                                                </td>
                                                                <td className="px-4 py-3 sm:px-6">
                                                                    <div className="flex flex-col gap-1">
                                                                        {getStatusBadge(order.status)}
                                                                        {getPaymentStatusBadge(order.paymentStatus)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 sm:px-6 font-medium text-slate-800 text-sm">
                                                                    {formatCurrency(order.totalAmount)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Analytics Sidebar */}
                                <div className="space-y-6">
                                    {/* Status Distribution */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Order Status</h2>
                                            <PieChart className="text-indigo-600" size={20} />
                                        </div>

                                        <div className="space-y-3">
                                            {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                                                <div key={status}>
                                                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                                                        <span className="text-slate-700">{status}</span>
                                                        <span className="font-medium">{count} orders</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${status === 'Delivered' ? 'bg-green-500' :
                                                                status === 'Shipped' ? 'bg-blue-500' :
                                                                    status === 'Pending' ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                }`}
                                                            style={{ width: `${(count / stats.totalOrders) * 100 || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Top Products */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Top Products</h2>
                                            <BarChart2 className="text-indigo-600" size={20} />
                                        </div>

                                        <div className="space-y-3">
                                            {stats.topProducts?.map(([product, count], index) => (
                                                <div key={product} className="flex items-center">
                                                    <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-xs mr-3">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 truncate">
                                                        <div className="font-medium text-slate-800 text-sm truncate">{product}</div>
                                                        <div className="text-xs text-slate-600">{count} sold</div>
                                                    </div>
                                                    <div className="text-slate-800 font-medium text-sm">
                                                        {formatCurrency(
                                                            salesData.find(o => o.product.name === product)?.product.price * count || 0
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellsDetails;