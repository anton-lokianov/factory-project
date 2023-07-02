export interface Shift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  employeeIds: string[]; // Array of employee IDs assigned to the shift
  employeeNames: string[]; // Add this property
}
