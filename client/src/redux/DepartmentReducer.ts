import { Department } from "../models/Department";

export interface DepartmentState {
  departments: Department[];
}

export enum DepartmentActionType {
  getAllDepartments = "getAllDepartments",
  addDepartment = "addDepartment",
  updateDepartment = "updateDepartment",
  deleteDepartment = "deleteDepartment",
}

export interface DepartmentAction {
  type: DepartmentActionType;
  payload?: any;
}

export const getAllDepartmentsAction = (
  departments: Department[]
): DepartmentAction => {
  return { type: DepartmentActionType.getAllDepartments, payload: departments };
};

export const addDepartmentAction = (
  department: Department
): DepartmentAction => {
  return { type: DepartmentActionType.addDepartment, payload: department };
};

export const updateDepartmentAction = (
  department: Department
): DepartmentAction => {
  return { type: DepartmentActionType.updateDepartment, payload: department };
};

export const deleteDepartmentAction = (id: string): DepartmentAction => {
  return { type: DepartmentActionType.deleteDepartment, payload: id };
};

export const departmentReducer = (
  currentState: DepartmentState = { departments: [] },
  action: DepartmentAction
): DepartmentState => {
  const state = { ...currentState };

  switch (action.type) {
    case DepartmentActionType.getAllDepartments:
      state.departments = action.payload;
      break;

    case DepartmentActionType.addDepartment:
      state.departments = [...state.departments, action.payload];
      break;

    case DepartmentActionType.updateDepartment:
      state.departments = state.departments.map((department) =>
        department._id === action.payload._id ? action.payload : department
      );
      break;

    case DepartmentActionType.deleteDepartment:
      state.departments = state.departments.filter(
        (department) => department._id !== action.payload
      );
      break;

    default:
      return currentState;
  }
  return state;
};
