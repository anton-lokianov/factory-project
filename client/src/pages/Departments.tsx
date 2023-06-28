import { Box, Fab, IconButton } from "@mui/material";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import FormDialog from "../components/AddDepartmenForm";
import { useEffect, useState } from "react";
import { Department } from "../models/Department";
import { RootState, store } from "../redux/Store";
import { useSelector } from "react-redux";
import {
  fetchDeleteDepartment,
  fetchGetAllDepartments,
} from "../utils/fatchData";
import {
  deleteDepartmentAction,
  getAllDepartmentsAction,
} from "../redux/DepartmentReducer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ColumnData {
  dataKey: keyof Department;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 160,
    label: "Department ID",
    dataKey: "_id",
  },
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
        sx={{ width: 50, backgroundColor: "background.paper" }}
        variant="head">
        Edit
      </TableCell>
      <TableCell
        sx={{ width: 50, backgroundColor: "background.paper" }}
        variant="head">
        Delete
      </TableCell>
    </TableRow>
  );
}

function rowContent(index: number, row: Department) {
  if (!row) return null;

  const handleDelete = (id: string) => {
    fetchDeleteDepartment(id);
    store.dispatch(deleteDepartmentAction(id));
    console.log(id);
  };
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}>
          {row[column.dataKey]}
        </TableCell>
      ))}
      <TableCell>
        <IconButton>
          <EditIcon color="primary" />
        </IconButton>
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

  const getDepartments = () => {
    fetchGetAllDepartments()
      .then((response) => {
        store.dispatch(getAllDepartmentsAction(response));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDepartments();
  }, []);

  console.log(departments);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Box sx={{ p: 5 }}>
        <FormDialog />
      </Box>
      <Paper style={{ height: 350, width: "60%" }}>
        <TableVirtuoso
          data={departments}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
}
