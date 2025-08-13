// import React, { useState } from 'react';
// import { useAuthStore } from '../store/authStore';
// import {
//     User, Mail, Lock, Key, Shield, Trash2, LogOut,
//     Smartphone, Heart, Shirt, Paintbrush, Check, X
// } from 'lucide-react';
// import Sidebar from '../components/Sidebar';
// import { motion } from "framer-motion";
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// function Settings() {
//     const { user, logout, updateUserProfile } = useAuthStore();
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('profile');

//     // Profile state
//     const [name, setName] = useState(user?.name || '');
//     const [phone, setPhone] = useState(user?.phone || '');
//     const [gender, setGender] = useState(user?.gender || '');
//     const [ageRange, setAgeRange] = useState(user?.ageRange || '');
//     const [bodyType, setBodyType] = useState(user?.bodyType || '');
//     const [selectedStyles, setSelectedStyles] = useState(user?.preferredClothingStyle || []);
//     const [selectedColors, setSelectedColors] = useState(user?.favColor || []);

//     // Security state
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

//     // Account state
//     const [newEmail, setNewEmail] = useState('');
//     const [deleteConfirm, setDeleteConfirm] = useState('');
//     const [showDeleteModal, setShowDeleteModal] = useState(false);

//     // Style preferences (matching onboarding)
//     const clothingStyles = ["Casual", "Formal", "Sporty", "Bohemian", "Vintage", "Streetwear"];
//     const colors = ["Black", "White", "Blue", "Red", "Green", "Purple", "Gray", "Yellow"];
//     const ageRanges = ["Under 18", "18–24", "25–34", "35–44", "45+"];
//     const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
//     const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus-size"];

//     const handleSaveProfile = async () => {
//         try {
//             await updateUserProfile({
//                 name,
//                 phone,
//                 gender,
//                 ageRange,
//                 bodyType,
//                 preferredClothingStyle: selectedStyles,
//                 favColor: selectedColors
//             });
//             toast.success("Profile updated successfully!");
//         } catch (error) {
//             toast.error("Failed to update profile");
//             console.error('Error updating profile:', error);
//         }
//     };

//     const handleChangePassword = async () => {
//         if (newPassword !== confirmPassword) {
//             toast.error("Passwords don't match");
//             return;
//         }

//         try {
//             // API call to change password would go here
//             toast.success("Password changed successfully!");
//             setCurrentPassword('');
//             setNewPassword('');
//             setConfirmPassword('');
//         } catch (error) {
//             toast.error("Failed to change password");
//             console.error('Error changing password:', error);
//         }
//     };

//     const handleChangeEmail = async () => {
//         if (!newEmail) {
//             toast.error("Please enter a new email");
//             return;
//         }

//         try {
//             // API call to change email would go here
//             toast.success("Email change request sent! Check your inbox.");
//             setNewEmail('');
//         } catch (error) {
//             toast.error("Failed to change email");
//             console.error('Error changing email:', error);
//         }
//     };

//     const handleDeleteAccount = async () => {
//         if (deleteConfirm !== "DELETE MY ACCOUNT") {
//             toast.error("Please type the confirmation phrase exactly");
//             return;
//         }

//         try {
//             // API call to delete account would go here
//             toast.success("Account deletion scheduled");
//             setShowDeleteModal(false);
//             logout();
//             navigate('/');
//         } catch (error) {
//             toast.error("Failed to delete account");
//             console.error('Error deleting account:', error);
//         }
//     };

//     const toggleStyle = (style) => {
//         setSelectedStyles(prev =>
//             prev.includes(style)
//                 ? prev.filter(s => s !== style)
//                 : [...prev, style]
//         );
//     };

//     const toggleColor = (color) => {
//         setSelectedColors(prev =>
//             prev.includes(color)
//                 ? prev.filter(c => c !== color)
//                 : [...prev, color]
//         );
//     };

