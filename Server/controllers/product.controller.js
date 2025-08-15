import axios from "axios";
import { Order } from "../models/orders.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const getProducts = async (req, res) => {
    const userId = req.userId;
    try {

        const products = await Product.find({}).populate("seller", "name store.name store.logo")
        console.log(products);

        res.status(200).json({ message: "Prod fetch Successful", success: true, products })
    } catch (error) {
        console.log("Error in getProducts");
        res.status(500).json({ message: "Error Fetching the products", success: false })

    }
}



// export const getProducts = async (req, res) => {
//     console.log("Hi");

//     const userId = req.userId;

//     try {
//         // Get all active products
//         const products = await Product.find({ isActive: true }).populate("seller", "name store.name store.logo").lean();

//         // If no user logged in, just return all
//         if (!userId) {
//             return res.status(200).json({
//                 success: true,
//                 message: "All products (no personalization)",
//                 products
//             });
//         }

//         // Fetch user
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(200).json({
//                 success: true,
//                 message: "User not found, returning all products",
//                 products
//             });
//         }

//         // Format user for FastAPI
//         const userData = {
//             gender: user.gender,
//             ageRange: user.ageRange,
//             preferredStyle: user.preferredClothingStyle || [],
//             favoriteColors: user.favColor || [],
//             fitType: user.fitType || "",
//             bodyType: user.bodyType || "",
//             positiveProductIds: user.wishlist || [],// Optional: Fill from wishlist/order/review ,
//             skintone: user.skintone || ""
//         };

//         console.log("User Data to fapi : ", userData);



//         // Format products for FastAPI
//         const prodData = products.map((p) => ({
//             id: p._id.toString(),
//             name: p.name,
//             styleTags: p.styleTags,
//             colors: p.colors,
//             fitType: p.fitType,
//             gender: p.gender,
//             ageRange: p.ageRange,
//             material: p.material,
//             price: p.discountedPrice !== -1 ? p.discountedPrice : p.price
//         }));

//         // 🔁 Call FastAPI recommender
//         const response = await axios.post("http://localhost:8000/api/recommend", {
//             userData,
//             prodData
//         });

//         const { recommendations, explanations } = response.data;
//         console.log("Rec : ", recommendations);

//         console.log("exp : ", explanations);


//         const recommendedIds = response.data.recommendations.map(rec => rec.id);

//         // 2. Maintain order of IDs for final sort
//         const orderMap = Object.fromEntries(recommendedIds.map((id, index) => [id, index]));

//         // 3. Filter original Mongo products
//         const recommendedFullProds = products.filter(p => recommendedIds.includes(p._id.toString()));

//         // 4. Sort according to FastAPI order
//         const sortedProds = recommendedFullProds.sort((a, b) =>
//             orderMap[a._id.toString()] - orderMap[b._id.toString()]
//         );


//         return res.status(200).json({
//             success: true,
//             message: "Personalized recommendations fetched",
//             products: sortedProds,
//             explanations // optional for UI
//         });

//     } catch (error) {
//         console.log("Error in getProducts", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching products"
//         });
//     }
// };


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



        await orders.save();

        const user = await User.findById(id);
        const itemNames = data.items.map(item => item.name).join(", ");




        user.notifications.push({
            message: `Order placed.`,
            msgType: "order",
        })
        user.save();

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
        console.log("Error in changeProductStatus", error.message);
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
        const user = await User.findById(userId);

        user.notifications.push({
            message: `You reviewed ${product.name}`,
            msgType: "review"
        });
        await user.save();


        res.status(200).json({ success: true, message: "Review Submitted", product, allProd })

    } catch (error) {
        console.log("Error in reviewProduct ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}

const updateProdData = async (item, id) => {
    await Product.findByIdAndUpdate(id, { $inc: { totalSales: item.quantity, stock: -item.quantity } })
}


// export const toggleWishlist = async (req, res) => {
//     const id = req.userId;
//     const { prodId } = req.body;

//     try {
//         const productExists = await Product.exists({ _id: prodId });
//         if (!productExists) {
//             return res.status(404).json({ success: false, message: 'Product not found.' });
//         }

//         const getUser = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found.' });
//         }

//         const wishProd = getUser.wishlist?.find((prod) => prod._id === prodId);
//         if (!wishlist) {
//             getUser.wishlist.push({ prodId });
//             getUser.save();
//             return res.status(200).json({ success: true, message: "Added to Wishlist" })
//         }
//         const updatedProd = getUser.wishlist?.map((itms) => itms._id != prodId);
//         getUser.wishlist = updatedProd;
//         getUser.save();
//         return res.status(200).json({ success: true, message: "Removed From the Wishlist" })


//     } catch (error) {
//         console.log("Error in toggle wishlist", message.error);
//         res.status(500).json({ success: false, message: error.message })

//     }
// }


export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { prodId } = req.body;
        console.log(userId);



        console.log("Helu");


        if (!prodId) {
            return res.status(400).json({ success: false, message: 'Invalid product id.' });
        }

        const productExists = await Product.exists({ _id: prodId });
        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const alreadyInWishlist = user.wishlist.some(id => id.equals(prodId));

        let updatedUser;
        if (alreadyInWishlist) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { wishlist: prodId } },
                { new: true }
            );
            console.log("Removed");


            return res.status(200).json({ success: true, message: 'Removed from wishlist.', updatedUser });
        } else {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { wishlist: prodId } },
                { new: true }
            );
            console.log("Added");


            return res.status(200).json({ success: true, message: 'Added to wishlist.', updatedUser });
        }
    } catch (error) {
        console.error('Error in toggleWishlist:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
