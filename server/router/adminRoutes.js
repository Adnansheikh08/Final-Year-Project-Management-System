import express from "express";
import multer from "multer";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
import {
  createStudent,
  deleteStudent,
  updateStudent,
  getAllUser,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/adminController.js";
import { get } from "mongoose";
const router = express.Router();

//Student Routes

router.post(
  "/create-student",
  isAuthenticated,
  isAuthorized("Admin"),
  createStudent,
);

router.put(
  "/update-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateStudent,
);

router.delete(
  "/delete-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteStudent,
);

//teacher Routes
router.post(
  "/create-teacher",
  isAuthenticated,
  isAuthorized("Admin"),
  createTeacher,
);

router.put(
  "/update-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateTeacher,
);

router.delete(
  "/delete-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTeacher,
);

//Get all users

router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUser);

export default router;