//     return (
//         <div className="flex min-h-screen bg-slate-50">
//             <Sidebar />
//             <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
//                 <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
//                         <p className="text-slate-600">Manage your account preferences and security</p>
//                     </div>
//                 </header>

//                 <main className="p-4 md:p-6">
//                     <div className="max-w-4xl mx-auto">
//                         {/* Tabs Navigation */}
//                         <div className="flex border-b border-slate-200 mb-6">
//                             {[
//                                 { id: 'profile', label: 'Profile Info', icon: <User size={18} /> },
//                                 { id: 'security', label: 'Security', icon: <Shield size={18} /> },
//                                 { id: 'account', label: 'Account', icon: <Key size={18} /> }
//                             ].map(tab => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${activeTab === tab.id
//                                         ? "text-indigo-600"
//                                         : "text-slate-600 hover:text-slate-800"
//                                         }`}
//                                 >
//                                     {tab.icon}
//                                     {tab.label}
//                                     {activeTab === tab.id && (
//                                         <motion.div
//                                             layoutId="activeTabIndicator"
//                                             className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
//                                             initial={false}
//                                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                                         />
//                                     )}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Tab Content */}
//                         <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
//                             {/* Profile Tab */}
//                             {activeTab === 'profile' && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="space-y-8"
//                                 >
//                                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                                         <User size={20} />
//                                         Profile Information
//                                     </h2>

//                                     <div className="space-y-6">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
//                                                 <input
//                                                     type="text"
//                                                     value={name}
//                                                     onChange={(e) => setName(e.target.value)}
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                     placeholder="John Doe"
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
//                                                 <input
//                                                     type="email"
//                                                     value={user?.email || ''}
//                                                     disabled
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
//                                                 />
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
//                                                 <input
//                                                     type="tel"
//                                                     value={phone}
//                                                     onChange={(e) => setPhone(e.target.value)}
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                     placeholder="+91 1234567890"
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
//                                                 <select
//                                                     value={gender}
//                                                     onChange={(e) => setGender(e.target.value)}
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
//                                                 >
//                                                     <option value="">Select Gender</option>
//                                                     {genders.map(gender => (
//                                                         <option key={gender} value={gender}>{gender}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Age Range</label>
//                                                 <select
//                                                     value={ageRange}
//                                                     onChange={(e) => setAgeRange(e.target.value)}
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
//                                                 >
//                                                     <option value="">Select Age Range</option>
//                                                     {ageRanges.map(age => (
//                                                         <option key={age} value={age}>{age}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium text-slate-700 mb-2">Body Type</label>
//                                                 <select
//                                                     value={bodyType}
//                                                     onChange={(e) => setBodyType(e.target.value)}
//                                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
//                                                 >
//                                                     <option value="">Select Body Type</option>
//                                                     {bodyTypes.map(type => (
//                                                         <option key={type} value={type}>{type}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                                                 <Shirt size={16} className="text-indigo-500" />
//                                                 Preferred Clothing Styles
//                                             </h3>
//                                             <div className="flex flex-wrap gap-3">
//                                                 {clothingStyles.map(style => (
//                                                     <button
//                                                         key={style}
//                                                         onClick={() => toggleStyle(style)}
//                                                         className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selectedStyles.includes(style)
//                                                                 ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
//                                                                 : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
//                                                             }`}
//                                                     >
//                                                         {style}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                                                 <Paintbrush size={16} className="text-indigo-500" />
//                                                 Favorite Colors
//                                             </h3>
//                                             <div className="flex flex-wrap gap-3">
//                                                 {colors.map(color => (
//                                                     <button
//                                                         key={color}
//                                                         onClick={() => toggleColor(color)}
//                                                         className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selectedColors.includes(color)
//                                                                 ? "text-white shadow-md"
//                                                                 : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
//                                                             }`}
//                                                         style={{
//                                                             backgroundColor: selectedColors.includes(color)
//                                                                 ? color.toLowerCase()
//                                                                 : '',
//                                                             borderColor: selectedColors.includes(color)
//                                                                 ? color.toLowerCase()
//                                                                 : '#e2e8f0'
//                                                         }}
//                                                     >
//                                                         {color}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <button
//                                             onClick={handleSaveProfile}
//                                             className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
//                                         >
//                                             Save Profile Changes
//                                         </button>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Security Tab */}
//                             {activeTab === 'security' && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="space-y-8"
//                                 >
//                                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                                         <Shield size={20} />
//                                         Security Settings
//                                     </h2>

