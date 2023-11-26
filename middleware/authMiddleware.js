import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userSchema.js'
import { helperMessage } from './helperMessage.js';

// Protect routes
export const protect = asyncHandler( async (req, res, next) => {
    let token = req.cookies.jwt;
    console.log(req)
    if (!token) return helperMessage(res, 'Not Authorized: No token!')

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId).select('-password');
    if (!user) return helperMessage(res, 'Not Authorized: Invalid token')

    req.user = user
    next()

} )

// Admin middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        helperMessage(res, "Not an admin")
    }
}