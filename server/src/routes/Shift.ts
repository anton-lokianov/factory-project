import express from "express";
import { verifyToken } from "../middlewares/Auth";
import {
  getAllShifts,
  createShift,
  getShiftEmployees,
} from "../controllers/shift";

const router = express.Router();

router.get("/", verifyToken, getAllShifts);
router.post("/", verifyToken, createShift);
router.get("/:id/employees", verifyToken, getShiftEmployees);

export default router;
