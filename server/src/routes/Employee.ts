import express from "express";
import { verifyToken } from "../middlewares/Auth";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeShifts,
  addShiftToEmployee,
} from "../controllers/employee";

const router = express.Router();

router.get("/", verifyToken, getAllEmployees);
router.post("/", verifyToken, createEmployee);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee);
router.get("/:id/shifts", verifyToken, getEmployeeShifts);
router.post("/:id/shifts", verifyToken, addShiftToEmployee);

export default router;
