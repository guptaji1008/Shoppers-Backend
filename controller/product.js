import { helperMessage } from '../middleware/helperMessage.js'
import Product from '../models/productSchema.js'

// @desc  Fetch all product
// @route  GET /api/products
// @access  public
export const getProducts = async (req, res) => {
    const products = await Product.find()
    res.status(200).json(products)
}

// @desc  Fetch all product
// @route  GET /api/products/:id
// @access  public
export const getSingleProduct = async (req, res) => {
    const {id} = req.params
    const product = await Product.findById(id)
    if (!product) return helperMessage(res, "Not found", 404)
    res.json(product)
}