import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                size: { type: String },
                color: { type: String },
                image: { type: String, default: "" }
            }
        ],
        subTotal: {
            type: Number,
            default: 0
        },
        shippingCharge: {
            type: Number,
            default: 0
        },
        taxCharge: {
            type: Number,
            default: 0
        },
        codConvenienceFee: {
            type: Number,
            default: 50
        },
        totalAmount: {
            type: Number,
            required: true
        },
        deliveryAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            zip: { type: Number, required: true }
        }
        ,
        status: {
            type: String,
            default: "Pending"
        },
        paymentStatus: {
            type: String,
            default: "Unpaid"
        },
        paymentMethod: {
            type: String,
            required: true
        },
        orderDate: {
            type: String,
            default: Date.now
        }
    }, { timestamps: true }
)

export const Order = mongoose.model('Order', OrderSchema)