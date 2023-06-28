export interface User {
  _id: string;
  fullName: string;
  userName: string;
  numOfActions: number;
  isAdmin?: boolean;
}
