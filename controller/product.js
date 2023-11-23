import mongoose from 'mongoose'
import { isValidObjectId } from 'mongoose'
import { helperMessage } from '../middleware/helperMessage.js'
import Product from '../models/productSchema.js'

// @desc  Fetch all product
// @route  GET /api/products
// @access  public
export const getProducts = async (req, res) => {
    const pageSize = 8;
    const pageNo = Number(req.query.pageNo) || 1;

    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (pageNo - 1))
    res.status(200).json({products, pageNo, pages: Math.ceil(count / pageSize)})
}

// @desc  Fetch all product
// @route  GET /api/products/allproducts
// @access  public
export const getAllProducts = async (req, res) => {
    const allProducts = await Product.find()
    if (!allProducts) return helperMessage(res, "Products not found", 404)
    res.status(200).json(allProducts)
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

// @desc  Add product
// @route  POST /api/products
// @access  private/protect
export const createProduct = async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createProduct = await product.save();

    res.status(201).json(createProduct)

}

// @desc  Add product
// @route  PUT /api/products/:id
// @access  private/protect
export const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return helperMessage(res, 'Product Not Found')

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct);
}

// @desc  Delete a product
// @route  DELETE /api/products/:id
// @access  Private/Protect
export const deleteProduct = async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) return helperMessage(res, "Invalid ID")
    await Product.findByIdAndDelete(id)
    res.status(200).json({message: "Item deleted!"})
}

// @desc  Create a new review
// @route  POST /api/products/:id/reviews
// @access  Protect
export const createProductReview = async (req, res) => {
    const { rating, comment } = req.body
    const { id } = req.params
    if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

    const product = await Product.findById(id)
    if (!product) return helperMessage(res, "Product not found")

    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
    if (alreadyReviewed) return helperMessage(res, "Already reviewed")

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({message: 'Review added'})
}

// @desc  Create a new review
// @route  PUT /api/products/:id/reviews
// @access  Protect
export const updateProductReview = async (req, res) => {
    const { rating, comment } = req.body
    const { id } = req.params
    if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

    const product = await Product.findById(id)
    if (!product) return helperMessage(res, "Product not found")

    const previousReview = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
    if (!previousReview) return helperMessage(res, "Review not found")

    const { rating: preRating, comment: preComment } = previousReview

    const updatedReview = {
        name: req.user.name,
        rating: Number(rating) || Number(preRating),
        comment: comment || preComment,
        user: req.user._id
    }

    product.reviews = [...product.reviews.map((review) => review.user.toString() === req.user._id.toString() ? updatedReview : review)]

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({message: 'Review updated'})
}

// @desc  Create a new review
// @route  DELETE /api/products/:id/reviews
// @access  Protect
export const deleteProductReview = async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

    const product = await Product.findById(id)
    if (!product) return helperMessage(res, "Product not found")

    const previousReview = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
    if (!previousReview) return helperMessage(res, "Review not found")

    product.reviews = [...product.reviews.filter((review) => review.user.toString() !== req.user._id.toString())];

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({message: 'Review deleted'})
}

// @desc  Get top products
// @route  GET /api/products/top
// @access  public
export const getTopProduct = async (req, res) => {
    const topProducts = await Product.find().sort({ rating: -1 }).limit(3)
    if (!topProducts) return helperMessage(res, "Products not found!", 404)

    res.status(200).json(topProducts)
}