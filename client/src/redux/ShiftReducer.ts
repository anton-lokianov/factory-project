import { Shift } from "../models/Shift";

export interface ShiftState {
  allShifts: Shift[];
}

export enum ShiftActionType {
  getAllShifts = "getAllShifts",
  addShift = "addShift",
}

export interface ShiftAction {
  type: ShiftActionType;
  payload?: any;
}

export const getAllShiftsAction = (shifts: Shift[]): ShiftAction => {
  return { type: ShiftActionType.getAllShifts, payload: shifts };
};

export const addShiftAction = (shift: Shift): ShiftAction => {
  return { type: ShiftActionType.addShift, payload: shift };
};

export const shiftReducer = (
  currentState: ShiftState = { allShifts: [] },
  action: ShiftAction
): ShiftState => {
  const state = { ...currentState };

  switch (action.type) {
    case ShiftActionType.getAllShifts:
      state.allShifts = action.payload;
      break;

    case ShiftActionType.addShift:
      state.allShifts.push(action.payload);
      break;

    default:
      return currentState;
  }

  return state;
};
