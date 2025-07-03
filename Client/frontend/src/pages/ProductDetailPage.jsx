// import React, { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuthStore } from '../store/authStore';
// import Sidebar from '../components/Sidebar';
// import {
//     Heart,
//     Share2,
//     Star,
//     ShoppingCart,
//     ArrowLeft,
//     Truck,
//     Shield,
//     RotateCcw,
//     Ruler,
//     ChevronLeft,
//     ChevronRight,
//     Zap,
//     CheckCircle,
//     Info,
//     Users,
//     Sparkles
// } from 'lucide-react';

// function ProductDetailPage() {
//     const { id } = useParams();



//     const { user } = useAuthStore();

//     const [loading, setLoading] = useState(false);
//     const [tryOnResult, setTryOnResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [selectedSize, setSelectedSize] = useState('M');
//     const [selectedColor, setSelectedColor] = useState('default');
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('description');
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [isWishlisted, setIsWishlisted] = useState(false);


//     const { prods } = useAuthStore();
//     const product = prods.find(item => item._id == id);

//     if (!product) {
//         return (
//             <div className="flex min-h-screen bg-slate-50">
//                 <Sidebar />
//                 <div className="flex-1 lg:ml-20 flex items-center justify-center">
//                     <div className="text-center">
//                         <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
//                         <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700">
//                             Return to Dashboard
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const handleVirtualTryOn = async () => {
//         setLoading(true);
//         setError(null);
//         setTryOnResult(null);

//         try {
//             const formData = new FormData();

//             const userImage = await fetch(user.userImage);
//             const userBlob = await userImage.blob();
//             formData.append("vton_img", new File([userBlob], "user.jpg", { type: "image/jpeg" }));

//             const productImgRes = await fetch(product.images[currentImageIndex]);
//             const productBlob = await productImgRes.blob();
//             formData.append("garm_img", new File([productBlob], "product.jpg", { type: "image/jpeg" }));

//             const res = await fetch("http://localhost:8000/api/virtual-tryon", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await res.json();

//             if (!res.ok) throw new Error(data.detail || "Something went wrong");

//             setTryOnResult(data.result[0]?.image);
//         } catch (err) {
//             console.error(err);
//             setError(err.message || "Try-On failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const nextImage = () => {
//         setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
//     };

//     const prevImage = () => {
//         setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
//     };

//     const discountPercentage = Math.round(((parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))) / parseFloat(product.originalPrice.slice(1))) * 100);

//     return (
//         <div className="flex min-h-screen bg-slate-50">
//             <Sidebar />

//             <div className="flex-1 lg:ml-20 transition-all duration-300">
//                 {/* Header */}
//                 <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
//                     <div className="px-4 md:px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-4">
//                                 <Link
//                                     to="/dashboard"
//                                     className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
//                                 >
//                                     <ArrowLeft size={20} className="text-slate-600" />
//                                 </Link>
//                                 <div>
//                                     <h1 className="text-xl md:text-2xl font-bold text-slate-800">{product.name}</h1>
//                                     <p className="text-slate-600 text-sm">Product Details</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-center space-x-2">
//                                 <button
//                                     onClick={() => setIsWishlisted(!isWishlisted)}
//                                     className={`p-2 rounded-xl transition-all ${isWishlisted
//                                         ? 'bg-red-50 text-red-600'
//                                         : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
//                                         }`}
//                                 >
//                                     <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
//                                 </button>
//                                 <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
//                                     <Share2 size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <div className="p-4 md:p-6">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//                             {/* Image Gallery */}
//                             <div className="space-y-4">
//                                 <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
//                                     <motion.img
//                                         key={currentImageIndex}
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         transition={{ duration: 0.3 }}
//                                         src={product.images[currentImageIndex]}
//                                         alt={product.name}
//                                         className="w-full h-96 md:h-[600px] object-cover"
//                                         onError={(e) => {
//                                             e.currentTarget.src = `https://placehold.co/600x800?text=${encodeURIComponent(product.name)}`;
//                                         }}
//                                     />

//                                     {/* Image Navigation */}
//                                     {product.images.length > 1 && (
//                                         <>
//                                             <button
//                                                 onClick={prevImage}
//                                                 className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
//                                             >
//                                                 <ChevronLeft size={20} />
//                                             </button>
//                                             <button
//                                                 onClick={nextImage}
//                                                 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
//                                             >
//                                                 <ChevronRight size={20} />
//                                             </button>
//                                         </>
//                                     )}

//                                     {/* Badges */}
//                                     <div className="absolute top-4 left-4 flex flex-col space-y-2">
//                                         {product.isNew && (
//                                             <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                                 New
//                                             </span>
//                                         )}
//                                         {product.isTrending && (
//                                             <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                                 Trending
//                                             </span>
//                                         )}
//                                         {discountPercentage > 0 && (
//                                             <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                                 -{discountPercentage}%
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Thumbnail Images */}
//                                 {product.images.length > 1 && (
//                                     <div className="flex space-x-3 overflow-x-auto pb-2">
//                                         {product.images.map((img, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => setCurrentImageIndex(index)}
//                                                 className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === index
//                                                     ? 'border-indigo-500 ring-2 ring-indigo-200'
//                                                     : 'border-slate-200 hover:border-slate-300'
//                                                     }`}
//                                             >
//                                                 <img
//                                                     src={img}
//                                                     alt={`${product.name} ${index + 1}`}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             </button>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Product Information */}
//                             <div className="space-y-6">
//                                 {/* Title and Rating */}
//                                 <div>
//                                     <div className="flex items-center space-x-2 mb-2">
//                                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-sm font-medium">
//                                             {product.category}
//                                         </span>
//                                         {product.inStock ? (
//                                             <span className="flex items-center space-x-1 text-green-600 text-sm">
//                                                 <CheckCircle size={16} />
//                                                 <span>In Stock ({product.stockCount} left)</span>
//                                             </span>
//                                         ) : (
//                                             <span className="text-red-600 text-sm">Out of Stock</span>
//                                         )}
//                                     </div>

