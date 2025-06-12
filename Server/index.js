import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
// import userRouter from './routes/userDetails.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config()


const app = express();

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('hi')
})

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //to send cookies in the request from frontend
}))

app.use(express.json()) //allows us to parse incoming requests : req.body
app.use(cookieParser()) //this will allow us to parse incoming cookies(to use cookies in req obj)

app.use("/api/auth", authRoutes)
// app.use("api/user-details", userRouter)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on ${PORT}`);

})

