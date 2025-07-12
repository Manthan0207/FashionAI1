import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Sidebar from '../components/Sidebar'
import {
    Search,
    Filter,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    DollarSign,
    Truck,
    ArrowLeft,
    Download,
    RefreshCw,
    ShoppingBag,
    User,
    MapPin,
    CreditCard,
    Banknote,
    Wallet,
    Loader2,
    Edit3
} from "lucide-react"
import { useOrderStore } from '../store/orderStore'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
// Note: Replace with your actual routing solution
// import { Link, useNavigate } from 'react-router-dom'

function AllOrderPage() {
    const { getAllOrders, allOrders } = useOrderStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItemForReview, setSelectedItemForReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const { reviewProduct, user, prods } = useAuthStore();

    // const navigate = useNavigate(); // Replace with your navigation function

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (allOrders) {
            console.log(allOrders);
            setOrders(allOrders);
            setLoading(false);
        }
    }, [allOrders])

    const getData = async () => {
        setLoading(true);
        await getAllOrders();
    }

    // Get order status colors and icons
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, bgColor: 'bg-yellow-500' };
            case 'processing':
                return { color: 'bg-blue-100 text-blue-800', icon: Package, bgColor: 'bg-blue-500' };
            case 'shipped':
                return { color: 'bg-purple-100 text-purple-800', icon: Truck, bgColor: 'bg-purple-500' };
            case 'delivered':
                return { color: 'bg-green-100 text-green-800', icon: CheckCircle, bgColor: 'bg-green-500' };
            case 'cancelled':
                return { color: 'bg-red-100 text-red-800', icon: XCircle, bgColor: 'bg-red-500' };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: Package, bgColor: 'bg-gray-500' };
        }
    };

    // Get payment method icon
    const getPaymentIcon = (method) => {
        switch (method?.toLowerCase()) {
            case 'creditcard':
                return CreditCard;
            case 'cod':
                return Wallet;
            case 'paypal':
                return Banknote;
            default:
                return CreditCard;
        }
    };

    // Filter and sort orders
    const filteredOrders = orders?.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'highest':
                return b.totalAmount - a.totalAmount;
            case 'lowest':
                return a.totalAmount - b.totalAmount;
            default:
                return 0;
        }
    });

    // Get unique statuses
    const statuses = ["All", ...new Set(orders?.map(order => order.status) || [])];

    // Calculate stats
    const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'Pending')?.length || 0,
        delivered: orders?.filter(o => o.status === 'Delivered')?.length || 0,
        revenue: orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReviewSubmit = async (item, rating, reviewText) => {
        console.log("Review submitted for product:", {
            prodId: item.productId,
            rating,
            review: reviewText
        });
        const data = {
            prodId: item.productId,
            rating,
            review: reviewText
        }


        try {
            await reviewProduct(data);

            // Close modal and reset selected item
            setShowReviewModal(false);
            setSelectedItemForReview(null);

            // Show success message
            toast.success("Review submitted successfully!");
        } catch (error) {
            setShowReviewModal(false);
            setSelectedItemForReview(null);
            toast.error("Please try again")
        }
    };

    // console.log("Selected : ", selectedItemForReview);

    //                     const isReviewed = selectedItemForReview.reviews.map((revs) => revs.user == user._id)
    //                     setShowReviewModal(false);
    //                     if (isReviewed) {
    //                         setRating(isReviewed.rating)
    //                         setReviewText(isReviewed.comment)
    //                     }



    const ProductSelectionModal = ({ order, onClose, onSelectProduct }) => {
        if (!order) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                >
                    {/* Header */}
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Select Product to Review</h2>
                                <p className="text-slate-600">Choose a product from order #{order._id.slice(-8)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <XCircle size={24} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                                    onClick={() => onSelectProduct(item)}
                                >
                                    <img
                                        src={item.image || `https://placehold.co/80x80?text=Product`}
                                        alt="Product"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800">Product ID: {item.productId}</h3>
                                        <p className="text-sm text-slate-600">
                                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-indigo-500">
                                        <Edit3 size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    const ReviewModal = ({ item, onClose, onSubmit }) => {
        const [rating, setRating] = useState(0);
        const [reviewText, setReviewText] = useState("");
        console.log("Item :", item);
        console.log(typeof item);
        console.log("ProdId ", typeof item, item.productId);
        console.log("ProdId in prods ", typeof prods[0]._id, prods[0]._id);

        console.log("UserId ", typeof user._id);

        console.log("Found Prod : ", prods.find((itm) => String(item.productId) === itm._id)
            .reviews.find((matchUserId) => String(matchUserId.user) === String(user._id))
        );

        const matchedProd = prods.find((itm) => String(item.productId) === itm._id)
            .reviews.find((matchUserId) => String(matchUserId.user) === String(user._id));







        useEffect(() => {
            setReviewText(matchedProd.comment);
            setRating(matchedProd.rating);
        }
            , []);
        if (!item) return null;

        const handleSubmit = () => {
            onSubmit(item, rating, reviewText);
            // Reset local state after submission
            setRating(0);
            setReviewText("");
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                >
                    {/* Header */}
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Leave a Review</h2>
                                <p className="text-slate-600">Share your experience with this product</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <XCircle size={24} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Product Info */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                            <img
                                src={item.image || `https://placehold.co/80x80?text=Product`}
                                alt="Product"
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-medium text-slate-800">Product ID: {item.productId}</h3>
                                <p className="text-sm text-slate-600">
                                    Size: {item.size} | Color: {item.color}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                How would you rate this product?
                            </label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="text-3xl focus:outline-none transition-colors"
                                    >
                                        {star <= rating ? (
                                            <span className="text-yellow-500">★</span>
                                        ) : (
                                            <span className="text-slate-300">☆</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Your Review
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] transition-all"
                                placeholder="Share details about your experience with this product..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0}
                                className={`flex-1 py-3 rounded-lg text-white font-medium transition ${rating === 0
                                    ? "bg-indigo-300 cursor-not-allowed"
                                    : "bg-indigo-500 hover:bg-indigo-600"
                                    }`}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        const PaymentIcon = getPaymentIcon(order.paymentMethod);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Order Details</h2>
                                <p className="text-slate-600">Order #{order._id}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <XCircle size={24} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Status and Date */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                                                <StatusIcon size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-600">Order Date</p>
                                            <p className="font-medium text-slate-800">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Items Ordered</h3>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                                <img
                                                    src={item.image || `https://placehold.co/80x80?text=Product`}
                                                    alt="Product"
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-slate-800">Product ID: {item.productId}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                                        <span>Size: {item.size}</span>
                                                        <span>Color: {item.color}</span>
                                                        <span>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Delivery Address</h3>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={20} className="text-slate-600 mt-1" />
                                            <div>
                                                <p className="font-medium text-slate-800">{order.deliveryAddress.street}</p>
                                                <p className="text-slate-600">
                                                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                                                </p>
                                                <p className="text-slate-600">{order.deliveryAddress.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-slate-50 rounded-xl p-6 sticky top-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>

                                    {/* Payment Method */}
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg">
                                        <PaymentIcon size={20} className="text-slate-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {order.paymentMethod === 'creditCard' ? 'Credit Card' :
                                                    order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                                        'PayPal'}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                Status: {order.paymentStatus}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="font-medium">₹{order.subTotal}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Shipping</span>
                                            <span className="font-medium">₹{order.shippingCharge}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Tax</span>
                                            <span className="font-medium">₹{order.taxCharge?.toFixed(2) || 0}</span>
                                        </div>
                                        {order.codConvenienceFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">COD Fee</span>
                                                <span className="font-medium">₹{order.codConvenienceFee}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold text-slate-800">Total</span>
                                                <span className="text-lg font-bold text-slate-800">₹{order.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                                            Track Order
                                        </button>
                                        <button className="w-full border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            Download Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 w-full transition-all duration-300 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-600">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => window.history.back()} // Replace with your navigation
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back</span>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">All Orders</h1>
                                    <p className="text-slate-600">Manage and track all your orders ({stats.total} orders)</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={getData}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    <RefreshCw size={18} />
                                    <span>Refresh</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <Download size={18} />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {[
                            { label: "Total Orders", value: stats.total.toString(), icon: ShoppingBag, color: "indigo" },
                            { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "yellow" },
                            { label: "Delivered", value: stats.delivered.toString(), icon: CheckCircle, color: "green" },
                            { label: "Total Shopping Amount", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "purple" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                                        <p className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</p>
                                    </div>
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center`}
                                        style={{
                                            background:
                                                stat.color === "indigo"
                                                    ? "linear-gradient(to right, #6366f1, #4f46e5)"
                                                    : stat.color === "yellow"
                                                        ? "linear-gradient(to right, #f59e0b, #d97706)"
                                                        : stat.color === "green"
                                                            ? "linear-gradient(to right, #10b981, #059669)"
                                                            : "linear-gradient(to right, #8b5cf6, #7c3aed)",
                                        }}
                                    >
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search orders by ID or product..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-slate-600" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                        </div>
                    </div>

                    {/* Orders List */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {sortedOrders.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            const PaymentIcon = getPaymentIcon(order.paymentMethod);

                            return (
                                <motion.div
                                    key={order._id}
                                    variants={itemVariants}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Left Section */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                                                        <StatusIcon size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 text-lg">
                                                            Order #{order._id.slice(-8)}
                                                        </h3>
                                                        <p className="text-slate-600 text-sm">
                                                            {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Package size={16} className="text-slate-600" />
                                                        <span className="text-sm text-slate-600">
                                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <PaymentIcon size={16} className="text-slate-600" />
                                                        <span className="text-sm text-slate-600">
                                                            {order.paymentMethod === 'creditCard' ? 'Credit Card' :
                                                                order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                                                    'PayPal'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={16} className="text-slate-600" />
                                                        <span className="text-sm text-slate-600">
                                                            {order.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin size={16} className="text-slate-600" />
                                                    <span className="text-sm text-slate-600">
                                                        {order.deliveryAddress.city}, {order.deliveryAddress.state}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Section */}
                                            <div className="flex flex-col lg:items-end gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                                        {order.status}
                                                    </span>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-slate-800">
                                                            ₹{order.totalAmount}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Total Amount
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowOrderDetails(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors
                                                        cursor-pointer"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrderForReview(order);
                                                            setShowProductSelectionModal(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                                    >
                                                        <Edit3 size={16} />
                                                        <span>Leave a Review</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Empty State */}
                    {sortedOrders.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <ShoppingBag size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No orders found</h3>
                            <p className="text-slate-600">
                                {searchTerm || statusFilter !== "All"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Orders will appear here once customers start placing them"
                                }
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Product Selection Modal */}
            {showProductSelectionModal && selectedOrderForReview && (
                <ProductSelectionModal
                    order={selectedOrderForReview}
                    onClose={() => {
                        setShowProductSelectionModal(false);
                        setSelectedOrderForReview(null);
                    }}
                    onSelectProduct={(item) => {
                        setShowProductSelectionModal(false);
                        setSelectedOrderForReview(null);
                        setSelectedItemForReview(item);
                        setShowReviewModal(true);
                    }}
                />
            )}

            {/* Review Modal */}
            {showReviewModal && selectedItemForReview && (
                <ReviewModal
                    item={selectedItemForReview}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedItemForReview(null);
                        // Remove these lines since state is managed locally in modal:
                        // setRating(0);
                        // setReviewText("");
                    }}
                    onSubmit={handleReviewSubmit}

                />
            )}
        </div>
    );
}

export default AllOrderPage;