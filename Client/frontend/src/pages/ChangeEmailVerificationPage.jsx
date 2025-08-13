import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

function ChangeEmailVerificationPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { newEmail } = location.state || '';

    const { error, isLoading, user, verifyNewEmail } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];

        if (value.length > 1) {
            // Handle pasted content
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            // Focus on last non-empty input
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            // Move focus to next input if value entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        await verifyNewEmail(verificationCode, newEmail);
        toast.success('Email Changed Successfully')
        navigate('/settings')
        // try {
        //     if (!user.is2FA) {
        //         await verifyEmail(verificationCode);
        //         toast.success("Email Verified Successfully");
        //         navigate("/onboard");
        //     }
        //     else {
        //         await verify2FAEmail(verificationCode);
        //         toast.success("Email Verified Successfully ")
        //         setTimeout(() => { }, 2000)
        //         navigate('/')
        //     }

        // } catch (error) {
        //     // error handled via store error state
        //     console.error(error);
        // }
    };

    // Auto submit when all 6 digits are entered
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-blue-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full"
            >
                <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
                    Verify Your Email
                </h2>
                <p className="text-gray-600 mb-8 text-center">
                    Enter the 6-digit code sent to your email address {newEmail}.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value.replace(/\D/, ""))}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-3xl font-bold rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none shadow-sm"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-green-500 text-white font-bold rounded-full shadow-lg hover:from-indigo-700 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default ChangeEmailVerificationPage;
