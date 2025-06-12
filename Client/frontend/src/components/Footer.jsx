// Footer.jsx
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-indigo-50 text-indigo-700 py-8 mt-20 border-t border-indigo-200">
            <div className="container mx-auto text-center text-sm font-light">
                <p>© {new Date().getFullYear()} FashionAI. All rights reserved.</p>
            </div>
        </footer>
    );
}
