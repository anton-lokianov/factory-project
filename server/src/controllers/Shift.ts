import { Request, Response } from "express";
import { Shift, Employee } from "../models/Factory";

// GET /shifts
export const getAllShifts = async (req: Request, res: Response) => {
  try {
    const shifts = await Shift.find().populate("employeeIds");
    res.status(200).json(shifts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /shifts
export const createShift = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, employeeIds } = req.body;

    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      return res.status(404).json({ error: "One or more employees not found" });
    }

    const newShift = new Shift({
      date,
      startTime,
      endTime,
      employeeIds,
    });
    const savedShift = await newShift.save();

    // add shiftId to the shiftIds array of each employee
    await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $push: { shiftIds: savedShift._id } }
    );

    res.status(201).json(savedShift);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /shifts/:id/employees
export const getShiftEmployees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    const employees = await Employee.find({ _id: { $in: shift.employeeIds } });
    res.status(200).json(employees);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
