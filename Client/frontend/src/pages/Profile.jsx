// import React from 'react'
// import { useAuthStore } from '../store/authStore'
// import {
//     Calendar, Calendar1, Heading2, Mail,
//     Paintbrush, Shirt, Smile, User, Store
// } from 'lucide-react'
// import Sidebar from '../components/Sidebar'
// import { motion } from "framer-motion";
// import { useNavigate } from 'react-router-dom';

// function Profile() {
//     const { user } = useAuthStore()
//     const navigate = useNavigate();

//     const handleBecomeSeller = () => {
//         navigate("/become-seller"); // Route to seller onboarding
//     }

//     return (
//         <div className="flex min-h-screen bg-slate-50">
//             <Sidebar />
//             <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
//                 <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
//                     <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
//                     <p className="text-slate-600">Manage your personal information</p>
//                 </header>

//                 <main className="p-4 md:p-6">
//                     {!user ? (
//                         <p>Loading...</p>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-8"
//                         >
//                             {/* Profile Picture */}
//                             {user.userImage && (
//                                 <div className="text-center">
//                                     <img
//                                         src={user.userImage}
//                                         alt="User"
//                                         className="h-24 w-24 rounded-full object-cover border-4 border-emerald-500 mx-auto mb-2"
//                                     />
//                                 </div>
//                             )}

//                             {/* Details Grid */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                 <ProfileItem icon={<User />} label="Name" value={user.name} />
//                                 <ProfileItem icon={<Mail />} label="Email" value={user.email} />
//                                 <ProfileItem icon={<Calendar />} label="Last Login" value={new Date(user.lastLogin).toLocaleString()} />
//                                 <ProfileItem icon={<Smile />} label="Gender" value={user.gender || "—"} />
//                                 <ProfileItem icon={<Calendar1 />} label="Age Range" value={user.ageRange || "—"} />
//                                 <ProfileItem icon={<Shirt />} label="Body Type" value={user.bodyType || "—"} />
//                                 <ProfileItem icon={<Shirt />} label="Preferred Style" value={(user.preferredClothingStyle || []).join(", ") || "—"} />
//                                 <ProfileItem icon={<Paintbrush />} label="Favorite Colors" value={(user.favColor || []).join(", ") || "—"} />
//                             </div>

//                             {/* Become a Seller CTA */}
//                             {!user.isSeller && (
//                                 <div className="mt-6 p-4 border border-dashed border-emerald-400 rounded-xl bg-emerald-50 text-center">
//                                     <h3 className="text-lg font-semibold text-emerald-700 mb-2">Interested in selling your clothes?</h3>
//                                     <p className="text-sm text-emerald-600 mb-4">Become a seller and start uploading your collection.</p>
//                                     <button
//                                         onClick={handleBecomeSeller}
//                                         className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium"
//                                     >
//                                         Become a Seller
//                                     </button>
//                                 </div>
//                             )}
//                         </motion.div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     )
// }

// const ProfileItem = ({ icon, label, value }) => (
//     <div className="flex items-start gap-3">
//         <div className="mt-1 text-indigo-500">{icon}</div>
//         <div>
//             <div className="text-slate-500 text-sm font-medium">{label}</div>
//             <div className="text-slate-800 font-semibold">{value || "—"}</div>
//         </div>
//     </div>
// )

// export default Profile


// import React, { useState, useRef } from 'react';
// import { useAuthStore } from '../store/authStore';
// import {
//     User, Mail, Calendar, MapPin, Shirt, Smile, Paintbrush,
//     Edit2, Save, X, Camera, Check, AlertTriangle, ShirtIcon,
//     ChevronDown, ChevronUp, Plus, Minus, Store
// } from 'lucide-react';
// import Sidebar from '../components/Sidebar';
// import { motion } from "framer-motion";
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast'

// function Profile() {
//     const { user, updateUserProfile } = useAuthStore();
//     const navigate = useNavigate();
//     const fileInputRef = useRef(null);

