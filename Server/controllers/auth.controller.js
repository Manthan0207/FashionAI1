import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js'
import crypto from 'crypto'
import cloudinary from '../utils/cloudinary.config.js';

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

        const { image, bodyType, goals, gender, ageRange, preferredClothingStyle, favColor, fitType } = req.body;
        const userId = req.userId;
        if (!image) {
            res.status(400).json({ success: false, message: "Profile Pic is required" })
        }
        const response = await cloudinary.uploader.upload(image);

        const normalizedRange = ageRange.replace(/[–-]/, '-');
        const [minAge, maxAge] = normalizedRange.split('-').map(Number);

        const updateUser = await User.findByIdAndUpdate(userId, {
            userImage: response.secure_url,
            bodyType,
            goals,
            gender,
            ageRange,
            minAge: minAge,
            maxAge: maxAge,
            preferredClothingStyle,
            favColor,
            fitType
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