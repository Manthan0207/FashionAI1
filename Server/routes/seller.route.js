import express from 'express'
import { becomeSeller, addProduct } from '../controllers/seller.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const app = express()

const router = express.Router()


router.post('/become-seller', verifyToken, becomeSeller)

router.post('/add-product', verifyToken, addProduct)

export default router;