//                                     <div className="space-y-6">
//                                         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                                 <Lock size={18} />
//                                                 Change Password
//                                             </h3>

//                                             <div className="space-y-4">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
//                                                     <input
//                                                         type="password"
//                                                         value={currentPassword}
//                                                         onChange={(e) => setCurrentPassword(e.target.value)}
//                                                         className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                         placeholder="Enter your current password"
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
//                                                     <input
//                                                         type="password"
//                                                         value={newPassword}
//                                                         onChange={(e) => setNewPassword(e.target.value)}
//                                                         className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                         placeholder="Enter your new password"
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
//                                                     <input
//                                                         type="password"
//                                                         value={confirmPassword}
//                                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                                         className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                         placeholder="Confirm your new password"
//                                                     />
//                                                 </div>

//                                                 <div className="pt-2">
//                                                     <button
//                                                         onClick={handleChangePassword}
//                                                         disabled={!currentPassword || !newPassword || !confirmPassword}
//                                                         className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
//                                                     >
//                                                         Change Password
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                                 <Key size={18} />
//                                                 Two-Factor Authentication
//                                             </h3>

//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-slate-700 font-medium">Email-based 2FA</p>
//                                                     <p className="text-slate-600 text-sm mt-1">
//                                                         Add an extra layer of security to your account
//                                                     </p>
//                                                 </div>

