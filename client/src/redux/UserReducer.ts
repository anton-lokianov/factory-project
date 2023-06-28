import { User } from "../models/User";

export interface UserState {
  user: User | null;
  allUsers: User[];
  token: string | null;
  isAdmin?: boolean;
}

export enum UserActionType {
  updateUser = "updateUser",
  getAllUsers = "getAllUsers",
  deleteUser = "deleteUser",
  addUser = "addUser",
  setLogout = "setLogout",
  setIsAdmin = "setIsAdmin",
  setLogin = "setLogin",
}

export interface UserAction {
  type: UserActionType;
  payload?: any;
}

export const updateUserAction = (user: User): UserAction => {
  return { type: UserActionType.updateUser, payload: user };
};

export const getAllUsersAction = (users: User[]): UserAction => {
  return { type: UserActionType.getAllUsers, payload: users };
};

export const deleteUserAction = (id: string): UserAction => {
  return { type: UserActionType.deleteUser, payload: id };
};

export const addUserAction = (user: User): UserAction => {
  return { type: UserActionType.addUser, payload: user };
};

export const setLogoutAction = (): UserAction => {
  return { type: UserActionType.setLogout };
};

export const setIsAdminAction = (isAdmin: boolean): UserAction => {
  return { type: UserActionType.setIsAdmin, payload: isAdmin };
};

export const setLoginAction = (user: User, token: string): UserAction => {
  return { type: UserActionType.setLogin, payload: { user, token } };
};

export const userReducer = (
  currentState: UserState = {
    user: null,
    allUsers: [],
    token: null,
  },
  action: UserAction
): UserState => {
  const newState = { ...currentState };

  switch (action.type) {
    case UserActionType.updateUser:
      newState.user = action.payload;
      break;

    case UserActionType.getAllUsers:
      newState.allUsers = action.payload.filter((user: any) => !user.isAdmin);
      break;

    case UserActionType.deleteUser:
      newState.allUsers = newState.allUsers.filter(
        (user) => user._id !== action.payload
      );
      break;

    case UserActionType.addUser:
      newState.allUsers = [...newState.allUsers, action.payload];
      break;

    case UserActionType.setLogout:
      newState.user = null;
      newState.token = null;
      break;

    case UserActionType.setIsAdmin:
      newState.isAdmin = action.payload;
      break;

    case UserActionType.setLogin:
      newState.user = action.payload.user;
      newState.token = action.payload.token;
      break;

    default:
      return currentState;
  }

  return newState;
};
