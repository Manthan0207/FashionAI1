import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { motion } from "framer-motion"
import { Store, Mail, Phone, MapPin, FileText, Image as ImageIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const StoreDetailsForm = () => {
    const [store, setStore] = useState({
        name: "",
        description: "",
        logo: "",
        contactEmail: "",
        contactPhone: "",
        location: "",
    })
    const [logoFile, setLogoFile] = useState(null)
    const [base64ImageVar, setBase64ImageVar] = useState(null)

    const navigate = useNavigate()
    const { becomeSeller, isLoading, error, message } = useAuthStore()

    const handleChange = (e) => {
        const { name, value } = e.target
        setStore((prev) => ({ ...prev, [name]: value }))
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setLogoFile(file)
            const previewURL = URL.createObjectURL(file)
            setStore((prev) => ({ ...prev, logo: previewURL }))
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setBase64ImageVar(reader.result)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { ...store, logo: base64ImageVar }
            await becomeSeller(data)
            navigate('/')
        } catch (err) {
            console.error("Update failed:", err)
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50 ">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 lg:ml-20">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Store Details</h1>
                    <p className="text-slate-600">Manage your store information</p>
                </header>

                <main className="p-4 md:p-6">
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-6"
                    >
                        <InputField
                            icon={<Store />}
                            label="Store Name"
                            name="name"
                            value={store.name}
                            onChange={handleChange}
                            placeholder="e.g. Urban Wear Co."
                        />
                        <InputField
                            icon={<FileText />}
                            label="Description"
                            name="description"
                            value={store.description}
                            onChange={handleChange}
                            placeholder="Brief description about your store"
                        />
                        <ImageInputField
                            icon={<ImageIcon />}
                            label="Logo"
                            onChange={handleLogoChange}
                            preview={store.logo}
                        />
                        <InputField
                            icon={<Mail />}
                            label="Contact Email"
                            name="contactEmail"
                            value={store.contactEmail}
                            onChange={handleChange}
                            placeholder="support@yourstore.com"
                        />
                        <InputField
                            icon={<Phone />}
                            label="Contact Phone"
                            name="contactPhone"
                            value={store.contactPhone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                        />
                        <InputField
                            icon={<MapPin />}
                            label="Location"
                            name="location"
                            value={store.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                        />

                        {/* Show loader, error, and message */}
                        <div className="space-y-2">
                            {isLoading && (
                                <p className="text-indigo-600 flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Saving your store...
                                </p>
                            )}
                            {error && (
                                <p className="text-red-600">{error}</p>
                            )}
                            {message && (
                                <p className="text-green-600">{message}</p>
                            )}
                        </div>

                        <div className="text-right">
                            <button
                                type="submit"
                                className={`px-6 py-2 rounded-xl shadow transition 
                                    ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                                    text-white`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.form>
                </main>
            </div>
        </div>
    )
}

const InputField = ({ icon, label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
            <span className="text-indigo-500">{icon}</span>
            {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-slate-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>
)

const ImageInputField = ({ icon, label, onChange, preview }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
            <span className="text-indigo-500">{icon}</span>
            {label}
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {preview && (
            <img
                src={preview}
                alt="Logo preview"
                className="mt-2 h-24 rounded-xl border border-slate-200 object-contain"
            />
        )}
    </div>
)

export default StoreDetailsForm
