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

        await Promise.all(
            data.items.map(item => updateProdData(item, item.productId))
        );


        await orders.save()
        res.status(200).json({ success: true, message: "Order Placed Successfully", orders: orders })
    } catch (error) {
        console.log("error in the placeOrder");
        console.log(error.message);

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

export const changeProductStatus = async (req, res) => {
    const { prodId } = req.body;

    try {
        const product = await Product.findById(prodId);

        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });


        product.isActive = !product.isActive;
        const updatedProd = await product.save();

        const allProds = await Product.find({});


        res.status(200).json({ success: false, message: "Product Active Status Changed Successful", updatedProd, allProds })
    } catch (error) {
        console.log("Error in changeProductStatus");
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const reviewProduct = async (req, res) => {
    const userId = req.userId;
    const { prodId, review, rating } = req.body;

    try {
        let product = await Product.findOneAndUpdate(
            { _id: prodId, "reviews.user": userId },
            { $set: { "reviews.$.rating": rating, "reviews.$.comment": review } },
            { new: true }
        );

        if (!product) {
            product = await Product.findOneAndUpdate(
                { _id: prodId },
                {
                    $push: {
                        reviews: {
                            user: userId,
                            rating: rating,
                            comment: review || "",
                            date: new Date()
                        }
                    }
                },
                { new: true }
            );
        }

        const allProd = await Product.find({});


        res.status(200).json({ success: true, message: "Review Submitted", product, allProd })

    } catch (error) {
        console.log("Error in reviewProduct ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}

const updateProdData = async (item, id) => {
    await Product.findByIdAndUpdate(id, { $inc: { totalSales: item.quantity, stock: -item.quantity } })
}


