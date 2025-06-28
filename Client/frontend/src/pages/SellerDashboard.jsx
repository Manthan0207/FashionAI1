import React from 'react';
import { User, Package, ShoppingCart, Clock, DollarSign, Store, Mail, Phone, Calendar, Eye, CheckCircle, AlertCircle, Box } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';

const SellerDashboard = () => {
    const sellerData = {
        storeName: "Bella Vista Fashion",
        sellerSince: "January 2023",
        email: "contact@bellavista.com",
        phone: "+1 (555) 123-4567",
        stats: {
            totalProducts: 156,
            productsSold: 89,
            pendingApprovals: 12,
            totalRevenue: 24750
        },
        recentUploads: [
            {
                id: 1,
                name: "Summer Floral Dress",
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop&crop=center",
                status: "approved",
                uploadDate: "2 days ago"
            },
            {
                id: 2,
                name: "Casual Denim Jacket",
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop&crop=center",
                status: "pending",
                uploadDate: "3 days ago"
            },
            {
                id: 3,
                name: "Silk Evening Gown",
                image: "https://images.unsplash.com/photo-1566479179817-c0eefdbea8ad?w=150&h=150&fit=crop&crop=center",
                status: "approved",
                uploadDate: "1 week ago"
            },
            {
                id: 4,
                name: "Cotton T-Shirt Set",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop&crop=center",
                status: "pending",
                uploadDate: "1 week ago"
            }
        ]
    };

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
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1">
                        {product.status === 'approved' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500 bg-white rounded-full" />
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{product.uploadDate}</p>
                    <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {product.status === 'approved' ? 'Approved' : 'Pending Review'}
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
                                        <p className="text-lg text-slate-600 mt-1">{sellerData.storeName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm font-medium">Seller Since</span>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">{sellerData.sellerSince}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                icon={Package}
                                title="Total Products"
                                value={sellerData.stats.totalProducts}
                                bgColor="bg-blue-100"
                                textColor="text-blue-600"
                            />
                            <StatCard
                                icon={ShoppingCart}
                                title="Products Sold"
                                value={sellerData.stats.productsSold}
                                bgColor="bg-green-100"
                                textColor="text-green-600"
                            />
                            <StatCard
                                icon={Clock}
                                title="Pending Approvals"
                                value={sellerData.stats.pendingApprovals}
                                bgColor="bg-yellow-100"
                                textColor="text-yellow-600"
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Total Revenue"
                                value={`${sellerData.stats.totalRevenue.toLocaleString()}`}
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
                                        <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium">
                                            <Eye className="w-4 h-4" />
                                            <span>View All</span>
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {sellerData.recentUploads.map((product) => (
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
                                                <p className="font-semibold text-slate-900">{sellerData.storeName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Email</p>
                                                <p className="font-semibold text-slate-900">{sellerData.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Phone</p>
                                                <p className="font-semibold text-slate-900">{sellerData.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                            Add New Product
                                        </button>
                                        <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                            View Analytics
                                        </button>
                                        <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                                            Manage Inventory
                                        </button>
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