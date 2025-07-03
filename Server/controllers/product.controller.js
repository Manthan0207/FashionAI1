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