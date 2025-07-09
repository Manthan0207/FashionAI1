"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Home,
    ShoppingBag,
    Heart,
    User,
    Settings,
    Search,
    TrendingUp,
    Star,
    Menu,
    X,
    Sparkles,
    Store,
} from "lucide-react"
import { useAuthStore } from "../store/authStore"

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isLargeScreen, setIsLargeScreen] = useState(false)
    const { user } = useAuthStore()
    const location = useLocation()

    // Detect screen size to handle sidebar state
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])


    const menuItems = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: ShoppingBag, label: "Collections", path: "/collections" },
        { icon: TrendingUp, label: "Trending", path: "/trending" },
        { icon: Heart, label: "Favorites", path: "/favorites" },
        { icon: Star, label: "Featured", path: "/featured" },
        { icon: Search, label: "Discover", path: "/discover" },
        { icon: User, label: "Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: ShoppingBag, label: "Orders", path: '/orders' },
        ...(user?.isSeller ? [{ icon: Store, label: "Seller Dashboard", path: "/seller-dashboard" }] : []),
    ]

    const menuItemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: i * 0.05,
                type: "spring",
                stiffness: 100,
            },
        }),
    }

    const isExpanded = isLargeScreen ? isHovered : isOpen

    return (
        <>
            {/* Mobile Menu Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} className="text-slate-700" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu size={24} className="text-slate-700" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && !isLargeScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${isLargeScreen ? (isHovered ? "w-72" : "w-20") : isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
                    }`}
                onMouseEnter={() => isLargeScreen && setIsHovered(true)}
                onMouseLeave={() => isLargeScreen && setIsHovered(false)}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50" />

                {/* Content */}
                <div className="relative h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-slate-200/50">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse" />
                            </div>
                            <div
                                className={`transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                    }`}
                            >
                                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent whitespace-nowrap">
                                    Vesture
                                </h1>
                                <p className="text-slate-500 text-xs font-medium whitespace-nowrap">Fashion Forward</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 pt-6 px-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <motion.li
                                        key={item.label}
                                        custom={index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                                                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                                                }`}
                                            title={!isExpanded ? item.label : ""}
                                            onClick={() => !isLargeScreen && setIsOpen(false)}
                                        >
                                            {/* Background shimmer effect for active items */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 shimmer-animation" />
                                            )}
                                            <div
                                                className={`relative z-10 flex-shrink-0 ${isActive ? "text-white" : "group-hover:text-indigo-600"
                                                    }`}
                                            >
                                                <item.icon size={20} />
                                            </div>
                                            <span
                                                className={`font-medium text-sm relative z-10 transition-all duration-300 whitespace-nowrap ${isActive ? "text-white" : "group-hover:text-indigo-600"
                                                    } ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                                            >
                                                {item.label}
                                            </span>
                                            {isActive && isExpanded && (
                                                <div className="ml-auto w-2 h-2 bg-white rounded-full relative z-10" />
                                            )}
                                        </Link>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-slate-200/50">
                        <div
                            className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"
                                } p-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-200/50`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div
                                className={`flex-1 transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                    }`}
                            >
                                <p className="font-semibold text-slate-800 text-sm whitespace-nowrap">{user?.name || "Alex Johnson"}</p>
                                <p className="text-slate-500 text-xs whitespace-nowrap">Premium Member</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                .shimmer-animation {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </>
    )
}

export default Sidebar
