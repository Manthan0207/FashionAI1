import mongoose from 'mongoose';

const prodSchema = mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            default: 0
        },
        discountedPrice: {
            type: Number,
            default: -1
        },
        sizesAvailable: {
            type: [String],
            default: []
        },
        colors: {
            type: [String],
            default: []
        },
        fitType: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            default: ""
        },
        ageRange: {
            type: String,
            default: ""
        },
        styleTags: {
            type: [String], // e.g., ["Casual", "Streetwear"]
            default: []
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        images: {
            type: [String],
            default: []
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        returnPolicyDays: {
            type: Number,
            default: 7
        },
        material: {
            type: String,
            default: ""
        },

        reviews: {
            type: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                    rating: { type: Number, min: 1, max: 5, required: true },
                    comment: { type: String },
                    date: { type: Date, default: Date.now }
                }
            ],
            default: []
        },

        totalSales: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }



    },
    { timestamps: true }
)

export const Product = mongoose.model('Product', prodSchema)