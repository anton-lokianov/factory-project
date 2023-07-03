import { Request, Response } from "express";
import { Shift, Employee } from "../models/Factory";

// GET /shifts
export const getAllShifts = async (req: Request, res: Response) => {
  try {
    const shifts = await Shift.find().populate("employeeIds");
    const processedShifts = shifts.map((shift) => {
      const shiftObject = shift.toObject();
      const employeeIds = shiftObject.employeeIds.map((employee: any) =>
        employee._id.toString()
      );
      return {
        ...shiftObject,
        employeeIds,
      };
    });
    res.status(200).json(processedShifts);
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

export const addShiftToEmployee = async (req: Request, res: Response) => {
  try {
    const { shiftId, employeeId } = req.body;

    // Find the employee by ID
    const shift = await Shift.findById(shiftId);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    // Check if the employee already has the shift assigned
    const hasShift = employee.shiftIds.includes(shiftId);
    if (hasShift) {
      return res
        .status(400)
        .json({ error: "Shift already assigned to employee" });
    }

    // Add the shift ID to the employee's shifts array
    shift.employeeIds.push(employeeId);
    employee.shiftIds.push(shiftId);

    // Save the updated employee
    await shift.save();
    await employee.save();

    res.status(200).json({ message: "Shift added to employee successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
