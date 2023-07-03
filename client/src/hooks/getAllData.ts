import { getAllEmployeesAction } from "../redux/EmployeeReducer";
import { store } from "../redux/Store";
import {
  fetchGetAllDepartments,
  fetchGetAllEmployees,
  fetchShifts,
} from "../utils/fetchData";
import { getAllDepartmentsAction } from "../redux/DepartmentReducer";
import { getAllShiftsAction } from "../redux/ShiftReducer";

export const useGetAllData = () => {
  const getAllEmployees = async () => {
    try {
      const response = await fetchGetAllEmployees();
      store.dispatch(getAllEmployeesAction(response));
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartments = () => {
    fetchGetAllDepartments()
      .then((response) => {
        store.dispatch(getAllDepartmentsAction(response));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllShifts = () => {
    fetchShifts()
      .then((response) => {
        store.dispatch(getAllShiftsAction(response));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  return { getAllEmployees, getDepartments, getAllShifts };
};
