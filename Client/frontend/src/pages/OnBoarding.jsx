import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader2, ArrowLeft, Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [bodyType, setBodyType] = useState("");
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoading, error, uploadUserImage, saveOnboardData } = useAuthStore();
    const [base64ImageVar, setBase64ImageVar] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedFit, setSelectedFit] = useState("");
    const { user } = useAuthStore()
    const [fullName, setFullName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("India");
    const [skintone, setSkintone] = useState("")

    const navigate = useNavigate();

    const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus-size"];
    const goalsList = [
        "Daily Outfit Suggestions",
        "Virtual Try-On",
        "Wardrobe Planning",
        "Style Improvement",
        "Buying New Clothes",
    ];
    const clothingStyles = ["Casual", "Formal", "Streetwear", "Athletic", "Traditional", "Experimental"];
    const colorOptions = ["Black", "White", "Beige", "Blue", "Red", "Green", "Purple", "Gray", "Yellow", "Brown"];
    const ageRanges = ["Under 18", "18–24", "25–34", "35–44", "45+"];
    const fitOptions = ["Tight", "Regular", "Loose"];
    const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                setBase64ImageVar(reader.result);
            };
        }
    };

    const handleNextClick = async () => {
        if (!imageFile) {
            alert("Please upload an image first");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const response = await fetch("http://localhost:8000/api/detect", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Detection API error");
            }

            const data = await response.json();

            if (data.faceDetected && data.bodyDetected && data.skintone) {
                setSkintone(data.skintone)
                setStep(3);
            } else {
                alert("Please upload a clear image with your full face and body visible.");
                setImageFile(null);
                setImagePreview(null);
            }
        } catch (error) {
            console.error("Detection error:", error);
            alert("Failed to detect face/body. Please try again.");
            setImageFile(null);
            setImagePreview(null);
        }

        setLoading(false);
    };

    const toggleGoal = (goal) => {
        setGoals((prev) =>
            prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
        );
    };

    const toggleStyle = (style) => {
        setSelectedStyles((prev) =>
            prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const handleSubmit = async () => {
        const userData = {
            phone,
            address: { street: address, city, state, zip, country },
            image: base64ImageVar,
            bodyType,
            goals,
            gender: selectedGender,
            ageRange: selectedAge,
            preferredClothingStyle: selectedStyles,
            favColor: selectedColors,
            fitType: selectedFit,
            skintone
        };

        await saveOnboardData(userData);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Personalize Your Experience</h1>
                            <p className="text-slate-600">Step {step} of 8</p>
                        </div>
                        <div className="w-10" /> {/* Spacer for balance */}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-3xl p-6 transition-all duration-300"
                >
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
                            <p className="text-slate-600">
                                Let's start with your basic information to personalize your experience.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="John Doe"
                                        disabled={true}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="john@example.com"
                                        disabled={true}

                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="+91 1234567890"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!fullName || !email || !phone}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Profile Photo */}
                    {step === 2 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">Your Profile Photo</h2>
                            <p className="text-slate-600">
                                We use your image to personalize the virtual try-on experience and recommend better fitting clothes.
                            </p>

                            <label
                                htmlFor="imageUpload"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:bg-slate-50 transition"
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="preview"
                                            className="rounded-xl h-60 object-cover border border-slate-200"
                                        />
                                        <div className="absolute bottom-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                                            Change
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                                        </div>
                                        <p className="text-slate-700 font-medium">Click to upload an image</p>
                                        <p className="text-sm text-slate-500 mt-1">(JPEG, PNG, Max 5MB)</p>
                                    </div>
                                )}
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={handleNextClick}
                                    disabled={!imageFile || loading}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Continue"}
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Body Type */}
                    {step === 3 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">What's your body type?</h2>
                            <p className="text-slate-600">
                                This helps us recommend clothing that fits you perfectly.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {bodyTypes.map((type) => (
                                    <motion.button
                                        key={type}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setBodyType(type)}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${bodyType === type
                                            ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {type}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    disabled={!bodyType}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Goals */}
                    {step === 4 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">What are your main goals?</h2>
                            <p className="text-slate-600">
                                Select all that apply to tailor your experience.
                            </p>

                            <div className="space-y-3">
                                {goalsList.map((goal) => (
                                    <motion.div
                                        key={goal}
                                        variants={itemVariants}
                                        className="flex items-center"
                                    >
                                        <input
                                            id={`goal-${goal}`}
                                            type="checkbox"
                                            checked={goals.includes(goal)}
                                            onChange={() => toggleGoal(goal)}
                                            className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <label
                                            htmlFor={`goal-${goal}`}
                                            className="ml-3 text-slate-700 cursor-pointer"
                                        >
                                            {goal}
                                        </label>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(5)}
                                    disabled={goals.length === 0}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Gender & Age */}
                    {step === 5 && (
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Gender</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {genders.map((gender) => (
                                            <motion.button
                                                key={gender}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedGender(gender)}
                                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${selectedGender === gender
                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {gender}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Age Range</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {ageRanges.map((age) => (
                                            <motion.button
                                                key={age}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedAge(age)}
                                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${selectedAge === age
                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {age}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(4)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(6)}
                                    disabled={!selectedGender || !selectedAge}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 6: Style Preferences */}
                    {step === 6 && (
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-2xl font-bold text-slate-800">Style Preferences</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Preferred Clothing Styles</h3>
                                    <p className="text-slate-600 text-sm mb-4">Select all that apply</p>
                                    <div className="flex flex-wrap gap-3">
                                        {clothingStyles.map((style) => (
                                            <motion.button
                                                key={style}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleStyle(style)}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedStyles.includes(style)
                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {style}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Favorite Colors</h3>
                                    <p className="text-slate-600 text-sm mb-4">Select all that apply</p>
                                    <div className="flex flex-wrap gap-3">
                                        {colorOptions.map((color) => (
                                            <motion.button
                                                key={color}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleColor(color)}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedColors.includes(color)
                                                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {color}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(5)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(7)}
                                    disabled={selectedStyles.length === 0 || selectedColors.length === 0}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 7: Fit Preference */}
                    {step === 7 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">Fit Preference</h2>
                            <p className="text-slate-600">
                                This helps us tailor recommendations and try-on experiences.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {fitOptions.map((fit) => (
                                    <motion.button
                                        key={fit}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedFit(fit)}
                                        className={`px-6 py-4 rounded-xl border text-sm font-medium transition-all ${selectedFit === fit
                                            ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {fit}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(6)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(8)}
                                    disabled={!selectedFit}
                                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    Continue
                                    <ChevronRight className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 8: Shipping Address */}
                    {step === 8 && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">Shipping Address</h2>
                            <p className="text-slate-600">
                                This will be your default shipping address for orders.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="123 Main Street"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Mumbai"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Maharashtra"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                                        <input
                                            type="text"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="400001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                        required
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(7)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft className="inline mr-2" size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !address || !city || !state || !zip || !country}
                                    className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin inline mr-2" size={18} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="inline mr-2" size={18} />
                                            Complete Setup
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Progress indicator */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Progress</span>
                            <span className="text-sm font-medium text-slate-800">{step}/8</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${(step / 8) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Onboarding;