//     // State for editable fields
//     const [editMode, setEditMode] = useState(false);
//     const [formData, setFormData] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         gender: user?.gender || '',
//         ageRange: user?.ageRange || '',
//         bodyType: user?.bodyType || '',
//         preferredClothingStyle: user?.preferredClothingStyle || [],
//         favColor: user?.favColor || [],
//         address: {
//             street: user?.address?.street || '',
//             city: user?.address?.city || '',
//             state: user?.address?.state || '',
//             country: user?.address?.country || '',
//             zip: user?.address?.zip || ''
//         }
//     });

//     // Image upload state
//     const [imagePreview, setImagePreview] = useState(user?.userImage || '');
//     const [isUploading, setIsUploading] = useState(false);
//     const [detectionStatus, setDetectionStatus] = useState(null);
//     const [showDetectionPreview, setShowDetectionPreview] = useState(false);
//     const [tempDetectionImage, setTempDetectionImage] = useState('');
//     const [imageChanged, setImageChanged] = useState(false);

//     const [skintone, setSkintone] = useState(user.skintone);

//     // Style preferences
//     const clothingStyles = [
//         "Casual", "Formal", "Sporty", "Bohemian", "Vintage",
//         "Streetwear", "Business", "Minimalist", "Gothic", "Preppy"
//     ];

//     const colors = [
//         "Red", "Blue", "Green", "Yellow", "Black",
//         "White", "Purple", "Pink", "Orange", "Gray"
//     ];

//     const handleBecomeSeller = () => {
//         navigate("/become-seller");
//     };

//     const toggleEditMode = () => {
//         if (editMode) {
//             // Save changes when exiting edit mode
//             handleSaveProfile();
//         }
//         setEditMode(!editMode);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleAddressChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             address: {
//                 ...prev.address,
//                 [name]: value
//             }
//         }));
//     };

//     const handleSaveProfile = async () => {
//         try {
//             if (imagePreview !== user?.userImage) {
//                 setImageChanged(true);
//             }
//             const data = {
//                 ...formData,
//                 imageChanged,
//                 skintone,
//                 image: imagePreview
//             };
//             await updateUserProfile(data);


//             // Update the user in the backend and store
//             toast.success("Profile updated successfully!");
//             navigate('/profile');
//         } catch (error) {
//             toast.error("Failed to update profile");
//             console.error('Error updating profile:', error);
//             navigate('/profile');
//         }
//     };

//     const handleStyleToggle = (style) => {
//         setFormData(prev => {
//             const updatedStyles = prev.preferredClothingStyle.includes(style)
//                 ? prev.preferredClothingStyle.filter(s => s !== style)
//                 : [...prev.preferredClothingStyle, style];
//             return { ...prev, preferredClothingStyle: updatedStyles };
//         });
//     };

//     const handleColorToggle = (color) => {
//         setFormData(prev => {
//             const updatedColors = prev.favColor.includes(color)
//                 ? prev.favColor.filter(c => c !== color)
//                 : [...prev.favColor, color];
//             return { ...prev, favColor: updatedColors };
//         });
//     };

//     const handleImageClick = () => {
//         if (editMode) {
//             fileInputRef.current.click();
//         }
//     };

//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;


//         // Create preview
//         const reader = new FileReader();
//         reader.onload = async (e) => {
//             setTempDetectionImage(e.target.result);
//             setShowDetectionPreview(true);

//             // Simulate face/body detection
//             setIsUploading(true);
//             // setTimeout(() => {
//             //     // 80% chance of successful detection
//             //     const success = Math.random() > 0.2;
//             //     setDetectionStatus(success ? 'success' : 'error');
//             //     setIsUploading(false);

//             //     if (success) {
//             //         setImagePreview(e.target.result);
//             //     }
//             // }, 2000);
//             const formData = new FormData();
//             formData.append("file", file);

//             try {
//                 const response = await fetch("http://localhost:8000/api/detect", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 if (!response.ok) {
//                     throw new Error("Detection API error");
//                 }

//                 const data = await response.json();

