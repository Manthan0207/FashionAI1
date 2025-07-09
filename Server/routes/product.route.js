import express from 'express'
import { getProducts, placeOrder, getAllOrders } from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const app = express();

const route = express.Router();


route.get('/get-products', getProducts)
route.post('/place-order', verifyToken, placeOrder)
route.get('/get-all-orders', verifyToken, getAllOrders)


export default route;
