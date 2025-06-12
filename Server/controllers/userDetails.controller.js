// import { User } from "../models/user.model";

// export const getUserImage = async (req, res) => {
//     const id = req.userId;

//     try {
//         if (!id) return res.status(400).json({ success: false, message: "Expired or Invalid Token" });

//         const user = await User.findById(id);

//         const imageURL = user.userImage;

//     } catch (error) {

//     }

// }