//                 if (data.faceDetected && data.bodyDetected && data.skintone) {
//                     setSkintone(data.skintone)
//                     setDetectionStatus('success');
//                     setIsUploading(false);
//                     setImagePreview(file);

//                 } else {
//                     alert("Please upload a clear image with your full face and body visible.");

//                 }
//             } catch (error) {
//                 console.error("Detection error:", error);
//                 alert("Failed to detect face/body. Please try again.");

//             }

//         };
//         reader.readAsDataURL(file);
//     };

//     const confirmImageUpload = () => {
//         setImagePreview(tempDetectionImage);
//         setShowDetectionPreview(false);
//         setDetectionStatus(null);
//     };

//     const handleCancelImage = () => {
//         setShowDetectionPreview(false);
//         setDetectionStatus(null);
//     };

//     return (
//         <div className="flex min-h-screen bg-slate-50">
//             <Sidebar />
//             <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
//                 <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
//                         <p className="text-slate-600">Manage your personal information</p>
//                     </div>
//                     <button
//                         onClick={toggleEditMode}
//                         className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${editMode
//                             ? "bg-emerald-500 hover:bg-emerald-600 text-white"
//                             : "bg-indigo-500 hover:bg-indigo-600 text-white"
//                             }`}
//                     >
//                         {editMode ? <Save size={18} /> : <Edit2 size={18} />}
//                         {editMode ? "Save Changes" : "Edit Profile"}
//                     </button>
//                 </header>

//                 <main className="p-4 md:p-6">
//                     {!user ? (
//                         <div className="flex justify-center items-center h-64">
//                             <p className="text-slate-500">Loading profile...</p>
//                         </div>
//                     ) : (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-8"
//                         >
//                             {/* Profile Header */}
//                             <div className="flex flex-col md:flex-row gap-6 items-center">
//                                 <div className="relative">
//                                     <div
//                                         className={`relative h-32 w-32 rounded-full border-4 overflow-hidden cursor-pointer ${editMode ? "border-indigo-400" : "border-emerald-400"
//                                             }`}
//                                         onClick={handleImageClick}
//                                     >
//                                         <img
//                                             src={imagePreview || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
//                                             alt="User"
//                                             className="w-full h-full object-cover"
//                                         />
//                                         {editMode && (
//                                             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                                                 <Camera size={24} className="text-white" />
//                                             </div>
//                                         )}
//                                     </div>
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         disabled={!editMode}
//                                     />
//                                 </div>

//                                 <div className="flex-1 text-center md:text-left">
//                                     {editMode ? (
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleInputChange}
//                                             className="text-2xl font-bold text-slate-800 bg-slate-50 border-b border-slate-300 px-2 py-1 mb-2 w-full max-w-md"
//                                         />
//                                     ) : (
//                                         <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
//                                     )}
//                                     <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 mb-4">
//                                         <Mail size={16} />
//                                         {editMode ? (
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={formData.email}
//                                                 onChange={handleInputChange}
//                                                 disabled={true}
//                                                 className="bg-slate-50 border-b border-slate-300 px-2 py-1 w-full max-w-md"
//                                             />
//                                         ) : (
//                                             <span>{user.email}</span>
//                                         )}
//                                     </div>
//                                     <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//                                         <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
//                                             Joined: {new Date(user.createdAt).toLocaleDateString()}
//                                         </div>
//                                         {user.isSeller && (
//                                             <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
//                                                 <Store size={14} /> Seller
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Personal Details Section */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <ProfileSection
//                                     title="Personal Details"
//                                     icon={<User size={18} />}
//                                 >
//                                     <ProfileField
//                                         label="Gender"
//                                         icon={<Shirt size={16} />}
//                                         editMode={editMode}
//                                         name="gender"
//                                         value={formData.gender}
//                                         onChange={handleInputChange}
//                                         placeholder="Select your gender"
//                                     />

//                                     <ProfileField
//                                         label="Age Range"
//                                         icon={<Calendar size={16} />}
//                                         editMode={editMode}
//                                         name="ageRange"
//                                         value={formData.ageRange}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., 25-34"
//                                     />

