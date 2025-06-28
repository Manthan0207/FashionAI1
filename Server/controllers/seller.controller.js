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
