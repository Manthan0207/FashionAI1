import { Order } from "../models/orders.model.js";
import { Product } from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate("seller", "name store.name store.logo")
        console.log(products);

        res.status(200).json({ message: "Prod fetch Successful", success: true, products })
    } catch (error) {
        console.log("Error in getProducts");
        res.status(500).json({ message: "Error Fetching the products", success: false })

    }
}

export const placeOrder = async (req, res) => {
    const data = req.body
    const id = req.userId

    if (!data) {
        return res.status(400).json({ success: false, message: "No Items in cart to  buy" })
    }

    try {
        const orders = new Order(
            {
                user: id,
                ...data
            }
        )

        await orders.save()
        res.status(200).json({ success: true, message: "Order Placed Successfully", orders: orders })
    } catch (error) {
        console.log("error in the placeOrder");
        res.status(500).json({ success: false, message: "Internal Server Error " + error.message })
    }
}

export const getAllOrders = async (req, res) => {
    const id = req.userId;

    try {
        const orders = await Order.find({ user: id });
        res.status(200).json({ success: true, message: "success getting the all orders", orders })

    } catch (error) {
        console.log("Error in getAllOrders");
        res.status(500).json({ success: false, message: "Error getting the all orders" })

    }
}