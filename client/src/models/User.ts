export interface User {
  id: string;
  fullName: string;
  userName: string;
  password?: string;
  numOfActions: number;
  isAdmin: boolean;
}
