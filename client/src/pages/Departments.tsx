import { Box, IconButton } from "@mui/material";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Department } from "../models/Department";
import { RootState, store } from "../redux/Store";
import { useSelector } from "react-redux";
import { fetchDeleteDepartment } from "../utils/fetchData";
import { deleteDepartmentAction } from "../redux/DepartmentReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddDepartmentFormDialog from "../components/AddDepartmentForm";
import EditDepartmentFormDialog from "../components/EditDepartmentForm";
import { Employee } from "../models/Employee";

interface ColumnData {
  dataKey: keyof Department;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 120,
    label: "Department Name",
    dataKey: "name",
  },
  {
    width: 120,
    label: "Manager",
    dataKey: "manager",
  },
  // Add other columns as needed, matching the properties of your department objects
];

const VirtuosoTableComponents: TableComponents<Department> = {
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
        sx={{ width: 40, backgroundColor: "background.paper" }}
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
        sx={{ width: 40, backgroundColor: "background.paper" }}
        variant="head">
        Edit
      </TableCell>
      <TableCell
        sx={{ width: 40, backgroundColor: "background.paper" }}
        variant="head">
        Delete
      </TableCell>
    </TableRow>
  );
}

function rowContent(index: number, row: Department) {
  if (!row) return null;

  const handleDelete = async (id: string) => {
    const response = await fetchDeleteDepartment(id);
    if (!response) return;
    store.dispatch(deleteDepartmentAction(id));
    console.log(id);
  };

  return (
    <React.Fragment>
      <TableCell>{index + 1}</TableCell>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}>
          {row[column.dataKey]}
        </TableCell>
      ))}
      <TableCell>
        <EditDepartmentFormDialog departmentId={row._id} />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => handleDelete(row._id)}>
          <DeleteIcon color="warning" />
        </IconButton>
      </TableCell>
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable() {
  const departments = useSelector(
    (state: RootState) => state.departments.departments
  );

  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );

  const employeeIdNameMap: { [key: string]: string } = {};
  employees.forEach((employee: Employee) => {
    employeeIdNameMap[
      employee._id
    ] = `${employee.firstName} ${employee.lastName}`;
  });

  const departmentsWithManagerNames = departments.map(
    (department: Department) => ({
      ...department,
      manager: Array.isArray(department.manager)
        ? department.manager.map((id) => employeeIdNameMap[id] || "No Manager")
        : [employeeIdNameMap[department.manager] || "No Manager"],
    })
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Box sx={{ p: 5 }}>
        <AddDepartmentFormDialog />
      </Box>
      <Paper style={{ height: 350, width: "60%" }}>
        <TableVirtuoso
          data={departmentsWithManagerNames}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
}
