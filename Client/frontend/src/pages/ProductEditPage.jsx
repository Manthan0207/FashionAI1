import React, { useState, useEffect } from 'react';
import { User, Package, ShoppingCart, DollarSign, Store, Upload, Plus, X, ArrowLeft, Save, Eye, Image, Tag, Palette, Ruler, Calendar, Box, Edit, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

// FormSection component
const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        {children}
    </div>
);

const ProductEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // const { updateProduct } = useAuthStore();

    const { isLoading, getSingleProduct, updateProduct } = useAuthStore()
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountedPrice: '',
        sizesAvailable: [],
        colors: [],
        fitType: '',
        gender: '',
        ageRange: '',
        styleTags: [],
        stock: '',
        images: [],
        isFeatured: false,
        returnPolicyDays: 7,
        material: '',
        ratings: [],
        reviews: [],
        totalSales: 0
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [newColor, setNewColor] = useState('');
    const [originalImages, setOriginalImages] = useState([]);

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
    const fitTypeOptions = ['Regular', 'Slim', 'Relaxed', 'Oversized', 'Tight'];
    const genderOptions = ['Men', 'Women', 'Unisex', 'Kids'];
    const ageRangeOptions = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const commonTags = ['Casual', 'Formal', 'Streetwear', 'Vintage', 'Modern', 'Classic', 'Trendy', 'Comfort'];

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getSingleProduct(id)

                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    discountedPrice: product.discountedPrice > 0 ? product.discountedPrice : '',
                    sizesAvailable: product.sizesAvailable || [],
                    colors: product.colors || [],
                    fitType: product.fitType || '',
                    gender: product.gender || '',
                    ageRange: product.ageRange || '',
                    styleTags: product.styleTags || [],
                    stock: product.stock || '',
                    images: product.images || [],
                    isFeatured: product.isFeatured || false,
                    returnPolicyDays: product.returnPolicyDays || 7,
                    material: product.material || '',
                    ratings: product.reviews.rating || [],
                    reviews: product.reviews || [],
                    totalSales: product.totalSales || 0
                });

                setOriginalImages(product.images || []);

            } catch (error) {
                console.error('Error fetching product:', error);

                alert('Error loading product data');
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeToggle = (size, e) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            sizesAvailable: prev.sizesAvailable.includes(size)
                ? prev.sizesAvailable.filter(s => s !== size)
                : [...prev.sizesAvailable, size]
        }));
    };

    const handleColorAdd = (e) => {
        e.preventDefault();
        if (newColor && !formData.colors.includes(newColor)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, newColor]
            }));
            setNewColor('');
        }
    };

    const handleColorRemove = (colorToRemove, e) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(color => color !== colorToRemove)
        }));
    };

    const handleTagAdd = (e) => {
        e.preventDefault();
        if (newTag && !formData.styleTags.includes(newTag)) {
            setFormData(prev => ({
                ...prev,
                styleTags: [...prev.styleTags, newTag]
            }));
            setNewTag('');
        }
    };

    const handleTagRemove = (tagToRemove, e) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            styleTags: prev.styleTags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);

        // Convert to URLs for preview
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, e.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    // const removeImage = (index, e) => {
    //     e.preventDefault();
    //     setFormData(prev => ({
    //         ...prev,
    //         images: prev.images.filter((_, i) => i !== index)
    //     }));
    //     setImageFiles(prev => prev.filter((_, i) => i !== index));
    // };
    const removeImage = (index, e) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (formData.images.length != formData.colors.length) {
                throw new Error("Images and Color Size must be same.")
            }
            const updatedProd = await updateProduct(id, formData);
            setFormData(updatedProd)
            navigate('/seller-inventory');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate('/seller-inventory');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <div className="flex-1 min-w-0 lg:ml-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-600">Loading product data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 lg:ml-20">
                {/* Navigation Header */}
                <SellerNavbar />

                {/* Main Content */}
                <div className="overflow-auto">
                    <div className="p-8">
                        {/* Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Edit className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
                                        <p className="text-lg text-slate-600 mt-1">Update your product details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back to Inventory</span>
                                </button>
                            </div>
                        </div>

                        {/* Product Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Total Sales</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{formData.totalSales}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-green-100">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Average Rating</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">
                                            {(formData.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                                                (formData.reviews?.length || 1)).toFixed(2) || "NA"
                                            }
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-yellow-100">
                                        <Eye className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Total Reviews</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{formData.reviews.length}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-100">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Main Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    <FormSection title="Basic Information" icon={Package}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Enter product name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Describe your product..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
                                                <input
                                                    type="text"
                                                    name="material"
                                                    value={formData.material}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="e.g., 100% Cotton, Polyester blend"
                                                />
                                            </div>
                                        </div>
                                    </FormSection>

                                    <FormSection title="Pricing & Stock" icon={DollarSign}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Price *</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Discounted Price</label>
                                                <input
                                                    type="number"
                                                    name="discountedPrice"
                                                    value={formData.discountedPrice}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Stock Quantity *</label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="0"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </FormSection>

                                    <FormSection title="Product Details" icon={Tag}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Fit Type</label>
                                                    <select
                                                        name="fitType"
                                                        value={formData.fitType}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    >
                                                        <option value="">Select fit type</option>
                                                        {fitTypeOptions.map(fit => (
                                                            <option key={fit} value={fit}>{fit}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    >
                                                        <option value="">Select gender</option>
                                                        {genderOptions.map(gender => (
                                                            <option key={gender} value={gender}>{gender}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Target Age Range</label>
                                                <select
                                                    name="ageRange"
                                                    value={formData.ageRange}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                >
                                                    <option value="">Select age range</option>
                                                    {ageRangeOptions.map(age => (
                                                        <option key={age} value={age}>{age}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </FormSection>

                                    <FormSection title="Sizes Available" icon={Ruler}>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeOptions.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={(e) => handleSizeToggle(size, e)}
                                                    className={`px-4 py-2 rounded-lg border transition-colors ${formData.sizesAvailable.includes(size)
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </FormSection>

                                    <FormSection title="Colors" icon={Palette}>
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newColor}
                                                    onChange={(e) => setNewColor(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Add color"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleColorAdd}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.colors.map(color => (
                                                    <span
                                                        key={color}
                                                        className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                                                    >
                                                        {color}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleColorRemove(color, e)}
                                                            className="ml-2 text-slate-500 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </FormSection>

                                    <FormSection title="Style Tags" icon={Tag}>
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Add style tag"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleTagAdd}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {commonTags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (!formData.styleTags.includes(tag)) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    styleTags: [...prev.styleTags, tag]
                                                                }));
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.styleTags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleTagRemove(tag, e)}
                                                            className="ml-2 text-indigo-500 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </FormSection>
                                </div>

                                {/* Right Column - Images & Settings */}
                                <div className="space-y-6">
                                    <FormSection title="Product Images" icon={Image}>
                                        <div className="space-y-4">
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-slate-600 mb-2">Click to upload new images</p>
                                                    <p className="text-sm text-slate-500">PNG, JPG up to 10MB each</p>
                                                </label>
                                            </div>

                                            {formData.images.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {formData.images.map((image, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={image}
                                                                alt={`Product preview ${index}`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => removeImage(index, e)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormSection>

                                    <FormSection title="Additional Settings" icon={Calendar}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Return Policy (Days)</label>
                                                <input
                                                    type="number"
                                                    name="returnPolicyDays"
                                                    value={formData.returnPolicyDays}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    min="0"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-slate-700">Featured Product</label>
                                            </div>
                                        </div>
                                    </FormSection>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={saving}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>Update Product</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            Cancel Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;