import { useState } from "react";
import { ArrowLeft, CreditCard, Banknote, MapPin, Clock, Check, Loader2, Wallet, Package, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useOrderStore } from "../store/orderStore";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, getCartCount, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const { placeOrder } = useOrderStore()
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("creditCard");

    // Pre-fill form with user data if available
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zip: user?.address?.zip || "",
        country: user?.address?.country || "India"
    });

    // Calculate order totals
    const cartTotal = getCartTotal();
    const shipping = cartTotal > 999 ? 0 : 99;
    const tax = cartTotal * 0.05; // 5% tax
    const finalTotal = cartTotal + shipping + tax + (paymentMethod == "cod" ? 50.00 : 0.0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const items = []
        for (let i of cart) {
            let productId = i._id;
            let quantity = i.quantity;
            let size = i.sizesAvailable[0];
            let color = i.colors[0];
            let image = i.image
            const obj = { productId, quantity, size, color, image }
            items.push(obj)
        }
        const data = {
            items,
            totalAmount: parseInt(finalTotal),
            paymentMethod,
            deliveryAddress: user.address,
            subTotal: cartTotal,
            shippingCharge: shipping,
            taxCharge: tax,
            codConvenienceFee: paymentMethod == "cod" ? 50.00 : 0.0
        }

        try {
            const response = await placeOrder(data)
            toast.success("Order Successful")
            clearCart()
            navigate('/order-success')
        } catch (error) {
            toast.error("Order Failed Please Try Again");


        }

    };

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
                                    onClick={() => navigate('/cart')}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back to Cart</span>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
                                    <p className="text-slate-600">Complete your purchase</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock size={18} />
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Shipping and Payment */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {/* Contact Information */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Shipping Address */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-slate-800">Shipping Address</h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin size={16} />
                                                <span>{formData.zip || "Enter ZIP code"}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                    required
                                                >
                                                    <option value="India">India</option>
                                                    <option value="USA">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="Australia">Australia</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Payment Method */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Method</h2>

                                        {/* Payment Options */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <button
                                                onClick={() => setPaymentMethod("creditCard")}
                                                className={`p-4 border rounded-xl transition-all flex flex-col items-center gap-3 ${paymentMethod === "creditCard" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "creditCard" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}>
                                                    {paymentMethod === "creditCard" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <CreditCard size={24} className="text-slate-700" />
                                                <span className="font-medium">Credit Card</span>
                                            </button>

                                            <button
                                                onClick={() => setPaymentMethod("cod")}
                                                className={`p-4 border rounded-xl transition-all flex flex-col items-center gap-3 ${paymentMethod === "cod" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "cod" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}>
                                                    {paymentMethod === "cod" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <Wallet size={24} className="text-slate-700" />
                                                <span className="font-medium">Cash on Delivery</span>
                                            </button>

                                            <button
                                                onClick={() => setPaymentMethod("paypal")}
                                                className={`p-4 border rounded-xl transition-all flex flex-col items-center gap-3 ${paymentMethod === "paypal" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "paypal" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}>
                                                    {paymentMethod === "paypal" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <Banknote size={24} className="text-slate-700" />
                                                <span className="font-medium">PayPal</span>
                                            </button>
                                        </div>

                                        {/* Credit Card Form */}
                                        {paymentMethod === "creditCard" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="1234 5678 9012 3456"
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiration Date</label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                                        <input
                                                            type="text"
                                                            placeholder="123"
                                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Cash on Delivery Info */}
                                        {paymentMethod === "cod" && (
                                            <div className="bg-slate-50 rounded-xl p-6">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <Wallet size={24} className="text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 text-lg mb-1">Pay when you receive</h3>
                                                        <p className="text-slate-600">No online payment needed. Pay cash to the delivery person.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 border-t border-slate-200 pt-4">
                                                    <div className="flex items-start gap-3">
                                                        <Package size={18} className="text-slate-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-slate-800">How it works</h4>
                                                            <p className="text-sm text-slate-600">
                                                                Your order will be shipped to your address. Please have the exact amount ready
                                                                when the delivery arrives.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Truck size={18} className="text-slate-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-slate-800">Delivery Note</h4>
                                                            <p className="text-sm text-slate-600">
                                                                Cash on Delivery is available for orders under ₹10,000.
                                                                A small convenience fee of ₹50 applies.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PayPal Info */}
                                        {paymentMethod === "paypal" && (
                                            <div className="bg-slate-50 rounded-xl p-6 text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Banknote size={32} className="text-white" />
                                                </div>
                                                <p className="text-slate-700 mb-4">You will be redirected to PayPal to complete your payment</p>
                                                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                                                    Continue to PayPal
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-slate-200">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>

                                            {/* Cart Items Preview */}
                                            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-4">
                                                {cart.map(item => (
                                                    <div key={item._id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                                                        <div className="relative">
                                                            <img
                                                                src={item.images?.[0] || `https://placehold.co/80x80?text=${encodeURIComponent(item.name)}`}
                                                                alt={item.name}
                                                                className="w-16 h-16 object-cover rounded-lg"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = `https://placehold.co/80x80?text=${encodeURIComponent(item.name)}`
                                                                }}
                                                            />
                                                            <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                                {item.quantity || 1}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-slate-800 truncate">{item.name}</h3>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-slate-600">{item.gender}</span>
                                                                <span className="font-medium text-slate-800">₹{item.discountedPrice}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Totals */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Subtotal ({getCartCount()} items)</span>
                                                    <span>₹{cartTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Shipping</span>
                                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                    <span>Tax (5%)</span>
                                                    <span>₹{tax.toFixed(2)}</span>
                                                </div>
                                                {paymentMethod === "cod" && (
                                                    <div className="flex justify-between text-slate-600">
                                                        <span>COD Convenience Fee</span>
                                                        <span>₹50.00</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-slate-200 pt-3">
                                                    <div className="flex justify-between text-lg font-bold text-slate-800">
                                                        <span>Total</span>
                                                        <span>₹{(paymentMethod === "cod" ? finalTotal + 50 : finalTotal).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delivery Info */}
                                            <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock size={14} />
                                                    <span>Estimated delivery: 3-5 business days</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    <span>Free returns within 30 days</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Place Order Button */}
                                        <div className="p-6">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isProcessing || (cart.length ? false : true)}
                                                className="w-full bg-indigo-500 text-white py-3.5 rounded-lg hover:bg-indigo-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-indigo-300 cursor-pointer"

                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={20} />
                                                        <span>Place Order</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Security Info */}
                                            <div className="mt-4 text-center">
                                                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                    <span>Secure SSL Encryption</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Return Policy */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                                    >
                                        <h3 className="font-bold text-slate-800 mb-3">Our Guarantee</h3>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>Free returns within 30 days</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>100% satisfaction guarantee</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>Secure payment processing</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>24/7 customer support</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CheckoutPage;