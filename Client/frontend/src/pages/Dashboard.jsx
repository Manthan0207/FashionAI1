import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Sidebar from '../components/Sidebar'
import { Search, Filter, Heart, ShoppingCart, Star, Eye, TrendingUp, Zap, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import toast from "react-hot-toast"


const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [loading, setLoading] = useState(true)

    const { getProducts, prods, toggleWishlist } = useAuthStore()
    const { cart, addToCart } = useCartStore()

    const { user } = useAuthStore()

    const navigate = useNavigate()

    // Get unique categories from products (using gender as category)
    const categories = ["All", ...new Set(prods?.map(product => product.gender) || [])]

    // Filter products based on search and category
    const filteredClothes = prods?.filter(
        (item) =>
            (activeCategory === "All" || item.gender === activeCategory) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

    // Calculate stats from real data
    const stats = {
        totalItems: prods.filter((item) => item.isActive).length,
        newArrivals: prods?.filter(p => {
            const createdDate = new Date(p.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdDate > thirtyDaysAgo;
        })?.length || 0,
        trending: prods?.filter(p => p.isFeatured)?.length || 0,
        favorites: prods?.filter(p => p.totalSales > 10)?.length || 0,
    }

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

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            console.log("Getting");

            await getProducts()
            setLoading(false)
        }

        if (!prods || prods.length === 0) {
            fetchProducts()
        } else {
            setLoading(false)
        }
    }, [getProducts, prods])

    useEffect(() => {
        if (prods && prods.length > 0) {
            console.log("Updated products from store:", prods);
        }
    }, [prods]);

    const handleToggleWishlist = async (id) => {
        try {
            await toggleWishlist(id);
        } catch (err) {
            console.error('Failed to toggle wishlist', err);
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 w-full transition-all duration-300 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-600">Loading products...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                {/* Header */}
                {/* <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Fashion Collection</h1>
                                <p className="text-slate-600">Discover your perfect style ({stats.totalItems} items)</p>
                            </div>

                            {/* Search Bar }
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
                </header> */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Fashion Collection</h1>
                                <p className="text-slate-600">Discover your perfect style ({stats.totalItems} items)</p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {/* Search Bar */}
                                <div className="relative flex-1 md:flex-none md:w-96">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for clothes..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Cart Button */}
                                <button className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                                    onClick={() => navigate('/cart')}>
                                    <ShoppingCart size={22} className="text-slate-700" />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="p-4 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {[
                            { label: "Total Items", value: stats.totalItems.toString(), icon: ShoppingCart, color: "emerald" },
                            { label: "New Arrivals", value: stats.newArrivals.toString(), icon: Zap, color: "blue" },
                            { label: "Featured", value: stats.trending.toString(), icon: TrendingUp, color: "purple" },
                            { label: "Popular", value: stats.favorites.toString(), icon: Heart, color: "pink" },
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
                            (item.isActive) &&
                            (<motion.div
                                key={item._id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100"
                            >
                                <div className="relative overflow-hidden">
                                    <Link to={`/product/${item._id}`}>
                                        <img
                                            src={item.images?.[0] || `https://placehold.co/300x400?text=${encodeURIComponent(item.name)}`}
                                            alt={item.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://placehold.co/300x400?text=${encodeURIComponent(item.name)}`
                                            }}
                                        />
                                    </Link>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                        {/* New Badge - if created within 30 days */}
                                        {(() => {
                                            const createdDate = new Date(item.createdAt);
                                            const thirtyDaysAgo = new Date();
                                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                            return createdDate > thirtyDaysAgo;
                                        })() && (
                                                <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">New</span>
                                            )}
                                        {item.isFeatured && (
                                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Featured
                                            </span>
                                        )}
                                        {item.discountedPrice < item.price && (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                -{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}%
                                            </span>
                                        )}
                                        {item.stock < 10 && item.stock > 0 && (
                                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Low Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleWishlist(item._id)}
                                            className={`p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors ${(user?.wishlist?.includes(item._id)) ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}>


                                            <Heart size={16} className={(user?.wishlist?.includes(item._id)) ? 'fill-current' : ''} />
                                        </button>
                                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors">
                                            <Eye size={16} className="hover:text-blue-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center space-x-1 mb-2">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-sm text-slate-600">
                                            {item.ratings?.length > 0
                                                ? (item.ratings.reduce((sum, rating) => sum + rating.rating, 0) / item.ratings.length).toFixed(1)
                                                : '0'
                                            }
                                        </span>
                                        <span className="text-sm text-slate-400">({item.reviews?.length || 0})</span>
                                    </div>

                                    <h3 className="font-semibold text-lg text-slate-800 mb-1">{item.name}</h3>

                                    {/* Product Details */}
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                            {item.gender}
                                        </span>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                            {item.material}
                                        </span>
                                        {item.fitType && (
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                {item.fitType}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-indigo-600 font-bold text-lg">
                                            ₹{item.discountedPrice}
                                        </span>
                                        {item.discountedPrice < item.price && (
                                            <span className="text-slate-400 line-through text-sm">
                                                ₹{item.price}
                                            </span>
                                        )}
                                    </div>

                                    {/* Available Colors */}
                                    {item.colors && item.colors.length > 0 && (
                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="text-xs text-slate-600">Colors:</span>
                                            <div className="flex space-x-1">
                                                {item.colors.slice(0, 3).map((color, index) => (
                                                    <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                        {color}
                                                    </span>
                                                ))}
                                                {item.colors.length > 3 && (
                                                    <span className="text-xs text-slate-500">+{item.colors.length - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Stock Status */}
                                    <div className="mb-4">
                                        {item.stock > 0 ? (
                                            <span className="text-xs text-green-600 font-medium">
                                                ✓ In Stock ({item.stock} available)
                                            </span>
                                        ) : (
                                            <span className="text-xs text-red-600 font-medium">
                                                ✗ Out of Stock
                                            </span>
                                        )}
                                    </div>


                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors duration-200 font-medium disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
                                            disabled={item.stock === 0}
                                        >
                                            Buy Now
                                        </button>

                                        <button
                                            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            disabled={item.stock === 0}
                                            onClick={() => {
                                                addToCart(item);
                                                toast.success("Item Added To Cart")
                                            }}
                                        >
                                            <ShoppingCart size={18} />
                                            <span className="hidden md:inline">Add to Cart</span>
                                        </button>
                                    </div>


                                </div>
                            </motion.div>)
                        ))}
                    </motion.div>

                    {/* Empty State */}
                    {filteredClothes.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* No Products State */}
                    {!prods || prods.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <ShoppingCart size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No products available</h3>
                            <p className="text-slate-600">Products will appear here once they are loaded</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Dashboard