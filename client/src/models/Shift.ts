export interface Shift {
  _id: string;
  date: Date;
  startTime: number;
  endTime: number;
  employeeIds: string[]; // Array of employee IDs assigned to the shift
}
