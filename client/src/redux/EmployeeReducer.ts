import { Employee } from "../models/Employee";

export interface EmployeeState {
  employees: Employee[];
}

export enum EmployeeActionType {
  getAllEmployees = "getAllEmployees",
  addEmployee = "addEmployee",
  updateEmployee = "updateEmployee",
  deleteEmployee = "deleteEmployee",
}

export interface EmployeeAction {
  type: EmployeeActionType;
  payload?: any;
}

export const getAllEmployeesAction = (
  employees: Employee[]
): EmployeeAction => {
  return { type: EmployeeActionType.getAllEmployees, payload: employees };
};

export const addEmployeeAction = (employee: Employee): EmployeeAction => {
  return { type: EmployeeActionType.addEmployee, payload: employee };
};

export const updateEmployeeAction = (employee: Employee): EmployeeAction => {
  return { type: EmployeeActionType.updateEmployee, payload: employee };
};

export const deleteEmployeeAction = (id: string): EmployeeAction => {
  return { type: EmployeeActionType.deleteEmployee, payload: id };
};

export const employeeReducer = (
  currentState: EmployeeState = { employees: [] },
  action: EmployeeAction
): EmployeeState => {
  const state = { ...currentState };

  switch (action.type) {
    case EmployeeActionType.getAllEmployees:
      state.employees = action.payload;
      break;

    case EmployeeActionType.addEmployee:
      state.employees = [...state.employees, action.payload];
      break;

    case EmployeeActionType.updateEmployee:
      state.employees = state.employees.map((employee) =>
        employee._id === action.payload._id ? action.payload : employee
      );
      break;

    case EmployeeActionType.deleteEmployee:
      state.employees = state.employees.filter(
        (employee) => employee._id !== action.payload
      );
      break;

    default:
      return currentState;
  }
  return state;
};
