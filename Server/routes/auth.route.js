import express from 'express'
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, saveUserImage } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const app = express()

const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/verify-email', verifyEmail)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

router.put('/save-user-image', verifyToken, saveUserImage)


export default router