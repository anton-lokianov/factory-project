import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fullName: string;
  userName: string;
  password?: string;
  numOfActions: number;
  isAdmin: boolean;
}

interface IDepartment extends Document {
  name: string;
  manager: Schema.Types.ObjectId;
}

interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  startWorkYear: number;
  departmentId: Schema.Types.ObjectId;
}

interface IShift extends Document {
  date: Date;
  startTime: number;
  endTime: number;
  employeeIds: Schema.Types.ObjectId[];
}

interface IEmployeeShift extends Document {
  employeeId: Schema.Types.ObjectId;
  shiftId: Schema.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true, min: 2, max: 50 },
  userName: { type: String, required: true, unique: true, min: 2, max: 50 },
  password: { type: String, required: true, min: 2, max: 50 },
  numOfActions: { type: Number, default: 10 },
  isAdmin: { type: Boolean, default: false },
});

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  manager: { type: Schema.Types.ObjectId, ref: "Employee" },
});

const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  startWorkYear: { type: Number, required: true },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const ShiftSchema: Schema = new Schema({
  date: { type: Date, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
});

const EmployeeShiftSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  shiftId: { type: Schema.Types.ObjectId, ref: "Shift", required: true },
});

export const Shift = mongoose.model<IShift>("Shift", ShiftSchema);
export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);
export const Department = mongoose.model<IDepartment>(
  "Department",
  DepartmentSchema
);
export const User = mongoose.model<IUser>("User", UserSchema);
export const EmployeeShift = mongoose.model<IEmployeeShift>(
  "EmployeeShift",
  EmployeeShiftSchema
);