//                                     <ProfileField
//                                         label="Body Type"
//                                         icon={<ShirtIcon size={16} />}
//                                         editMode={editMode}
//                                         name="bodyType"
//                                         value={formData.bodyType}
//                                         onChange={handleInputChange}
//                                         placeholder="e.g., Athletic, Slim"
//                                     />
//                                 </ProfileSection>

//                                 {/* Address Section */}
//                                 <ProfileSection
//                                     title="Address"
//                                     icon={<MapPin size={18} />}
//                                 >
//                                     <div className="space-y-3">
//                                         {editMode ? (
//                                             <>
//                                                 <input
//                                                     type="text"
//                                                     name="street"
//                                                     value={formData.address.street}
//                                                     onChange={handleAddressChange}
//                                                     placeholder="Street Address"
//                                                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                                 />
//                                                 <div className="grid grid-cols-2 gap-3">
//                                                     <input
//                                                         type="text"
//                                                         name="city"
//                                                         value={formData.address.city}
//                                                         onChange={handleAddressChange}
//                                                         placeholder="City"
//                                                         className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                                     />
//                                                     <input
//                                                         type="text"
//                                                         name="state"
//                                                         value={formData.address.state}
//                                                         onChange={handleAddressChange}
//                                                         placeholder="State"
//                                                         className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                                     />
//                                                 </div>
//                                                 <div className="grid grid-cols-2 gap-3">
//                                                     <input
//                                                         type="text"
//                                                         name="country"
//                                                         value={formData.address.country}
//                                                         onChange={handleAddressChange}
//                                                         placeholder="Country"
//                                                         className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                                     />
//                                                     <input
//                                                         type="text"
//                                                         name="zip"
//                                                         value={formData.address.zip}
//                                                         onChange={handleAddressChange}
//                                                         placeholder="ZIP Code"
//                                                         className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                                     />
//                                                 </div>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <div className="text-slate-800 font-medium">
//                                                     {user.address?.street || "No address provided"}
//                                                 </div>
//                                                 <div className="text-slate-600">
//                                                     {user.address?.city && `${user.address.city}, `}
//                                                     {user.address?.state && `${user.address.state}, `}
//                                                     {user.address?.country}
//                                                 </div>
//                                                 <div className="text-slate-600">
//                                                     {user.address?.zip}
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 </ProfileSection>
//                             </div>

//                             {/* Style Preferences */}
//                             <ProfileSection
//                                 title="Style Preferences"
//                                 icon={<Paintbrush size={18} />}
//                             >
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-slate-700 font-medium mb-3 flex items-center gap-2">
//                                             <Shirt size={16} className="text-indigo-500" />
//                                             Preferred Clothing Styles
//                                         </h3>
//                                         <div className="flex flex-wrap gap-2">
//                                             {clothingStyles.map(style => (
//                                                 <button
//                                                     key={style}
//                                                     onClick={() => editMode && handleStyleToggle(style)}
//                                                     className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.preferredClothingStyle.includes(style)
//                                                         ? "bg-indigo-500 text-white"
//                                                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                                                         } ${!editMode && !formData.preferredClothingStyle.includes(style)
//                                                             ? "opacity-50"
//                                                             : ""
//                                                         }`}
//                                                     disabled={!editMode}
//                                                 >
//                                                     {style}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <h3 className="text-slate-700 font-medium mb-3 flex items-center gap-2">
//                                             <Paintbrush size={16} className="text-indigo-500" />
//                                             Favorite Colors
//                                         </h3>
//                                         <div className="flex flex-wrap gap-2">
//                                             {colors.map(color => (
//                                                 <button
//                                                     key={color}
//                                                     onClick={() => editMode && handleColorToggle(color)}
//                                                     className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.favColor.includes(color)
//                                                         ? "text-white"
//                                                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                                                         } ${!editMode && !formData.favColor.includes(color)
//                                                             ? "opacity-50"
//                                                             : ""
//                                                         }`}
//                                                     style={{
//                                                         backgroundColor: formData.favColor.includes(color)
//                                                             ? color.toLowerCase()
//                                                             : ''
//                                                     }}
//                                                     disabled={!editMode}
//                                                 >
//                                                     {color}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </ProfileSection>

