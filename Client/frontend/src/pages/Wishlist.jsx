import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from '../components/Sidebar';
import { Search, Heart, ShoppingCart, Star, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

const Wishlist = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const { toggleWishlist } = useAuthStore();
    const { cart, addToCart } = useCartStore();
    const { user, prods } = useAuthStore();
    const navigate = useNavigate();

    // Get wishlisted products
    const wishlistedProducts = prods?.filter(
        product => user?.wishlist?.includes(product._id)) || [];

    // Get unique categories from wishlisted products
    const categories = ["All", ...new Set(wishlistedProducts?.map(product => product.gender) || [])];

    // Filter products based on search and category
    const filteredClothes = wishlistedProducts?.filter(
        (item) =>
            (activeCategory === "All" || item.gender === activeCategory) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

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
    };

    const handleToggleWishlist = async (id) => {
        try {
            await toggleWishlist(id);
        } catch (err) {
            console.error('Failed to toggle wishlist', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">My Wishlist</h1>
                                <p className="text-slate-600">
                                    {wishlistedProducts.length} saved item{wishlistedProducts.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {/* Search Bar */}
                                <div className="relative flex-1 md:flex-none md:w-96">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search your wishlist..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Cart Button */}
                                <button
                                    className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                                    onClick={() => navigate('/cart')}
                                >
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
                        </div>
                    </div>

                    {/* Products Grid */}
                    {wishlistedProducts.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                            {filteredClothes.map((item) => (
                                <motion.div
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
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 flex flex-col space-y-2">
                                            <button
                                                onClick={() => handleToggleWishlist(item._id)}
                                                className={`p-2 rounded-full shadow-md transition-colors ${user?.wishlist?.includes(item._id)
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                                            >
                                                <Heart size={16} className={user?.wishlist?.includes(item._id) ? 'fill-current' : ''} />
                                            </button>
                                            <button
                                                className="p-2 bg-slate-100 rounded-full shadow-md hover:bg-blue-50 transition-colors"
                                                onClick={() => navigate(`/product/${item._id}`)}
                                            >
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

                                        {/* Stock Status */}
                                        <div className="mb-4">
                                            {item.stock > 0 ? (
                                                <span className="text-xs text-green-600 font-medium">
                                                    ✓ In Stock
                                                </span>
                                            ) : (
                                                <span className="text-xs text-red-600 font-medium">
                                                    ✗ Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link to={`/product/${item._id}`}
                                                className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                disabled={item.stock === 0}
                                            >
                                                View Product
                                            </Link>

                                            <button
                                                className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                disabled={item.stock === 0}
                                                onClick={() => {
                                                    addToCart(item);
                                                    toast.success("Item Added To Cart");
                                                }}
                                            >
                                                <ShoppingCart size={18} />
                                                <span className="hidden md:inline">Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        /* Empty Wishlist State */
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                                <Heart size={48} className="text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Your wishlist is empty</h3>
                            <p className="text-slate-600 max-w-md mx-auto mb-8">
                                Save items you love by clicking the heart icon. They'll appear here for easy access later.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                Browse Products
                            </button>
                        </div>
                    )}

                    {/* Search Empty State */}
                    {wishlistedProducts.length > 0 && filteredClothes.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No matching items found</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Wishlist;