import express from 'express'
import asyncHandler from '../middleware/asyncHandler.js'
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
} from '../controller/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, asyncHandler(addOrderItems)).get(protect, admin, asyncHandler(getAllOrders))
router.get('/mine', protect, asyncHandler(getMyOrders))
router.get('/:id', protect, asyncHandler(getOrderById))
router.put('/:id/pay', protect, asyncHandler(updateOrderToPaid))
router.put('/:id/deliver', protect, admin,asyncHandler(updateOrderToDelivered))

export default router