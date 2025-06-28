import mongoose from "mongoose";


//by using timestamp : true then we will have createdAt and updatedAt fields automatically into document
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
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
        isSeller: { type: Boolean, default: false },
        sellerSince: { type: Date, default: Date.now() },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved"
        }

    }, { timestamps: true })

export const User = mongoose.model('User', userSchema)