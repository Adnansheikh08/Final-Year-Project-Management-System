import express from "express";
import { forgotPassword, getUser, login, logout, registerUser, resetPassword } from "../controllers/authController.js";
import multer from "multer";
import  {isAuthenticated}  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", isAuthenticated , getUser);
router.get("/logout", isAuthenticated , logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);


export default router;