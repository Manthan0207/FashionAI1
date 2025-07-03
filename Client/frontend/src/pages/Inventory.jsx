import React, { useState, useEffect } from 'react';
import {
    Package,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Star,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    X,
    DollarSign,
    Tag,
    Palette,
    Ruler,
    Users,
    Calendar,
    BarChart3,
    Settings,
    MoreVertical,
    Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SellerNavbar from '../components/SellerNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';





const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const navigate = useNavigate()



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
            setProducts(prods);
            setLoading(false);
        };
        fetchData();

    }, []);

    // Filter options
    const filterOptions = [
        "All",
        "In Stock",
        "Low Stock",
        "Out of Stock",
        "Featured",
        "Men",
        "Women",
        "Kids"
    ];

    // Filter products based on search and active filter
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        switch (activeFilter) {
            case "In Stock":
                matchesFilter = product.stock > 10;
                break;
            case "Low Stock":
                matchesFilter = product.stock > 0 && product.stock <= 10;
                break;
            case "Out of Stock":
                matchesFilter = product.stock === 0;
                break;
            case "Featured":
                matchesFilter = product.isFeatured;
                break;
            case "Men":
            case "Women":
            case "Kids":
                matchesFilter = product.gender === activeFilter;
                break;
            default:
                matchesFilter = true;
        }

        return matchesSearch && matchesFilter;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "price-high":
                return b.price - a.price;
            case "price-low":
                return a.price - b.price;
            case "stock-high":
                return b.stock - a.stock;
            case "stock-low":
                return a.stock - b.stock;
            case "sales-high":
                return b.totalSales - a.totalSales;
            default:
                return 0;
        }
    });

    // Calculate stats
    const stats = {
        totalProducts: products.length,
        inStock: products.filter(p => p.stock > 10).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        featured: products.filter(p => p.isFeatured).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        totalSales: products.reduce((sum, p) => sum + p.totalSales, 0)
    };

    const StatCard = ({ icon: Icon, title, value, bgColor, textColor, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
            </div>
        </div>
    );

    const ProductCard = ({ product, onEdit, onDelete, onToggleSelect, isSelected }) => {
        const [showActions, setShowActions] = useState(false);

        const getStockStatus = (stock) => {
            if (stock === 0) return { status: "Out of Stock", color: "text-red-600", bgColor: "bg-red-100" };
            if (stock <= 10) return { status: "Low Stock", color: "text-yellow-600", bgColor: "bg-yellow-100" };
            return { status: "In Stock", color: "text-green-600", bgColor: "bg-green-100" };
        };

        const stockInfo = getStockStatus(product.stock);
        const discount = product.discountedPrice > 0 ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;
        const averageRating = product.ratings.length > 0 ? (product.ratings.reduce((sum, rating) => sum + rating, 0) / product.ratings.length).toFixed(1) : "0.0";

        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="relative">
                    <img
                        src={product.images?.[0] || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop`}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop`;
                        }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {product.isFeatured && (
                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {showActions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                                    <button
                                        onClick={() => {
                                            onEdit(product);
                                            setShowActions(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
                                    >
                                        <Edit size={16} />
                                        <span>Edit Product</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log("View details:", product);
                                            setShowActions(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
                                    >
                                        <Eye size={16} />
                                        <span>View Details</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(product);
                                            setShowActions(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2"
                                    >
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selection Checkbox */}
                    <div className="absolute bottom-3 left-3">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(product._id)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-slate-900 truncate flex-1 mr-2">
                            {product.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
                            {stockInfo.status}
                        </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {product.description || "No description available"}
                    </p>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">{product.gender || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Palette className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">{product.colors ? product.colors.length : 0} colors</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Ruler className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">{product.sizesAvailable ? product.sizesAvailable.length : 0} sizes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Package className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-600">{product.stock} in stock</span>
                        </div>
                    </div>

                    {/* Price and Sales */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-indigo-600">
                                ₹{product.discountedPrice > 0 ? product.discountedPrice : product.price}
                            </span>
                            {product.discountedPrice > 0 && (
                                <span className="text-sm text-slate-400 line-through">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Total Sales</p>
                            <p className="text-sm font-semibold text-slate-700">{product.totalSales}</p>
                        </div>
                    </div>

                    {/* Rating and Reviews */}
                    {product.ratings && product.ratings.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-sm text-slate-600">
                                    {averageRating}
                                </span>
                            </div>
                            <span className="text-sm text-slate-400">
                                ({product.reviews ? product.reviews.length : 0} reviews)
                            </span>
                        </div>
                    )}

                    {/* Style Tags */}
                    {product.styleTags && product.styleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {product.styleTags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                                    {tag}
                                </span>
                            ))}
                            {product.styleTags.length > 3 && (
                                <span className="text-xs text-slate-500">+{product.styleTags.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="flex-1 bg-indigo-500 text-white py-2 px-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
                        >
                            Edit
                        </button>
                        <button className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
                            Analytics
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleEdit = (product) => {
        console.log("Edit product:", product);
        navigate(`/product-edit-page/${product._id}`)
    };

    const handleDelete = (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            setProducts(prev => prev.filter(p => p._id !== product._id));
            console.log("Deleted product:", product);
        }
    };

    const handleToggleSelect = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
            setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
            setSelectedProducts([]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <div className="flex-1 min-w-0 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-600">Loading inventory...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 lg:ml-20">
                {/* Navigation Header */}
                <SellerNavbar />

                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
                                <p className="text-slate-600">Manage your products and stock levels</p>
                            </div>

                            {/* Search and Actions */}
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-64 pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Filter size={18} />
                                    <span>Filters</span>
                                </button>

                                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Plus size={18} />
                                    <span>Add Product</span>
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-slate-700">Filter by:</label>
                                        <div className="flex space-x-2">
                                            {filterOptions.map((filter) => (
                                                <button
                                                    key={filter}
                                                    onClick={() => setActiveFilter(filter)}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === filter
                                                        ? "bg-indigo-500 text-white"
                                                        : "bg-white text-slate-600 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-slate-700">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="stock-high">Stock: High to Low</option>
                                            <option value="stock-low">Stock: Low to High</option>
                                            <option value="sales-high">Sales: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Package}
                            title="Total Products"
                            value={stats.totalProducts}
                            bgColor="bg-blue-100"
                            textColor="text-blue-600"
                        />
                        <StatCard
                            icon={CheckCircle}
                            title="In Stock"
                            value={stats.inStock}
                            bgColor="bg-green-100"
                            textColor="text-green-600"
                            subtitle={`${stats.lowStock} low stock`}
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Out of Stock"
                            value={stats.outOfStock}
                            bgColor="bg-red-100"
                            textColor="text-red-600"
                        />
                        <StatCard
                            icon={DollarSign}
                            title="Inventory Value"
                            value={`₹${stats.totalValue.toLocaleString()}`}
                            bgColor="bg-indigo-100"
                            textColor="text-indigo-600"
                            subtitle={`${stats.totalSales} total sales`}
                        />
                    </div>

                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">
                                    {selectedProducts.length} product(s) selected
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 transition-colors">
                                        Bulk Edit
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Delete Selected
                                    </button>
                                    <button
                                        onClick={() => setSelectedProducts([])}
                                        className="p-1 text-slate-500 hover:text-slate-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleSelect={handleToggleSelect}
                                    isSelected={selectedProducts.includes(product._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Package size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-600 mb-4">
                                {searchTerm || activeFilter !== "All"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Start by adding your first product to the inventory"
                                }
                            </p>
                            {!searchTerm && activeFilter === "All" && (
                                <button className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Plus size={20} />
                                    <span>Add Your First Product</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;