//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="flex items-center space-x-2">
//                                             <div className="flex items-center space-x-1">
//                                                 {[...Array(5)].map((_, i) => (
//                                                     <Star
//                                                         key={i}
//                                                         size={16}
//                                                         className={`${i < Math.floor(product.rating)
//                                                             ? 'text-yellow-400 fill-current'
//                                                             : 'text-slate-300'
//                                                             }`}
//                                                     />
//                                                 ))}
//                                             </div>
//                                             <span className="text-sm text-slate-600">
//                                                 {product.rating} ({product.reviews} reviews)
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center space-x-1 text-slate-500">
//                                             <Users size={16} />
//                                             <span className="text-sm">{product.reviews + 45} people viewed</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Price */}
//                                 <div className="flex items-center space-x-3">
//                                     <span className="text-3xl font-bold text-indigo-600">{product.price}</span>
//                                     <span className="text-xl text-slate-400 line-through">{product.originalPrice}</span>
//                                     <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-sm font-medium">
//                                         Save {discountPercentage}%
//                                     </span>
//                                 </div>

//                                 {/* Color Selection */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-3">
//                                         Color: {product.colors.find(c => c.value === selectedColor)?.name}
//                                     </label>
//                                     <div className="flex space-x-3">
//                                         {product.colors.map((color) => (
//                                             <button
//                                                 key={color.value}
//                                                 onClick={() => setSelectedColor(color.value)}
//                                                 className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.value
//                                                     ? 'border-indigo-500 ring-2 ring-indigo-200'
//                                                     : 'border-slate-300 hover:border-slate-400'
//                                                     }`}
//                                                 style={{ backgroundColor: color.hex }}
//                                                 title={color.name}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Size Selection */}
//                                 <div>
//                                     <div className="flex items-center justify-between mb-3">
//                                         <label className="text-sm font-medium text-slate-700">
//                                             Size: {selectedSize}
//                                         </label>
//                                         <button className="flex items-center space-x-1 text-indigo-600 text-sm hover:text-indigo-700">
//                                             <Ruler size={14} />
//                                             <span>Size Guide</span>
//                                         </button>
//                                     </div>
//                                     <div className="grid grid-cols-6 gap-2">
//                                         {product.sizes.map((size) => (
//                                             <button
//                                                 key={size}
//                                                 onClick={() => setSelectedSize(size)}
//                                                 className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all ${selectedSize === size
//                                                     ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
//                                                     : 'border-slate-200 hover:border-slate-300 text-slate-700'
//                                                     }`}
//                                             >
//                                                 {size}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Quantity */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-3">
//                                         Quantity
//                                     </label>
//                                     <div className="flex items-center space-x-4">
//                                         <div className="flex items-center bg-slate-100 rounded-xl">
//                                             <button
//                                                 onClick={() => quantity > 1 && setQuantity(quantity - 1)}
//                                                 className="p-2 hover:bg-slate-200 rounded-l-xl transition-colors"
//                                             >
//                                                 -
//                                             </button>
//                                             <span className="px-4 py-2 font-medium">{quantity}</span>
//                                             <button
//                                                 onClick={() => setQuantity(quantity + 1)}
//                                                 className="p-2 hover:bg-slate-200 rounded-r-xl transition-colors"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="space-y-3">
//                                     <button
//                                         onClick={handleVirtualTryOn}
//                                         disabled={loading}
//                                         className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                                                 <span>Processing...</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Sparkles size={20} />
//                                                 <span>Virtual Try-On</span>
//                                             </>
//                                         )}
//                                     </button>

