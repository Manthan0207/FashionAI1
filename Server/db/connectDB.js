import mongoose from "mongoose"
export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGODB Connected : ${con.connection.host}`);

    } catch (error) {
        console.log("Error while connecting to mongodb", error);
        process.exit(1) //1 failure 0 status code is success
    }
}