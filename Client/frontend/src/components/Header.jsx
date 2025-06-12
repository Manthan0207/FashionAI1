import React from "react";
import { Link } from "react-router-dom"; // or next/link if using Next.js

export default function Header({ isAuthenticated, onLogout }) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-indigo-600">
                    FashionAI
                </Link>

                {/* Navigation */}
                <nav>
                    <ul className="flex space-x-6 items-center">


                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/wardrobe" className="hover:text-indigo-500">
                                        Wardrobe
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/recommendations" className="hover:text-indigo-500">
                                        Recommendations
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={onLogout}
                                        className="text-red-500 hover:text-red-700 font-semibold"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="hover:text-indigo-500">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
