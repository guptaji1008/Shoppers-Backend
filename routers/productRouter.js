import express from "express"
import asyncHandler from "../middleware/asyncHandler.js"
import { getProducts, getSingleProduct } from "../controller/product.js"
const router = express.Router()

router.get('/', asyncHandler(getProducts))

router.get('/:id', asyncHandler(getSingleProduct))

export default router