import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";

const bodyTypes = ["Slim", "Athletic", "Average", "Curvy", "Plus-size"];
const goalsList = [
    "Daily Outfit Suggestions",
    "Virtual Try-On",
    "Wardrobe Planning",
    "Style Improvement",
    "Buying New Clothes",
];

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState(null); // store actual File
    const [imagePreview, setImagePreview] = useState(null); // for preview URL
    const [bodyType, setBodyType] = useState("");
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoading, error, uploadUserImage, saveOnboardData } = useAuthStore()
    const [base64ImageVar, setBase64ImageVar] = useState("")
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedFit, setSelectedFit] = useState("");


    const toggleStyle = (style) => {
        setSelectedStyles((prev) =>
            prev.includes(style)
                ? prev.filter((s) => s !== style)
                : [...prev, style]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };




    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0];


        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.readAsDataURL(file)

            reader.onload = async () => {
                console.log(reader.result);

                setBase64ImageVar(reader.result)
            }
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

            // Adjusted to match backend's Mediapipe response
            if (data.faceDetected && data.bodyDetected && data.skintone) {
                alert(`Face and body detected! You can proceed. Skintone = ${data.skintone}`);
                setStep(2);
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
        if (goals.includes(goal)) {
            setGoals(goals.filter((g) => g !== goal));
        } else {
            setGoals([...goals, goal]);
        }
    };

    const handleSubmit = async () => {
        const data = {
            image: base64ImageVar,
            bodyType,
            goals,
            gender: selectedGender,
            ageRange: selectedAge,
            preferredClothingStyle: selectedStyles,
            favColor: selectedColors,
            fitType: selectedFit
        };
        console.log("Onboarding Data:", data);
        console.log({ base64ImageVar });

        await saveOnboardData(data);


        navigate('/')

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-white p-4">
            <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md transition-all duration-300">
                {step === 1 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Let’s start with your photo</h2>
                        <p className="text-sm text-gray-500 px-4">
                            We use your image to personalize the virtual try-on experience and recommend better fitting clothes.
                        </p>
                        <label
                            htmlFor="imageUpload"
                            className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-lg p-6 cursor-pointer hover:bg-emerald-50 transition"
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="rounded-md h-40 object-cover"
                                />
                            ) : (
                                <>
                                    <span className="text-4xl">📷</span>
                                    <p className="mt-2 text-gray-600">Click to upload an image</p>
                                    <p className="text-xs text-gray-400">(JPEG, PNG, Max 5MB)</p>
                                </>
                            )}
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={handleNextClick}
                            disabled={!imageFile || loading}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {loading ? "Checking..." : "Next"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">What’s your body type?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {bodyTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setBodyType(type)}
                                    className={`px-4 py-2 rounded-md border text-sm font-medium transition ${bodyType === type
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!bodyType}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-emerald-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* 
                {step === 3 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">What’s your main goal?</h2>
                        <div className="space-y-2 text-left">
                            {goalsList.map((goal) => (
                                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={goals.includes(goal)}
                                        onChange={() => toggleGoal(goal)}
                                        className="accent-emerald-500"
                                    />
                                    <span className="text-gray-700">{goal}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={goals.length === 0}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Finish"}

                        </button>
                    </div>
                )} */}

                {step === 3 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">What’s your main goal?</h2>
                        <div className="space-y-2 text-left">
                            {goalsList.map((goal) => (
                                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={goals.includes(goal)}
                                        onChange={() => toggleGoal(goal)}
                                        className="accent-emerald-500"
                                    />
                                    <span className="text-gray-700">{goal}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(4)}
                            disabled={!goals}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Finish"}

                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        {/* Gender Selection */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Select Your Gender</h2>
                            <div className="flex flex-col gap-3 mt-2">
                                {["Male", "Female", "Non-binary", "Prefer not to say"].map((genderOption) => (
                                    <label key={genderOption} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={genderOption}
                                            checked={selectedGender === genderOption}
                                            onChange={(e) => setSelectedGender(e.target.value)}
                                            className="accent-blue-600 w-4 h-4"
                                        />
                                        <span className="text-gray-700">{genderOption}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Age Range Selection */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Select Your Age Range</h2>
                            <div className="flex flex-col gap-3 mt-2">
                                {["Under 18", "18–24", "25–34", "35–44", "45+"].map((ageOption) => (
                                    <label key={ageOption} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="ageRange"
                                            value={ageOption}
                                            checked={selectedAge === ageOption}
                                            onChange={(e) => setSelectedAge(e.target.value)}
                                            className="accent-blue-600 w-4 h-4"
                                        />
                                        <span className="text-gray-700">{ageOption}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => setStep(5)}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 disabled:opacity-50"
                            disabled={!selectedGender || !selectedAge || isLoading}
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Next"}
                        </button>
                    </div>
                )}


                <p className="text-gray-500 text-sm">You can select more than one.</p>
                {step === 5 && (
                    <div className="space-y-6">
                        {/* Clothing Styles */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Select Your Preferred Clothing Style(s)</h2>
                            <p className="text-gray-500 text-sm">You can select more than one.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                {["Casual", "Formal", "Streetwear", "Athletic", "Traditional", "Experimental"].map((style) => (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => toggleStyle(style)}
                                        className={`border px-4 py-2 rounded-md text-sm font-medium transition ${selectedStyles.includes(style)
                                            ? "bg-emerald-500 text-white border-emerald-600"
                                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Favorite Colors */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Choose Your Favorite Color(s)</h2>
                            <p className="text-gray-500 text-sm">These will influence your feed and styling palette.</p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
                                {["Black", "White", "Beige", "Blue", "Red", "Green", "Purple", "Gray", "Yellow", "Brown"].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => toggleColor(color)}
                                        className={`border px-3 py-2 rounded-md text-sm font-medium transition ${selectedColors.includes(color)
                                            ? "bg-emerald-500 text-white border-emerald-600"
                                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => setStep(6)}
                            disabled={selectedStyles.length === 0 || selectedColors.length === 0 || isLoading}
                            className={`px-6 py-2 rounded-md text-white font-medium transition ${selectedStyles.length === 0 || selectedColors.length === 0 || isLoading
                                ? "bg-emerald-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Next"}
                        </button>
                    </div>
                )}




                {step === 6 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">What Fit Do You Prefer?</h2>
                            <p className="text-gray-500 text-sm">This helps us tailor recommendations and try-on experiences.</p>

                            <div className="flex gap-4 mt-4">
                                {["Tight", "Regular", "Loose"].map((fit) => (
                                    <button
                                        key={fit}
                                        type="button"
                                        onClick={() => setSelectedFit(fit)}
                                        className={`border px-6 py-2 rounded-md text-sm font-medium transition ${selectedFit === fit
                                            ? "bg-emerald-500 text-white border-emerald-600"
                                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {fit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(7)}
                            disabled={!selectedFit || isLoading}
                            className={`px-6 py-2 rounded-md text-white font-medium transition ${!selectedFit || isLoading
                                ? "bg-emerald-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                        >
                            {isLoading ? <Loader className="animate-spin mx-auto" /> : "Next"}
                        </button>
                    </div>
                )}


                {step === 7 && (
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-bold text-emerald-600">You're all set! ✅</h2>
                        <p className="text-gray-600">Your profile is ready. We’ll now personalize your experience.</p>
                        <button
                            onClick={handleSubmit}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600"
                        >
                            {isLoading ? <Loader /> : "Finish"}
                        </button>
                    </div>
                )}






            </div>
        </div>
    );
};

export default Onboarding;
