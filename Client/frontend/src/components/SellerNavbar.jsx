import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { User, Package, DollarSign, Box, Plus, Eye, ArrowLeft } from 'lucide-react'

function SellerNavbar() {
    const location = useLocation()
    const currentPath = location.pathname

    // Define your nav items with label, path, icon
    const navItems = [
        { label: 'Dashboard', path: '/seller-dashboard', icon: <Package className="w-4 h-4" /> },
        { label: 'Inventory', path: '/seller-inventory', icon: <Box className="w-4 h-4" /> },
        { label: 'Add Products', path: '/upload-product', icon: <Plus className="w-4 h-4" /> },
        { label: 'Sales', path: '/seller-sales', icon: <DollarSign className="w-4 h-4" /> },
        // { label: 'Profile', path: '/seller-profile', icon: <User className="w-4 h-4" /> },
        // { label: 'Analytics', path: '/seller-analytics', icon: <Eye className="w-4 h-4" /> },
    ]

    return (
        <div className="bg-white shadow-sm border-b border-slate-200">
            <div className="px-8 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Pills Navigation */}
                    <div className="flex flex-wrap items-center gap-3">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.path
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors duration-200 cursor-pointer
                                        ${isActive
                                            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Back Button */}
                    <Link to="/seller-dashboard" className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">Back to Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SellerNavbar
