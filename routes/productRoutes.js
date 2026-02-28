import express from 'express';
import {
    getProducts,
    getProductBySlug,
    createProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:slug').get(getProductBySlug);

export default router;
