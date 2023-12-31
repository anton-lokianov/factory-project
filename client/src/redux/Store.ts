import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./UserReducer";
import { departmentReducer } from "./DepartmentReducer";
import { shiftReducer } from "./ShiftReducer";
import { employeeReducer } from "./EmployeeReducer";

const userPersistConfig = {
  key: "users",
  storage,
};

const departmentPersistConfig = {
  key: "departments",
  storage,
};

const shiftPersistConfig = {
  key: "shifts",
  storage,
};

const employeePersistConfig = {
  key: "employees",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const persistedDepartmentReducer = persistReducer(
  departmentPersistConfig,
  departmentReducer
);
const persistedShiftsReducer = persistReducer(shiftPersistConfig, shiftReducer);

const persistedEmployeeReducer = persistReducer(
  employeePersistConfig,
  employeeReducer
);

const rootReducer = {
  users: persistedUserReducer,
  departments: persistedDepartmentReducer,
  shifts: persistedShiftsReducer,
  employees: persistedEmployeeReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
