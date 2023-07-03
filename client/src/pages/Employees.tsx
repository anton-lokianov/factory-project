import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Box, IconButton } from "@mui/material";
import { Employee } from "../models/Employee";
import { RootState, store } from "../redux/Store";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddShiftFormDialog from "../components/AddEmployeeForm";
import { Department } from "../models/Department";
import { fetchDeleteEmployee } from "../utils/fetchData";
import { deleteEmployeeAction } from "../redux/EmployeeReducer";
import { AddShiftToEmployeeFormDialog } from "../components/AddShiftToEmployeeForm";

interface ColumnData {
  dataKey: keyof Employee;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 80,
    label: "First Name",
    dataKey: "firstName",
  },
  {
    width: 80,
    label: "Last Name",
    dataKey: "lastName",
  },
  {
    width: 100,
    label: "Department",
    dataKey: "departmentName",
  },
  {
    width: 50,
    label: "Year Started",
    dataKey: "startWorkYear",
  },
];

const VirtuosoTableComponents: TableComponents<Employee> = {
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
      <TableCell
        sx={{ width: 60, backgroundColor: "background.paper" }}
        variant="head">
        Shifts
      </TableCell>
      <TableCell
        sx={{ width: 30, backgroundColor: "background.paper" }}
        variant="head">
        Add shift
      </TableCell>
      <TableCell
        sx={{ width: 30, backgroundColor: "background.paper" }}
        variant="head">
        Edit
      </TableCell>
      <TableCell
        sx={{ width: 30, backgroundColor: "background.paper" }}
        variant="head">
        Delete
      </TableCell>
    </TableRow>
  );
}

export default function ReactVirtualizedTable() {
  const employees = useSelector(
    (state: RootState) => state.employees.employees || []
  );

  const departments = useSelector(
    (state: RootState) => state.departments.departments
  );

  const shifts = useSelector((state: RootState) => state.shifts.allShifts);
  console.log(shifts);

  const deleteEmployee = async (id: string) => {
    try {
      await fetchDeleteEmployee(id);
      store.dispatch(deleteEmployeeAction(id));
    } catch (error) {
      console.log(error);
    }
  };

  const departmentIdNameMap: { [key: string]: string } = {};
  departments.forEach((department: Department) => {
    departmentIdNameMap[department._id] = department.name;
  });

  const employeesWithDepartmentNames = employees.map((employee) => {
    let departmentName;
    if (typeof employee.departmentId === "string") {
      departmentName = departmentIdNameMap[employee.departmentId];
    } else {
      departmentName = (employee.departmentId as any).name;
    }
    return {
      ...employee,
      departmentName,
    };
  });

  const getEmployeeShifts = (employeeId: string) => {
    const employeeShifts = shifts.filter((shift) =>
      shift.employeeIds.includes(employeeId)
    );
    console.log(employeeShifts);
    return employeeShifts
      .map((shift) => {
        const date = new Date(shift.date);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return `${formattedDate}, ${shift.startTime}-${shift.endTime}`;
      })
      .join("; ");
  };

  function rowContent(index: number, row: Employee) {
    return (
      <React.Fragment>
        <TableCell>{index + 1}</TableCell>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? "right" : "left"}>
            {
              row[
                column.dataKey as keyof (Employee & { departmentName: string })
              ]
            }
          </TableCell>
        ))}

        <TableCell>{getEmployeeShifts(row._id)}</TableCell>
        <TableCell>
          <AddShiftToEmployeeFormDialog employeeId={row._id} />
        </TableCell>
        <TableCell>
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => deleteEmployee(row._id)}>
            <DeleteIcon color="warning" />
          </IconButton>
        </TableCell>
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
      <Paper style={{ height: 400, width: "90%" }}>
        <TableVirtuoso
          data={employeesWithDepartmentNames} // Use the new array here
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
}
