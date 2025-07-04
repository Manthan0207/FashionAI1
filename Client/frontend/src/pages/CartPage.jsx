import { useCallback, useState } from "react"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, CreditCard, Gift, Tag, MapPin, Clock, Heart, Star } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { motion } from "framer-motion"



const CartPage = () => {
    const navigate = useNavigate()
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCartStore()
    const [promoCode, setPromoCode] = useState("")
    const [appliedPromo, setAppliedPromo] = useState(null)

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
        } else {
            updateQuantity(productId, newQuantity)
        }
    }

    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === "save10") {
            setAppliedPromo({ code: "SAVE10", discount: 10, type: "percentage" })
        } else if (promoCode.toLowerCase() === "flat100") {
            setAppliedPromo({ code: "FLAT100", discount: 100, type: "fixed" })
        } else {
            // Invalid promo code
            setAppliedPromo(null)
        }
    }

    const cartTotal = getCartTotal()
    const shipping = cartTotal > 999 ? 0 : 99
    const discount = appliedPromo ?
        (appliedPromo.type === "percentage" ? (cartTotal * appliedPromo.discount / 100) : appliedPromo.discount)
        : 0
    const finalTotal = cartTotal - discount + shipping

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
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    if (cart.length === 0) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back to Shopping</span>
                                </button>
                                <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
                            </div>
                        </div>
                    </header>

                    <main className="p-6">
                        <div className="max-w-2xl mx-auto text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                                <ShoppingCart size={32} className="text-slate-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
                            <p className="text-slate-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                            >
                                <ShoppingCart size={20} />
                                Start Shopping
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Continue Shopping</span>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
                                    <p className="text-slate-600">{getCartCount()} items in your cart</p>
                                </div>
                            </div>
                            <button
                                onClick={clearCart}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={18} />
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-4"
                                >
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item._id}
                                            variants={itemVariants}
                                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={item.images?.[0] || `https://placehold.co/150x150?text=${encodeURIComponent(item.name)}`}
                                                            alt={item.name}
                                                            className="w-24 h-24 object-cover rounded-xl"
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://placehold.co/150x150?text=${encodeURIComponent(item.name)}`
                                                            }}
                                                        />
                                                        {item.discountedPrice < item.price && (
                                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                -{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-slate-800 truncate">{item.name}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                                        {item.gender}
                                                                    </span>
                                                                    <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                                        {item.material}
                                                                    </span>
                                                                </div>

                                                                {/* Rating */}
                                                                <div className="flex items-center space-x-1 mt-2">
                                                                    <Star size={14} className="text-yellow-400 fill-current" />
                                                                    <span className="text-sm text-slate-600">
                                                                        {item.ratings?.length > 0
                                                                            ? (item.ratings.reduce((sum, rating) => sum + rating.rating, 0) / item.ratings.length).toFixed(1)
                                                                            : '0'
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => removeFromCart(item._id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-indigo-600 font-bold text-lg">
                                                                    ₹{item.discountedPrice}
                                                                </span>
                                                                {item.discountedPrice < item.price && (
                                                                    <span className="text-slate-400 line-through text-sm">
                                                                        ₹{item.price}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                    >
                                                                        <Minus size={16} />
                                                                    </button>
                                                                    <span className="w-8 text-center font-medium">{(item.quantity ? item.quantity : 1)}</span>
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item._id, (item.quantity ? item.quantity + 1 : 1))}
                                                                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                        disabled={item.quantity >= item.stock}
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                </div>
                                                                <span className="text-lg font-bold text-slate-800">
                                                                    ₹{item.discountedPrice * (item.quantity ? item.quantity : 1)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Stock warning */}
                                                        {item.stock < 10 && (
                                                            <div className="mt-2 text-sm text-orange-600">
                                                                Only {item.stock} left in stock
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

                                        {/* Promo Code */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Promo Code
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter promo code"
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                />
                                                <button
                                                    onClick={handleApplyPromo}
                                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {appliedPromo && (
                                                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                                                    <Tag size={16} />
                                                    <span>Promo code "{appliedPromo.code}" applied!</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Details */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-slate-600">
                                                <span>Subtotal ({getCartCount()} items)</span>
                                                <span>₹{cartTotal}</span>
                                            </div>

                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount</span>
                                                    <span>-₹{discount}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between text-slate-600">
                                                <span>Shipping</span>
                                                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                            </div>

                                            {shipping === 0 && (
                                                <div className="text-sm text-green-600 flex items-center gap-1">
                                                    <Gift size={16} />
                                                    <span>Free shipping on orders over ₹999!</span>
                                                </div>
                                            )}

                                            <div className="border-t border-slate-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-slate-800">
                                                    <span>Total</span>
                                                    <span>₹{finalTotal}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={16} className="text-slate-600" />
                                                <span className="text-sm font-medium text-slate-700">Delivery to 380001</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock size={14} />
                                                <span>Expected delivery: 3-5 business days</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            <button className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium flex items-center justify-center gap-2">
                                                <CreditCard size={20} />
                                                Proceed to Checkout
                                            </button>

                                            <button className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2">
                                                <Heart size={20} />
                                                Save for Later
                                            </button>
                                        </div>

                                        {/* Security Badge */}
                                        <div className="mt-6 text-center">
                                            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <span>Secure checkout guaranteed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CartPage