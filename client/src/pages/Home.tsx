import { useSelector } from "react-redux";
import { RootState, store } from "../redux/Store";
import { useGetAllData } from "../hooks/getAllData";
import { get } from "http";
import { useEffect } from "react";

const Home = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const { getAllEmployees, getDepartments, getAllShifts } = useGetAllData();
  const employeesState = store.getState().employees.employees;
  const departmentsState = store.getState().departments.departments;
  const shiftsState = store.getState().shifts.allShifts;

  useEffect(() => {
    if (departmentsState.length < 1) {
      getDepartments();
    }
    if (shiftsState.length < 1) {
      getAllShifts();
    }
    if (employeesState.length < 1) {
      getAllEmployees();
    }
  }, []);

  console.log(user);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
