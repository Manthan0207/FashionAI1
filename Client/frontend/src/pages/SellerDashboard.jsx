import React from 'react';
import { User, Package, ShoppingCart, Clock, DollarSign, Store, Mail, Phone, Calendar, Eye, CheckCircle, AlertCircle, Box, IndianRupee } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const SellerDashboard = () => {
    const { user, getProducts } = useAuthStore()
    const [prod, setProd] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = async () => {
        let prods = null;
        let message = "";
        let errors = null;

        try {
            const response = await axios.get('http://localhost:3000/api/seller/get-seller-prods');
            prods = response.data.prods;
            message = response.data.message;
        } catch (error) {
            errors = error.message;
            message = "Error in getting data";
        }

        return { prods, message, errors };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { prods, message, errors } = await getData();
            setProd(prods);
            setLoading(false);
        };
        fetchData();

    }, []);

    function formatDateWithOrdinal(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'long' });

        const ordinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${ordinal(day)} ${month}`;
    }



    const StatCard = ({ icon: Icon, title, value, bgColor, textColor }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
            </div>
        </div>
    );

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow duration-200 ">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />

                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{product.uploadDate}</p>
                    <div className="flex items-center mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ₹{product.price}

                        </span>
                    </div>
                </div>

            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 lg:ml-20">
                {/* Pills Navigation Header */}
                <SellerNavbar />

                {/* Main Content */}
                <div className="overflow-auto">
                    <div className="p-8">
                        {/* Welcome Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Store className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
                                        <p className="text-lg text-slate-600 mt-1">{user.store.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm font-medium">Seller Since</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{formatDateWithOrdinal(user.sellerSince)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                icon={Package}
                                title="Total Products"
                                value={prod.length}
                                bgColor="bg-blue-100"
                                textColor="text-blue-600"
                            />
                            <StatCard
                                icon={ShoppingCart}
                                title="Products Sold"
                                value={prod.reduce((sum, item) => sum + item.totalSales, 0)}

                                bgColor="bg-green-100"
                                textColor="text-green-600"
                            />
                            <StatCard
                                icon={Clock}
                                title="Pending Approvals"
                                value={0}
                                bgColor="bg-yellow-100"
                                textColor="text-yellow-600"
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Total Revenue"
                                // value={`${sellerData.stats.totalRevenue.toLocaleString()}`}
                                value={prod.reduce((cur, next) => cur + (next.totalSales * next.price), 0)}
                                bgColor="bg-indigo-100"
                                textColor="text-indigo-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Uploads */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900">Recent Uploads</h2>
                                        <Link to='/seller-inventory' className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium">
                                            <Eye className="w-4 h-4" />
                                            <span>View All</span>
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {prod.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Store Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Store className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Store Name</p>
                                                <p className="font-semibold text-slate-900">{user.store.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Email</p>
                                                <p className="font-semibold text-slate-900">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Phone</p>
                                                <p className="font-semibold text-slate-900">{user.store.contactPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/upload-product"
                                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            Add New Product
                                        </Link>
                                        <Link
                                            to="/seller-analytics"
                                            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            View Analytics
                                        </Link>
                                        <Link
                                            to="/seller-inventory"
                                            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            Manage Inventory
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;