//                             {/* Become a Seller Section */}
//                             {!user.isSeller && (
//                                 <div className="mt-6 p-6 border border-dashed border-emerald-400 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 text-center">
//                                     <h3 className="text-xl font-bold text-emerald-800 mb-3">Become a Seller on FashionHub</h3>
//                                     <p className="text-slate-700 mb-5 max-w-2xl mx-auto">
//                                         Join our community of fashion creators! Sell your unique designs, reach thousands of customers,
//                                         and grow your fashion business with our platform.
//                                     </p>
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                                         <FeatureCard
//                                             icon={<Store size={24} />}
//                                             title="Your Own Store"
//                                             description="Create a personalized storefront to showcase your brand"
//                                         />
//                                         <FeatureCard
//                                             icon={<Shirt size={24} />}
//                                             title="Sell Your Designs"
//                                             description="List unlimited products and reach fashion lovers worldwide"
//                                         />
//                                         <FeatureCard
//                                             icon={<Paintbrush size={24} />}
//                                             title="Creative Freedom"
//                                             description="Full control over your brand and product presentation"
//                                         />
//                                     </div>
//                                     <button
//                                         onClick={handleBecomeSeller}
//                                         className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
//                                     >
//                                         Start Selling Now
//                                     </button>
//                                 </div>
//                             )}
//                         </motion.div>
//                     )}
//                 </main>
//             </div>

//             {/* Detection Preview Modal */}
//             {showDetectionPreview && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//                     >
//                         <div className="p-6 border-b border-slate-200">
//                             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                                 <Camera size={20} />
//                                 Image Verification
//                             </h2>
//                             <p className="text-slate-600 mt-1">
//                                 We need to verify your face and body for better recommendations
//                             </p>
//                         </div>

//                         <div className="p-6">
//                             <div className="relative bg-slate-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
//                                 {isUploading ? (
//                                     <div className="text-center">
//                                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"></div>
//                                         <p className="text-slate-700 font-medium">Analyzing image...</p>
//                                         <p className="text-slate-500 text-sm mt-1">Checking for face and body</p>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <img
//                                             src={tempDetectionImage}
//                                             alt="Detection Preview"
//                                             className="w-full h-full object-contain"
//                                         />
//                                         {detectionStatus && (
//                                             <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4">
//                                                 {detectionStatus === 'success' ? (
//                                                     <div className="text-center">
//                                                         <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
//                                                             <Check size={32} className="text-emerald-600" />
//                                                         </div>
//                                                         <h3 className="text-xl font-bold text-white mb-1">Verification Successful!</h3>
//                                                         <p className="text-emerald-200">
//                                                             Face and body detected. Your image meets our guidelines.
//                                                         </p>
//                                                     </div>
//                                                 ) : (
//                                                     <div className="text-center">
//                                                         <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
//                                                             <AlertTriangle size={32} className="text-red-600" />
//                                                         </div>
//                                                         <h3 className="text-xl font-bold text-white mb-1">Verification Failed</h3>
//                                                         <p className="text-red-200">
//                                                             Please make sure your face and upper body are clearly visible.
//                                                         </p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </div>

//                             <div className="mt-6 flex gap-3">
//                                 <button
//                                     onClick={handleCancelImage}
//                                     className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={confirmImageUpload}
//                                     disabled={isUploading || detectionStatus !== 'success'}
//                                     className={`flex-1 py-3 rounded-lg text-white font-medium transition ${isUploading || detectionStatus !== 'success'
//                                         ? "bg-indigo-300 cursor-not-allowed"
//                                         : "bg-indigo-500 hover:bg-indigo-600"
//                                         }`}
//                                 >
//                                     Use This Photo
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // Reusable Profile Section Component
// const ProfileSection = ({ title, icon, children }) => (
//     <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//         <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
//             {icon}
//             <h2>{title}</h2>
//         </div>
//         <div className="space-y-4">
//             {children}
//         </div>
//     </div>
// );

