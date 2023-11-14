import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controller/userController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route("/").post(asyncHandler(registerUser)).get(protect, admin,asyncHandler(getUsers));

router.post("/logout", asyncHandler(logOutUser));

router.post("/login", asyncHandler(authUser));

router
  .route("/profile")
  .get(protect, asyncHandler(getUserProfile))
  .put(protect, asyncHandler(updateUserProfile));

router
  .route("/:id")
  .delete(protect, admin, asyncHandler(deleteUser))
  .get(protect, admin, asyncHandler(getUserById))
  .put(protect, admin, asyncHandler(updateUser));

export default router;
