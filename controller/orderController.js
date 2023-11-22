import { helperMessage } from '../middleware/helperMessage.js'
import Order from '../models/orderSchema.js'

// @desc Create new order
// @route  POST /api/orders
//@access Private

const addOrderItems = async (req, res) => {
    const {
        orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice
    } = req.body

    if (orderItems && !orderItems.length) return helperMessage(res, "No order items", 400)

    const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x._id,
            _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod, 
        itemsPrice, 
        shippingPrice,
        taxPrice, 
        totalPrice,
        isDelivered: false
    })

    const createOrder = await order.save()

    res.status(201).json(createOrder)

}

// @desc Create logged in user orders
// @route  GET /api/orders/myorders
//@access Private

const getMyOrders = async (req, res) => {
    const myOrders = await Order.find({ user: req.user._id })

    if (!myOrders) return helperMessage(res, "Currently no order", 404)

    res.status(200).json(myOrders)
}

// @desc get order by id
// @route  GET /api/orders/:id
//@access Private

const getOrderById = async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email');
   
   if (!order) return helperMessage(res, "No order found!", 404);

   res.status(200).json(order)
}

// @desc Update order to paid
// @route  PUT /api/orders/:id/pay
//@access Private

const updateOrderToPaid = async (req, res) => {
    
    const order = await Order.findById(req.params.id)
    if (!order) return helperMessage(res, 'Order not found')

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    }

    const updatedOrder = await order.save()

    res.status(201).json(updatedOrder)

}

// @desc Update order to delivered
// @route  PUT /api/orders/:id/deliver
// @access Private/Admin

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) return helperMessage(res, 'No Order Found')

    order.isDelivered = true;
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    res.status(201).json(updatedOrder)
}

// @desc Update order to delivered
// @route  GET /api/orders/:id/deliver
// @access Private/Admin

const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('user', 'id name');
    if (!orders) return helperMessage(res, "No Order Found", 404)
    res.status(200).json(orders)
}

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
};