//                                     <div className="grid grid-cols-2 gap-3">
//                                         <button className="bg-slate-800 text-white py-3 px-6 rounded-xl hover:bg-slate-900 transition-colors font-medium flex items-center justify-center space-x-2">
//                                             <ShoppingCart size={18} />
//                                             <span>Add to Cart</span>
//                                         </button>
//                                         <button className="bg-slate-100 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors font-medium">
//                                             Buy Now
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Error Display */}
//                                 {error && (
//                                     <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                                         <div className="flex items-center space-x-2">
//                                             <Info size={18} className="text-red-600" />
//                                             <p className="text-red-700">{error}</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Features */}
//                                 <div className="bg-slate-50 rounded-xl p-4">
//                                     <div className="grid grid-cols-3 gap-4 text-center">
//                                         <div className="flex flex-col items-center space-y-2">
//                                             <Truck size={24} className="text-indigo-600" />
//                                             <span className="text-sm text-slate-600">Free Shipping</span>
//                                         </div>
//                                         <div className="flex flex-col items-center space-y-2">
//                                             <RotateCcw size={24} className="text-indigo-600" />
//                                             <span className="text-sm text-slate-600">30-Day Returns</span>
//                                         </div>
//                                         <div className="flex flex-col items-center space-y-2">
//                                             <Shield size={24} className="text-indigo-600" />
//                                             <span className="text-sm text-slate-600">2-Year Warranty</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Product Details Tabs */}
//                         <div className="mt-12">
//                             <div className="border-b border-slate-200">
//                                 <nav className="-mb-px flex space-x-8">
//                                     {[
//                                         { id: 'description', label: 'Description' },
//                                         { id: 'features', label: 'Features' },
//                                         { id: 'reviews', label: `Reviews (${product.reviews})` }
//                                     ].map((tab) => (
//                                         <button
//                                             key={tab.id}
//                                             onClick={() => setActiveTab(tab.id)}
//                                             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
//                                                 ? 'border-indigo-500 text-indigo-600'
//                                                 : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
//                                                 }`}
//                                         >
//                                             {tab.label}
//                                         </button>
//                                     ))}
//                                 </nav>
//                             </div>

//                             <div className="py-8">
//                                 <AnimatePresence mode="wait">
//                                     {activeTab === 'description' && (
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -20 }}
//                                             className="prose max-w-none"
//                                         >
//                                             <p className="text-slate-700 leading-relaxed">{product.description}</p>
//                                         </motion.div>
//                                     )}

//                                     {activeTab === 'features' && (
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -20 }}
//                                         >
//                                             <ul className="space-y-3">
//                                                 {product.features.map((feature, index) => (
//                                                     <li key={index} className="flex items-center space-x-3">
//                                                         <CheckCircle size={18} className="text-green-600" />
//                                                         <span className="text-slate-700">{feature}</span>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </motion.div>
//                                     )}

//                                     {activeTab === 'reviews' && (
//                                         <motion.div
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -20 }}
//                                             className="text-center py-8"
//                                         >
//                                             <p className="text-slate-600">Reviews section coming soon...</p>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         </div>

