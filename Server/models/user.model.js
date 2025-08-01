import mongoose from "mongoose";


//by using timestamp : true then we will have createdAt and updatedAt fields automatically into document
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: Number,
            default: -1
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        address: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            country: { type: String, default: "" },
            zip: { type: Number, default: -1 }

        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        userImage: {
            type: String,
            default: ""
        },
        bodyType: {
            type: String,
            default: ""
        },
        goals: {
            type: [String],
            default: []
        },
        gender: {
            type: String,
            default: ""
        },
        ageRange: {
            type: String,
            default: ""
        },
        minAge: {
            type: Number,
            default: ""
        },
        maxAge: {
            type: Number,
            default: ""
        },
        preferredClothingStyle: {
            type: [String],
            default: []
        },
        favColor: {
            type: [String],
            default: []
        },
        fitType: {
            type: String,
            default: ""
        },

        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpiresAt: {
            type: Date
        },
        verificationToken: {
            type: String
        },
        verificationTokenExpiresAt: {
            type: Date
        },
        store: {
            name: { type: String, default: "" },
            description: { type: String, default: "" },
            logo: { type: String, default: "" },
            contactEmail: { type: String, default: "" },
            contactPhone: { type: String, default: "" },
            location: { type: String, default: "" }
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

        isSeller: { type: Boolean, default: false },
        sellerSince: { type: Date, default: Date.now() },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved"
        },
        skintone: {
            type: String,
            default: ""
        },
        notifications: [
            {
                message: { type: String, required: true },
                isRead: { type: Boolean, default: false },
                msgType: { type: String, enum: ["order", "purchase", "wishlist", "review", "admin"], required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]

    }, { timestamps: true })

export const User = mongoose.model('User', userSchema)