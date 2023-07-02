import { Request, Response } from "express";
import { Employee, Department, Shift } from "../models/Factory";

// GET /employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate("departmentId")
      .populate("shiftIds");
    res.status(200).json(employees);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /employees
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, startWorkYear, departmentId } = req.body;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      startWorkYear,
      departmentId,
    });
    const savedEmployee = await newEmployee.save();

    res.status(201).json(savedEmployee);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /employees/:id
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, startWorkYear, departmentId } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.startWorkYear = startWorkYear;
    employee.departmentId = departmentId;

    const updatedEmployee = await employee.save();

    res.status(200).json(updatedEmployee);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /employees/:id
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const shifts = await Shift.updateMany(
      { employeeIds: id },
      { $pull: { employeeIds: id } }
    );

    await employee.deleteOne();

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /employees/:id/shifts
export const getEmployeeShifts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const shifts = await Shift.find({ employeeId: id });
    res.status(200).json(shifts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /employees/:id/shifts
export const addShiftToEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const newShift = new Shift({
      date,
      startTime,
      endTime,
      employeeIds: [id],
    });
    const savedShift = await newShift.save();

    // add shiftId to the employee's shiftIds array
    employee.shiftIds.push(savedShift._id);
    await employee.save();

    res.status(201).json(savedShift);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
