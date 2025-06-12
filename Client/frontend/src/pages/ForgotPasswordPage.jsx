import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, forgotPassword } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-blue-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10"
            >
                <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
                    Forgot Password
                </h2>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <p className="text-gray-600 mb-6 text-center">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-green-500 text-white font-bold rounded-full shadow-lg hover:from-indigo-700 hover:to-green-600 transition"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Send Reset Link"}
                        </motion.button>
                    </form>
                ) : (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Mail className="h-8 w-8 text-white" />
                        </motion.div>
                        <p className="text-gray-700 mb-6">
                            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                    </div>
                )}

                <div className="mt-4 flex justify-center">
                    <Link to="/login" className="text-indigo-600 hover:underline flex items-center font-semibold">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
