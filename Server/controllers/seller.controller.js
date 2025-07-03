import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import cloudinary from '../utils/cloudinary.config.js';

export const becomeSeller = async (req, res) => {
    const { name, description, logo, contactEmail, contactPhone, location } = req.body
    const id = req.userId;



    if (!name || !description || !logo || !contactEmail || !contactPhone || !location) {
        return res.status(400).json({ success: false, message: "Please enter all details" })
    }

    try {
        const response = await cloudinary.uploader.upload(logo)

        const updateUser = await User.findByIdAndUpdate(
            id,
            {
                isSeller: true,
                store: { name, description, logo: response.secure_url, contactEmail, contactPhone, location },
                sellerSince: Date.now(),
                approvalStatus: "approved"
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Becoming seller successful",
            user: updateUser
        })
    } catch (error) {
        console.error("Error in becomeSeller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}



export const addProduct = async (req, res) => {
    const id = req.userId;
    const {
        name,
        description,
        price,
        discountedPrice,
        sizesAvailable,
        colors,
        fitType,
        gender,
        ageRange,
        styleTags,
        stock,
        images,
        isFeatured,
        returnPolicyDays,
        material,
    } = req.body;

    try {
        // Validation
        if (
            !name ||
            !description ||
            price === undefined ||
            discountedPrice === undefined ||
            !Array.isArray(sizesAvailable) || sizesAvailable.length === 0 ||
            !Array.isArray(colors) || colors.length === 0 ||
            !fitType ||
            !gender ||
            !ageRange ||
            !Array.isArray(styleTags) || styleTags.length === 0 ||
            stock === undefined ||
            !Array.isArray(images) || images.length === 0 ||
            returnPolicyDays === undefined ||
            !material
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required product details",
            });
        }



        const images_urls = []
        for (const img of images) {
            const response = await cloudinary.uploader.upload(img)
            images_urls.push(response.secure_url)
        }

        const product = new Product({
            seller: id,
            name,
            description,
            price,
            discountedPrice,
            sizesAvailable,
            colors,
            fitType,
            gender,
            ageRange,
            styleTags,
            stock,
            images: images_urls,
            isFeatured: !!isFeatured, // force Boolean
            returnPolicyDays,
            material,
        });

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product uploaded successfully",
            product,
        });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getSellerProducts = async (req, res) => {
    const id = req.userId;

    try {
        const Prods = await Product.find({ seller: id })
        res.status(200).json({
            message: "Seller Prod Sent Successful",
            success: true,
            prods: Prods
        })
    } catch (error) {
        console.log("Error in getSellerProducts")
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        }
        )
    }
}

export const getSingleProduct = async (req, res) => {
    const id = req.userId;
    const prodId = req.params.id


    try {
        const prod = await Product.findOne({ _id: prodId });
        if (!prod) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product Fetch Successful", product: prod })
    } catch (error) {
        console.log("Error in getSingleProduct");
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })

    }
}

export const updateProduct = async (req, res) => {
    const u_id = req.userId;
    const prod_id = req.params.id

    const data = req.body
    if (!prod_id || !data)
        return res.status(400).json(
            {
                message: "Missing product ID or update data.",
                success: false
            })

    try {
        const updateProd = await Product.findOneAndUpdate({ _id: prod_id, seller: u_id }, data, { new: true });
        if (!updateProd) {
            return res.status(404).json({
                message: "Product not found or you do not have permission to update it.",
                success: false
            });
        }

        const allProd = await Product.find({ seller: u_id })
        res.status(200).json({
            message: "Product Updated Successfully",
            success: true,
            prods: allProd,
            updated_prod: updateProd
        })
    } catch (error) {
        console.log("Error in updateProduct");
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })

    }
}