//                         {/* Try-On Result */}
//                         {tryOnResult && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="mt-12 bg-white rounded-2xl p-6 shadow-lg"
//                             >
//                                 <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
//                                     <Zap className="text-indigo-600" />
//                                     <span>Virtual Try-On Result</span>
//                                 </h2>
//                                 <div className="flex justify-center">
//                                     <img
//                                         src={tryOnResult}
//                                         alt="Try-On Result"
//                                         className="max-w-md w-full rounded-xl shadow-md"
//                                     />
//                                 </div>
//                             </motion.div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProductDetailPage;

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';
import {
    Heart, Share2, Star, ShoppingCart, ArrowLeft,
    Truck, Shield, RotateCcw, Ruler, ChevronLeft, ChevronRight,
    Zap, CheckCircle, Info, Users, Sparkles
} from 'lucide-react';

function ProductDetailPage() {
    const { id } = useParams();
    const { user, prods } = useAuthStore();

    const product = prods.find(item => item._id === id);

    const [loading, setLoading] = useState(false);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
                        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleVirtualTryOn = async () => {
        setLoading(true);
        setError(null);
        setTryOnResult(null);
        try {
            const formData = new FormData();
            const userImage = await fetch(user.userImage);
            const userBlob = await userImage.blob();
            formData.append("vton_img", new File([userBlob], "user.jpg", { type: "image/jpeg" }));

            const productImgRes = await fetch(product.images[currentImageIndex]);
            const productBlob = await productImgRes.blob();
            formData.append("garm_img", new File([productBlob], "product.jpg", { type: "image/jpeg" }));

            const res = await fetch("http://localhost:8000/api/virtual-tryon", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Something went wrong");
            setTryOnResult(data.result[0]?.image);
        } catch (err) {
            setError(err.message || "Try-On failed");
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

    const discountPercentage = Math.round(((product.price - product.discountedPrice) / product.price) * 100);

    const averageRating = product.ratings.length > 0 ?
        (product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length).toFixed(1) : 0;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 lg:ml-20 transition-all duration-300">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <div className="px-4 md:px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">{product.name}</h1>
                                <p className="text-sm text-slate-600">Product Details</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`p-2 rounded-xl ${isWishlisted ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}>
                                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                            </button>
                            <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-96 md:h-[600px] object-cover"
                                />
                                {product.images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow">
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail */}
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${currentImageIndex === index ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-sm">{product.gender}</span>
                                <span className="text-green-600 text-sm flex items-center gap-1">
                                    <CheckCircle size={16} /> In Stock ({product.stock})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                ))}
                                <span className="text-sm text-slate-600">{averageRating} ({product.reviews.length} reviews)</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-indigo-600">₹{product.discountedPrice}</span>
                                <span className="text-xl text-slate-400 line-through">₹{product.price}</span>
                                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-sm">Save {discountPercentage}%</span>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Color: {selectedColor}</label>
                                <div className="flex space-x-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'}`}
                                            style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : '#ccc' }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-3">Size: {selectedSize}</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {product.sizesAvailable.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2 px-3 text-sm font-medium rounded-xl border ${selectedSize === size ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200'}`}
                                        >{size}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Quantity</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-slate-100 rounded-xl">
                                        <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-2">-</button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="p-2">+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleVirtualTryOn}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            <span>Virtual Try-On</span>
                                        </>
                                    )}
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-slate-800 text-white py-3 px-6 rounded-xl">Add to Cart</button>
                                    <button className="bg-slate-100 text-slate-700 py-3 px-6 rounded-xl">Buy Now</button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
                                    <div className="flex items-center space-x-2">
                                        <Info size={18} className="text-red-600" />
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="bg-slate-50 rounded-xl p-4 mt-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Truck size={24} className="text-indigo-600" />
                                        <span className="text-sm text-slate-600">Free Shipping</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <RotateCcw size={24} className="text-indigo-600" />
                                        <span className="text-sm text-slate-600">{product.returnPolicyDays}-Day Returns</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <Shield size={24} className="text-indigo-600" />
                                        <span className="text-sm text-slate-600">2-Year Warranty</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Try-On Result */}
                    {tryOnResult && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                                <Zap className="text-indigo-600" />
                                <span>Virtual Try-On Result</span>
                            </h2>
                            <div className="flex justify-center">
                                <img src={tryOnResult} alt="Try-On Result" className="max-w-md w-full rounded-xl shadow-md" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