//                                                 <div className="flex items-center">
//                                                     <span className="mr-3 text-slate-700">
//                                                         {twoFactorEnabled ? "Enabled" : "Disabled"}
//                                                     </span>
//                                                     <button
//                                                         onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
//                                                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? "bg-indigo-500" : "bg-slate-300"
//                                                             }`}
//                                                     >
//                                                         <span
//                                                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"
//                                                                 }`}
//                                                         />
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             {twoFactorEnabled && (
//                                                 <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//                                                     <p className="text-indigo-800 text-sm">
//                                                         When enabled, you'll receive a verification code via email each time you log in.
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Account Tab */}
//                             {activeTab === 'account' && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="space-y-8"
//                                 >
//                                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                                         <Key size={20} />
//                                         Account Settings
//                                     </h2>

//                                     <div className="space-y-6">
//                                         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                                 <Mail size={18} />
//                                                 Change Email Address
//                                             </h3>

//                                             <div className="space-y-4">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-slate-700 mb-2">New Email Address</label>
//                                                     <input
//                                                         type="email"
//                                                         value={newEmail}
//                                                         onChange={(e) => setNewEmail(e.target.value)}
//                                                         className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                                                         placeholder="Enter your new email address"
//                                                     />
//                                                 </div>

//                                                 <div className="pt-2">
//                                                     <button
//                                                         onClick={handleChangeEmail}
//                                                         disabled={!newEmail}
//                                                         className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
//                                                     >
//                                                         Change Email Address
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                                 <LogOut size={18} />
//                                                 Log Out
//                                             </h3>

//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-slate-700 font-medium">Sign out of your account</p>
//                                                     <p className="text-slate-600 text-sm mt-1">
//                                                         You'll need to log in again to access your account
//                                                     </p>
//                                                 </div>

//                                                 <button
//                                                     onClick={() => {
//                                                         logout();
//                                                         navigate('/login');
//                                                     }}
//                                                     className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
//                                                 >
//                                                     Log Out
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div className="bg-slate-50 rounded-xl p-5 border border-red-200 bg-red-50">
//                                             <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
//                                                 <Trash2 size={18} />
//                                                 Delete Account
//                                             </h3>

//                                             <div className="space-y-4">
//                                                 <p className="text-red-700">
//                                                     This action is permanent and cannot be undone. All your data will be permanently deleted.
//                                                 </p>

//                                                 <button
//                                                     onClick={() => setShowDeleteModal(true)}
//                                                     className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
//                                                 >
//                                                     Delete My Account
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             {/* Delete Account Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//                     >
//                         <div className="p-6 border-b border-slate-200">
//                             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                                 <Trash2 size={20} />
//                                 Confirm Account Deletion
//                             </h2>
//                             <p className="text-slate-600 mt-1">
//                                 This action cannot be undone. All your data will be permanently removed.
//                             </p>
//                         </div>

//                         <div className="p-6">
//                             <div className="space-y-4">
//                                 <p className="text-slate-700">
//                                     To confirm, please type <span className="font-bold">"DELETE MY ACCOUNT"</span> below:
//                                 </p>

//                                 <input
//                                     type="text"
//                                     value={deleteConfirm}
//                                     onChange={(e) => setDeleteConfirm(e.target.value)}
//                                     className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
//                                     placeholder="DELETE MY ACCOUNT"
//                                 />

//                                 <p className="text-sm text-slate-600">
//                                     Note: This action will permanently delete all your data, including:
//                                     <ul className="list-disc pl-5 mt-2">
//                                         <li>Personal profile information</li>
//                                         <li>Order history</li>
//                                         <li>Saved preferences</li>
//                                         <li>Wishlist items</li>
//                                     </ul>
//                                 </p>
//                             </div>

//                             <div className="mt-6 flex gap-3">
//                                 <button
//                                     onClick={() => setShowDeleteModal(false)}
//                                     className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDeleteAccount}
//                                     disabled={deleteConfirm !== "DELETE MY ACCOUNT"}
//                                     className={`flex-1 py-3 rounded-lg text-white font-medium transition ${deleteConfirm !== "DELETE MY ACCOUNT"
//                                             ? "bg-red-300 cursor-not-allowed"
//                                             : "bg-red-500 hover:bg-red-600"
//                                         }`}
//                                 >
//                                     Delete Account
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Settings;

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
    User, Mail, Lock, Key, Shield, Trash2, LogOut
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProfileComponent from '../components/ProfileComponent';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Settings() {
    const { logout, changePassword, user, toggle2FA, changeEmailPasswordvalidation, error } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [changeMailPassword, setChangeMailPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.is2FA);

    // Account state
    const [newEmail, setNewEmail] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            const data = { currentPassword, newPassword };
            const { successInProcess, message } = await changePassword(data);

            if (successInProcess) {
                toast.success(message || "Password changed successfully!");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(message || "Failed to change password");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error('Error changing password:', error);
        }
    };

    const handleChangeEmail = async () => {
        if (!newEmail) {
            toast.error("Please enter a new email");
            return;
        }

        const { isSuccess, message } = await changeEmailPasswordvalidation({ newEmail: newEmail, password: changeMailPassword });

        if (isSuccess == true) {
            toast.success(message);
            navigate('/change-email-verification', { state: { newEmail } })
        }
        else {
            toast.error(message);
            setChangeMailPassword('');
            setNewEmail('');
        }

    };

    const handleToggle2FA = async () => {
        const { isSuccess, message, twoFAStatus } = await toggle2FA();

        if (isSuccess == true) {
            toast.success(message);
            setTwoFactorEnabled(twoFAStatus);
        }
        else {
            toast.error(message)
        }

    }

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "DELETE MY ACCOUNT") {
            toast.error("Please type the confirmation phrase exactly");
            return;
        }

        try {
            // API call to delete account would go here
            toast.success("Account deletion scheduled");
            setShowDeleteModal(false);
            logout();
            navigate('/');
        } catch (error) {
            toast.error("Failed to delete account");
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                        <p className="text-slate-600">Manage your account preferences and security</p>
                    </div>
                </header>

                <main className="p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-200 mb-6">
                            {[
                                { id: 'profile', label: 'Profile Info', icon: <User size={18} /> },
                                { id: 'security', label: 'Security', icon: <Shield size={18} /> },
                                { id: 'account', label: 'Account', icon: <Key size={18} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${activeTab === tab.id
                                        ? "text-indigo-600"
                                        : "text-slate-600 hover:text-slate-800"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
                            {/* Profile Tab - Using ProfileComponent */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProfileComponent />
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Shield size={20} />
                                        Security Settings
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                                <Lock size={18} />
                                                Change Password
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Enter your current password"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Enter your new password"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Confirm your new password"
                                                    />
                                                </div>

                                                <div className="pt-2">
                                                    <button
                                                        onClick={handleChangePassword}
                                                        disabled={!currentPassword || !newPassword || !confirmPassword}
                                                        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                                <Key size={18} />
                                                Two-Factor Authentication
                                            </h3>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-700 font-medium">Email-based 2FA</p>
                                                    <p className="text-slate-600 text-sm mt-1">
                                                        Add an extra layer of security to your account
                                                    </p>
                                                </div>

                                                <div className="flex items-center">
                                                    <span className="mr-3 text-slate-700">
                                                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                                                    </span>
                                                    <button
                                                        onClick={handleToggle2FA}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? "bg-indigo-500" : "bg-slate-300"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            {twoFactorEnabled && (
                                                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                                    <p className="text-indigo-800 text-sm">
                                                        When enabled, you'll receive a verification code via email each time you log in.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Key size={20} />
                                        Account Settings
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                                <Mail size={18} />
                                                Change Email Address
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">New Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Enter your new email address"
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                                    <input
                                                        type="password"
                                                        value={changeMailPassword}
                                                        onChange={(e) => setChangeMailPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Enter your current password"
                                                    />
                                                </div>

                                                <div className="pt-4">
                                                    <button
                                                        onClick={handleChangeEmail}
                                                        disabled={!newEmail || !changeMailPassword}
                                                        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                                    >
                                                        Change Email Address
                                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                                <LogOut size={18} />
                                                Log Out
                                            </h3>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-700 font-medium">Sign out of your account</p>
                                                    <p className="text-slate-600 text-sm mt-1">
                                                        You'll need to log in again to access your account
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        navigate('/login');
                                                    }}
                                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                                >
                                                    Log Out
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-5 border border-red-200 bg-red-50">
                                            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                                                <Trash2 size={18} />
                                                Delete Account
                                            </h3>

                                            <div className="space-y-4">
                                                <p className="text-red-700">
                                                    This action is permanent and cannot be undone. All your data will be permanently deleted.
                                                </p>

                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                                >
                                                    Delete My Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Trash2 size={20} />
                                Confirm Account Deletion
                            </h2>
                            <p className="text-slate-600 mt-1">
                                This action cannot be undone. All your data will be permanently removed.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-slate-700">
                                    To confirm, please type <span className="font-bold">"DELETE MY ACCOUNT"</span> below:
                                </p>

                                <input
                                    type="text"
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="DELETE MY ACCOUNT"
                                />

                                <p className="text-sm text-slate-600">
                                    Note: This action will permanently delete all your data, including:
                                    <ul className="list-disc pl-5 mt-2">
                                        <li>Personal profile information</li>
                                        <li>Order history</li>
                                        <li>Saved preferences</li>
                                        <li>Wishlist items</li>
                                    </ul>
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirm !== "DELETE MY ACCOUNT"}
                                    className={`flex-1 py-3 rounded-lg text-white font-medium transition ${deleteConfirm !== "DELETE MY ACCOUNT"
                                        ? "bg-red-300 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600"
                                        }`}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Settings;