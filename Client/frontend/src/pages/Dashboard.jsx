// // Dashboard.jsx
// import React from "react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";

// const Dashboard = () => {
//     const clothes = [
//         {
//             id: 1,
//             name: "Stylish Jacket",
//             price: "$59.99",
//             image: "https://via.placeholder.com/200x250.png?text=Jacket"
//         },
//         {
//             id: 2,
//             name: "Trendy T-shirt",
//             price: "$19.99",
//             image: "https://via.placeholder.com/200x250.png?text=T-shirt"
//         },
//         {
//             id: 3,
//             name: "Elegant Dress",
//             price: "$79.99",
//             image: "/landing1.jpeg"
//         }
//     ];

//     return (
//         <div className="flex">
//             <Sidebar />
//             <div className="flex-1 ml-20 lg:ml-60">

//                 <main className="pt-24 px-6">
//                     <h2 className="text-2xl font-bold text-emerald-600 mb-6">Explore Our Collection</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {clothes.map((item) => (
//                             <motion.div
//                                 key={item.id}
//                                 whileHover={{ scale: 1.03 }}
//                                 className="bg-white rounded-xl shadow-md overflow-hidden"
//                             >
//                                 <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="w-full h-60 object-cover"
//                                 />
//                                 <div className="p-4">
//                                     <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
//                                     <p className="text-emerald-600 font-bold">{item.price}</p>
//                                     <button className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition">Try On</button>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;


import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from '../components/Sidebar'
import { Search, Filter, Heart, ShoppingCart, Star, Eye, TrendingUp, Zap } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")

    const categories = ["All", "Jackets", "T-Shirts", "Dresses", "Accessories"]

    const clothes = [
        {
            id: 1,
            name: "Premium Leather Jacket",
            price: "$159.99",
            originalPrice: "$199.99",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
            rating: 4.8,
            reviews: 124,
            category: "Jackets",
            isNew: true,
            isTrending: true,
        },
        {
            id: 2,
            name: "Organic Cotton Tee",
            price: "$29.99",
            originalPrice: "$39.99",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
            rating: 4.6,
            reviews: 89,
            category: "T-Shirts",
            isNew: false,
            isTrending: false,
        },
        {
            id: 3,
            name: "Elegant Summer Dress",
            price: "$89.99",
            originalPrice: "$120.00",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
            rating: 4.9,
            reviews: 201,
            category: "Dresses",
            isNew: true,
            isTrending: true,
        },
        {
            id: 4,
            name: "Vintage Denim Jacket",
            price: "$79.99",
            originalPrice: "$95.00",
            image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop",
            rating: 4.7,
            reviews: 156,
            category: "Jackets",
            isNew: false,
            isTrending: true,
        },
        {
            id: 5,
            name: "Minimalist White Tee",
            price: "$24.99",
            originalPrice: "$32.00",
            image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=400&fit=crop",
            rating: 4.5,
            reviews: 78,
            category: "T-Shirts",
            isNew: false,
            isTrending: false,
        },
        {
            id: 6,
            name: "Floral Maxi Dress",
            price: "$119.99",
            originalPrice: "$150.00",
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop",
            rating: 4.8,
            reviews: 167,
            category: "Dresses",
            isNew: true,
            isTrending: false,
        },
    ]

    const filteredClothes = clothes.filter(
        (item) =>
            (activeCategory === "All" || item.category === activeCategory) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    const handleClick = (e) => {
        console.log(e.target.id);

    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Fashion Collection</h1>
                                <p className="text-slate-600">Discover your perfect style</p>
                            </div>

                            {/* Search Bar - Fixed transparency */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for clothes..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {[
                            { label: "Total Items", value: "156", icon: ShoppingCart, color: "emerald" },
                            { label: "New Arrivals", value: "24", icon: Zap, color: "blue" },
                            { label: "Trending", value: "12", icon: TrendingUp, color: "purple" },
                            { label: "Favorites", value: "38", icon: Heart, color: "pink" },
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
                                                stat.color === "emerald"
                                                    ? "linear-gradient(to right, #10b981, #059669)"
                                                    : stat.color === "blue"
                                                        ? "linear-gradient(to right, #3b82f6, #2563eb)"
                                                        : stat.color === "purple"
                                                            ? "linear-gradient(to right, #8b5cf6, #7c3aed)"
                                                            : "linear-gradient(to right, #ec4899, #db2777)",
                                        }}
                                    >
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div className="overflow-x-auto pb-2 mb-6">
                        <div className="flex items-center space-x-2 md:space-x-4 min-w-max">
                            <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow-sm border border-slate-200">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-3 md:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeCategory === category
                                            ? "bg-indigo-500 text-white shadow-md"
                                            : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 hover:shadow-md hover:bg-slate-50 transition-all whitespace-nowrap">
                                <Filter size={18} />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filteredClothes.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100"
                            >
                                <div className="relative overflow-hidden">
                                    <Link to={`/product/${item.id}`}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://placehold.co/300x400?text=${encodeURIComponent(item.name)}`
                                            }}
                                        />
                                    </Link>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                        {item.isNew && (
                                            <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">New</span>
                                        )}
                                        {item.isTrending && (
                                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Trending
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                                            <Heart size={16} className="hover:text-red-500" />
                                        </button>
                                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors">
                                            <Eye size={16} className="hover:text-blue-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center space-x-1 mb-2">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-sm text-slate-600">{item.rating}</span>
                                        <span className="text-sm text-slate-400">({item.reviews})</span>
                                    </div>

                                    <h3 className="font-semibold text-lg text-slate-800 mb-2">{item.name}</h3>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-indigo-600 font-bold text-lg">{item.price}</span>
                                        <span className="text-slate-400 line-through text-sm">{item.originalPrice}</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-xl hover:bg-indigo-600 transition-colors font-medium">
                                            Try On
                                        </button>
                                        <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Empty State */}
                    {filteredClothes.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Dashboard
