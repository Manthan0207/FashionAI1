import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success(
                "Password reset successfully, redirecting to login page..."
            );
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
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
                    Reset Password
                </h2>

                {error && (
                    <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>
                )}
                {message && (
                    <p className="text-green-600 font-semibold mb-4 text-center">{message}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-green-500 text-white font-bold rounded-full shadow-lg hover:from-indigo-700 hover:to-green-600 transition"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Set New Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
