import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle, ShoppingBag, Truck, MapPin,
    CreditCard, ArrowLeft, Home, Package,
    Gift, Heart, ShoppingCart, Calendar,
    Box, User, CreditCard as CardIcon
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useOrderStore } from "../store/orderStore";
import { useCartStore } from "../store/cartStore";


const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userOrder, clearUserOrder } = useOrderStore();
    const { clearCart } = useCartStore()

    useEffect(() => {

        const fetchOrder = async () => {
            try {
                setLoading(true);


                // Using mock data for now
                console.log("Orders : ", userOrder);

                const data = userOrder
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 w-full transition-all duration-300 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-t-2 border-indigo-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading your order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 w-full transition-all duration-300 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <Box size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Order not found</h2>
                        <p className="text-slate-600 mb-6">We couldn't find the order you're looking for.</p>
                        <button
                            onClick={() => {
                                clearUserOrder();
                                clearCart();
                                navigate('/orders');
                            }}
                            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Format dates
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const deliveryDate = new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });


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
                                    onClick={() => {
                                        clearUserOrder();
                                        clearCart();
                                        navigate(-1)
                                    }}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back</span>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Order Confirmation</h1>
                                    <p className="text-slate-600">Your order has been placed successfully</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle size={18} className="text-emerald-500" />
                                <span>Order #{order._id.slice(-6)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Left Column - Order Summary */}
                            <div className="lg:col-span-2">
                                {/* Success Message */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-sm border border-emerald-100 p-6 mb-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800">Thank you for your order!</h2>
                                            <p className="text-slate-600">
                                                Your order <span className="font-semibold">#{order._id.slice(-6)}</span> has been placed and will be processed shortly.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Order Items */}
                                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h2>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.productId} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-24 object-cover rounded-lg border border-slate-200"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-slate-800 truncate">{item.name}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-sm text-slate-600">Size: {item.size}</span>
                                                        <span className="text-sm text-slate-600">Color: {item.color}</span>
                                                        <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium text-slate-800">₹{userOrder.totalAmount}</div>
                                                    {/* <div className="text-sm text-slate-600">₹{item.price} each</div> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-200">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-slate-600">
                                                <span>Subtotal</span>
                                                <span>₹{userOrder.subTotal}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Shipping</span>
                                                <span>{userOrder.shippingCharge === 0 ? 'FREE' : `₹${userOrder.shippingCharge}`}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Tax (5%)</span>
                                                <span>₹{(userOrder.taxCharge).toFixed(2)}</span>
                                            </div>
                                            {userOrder.codConvenienceFee == 0 ? null :

                                                <div className="flex justify-between text-slate-600">
                                                    <span>COD Convenience Fee</span>
                                                    <span>₹{userOrder.codConvenienceFee}</span>
                                                </div>
                                            }
                                            <div className="border-t border-slate-200 pt-3">
                                                <div className="flex justify-between text-xl font-bold text-slate-800">
                                                    <span>Total</span>
                                                    <span>₹{userOrder.totalAmount}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>

                                {/* Order Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Shipping Address */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <MapPin size={24} className="text-indigo-500" />
                                            <h2 className="text-xl font-bold text-slate-800">Shipping Address</h2>
                                        </div>
                                        <div className="space-y-2 text-slate-700">
                                            <p>{order.deliveryAddress.street}</p>
                                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                                            <p>{order.deliveryAddress.zip}, {order.deliveryAddress.country}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Package size={24} className="text-indigo-500" />
                                            <h2 className="text-xl font-bold text-slate-800">Order Details</h2>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Order Date:</span>
                                                <span className="font-medium">{orderDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Estimated Delivery:</span>
                                                <span className="font-medium">{deliveryDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Order Status:</span>
                                                <span className="font-medium text-emerald-500">{order.status}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Column - Order Actions */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-slate-200">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Actions</h2>

                                            {/* Payment Status */}
                                            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
                                                <CardIcon size={20} className="text-indigo-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Payment Status</p>
                                                    <p className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                        {order.paymentStatus}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Delivery Estimate */}
                                            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
                                                <Truck size={20} className="text-indigo-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Estimated Delivery</p>
                                                    <p className="text-slate-600">{deliveryDate}</p>
                                                </div>
                                            </div>

                                            {/* Order Support */}
                                            <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                                <p className="mb-2">Need help with your order?</p>
                                                <p className="font-medium">support@fashionecommerce.com</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="p-6 space-y-3">
                                            <button
                                                onClick={() => {
                                                    clearUserOrder();
                                                    clearCart();
                                                    navigate("/")
                                                }}
                                                className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Home size={20} />
                                                Continue Shopping
                                            </button>
                                            <button
                                                onClick={() => {
                                                    clearUserOrder();
                                                    clearCart();
                                                    navigate("/orders")
                                                }}
                                                className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag size={20} />
                                                View Order History
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Order Timeline */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                                    >
                                        <h3 className="font-bold text-slate-800 mb-4">Order Timeline</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Order Placed</p>
                                                    <p className="text-sm text-slate-600">{orderDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Processing</p>
                                                    <p className="text-sm text-slate-600">Preparing your items</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Shipped</p>
                                                    <p className="text-sm text-slate-600">Estimated: {deliveryDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Delivered</p>
                                                    <p className="text-sm text-slate-600">On its way to you</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderConfirmation;