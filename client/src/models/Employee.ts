export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  startWorkYear: number;
  departmentId: string; // ID of the department to which the employee belongs
  departmentName?: string;
}
