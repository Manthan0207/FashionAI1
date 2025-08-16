import express from 'express'
import { signup, login, getSalesData, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, saveUserImage, saveOnboardData, markNotificationRead, updateUserProfile, changePassword, toggle2FA, checkLoginCredentials, verify2FAEmail, changeEmailCheckPassword, newEmailVerification, deleteAccount } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const app = express()

const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)

router.post('/signup', signup)

router.post('/check-login-credentials', checkLoginCredentials)

router.post('/verify-2FA-email', verify2FAEmail)

router.post('/login', login)

router.post('/logout', logout)

router.post('/delete-account', verifyToken, deleteAccount)

router.post('/verify-email', verifyEmail)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

router.put('/save-user-image', verifyToken, saveUserImage)

router.put('/save-onboarding-data', verifyToken, saveOnboardData)

router.get('/seller-data', verifyToken, getSalesData)

router.put('/mark-notification-read', verifyToken, markNotificationRead)

router.put('/update-profile', verifyToken, updateUserProfile)

router.post('/change-password', verifyToken, changePassword)

router.post('/toggle-2FA', verifyToken, toggle2FA)

router.post('/change-email-validation', verifyToken, changeEmailCheckPassword)
router.post('/new-email-verification', verifyToken, newEmailVerification)

export default router