// // Reusable Profile Field Component
// const ProfileField = ({ label, icon, editMode, name, value, onChange, placeholder, type = "text" }) => (
//     <div className="flex items-start gap-3">
//         <div className="mt-1 text-indigo-500">{icon}</div>
//         <div className="flex-1">
//             <div className="text-slate-500 text-sm font-medium">{label}</div>
//             {editMode ? (
//                 <input
//                     type={type}
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                     placeholder={placeholder}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//             ) : (
//                 <div className="text-slate-800 font-medium">
//                     {value || <span className="text-slate-400">Not provided</span>}
//                 </div>
//             )}
//         </div>
//     </div>
// );

// // Feature Card for Seller Section
// const FeatureCard = ({ icon, title, description }) => (
//     <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
//         <div className="text-indigo-500 mb-3">{icon}</div>
//         <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
//         <p className="text-slate-600 text-sm">{description}</p>
//     </div>
// );

// export default Profile;

import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import {
    User, Mail, Calendar, MapPin, Shirt, Smile, Paintbrush,
    Edit2, Save, X, Camera, Check, AlertTriangle, ShirtIcon,
    Store, Phone, Heart, Zap, TrendingUp, ShoppingBag
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

function Profile() {
    const { user, updateUserProfile } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // State for editable fields
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        ageRange: user?.ageRange || '',
        bodyType: user?.bodyType || '',
        preferredClothingStyle: user?.preferredClothingStyle || [],
        favColor: user?.favColor || [],
        address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            country: user?.address?.country || 'India',
            zip: user?.address?.zip || ''
        }
    });

    // Style preferences (matching onboarding)
    const clothingStyles = ["Casual", "Formal", "Sporty", "Bohemian", "Vintage", "Streetwear"];
    const colors = ["Black", "White", "Blue", "Red", "Green", "Purple", "Gray", "Yellow"];
    const ageRanges = ["Under 18", "18–24", "25–34", "35–44", "45+"];
    const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
    const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus-size"];

    // Image upload state
    const [imagePreview, setImagePreview] = useState(user?.userImage || '');
    const [isUploading, setIsUploading] = useState(false);
    const [detectionStatus, setDetectionStatus] = useState(null);
    const [showDetectionPreview, setShowDetectionPreview] = useState(false);
    const [tempDetectionImage, setTempDetectionImage] = useState('');
    const [imageChanged, setImageChanged] = useState(false);
    const [skintone, setSkintone] = useState(user?.skintone || "");

    const handleBecomeSeller = () => navigate("/become-seller");

    const toggleEditMode = () => {
        if (editMode) handleSaveProfile();
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSaveProfile = async () => {
        try {
            if (imagePreview !== user?.userImage) setImageChanged(true);

            const data = {
                ...formData,
                imageChanged,
                skintone,
                image: imagePreview
            };

            await updateUserProfile(data);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error('Error updating profile:', error);
        }
    };

    const handleStyleToggle = (style) => {
        setFormData(prev => ({
            ...prev,
            preferredClothingStyle: prev.preferredClothingStyle.includes(style)
                ? prev.preferredClothingStyle.filter(s => s !== style)
                : [...prev.preferredClothingStyle, style]
        }));
    };

    const handleColorToggle = (color) => {
        setFormData(prev => ({
            ...prev,
            favColor: prev.favColor.includes(color)
                ? prev.favColor.filter(c => c !== color)
                : [...prev.favColor, color]
        }));
    };

    const handleImageClick = () => {
        if (editMode) fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            setTempDetectionImage(e.target.result);
            setShowDetectionPreview(true);
            setIsUploading(true);

            // Actual API call would go here
            setTimeout(() => {
                setDetectionStatus('success');
                setIsUploading(false);
                setSkintone("medium"); // Example value
            }, 1500);
        };
        reader.readAsDataURL(file);
    };

    const confirmImageUpload = () => {
        setImagePreview(tempDetectionImage);
        setShowDetectionPreview(false);
        setDetectionStatus(null);
    };

    const handleCancelImage = () => {
        setShowDetectionPreview(false);
        setDetectionStatus(null);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 w-full transition-all duration-300 lg:ml-20">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                        <p className="text-slate-600">Manage your personal information</p>
                    </div>
                    <button
                        onClick={toggleEditMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${editMode
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                            }`}
                    >
                        {editMode ? <Save size={18} /> : <Edit2 size={18} />}
                        {editMode ? "Save Changes" : "Edit Profile"}
                    </button>
                </header>

                <main className="p-4 md:p-6">
                    {!user ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-slate-500">Loading profile...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-8"
                        >
                            {/* Profile Header - Enhanced */}
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="relative">
                                    <div
                                        className={`relative h-32 w-32 rounded-full border-4 overflow-hidden cursor-pointer ${editMode ? "border-indigo-400" : "border-emerald-400"
                                            }`}
                                        onClick={handleImageClick}
                                    >
                                        <img
                                            src={imagePreview || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                        {editMode && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold text-slate-800 bg-slate-50 border-b border-slate-300 px-2 py-1 mb-2 w-full max-w-md focus:outline-none focus:border-indigo-500"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                                    )}
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 mb-4">
                                        <Mail size={16} />
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={true}
                                                className="bg-slate-50 border-b border-slate-300 px-2 py-1 w-full max-w-md focus:outline-none"
                                            />
                                        ) : (
                                            <span>{user.email}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                        {user.isSeller && (
                                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                <Store size={14} /> Seller
                                            </div>
                                        )}
                                        {skintone && (
                                            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                Skin: {skintone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Details Section - Enhanced */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                            {editMode ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    placeholder="+91 1234567890"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-800">
                                                    <Phone size={16} />
                                                    <span>{user.phone || "Not provided"}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                            {editMode ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {genders.map((gender) => (
                                                        <button
                                                            key={gender}
                                                            onClick={() => setFormData(prev => ({ ...prev, gender }))}
                                                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.gender === gender
                                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {gender}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-800">
                                                    <User size={16} />
                                                    <span>{user.gender || "Not provided"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Body Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Age Range</label>
                                            {editMode ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {ageRanges.map((age) => (
                                                        <button
                                                            key={age}
                                                            onClick={() => setFormData(prev => ({ ...prev, ageRange: age }))}
                                                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.ageRange === age
                                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {age}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-800">
                                                    <Calendar size={16} />
                                                    <span>{user.ageRange || "Not provided"}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Body Type</label>
                                            {editMode ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {bodyTypes.map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setFormData(prev => ({ ...prev, bodyType: type }))}
                                                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.bodyType === type
                                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-800">
                                                    <ShirtIcon size={16} />
                                                    <span>{user.bodyType || "Not provided"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section - Enhanced */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
                                    Shipping Address
                                </h2>

                                <div className="space-y-4">
                                    {editMode ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={formData.address.street}
                                                    onChange={handleAddressChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    placeholder="123 Main Street"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.address.city}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Mumbai"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={formData.address.state}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="Maharashtra"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        name="zip"
                                                        value={formData.address.zip}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        placeholder="400001"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                                                <select
                                                    name="country"
                                                    value={formData.address.country}
                                                    onChange={handleAddressChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                >
                                                    <option value="India">India</option>
                                                    <option value="USA">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="Australia">Australia</option>
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-slate-800 font-medium">
                                                {user.address?.street || "No address provided"}
                                            </div>
                                            <div className="text-slate-600">
                                                {user.address?.city && `${user.address.city}, `}
                                                {user.address?.state && `${user.address.state}, `}
                                                {user.address?.country}
                                            </div>
                                            <div className="text-slate-600">
                                                {user.address?.zip}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Style Preferences - Enhanced */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">
                                    Style Preferences
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                            <Shirt size={16} className="text-indigo-500" />
                                            Preferred Clothing Styles
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {clothingStyles.map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => editMode && handleStyleToggle(style)}
                                                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.preferredClothingStyle.includes(style)
                                                            ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                        } ${!editMode && !formData.preferredClothingStyle.includes(style)
                                                            ? "opacity-50"
                                                            : ""
                                                        }`}
                                                    disabled={!editMode}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                            <Paintbrush size={16} className="text-indigo-500" />
                                            Favorite Colors
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => editMode && handleColorToggle(color)}
                                                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.favColor.includes(color)
                                                            ? "text-white shadow-md"
                                                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                        } ${!editMode && !formData.favColor.includes(color)
                                                            ? "opacity-50"
                                                            : ""
                                                        }`}
                                                    style={{
                                                        backgroundColor: formData.favColor.includes(color)
                                                            ? color.toLowerCase()
                                                            : '',
                                                        borderColor: formData.favColor.includes(color)
                                                            ? color.toLowerCase()
                                                            : '#e2e8f0'
                                                    }}
                                                    disabled={!editMode}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Become a Seller Section - Enhanced */}
                            {!user.isSeller && (
                                <div className="mt-6 p-6 border border-dashed border-emerald-400 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 text-center">
                                    <h3 className="text-xl font-bold text-emerald-800 mb-3">Become a Seller on FashionHub</h3>
                                    <p className="text-slate-700 mb-5 max-w-2xl mx-auto">
                                        Join our community of fashion creators! Sell your unique designs, reach thousands of customers,
                                        and grow your fashion business with our platform.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <FeatureCard
                                            icon={<Store size={24} />}
                                            title="Your Own Store"
                                            description="Create a personalized storefront to showcase your brand"
                                        />
                                        <FeatureCard
                                            icon={<ShoppingBag size={24} />}
                                            title="Sell Your Designs"
                                            description="List unlimited products and reach fashion lovers worldwide"
                                        />
                                        <FeatureCard
                                            icon={<Paintbrush size={24} />}
                                            title="Creative Freedom"
                                            description="Full control over your brand and product presentation"
                                        />
                                    </div>
                                    <button
                                        onClick={handleBecomeSeller}
                                        className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Start Selling Now
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>

            {/* Detection Preview Modal - Enhanced */}
            {showDetectionPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Camera size={20} />
                                Image Verification
                            </h2>
                            <p className="text-slate-600 mt-1">
                                We need to verify your face and body for better recommendations
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="relative bg-slate-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                                {isUploading ? (
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                                        <p className="text-slate-700 font-medium">Analyzing image...</p>
                                        <p className="text-slate-500 text-sm mt-1">Checking for face and body</p>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={tempDetectionImage}
                                            alt="Detection Preview"
                                            className="w-full h-full object-contain"
                                        />
                                        {detectionStatus && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4">
                                                {detectionStatus === 'success' ? (
                                                    <div className="text-center">
                                                        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <Check size={32} className="text-emerald-600" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-1">Verification Successful!</h3>
                                                        <p className="text-emerald-200">
                                                            Face and body detected. Your image meets our guidelines.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <AlertTriangle size={32} className="text-red-600" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-1">Verification Failed</h3>
                                                        <p className="text-red-200">
                                                            Please make sure your face and upper body are clearly visible.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handleCancelImage}
                                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmImageUpload}
                                    disabled={isUploading || detectionStatus !== 'success'}
                                    className={`flex-1 py-3 rounded-lg text-white font-medium transition ${isUploading || detectionStatus !== 'success'
                                            ? "bg-indigo-300 cursor-not-allowed"
                                            : "bg-indigo-500 hover:bg-indigo-600"
                                        }`}
                                >
                                    Use This Photo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// Reusable Components
const ProfileSection = ({ title, icon, children }) => (
    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
            {icon}
            <h2>{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
        <div className="text-indigo-500 mb-3">{icon}</div>
        <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

export default Profile;