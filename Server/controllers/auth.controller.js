import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, send2FAVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail, changeEmailVerification } from '../mailtrap/emails.js'
import crypto from 'crypto'
import cloudinary from '../utils/cloudinary.config.js';
import { Order } from '../models/orders.model.js';
import mongoose from 'mongoose';
import { response } from 'express';
import { Product } from '../models/product.model.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            if (!email) {
                throw new Error("All fields are required email")
            }
            if (!password) {
                throw new Error(`All fields are required password ${email}`)
            }
            if (!name) {
                throw new Error("All fields are required name")
            }
        }

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User Already Exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10) //10 = salt
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User(
            {
                email,
                password: hashedPassword,
                name,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 3600 * 1000 //24 hours
            }
        )

        await user.save() //adding entry in db

        //jwt 
        generateTokenAndSetCookie(res, user._id)

        //sending verificationEmail
        await sendVerificationEmail(user.email, user.verificationToken);

        res.status(200).json({
            success: true,
            message: "User Created",
            user: {
                ...user._doc,
                // user._doc is the raw plain object that contains just the data from the database, without all the Mongoose methods.
                // user is a Mongoose Document object, not a plain JavaScript object. That means it comes with a lot of Mongoose-specific properties and methods (like .save(), .populate(), etc.)
                password: null
            }
        })


    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save();

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
            user: {
                ...user._doc,
                password: null
            }
        })

    }
    catch (error) {
        console.log("Error in verify email", error);

        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: " Invalid Credentials" })
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: " Invalid Credentials" })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()

        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error in Login", error);
        res.status(400).json({ success: false, message: error.message })

    }
}

export const logout = async (req, res) => {
    res.clearCookie("authToken")
    res.status(200).json({ success: true, message: "Logged Out Successfully" })
}

export const deleteAccount = async (req, res) => {
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid User Id" })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Doesn't exist" })
        }
        await User.deleteOne({ _id: userId });
        if (user.isSeller) {
            await Product.deleteMany({ seller: user._id })
        }
        res.clearCookie("authToken")
        return res.status(200).json({ success: true, message: "Account Deleted Successfully" })

    } catch (error) {
        console.log("Error in deleteAccount", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}



export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: " User Not Found" })
        }

        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpires = Date.now() + 1 + 3600 * 1000 //1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpires

        await user.save()

        //send mail
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({ success: true, message: "Password reset link sent to your email" })
    } catch (error) {
        console.log("Error in forgotPassword", error);

        res.status(400).json({ success: false, message: error.message })

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        sendResetSuccessEmail(user.email)
        res.status(200).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({ success: false, message: error.message })

    }
}

export const checkAuth = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")

        if (!user) return res.status(400).json({ success: false, message: "User not found" })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({ success: false, message: error.message })

    }
}

export const saveUserImage = async (req, res) => {
    try {
        const { image } = req.body;
        const userId = req.userId;

        if (!image) {
            res.status(400).json({ success: false, message: "Profile Pic is required" })
        }
        const response = await cloudinary.uploader.upload(image);

        const updateUser = await User.findByIdAndUpdate(userId, { userImage: response.secure_url }, { new: true })


        res.status(200).json({ success: true, message: "User Image Uploaded Successfully", user: updateUser });
    } catch (error) {
        console.log("Error in saveUserImage", error);
        res.status(500).json("Internal Server Error")


    }
}

export const saveOnboardData = async (req, res) => {
    try {

        const { image, phone, address, bodyType, goals, gender, ageRange, preferredClothingStyle, favColor, fitType, skintone } = req.body;
        const userId = req.userId;
        if (!image) {
            res.status(400).json({ success: false, message: "Profile Pic is required" })
        }
        console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        const response = await cloudinary.uploader.upload(image);


        const normalizedRange = ageRange.replace(/[–-]/, '-');
        const [minAge, maxAge] = normalizedRange.split('-').map(Number);

        const updateUser = await User.findByIdAndUpdate(userId, {
            userImage: response.secure_url,
            bodyType,
            phone,
            goals,
            gender,
            ageRange,
            minAge: minAge,
            maxAge: maxAge,
            preferredClothingStyle,
            favColor,
            fitType,
            address,
            skintone,
            $push: {
                notifications: {
                    message: `🎉 You’ve successfully completed onboarding!`,
                    msgType: "admin"
                }
            }
        }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Onboarding data saved successfully",
            user: updateUser
        });


    } catch (error) {
        console.log("Error in saveOnboardData", error);
        res.status(500).json("Internal Server Error")
    }

}

