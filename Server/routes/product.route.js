import express from 'express'
import { getProducts } from '../controllers/product.controller.js';

const app = express();

const route = express.Router();


route.get('/get-products', getProducts)


export default route;