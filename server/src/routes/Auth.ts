import express from "express";
import { createNewUser, login } from "../controllers/auth";
import { verifyToken } from "./../middlewares/Auth";

const router = express.Router();

router.post("/createUser", verifyToken, createNewUser);
router.post("/login", login);

export default router;