export const getSalesData = async (req, res) => {
    const id = req.userId;

    try {
        const sellerSalesItems = await Order.aggregate(
            [
                { $unwind: "$items" },
                {
                    $lookup: {
                        from: 'products',
                        localField: "items.productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                { $unwind: "$productDetails" },
                {
                    $match: {
                        "productDetails.seller": new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $project: {
                        orderId: "$_id",           // Rename _id to orderId
                        buyer: "$user",            // Rename user to buyer
                        item: "$items",            // Include the item from the order
                        product: {                 // Include selected fields from productDetails
                            _id: "$productDetails._id",
                            name: "$productDetails.name",
                            price: "$productDetails.price",
                            discountedPrice: "$productDetails.discountedPrice"
                        },
                        totalAmount: 1,            // Include totalAmount as-is
                        status: 1,                 // Include status as-is
                        paymentStatus: 1,          // Include paymentStatus as-is
                        createdAt: 1               // Include createdAt as-is
                    }
                }

            ]
        )

        res.status(200).json({ success: true, message: "Data Fetched Successfully", sellerSalesItems })

    } catch (error) {
        console.log("Error in the getSalesData", error);
        console.log("Error Message  : ", error.message);

        res.status(500).json({ success: false, message: error.message })
    }
}



export const markNotificationRead = async (req, res) => {
    const id = req.userId;

    if (!id) {
        return res.status(404).json({ success: false, message: "No User Id Found" })
    }
    try {

        const updateUser = await User.findByIdAndUpdate(id,
            {
                $set: {
                    "notifications.$[elem].isRead": true
                }
            },
            {
                arrayFilters: [{ "elem.isRead": false }],
                new: true
            }
        );
        res.status(200).json({ success: true, message: "All marked as read", updateUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Error in markNotificationRead" })
    }
}

export const updateUserProfile = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(404).json({ success: false, message: "No User Id Found" })
    }
    try {
        const { image, imageChanged, name, gender, ageRange, bodyType, preferredClothingStyle, favColor, address, skintone, phone } = req.body;

        if (imageChanged) {
            const response = await cloudinary.uploader.upload(image);
        }
        let minAge = null;
        let maxAge = null;

        if (typeof ageRange === "string") {
            const normalizedRange = ageRange.replace(/[–—]/, '-');

            if (normalizedRange.includes('-')) {
                const [minStr, maxStr] = normalizedRange.split('-').map(s => s.trim());
                const minParsed = Number(minStr);
                const maxParsed = Number(maxStr);

                if (!isNaN(minParsed)) minAge = minParsed;
                if (!isNaN(maxParsed)) maxAge = maxParsed;
            } else {
                // Handle cases like "Under 18"
                const numberMatch = ageRange.match(/\d+/);
                if (numberMatch) {
                    minAge = 0;
                    maxAge = Number(numberMatch[0]);
                }
            }
        }
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: {
                userImage: imageChanged ? response.secure_url : image,
                name,
                gender,
                ageRange,
                bodyType,
                phone,
                preferredClothingStyle,
                favColor,
                address,
                skintone,
                minAge: minAge,
                maxAge: maxAge,
            }
        }, { new: true })
        res.status(200).json({ success: true, message: "Profile Updated Successfully", user: updateUser })
    } catch (error) {
        console.log("Error in update user", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}

export const changePassword = async (req, res) => {
    const userId = req.userId;
    console.log(req.body);

    const { currentPassword, newPassword } = req.body;

    const getUser = await User.findById(userId);

    if (!getUser) {
        return res.status(404).json({ success: false, message: "User Doesn't exist" })
    }

    try {
        const isValidPassword = await bcryptjs.compare(currentPassword, getUser.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" })
        }

        const isSamePassword = await bcryptjs.compare(newPassword, getUser.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: "New password must be different from the current password" });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        getUser.password = hashedPassword;
        await getUser.save();
        sendResetSuccessEmail(getUser.email);

        res.status(200).json({ success: true, message: "Password Changed Successfully" })

    } catch (error) {
        console.log("Error in changePassword", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const toggle2FA = async (req, res) => {
    const userId = req.userId;

    try {
        const getUser = await User.findById(userId);

        if (!getUser) {
            return res.status(404).json({ success: false, message: "User Doesn't exist" })
        }
        getUser.is2FA = !getUser.is2FA;
        await getUser.save();

        res.status(200).json({ success: true, message: `2FA is turned ${getUser.is2FA ? "ON" : "OFF"}`, updatedUser: getUser })
    } catch (error) {
        console.log("Error in toggle2FA", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const checkLoginCredentials = async (req, res) => {
    const { email, password } = req.body;

    try {
        const getUser = await User.findOne({ email });
        if (!getUser) {
            return res.status(400).json({ success: false, message: " Invalid Credentials" })
        }

        const isPasswordValid = await bcryptjs.compare(password, getUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: " Invalid Credentials" })
        }

        if (getUser.is2FA == true) {
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            getUser.verificationToken = verificationToken;
            getUser.verificationTokenExpiresAt = Date.now() + 24 * 3600 * 1000; //valid for 24 hours

            await getUser.save();

            await send2FAVerificationEmail(getUser.email, getUser.verificationToken)
        }



        res.status(200).json({ success: true, message: "Credentials Verified", user: getUser.is2FA ? getUser : null })
    } catch (error) {
        console.log("Error in checkLoginCredentials", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}

export const verify2FAEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const getUser = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!getUser) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        getUser.verificationToken = undefined
        getUser.verificationTokenExpiresAt = undefined
        generateTokenAndSetCookie(res, getUser._id)

        getUser.lastLogin = new Date()
        await getUser.save();
        res.status(200).json({ success: true, message: "Logged in Successfully", updatedUser: getUser })
    } catch (error) {
        console.log("Error in verify2FAEMail", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}


export const changeEmailCheckPassword = async (req, res) => {
    const userId = req.userId;
    const { newEmail, password } = req.body;

    try {
        const isEmailExistAlready = await User.findOne({ email: newEmail });
        if (isEmailExistAlready) {
            return res.status(409).json({ success: false, message: "Email Already Exists" })
        }
        const getUser = await User.findById(userId);
        if (!getUser) {
            return res.status(400).json({ success: false, message: "User Doesn't Exist" });
        }
        const isCorrectPassword = await bcryptjs.compare(password, getUser.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ success: false, message: "Incorrect Password" })
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        getUser.verificationToken = verificationToken;
        getUser.verificationTokenExpiresAt = Date.now() + 24 * 3600 * 1000; //valid for 24 hours
        getUser.pendingMail = newEmail;

        await getUser.save();

        changeEmailVerification(newEmail, getUser.verificationToken)
        res.status(200).json({ success: true, message: "Please Check Your Mail and enter verification code" })
    } catch (error) {
        console.log("Error in changeEmailCheckPassword", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const newEmailVerification = async (req, res) => {
    const userId = req.userId;
    const { code, newEmail } = req.body;


    try {
        const getUser = await User.findOne({
            _id: userId,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!getUser) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        if (getUser.pendingMail !== newEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }


        getUser.verificationToken = undefined
        getUser.verificationTokenExpiresAt = undefined
        getUser.email = newEmail
        getUser.pendingMail = null
        await getUser.save();
        res.status(200).json({ success: true, message: "Email Changed Successfully", updatedUser: getUser });


    } catch (error) {
        console.log("Error in new Email Verification", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}