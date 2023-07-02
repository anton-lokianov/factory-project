import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Box } from "@mui/material";
import { RootState, store } from "../redux/Store";
import { useSelector } from "react-redux";
import AddShiftFormDialog from "../components/AddShiftForm";

import { useEffect } from "react";
import { Shift } from "../models/Shift";
import { getAllShiftsAction } from "../redux/ShiftReducer";
import { fetchShifts } from "../utils/fetchData";
import { Employee } from "../models/Employee";

interface ColumnData {
  dataKey: keyof Shift;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 120,
    label: "Date",
    dataKey: "date",
  },
  {
    width: 120,
    label: "Shift Start time",
    dataKey: "startTime",
  },
  {
    width: 120,
    label: "Shift End time",
    dataKey: "endTime",
  },
  {
    width: 120,
    label: "employees",
    dataKey: "employeeIds",
  },
];

const VirtuosoTableComponents: TableComponents<Shift> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      <TableCell
        sx={{ width: 30, backgroundColor: "background.paper" }}
        variant="head">
        No.
      </TableCell>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}>
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function ReactVirtualizedTable() {
  const shifts = useSelector((state: RootState) => state.shifts.allShifts);
  const state = store.getState().employees.employees;
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  console.log("shifts", shifts);

  const getAllShifts = () => {
    fetchShifts()
      .then((response) => {
        store.dispatch(getAllShiftsAction(response));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    if (state.length < 1) {
      getAllShifts();
    }
  }, []);

  const extractDateParts = (dateString: string) => {
    const datePart = dateString.split("T")[0];
    const dateObject = new Date(datePart);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // JavaScript month ranges from 0-11, so adding 1 to get 1-12
    const year = dateObject.getFullYear();

    return { day, month, year };
  };

  const employeeIdNameMap: { [key: string]: string } = {};
  employees.forEach((employee: Employee) => {
    employeeIdNameMap[
      employee._id
    ] = `${employee.firstName} ${employee.lastName}`;
  });

  const shiftsWithEmployeeNames = shifts.map((shift) => ({
    ...shift,
    employeeNames: shift.employeeIds.map((id) => employeeIdNameMap[id]),
  }));

  function rowContent(index: number, row: Shift) {
    return (
      <React.Fragment>
        <TableCell>{index + 1}</TableCell>
        {columns.map((column) => {
          let cellContent;
          if (column.dataKey === "employeeIds") {
            cellContent = row.employeeNames.join(", ");
          } else if (column.dataKey === "date") {
            const { day, month, year } = extractDateParts(
              String(row[column.dataKey])
            );
            cellContent = `${day}/${month}/${year}`; // change this to format you want
          } else {
            cellContent = row[column.dataKey];
          }
          return (
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? "right" : "left"}>
              {cellContent}
            </TableCell>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Box sx={{ p: 5 }}>
        <AddShiftFormDialog />
      </Box>
      <Paper style={{ height: 400, width: "70%" }}>
        <TableVirtuoso
          data={shiftsWithEmployeeNames} // Use the new array here
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
}
