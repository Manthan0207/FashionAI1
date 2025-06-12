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
    const { isLoading, error, uploadUserImage } = useAuthStore()
    const [base64ImageVar, setBase64ImageVar] = useState("")

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
            if (data.faceDetected && data.bodyDetected) {
                alert("Face and body detected! You can proceed.");
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
            imageFile,  // this is the File object
            bodyType,
            goals,
        };
        console.log("Onboarding Data:", data);
        console.log({ base64ImageVar });

        await uploadUserImage({ image: base64ImageVar });  // send imageFile, correct


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
                )}
            </div>
        </div>
    );
};

export default Onboarding;
