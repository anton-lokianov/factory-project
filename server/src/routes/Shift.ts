import express from "express";
import { verifyToken } from "../middlewares/Auth";
import {
  getAllShifts,
  createShift,
  getShiftEmployees,
  addShiftToEmployee,
} from "../controllers/Shift";

const router = express.Router();

router.get("/", verifyToken, getAllShifts);
router.post("/", verifyToken, createShift);
router.get("/:id/employees", verifyToken, getShiftEmployees);
router.post("/addShiftToEmployee", verifyToken, addShiftToEmployee);

export default router;
