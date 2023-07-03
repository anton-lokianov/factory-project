import { Request, Response } from "express";
import { Department, Employee } from "../models/Factory";

// GET /departments
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find();

    res.status(200).json(departments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /departments
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, manager } = req.body;

    // Check if department with the same name already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ error: "Department already exists" });
    }

    const newDepartment = new Department({ name, manager });
    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /departments/:id
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, manager } = req.body;

    const employee = await Employee.findById(manager);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    department.manager = manager;
    department.name = name;
    const updatedDepartment = await department.save();

    res.status(200).json(updatedDepartment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /departments/:id
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Check if the department has any employees
    const employeesInDepartment = await Employee.countDocuments({
      departmentId: id,
    });
    if (employeesInDepartment > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete department with employees" });
    }

    await department.deleteOne();

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
