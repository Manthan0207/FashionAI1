import React from 'react'
import { useAuthStore } from '../store/authStore'
import {
    Calendar, Calendar1, Heading2, Mail,
    Paintbrush, Shirt, Smile, User, Store
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { user } = useAuthStore()
    const navigate = useNavigate();

    const handleBecomeSeller = () => {
        navigate("/become-seller"); // Route to seller onboarding
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-600">Manage your personal information</p>
                </header>

                <main className="p-4 md:p-6">
                    {!user ? (
                        <p>Loading...</p>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-8"
                        >
                            {/* Profile Picture */}
                            {user.userImage && (
                                <div className="text-center">
                                    <img
                                        src={user.userImage}
                                        alt="User"
                                        className="h-24 w-24 rounded-full object-cover border-4 border-emerald-500 mx-auto mb-2"
                                    />
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ProfileItem icon={<User />} label="Name" value={user.name} />
                                <ProfileItem icon={<Mail />} label="Email" value={user.email} />
                                <ProfileItem icon={<Calendar />} label="Last Login" value={new Date(user.lastLogin).toLocaleString()} />
                                <ProfileItem icon={<Smile />} label="Gender" value={user.gender || "—"} />
                                <ProfileItem icon={<Calendar1 />} label="Age Range" value={user.ageRange || "—"} />
                                <ProfileItem icon={<Shirt />} label="Body Type" value={user.bodyType || "—"} />
                                <ProfileItem icon={<Shirt />} label="Preferred Style" value={(user.preferredClothingStyle || []).join(", ") || "—"} />
                                <ProfileItem icon={<Paintbrush />} label="Favorite Colors" value={(user.favColor || []).join(", ") || "—"} />
                            </div>

                            {/* Become a Seller CTA */}
                            {!user.isSeller && (
                                <div className="mt-6 p-4 border border-dashed border-emerald-400 rounded-xl bg-emerald-50 text-center">
                                    <h3 className="text-lg font-semibold text-emerald-700 mb-2">Interested in selling your clothes?</h3>
                                    <p className="text-sm text-emerald-600 mb-4">Become a seller and start uploading your collection.</p>
                                    <button
                                        onClick={handleBecomeSeller}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        Become a Seller
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}

const ProfileItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-indigo-500">{icon}</div>
        <div>
            <div className="text-slate-500 text-sm font-medium">{label}</div>
            <div className="text-slate-800 font-semibold">{value || "—"}</div>
        </div>
    </div>
)

export default Profile
