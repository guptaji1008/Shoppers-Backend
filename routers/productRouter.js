import express from "express"
import asyncHandler from "../middleware/asyncHandler.js"
import { changeImage, createProduct, createProductReview, deleteProduct, deleteProductReview, getAllProducts, getProducts, getSingleProduct, getTopProduct, updateProduct, updateProductReview } from "../controller/product.js"
import { protect, admin } from '../middleware/authMiddleware.js'
import { upload } from "../utils/multer.js"
const router = express.Router()

router.route('/').get(asyncHandler(getProducts)).post(protect, admin, asyncHandler(createProduct))

router.get('/allproducts', asyncHandler(getAllProducts))

router.get("/top", asyncHandler(getTopProduct))

router.route('/:id').get(asyncHandler(getSingleProduct)).put( protect, admin, asyncHandler(updateProduct)).delete(protect, admin, asyncHandler(deleteProduct))

router.put('/:id/image', upload.single('productImage'), protect, admin, asyncHandler(changeImage))

router.route('/:id/reviews').post(protect, asyncHandler(createProductReview)).put(protect, asyncHandler(updateProductReview)).delete(protect, asyncHandler(deleteProductReview));

export default router