import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Hero Section */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-12 bg-gradient-to-r from-pink-100 to-blue-100">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2 space-y-6"
                >
                    <h2 className="text-4xl font-bold text-gray-800 leading-snug">
                        Try on clothes virtually. <br />
                        Get personalized outfit suggestions. <br />
                        Build your wardrobe.
                    </h2>
                    <p className="text-gray-600 text-lg">
                        FashionAI helps you find the best styles that suit you, powered by AI and your personal wardrobe.
                    </p>
                    <div className="space-x-4">
                        <Link to="/signup" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800">
                            Get Started
                        </Link>
                        <Link to="/explore" className="text-black border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white">
                            Explore Products
                        </Link>
                    </div>
                </motion.div>

                <motion.img
                    src="https://images.pexels.com/photos/30714968/pexels-photo-30714968.jpeg"
                    alt="Fashion model"
                    className="w-full md:w-1/2 max-w-md mt-10 md:mt-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    height={200}
                />
            </main>

            {/* Features Section */}
            <section className="bg-white py-12 px-6 md:px-20 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Why FashionAI?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <h4 className="text-xl font-bold text-black mb-2">Virtual Try-On</h4>
                        <p className="text-gray-600">See how clothes look on you before buying using advanced AI tech.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-black mb-2">Personalized Suggestions</h4>
                        <p className="text-gray-600">Get daily outfit ideas based on your uploaded wardrobe and preferences.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-black mb-2">Shop & Sell</h4>
                        <p className="text-gray-600">Buy from other sellers or list your own fashion pieces.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
