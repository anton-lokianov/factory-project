import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Fab, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { fetchAddDepartment } from "../utils/fetchData";
import { RootState, store } from "../redux/Store";
import { addDepartmentAction } from "../redux/DepartmentReducer";
import { useSelector } from "react-redux";

export default function AddDepartmentFormDialog() {
  const [open, setOpen] = React.useState(false);
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetchAddDepartment(data.name, data.manager);
      store.dispatch(addDepartmentAction(response));
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}>
        <AddIcon sx={{ mr: 1 }} />
        Add Department
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Department</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              Add new department to the factory
            </DialogContentText>
            <TextField
              {...register("name", { required: true })}
              error={errors.name ? true : false}
              helperText={errors.name && "Department name is required"}
              autoFocus
              margin="dense"
              id="name"
              label="Department Name"
              type="Text"
              fullWidth
              variant="standard"
            />
            <TextField
              sx={{ mt: 2 }}
              {...register("manager", { required: true })}
              id="manager"
              select
              label="manager"
              fullWidth
              defaultValue=""
              error={errors.employeesIds ? true : false}
              helperText={errors.employeesIds && "Department is required"}>
              {employees.map((option: any) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.firstName} {option.lastName}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button type="reset" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
