import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';
import {
    Heart, Share2, Star, ShoppingCart, ArrowLeft,
    Truck, Shield, RotateCcw, Ruler, ChevronLeft, ChevronRight,
    Zap, CheckCircle, Info, Users, Sparkles, ShoppingCartIcon,
    MessageSquare, Calendar, User, ThumbsUp, X
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';

function ProductDetailPage() {
    const { id } = useParams();
    const { user, prods, getSingleProduct, toggleWishlist } = useAuthStore();
    const { cart, addToCart } = useCartStore();
    const [product, setProduct] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            const prod = await getSingleProduct(id);
            console.log("Fetched Product:", prod);
            setProduct(prod);
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);





    const [loading, setLoading] = useState(false);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isWishlisted, setIsWishlisted] = useState((user?.wishlist?.includes(product?._id)));
    useEffect(() => {
        if (user && product) {
            setIsWishlisted(user.wishlist?.includes(product._id));
        }
    }, [user?.wishlist, product?._id]);
    const [showTryOnModal, setShowTryOnModal] = useState(false);

    if (!product) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
                        <Link to="/" className="text-indigo-600 hover:text-indigo-700">
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
            console.log("Image : ", productImgRes);
            console.log("Index : ", currentImageIndex);

            const productBlob = await productImgRes.blob();
            formData.append("garm_img", new File([productBlob], "product.jpg", { type: "image/jpeg" }));

            const res = await fetch("http://localhost:8000/api/virtual-tryon", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Something went wrong");
            setTryOnResult(data.result[0]);
            setShowTryOnModal(true);
            console.log(data.result);
            console.log(data.res);


        } catch (err) {
            setError(err.message || "Try-On failed");
        } finally {
            setLoading(false);

        }
    };
    const handleToggleWishlist = async () => {
        try {
            await toggleWishlist(product._id);
            setIsWishlisted(prev => !prev);
        } catch (err) {
            console.error('Failed to toggle wishlist', err);
        }
    };



    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

    const discountPercentage = Math.round(((product.price - product.discountedPrice) / product.price) * 100);

    const averageRating =
        product.reviews?.reduce((sum, r) => sum + r.rating, 0) /
        (product.reviews?.length || 1) || 0;


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
        ));
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 lg:ml-20 transition-all duration-300">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <div className="px-4  md:px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">{product.name}</h1>
                                <p className="text-sm text-slate-600">Product Details</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleToggleWishlist}
                                className={`p-2 rounded-xl cursor-pointer ${(user?.wishlist?.includes(product._id)) ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}>
                                <Heart size={20} className={(user?.wishlist?.includes(product._id)) ? 'fill-current' : ''} />
                            </button>

                            <button className="p-2 cursor-pointer bg-slate-100 rounded-xl hover:bg-slate-200">
                                <Share2 size={20} />
                            </button>
                            <button className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer bg-slate-100 text-slate-600"
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
                                    className="w-full h-96 md:h-[600px] object-contain"
                                />
                                {product.images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow cursor-pointer">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow cursor-pointer">
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
                                        onClick={() => {

                                            setCurrentImageIndex(index);
                                            setSelectedColor(product.colors[index])
                                            console.log("Selected Color in button of img", selectedColor);
                                        }}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${currentImageIndex === index ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain" />
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
                                <span className="text-sm text-slate-600">{averageRating.toFixed(1)} ({product.reviews.length} reviews)</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-indigo-600">₹{product.discountedPrice}</span>
                                {
                                    ((product.discountedPrice == product.price) ? <span></span> :
                                        <span className="text-xl text-slate-400 line-through">₹{product.price}</span>)
                                }
                                {
                                    (
                                        (product.price > product.discountedPrice) ?
                                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-sm">Save {discountPercentage}%</span> :
                                            <span></span>
                                    )
                                }
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Color: {selectedColor}</label>
                                <div className="flex space-x-3">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setCurrentImageIndex(index);
                                                console.log("selected color in color button", selectedColor);
                                            }}
                                            className={` cursor-pointer w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
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
                                            className={`py-2 px-3 text-sm font-medium rounded-xl border cursor-pointer ${selectedSize === size ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200'}`}
                                        >{size}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Quantity</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-slate-100 rounded-xl">
                                        <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-2 cursor-pointer">-</button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 cursor-pointer">+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleVirtualTryOn}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2 cursor-pointer"
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
                                    {/* <button className="bg-slate-800 text-white py-3 px-6 rounded-xl cursor-pointer"
                                        disabled={product.stock <= 0}
                                        onClick={() => {
                                            addToCart({ ...product, color: selectedColor, image: product.images[currentImageIndex], size: selectedSize });
                                            product.stock--;
                                        }}>Add to Cart</button>
                                    <button className="bg-slate-100 text-slate-700 py-3 px-6 rounded-xl cursor-pointer"
                                        disabled={product.stock == 0}
                                        onClick={() => {
                                            for (let i = 1; i <= quantity; i++) {
                                                addToCart({ ...product, color: selectedColor, image: product.images[currentImageIndex], size: selectedSize });
                                            }
                                            product.stock -= quantity;
                                            navigate('/cart')
                                        }}
                                    >Buy Now</button> */}
                                    <button
                                        className={`py-3 px-6 rounded-xl cursor-pointer ${product.stock <= 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-slate-800 text-white'
                                            }`}
                                        disabled={product.stock <= 0}
                                        onClick={() => {
                                            addToCart({
                                                ...product,
                                                color: selectedColor,
                                                image: product.images[currentImageIndex],
                                                size: selectedSize,
                                            });
                                            product.stock--;
                                        }}
                                    >
                                        Add to Cart
                                    </button>

                                    <button
                                        className={`py-3 px-6 rounded-xl cursor-pointer ${product.stock <= 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-slate-100 text-slate-700'
                                            }`}
                                        disabled={product.stock <= 0}
                                        onClick={() => {
                                            for (let i = 1; i <= quantity; i++) {
                                                addToCart({
                                                    ...product,
                                                    color: selectedColor,
                                                    image: product.images[currentImageIndex],
                                                    size: selectedSize,
                                                });
                                            }
                                            product.stock -= quantity;
                                            navigate('/cart');
                                        }}
                                    >
                                        Buy Now
                                    </button>

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

                    {/* Tabs Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Reviews ({product.reviews.length})
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'description' && (
                                <div className="space-y-4">
                                    <p className="text-slate-700 leading-relaxed">{product.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-800">Material</h4>
                                            <p className="text-sm text-slate-600">{product.material || 'Premium Quality Cotton'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-800">Care Instructions</h4>
                                            <p className="text-sm text-slate-600">Machine wash cold, tumble dry low</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    {/* Review Summary */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-3xl font-bold text-slate-800">{averageRating.toFixed(1)}</span>
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(Math.round(averageRating))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-slate-600">{product.reviews.length} reviews</span>
                                        </div>

                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => {
                                                const count = product.reviews.filter(review => review.rating === rating).length;
                                                const percentage = (count / product.reviews.length) * 100;

                                                return (
                                                    <div key={rating} className="flex items-center space-x-2">
                                                        <span className="text-sm text-slate-600">{rating}</span>

                                                        {/* ⭐️ Star color depends on whether count > 0 */}
                                                        <Star
                                                            size={12}
                                                            className={count > 0 ? "text-yellow-400 fill-current" : "text-slate-300"}
                                                        />

                                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                            <div
                                                                className="bg-yellow-400 h-2 rounded-full"
                                                                style={{ width: `${count > 0 ? percentage : 0}%` }}
                                                            ></div>
                                                        </div>

                                                        <span className="text-sm text-slate-600">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>

                                    {/* Individual Reviews */}
                                    <div className="space-y-4">
                                        {product.reviews.map((review, index) => (
                                            <div key={index} className="border border-slate-200 rounded-xl p-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium text-slate-800">{review.user?.name || 'Anonymous User'}</span>
                                                                <div className="flex items-center space-x-1">
                                                                    {renderStars(review.rating)}
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-slate-500">{formatDate(review.date)}</span>
                                                        </div>
                                                        {review.comment && (
                                                            <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Virtual Try-On Modal */}
                <AnimatePresence>
                    {showTryOnModal && tryOnResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowTryOnModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                                        <Sparkles className="text-indigo-600" size={24} />
                                        <span>Virtual Try-On Result</span>
                                    </h2>
                                    <button
                                        onClick={() => setShowTryOnModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-slate-600" />
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <img
                                        src={tryOnResult}
                                        alt="Virtual Try-On Result"
                                        className="w-full rounded-xl shadow-lg"
                                    />
                                </div>
                                <div className="mt-4 flex space-x-3">
                                    <button
                                        onClick={() => setShowTryOnModal(false)}
                                        className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Add download functionality here
                                            const link = document.createElement('a');
                                            link.href = tryOnResult;
                                            link.download = 'virtual-tryon-result.png';
                                            link.click();
                                        }}
                                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
                                    >
                                        Download
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default ProductDetailPage;