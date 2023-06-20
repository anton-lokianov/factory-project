import express from "express";
import { verifyToken } from "../middlewares/Auth";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/Department";

const router = express.Router();

router.post("/", verifyToken, createDepartment);
router.get("/", verifyToken, getAllDepartments);
router.put("/:id", verifyToken, updateDepartment);
router.delete("/:id", verifyToken, deleteDepartment);

export default router;
