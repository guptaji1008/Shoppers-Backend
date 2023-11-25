import { isValidObjectId } from 'mongoose'
import { helperMessage } from '../middleware/helperMessage.js'
import User from '../models/userSchema.js'
import generateToken from '../utils/generateToken.js'

// @desc  Auth user & get token
// @route  POST /api/users/login
// @access  Public

export const authUser = async (req, res) => {
  const { email, password } = req.body
  
  const user = await User.findOne({email})
  if (!user) return helperMessage(res, 'Invalid email or password!')

  const isCorrectPass = await user.comparePassword(password)
  if (!isCorrectPass) return helperMessage(res, 'Invalid email or password!')

  generateToken(res, user._id)

  res.json({
    userId: user._id,
    name: user.name,
    email: user.email, 
    isAdmin: user.isAdmin
  })

}

// @desc  Register user
// @route  POST /api/users
// @access  Public

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  
  const userExist = await User.findOne({email})
  if (userExist) return helperMessage(res, 'User already exist', 400)

  const newUser = new User({ name, email, password, isAdmin: false })
  await newUser.save()

  generateToken(res, newUser._id)

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin
  })
}

// @desc  Logout user / clear cookie
// @route  POST /api/users/logout
// @access  Private

export const logOutUser = async (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({ message: "Logged out successfully" })  
}

// @desc  Get user profile
// @route  GET /api/users/profile
// @access  Public

export const getUserProfile = async (req, res) => {
  const { user } = req
  if (!user) return helperMessage(res, "User not found!")
  res.status(200).json({
    userId: user._id,
    name: user.name,
    email: user.email, 
    isAdmin: user.isAdmin
  })  
}

// @desc  Update user profile
// @route  PUT /api/users/profile
// @access  Private

export const updateUserProfile = async (req, res) => {
  let { user, body } = req
  if (!user) return helperMessage(res, "User not found!")
  user = await User.findById(user._id)
  const { name, email, password } = body
  user.name = name || user.name
  user.email = email || user.email
  if (password) {
    user.password = password
  }
  console.log(user)
  const updatedUser = await user.save()

  res.status(201).json({
    userId: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email, 
    isAdmin: updatedUser.isAdmin
  })
}

// @desc  Get users
// @route  GET /api/users
// @access  Private/admin

export const getUsers = async (req, res) => {
  const users = await User.find()
  if (!users) return helperMessage(res, "No Users!", 404)
  res.status(200).json(users)  
}

// @desc  Get user by Id
// @route  GET /api/users/:id
// @access  Private/admin

export const getUserById = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

  const user = await User.findById(id)
  if (!user) return helperMessage(res, "User not found", 404)
  
  res.status(200).json(user)
}

// @desc  Delete user
// @route  DELETE /api/users/:id
// @access  Private/admin

export const deleteUser = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

  const user = await User.findById(id)
  if (!user) return helperMessage(res, "User nor found", 404)
  if (user && user.isAdmin) return helperMessage(res, "Cannot delete admin user", 400)

  await User.deleteOne({ _id: user._id })

  res.status(200).send("Deleted successfully!")
}

// @desc  Update user
// @route  PUT /api/users/:id
// @access  Private/admin

export const updateUser = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) return helperMessage(res, "Invalid Id")

  const user = await User.findById(id)
  if (!user) return helperMessage(res, "User nor found", 404)

  const { name, email, isAdmin } = req.body
  console.log(isAdmin)

  user.name = name || user.name;
  user.email = email || user.email;
  if (isAdmin === "notAdmin") {
    user.isAdmin = false
  } else if (isAdmin === 'admin') {
    user.isAdmin = true
  } else {
    user.isAdmin = user.isAdmin
  }

  const updatedUser = await user.save()

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin
  })
}