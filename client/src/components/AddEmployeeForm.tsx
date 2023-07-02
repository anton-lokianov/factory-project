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
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/Store";
import { fetchAddEmployee } from "../utils/fetchData";
import { addEmployeeAction } from "../redux/EmployeeReducer";

export default function AddEmployeeFormDialog() {
  const departments = useSelector(
    (state: RootState) => state.departments.departments
  );
  const [open, setOpen] = React.useState(false);
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
      const response = await fetchAddEmployee(data);
      store.dispatch(addEmployeeAction(response));
      handleClose();
    } catch (error) {
      console.log(error);
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
        Add Employee
      </Fab>
      <Dialog sx={{ mb: 20 }} open={open} onClose={handleClose}>
        <DialogTitle>Add Employee</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              Add new Employee to the factory
            </DialogContentText>
            <TextField
              {...register("firstName", { required: true })}
              error={errors.firstName ? true : false}
              helperText={errors.firstName && "First Name is required"}
              autoFocus
              margin="dense"
              id="firstName"
              label="First Name"
              type="Text"
              fullWidth
              variant="standard"
            />
            <TextField
              {...register("lastName", { required: true })}
              error={errors.lastName ? true : false}
              helperText={errors.lastName && "Last Name is required"}
              autoFocus
              margin="dense"
              id="lastName"
              label="Last Name"
              type="Text"
              fullWidth
              variant="standard"
            />
            <TextField
              {...register("startWorkYear", { required: true })}
              error={errors.startWorkYear ? true : false}
              helperText={errors.startWorkYear && "Start work year is required"}
              autoFocus
              margin="dense"
              id="startWorkYear"
              label="Start work year"
              type="number"
              fullWidth
              variant="standard"
            />
            <TextField
              sx={{ mt: 2 }}
              {...register("departmentId", { required: true })}
              id="department"
              select
              label="Department"
              fullWidth
              defaultValue=""
              error={errors.departmentId ? true : false}
              helperText={errors.departmentId && "Department is required"}>
              {departments.map((option: any) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
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
