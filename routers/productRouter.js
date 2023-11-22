import express from "express"
import asyncHandler from "../middleware/asyncHandler.js"
import { createProduct, createProductReview, deleteProduct, deleteProductReview, getAllProducts, getProducts, getSingleProduct, getTopProduct, updateProduct, updateProductReview } from "../controller/product.js"
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').get(asyncHandler(getProducts)).post(protect, admin, asyncHandler(createProduct))

router.get('/allproducts', asyncHandler(getAllProducts))

router.get("/top", asyncHandler(getTopProduct))

router.route('/:id').get(asyncHandler(getSingleProduct)).put(protect, admin, asyncHandler(updateProduct)).delete(protect, admin, asyncHandler(deleteProduct))

router.route('/:id/reviews').post(protect, asyncHandler(createProductReview)).put(protect, asyncHandler(updateProductReview)).delete(protect, asyncHandler(deleteProductReview));

export default router