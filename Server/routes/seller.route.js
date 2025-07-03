import express from 'express'
import { becomeSeller, addProduct, getSellerProducts, getSingleProduct, updateProduct } from '../controllers/seller.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const app = express()

const router = express.Router()


router.post('/become-seller', verifyToken, becomeSeller)

router.post('/add-product', verifyToken, addProduct)

router.get('/get-seller-prods', verifyToken, getSellerProducts)

router.get('/product/:id', verifyToken, getSingleProduct)

router.patch('/update-product/:id', verifyToken, updateProduct)

export default router;